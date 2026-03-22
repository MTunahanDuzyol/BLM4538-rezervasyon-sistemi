import { Button, StyleSheet, Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

export function ReservationCreatePage() {
  return (
    <ScreenContainer title="Rezervasyon Oluştur" subtitle="Yakın zamanda hizmete girecektir.">
      <View style={styles.ruleBox}>
        <Text style={styles.rule}>- Slot süresi: 60 dakika</Text>
        <Text style={styles.rule}>- Günlük maksimum: 4 ardışık slot</Text>
        <Text style={styles.rule}>- Aynı anda sadece 1 aktif rezervasyon</Text>
      </View>
      <Button title="Slot Seç" onPress={() => {}} />
      <HomeReturnButton />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  ruleBox: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  rule: {
    marginBottom: 6,
    color: '#334155',
  },
});
