import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { confirmCheckIn } from '../features/qr/api';

export function CheckInPage() {
  const [manualMode, setManualMode] = useState(false);
  const [reservationId, setReservationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [success, setSuccess] = useState(null);

  async function submit() {
    if (!reservationId.trim()) {
      Alert.alert('Uyarı', 'Lütfen rezervasyon ID girin.');
      return;
    }

    try {
      setLoading(true);
      setResultText('Check-in yapılıyor...');
      setSuccess(null);
      await confirmCheckIn(reservationId.trim());
      setResultText('Check-in başarılı.');
      setSuccess(true);
    } catch (error) {
      setResultText(error?.response?.data?.message || 'Check-in işlemi başarısız.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.headerTitle}>Check-in</Text></View>
      <View style={styles.content}>
        <View style={styles.scannerBox}>
          <Text style={styles.scannerText}>QR kodu çerçeve içine getirin</Text>
          <Text style={styles.scannerSub}>Kamera entegrasyonu yakın zamanda hizmete girecektir.</Text>
        </View>

        <Pressable style={styles.toggleButton} onPress={() => setManualMode((v) => !v)}>
          <Text style={styles.toggleText}>{manualMode ? 'QR Kod Tarama' : 'Manuel Kod Girişi'}</Text>
        </Pressable>

        {manualMode ? (
          <View style={styles.manualWrap}>
            <Text style={styles.label}>Rezervasyon ID</Text>
            <TextInput
              style={styles.input}
              value={reservationId}
              onChangeText={setReservationId}
              placeholder="Örn: 123"
            />
            <Pressable style={styles.primaryButton} onPress={submit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Check-in Yap</Text>}
            </Pressable>
          </View>
        ) : null}

        {resultText ? (
          <View style={[styles.resultBox, success === true ? styles.resultOk : success === false ? styles.resultErr : null]}>
            <Text style={styles.resultText}>{resultText}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, backgroundColor: '#0f766e', justifyContent: 'center', paddingHorizontal: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { flex: 1, padding: 16, gap: 12 },
  scannerBox: {
    height: 260,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  scannerText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  scannerSub: { color: '#cbd5e1', textAlign: 'center', marginTop: 8 },
  toggleButton: { height: 44, borderRadius: 10, backgroundColor: '#0f766e', alignItems: 'center', justifyContent: 'center' },
  toggleText: { color: '#fff', fontWeight: '700' },
  manualWrap: { borderWidth: 1, borderColor: '#d4dde3', borderRadius: 12, padding: 14 },
  label: { marginBottom: 6, color: '#334155' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  primaryButton: { height: 44, borderRadius: 10, backgroundColor: '#0f766e', alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  resultBox: { borderWidth: 1, borderColor: '#93c5fd', backgroundColor: '#eff6ff', borderRadius: 10, padding: 12 },
  resultOk: { borderColor: '#86efac', backgroundColor: '#f0fdf4' },
  resultErr: { borderColor: '#fca5a5', backgroundColor: '#fef2f2' },
  resultText: { color: '#0f172a' },
});
