import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getActiveAnnouncements } from '../features/announcements/api';

function AnnouncementCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardBody}>{item.description || 'Detay metni yakinda eklenecektir.'}</Text>
    </View>
  );
}

export function AnnouncementsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadAnnouncements = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const response = await getActiveAnnouncements();
      const payload = Array.isArray(response?.data) ? response.data : [];
      const normalized = payload.map((item, index) => ({
        id: String(item?.id ?? item?.Id ?? index + 1),
        title: String(item?.baslik ?? item?.Baslik ?? item?.title ?? item?.Title ?? 'Duyuru'),
        description: String(item?.icerik ?? item?.Icerik ?? item?.aciklama ?? item?.Aciklama ?? item?.description ?? item?.Description ?? ''),
      }));

      setItems(normalized);
    } catch (err) {
      const serverMessage = err?.response?.data?.error || err?.response?.data?.message;
      setError(serverMessage || 'Duyurular yuklenemedi. Lutfen tekrar deneyin.');
      console.log('[AnnouncementsPage] Announcements load failed', {
        status: err?.response?.status,
        message: err?.message,
        response: err?.response?.data,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Duyurular</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator color="#6B998B" />
            <Text style={styles.infoText}>Duyurular yukleniyor...</Text>
          </View>
        ) : null}

        {!loading && error ? (
          <View style={styles.centerWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => loadAnnouncements()}>
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </Pressable>
          </View>
        ) : null}

        {!loading && !error ? (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            onRefresh={() => loadAnnouncements(true)}
            refreshing={refreshing}
            ListEmptyComponent={<Text style={styles.infoText}>Aktif duyuru bulunmamaktadir.</Text>}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <AnnouncementCard item={item} />}
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
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#dbe4df',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#d5dce2',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardBody: {
    color: '#334155',
    lineHeight: 20,
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
