import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { getMyReservations } from '../features/reservations/api';

function formatReservationText(item) {
  const areaName = item?.alanAdi || item?.kaynakAdi || item?.alanId || 'Alan';
  const date = item?.tarih || item?.date || '-';
  const start = item?.baslangicSaati || item?.startTime || '-';
  const end = item?.bitisSaati || item?.endTime || '-';
  return `${areaName} | ${date} | ${start} - ${end}`;
}

export function MyReservationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadReservations = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');
      const response = await getMyReservations();
      const payload = Array.isArray(response?.data) ? response.data : [];
      setItems(payload);
    } catch (err) {
      const serverMessage = err?.response?.data?.error || err?.response?.data?.message;
      setError(serverMessage || 'Rezervasyonlar yuklenemedi. Lutfen tekrar deneyin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return (
    <ScreenContainer title="Benim Rezervasyonlarım" subtitle="Rezervasyon saatleri yerel zamanla gosterilir.">
      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator color="#6B998B" />
          <Text style={styles.infoText}>Rezervasyonlar yukleniyor...</Text>
        </View>
      ) : null}

      {!loading && error ? (
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => loadReservations()}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error ? (
        <FlatList
          data={items}
          keyExtractor={(item, index) => String(item?.id ?? index + 1)}
          onRefresh={() => loadReservations(true)}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.text}>{formatReservationText(item)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.infoText}>Aktif rezervasyon bulunmamaktadir.</Text>}
          ListFooterComponent={<HomeReturnButton />}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  text: {
    color: '#0f172a',
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  infoText: {
    textAlign: 'center',
    color: '#334155',
  },
  errorText: {
    textAlign: 'center',
    color: '#b91c1c',
    fontWeight: '600',
  },
  retryButton: {
    borderRadius: 10,
    backgroundColor: '#6B998B',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
