# Sorun Giderme Rehberi (Troubleshooting Guide)

Bu dokümanda, geliştirme sırasında karşılaşılan yaygın sorunlar ve çözümleri anlatılır.

---

## 🔴 Uygulama Başlamıyor / Crash Oluyor

### Hata: "Metro bundler failed"
**Neden**: Dosya yollarında karakter set sorunu veya cache problemi

**Çözüm**:
```bash
# 1. Cache temizle
npm start -- --reset-cache

# 2. node_modules temizle
rm -rf node_modules package-lock.json
npm install

# 3. Expo cache temizle
npm start -- --clear
```

### Hata: "Module not found: @react-navigation/native"
**Neden**: Bağımlılıklar yüklenmemiş

**Çözüm**:
```bash
npm install

# Veya spesifik kütüphaneyi yükle:
npm install @react-navigation/native
```

### Hata: "Cannot find module 'react'"
**Neden**: Node.js versiyonu uyumsuz veya kurulum eksik

**Çözüm**:
```bash
# Node.js versiyonunu kontrol et (16+ gerekli)
node --version

# Yeniden yükle
rm -rf node_modules
npm cache clean --force
npm install
```

---

## 🟡 API Bağlantı Sorunları

### Hata: "Network Error" veya "Could not connect"
**Neden**: Backend sunucusu çalışmıyor veya URL yanlış

**Çözüm**:
1. Backend URL'sini kontrol et `src/services/apiClient.js`
2. Sunucunun çalışıp çalışmadığını test et:
   ```bash
   curl -X GET http://localhost:3000/api/health
   ```
3. Firewall veya VPN bloklaması kontrolü
4. Localhost yerine machine IP kullan:
   ```javascript
   // http://localhost:3000 yerine
   baseURL: 'http://192.168.x.x:3000'
   ```

### Hata: "CORS Error"
**Neden**: Backend CORS headers'ı göndermemiş

**Çözüm**: Backend'de CORS konfigürasyonu:
```javascript
// Express örneği
app.use(cors({
  origin: 'http://localhost:19000',
  credentials: true,
}));
```

### Hata: "Timeout - Request took too long"
**Neden**: Yavaş network veya server latency

**Çözüm**:
```javascript
// apiClient.js'de timeout'u artır
timeout: 30000 // 30 saniye (default 10s)
```

### Hata: "401 Unauthorized"
**Neden**: Auth token geçersiz veya yok

**Çözüm**:
1. Login yapıp token'ı cache'e kaydet
2. Her request'te token'ı header'a ekle
3. Token'ın expire olup olmadığını kontrol et

---

## 🟠 Ekran / UI Sorunları

### Hata: "Ekran boş / bileşen render değil"
**Neden**: isLoggedIn() check'i başarısız

**Çözüm**:
```javascript
// getAuthUser() null ise:
import { getAuthUser, setAuthUser } from '../services/authSession';

// Login sonrası düzgün set et:
const response = await login(credentials);
setAuthUser(response?.data); // User objesi
```

### Hata: "Button basıldığında hiçbirşey olmuyor"
**Neden**: Navigation props undefined

**Çözüm**:
```javascript
// Sayfa component'i useCallback'e sahip olmalı
import { useCallback } from 'react';

export function Page({ navigation }) {
  const handlePress = useCallback(() => {
    navigation.navigate('TargetScreen');
  }, [navigation]);

  return <Pressable onPress={handlePress} />;
}
```

### Hata: "Text / Input görmüyorum"
**Neden**: Renk uyumsuzluğu (beyaz text beyaz background vb.)

**Çözüm**:
```javascript
// theme.js'den renkleri kullan
import { COLORS } from '../utils/theme';

<Text style={{ color: COLORS.text }}>Görünür text</Text>
```

### Hata: "Layout bozuk / hizalanmış değil"
**Neden**: Hatalı flexbox veya styling

**Çözüm**:
```javascript
// Her zaman flex container'da flex: 1 kontrol et
<View style={{ flex: 1 }}>
  <Text>Content</Text>
</View>
```

---

## 📱 Emulator/Cihaz Sorunları

### Emulator başlamıyor
**Çözüm**:
```bash
# Android emulator listesi
emulator -list-avds

# Spesifik emulator başlat
emulator -avd Pixel_5_API_31

# iOS simulator (macOS)
open -a Simulator
```

### Cihazda app açılmıyor
**Çözüm**:
1. USB debugging etkin (Android)
2. Cihaz bilgisayara bağlı
3. `adb devices` ile cihazı kontrol et:
   ```bash
   adb devices
   ```
4. Uygulamayı aç:
   ```bash
   npm run android
   ```

### Expo Go uygulaması QR kodu okumuyor
**Çözüm**:
1. Aynı WiFi ağında olup olmadığını kontrol et
2. Firewall'u geçici devre dışı bırak
3. IP adresi manuel olarak gir:
   ```
   Expo Go > "Connection" > "LAN" yerine "Tunnel" dene
   ```

---

## 💾 Veri / Cache Sorunları

### Hata: "Eski veri gösterilmeye devam ediyor"
**Neden**: Cache yenilenmiyor

**Çözüm**:
```javascript
// Component mount'ta cache temizle
useEffect(() => {
  AsyncStorage.removeItem('old-data-key');
}, []);
```

### Hata: "Demo verisi yerine gerçek veri alınmıyor"
**Neden**: isDemoUser() true kalıyor

**Çözüm**:
```javascript
// src/services/authSession.js kontrol et
// logout() çağırıp reset et
import { logout } from '../features/auth/api';

async function handleLogout() {
  await logout();
  setAuthUser(null); // Reset session
}
```

### Hata: "State değişikliği UI güncellemeymiyor"
**Neden**: Shallow comparison hatası

**Çözüm**:
```javascript
// Yanlış
setData({ ...oldData }); // Aynı object

// Doğru
setData({ ...oldData, field: newValue }); // Yeni object
```

---

## 🐛 Kod Hataları

### Hata: "ReferenceError: X is not defined"
**Çözüm**: Import denetimi
```javascript
// Eksik import
import { Component } from './path';

// Veya inline tanımlama
const Component = () => { /* ... */ };
```

### Hata: "Cannot read property 'X' of undefined"
**Çözüm**: Optional chaining
```javascript
// Yanlış
user.name // Crash ise user undefined

// Doğru
user?.name // Güvenli
user?.profile?.name // Deep access

// Veya
user && user.name
```

### Hata: "Async function expected but got Promise"
**Çözüm**:
```javascript
// useEffect'te async function tanımla
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch();
  };
  
  fetchData();
}, []);
```

---

## 📊 Performans Sorunları

### Hata: "App yavaş / janky UI"
**Çözüm**:
1. FlatList optimize et:
```javascript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

2. Unnecessary re-renders azalt:
```javascript
import { memo, useCallback } from 'react';

const Item = memo(({ item }) => <Text>{item.name}</Text>);
```

### Hata: "Bundle çok büyük / Slow load"
**Çözüm**:
```bash
# Bundle size analiz et
npm run web -- --analyze
```

---

## 🆘 Destek Almak İçin

Eğer yukarıdaki çözümler yardımcı olmadıysa:

1. **Error message'ı kaydet** - Tam hata metni
2. **Adımları yaz** - Bug'ı reproduce et
3. **Device info** - OS, version, device
4. **Code snippet** - İlgili kod kısmı
5. **Console log'ları** - Debug bilgileri

---

## 🔗 Faydalı Kaynaklar

- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Expo Docs](https://docs.expo.dev/)
- [Axios Docs](https://axios-http.com/)

---

**Son Güncelleme**: Hafta 8 (13 Mayıs 2026)
