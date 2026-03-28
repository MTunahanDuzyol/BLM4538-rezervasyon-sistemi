import { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { login } from '../features/auth/api';
import { setAuthUser } from '../services/authSession';

const PRIMARY = '#6B998B';

export function LoginPage({ navigation }) {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');

  function showStatusMessage(title, message) {
    setLoginStatus(message);
    if (Platform.OS !== 'web') {
      Alert.alert(title, message);
    }
  }

  async function handleLogin() {
    if (isSubmitting) {
      return;
    }

    const normalizedIdentity = identity.trim();
    const normalizedPassword = password.trim();

    if (!normalizedIdentity) {
      showStatusMessage('Uyarı', 'Lütfen e-posta veya öğrenci numarası girin.');
      return;
    }

    if (!normalizedPassword) {
      showStatusMessage('Uyarı', 'Lütfen şifre girin.');
      return;
    }

    try {
      setIsSubmitting(true);
      setLoginStatus('Giriş isteği gönderiliyor...');

      const payload = normalizedIdentity.includes('@')
        ? { email: normalizedIdentity, password: normalizedPassword }
        : { schoolNo: normalizedIdentity, password: normalizedPassword };

      console.log('[AUTH] Login request started', {
        identityType: normalizedIdentity.includes('@') ? 'email' : 'schoolNo',
        rememberMe,
      });

      const response = await login(payload);

      console.log('[AUTH] Login response', {
        status: response?.status,
        hasData: Boolean(response?.data),
      });

      setAuthUser(response?.data || null);

      setLoginStatus('Giriş başarılı. Ana sayfaya yönlendiriliyor...');
      navigation.replace('Main');
    } catch (error) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        (error?.message?.toLowerCase().includes('network')
          ? 'Sunucuya ulaşılamadı. Cihaz/Emülatör ağ adresini kontrol edin.'
          : 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');

      console.log('[AUTH] Login failed', { status, message });
      showStatusMessage('Giriş Hatası', `Hata: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerWrap}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}
          >
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerPill}>
              <Text style={styles.headerPillText}>Oturum Aç</Text>
            </View>
          </View>

          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.headerDivider} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Öğrenci No / E-posta"
            value={identity}
            onChangeText={setIdentity}
            autoCapitalize="none"
          />

          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
            />
            <Pressable onPress={() => setSecureTextEntry((prev) => !prev)}>
              <Text style={styles.eyeButton}>{secureTextEntry ? 'Goster' : 'Gizle'}</Text>
            </Pressable>
          </View>

          <View style={styles.inlineRow}>
            <View style={styles.rememberRow}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: '#cbd5e1', true: '#94b8ad' }}
                thumbColor={rememberMe ? PRIMARY : '#f8fafc'}
              />
              <Text style={styles.rememberText}>Beni hatırla</Text>
            </View>
            <Pressable>
              <Text style={styles.linkText}>Şifremi Unuttum?</Text>
            </Pressable>
          </View>

          <Pressable style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]} onPress={handleLogin} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>Giriş Yap</Text>
            )}
          </Pressable>

          {loginStatus ? <Text style={styles.statusText}>{loginStatus}</Text> : null}

          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.bottomLink}>Hesabın yok mu? Kayıt ol</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerWrap: {
    backgroundColor: '#ffffff',
  },
  headerRow: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backButton: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#111827',
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerPill: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    minWidth: 160,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerPillText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 48,
  },
  headerDivider: {
    height: 1,
    backgroundColor: PRIMARY,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  formCard: {
    width: '100%',
    maxWidth: 360,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 15,
    color: '#111827',
  },
  passwordWrap: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  eyeButton: {
    color: '#334155',
    fontWeight: '600',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    color: '#111827',
    fontSize: 14,
  },
  linkText: {
    color: '#0f766e',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: PRIMARY,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  statusText: {
    textAlign: 'center',
    color: '#334155',
    marginBottom: 10,
    fontSize: 13,
  },
  bottomLink: {
    textAlign: 'center',
    color: '#0f766e',
    fontWeight: '500',
  },
});
