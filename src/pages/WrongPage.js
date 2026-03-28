import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export function WrongPage({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Wrong Page</Text>
        <Text style={styles.message}>This is the end point of our prototype.{`\n`}Don’t worry,{`\n`}but you're at the wrong page.</Text>
        <Pressable style={styles.button} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}>
          <Text style={styles.buttonText}>Back to Main</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  message: { textAlign: 'center', color: '#334155', marginBottom: 18 },
  button: { backgroundColor: '#6B998B', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
