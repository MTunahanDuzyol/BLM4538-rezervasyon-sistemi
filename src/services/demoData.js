export const DEMO_ACCOUNT = {
  identity: 'demo@kursu.local',
  password: 'Demo1234!',
  user: {
    id: 'demo-user',
    email: 'demo@kursu.local',
    adSoyad: 'Demo Kullanıcı',
    rol: 'demo',
    okulNo: '999999',
    isDemo: true,
    demoData: {
      stats: {
        user: {
          id: 'demo-user',
          email: 'demo@kursu.local',
          adSoyad: 'Demo Kullanıcı',
          rol: 'demo',
        },
        ceza: {
          toplamPuan: 10,
          maxPuan: 30,
          rezervasyonYapabilir: true,
          ihlalSayisi: 1,
          ihlalOzet: [
            {
              tipAdi: 'Geç Çıkış',
              puan: 10,
              aciklama: 'Çıkış işlemi 10 dakika gecikti.',
              tarih: '2026-05-10',
            },
          ],
        },
        kullanim: {
          rezervasyonToplam: 8,
          rezervasyonDurumlari: [
            { durum: 'Aktif', adet: 2 },
            { durum: 'Tamamlanan', adet: 5 },
            { durum: 'İptal', adet: 1 },
          ],
          girisKaydiToplam: 6,
          girisKaydiAcik: 2,
          girisKaydiTamamlanan: 4,
          katilimOrani: '75%',
        },
        recentIhlaller: [
          {
            id: 'demo-violation-1',
            tipAdi: 'Geç Çıkış',
            puan: 10,
            aciklama: 'Çıkış işlemi 10 dakika gecikti.',
            tarih: '2026-05-10',
          },
        ],
        serverTimeUtc: '2026-05-11T09:29:38.1269733Z',
      },
      penalty: {
        score: 10,
        violations: [
          {
            id: 'demo-violation-1',
            tipAdi: 'Geç Çıkış',
            puan: 10,
            aciklama: 'Çıkış işlemi 10 dakika gecikti.',
            tarih: '2026-05-10',
          },
        ],
      },
      reservations: [
        {
          id: 'demo-res-1',
          alanAdi: 'Sessiz Çalışma Alanı',
          tarih: '2026-05-12',
          baslangicSaati: '09:00',
          bitisSaati: '11:00',
          durum: 'aktif',
        },
        {
          id: 'demo-res-2',
          alanAdi: 'Bilgisayar Odası',
          tarih: '2026-05-09',
          baslangicSaati: '13:00',
          bitisSaati: '15:00',
          durum: 'tamamlandı',
        },
        {
          id: 'demo-res-3',
          alanAdi: 'Toplantı Odası',
          tarih: '2026-05-08',
          baslangicSaati: '10:00',
          bitisSaati: '11:00',
          durum: 'iptal edildi',
          iptalEdildiMi: true,
        },
      ],
    },
  },
};

export const DEMO_STATS = DEMO_ACCOUNT.user.demoData.stats;
export const DEMO_PENALTY = DEMO_ACCOUNT.user.demoData.penalty;
export const DEMO_RESERVATIONS = DEMO_ACCOUNT.user.demoData.reservations;