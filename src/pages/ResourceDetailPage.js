import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getAvailability } from '../features/resources/api';

export function ResourceDetailPage({ route }) {
  const resourceId = String(route?.params?.resourceId || '');
  const resourceName = route?.params?.resourceName || 'Kaynak';
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dateParam = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadAvailability() {
      try {
        setLoading(true);
        setError('');

        if (!resourceId) {
          throw new Error('Kaynak bilgisi eksik.');
        }

        const response = await getAvailability(resourceId, dateParam);
        const payload = Array.isArray(response?.data) ? response.data : [];
        const normalized = payload.map((item, index) => ({
          id: String(item?.id ?? item?.Id ?? index + 1),
          startTime: String(item?.baslangicZamani ?? item?.BaslangicZamani ?? item?.startTime ?? item?.StartTime ?? '-'),
          endTime: String(item?.bitisZamani ?? item?.BitisZamani ?? item?.endTime ?? item?.EndTime ?? '-'),
          isAvailable: (item?.uygunMu ?? item?.UygunMu ?? item?.isAvailable) === true,
        }));

        if (!mounted) return;
        setSlots(normalized);
      } catch (err) {
        if (!mounted) return;
        setError('Kaynak detay bilgisi alinamadi.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAvailability();

    return () => {
      mounted = false;
    };
  }, [dateParam, resourceId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{resourceName}</Text>
        <Text style={styles.subtitle}>Bugun icin uygunluk detaylari</Text>

        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator color="#6B998B" />
            <Text style={styles.infoText}>Detaylar yukleniyor...</Text>
          </View>
        ) : null}

        {!loading && error ? (
          <View style={styles.centerWrap}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!loading && !error ? (
          <FlatList
            data={slots}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.infoText}>Bu kaynak icin uygunluk kaydi bulunamadi.</Text>}
            renderItem={({ item }) => (
              <View style={styles.slotCard}>
                <View>
                  <Text style={styles.slotTitle}>{item.startTime} - {item.endTime}</Text>
                  <Text style={styles.slotMeta}>Saat araligi</Text>
                </View>
                <Text style={[styles.badge, item.isAvailable ? styles.badgeAvailable : styles.badgeBusy]}>
                  {item.isAvailable ? 'Uygun' : 'Dolu'}
                </Text>
              </View>
            )}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    color: '#475569',
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  infoText: {
    color: '#334155',
  },
  errorText: {
    color: '#b91c1c',
    textAlign: 'center',
  },
  slotCard: {
    borderWidth: 1,
    borderColor: '#d5dce2',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  slotMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  badgeAvailable: {
    color: '#065f46',
    backgroundColor: '#d1fae5',
  },
  badgeBusy: {
    color: '#991b1b',
    backgroundColor: '#fee2e2',
  },
});
