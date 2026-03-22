import { FlatList, StyleSheet, Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

const mockResources = [
  { id: '1', name: 'Sessiz Çalışma Alanı A' },
  { id: '2', name: 'Grup Çalışma Odası B' },
  { id: '3', name: 'Grup Çalışma Odası C' },
];

export function ResourceListPage() {
  return (
    <ScreenContainer title="Alanlar" subtitle="Aktif alanlar - Yakın zamanda hizmete girecektir.">
      <FlatList
        data={mockResources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        )}
        ListFooterComponent={<HomeReturnButton />}
      />
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
    fontSize: 15,
    color: '#0f172a',
  },
});
