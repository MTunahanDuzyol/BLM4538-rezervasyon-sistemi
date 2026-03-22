import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Providers } from './providers';
import { RootNavigator } from '../routes/RootNavigator';

export default function MainApp() {
  return (
    <Providers>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </Providers>
  );
}
