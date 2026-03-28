import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getAvailability, getResources } from '../features/resources/api';

export function ReservationMapPage({ route }) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const selectedDate = route?.params?.date;
  const selectedStart = route?.params?.startTime;
  const selectedEnd = route?.params?.endTime;

  const dateParam = useMemo(() => {
    if (!selectedDate) return null;
    const date = new Date(selectedDate);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  useEffect(() => {
    let active = true;

    async function loadSeats() {
      try {
        setLoading(true);
        setLoadError('');

        const resourcesResponse = await getResources();
        const resourceItems = Array.isArray(resourcesResponse?.data) ? resourcesResponse.data : [];

        const normalized = resourceItems.slice(0, 24).map((item, index) => {
          const id = item?.id ?? item?.Id ?? item?.alanId ?? item?.AlanId ?? String(index + 1);
          const name = item?.ad ?? item?.Ad ?? item?.adi ?? item?.Adi ?? item?.name ?? item?.Name ?? `Masa ${index + 1}`;
          return { id: String(id), name: String(name), available: true };
        });

        const nextSeats = await Promise.all(
          normalized.map(async (seat) => {
            try {
              if (!dateParam) return seat;

              const availabilityResponse = await getAvailability(seat.id, dateParam);
              const slots = Array.isArray(availabilityResponse?.data) ? availabilityResponse.data : [];

              const isAvailable = checkSeatAvailability(slots, selectedStart, selectedEnd);
              return { ...seat, available: isAvailable };
            } catch (error) {
              return { ...seat, available: false };
            }
          })
        );

        if (!active) return;
        setSeats(nextSeats);
      } catch (error) {
        if (!active) return;
        setLoadError('Masaların doluluk bilgisi alınamadı.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSeats();
    return () => {
      active = false;
    };
  }, [dateParam, selectedStart, selectedEnd]);

  const summaryText = selectedDate
    ? `${new Date(selectedDate).toLocaleDateString('tr-TR')} | ${selectedStart || '-'} - ${selectedEnd || '-'}`
    : 'Tarih/saat seçimi yapılmadı.';

  function handleSeatPress(seat) {
    if (!seat.available) {
      Alert.alert('Masa Dolu', 'Bu masa seçtiğiniz saat aralığında uygun değil.');
      return;
    }
    setSelectedSeat(seat.id);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.headerTitle}>Koltuk Rezervasyonu</Text></View>
      <View style={styles.content}>
        <Text style={styles.floorText}>5F</Text>
        <Text style={styles.summary}>{summaryText}</Text>
        <View style={styles.mapCard}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#6B998B" />
              <Text style={styles.loadingText}>Masa uygunlukları yükleniyor...</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {seats.map((seat) => {
                const selected = selectedSeat === seat.id;
                const occupied = !seat.available;
                return (
                  <Pressable
                    key={seat.id}
                    style={[styles.seat, selected && styles.seatSelected, occupied && styles.seatOccupied]}
                    onPress={() => handleSeatPress(seat)}
                  >
                    <Text style={[styles.seatText, selected && styles.seatTextSelected, occupied && styles.seatTextOccupied]}>
                      {seat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}
        </View>

        <Pressable style={[styles.confirmButton, !selectedSeat && styles.confirmDisabled]} disabled={!selectedSeat}>
          <Text style={styles.confirmText}>Onayla</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function parseHourMinute(value) {
  if (!value || typeof value !== 'string') return null;
  const [h, m] = value.split(':');
  const hh = Number(h);
  const mm = Number(m);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

function slotStartToMinute(slot) {
  const raw = slot?.baslangicZamani ?? slot?.BaslangicZamani ?? slot?.startTime ?? slot?.StartTime ?? '';
  const text = String(raw);
  const match = text.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function checkSeatAvailability(slots, selectedStart, selectedEnd) {
  const start = parseHourMinute(selectedStart);
  const end = parseHourMinute(selectedEnd);

  if (start == null || end == null || end <= start) return false;

  const required = [];
  for (let minute = start; minute < end; minute += 60) {
    required.push(minute);
  }

  return required.every((requiredMinute) => {
    const matchingSlot = slots.find((slot) => slotStartToMinute(slot) === requiredMinute);
    if (!matchingSlot) return false;
    const available = matchingSlot?.uygunMu ?? matchingSlot?.UygunMu ?? matchingSlot?.isAvailable;
    return available === true;
  });
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, borderBottomWidth: 1, borderBottomColor: '#dbe4df', justifyContent: 'center', paddingHorizontal: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  content: { flex: 1, padding: 16 },
  floorText: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 10 },
  summary: {
    color: '#334155',
    marginBottom: 10,
    fontWeight: '500',
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  loadingText: {
    color: '#334155',
  },
  mapCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d4dde3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  seat: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  seatSelected: { backgroundColor: '#6B998B', borderColor: '#6B998B' },
  seatOccupied: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  seatText: { color: '#0f172a', fontWeight: '600' },
  seatTextSelected: { color: '#fff' },
  seatTextOccupied: {
    color: '#9ca3af',
  },
  errorText: {
    marginTop: 12,
    color: '#b91c1c',
    textAlign: 'center',
  },
  confirmButton: { height: 46, borderRadius: 10, backgroundColor: '#6B998B', alignItems: 'center', justifyContent: 'center' },
  confirmDisabled: { opacity: 0.4 },
  confirmText: { color: '#fff', fontWeight: '700' },
});
