import { Button, Text } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

export function QrCheckPage() {
  return (
    <ScreenContainer title="QR Doğrulama" subtitle="Yakın zamanda hizmete girecektir.">
      <Text>QR tarayıcı yakın zamanda etkinleştirilecektir.</Text>
      <Button title="Tarayıcıyı Başlat" onPress={() => {}} />
      <HomeReturnButton />
    </ScreenContainer>
  );
}
