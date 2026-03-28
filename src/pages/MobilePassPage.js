import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getAuthUser, isLoggedIn } from '../services/authSession';

export function MobilePassPage() {
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
  const okulNo = String(user.okulNo || user.OkulNo || '').trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.headerTitle}>QR Kimlik Doğrulama</Text></View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.qrBox}>
            {okulNo ? (
              <Text style={styles.qrText}>{okulNo}</Text>
            ) : (
              <Text style={styles.qrEmpty}>Okul numarası tanımlı değil.</Text>
            )}
          </View>

          {okulNo ? <Text style={styles.okulNo}>Okul No: {okulNo}</Text> : null}
          <Text style={styles.note}>Geçiş için bu kodu görevliye gösterin.</Text>
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
  name: { textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#0f172a' },
  email: { textAlign: 'center', color: '#64748b', marginTop: 4, marginBottom: 12 },
  qrBox: {
    height: 220,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  qrText: { fontSize: 28, fontWeight: '800', letterSpacing: 2, color: '#0f172a' },
  qrEmpty: { textAlign: 'center', color: '#64748b', paddingHorizontal: 24 },
  okulNo: { textAlign: 'center', marginTop: 12, fontWeight: '700', color: '#0f172a' },
  note: { textAlign: 'center', marginTop: 8, color: '#64748b' },
  blockedWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  blockedText: { fontSize: 16, color: '#334155' },
});
