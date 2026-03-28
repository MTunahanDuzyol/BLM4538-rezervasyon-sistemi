import { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

function FieldTile({ label, value, onPress }) {
  return (
    <Pressable style={styles.field} onPress={onPress}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </Pressable>
  );
}

export function ReservationFormPage({ navigation }) {
  const [reservationDate, setReservationDate] = useState(new Date());
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(Math.max(8, now.getHours()));
    return now;
  });
  const [endTime, setEndTime] = useState(() => {
    const next = new Date();
    next.setMinutes(0, 0, 0);
    next.setHours(Math.max(9, next.getHours() + 1));
    return next;
  });
  const [pickerTarget, setPickerTarget] = useState('date');
  const [showPicker, setShowPicker] = useState(false);

  const formattedDate = useMemo(() => {
    return reservationDate.toLocaleDateString('tr-TR');
  }, [reservationDate]);

  const formattedStart = useMemo(() => {
    return startTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }, [startTime]);

  const formattedEnd = useMemo(() => {
    return endTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }, [endTime]);

  const dateOptions = useMemo(() => {
    return Array.from({ length: 14 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      date.setHours(0, 0, 0, 0);
      return {
        key: date.toISOString(),
        label: date.toLocaleDateString('tr-TR', {
          weekday: 'short',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        value: date,
      };
    });
  }, []);

  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 8; hour <= 23; hour += 1) {
      for (let minute = 0; minute <= 30; minute += 30) {
        const label = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        options.push({ key: label, label, hour, minute });
      }
    }
    return options;
  }, []);

  function openPicker(target) {
    setPickerTarget(target);
    setShowPicker(true);
  }

  function selectDate(value) {
    const next = new Date(reservationDate);
    next.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
    setReservationDate(next);
    setShowPicker(false);
  }

  function selectTime(hour, minute) {
    const next = pickerTarget === 'start' ? new Date(startTime) : new Date(endTime);
    next.setHours(hour, minute, 0, 0);

    if (pickerTarget === 'start') {
      setStartTime(next);
    } else {
      setEndTime(next);
    }

    setShowPicker(false);
  }

  function handleContinue() {
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

    if (endMinutes <= startMinutes) {
      Alert.alert('Geçersiz saat', 'Bitiş saati başlangıç saatinden sonra olmalıdır.');
      return;
    }

    navigation.navigate('ReservationMap', {
      date: reservationDate.toISOString(),
      startTime: formattedStart,
      endTime: formattedEnd,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.headerTitle}>Koltuk Rezervasyonu</Text></View>
      <View style={styles.content}>
        <FieldTile label="Rezerve Tarihi" value={formattedDate} onPress={() => openPicker('date')} />
        <FieldTile label="Başlangıç Saati" value={formattedStart} onPress={() => openPicker('start')} />
        <FieldTile label="Bitiş Saati" value={formattedEnd} onPress={() => openPicker('end')} />

        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryText}>Kaydet / Devam</Text>
        </Pressable>
      </View>

      <Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {pickerTarget === 'date' ? 'Tarih Seçin' : pickerTarget === 'start' ? 'Başlangıç Saati Seçin' : 'Bitiş Saati Seçin'}
            </Text>

            <ScrollView style={styles.modalList}>
              {pickerTarget === 'date'
                ? dateOptions.map((item) => (
                    <Pressable key={item.key} style={styles.optionItem} onPress={() => selectDate(item.value)}>
                      <Text style={styles.optionText}>{item.label}</Text>
                    </Pressable>
                  ))
                : timeOptions.map((item) => (
                    <Pressable
                      key={item.key}
                      style={styles.optionItem}
                      onPress={() => selectTime(item.hour, item.minute)}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                    </Pressable>
                  ))}
            </ScrollView>

            <Pressable style={styles.cancelButton} onPress={() => setShowPicker(false)}>
              <Text style={styles.cancelText}>Vazgeç</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, borderBottomWidth: 1, borderBottomColor: '#dbe4df', justifyContent: 'center', paddingHorizontal: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  content: { padding: 16, gap: 12 },
  field: {
    borderWidth: 1,
    borderColor: '#d4dde3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldLabel: { color: '#0f172a', fontWeight: '500' },
  fieldValue: { color: '#334155', fontWeight: '600' },
  primaryButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B998B',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d4dde3',
    padding: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  modalList: {
    marginBottom: 10,
  },
  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },
  optionText: {
    color: '#0f172a',
    fontWeight: '500',
  },
  cancelButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  cancelText: {
    color: '#0f172a',
    fontWeight: '600',
  },
});
