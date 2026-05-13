# API Entegrasyon Rehberi

Bu dokümanda, KURSU Mobile uygulamasında API entegrasyonunun nasıl yapıldığı ve yeni endpoint'lerin nasıl ekleneceği anlatılır.

---

## 📡 Genel Mimari

### API İstemcisi Setup
[src/services/apiClient.js](src/services/apiClient.js) içinde Axios konfigürasyonu:

```javascript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://your-backend-url.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Error Handling
Tüm API çağrıları try-catch blokları ile yapılır:

```javascript
try {
  const response = await apiClient.get('/api/endpoint');
  // Success handling
} catch (error) {
  const message = error?.response?.data?.message || 'Hata oluştu';
  // Error handling
}
```

---

## 🔐 Kimlik Doğrulama

### Login Akışı
1. Kullanıcı giriş bilgilerini girer
2. `/api/auth/login` POST isteği gönderilir
3. Başarılı yanıt içinde user objesi döner
4. `setAuthUser()` ile oturum saklanır

```javascript
// src/features/auth/api.js
export async function login(payload) {
  return apiClient.post('/api/auth/login', payload);
}
```

**Payload Format:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
// veya
{
  "schoolNo": "123456",
  "password": "password123"
}
```

**Yanıt Format:**
```json
{
  "id": "user-id",
  "adSoyad": "Adı Soyadı",
  "email": "user@example.com",
  "schoolNo": "123456",
  "rol": "user"
}
```

### Token Yönetimi
Şu an token tabanlı yönetim yapılmıyor. İleride JWT implementasyonu düşünülüyor.

---

## 📦 Feature API Endpoints

### Rezervasyonlar ([src/features/reservations/api.js](src/features/reservations/api.js))

#### Slot Listesi Alma
```javascript
GET /api/rezervasyon/slots?tarih=2026-05-13&alanId=1
```

**Yanıt:**
```json
[
  {
    "id": "slot-1",
    "slot": "09:00-10:00",
    "durum": "Musait"
  },
  {
    "id": "slot-2",
    "slot": "10:00-11:00",
    "durum": "Dolu"
  }
]
```

#### Slot Rezervasyonu Yapma
```javascript
POST /api/rezervasyon/slots/reserve
{
  "slotIds": ["slot-1", "slot-2"],
  "alanId": "1",
  "tarih": "2026-05-13"
}
```

#### Kendi Rezervasyonlarım
```javascript
GET /api/rezervasyon/my
```

**Yanıt:**
```json
[
  {
    "id": "reservation-1",
    "alanAdi": "Sessiz Çalışma Alanı",
    "tarih": "2026-05-13",
    "baslangicSaati": "09:00",
    "bitisSaati": "10:00",
    "durum": "aktif"
  }
]
```

#### Rezervasyon İptal
```javascript
POST /api/rezervasyon/{id}/cancel
```

#### Check-in / Check-out
```javascript
POST /api/rezervasyon/{id}/checkin
POST /api/rezervasyon/{id}/checkout
```

### Ceza ve İhlal ([src/features/penalty/api.js](src/features/penalty/api.js))

#### Benim İhlallerim
```javascript
GET /api/ihlal/me
```

**Yanıt:**
```json
[
  {
    "id": "violation-1",
    "tip": "Check-out kaçırıldı",
    "tarih": "2026-05-10",
    "puan": 10
  }
]
```

#### Ceza Puanı
```javascript
GET /api/ihlal/me/puan
```

**Yanıt:** `{ "puan": 20 }`

### Duyurular ([src/features/announcements/api.js](src/features/announcements/api.js))

#### Aktif Duyurular
```javascript
GET /api/duyuru/aktif
```

**Yanıt:**
```json
[
  {
    "id": "announcement-1",
    "baslik": "Kütüphane Kapalı",
    "icerik": "Cumartesi ve Pazar kapalıdır.",
    "olusturmaTarihi": "2026-05-10"
  }
]
```

### Kaynaklar ([src/features/resources/api.js](src/features/resources/api.js))

#### Kaynakları Listele
```javascript
GET /api/kaynak
```

**Yanıt:**
```json
[
  {
    "id": "resource-1",
    "ad": "Sessiz Çalışma Alanı",
    "tip": "alan",
    "kapasite": 50
  }
]
```

### İstatistikler ([src/features/stats/api.js](src/features/stats/api.js))

#### Benim İstatistiklerim
```javascript
GET /api/istatistik/me
```

**Yanıt:**
```json
{
  "kullanim": {
    "rezervasyonToplam": 15,
    "katilimOrani": "85%",
    "girisKaydiToplam": 13,
    "girisKaydiAcik": 1
  },
  "ceza": {
    "aktifRezervasyon": 1,
    "toplamPuan": 5
  }
}
```

---

## 🛠️ Yeni Endpoint Ekleme

### Adım 1: Feature API Dosyası Oluştur
`src/features/newfeature/api.js`:

```javascript
import { apiClient } from '../../services/apiClient';

export async function getNewData() {
  return apiClient.get('/api/newfeature');
}

export async function createNewData(payload) {
  return apiClient.post('/api/newfeature', payload);
}
```

### Adım 2: Page'de Kullan
`src/pages/NewPage.js`:

```javascript
import { getNewData } from '../features/newfeature/api';

export function NewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const response = await getNewData();
        if (active) {
          setData(response?.data);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || 'Hata oluştu');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // UI Code
}
```

### Adım 3: Error Handling Best Practices
- Lütfen `active` flag'i kullanın (component unmount kontrolü)
- Hata mesajlarını kullanıcı dostu hale getirin
- Loading state'i gösterin
- Network hatalarını ayrı işleyin

---

## 🧪 Test Senaryoları

### Demo Modu ile Test
Demo hesabı kullanan tüm çağrılar mock veri döner:

```javascript
import { isDemoUser } from '../../services/authSession';

export async function getMyData() {
  if (isDemoUser()) {
    return { data: DEMO_DATA };
  }
  return apiClient.get('/api/endpoint');
}
```

### Network Hataları
```javascript
try {
  await apiClient.post('/api/invalid-endpoint', {});
} catch (error) {
  // error.response?.status: 404, 500, vb.
  // error.message: "Network Error"
}
```

---

## 📊 İstek Takip Loglama

Browser Console'da API çağrılarını görmek için:

```javascript
// src/services/apiClient.js içine ekleyin:
apiClient.interceptors.request.use((config) => {
  console.log('[API] Request:', {
    method: config.method,
    url: config.url,
    data: config.data,
  });
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response.status);
    return response;
  },
  (error) => {
    console.error('[API] Error:', {
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
```

---

## 🚀 Production Hazırlığı

### Base URL Yapılandırması
```javascript
// src/services/apiClient.js
const BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Development
  : 'https://api.kursu.com'; // Production

export const apiClient = axios.create({
  baseURL: BASE_URL,
});
```

### Rate Limiting Önerileri
- Hızlı Click'lere karşı button disable etme
- Duplicate request gönderme kontrolleri
- Timeout yönetimi

---

**Son Güncelleme**: Hafta 8 (13 Mayıs 2026)
