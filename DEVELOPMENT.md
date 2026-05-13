# Geliştirme Rehberi (Development Guide)

Bu dokümanda, KURSU Mobile uygulamasının geliştirme sürecinde izlenecek en iyi uygulamalar ve rehberler anlatılır.

---

## 📚 Dokümantasyon Indeksi

1. **README.md** - Proje özeti ve hızlı başlangıç
2. **API-INTEGRATION.md** - API entegrasyon detayları
3. **DEPLOYMENT.md** - Production hazırlığı ve yayınlama
4. **TESTING.md** - Test senaryoları ve edge case'ler
5. **TROUBLESHOOTING.md** - Sorun giderme rehberi
6. **DEVELOPMENT.md** (bu dosya) - Geliştirme best practices

---

## 🎯 Geliştirme Prensipleri

### 1. Feature-Based Mimarı
Tüm features `src/features/` altında aynı yapı takip eder:

```
features/
├── featureName/
│   ├── api.js          # API endpoint tanımları
│   ├── model.js        # Veri modelleri/types
│   ├── businessRules.js # İş mantığı
│   └── ui/             # UI bileşenleri (optional)
```

**Örnek - Yeni Feature Eklemek:**

```bash
# 1. Klasör yap
mkdir -p src/features/myfeature/ui

# 2. api.js oluştur
echo "import { apiClient } from '../../services/apiClient';" > src/features/myfeature/api.js

# 3. Endpoint ekle
cat >> src/features/myfeature/api.js << 'EOF'

export async function getMyData() {
  return apiClient.get('/api/myfeature');
}

export async function createData(payload) {
  return apiClient.post('/api/myfeature', payload);
}
EOF
```

### 2. State Management Prensipleri

**Local Component State Kullan:**
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

**Lifecycle Kontrol:**
```javascript
useEffect(() => {
  let active = true;

  // Async işlem
  (async () => {
    try {
      const result = await fetchData();
      if (active) setData(result);
    } catch (err) {
      if (active) setError(err.message);
    }
  })();

  return () => {
    active = false; // Cleanup
  };
}, []);
```

### 3. Error Handling Stratejisi

**API Hataları:**
```javascript
try {
  const response = await apiClient.get('/api/endpoint');
} catch (error) {
  // Network hatası
  if (!error.response) {
    setError('Sunucuya ulaşılamadı');
  }
  // HTTP hatası (4xx, 5xx)
  else if (error.response?.status === 404) {
    setError('Kayıt bulunamadı');
  }
  // Sunucu hatası
  else if (error.response?.status >= 500) {
    setError('Sistem hatası oluştu');
  }
  // Diğer hatalar
  else {
    setError(error.response?.data?.message || 'Hata oluştu');
  }
}
```

### 4. Veri Normalizasyonu

**Flexible Response Handling:**
```javascript
// API'den gelen veri değişken olabilir
function parseUser(data) {
  return {
    id: data?.id ?? data?.userId ?? data?.kullaniciId,
    name: data?.adSoyad ?? data?.name ?? data?.isim,
    email: data?.email ?? data?.mail,
    role: data?.rol ?? data?.role,
  };
}
```

---

## 🎨 UI/UX Best Practices

### 1. Design System Kullanımı

**Theme Dosyasını Kullan:**
```javascript
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
});
```

**Standart Bileşenleri Kullan:**
```javascript
import { cardStyles, textStyles, buttonStyles, alertStyles } from '../utils/components';

// Yerine
// <View style={{ borderWidth: 1, padding: 16, ... }} />

// Kullan
<View style={cardStyles.card}>
  <Text style={textStyles.heading2}>Başlık</Text>
</View>
```

### 2. Loading States

**Tüm Async İşlemlerde Loading Göster:**
```javascript
{loading ? (
  <View style={stateStyles.stateContainer}>
    <ActivityIndicator color={COLORS.primary} />
    <Text style={stateStyles.loadingText}>Yükleniyor...</Text>
  </View>
) : error ? (
  <View style={alertStyles.alertError}>
    <Text style={alertStyles.alertErrorText}>❌ {error}</Text>
  </View>
) : (
  <View>{/* İçerik */}</View>
)}
```

### 3. Empty & Error States

**Empty State:**
```javascript
{!loading && items.length === 0 && (
  <View style={stateStyles.stateContainer}>
    <Text style={textStyles.body}>✅ Henüz kayıt bulunmuyor.</Text>
  </View>
)}
```

**Error State:**
```javascript
{error && (
  <View style={alertStyles.alertError}>
    <Text style={alertStyles.alertErrorText}>❌ {error}</Text>
  </View>
)}
```

---

## 📱 Sayfa Template

```javascript
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { isLoggedIn } from '../services/authSession';
import { ScreenContainer } from '../components/ScreenContainer';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';
import { cardStyles, textStyles, stateStyles } from '../utils/components';

/**
 * PageName - Sayfa Açıklaması
 * 
 * Gösterir:
 * - Özellik 1
 * - Özellik 2
 */
export function PageName() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    if (!isLoggedIn()) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    (async () => {
      setLoading(true);
      setError('');

      try {
        // API çağrısı
        // const response = await apiCall();
        // if (active) setData(response.data);
      } catch (requestError) {
        if (active) {
          setError(requestError?.response?.data?.message || 'Hata oluştu');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!isLoggedIn()) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={stateStyles.stateContainer}>
          <Text style={textStyles.body}>Lütfen önce oturum açın.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScreenContainer title="Başlık" subtitle="Alt başlık">
      {loading ? (
        <View style={stateStyles.stateContainer}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={alertStyles.alertError}>
          <Text style={alertStyles.alertErrorText}>❌ {error}</Text>
        </View>
      ) : (
        <View style={cardStyles.card}>
          <Text style={textStyles.body}>{/* İçerik */}</Text>
        </View>
      )}
      
      <HomeReturnButton />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
```

---

## 🔄 Code Review Checklist

### API Integration
- [ ] isLoggedIn() kontrolü yapılmış
- [ ] Demo modu destekliyor
- [ ] Error handling var
- [ ] Active flag temizleme var
- [ ] Loading state gösterilir

### UI/UX
- [ ] Theme constants kullanılıyor
- [ ] Consistent spacing
- [ ] Error states tanımlanmış
- [ ] Empty states tanımlanmış
- [ ] Loading indicators var

### Accessibility
- [ ] Text sizes readable
- [ ] Colors accessible (contrast)
- [ ] Touch targets >= 44px
- [ ] Navigation clear

### Code Quality
- [ ] JSDoc comments var
- [ ] Meaningful variable names
- [ ] No console logs left
- [ ] No hardcoded strings (i18n prep)

---

## 🧪 Testing Stratejisi

### Manual Testing
1. **Happy Path**: Başarılı senaryo
2. **Error Path**: Hata durumları
3. **Edge Cases**: Sınırlandırılmış durumlar
4. **Performance**: Load, scroll, navigation

### Test Adımları
```javascript
// 1. Setup - Başlangıç durumu
// 2. Action - Kullanıcı etkisi
// 3. Assert - Beklenen sonuç
```

### Demo Mode Testing
```bash
# Demo hesapla giriş
Email: demo@example.com
Password: DemoPassword123!

# Tüm sayfalar demo veri ile test edilebilir
```

---

## 🚀 Performance Optimization

### Bundle Size
- Dinamik import kullan
- Unused imports temizle
- Tree-shaking enabled

### Rendering
- FlatList optimize et
  ```javascript
  <FlatList
    keyExtractor={item => item.id}
    maxToRenderPerBatch={10}
    updateCellsBatchingPeriod={50}
    removeClippedSubviews={true}
  />
  ```

### Memory
- Cleanup fonksiyonları yazılmış
- useCallback / useMemo kullan (gerektiğinde)
- Large data structures cache et

---

## 📝 Commit Message Format

```
feat: Yeni özellik açıklaması
fix: Bug düzeltme açıklaması
docs: Dokümantasyon güncelleme
style: Kod formatı değişikliği
refactor: Kod yeniden yapılandırması
perf: Performans iyileştirmesi
test: Test ekleme/güncelleme
```

**Örnek:**
```
feat: Admin panel template ve system status gösterilmesi
fix: PenaltyPage'de error handling iyileştirildi
docs: API integration rehberi eklendi
```

---

## 🔐 Security Considerations

### Authentication
- [ ] Token secure storage
- [ ] Auto-logout on expiry
- [ ] Password never logged
- [ ] Sensitive data encrypted

### API
- [ ] HTTPS only
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] CORS configured

### Storage
- [ ] AsyncStorage secure
- [ ] No sensitive data local
- [ ] Cache invalidation

---

## 📊 Versioning Strategy

### Semantic Versioning
- **1.2.3** = Major.Minor.Patch
- **Major**: Breaking changes
- **Minor**: New features
- **Patch**: Bug fixes

### Release Process
1. Increment version
2. Update CHANGELOG
3. Tag commit
4. Build & Test
5. Deploy

---

## 🆘 Getting Help

1. **Dokümantasyon Oku**:
   - README.md - Genel
   - API-INTEGRATION.md - API
   - TROUBLESHOOTING.md - Sorunlar

2. **Debugging**:
   - Console logs kontrol et
   - Network requests inspect et
   - Device logs review et

3. **Kaynaklar**:
   - [React Native Docs](https://reactnative.dev/)
   - [React Navigation](https://reactnavigation.org/)
   - [Expo Docs](https://docs.expo.dev/)

---

## 📈 Continuous Improvement

### Regular Tasks
- [ ] Dependencies güncelle
- [ ] Security patches uygula
- [ ] Performance profile et
- [ ] User feedback topla
- [ ] Error logs review et

### Quarterly Review
- [ ] Code quality metrics
- [ ] Performance benchmarks
- [ ] User satisfaction
- [ ] Bug trends
- [ ] Feature requests

---

**Son Güncelleme**: Hafta 8 (13 Mayıs 2026)
