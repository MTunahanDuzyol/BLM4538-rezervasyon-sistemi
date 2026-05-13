# Test Rehberi (Testing Guide)

Bu dokümanda, KURSU Mobile uygulamasında test senaryoları, edge case'ler ve bilinen sorunlar anlatılır.

---

## 🧪 Test Senaryoları

### A. Kimlik Doğrulama Akışı

#### ✅ Başarılı Login
- **Adım**: E-mail / Öğrenci No + Şifre gir, "Giriş Yap" butonuna tıkla
- **Beklenti**: Ana sayfa açılır, kullanıcı adı görüntülenir
- **Test**: Real account veya demo@example.com / DemoPassword123!

#### ❌ Başarısız Login (Yanlış Şifre)
- **Adım**: E-posta + yanlış şifre gir
- **Beklenti**: "Giriş başarısız" hata mesajı
- **Test**: demo@example.com / WrongPassword

#### ⚠️ Boş Alan Validasyonu
- **Adım**: Alanları boş bırak, "Giriş Yap" butonuna tıkla
- **Beklenti**: "Lütfen E-posta girin" uyarısı
- **Test**: Herhangi bir alanı boş bırak

#### 📱 Demo Hesap
- **Adım**: Demo Hesapla Giriş Yap butonuna tıkla
- **Beklenti**: Anında Ana sayfaya geçiş
- **Test**: İlk ziyarette deneme

#### 📝 Kayıt Işlemi
- **Adım**: "Hesabın yok mu? Kayıt ol" → form doldur → Kayıt Ol
- **Beklenti**: Başarılı → Login ekranına dön, yeni hesapla giriş yap
- **Test**: Geçerli e-mail ve şifre kullan

---

### B. Rezervasyon Akışı

#### ✅ Başarılı Rezervasyon
1. **Adım**: Ana Sayfa → Koltuk Rezervasyonu (veya Menu → Koltuk Rezervasyonu)
2. **Adım**: Tarih seç (bugünden sonrası)
3. **Adım**: Uygun slot seç
4. **Adım**: Ardışık slotlar seçebilir (Max 4 saat = 4 slot)
5. **Beklenti**: Kırmızı ok seçilen slotları işaretler, "Rezervasyonu Onayla" aktif olur
6. **Adım**: "Rezervasyonu Onayla" butonuna tıkla
7. **Beklenti**: Başarı mesajı → "Benim Rezervasyonlarım"'a eklenmiş görüntülenir

#### ❌ Dolu Slot Seçilemez
- **Adım**: Dolu (kırmızı) slot'a tıkla
- **Beklenti**: Seçim değişmez, uyarı mesajı gözükebilir
- **Test**: Başka kullanıcının rezervasyon yaptığı slotu seç

#### ⚠️ Maksimum Saat Aşılması
- **Adım**: 5 slotu seçmeyi dene (5 saat = 300 dakika > 240 dakika limit)
- **Beklenti**: "Maksimum 4 saat seçebilirsiniz" uyarısı
- **Test**: Ardışık 5 slot seç

#### 🚫 Parçalı Seçim Engellenmesi
- **Adım**: Slot 1 seç → Slot 3 seç (Slot 2 boş)
- **Beklenti**: Slot 3 seçilmez, sadece ardışık seçim yapılabilir
- **Test**: Arada boşluk bırakarak slotları seç

#### 📅 Geçmiş Tarih Seçilemez
- **Adım**: Tarih seçici ile geçmiş tarih seç
- **Beklenti**: Seçim değişmez veya uyarı mesajı
- **Test**: Dün veya daha geçmiş tarih seç

#### ❌ Rezervasyon İptal Ederkenken

**✅ İptal Edilebilir:**
- Henüz başlamamış (future) rezervasyonlar
- Durum: "aktif", "Musait", "rezerve"

**❌ İptal Edilemez:**
- Başlamış ve devam eden (ongoing) rezervasyonlar
- Tamamlanmış (finished) rezervasyonlar
- Zaten iptal edilmiş

---

### C. Check-in / Check-out

#### ✅ Check-in
- **Adım**: QR Kimlik → QR Tarama → Kamera aç → QR tara
- **Beklenti**: Check-in başarılı, reservation status "başlanmış" olur
- **Test**: Demo hesapla aktif rezervasyon yaratıp test et

#### ✅ Check-out
- **Adım**: Check-in yaptıktan sonra → QR Tarama → QR tara
- **Beklenti**: Check-out başarılı, durum "tamamlandı"
- **Test**: Check-in sonrası check-out yap

#### ⚠️ Geçersiz QR
- **Adım**: Geçersiz / boş QR tara
- **Beklenti**: Hata mesajı "Geçersiz QR" veya benzer
- **Test**: Rastgele QR kodu tara

---

### D. İstatistikler

#### ✅ Metrikleri Görüntüle
- **Adım**: Home → Profile/Stats Tab → "Benim İstatistiklerim"
- **Beklenti**: Metrikler gösterilir (toplam rezervasyon, katılım oranı, vb.)
- **Test**: Demo hesapla kontrol et

#### ⚠️ Eksik Veri Durumu
- **Adım**: Yeni kullanıcı istatistiklere erişir
- **Beklenti**: "-" veya "0" gösterilir, hata değil
- **Test**: Yeni hesapla test et

---

### E. Ceza ve İhlaller

#### ✅ İhlal Listesi
- **Adım**: Menu → Ceza ve İhlaller
- **Beklenti**: İhlal listesi ve puan görüntülenir
- **Test**: Demo hesapla (10 puanlık mock ihlal)

#### ⚠️ Hiç İhlal Yok
- **Adım**: İyi davranışlı kullanıcı ihlal sayfasını açar
- **Beklenti**: Boş liste veya "İhlal bulunmamaktadır."
- **Test**: Yeni hesapla

---

### F. Duyurular

#### ✅ Aktif Duyurular
- **Adım**: Ana Sayfa → "Son Duyurular" bölümü
- **Beklenti**: En fazla 5 duyuru gösterilir
- **Test**: Backend'de duyuru ekle

#### ✅ Duyurular Sayfası
- **Adım**: Menu → Duyurular veya Ana Sayfada Duyuruya tıkla
- **Beklenti**: Detaylı duyuru gösterilir
- **Test**: Duyuru detayını oku

#### ⚠️ Duyuru Yok
- **Adım**: Aktif duyuru olmadığında
- **Beklenti**: "Aktif duyuru bulunmamaktadır."
- **Test**: Tüm duyuruları deaktif et

---

## 🔍 Edge Case'ler (Sınırlandırılmış Durumlar)

### 1. Network Connectivity

**Senaryo**: Uygulamayı çevrimdışı kullan
- **Beklenti**: Hata mesajı "Sunucuya ulaşılamadı"
- **Test**: Uçak moduna al, offline ile test et

**Senaryo**: Yavaş network
- **Beklenti**: Loading state gösterilir, timeout hata mesajı
- **Test**: Network throttling etkinleştir (Browser DevTools)

### 2. Session Timeout

**Senaryo**: Uzun süre uygulamayı açık bırak
- **Beklenti**: Session'u yenilemesi veya logout
- **Test**: Yapılandırma ile session timeout'u test et

### 3. Large Data Lists

**Senaryo**: Çok sayıda rezervasyon / duyuru
- **Beklenti**: Pagination veya lazy loading (mevcut değilse eksiktir)
- **Test**: Backend'e 100+ kayıt ekle

### 4. Concurrent Requests

**Senaryo**: Hızlı şekilde multiple requests
- **Beklenti**: Race condition yok, son state doğru olur
- **Test**: Hızlı sekmeler arasında geçiş yap

### 5. Memory Leak

**Senaryo**: Uzun session, multiple page navigation
- **Beklenti**: App crash etmez, smooth kalır
- **Test**: 30 dakika boyunca sayfalar arası geçiş yap

---

## 📊 Bilinen Sorunlar (Known Issues)

### Issue #1: Slot Seçimi Sırasında Lag
- **Durum**: Birkaç saniye delay
- **Neden**: Büyük slot listesi
- **Fix**: Memoization veya pagination (Planned)

### Issue #2: Duyuru Resmi Yüklenmemi
- **Durum**: Resmi eksik görseller gösterilmez
- **Neden**: Backend resim suportu
- **Fix**: WIP

### Issue #3: Demo Modda Gerçek Zamanlı Update Yok
- **Durum**: Demo modda veri güncellenmez
- **Neden**: Yapı gereği
- **Workaround**: Real account kullan

### Issue #4: Çevirmen Tekrar Yazmaları
- **Durum**: Bazı metinler kötü Türkçe
- **Nedir**: Character encoding veya çeviri hatası
- **Fix**: Hafta 8'de gözden geçirme yapılıyor

---

## ✅ Test Checklist

### Pre-Release Testing
- [ ] Login/Logout flow çalışır
- [ ] Rezervasyon oluşturma ve iptal çalışır
- [ ] Check-in/out QR flow çalışır
- [ ] İstatistikler görüntülenir
- [ ] Duyurular gösterilir
- [ ] UI crash etmez
- [ ] Network hataları gracefully handle edilir
- [ ] Loading states gösterilir
- [ ] Error messages clear
- [ ] Navigation tutarlı

### Performance Testing
- [ ] App launch < 3 saniye
- [ ] Page transition smooth
- [ ] List scrolling fluid
- [ ] No memory leaks
- [ ] Battery usage normal

### Compatibility Testing
- [ ] Android 8+ çalışır
- [ ] iOS 12+ çalışır
- [ ] Multiple device sizes (phone/tablet)
- [ ] Both Portrait/Landscape modes

---

## 🎯 Manual Test Execution

### Test Plan Örneği (Day 1)
1. **09:00-09:30**: Auth Flow (Login, Register, Demo)
2. **09:30-10:30**: Reservation Flow (Create, Cancel)
3. **10:30-11:00**: Break
4. **11:00-11:45**: QR & Check-in/out
5. **11:45-12:15**: Stats & Penalties
6. **12:15-12:30**: Bug reporting

---

## 📱 Test Devices

| Device | OS | Status |
|--------|----|----|
| Pixel 5 | Android 13 | ✅ Tested |
| iPhone 12 | iOS 16 | ✅ Tested |
| Tablet | Android 11 | ⏳ Pending |
| Old Phone | Android 8 | ⏳ Pending |

---

## 🐛 Bug Report Template

```markdown
## Bug: [Başlık]

**Description**
Hata ne olduğu

**Steps to Reproduce**
1. Adım 1
2. Adım 2
3. Adım 3

**Expected Behavior**
Ne olması gerekti

**Actual Behavior**
Gerçekte ne oldu

**Screenshots/Videos**
Ekran görüntüsü veya video

**Device Info**
- Device: Pixel 5
- OS: Android 13
- App Version: 1.0.0
```

---

**Son Güncelleme**: Hafta 8 (13 Mayıs 2026)
