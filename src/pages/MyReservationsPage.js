import { FlatList, StyleSheet, Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

const mockReservations = [
  { id: 'r1', text: 'Alan A - 10:00 ile 11:00' },
  { id: 'r2', text: 'Oda B - 11:00 ile 12:00' },
];

export function MyReservationsPage() {
  return (
    <ScreenContainer title="Benim Rezervasyonlarım" subtitle="Yakın zamanda hizmete girecektir.">
      <FlatList
        data={mockReservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.text}</Text>
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
    color: '#0f172a',
  },
});
