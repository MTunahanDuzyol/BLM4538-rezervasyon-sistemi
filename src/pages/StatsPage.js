import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getMyStats } from '../features/stats/api';
import { getAuthUser, isDemoUser, isLoggedIn } from '../services/authSession';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';
import { cardStyles, textStyles, stateStyles, alertStyles } from '../utils/components';

/**
 * StatsPage - Kullanıcı İstatistikleri Sayfası
 * 
 * Gösterir:
 * - Toplam rezervasyon sayısı
 * - Katılım oranı
 * - Check-in / Check-out sayıları
 * - Aktif rezervasyonlar
 */
export function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;

    if (!isLoggedIn()) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    (async () => {
      setLoading(true);
      setError('');

      try {
        // Demo modu kontrol
        if (isDemoUser()) {
          const demoStats = getAuthUser()?.demoData?.stats ?? null;
          if (active) {
            setStats(demoStats);
            setLoading(false);
          }
          return;
        }

        // Real API çağrısı
        const response = await getMyStats();
        if (!active) return;

        const statsData = response?.data ?? null;
        setStats(statsData);
      } catch (requestError) {
        if (!active) return;
        const errorMsg = requestError?.response?.data?.message ||
                        requestError?.message ||
                        'İstatistikler yüklenemedi. Lütfen daha sonra tekrar deneyin.';
        setError(errorMsg);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  /**
   * Değeri aday listeden güvenli şekilde al
   */
  function pickValue(...candidates) {
    for (const candidate of candidates) {
      if (candidate !== undefined && candidate !== null && candidate !== '') {
        return candidate;
      }
    }
    return '-';
  }

  /**
   * Oran hesapla (numerator / denominator * 100)
   */
  function formatRate(numerator, denominator) {
    const total = Number(denominator);
    const part = Number(numerator);

    if (!Number.isFinite(total) || !Number.isFinite(part) || total <= 0) {
      return '-';
    }

    return `${Math.round((part / total) * 100)}%`;
  }

  if (!isLoggedIn()) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={stateStyles.stateContainer}>
          <Text style={textStyles.body}>Lütfen önce oturum açın.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // İstatistikleri normalize et
  const kullanim = stats?.kullanim || {};
  const ceza = stats?.ceza || {};

  const reservationsTotal = pickValue(
    kullanim?.rezervasyonToplam,
    kullanim?.toplamRezervasyon,
    kullanim?.totalReservations,
    0
  );
  
  const attendanceRate = pickValue(
    kullanim?.katilimOrani,
    kullanim?.attendanceRate,
    kullanim?.participationRate,
    formatRate(kullanim?.girisKaydiTamamlanan, kullanim?.rezervasyonToplam)
  );
  
  const checkInCount = pickValue(
    kullanim?.girisKaydiToplam,
    kullanim?.checkInSayisi,
    kullanim?.checkInCount,
    0
  );
  
  const checkOutCount = pickValue(
    kullanim?.girisKaydiTamamlanan,
    kullanim?.checkOutSayisi,
    kullanim?.checkOutCount,
    0
  );
  
  const activeReservations = pickValue(
    kullanim?.girisKaydiAcik,
    ceza?.aktifRezervasyon,
    ceza?.activeReservations,
    0
  );

  return (
    <ScreenContainer 
      title="Benim İstatistiklerim" 
      subtitle="Hesabınıza ait kullanım özetini görün."
    >
      {loading ? (
        <View style={stateStyles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={stateStyles.loadingText}>İstatistikler yükleniyor...</Text>
        </View>
      ) : error ? (
        <>
          <View style={alertStyles.alertError}>
            <Text style={[alertStyles.alertText, alertStyles.alertErrorText]}>
              {error}
            </Text>
          </View>
          <View style={[cardStyles.card, { marginTop: SPACING.md }]}>
            <Text style={textStyles.bodySmall}>
              İstatistikler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
            </Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.sectionLabel}>Özet</Text>
          <View style={styles.metricsGrid}>
            <Metric 
              label="Toplam Rezervasyon" 
              value={String(reservationsTotal)} 
              icon=""
            />
            <Metric 
              label="Katılım Oranı" 
              value={String(attendanceRate)} 
              icon=""
            />
            <Metric 
              label="Check-in Sayısı" 
              value={String(checkInCount)} 
              icon=""
            />
            <Metric 
              label="Check-out Sayısı" 
              value={String(checkOutCount)} 
              icon=""
            />
            <Metric 
              label="Aktif Rezervasyon" 
              value={String(activeReservations)} 
              icon=""
              highlight={activeReservations > 0}
            />
          </View>

          {activeReservations > 0 && (
            <View style={[alertStyles.alertInfo, { marginTop: SPACING.lg }]}>
              <Text style={[alertStyles.alertText]}>
                Şu an {activeReservations} adet devam eden rezervasyonunuz bulunmaktadır.
              </Text>
            </View>
          )}
        </>
      )}

      <HomeReturnButton />
    </ScreenContainer>
  );
}

/**
 * Metric Kartı Bileşeni
 */
function Metric({ label, value, icon = '', highlight = false }) {
  return (
    <View style={[
      styles.metricBox,
      highlight && styles.metricBoxHighlight
    ]}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[
        styles.metricValue,
        highlight && styles.metricValueHighlight
      ]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  metricBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  metricBoxHighlight: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.slate50,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  metricLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  metricValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.size['2xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  metricValueHighlight: {
    color: COLORS.primary,
  },
});
