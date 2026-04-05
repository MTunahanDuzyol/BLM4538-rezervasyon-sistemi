import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { isLoggedIn } from '../services/authSession';

function MenuItem({ title, onPress }) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Text style={styles.itemText}>{title}</Text>
      <Text style={styles.chevron}>{'>'}</Text>
    </Pressable>
  );
}

export function MenuPage({ navigation }) {
  if (!isLoggedIn()) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.blockedWrap}>
          <Text style={styles.blockedText}>Lütfen önce oturum açın.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bütün Menüler</Text>
      </View>
      <View style={styles.content}>
        <MenuItem title="Koltuk Rezervasyonu" onPress={() => navigation.navigate('ReservationForm')} />
        <MenuItem title="QR ile Giriş" onPress={() => navigation.navigate('MobilePass')} />
        <MenuItem title="Duyurular" onPress={() => navigation.navigate('Announcements')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#dbe4df',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  content: { padding: 16, gap: 8 },
  item: {
    borderWidth: 1,
    borderColor: '#d4dde3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: { color: '#0f172a', fontSize: 15, fontWeight: '500' },
  chevron: { color: '#64748b', fontSize: 18, fontWeight: '700' },
  blockedWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  blockedText: { fontSize: 16, color: '#334155' },
});
