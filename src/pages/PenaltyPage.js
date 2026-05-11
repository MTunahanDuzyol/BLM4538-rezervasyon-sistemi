import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getMyPenaltyScore, getMyViolations } from '../features/penalty/api';
import { getAuthUser, isDemoUser, isLoggedIn } from '../services/authSession';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

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

      if (isDemoUser()) {
        const demoPenalty = getAuthUser()?.demoData?.penalty ?? null;
        if (active) {
          setScore(demoPenalty?.score ?? null);
          setViolations(demoPenalty?.violations ?? []);
          setLoading(false);
        }
        return;
      }

      try {
        const [scoreResponse, violationsResponse] = await Promise.all([
          getMyPenaltyScore(),
          getMyViolations(),
        ]);

        if (!active) return;

        const scoreData = scoreResponse?.data;
        let parsedScore = null;

        if (typeof scoreData === 'number' || typeof scoreData === 'string') {
          parsedScore = scoreData;
        } else if (typeof scoreData === 'object' && scoreData !== null) {
          parsedScore = scoreData?.puan ?? scoreData?.score ?? scoreData?.mevcutPuan ?? scoreData?.currentScore ?? scoreData?.data?.puan ?? null;
        }

        const violationData = violationsResponse?.data;
        let parsedViolations = [];

        if (Array.isArray(violationData)) {
          parsedViolations = violationData;
        } else if (violationData && typeof violationData === 'object') {
          if (Array.isArray(violationData.items)) parsedViolations = violationData.items;
          else if (Array.isArray(violationData.data)) parsedViolations = violationData.data;
          else if (Array.isArray(violationData.violations)) parsedViolations = violationData.violations;
          else if (Array.isArray(violationData.ihlaller)) parsedViolations = violationData.ihlaller;
        }

        setScore(parsedScore);
        setViolations(parsedViolations);
      } catch (requestError) {
        if (!active) return;
        setError(requestError?.response?.data?.message || 'Ceza ve ihlâl bilgileri yüklenemedi.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  function formatViolation(item) {
    if (item == null) return 'İhlal kaydı';

    if (typeof item === 'string' || typeof item === 'number') {
      return { title: String(item), details: '', raw: '' };
    }

    const title = item.tipAdi || item.ihlalTipi || item.tip || item.ad || item.name || 'İhlal';
    const description = item.aciklama || item.metin || item.detay || item.message || '';
    const scoreValue = item.puan ?? item.score ?? item.ihlalPuani ?? item.points;
    const createdAt = item.tarih || item.olusturmaTarihi || item.createdAt || item.date;

    const details = [];
    if (description) details.push(description);
    if (scoreValue !== undefined && scoreValue !== null) details.push(`Puan: ${scoreValue}`);
    if (createdAt) details.push(`Tarih: ${createdAt}`);

    return {
      title,
      details: details.join('\n'),
      raw: JSON.stringify(item),
    };
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

  const hasViolations = Array.isArray(violations) && violations.length > 0;

  return (
    <ScreenContainer title="Ceza ve İhlaller" subtitle="Hesabınıza ait ihlâl ve ceza puanı bilgileri">
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Mevcut Puan</Text>
        {loading ? (
          <ActivityIndicator color="#6B998B" />
        ) : (
          <Text style={styles.scoreValue}>{score ?? '-'}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>İhlaller</Text>
        {loading ? (
          <ActivityIndicator color="#6B998B" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : hasViolations ? (
          <FlatList
            data={violations}
            keyExtractor={(item, index) => String(item?.id ?? item?.ihlalId ?? item?.violationId ?? index)}
            renderItem={({ item }) => {
              const violation = formatViolation(item);
              return (
                <View style={styles.violationItem}>
                  <Text style={styles.violationTitle}>{violation.title}</Text>
                  {violation.details ? <Text style={styles.violationDetails}>{violation.details}</Text> : null}
                  {!violation.details ? <Text style={styles.violationDetails}>{violation.raw}</Text> : null}
                </View>
              );
            }}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <Text style={styles.emptyText}>Henüz kayıtlı ihlal bulunmuyor.</Text>
        )}
      </View>

      <HomeReturnButton />
    </ScreenContainer>
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
  cardLabel: { color: '#64748b', fontWeight: '600', marginBottom: 8 },
  scoreValue: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  emptyText: { color: '#475569' },
  errorText: { color: '#b91c1c' },
  violationItem: { paddingVertical: 4 },
  violationTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  violationDetails: { marginTop: 4, color: '#334155', lineHeight: 20 },
  separator: { height: 12 },
});
