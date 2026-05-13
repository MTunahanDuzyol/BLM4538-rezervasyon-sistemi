import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getMyPenaltyScore, getMyViolations } from '../features/penalty/api';
import { getAuthUser, isDemoUser, isLoggedIn } from '../services/authSession';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';
import { cardStyles, textStyles, stateStyles, alertStyles } from '../utils/components';

/**
 * PenaltyPage - Ceza Puanı ve İhlal Kaydı Sayfası
 * 
 * Gösterir:
 * - Mevcut ceza puanı
 * - İhlal listesi
 * - İhlal detayları (tarih, açıklama, puan)
 */
export function PenaltyPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(null);
  const [violations, setViolations] = useState([]);

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
          const demoPenalty = getAuthUser()?.demoData?.penalty ?? null;
          if (active) {
            setScore(demoPenalty?.score ?? 0);
            setViolations(demoPenalty?.violations ?? []);
            setLoading(false);
          }
          return;
        }

        // Real API çağrısı
        const [scoreResponse, violationsResponse] = await Promise.all([
          getMyPenaltyScore(),
          getMyViolations(),
        ]);

        if (!active) return;

        // Puan değerini normalize et
        const scoreData = scoreResponse?.data;
        let parsedScore = 0;

        if (typeof scoreData === 'number') {
          parsedScore = scoreData;
        } else if (typeof scoreData === 'string') {
          parsedScore = parseInt(scoreData, 10) || 0;
        } else if (typeof scoreData === 'object' && scoreData !== null) {
          parsedScore = 
            scoreData?.puan ?? 
            scoreData?.score ?? 
            scoreData?.mevcutPuan ?? 
            scoreData?.currentScore ?? 
            0;
        }

        // İhlal listesini normalize et
        const violationData = violationsResponse?.data;
        let parsedViolations = [];

        if (Array.isArray(violationData)) {
          parsedViolations = violationData;
        } else if (violationData && typeof violationData === 'object') {
          if (Array.isArray(violationData.items)) {
            parsedViolations = violationData.items;
          } else if (Array.isArray(violationData.data)) {
            parsedViolations = violationData.data;
          } else if (Array.isArray(violationData.violations)) {
            parsedViolations = violationData.violations;
          } else if (Array.isArray(violationData.ihlaller)) {
            parsedViolations = violationData.ihlaller;
          } else {
            // Tek bir obje ise array'e dönüştür
            parsedViolations = [violationData];
          }
        }

        setScore(parsedScore);
        setViolations(parsedViolations);
      } catch (requestError) {
        if (!active) return;
        let errorMsg = 'Ceza ve ihlâl bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin.';
        
        if (typeof requestError?.response?.data?.message === 'string') {
          errorMsg = requestError.response.data.message;
        } else if (typeof requestError?.message === 'string') {
          errorMsg = requestError.message;
        }
        
        setError(String(errorMsg));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  /**
   * Değeri safe string'e çevir, nested objeleri handle et
   */
  function safeString(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'object') {
      // Obje ise, ad/name/adı gibi temel alanları ara
      const keys = ['ad', 'name', 'adı', 'baslik', 'title'];
      for (const key of keys) {
        if (value[key]) return String(value[key]);
      }
      // Hiç uygun alan yoksa ilk değeri al
      const firstValue = Object.values(value)[0];
      if (firstValue != null) return safeString(firstValue);
      return '';
    }
    return '';
  }

  /**
   * İhlal objesini standartlaştırıp kullanıcı dostu metne dönüştür
   */
  function formatViolation(item) {
    if (item == null) return { title: 'İhlal kaydı', details: '' };

    if (typeof item === 'string') {
      return { title: item, details: '' };
    }

    if (typeof item === 'number') {
      return { title: String(item), details: '' };
    }

    // Başlık: Tüm olası alanları deneyelim
    let title = safeString(item?.tipAdi) || 
                safeString(item?.ihlalTipi) || 
                safeString(item?.tip) || 
                safeString(item?.ad) || 
                safeString(item?.name);
    
    let description = item?.aciklama || item?.metin || item?.detay || item?.message || item?.description || '';
    if (typeof description !== 'string') {
      description = String(description || '');
    }

    // Eğer title yoksa, description'dan ilk satırı çıkar
    if (!title && description) {
      const firstLine = description.split('\n')[0];
      title = firstLine;
      // Description'dan ilk satırı kaldır, kalan kısmı details'e koy
      const remainingLines = description.split('\n').slice(1).join('\n').trim();
      description = remainingLines;
    }

    title = String(title || 'İhlal');

    const scoreValue = item?.puan ?? item?.score ?? item?.ihlalPuani ?? item?.points;
    const createdAt = item?.tarih || item?.olusturmaTarihi || item?.createdAt || item?.date;

    const details = [];
    if (description) details.push(String(description));
    if (scoreValue !== undefined && scoreValue !== null) details.push(`Puan: ${String(scoreValue)}`);
    if (createdAt) details.push(`Tarih: ${String(createdAt)}`);

    return {
      title: String(title),
      details: String(details.join('\n')),
    };
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

  const hasViolations = Array.isArray(violations) && violations.length > 0;
  const showScoreAlert = score && score > 20; // 20+ puan uyarı

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ceza ve İhlaller</Text>
        <Text style={styles.headerSubtitle}>Hesabınıza ait ihlâl ve ceza puanı bilgileri</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Puan Kartı */}
        <View style={[cardStyles.card, { marginBottom: SPACING.lg }]}>
          <Text style={styles.cardLabel}>Mevcut Ceza Puanı</Text>
          {loading ? (
            <View style={stateStyles.stateContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <>
              <Text style={styles.scoreValue}>{score ?? 0}</Text>
              {showScoreAlert && (
                <View style={[alertStyles.alertWarning, { marginTop: SPACING.md }]}>
                  <Text style={[alertStyles.alertText, alertStyles.alertWarningText]}>
                  Yüksek ceza puanı - kuralları lütfen dikkate alın
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* İhlaller Kartı */}
        <View style={[cardStyles.card, { marginBottom: SPACING.lg }]}>
          <Text style={styles.cardLabel}>İhlal Kayıtları</Text>

          {loading ? (
            <View style={stateStyles.stateContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={stateStyles.loadingText}>İhlal kayıtları yükleniyor...</Text>
            </View>
          ) : error ? (
            <View style={[alertStyles.alertError, { marginTop: SPACING.md }]}>
              <Text style={[alertStyles.alertText, alertStyles.alertErrorText]}>
                {String(error)}
              </Text>
            </View>
          ) : hasViolations ? (
            <>
              {Array.isArray(violations) && violations.map((item, index) => {
                const violation = formatViolation(item);
                return (
                  <View key={String(item?.id ?? item?.ihlalId ?? item?.violationId ?? index)}>
                    <View style={styles.violationItem}>
                      <Text style={styles.violationTitle}>{String(violation.title)}</Text>
                      {violation.details && (
                        <Text style={styles.violationDetails}>{String(violation.details)}</Text>
                      )}
                    </View>
                    {index < violations.length - 1 && <View style={styles.separator} />}
                  </View>
                );
              })}
              <View style={styles.footerNote}>
                <Text style={textStyles.bodySmall}>
                  İhlal kayıtlarınızı dikkate alarak kütüphane kurallarına uyunuz.
                </Text>
              </View>
            </>
          ) : (
            <View style={stateStyles.stateContainer}>
              <Text style={textStyles.body}>Henüz kayıtlı ihlal bulunmuyor.</Text>
            </View>
          )}
        </View>

        <HomeReturnButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  header: {
    height: 'auto',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  cardLabel: { 
    color: COLORS.textSecondary, 
    fontWeight: TYPOGRAPHY.weight.semibold,
    fontSize: TYPOGRAPHY.size.sm,
    marginBottom: SPACING.md 
  },
  scoreValue: { 
    fontSize: 48, 
    fontWeight: TYPOGRAPHY.weight.bold, 
    color: COLORS.primary,
    marginVertical: SPACING.md,
  },
  violationItem: { 
    paddingVertical: SPACING.md,
  },
  violationTitle: { 
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold, 
    color: COLORS.text,
  },
  violationDetails: { 
    marginTop: SPACING.sm, 
    color: COLORS.textSecondary, 
    fontSize: TYPOGRAPHY.size.sm,
    lineHeight: 20 
  },
  separator: { 
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  footerNote: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.slate50,
    borderRadius: BORDER_RADIUS.md,
  },
});
