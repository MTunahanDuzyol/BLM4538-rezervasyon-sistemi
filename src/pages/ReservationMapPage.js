import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getResources } from '../features/resources/api';
import { createReservationWithConfig, getMyReservations, getReservationSlots, reserveSlotWithConfig } from '../features/reservations/api';
import {
  getBlockingReservationForDate,
  normalizeReservationError,
} from '../features/reservations/businessRules';
import { getAuthUser } from '../services/authSession';

export function ReservationMapPage({ navigation, route }) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSeatInfo, setSelectedSeatInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [slotsError, setSlotsError] = useState('');
  const [confirmStatus, setConfirmStatus] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const selectedDate = route?.params?.date;

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

        if (!active) return;
        setSeats(normalized);
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
  }, [dateParam]);

  const summaryText = selectedDate
    ? `${new Date(selectedDate).toLocaleDateString('tr-TR')} | 60 dk slot secimi`
    : 'Tarih seçimi yapılmadı.';

  const selectedReservationSummary = selectedSeatInfo && selectedRange
    ? `${selectedSeatInfo.name} | ${formatHourLabel(selectedRange.start)} - ${formatHourLabel(selectedRange.end)}`
    : selectedSeatInfo
      ? `${selectedSeatInfo.name} | Slot secimi bekleniyor`
      : 'Henüz masa seçilmedi.';

  async function handleSeatPress(seat) {
    setSelectedSeat(seat.id);
    setSelectedSeatInfo(seat);
    setSelectedRange(null);
    setSlots([]);
    setSlotsError('');

    if (!dateParam) return;

    try {
      setSlotsLoading(true);
      const slotResponse = await getReservationSlots({ alanId: seat.id, tarih: dateParam });
      const slotItems = Array.isArray(slotResponse?.data?.slotlar)
        ? slotResponse.data.slotlar
        : Array.isArray(slotResponse?.data?.Slotlar)
          ? slotResponse.data.Slotlar
          : [];

      const normalizedSlots = slotItems
        .map((item) => ({
          hour: item?.saat ?? item?.Saat,
          status: String(item?.durum ?? item?.Durum ?? 'Calismiyor'),
          kalanKapasite: item?.kalanKapasite ?? item?.KalanKapasite ?? 0,
        }))
        .filter((item) => Number.isInteger(item.hour))
        .sort((a, b) => a.hour - b.hour);

      setSlots(normalizedSlots);
    } catch (error) {
      setSlotsError('Slot bilgileri alinamadi. Baska bir masa deneyin.');
    } finally {
      setSlotsLoading(false);
    }
  }

  function isSlotAvailable(hour) {
    return slots.some((slot) => slot.hour === hour && slot.status === 'Musait');
  }

  function handleSlotPress(hour) {
    if (!isSlotAvailable(hour)) return;

    if (!selectedRange) {
      setSelectedRange({ start: hour, end: hour + 1 });
      return;
    }

    const duration = selectedRange.end - selectedRange.start;
    const isSingle = duration === 1;

    if (hour === selectedRange.start && isSingle) {
      setSelectedRange(null);
      return;
    }

    // Sadece ardışık genişletmeye izin ver (parçalı boşluk engeli)
    if (hour === selectedRange.end && duration < 4 && isSlotAvailable(hour)) {
      setSelectedRange({ start: selectedRange.start, end: selectedRange.end + 1 });
      return;
    }

    if (hour + 1 === selectedRange.start && duration < 4 && isSlotAvailable(hour)) {
      setSelectedRange({ start: selectedRange.start - 1, end: selectedRange.end });
      return;
    }

    // Aralığın sadece kenarlarından daraltmaya izin ver
    if (hour === selectedRange.start && duration > 1) {
      setSelectedRange({ start: selectedRange.start + 1, end: selectedRange.end });
      return;
    }

    if (hour + 1 === selectedRange.end && duration > 1) {
      setSelectedRange({ start: selectedRange.start, end: selectedRange.end - 1 });
      return;
    }

    // Aralığın ortasındaki veya uzak bir slota basılırsa yeni ardışık seçim başlat
    setSelectedRange({ start: hour, end: hour + 1 });
  }

  function navigateToHome(successMessage) {
    const homeParams = successMessage ? { reservationSuccess: successMessage } : undefined;

    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Home', params: homeParams } }],
      });
      return;
    } catch (error) {
      // no-op: try fallback navigation methods below
    }

    const parent = navigation.getParent();
    if (parent && typeof parent.reset === 'function') {
      try {
        parent.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'Home', params: homeParams } }],
        });
        return;
      } catch (error) {
        // no-op: final fallback below
      }
    }

    navigation.navigate('Main', { screen: 'Home', params: homeParams });
  }

  async function handleConfirm() {
    if (!selectedSeat || !selectedSeatInfo) return;

    if (!dateParam) {
      setConfirmStatus('Tarih bilgisi eksik.');
      Alert.alert('Tarih Hatası', 'Rezervasyon tarihi bulunamadı. Lütfen yeniden seçim yapın.');
      return;
    }

    const activeUser = getAuthUser();
    const requesterEmail = activeUser?.email || activeUser?.Email || '';

    if (!requesterEmail) {
      setConfirmStatus('Oturum bilgisi eksik. Lutfen yeniden giris yapin.');
      Alert.alert('Oturum Hatası', 'Kullanıcı bilgisi bulunamadı. Lütfen yeniden giriş yapın.');
      return;
    }

    if (!selectedRange) {
      setConfirmStatus('Lutfen 60 dakikalik bir slot secin.');
      Alert.alert('Slot Secimi', 'Rezervasyon icin 60 dakikalik bir slot secmelisiniz.');
      return;
    }

    const startHour = selectedRange.start;
    const endHour = selectedRange.end;

    if (!areSelectedSlotsAvailable(slots, startHour, endHour)) {
      const slotMessage = 'Seçilen slotlar artık uygun değil. Lütfen listeyi yenileyin.';
      setConfirmStatus(slotMessage);
      setConfirmError(slotMessage);
      Alert.alert('Slot Uygun Değil', slotMessage);
      return;
    }

    try {
      setConfirming(true);
      setConfirmError('');
      setConfirmStatus('Mevcut rezervasyonlar kontrol ediliyor...');

      const reservationsResponse = await getMyReservations();
      const reservations = Array.isArray(reservationsResponse?.data) ? reservationsResponse.data : [];
      const blockingReservation = getBlockingReservationForDate(reservations, dateParam);

      if (blockingReservation) {
        const blockMessage = 'Bu gün için zaten aktif bir rezervasyonunuz var. Önce mevcut rezervasyonu iptal edin.';
        setConfirmStatus(blockMessage);
        setConfirmError(blockMessage);
        Alert.alert('Rezervasyon Sınırı', blockMessage);
        return;
      }

      setConfirmStatus('Rezervasyon istegi gonderiliyor...');
      console.log('[ReservationMap] Confirm pressed', {
        seatId: selectedSeat,
        seatName: selectedSeatInfo.name,
        date: selectedDate,
        startHour,
        endHour,
        selectedDuration: endHour - startHour,
      });

      const reservePayload = {
        AlanId: String(selectedSeat),
        Tarih: dateParam,
        BaslangicSaati: startHour,
        BitisSaati: endHour,
        RequesterEmail: String(requesterEmail).trim(),
        KullaniciEmail: String(requesterEmail).trim(),
      };

      await reserveSlotWithConfig(reservePayload, { timeout: 12000 });

      const successMessage = `${formatDisplayDate(selectedDate)} tarihli rezervasyonunuz ${selectedSeatInfo.name} icin ${formatHourLabel(startHour)}-${formatHourLabel(endHour)} araliginda olusturuldu.`;
      setConfirmError('');
      setConfirmStatus('Rezervasyon basarili, ana sayfaya yonlendiriliyorsunuz...');

      if (Platform.OS === 'web') {
        navigateToHome(successMessage);
      } else {
        Alert.alert('Rezervasyon Başarılı', successMessage);
        navigateToHome(successMessage);
      }
    } catch (error) {
      const status = error?.response?.status;
      const primaryMessage = friendlyReservationError(error);
      console.log('[ReservationMap] Confirm failed', {
        message: primaryMessage,
        status,
      });

      const shouldFallback = !status || status >= 500 || String(primaryMessage || '').toLowerCase().includes('timeout');
      let finalErrorMessage = primaryMessage;

      if (shouldFallback) {
        try {
          setConfirmStatus('Ana rezervasyon yolunda sorun olustu, alternatif yol deneniyor...');

          await createReservationWithConfig(
            {
              AlanId: String(selectedSeat),
              BaslangicZamani: buildIsoDateTime(dateParam, startHour),
              BitisZamani: buildIsoDateTime(dateParam, endHour),
              RequesterEmail: String(requesterEmail).trim(),
              KullaniciEmail: String(requesterEmail).trim(),
              KisiSayisi: 1,
            },
            { timeout: 12000 }
          );

          setConfirmStatus('Rezervasyon basarili (alternatif yol), ana sayfaya yonlendiriliyorsunuz...');
          const successMessage = `${formatDisplayDate(selectedDate)} tarihli rezervasyonunuz ${selectedSeatInfo.name} icin ${formatHourLabel(startHour)}-${formatHourLabel(endHour)} araliginda olusturuldu.`;
          if (Platform.OS === 'web') {
            navigateToHome(successMessage);
          } else {
            Alert.alert('Rezervasyon Başarılı', successMessage);
            navigateToHome(successMessage);
          }
          return;
        } catch (fallbackError) {
          const fallbackMessage = friendlyReservationError(fallbackError, 'Alternatif rezervasyon yolu da başarısız oldu.');
          console.log('[ReservationMap] Fallback failed', {
            message: fallbackMessage,
            status: fallbackError?.response?.status,
          });
          finalErrorMessage = fallbackMessage || primaryMessage;
        }
      }

      setConfirmStatus('Rezervasyon olusturulamadi.');
      setConfirmError(finalErrorMessage);
      Alert.alert('Rezervasyon Hatası', finalErrorMessage || 'Rezervasyon oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setConfirming(false);
    }
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
                return (
                  <Pressable
                    key={seat.id}
                    style={[styles.seat, selected && styles.seatSelected]}
                    onPress={() => handleSeatPress(seat)}
                  >
                    <Text style={[styles.seatText, selected && styles.seatTextSelected]}>
                      {seat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}
        </View>

        <View style={styles.selectionSummaryCard}>
          <Text style={styles.selectionSummaryLabel}>Seçim Özeti</Text>
          <Text style={styles.selectionSummaryText}>{selectedReservationSummary}</Text>
        </View>

        <View style={styles.slotCard}>
          <View style={styles.slotHeaderRow}>
            <Text style={styles.slotTitle}>60 Dakikalik Slotlar</Text>
            <Pressable
              style={[styles.refreshButton, (!selectedSeatInfo || slotsLoading) && styles.refreshButtonDisabled]}
              disabled={!selectedSeatInfo || slotsLoading}
              onPress={() => loadSlotsForSeat(selectedSeat)}
            >
              <Text style={styles.refreshButtonText}>{slotsLoading ? 'Yukleniyor' : 'Yenile'}</Text>
            </Pressable>
          </View>

          {selectedSeatInfo ? <Text style={styles.slotSubtitle}>Secili masa: {selectedSeatInfo.name}</Text> : <Text style={styles.slotSubtitle}>Slotlari gormek icin once masa secin.</Text>}
          {selectedRange ? (
            <Text style={styles.slotSelectionInfo}>
              Secili aralik: {formatHourLabel(selectedRange.start)} - {formatHourLabel(selectedRange.end)} ({selectedRange.end - selectedRange.start} saat)
            </Text>
          ) : (
            <Text style={styles.slotSelectionInfo}>Kural: Sadece ardışık slot seçilebilir, en fazla 4 saat.</Text>
          )}

          {slotsLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#6B998B" />
              <Text style={styles.loadingText}>Slotlar yukleniyor...</Text>
            </View>
          ) : null}

          {!slotsLoading && slotsError ? <Text style={styles.errorText}>{slotsError}</Text> : null}

          {!slotsLoading && !slotsError && selectedSeatInfo ? (
            <View style={styles.slotGrid}>
              {slots
                .filter((slot) => slot.status !== 'Calismiyor')
                .map((slot) => {
                  const isAvailable = slot.status === 'Musait';
                  const isSelected = Boolean(selectedRange && slot.hour >= selectedRange.start && slot.hour < selectedRange.end);
                  return (
                    <Pressable
                      key={`slot-${slot.hour}`}
                      style={[
                        styles.slotItem,
                        isAvailable ? styles.slotItemAvailable : styles.slotItemBusy,
                        isSelected && styles.slotItemSelected,
                      ]}
                      disabled={!isAvailable}
                      onPress={() => handleSlotPress(slot.hour)}
                    >
                      <Text style={[styles.slotItemText, !isAvailable && styles.slotItemTextBusy]}>
                        {formatHourLabel(slot.hour)} - {formatHourLabel(slot.hour + 1)}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
          ) : null}
        </View>

        <Pressable
          style={[styles.confirmButton, (!selectedSeat || !selectedRange || confirming) && styles.confirmDisabled]}
          disabled={!selectedSeat || !selectedRange || confirming}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>{confirming ? 'İşleniyor...' : 'Onayla'}</Text>
        </Pressable>

        {confirmStatus ? <Text style={styles.statusText}>{confirmStatus}</Text> : null}
        {confirmError ? <Text style={styles.statusErrorText}>{confirmError}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

function extractApiErrorMessage(error, fallbackMessage) {
  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) return data.trim();
  if (typeof data?.error === 'string' && data.error.trim()) return data.error.trim();
  if (typeof data?.message === 'string' && data.message.trim()) return data.message.trim();
  if (typeof error?.message === 'string' && error.message.trim()) return error.message.trim();
  return fallbackMessage;
}

function friendlyReservationError(error, fallbackMessage = 'Rezervasyon oluşturulamadı.') {
  return normalizeReservationError(error, fallbackMessage);
}

function parseHourMinute(value) {
  if (!value || typeof value !== 'string') return null;
  const [h, m] = value.split(':');
  const hh = Number(h);
  const mm = Number(m);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

function buildIsoDateTime(dateText, hour) {
  if (!dateText || hour == null) return null;
  const hh = String(hour).padStart(2, '0');
  return `${dateText}T${hh}:00:00`;
}

function areSelectedSlotsAvailable(slots, startHour, endHour) {
  if (!Array.isArray(slots) || startHour == null || endHour == null || endHour <= startHour) {
    return false;
  }

  for (let hour = startHour; hour < endHour; hour += 1) {
    const slot = slots.find((item) => item.hour === hour);
    if (!slot || slot.status !== 'Musait') {
      return false;
    }
  }

  return true;
}

function formatHourLabel(hour) {
  const normalized = ((hour % 24) + 24) % 24;
  return `${String(normalized).padStart(2, '0')}:00`;
}

function formatDisplayDate(dateText) {
  if (!dateText) return 'Secilen tarih';
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return 'Secilen tarih';
  return date.toLocaleDateString('tr-TR');
}

function slotStartToMinute(slot) {
  const raw = slot?.baslangicZamani ?? slot?.BaslangicZamani ?? slot?.startTime ?? slot?.StartTime ?? '';
  const text = String(raw);
  const match = text.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function checkSeatAvailability(slots, selectedStart, selectedEnd) {
  return areSelectedSlotsAvailable(slots, selectedStart, selectedEnd);
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
  selectionSummaryCard: {
    borderWidth: 1,
    borderColor: '#d4dde3',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    padding: 12,
    marginBottom: 12,
  },
  selectionSummaryLabel: {
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 4,
  },
  selectionSummaryText: {
    color: '#334155',
    lineHeight: 20,
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
  seatText: { color: '#0f172a', fontWeight: '600' },
  seatTextSelected: { color: '#fff' },
  slotCard: {
    borderWidth: 1,
    borderColor: '#d4dde3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  slotTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  slotHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  refreshButton: {
    borderWidth: 1,
    borderColor: '#6B998B',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0fdf4',
  },
  refreshButtonDisabled: {
    opacity: 0.55,
  },
  refreshButtonText: {
    color: '#14532d',
    fontWeight: '700',
    fontSize: 12,
  },
  slotSubtitle: {
    color: '#475569',
    marginBottom: 8,
  },
  slotSelectionInfo: {
    color: '#334155',
    marginBottom: 10,
    fontWeight: '500',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotItem: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  slotItemAvailable: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  slotItemBusy: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  slotItemSelected: {
    borderColor: '#6B998B',
    backgroundColor: '#dcfce7',
  },
  slotItemText: {
    color: '#14532d',
    fontWeight: '600',
    fontSize: 12,
  },
  slotItemTextBusy: {
    color: '#991b1b',
  },
  errorText: {
    marginTop: 12,
    color: '#b91c1c',
    textAlign: 'center',
  },
  confirmButton: { height: 46, borderRadius: 10, backgroundColor: '#6B998B', alignItems: 'center', justifyContent: 'center' },
  confirmDisabled: { opacity: 0.4 },
  confirmText: { color: '#fff', fontWeight: '700' },
  statusText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#334155',
    fontWeight: '500',
  },
  statusErrorText: {
    marginTop: 6,
    textAlign: 'center',
    color: '#b91c1c',
    fontWeight: '600',
  },
});
