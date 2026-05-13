import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';

/**
 * HomeReturnButton - Ana Sayfaya Dönüş Düğmesi
 * 
 * Özellikler:
 * - Mevcut navigation state'ini kontrol eder
 * - Gerekirse tab navigation üzerinde ana sayfaya gider
 * 
 * Kullanım:
 * <HomeReturnButton />
 */
export function HomeReturnButton() {
  const navigation = useNavigation();

  function goHome() {
    const currentState = navigation.getState();
    const hasHomeInCurrent = currentState?.routeNames?.includes('Home');

    if (hasHomeInCurrent) {
      navigation.navigate('Home');
      return;
    }

    const hasMainInCurrent = currentState?.routeNames?.includes('Main');
    if (hasMainInCurrent) {
      navigation.navigate('Main', { screen: 'Home' });
      return;
    }

    const parent = navigation.getParent();
    if (parent && typeof parent.navigate === 'function') {
      const parentState = parent.getState();
      const hasHomeInParent = parentState?.routeNames?.includes('Home');
      const hasMainInParent = parentState?.routeNames?.includes('Main');

      if (hasHomeInParent) {
        parent.navigate('Home');
        return;
      }

      if (hasMainInParent) {
        parent.navigate('Main', { screen: 'Home' });
        return;
      }
    }

    // Fallback: Ana navigasyon stack'ine dön
    navigation.replace('Main', { screen: 'Home' });
  }

  return (
    <Pressable style={styles.button} onPress={goHome}>
      <Text style={styles.text}>← Ana Sayfaya Dön</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.slate50,
  },
  text: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weight.bold,
    fontSize: TYPOGRAPHY.size.sm,
  },
});
