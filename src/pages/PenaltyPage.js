import { Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

export function PenaltyPage() {
  return (
    <ScreenContainer title="Ceza ve İhlaller" subtitle="Yakın zamanda hizmete girecektir.">
      <View>
        <Text>Mevcut Puan: -</Text>
        <Text>İhlaller: Henüz veri yok</Text>
      </View>
      <HomeReturnButton />
    </ScreenContainer>
  );
}
