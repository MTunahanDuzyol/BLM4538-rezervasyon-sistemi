import { Text } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

export function AdminPage() {
  return (
    <ScreenContainer title="Yönetici" subtitle="Yakın zamanda hizmete girecektir.">
      <Text>Yönetici işlevleri yakın zamanda hizmete girecektir.</Text>
      <HomeReturnButton />
    </ScreenContainer>
  );
}
