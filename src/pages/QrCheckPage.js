import { Pressable, StyleSheet, Text, View, useState } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { getAuthUser } from '../services/authSession';
import { getUserBySchoolNo, getUserByEmail } from '../features/auth/api';

export function QrCheckPage({ navigation }) {
  const [debugText, setDebugText] = useState('');

  async function showCurrentUser() {
    const u = getAuthUser();
    setDebugText(JSON.stringify(u || 'no-client-user', null, 2));
  }

  async function fetchServerUser() {
    const u = getAuthUser();
    try {
      if (u?.okulNo) {
        const res = await getUserBySchoolNo(u.okulNo);
        setDebugText(JSON.stringify(res?.data || res, null, 2));
        return;
      }
      if (u?.email) {
        const res = await getUserByEmail(u.email);
        setDebugText(JSON.stringify(res?.data || res, null, 2));
        return;
      }
      setDebugText('No identifiable user (no okulNo/email) in client session.');
    } catch (e) {
      setDebugText(JSON.stringify(e?.response?.data || e?.message || e, null, 2));
    }
  }
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
        <Pressable style={[styles.button, { backgroundColor: '#64748b' }]} onPress={showCurrentUser}>
          <Text style={styles.buttonText}>Show Client User</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: '#334155' }]} onPress={fetchServerUser}>
          <Text style={styles.buttonText}>Fetch User From Server</Text>
        </Pressable>
        {debugText ? (
          <View style={{ marginTop: 10, padding: 10, backgroundColor: '#f1f5f9', borderRadius: 8 }}>
            <Text style={{ fontFamily: undefined, color: '#0f172a' }}>{debugText}</Text>
          </View>
        ) : null}
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
