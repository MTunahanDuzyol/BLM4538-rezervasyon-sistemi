import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { getResources } from '../features/resources/api';

export function ResourceListPage({ navigation }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadResources() {
      try {
        setLoading(true);
        setError('');

        const response = await getResources();
        const payload = Array.isArray(response?.data) ? response.data : [];
        const normalized = payload.map((item, index) => ({
          id: String(item?.id ?? item?.Id ?? item?.alanId ?? item?.AlanId ?? index + 1),
          name: String(item?.ad ?? item?.Ad ?? item?.adi ?? item?.Adi ?? item?.name ?? item?.Name ?? `Kaynak ${index + 1}`),
          floor: String(item?.kat ?? item?.Kat ?? '-'),
          capacity: String(item?.kapasite ?? item?.Kapasite ?? '-'),
        }));

        if (!active) return;
        setResources(normalized);
      } catch (err) {
        if (!active) return;
        setError('Alanlar yuklenemedi. Lutfen tekrar deneyin.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadResources();
    return () => {
      active = false;
    };
  }, []);

  function handleOpenDetail(item) {
    navigation.getParent()?.navigate('ResourceDetail', {
      resourceId: item.id,
      resourceName: item.name,
    });
  }

  return (
    <ScreenContainer title="Alanlar" subtitle="Aktif alanlar ve detay bilgileri">
      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator color="#6B998B" />
          <Text style={styles.infoText}>Alanlar yukleniyor...</Text>
        </View>
      ) : null}

      {!loading && error ? (
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {!loading && !error ? (
        <FlatList
          data={resources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.item} onPress={() => handleOpenDetail(item)}>
              <View style={styles.rowBetween}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.linkText}>Detay</Text>
              </View>
              <Text style={styles.metaText}>Kat: {item.floor} | Kapasite: {item.capacity}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.infoText}>Gosterilecek kaynak bulunamadi.</Text>}
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f766e',
  },
  metaText: {
    fontSize: 13,
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
});
