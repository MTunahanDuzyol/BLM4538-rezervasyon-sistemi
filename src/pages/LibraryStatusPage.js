import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export function LibraryStatusPage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kütüphane Durumu</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Kütüphane Bilgilendirme Ekranı</Text>
          <Text style={styles.body}>
            Bu alanda kütüphanenin doluluk, açık alanlar ve genel kullanım durumu gösterilecektir.
          </Text>
          <Text style={styles.note}>İçerik ilerleyen süreçte eklenecektir.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#dbe4df',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  content: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#d5dce2',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#0f766e',
    fontWeight: '600',
  },
});
