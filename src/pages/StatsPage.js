import { Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

export function StatsPage() {
  return (
    <ScreenContainer title="Benim İstatistiklerim" subtitle="Yakın zamanda hizmete girecektir.">
      <View>
        <Text>Toplam Rezervasyon: -</Text>
        <Text>Katılım Oranı: -</Text>
      </View>
      <HomeReturnButton />
    </ScreenContainer>
  );
}
