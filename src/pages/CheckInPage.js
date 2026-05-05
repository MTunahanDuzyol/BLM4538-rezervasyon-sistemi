import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, Platform, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { confirmCheckIn } from '../features/qr/api';

export function CheckInPage() {
  const [manualMode, setManualMode] = useState(false);
  const [reservationId, setReservationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [success, setSuccess] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState('');

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (mounted) {
          const ok = status === 'granted';
          setHasPermission(ok);
          // if no camera or running on web, enable manual mode automatically
          if (!ok || Platform.OS === 'web') setManualMode(true);
        }
      } catch (e) {
        if (mounted) {
          setHasPermission(false);
          setManualMode(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleBarCodeScanned({ data }) {
    if (scanned) return;
    setScanned(true);
    setScanData(String(data));
    // try to extract numeric reservation id from scanned data
    const match = String(data).match(/(\d+)/);
    if (!match) {
      setResultText('QR kodu tanınamadı. Manuel giriş yapınız.');
      setSuccess(false);
      setScanned(false);
      return;
    }

    const id = match[1];
    setResultText('Check-in yapılıyor...');
    setSuccess(null);
    setLoading(true);
    try {
      await confirmCheckIn(id);
      setResultText('Check-in başarılı.');
      setSuccess(true);
    } catch (error) {
      setResultText(error?.response?.data?.message || 'Check-in işlemi başarısız.');
      setSuccess(false);
    } finally {
      setLoading(false);
      // allow rescanning after short delay so user can see result
      setTimeout(() => setScanned(false), 1500);
    }
  }

  async function tryEnableCamera() {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      const ok = status === 'granted';
      setHasPermission(ok);
      if (ok) setManualMode(false);
      else Alert.alert('Kamera izni yok', 'Lütfen cihaz ayarlarından kamera izni verin.');
    } catch (e) {
      Alert.alert('Hata', 'Kamera izni alınamadı.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.headerTitle}>Check-in</Text></View>
      <View style={styles.content}>
        {!manualMode ? (
          <View style={styles.scannerBox}>
            {hasPermission === null ? (
              <Text style={styles.scannerText}>Kamera izni kontrol ediliyor...</Text>
            ) : hasPermission === false ? (
              <View>
                <Text style={styles.scannerText}>Kamera izni yok. Ayarlardan izin verin veya manuel giriş yapın.</Text>
                <Pressable style={[styles.primaryButton, { marginTop: 12 }]} onPress={() => setManualMode(true)}>
                  <Text style={styles.primaryText}>Manuel Girişe Geç</Text>
                </Pressable>
              </View>
            ) : (
              <View style={{ flex: 1, width: '100%', borderRadius: 12, overflow: 'hidden' }}>
                <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={{ flex: 1 }} />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.scannerBox}>
            <Text style={styles.scannerText}>QR kodu çerçeve içine getirin</Text>
            <Text style={styles.scannerSub}>Kamera entegrasyonu yakın zamanda hizmete girecektir.</Text>
          </View>
        )}

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
            <Pressable style={[styles.primaryButton, { marginTop: 10, backgroundColor: '#334155' }]} onPress={tryEnableCamera}>
              <Text style={styles.primaryText}>Kamerayı Aç</Text>
            </Pressable>
          </View>
        ) : null}

        {resultText ? (
          <View style={[styles.resultBox, success === true ? styles.resultOk : success === false ? styles.resultErr : null]}>
            <Text style={styles.resultText}>{resultText}</Text>
          </View>
        ) : null}
        {scanData ? (
          <View style={[styles.resultBox, { marginTop: 8 }]}> 
            <Text style={[styles.resultText, { fontWeight: '600' }]}>Ham QR veri:</Text>
            <Text style={styles.resultText}>{scanData}</Text>
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
