import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { register } from '../features/auth/api';

const PRIMARY = '#6B998B';

export function RegisterPage({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerStatus, setRegisterStatus] = useState('');

  function showStatusMessage(title, message) {
    setRegisterStatus(message);
    if (Platform.OS !== 'web') {
      Alert.alert(title, message);
    }
  }

  async function handleRegister() {
    if (isSubmitting) {
      return;
    }

    console.log('[AUTH] Register button pressed');
    setRegisterStatus('Kayıt kontrol ediliyor...');

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedIdentity = identity.trim();
    const normalizedPassword = password.trim();
    const normalizedPassword2 = password2.trim();

    if (normalizedFirstName.length < 2) {
      showStatusMessage('Uyarı', 'Ad en az 2 karakter olmalıdır.');
      return;
    }

    if (normalizedLastName.length < 2) {
      showStatusMessage('Uyarı', 'Soyad en az 2 karakter olmalıdır.');
      return;
    }

    if (!normalizedIdentity) {
      showStatusMessage('Uyarı', 'Öğrenci no veya e-posta zorunludur.');
      return;
    }

    if (normalizedPassword.length < 6) {
      showStatusMessage('Uyarı', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (normalizedPassword !== normalizedPassword2) {
      showStatusMessage('Uyarı', 'Şifreler eşleşmiyor.');
      return;
    }

    if (!acceptTerms) {
      showStatusMessage('Uyarı', 'Lütfen kullanım koşullarını kabul edin.');
      return;
    }

    try {
      setIsSubmitting(true);
      setRegisterStatus('Kayıt isteği gönderiliyor...');

      const isEmail = normalizedIdentity.includes('@');

      const payload = {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: isEmail ? normalizedIdentity : '',
        password: normalizedPassword,
        userType: 'student',
        okulNo: isEmail ? '' : normalizedIdentity,
      };

      const response = await register(payload);

      console.log('[AUTH] Register response', {
        status: response?.status,
        hasData: Boolean(response?.data),
      });

      setRegisterStatus('Kayıt başarılı. Giriş ekranına yönlendiriliyorsunuz...');
      if (Platform.OS !== 'web') {
        Alert.alert('Başarılı', 'Kayıt tamamlandı. Giriş yapabilirsiniz.');
      }
      navigation.navigate('Login');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Kayıt başarısız. Bilgileri kontrol edip tekrar deneyin.';

      console.log('[AUTH] Register failed', {
        status: error?.response?.status,
        message,
      });

      showStatusMessage('Kayıt Hatası', `Hata: ${message}`);
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
              <Text style={styles.headerPillText}>Kayıt Ol</Text>
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
            placeholder="Ad"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            style={styles.input}
            placeholder="Soyad"
            value={lastName}
            onChangeText={setLastName}
          />

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
              secureTextEntry={secureTextEntry1}
            />
            <Pressable onPress={() => setSecureTextEntry1((prev) => !prev)}>
              <Text style={styles.eyeButton}>{secureTextEntry1 ? 'Goster' : 'Gizle'}</Text>
            </Pressable>
          </View>

          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Şifre (Tekrar)"
              value={password2}
              onChangeText={setPassword2}
              secureTextEntry={secureTextEntry2}
            />
            <Pressable onPress={() => setSecureTextEntry2((prev) => !prev)}>
              <Text style={styles.eyeButton}>{secureTextEntry2 ? 'Goster' : 'Gizle'}</Text>
            </Pressable>
          </View>

          <View style={styles.termsRow}>
            <Switch
              value={acceptTerms}
              onValueChange={setAcceptTerms}
              trackColor={{ false: '#cbd5e1', true: '#94b8ad' }}
              thumbColor={acceptTerms ? PRIMARY : '#f8fafc'}
            />
            <Text style={styles.termsText}>Kullanım koşullarını ve KVKK metnini kabul ediyorum.</Text>
          </View>

          <Pressable
            style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>Kayıt Ol</Text>
            )}
          </Pressable>

          {registerStatus ? <Text style={styles.statusText}>{registerStatus}</Text> : null}

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.bottomLink}>Zaten hesabın var mı? Giriş yap</Text>
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
    marginBottom: 14,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  termsText: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
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
