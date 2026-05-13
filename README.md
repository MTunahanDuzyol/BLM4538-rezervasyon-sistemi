# KURSU Mobile - Kütüphane Rezervasyon Sistemi

Modern React Native uygulaması ile kütüphane kaynakları (koltuğu, masaları, vb.) için kolay ve etkili rezervasyon yönetimi sağlayan mobil istemci. **Hafta 1-7** temel özellikler, **Hafta 8 (9-10 hafta gereksinimleri)** optimizasyon, dokümantasyon ve son rötuşlar.

---

## 📱 Genel Özellikler

### Kimlik Doğrulama
- E-posta veya öğrenci numarası ile giriş
- Yeni kullanıcı kaydı
- Demo hesap (hızlı test için)
- Oturum yönetimi

### Rezervasyon Sistemi
- Kaynak (koltuk, masa, vb.) listeleme
- Tarih ve saat seçimi ile 60 dakikalık slotlar
- Tek günde max 4 saatlik ardışık rezervasyon
- Aktif rezervasyonları görüntüleme
- Rezervasyon iptal etme (belirli koşullar altında)
- Check-in / Check-out işlemleri

### QR İşlemleri
- Mobil QR kimlik (geçiş kartı)
- Check-in için QR tarama
- Check-out için QR tarama
- Hızlı giriş/çıkış takibi

### Kullanıcı Bilgileri
- İstatistikler (toplam rezervasyon, katılım oranı vb.)
- Ceza puanı ve ihlal kayıtları
- Profil bilgileri
- Ayarlar

### İçerik Yönetimi
- Aktif duyurular (Ana sayfada)
- Duyuru detayları
- Kütüphane durumu (doluluk, açılış saatleri vb.)

---

## 🗂️ Proje Yapısı

```
src/
├── app/
│   ├── App.js           # Ana uygulama entry point
│   ├── providers.js     # Context/Provider setup
│   └── store.js         # State management
├── components/
│   ├── HomeReturnButton.js
│   └── ScreenContainer.js
├── features/
│   ├── admin/           # Admin yönetimi
│   ├── announcements/   # Duyurular
│   ├── auth/            # Kimlik doğrulama
│   ├── penalty/         # Ceza/İhlal
│   ├── qr/              # QR işlemleri
│   ├── reservations/    # Rezervasyon
│   ├── resources/       # Kaynaklar
│   └── stats/           # İstatistikler
├── pages/               # Ekran bileşenleri (24 sayfa)
├── routes/
│   └── RootNavigator.js # Navigasyon yapısı
├── services/
│   ├── apiClient.js     # HTTP istemcisi (Axios)
│   ├── authSession.js   # Auth durumu
│   └── demoData.js      # Demo verileri
└── utils/
    └── date.js          # Tarih yardımcıları
```

### Feature Yapısı
Tüm features aynı yapıyı takip eder:
- `api.js` - Endpoint tanımları
- `model.js` - Veri modelleri (opsiyonel)
- `businessRules.js` - İş mantığı (opsiyonel)
- `ui/index.js` - UI bileşenleri (opsiyonel)

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 16+
- npm veya yarn
- Expo CLI (`npm install -g expo-cli`)

### Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Geliştirme sunucusunu başlat
npm start

# 3. Platform seç
# Android emülatörü için:
npm run android

# iOS simülatörü için:
npm run ios

# Web tarayıcısı için:
npm run web

# Fiziksel cihazda test et:
# Expo Go uygulamasını yükle, QR kodu tara
```

---

## 🔌 API Entegrasyonu

### Temel Kurulum
- **Base URL**: `apiClient.js` içinde tanımlanır
- **İstemci**: Axios
- **Demo Modu**: Demo hesap özel verileri yerelde sağlar

### API Endpoints Özeti

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/auth/login` | POST | Giriş |
| `/api/auth/register` | POST | Kayıt |
| `/api/rezervasyon/slots` | GET | Slot listesi |
| `/api/rezervasyon/slots/reserve` | POST | Slot rezervasyonu |
| `/api/rezervasyon` | GET | Kendi rezervasyonlarım |
| `/api/rezervasyon/{id}/cancel` | POST | Rezervasyon iptal |
| `/api/rezervasyon/{id}/checkin` | POST | Check-in |
| `/api/rezervasyon/{id}/checkout` | POST | Check-out |
| `/api/ihlal/me` | GET | Benim ihlallerim |
| `/api/ihlal/me/puan` | GET | Ceza puanı |
| `/api/duyuru/aktif` | GET | Aktif duyurular |
| `/api/kaynak` | GET | Kaynaklar |
| `/api/istatistik/me` | GET | Kullanıcı istatistikleri |

Detaylı API rehberi için [API-INTEGRATION.md](./API-INTEGRATION.md) dosyasına bakın.

---

## 📋 Mevcut Ekranlar

### Kimlik Doğrulama Akışı
- **LoginPage** - Giriş ekranı (e-posta/öğrenci no)
- **RegisterPage** - Kaydolma ekranı

### Ana Navigasyon (Tab-based)
- **HomePage** - Duyurular ve hızlı erişim
- **ResourceListPage** - Kaynaklar
- **MyReservationsPage** - Kendi rezervasyonlarım
- **StatsPage** - İstatistikler

### Detay ve İşlem Sayfaları
- **ReservationFormPage** - Rezervasyon formu
- **ReservationMapPage** - Rezervasyon haritası (detay)
- **ResourceDetailPage** - Kaynak detayları
- **LibraryStatusPage** - Kütüphane durumu

### QR ve Check-in/out
- **MobilePassPage** - Mobil kimlik (QR)
- **QrCheckPage** - QR tarama
- **CheckInPage** - Check-in detayı
- **CheckOutPage** - Check-out detayı

### Bilgi Sayfaları
- **ProfilePage** - Profil bilgileri
- **PenaltyPage** - Ceza puanı ve ihlaller
- **AnnouncementsPage** - Duyurular (detay)
- **MyPage** - Kullanıcı menüsü
- **SettingsPage** - Ayarlar
- **MenuPage** - Tüm menüler

### Yönetim
- **AdminPage** - Admin paneli (hazır, geliştirilmek için)

### Diğer
- **EndPage** - Bitiş ekranı
- **WrongPage** - Hata ekranı

---

## 🎨 UI/UX Tasarımı

### Renk Paleti
- **Primary**: `#6B998B` (yeşil-mavi)
- **Background**: `#ffffff`, `#f8fafc`
- **Border**: `#d1d5db`, `#dbe4df`
- **Text**: `#0f172a` (dark), `#64748b` (secondary)
- **Success**: `#86efac`, `#f0fdf4`
- **Error**: `#b91c1c`

### Bileşenler
- **ScreenContainer** - Standart sayfa layout
- **HomeReturnButton** - Ana sayfaya dönüş
- Özel input, button, card bileşenleri

---

## 🧪 Demo Modu

Demo hesabı ile test et:
- **E-posta**: `demo@example.com`
- **Şifre**: `DemoPassword123!`

Demo modu:
- Gerçek API çağrıları yapmaz
- Yerel mock veriler sunar
- Tüm özellikler test edilebilir
- Hata senaryoları simulate edilebilir

---

## 📝 Hafta Bazında Geliştirme Özeti

| Hafta | Başlık | Başlıca Çalışmalar |
|-------|--------|-------------------|
| 1 | Temel Kurulum | Expo setup, navigasyon, klasör yapısı |
| 2 | Auth & Rezervasyon | Login/Register, slot seçimi |
| 3 | Kaynaklar & Duyurular | API entegrasyonu, listeleme |
| 4 | Slot Yönetimi | Slot listeleme, çoklu seçim |
| 5 | İş Kuralları | Rezervasyon iptal, validasyon |
| 7 | İhlal & UI | Ceza sistemi, UI iyileştirmeleri |
| 8* | Optimizasyon | Dokümantasyon, hata yönetimi, son rötuşlar |

*Hafta 8, hafta 9-10 gereksinimlerini içerir.

---

## ⚙️ Geliştirme Rehberi

### Yeni Sayfa Ekleme
1. `src/pages/YenisayfaPage.js` oluştur
2. `src/routes/RootNavigator.js` içinde ekle
3. Import ve navigation tanımını güncelle

### Yeni Feature Ekleme
1. `src/features/newfeature/` dizini oluştur
2. `api.js` dosyası ile endpoint tanımla
3. Sayfalarda import ve kullan

### API Çağrısı Yapma
```javascript
import { apiClient } from '../../services/apiClient';

// GET
const response = await apiClient.get('/api/endpoint');

// POST
const response = await apiClient.post('/api/endpoint', { data });

// Error handling
try {
  const response = await apiClient.get('/api/endpoint');
} catch (error) {
  const message = error?.response?.data?.message || 'Hata oluştu';
}
```

---

## 🚨 Bilinen Sorunlar ve Sınırlamalar

- Admin paneli tam olarak uygulanmadı (framework hazır)
- Bazı edge case'ler test edilmek gerekir
- Responsive tasarım mobil odaklı
- Offline mod implementasyonu planlanıyor

---

## 📞 Destek ve Katkı

Sorular, öneriler ve bug raporları için iletişime geçin.

---

## 📄 Ek Dokümantasyon

- [API-INTEGRATION.md](./API-INTEGRATION.md) - Detaylı API rehberi
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Yayınlama adımları
- [TESTING.md](./TESTING.md) - Test senaryoları
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Sorun giderme

---

**Son Güncelleme**: Hafta 8 (13 Mayıs 2026)

