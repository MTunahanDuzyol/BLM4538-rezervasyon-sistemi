import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { clearAuthUser, getAuthUser, isLoggedIn } from '../services/authSession';
import { logout } from '../features/auth/api';

function Tile({ title, onPress, danger }) {
  return (
    <Pressable style={[styles.tile, danger && styles.tileDanger]} onPress={onPress}>
      <Text style={[styles.tileText, danger && styles.tileTextDanger]}>{title}</Text>
      <Text style={[styles.chevron, danger && styles.tileTextDanger]}>{'>'}</Text>
    </Pressable>
  );
}

export function MyPage({ navigation }) {
  if (!isLoggedIn()) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.blockedWrap}>
          <Text style={styles.blockedText}>Lütfen önce oturum açın.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const user = getAuthUser() || {};
  const displayName = user.adSoyad || user.email || 'Kullanıcı';
  const subtitle = user.email || '';

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      // ignore logout request errors and continue local session cleanup
    }
    clearAuthUser();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.headerTitle}>Benim Sayfam</Text></View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.name}>{displayName}</Text>
          {subtitle ? <Text style={styles.email}>{subtitle}</Text> : null}
        </View>

        <Tile title="Koltuk Rezervasyon Bilgisi" onPress={() => navigation.navigate('MyReservationsDetail')} />
        <Tile title="Kullanıcı İstatistikleri" onPress={() => navigation.navigate('StatsDetail')} />
        <Tile title="Profil" onPress={() => navigation.navigate('Profile')} />
        <Tile title="Oturum Kapat" onPress={handleLogout} danger />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, borderBottomWidth: 1, borderBottomColor: '#dbe4df', justifyContent: 'center', paddingHorizontal: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  content: { padding: 16, gap: 10 },
  card: { borderWidth: 1, borderColor: '#d4dde3', borderRadius: 12, padding: 16, marginBottom: 4 },
  name: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  email: { marginTop: 4, color: '#64748b' },
  tile: {
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
  tileDanger: { borderColor: '#fecaca', backgroundColor: '#fff7f7' },
  tileText: { fontSize: 15, color: '#0f172a', fontWeight: '500' },
  tileTextDanger: { color: '#b91c1c' },
  chevron: { fontSize: 18, fontWeight: '700', color: '#64748b' },
  blockedWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  blockedText: { fontSize: 16, color: '#334155' },
});
