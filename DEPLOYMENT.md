# Dağıtım (Deployment) Rehberi

Bu dokümanda, KURSU Mobile uygulamasını geliştirme ortamından production'a nasıl geçireceğiniz anlatılır.

---

## 🎯 Dağıtım Aşamaları

### 1. Geliştirme Ortamı (Development)
- Yerel bilgisayarda Expo Go ile çalıştırma
- Demo mod etkin
- API: Localhost veya test sunucusu

### 2. Test Ortamı (Staging)
- Test sunucusuna dağıtma
- Esas API ile entegrasyon
- Sınırlı kullanıcı testi

### 3. Production (Canlı)
- App Store / Google Play'e gönderme
- Esas API sunucusu
- İzleme ve güncelleme

---

## 📦 APK/IPA Oluşturma

### Android APK Oluşturma

#### Seçenek 1: Expo Build Servisi

```bash
# EAS CLI yükleme
npm install -g eas-cli

# Çıkış Yapma (belki gerekli değil)
eas logout

# Giriş Yapma
eas login

# Build Profili Oluştur
eas build:configure

# APK Build Et (Preview)
npm run build:apk

# Production Build
npm run build:android
```

**eas.json Konfigürasyonu:**
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

#### Seçenek 2: Yerel Build (Gelişmiş)

```bash
# Java Development Kit (JDK) 11+ gerekli
# Android SDK gerekli

# Build (Yerel makine gereklidir)
npx react-native build-android
```

### iOS IPA Oluşturma

```bash
# EAS ile iOS build
eas build -p ios

# İndirilen IPA TestFlight'a yükle
```

**Not**: macOS ve Apple Developer Account gerekli.

---

## 🚀 Google Play Store'a Yayınlama

### Ön Gereklemeler
1. Google Play Developer Account (`$25 başlangıç ücreti)
2. Signed APK veya AAB
3. App Store Listing (açıklama, screenshots, vb.)

### Adımlar

1. **Google Play Console Erişim**
   - https://play.google.com/console
   - Yeni uygulama oluştur

2. **App Details Doldur**
   - App name: "KURSU"
   - Açıklama (Turkish)
   - Screenshots (5-8 tane)
   - Privacy Policy URL
   - Contact Email

3. **Content Rating Questionnaire**
   - Privacy policy ve content bilgileri

4. **Pricing & Distribution**
   - Free olarak ayarla
   - Target countries: Türkiye (+)

5. **APK/AAB Yükleme**
   - Build > All releases > Create new release
   - Signed APK/AAB seç
   - 64-bit binary zorunlu (AAB önerilir)

6. **Release Notes**
   - v1.0.0: "Initial Release"
   - Türkçe açıklama ekle

7. **Review & Release**
   - Submit for review
   - 2-24 saat içinde onay

---

## 🍎 Apple App Store'a Yayınlama

### Ön Gereklemeler
1. Apple Developer Account (`$99/yıl`)
2. macOS bilgisayar
3. Xcode
4. Signed IPA

### Adımlar

1. **App ID Oluştur**
   - Developer.apple.com > Certificates > App IDs
   - Bundle ID: com.yourcompany.kursu

2. **Distribution Certificate**
   - Production signing certificate oluştur

3. **App Store Connect**
   - https://appstoreconnect.apple.com
   - Yeni uygulama oluştur

4. **App Information**
   - App name, Bundle ID, Language
   - Category, Demo Hesap bilgileri

5. **Pricing & Availability**
   - Free olarak ayarla
   - Hedef ülkeler seç

6. **Screenshots ve Açıklama**
   - 2 to 6.5 inch screenshots (5-10 tane)
   - Açıklama ve release notes

7. **Build Upload**
   - TestFlight'a IPA yükle
   - Testleri bitir
   - App Store'a submit

---

## ⚙️ Production Yapılandırması

### API Base URL Güncelleme
`src/services/apiClient.js`:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'
  : 'https://api.kursu.com'; // Production URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
```

### Build Version Güncelleme
`package.json`:

```json
{
  "version": "1.0.0"
}
```

`eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab",
        "versionCode": 1
      }
    }
  }
}
```

### Environment Secrets
- API anahtarları `.env` dosyasında sakla
- Git'e commit etme
- Build süreci sırasında inject et

---

## 📱 Over-the-Air (OTA) Güncelleme

### Expo Updates Kurulum

```bash
npm install expo-updates
```

**app.json:**
```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[project-id]",
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    }
  }
}
```

**Kod Güncellemesi Yayınlama:**
```bash
npm run start -- --dev-client
# Yapılan değişiklikleri test et

npm run publish
# Tüm kullanıcılara gönder
```

---

## 🔒 Güvenlik Kontrol Listesi

- [ ] API endpoints HTTPS kullanuyor
- [ ] Hassas veriler (passwords, tokens) loglanmıyor
- [ ] Privacy Policy ve Terms of Service hazır
- [ ] User data encryption yapılandırıldı
- [ ] API key'ler hard-code değil
- [ ] Bilinçli hata mesajları (stack traces yok)

---

## 🚨 Monitoring & Analytics

### Crash Reporting
```bash
# Sentry gibi servisler entegre et
npm install @sentry/react-native
```

### Usage Analytics
```bash
# Firebase Analytics
npm install firebase react-native-firebase
```

---

## 📊 Versiyon Yönetimi

### Semantic Versioning (SemVer)
- **Major (1.0.0)**: Breaking changes
- **Minor (0.1.0)**: New features
- **Patch (0.0.1)**: Bug fixes

### Release Notes Template
```markdown
## v1.1.0 (13 May 2026)

### New Features
- Yeni özellik A
- Yeni özellik B

### Bug Fixes
- Hata A düzeltildi
- Hata B düzeltildi

### Improvements
- Performans iyileştirmesi
- UI/UX iyileştirmesi
```

---

## 🐛 Troubleshooting

### APK Build Hatası
```bash
# Cache temizle
rm -rf node_modules package-lock.json
npm install

# Build yeniden dene
npm run build:android
```

### Signed APK Sorunları
```bash
# Keystore dosyasını kontrol et
keytool -list -v -keystore release.keystore
```

### App Store Review Reddedildi
- Privacy Policy açık ve eksiksiz
- App Store Guidelines'ı oku
- Hata mesajını analiz et ve düzelt
- Yeniden submit et

---

## 📈 Post-Launch Checklist

- [ ] Crash reports izleniyor
- [ ] User feedback toplama mekanizması
- [ ] Performance metrics takip ediliyor
- [ ] Update mekanizması çalışıyor
- [ ] Support email'i aktif
- [ ] Analytics dashboard aktif

---

**Son Güncelleme**: Hafta 8 (13 Mayıs 2026)
