import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';

export function SettingsPage() {
  const [notif, setNotif] = useState(true);
  const [lang, setLang] = useState('tr');

  const languages = [
    { key: 'kr', label: '한국어 (KORECE)' },
    { key: 'en', label: '영어 (ENGLISH)' },
    { key: 'tr', label: 'Türkçe (TURKISH)' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.headerTitle}>Ayarlar</Text></View>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.cardTitle}>Bildirimler</Text>
            <Switch value={notif} onValueChange={setNotif} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dil (LANGUAGE)</Text>
        <View style={styles.card}>
          {languages.map((item, idx) => {
            const selected = lang === item.key;
            return (
              <Pressable key={item.key} style={[styles.langRow, idx > 0 && styles.langBorder]} onPress={() => setLang(item.key)}>
                <Text style={styles.langText}>{item.label}</Text>
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected ? <View style={styles.radioInner} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, borderBottomWidth: 1, borderBottomColor: '#dbe4df', justifyContent: 'center', paddingHorizontal: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  content: { padding: 16, gap: 12 },
  sectionTitle: { fontWeight: '700', color: '#0f172a' },
  card: { borderWidth: 1, borderColor: '#d4dde3', borderRadius: 12, backgroundColor: '#fff' },
  switchRow: { paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, color: '#0f172a' },
  langRow: { paddingHorizontal: 14, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  langBorder: { borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  langText: { color: '#0f172a' },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#6B998B' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6B998B' },
});
