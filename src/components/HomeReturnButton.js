import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
      }
    }
  }

  return (
    <Pressable style={styles.button} onPress={goHome}>
      <Text style={styles.text}>Ana Sayfaya Don</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#6B998B',
    borderRadius: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fffd',
  },
  text: {
    color: '#14532d',
    fontWeight: '700',
  },
});
