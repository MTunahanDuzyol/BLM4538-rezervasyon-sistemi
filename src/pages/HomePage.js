import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const PRIMARY = '#6B998B';

export function HomePage({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Ana Sayfa</Text>
        <View style={styles.topActions}>
          <Pressable style={styles.iconButton} onPress={() => navigation.navigate('ProfileStats')}>
            <Text style={styles.iconText}>Profil</Text>
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => navigation.navigate('Resources')}>
            <Text style={styles.iconText}>Menu</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Koltuk rezervasyon durumu"
            placeholderTextColor="#64748b"
          />
          <Pressable
            style={styles.addButton}
            onPress={() => navigation.getParent()?.navigate('ReservationCreate')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Son Duyurular</Text>
        <Pressable style={styles.announcementCard}>
          <Text style={styles.announcementText}>Kullanım bilgisi bulunamamaktadır.</Text>
          <Text style={styles.infoIcon}>i</Text>
        </Pressable>

        <View style={styles.gridRow}>
          <Pressable
            style={styles.featureCard}
            onPress={() => navigation.getParent()?.navigate('ReservationCreate')}
          >
            <Text style={styles.featureText}>Koltuk{`\n`}rezervasyonu</Text>
          </Pressable>

          <Pressable style={styles.featureCard} onPress={() => navigation.navigate('Resources')}>
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
  announcementText: {
    color: '#1e293b',
    fontSize: 14,
    flex: 1,
    paddingRight: 10,
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
