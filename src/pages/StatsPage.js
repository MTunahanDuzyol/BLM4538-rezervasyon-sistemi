import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getMyStats } from '../features/stats/api';
import { getAuthUser, isDemoUser, isLoggedIn } from '../services/authSession';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

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

      if (isDemoUser()) {
        const demoStats = getAuthUser()?.demoData?.stats ?? null;
        if (active) {
          setStats(demoStats);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getMyStats();
        if (!active) return;
        const statsData = response?.data ?? null;
        setStats(statsData);
      } catch (requestError) {
        if (!active) return;
        setError(requestError?.response?.data?.message || 'İstatistikler yüklenemedi.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  function pickValue(...candidates) {
    for (const candidate of candidates) {
      if (candidate !== undefined && candidate !== null && candidate !== '') {
        return candidate;
      }
    }
    return '-';
  }

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
        <View style={styles.blockedWrap}>
          <Text style={styles.blockedText}>Lütfen önce oturum açın.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const kullanim = stats?.kullanim || {};
  const ceza = stats?.ceza || {};

  const reservationsTotal = pickValue(
    kullanim?.rezervasyonToplam,
    kullanim?.toplamRezervasyon,
    kullanim?.totalReservations,
    '-'
  );
  const attendanceRate = pickValue(
    kullanim?.katilimOrani,
    kullanim?.attendanceRate,
    kullanim?.participationRate,
    kullanim?.oran,
    formatRate(kullanim?.girisKaydiTamamlanan, kullanim?.rezervasyonToplam)
  );
  const checkInCount = pickValue(
    kullanim?.girisKaydiToplam,
    kullanim?.checkInSayisi,
    kullanim?.checkInCount,
    '-'
  );
  const checkOutCount = pickValue(
    kullanim?.girisKaydiTamamlanan,
    kullanim?.checkOutSayisi,
    kullanim?.checkOutCount,
    '-'
  );
  const activeReservations = pickValue(
    kullanim?.girisKaydiAcik,
    ceza?.aktifRezervasyon,
    ceza?.activeReservations,
    '-'
  );

  return (
    <ScreenContainer title="Benim İstatistiklerim" subtitle="Hesabınıza ait kullanım özetini görün.">
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Özet</Text>
        {loading ? (
          <ActivityIndicator color="#6B998B" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.metricsGrid}>
            <Metric label="Toplam Rezervasyon" value={reservationsTotal} />
            <Metric label="Katılım Oranı" value={attendanceRate} />
            <Metric label="Check-in Sayısı" value={checkInCount} />
            <Metric label="Check-out Sayısı" value={checkOutCount} />
            <Metric label="Aktif Rezervasyon" value={activeReservations} />
          </View>
        )}
      </View>
      <HomeReturnButton />
    </ScreenContainer>
  );
}

function Metric({ label, value }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{String(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  blockedWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  blockedText: { fontSize: 16, color: '#334155' },
  card: {
    borderWidth: 1,
    borderColor: '#d4dde3',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  cardLabel: { color: '#64748b', fontWeight: '600', marginBottom: 12 },
  errorText: { color: '#b91c1c' },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  metricLabel: { color: '#64748b', fontSize: 12, marginBottom: 8 },
  metricValue: { color: '#0f172a', fontSize: 18, fontWeight: '700' },
});
