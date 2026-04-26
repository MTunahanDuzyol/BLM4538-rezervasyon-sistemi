import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getActiveAnnouncements } from '../features/announcements/api';

const PRIMARY = '#6B998B';

export function HomePage({ navigation, route }) {
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    const message = route?.params?.reservationSuccess;
    if (!message) return;

    setSuccessBanner(message);
    navigation.setParams({ reservationSuccess: undefined });

    const timer = setTimeout(() => {
      setSuccessBanner('');
    }, 4500);

    return () => clearTimeout(timer);
  }, [navigation, route?.params?.reservationSuccess]);

  useEffect(() => {
    let active = true;

    async function loadAnnouncements() {
      try {
        setAnnouncementsLoading(true);
        setAnnouncementsError('');

        const response = await getActiveAnnouncements();
        const payload = Array.isArray(response?.data) ? response.data : [];
        const normalized = payload.slice(0, 5).map((item, index) => ({
          id: String(item?.id ?? item?.Id ?? index + 1),
          title: String(item?.baslik ?? item?.Baslik ?? item?.title ?? item?.Title ?? 'Duyuru'),
          description: String(item?.icerik ?? item?.Icerik ?? item?.aciklama ?? item?.Aciklama ?? item?.description ?? item?.Description ?? ''),
        }));

        if (!active) return;
        setAnnouncements(normalized);
      } catch (err) {
        if (!active) return;
        setAnnouncementsError('Duyurular su an yuklenemiyor.');
      } finally {
        if (active) setAnnouncementsLoading(false);
      }
    }

    loadAnnouncements();
    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Ana Sayfa</Text>
        <View style={styles.topActions}>
          <Pressable style={styles.iconButton} onPress={() => navigation.getParent()?.navigate('MyPage')}>
            <Text style={styles.iconText}>Profil</Text>
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => navigation.getParent()?.navigate('Menu')}>
            <Text style={styles.iconText}>Menu</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {successBanner ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{successBanner}</Text>
          </View>
        ) : null}

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Koltuk rezervasyon durumu"
            placeholderTextColor="#64748b"
          />
          <Pressable
            style={styles.addButton}
            onPress={() => navigation.getParent()?.navigate('ReservationForm')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Son Duyurular</Text>

        {announcementsLoading ? (
          <View style={styles.announcementsStateWrap}>
            <ActivityIndicator color="#6B998B" />
            <Text style={styles.announcementText}>Duyurular yukleniyor...</Text>
          </View>
        ) : null}

        {!announcementsLoading && announcementsError ? (
          <View style={styles.announcementsStateWrap}>
            <Text style={styles.announcementErrorText}>{announcementsError}</Text>
          </View>
        ) : null}

        {!announcementsLoading && !announcementsError && announcements.length === 0 ? (
          <View style={styles.announcementsStateWrap}>
            <Text style={styles.announcementText}>Aktif duyuru bulunmamaktadir.</Text>
          </View>
        ) : null}

        {!announcementsLoading && !announcementsError && announcements.length > 0
          ? announcements.map((announcement) => (
            <View key={announcement.id} style={styles.announcementCard}>
              <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                <Text style={styles.announcementText} numberOfLines={2}>{announcement.description || 'Detay metni yakinda eklenecektir.'}</Text>
              </View>
              <Text style={styles.infoIcon}>i</Text>
            </View>
          ))
          : null}

        <View style={styles.gridRow}>
          <Pressable
            style={styles.featureCard}
            onPress={() => navigation.getParent()?.navigate('ReservationForm')}
          >
            <Text style={styles.featureText}>Koltuk{`\n`}rezervasyonu</Text>
          </Pressable>

          <Pressable style={styles.featureCard} onPress={() => navigation.getParent()?.navigate('LibraryStatus')}>
            <Text style={styles.featureText}>Detaylı{`\n`}bilgi</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    height: 58,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dbe4df',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  iconText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  successBanner: {
    borderWidth: 1,
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  successBannerText: {
    color: '#166534',
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  announcementCard: {
    borderWidth: 1,
    borderColor: '#d5dce2',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  announcementContent: {
    flex: 1,
    paddingRight: 10,
  },
  announcementsStateWrap: {
    borderWidth: 1,
    borderColor: '#d5dce2',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 8,
  },
  announcementTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  announcementText: {
    color: '#1e293b',
    fontSize: 14,
    flex: 1,
  },
  announcementErrorText: {
    color: '#b91c1c',
    fontSize: 14,
    textAlign: 'center',
  },
  infoIcon: {
    color: '#64748b',
    fontSize: 18,
    fontWeight: '700',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d5dce2',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    textAlign: 'center',
    color: '#0f172a',
    fontWeight: '600',
    lineHeight: 20,
  },
});
