import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getAuthUser, isLoggedIn } from '../services/authSession';

function KvRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function ProfilePage() {
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
  const email = user.email || '-';
  const role = user.rol || '-';
  const id = user.id ? String(user.id) : '-';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.headerTitle}>Profil</Text></View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.name}>{displayName}</Text>
          <KvRow label="E-posta" value={email} />
          <KvRow label="Rol" value={role} />
          <KvRow label="Kullanıcı ID" value={id} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, borderBottomWidth: 1, borderBottomColor: '#dbe4df', justifyContent: 'center', paddingHorizontal: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  content: { padding: 16 },
  card: { borderWidth: 1, borderColor: '#d4dde3', borderRadius: 12, padding: 16 },
  name: { fontSize: 17, fontWeight: '700', marginBottom: 12, color: '#0f172a' },
  row: { flexDirection: 'row', marginBottom: 8 },
  rowLabel: { width: 110, color: '#64748b', fontWeight: '600' },
  rowValue: { flex: 1, color: '#0f172a' },
  blockedWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  blockedText: { fontSize: 16, color: '#334155' },
});
