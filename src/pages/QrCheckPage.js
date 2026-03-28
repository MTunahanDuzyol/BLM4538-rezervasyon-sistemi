import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';

export function QrCheckPage({ navigation }) {
  return (
    <ScreenContainer title="QR Doğrulama" subtitle="Check-in / Check-out ve mobil geçiş seçenekleri.">
      <View style={styles.wrap}>
        <Pressable style={styles.button} onPress={() => navigation.navigate('CheckIn')}>
          <Text style={styles.buttonText}>QR ile Check-in</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.orange]} onPress={() => navigation.navigate('CheckOut')}>
          <Text style={styles.buttonText}>QR ile Check-out</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.dark]} onPress={() => navigation.navigate('MobilePass')}>
          <Text style={styles.buttonText}>Mobil Geçiş QR</Text>
        </Pressable>
      </View>
      <HomeReturnButton />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  button: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#0f766e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orange: {
    backgroundColor: '#c2410c',
  },
  dark: {
    backgroundColor: '#334155',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
