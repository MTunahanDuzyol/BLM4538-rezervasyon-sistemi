# KURSU Mobile

Bu proje, kutuphane rezervasyon sistemi icin gelistirilen Expo React Native mobil istemcisidir.
Asagidaki ozet, su ana kadar yapilanlari hafta bazinda sade sekilde anlatir.

## Hafta 1 - Temel Kurulum ve Iskelet

- Proje Expo ile ayaga kaldirildi.
- Temel bagimliliklar yuklendi.
- `src` altinda feature tabanli klasor yapisi olusturuldu.
- Stack ve tab tabanli navigasyon kuruldu.
- Ana ekranlarin ilk iskeletleri eklendi.

## Hafta 2 - Kimlik Dogrulama ve Rezervasyon Akisi

- Login ve Register ekranlari tasarim + backend entegrasyonu ile calisir hale getirildi.
- API istemcisi ve endpoint katmani duzenlendi.
- Rezervasyon formu ve masa secim akisi kuruldu.
- Masa doluluk kontrolu API verisi ile calisir hale getirildi.
- Rezervasyon onaylama akisinda hata/uyari durumlari ele alindi.

## Hafta 3 - Kaynaklar ve Duyurular

- Kaynak listeleme mock veriden cikarilip gercek API verisine baglandi.
- Kaynak detay ekrani eklendi.
- Ana sayfadaki duyuru alani aktif duyurulari API'den okuyacak sekilde guncellendi.
- Duyurular icin ayri ekran olusturuldu ve listeleme davranisi eklendi.

## Hafta 4 - Slot Listeleme ve Rezervasyon

- Rezervasyon akisi tarih secimi + masa secimi + 60 dakikalik slot secimi olacak sekilde guncellendi.
- Slot listesi backend'deki `GET /api/rezervasyon/slots` endpointinden alinip ekranda gosterilmeye baslandi.
- Sadece uygun (Musait) slotlar secilebilir hale getirildi.
- Rezervasyon olusturma, secilen slot icin `POST /api/rezervasyon/slots/reserve` ile calisacak sekilde tamamlandi.
- Coklu slot secimi eklendi: kullanici sadece ardisik slotlardan secim yapabilir ve bir gunde en fazla 4 saatlik aralik secilebilir.
- Parcali secim (arada bosluk birakarak slot toplama) arayuz seviyesinde engellendi.

## Mevcut Ekranlar (Ozet)

- Login / Register
- Ana Sayfa
- Duyurular
- Kaynak Listesi / Kaynak Detay
- Rezervasyon Formu / Rezervasyon Haritasi
- Rezervasyonlarim
- Menu, Profil, Ayarlar
- QR islemleri (Check-in / Check-out / Mobile Pass)
- Istatistik, Ceza-Ihlal, Admin

## Calistirma

1. Bagimliliklari yukleyin:
   `npm install`
2. Gelistirme sunucusunu baslatin:
   `npm run start`
3. Istege bagli platform komutlari:
   `npm run android`
   `npm run ios`
   `npm run web`

## Kisa Not

Bazi ekranlarda is kurali ve veri detaylari gelistirme surecinde asamali olarak derinlestirilecektir.

