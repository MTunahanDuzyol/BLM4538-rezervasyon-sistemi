import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeReturnButton } from '../components/HomeReturnButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { cancelReservation, getMyReservations } from '../features/reservations/api';
import {
  canCancelReservation,
  getReservationCancelHint,
  getReservationId,
  isReservationCancelled,
  normalizeReservationError,
  normalizeReservationStatus,
} from '../features/reservations/businessRules';

function formatReservationText(item) {
  const areaName = item?.alanAdi || item?.kaynakAdi || item?.alanId || 'Alan';
  const date = item?.tarih || item?.date || '-';
  const start = item?.baslangicSaati || item?.startTime || '-';
  const end = item?.bitisSaati || item?.endTime || '-';
  return `${areaName} | ${date} | ${start} - ${end}`;
}

function formatStatusLabel(item) {
  if (isReservationCancelled(item)) return 'Durum: İptal edildi';

  const status = normalizeReservationStatus(item);
  if (!status) return 'Durum: Bilinmiyor';

  if (status.includes('iptal') || status.includes('cancel')) return 'Durum: İptal edildi';
  if (status.includes('tamam') || status.includes('finish') || status.includes('done')) return 'Durum: Tamamlandı';
  if (status.includes('aktif') || status.includes('onay') || status.includes('rezerve')) return 'Durum: Aktif';

  return `Durum: ${status}`;
}

function markReservationCancelled(item) {
  return {
    ...item,
    durum: 'iptal edildi',
    status: 'cancelled',
    islemDurumu: 'iptal edildi',
    iptalEdildiMi: true,
    cancelledAt: new Date().toISOString(),
  };
}

export function MyReservationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);
  const [cancelledReservationIds, setCancelledReservationIds] = useState([]);

  function applyLocalReservationState(reservationItems) {
    return reservationItems.map((item) => {
      const reservationId = getReservationId(item);
      if (!reservationId || !cancelledReservationIds.includes(String(reservationId))) {
        return item;
      }

      return markReservationCancelled(item);
    });
  }

  const loadReservations = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');
      const response = await getMyReservations();
      const payload = Array.isArray(response?.data) ? response.data : [];
      setItems(applyLocalReservationState(payload));
    } catch (err) {
      setError(normalizeReservationError(err, 'Rezervasyonlar yüklenemedi. Lütfen tekrar deneyin.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleCancelReservation = useCallback(async (item) => {
    const reservationId = getReservationId(item);

    if (!reservationId) {
      setError('Rezervasyon kimligi bulunamadi.');
      return;
    }

    if (!canCancelReservation(item)) {
      setError(getReservationCancelHint(item));
      return;
    }

    try {
      setCancelingId(reservationId);
      setError('');
      await cancelReservation(reservationId);
      setCancelledReservationIds((currentIds) => {
        const normalizedId = String(reservationId);
        return currentIds.includes(normalizedId) ? currentIds : [...currentIds, normalizedId];
      });
      setItems((currentItems) =>
        currentItems.map((currentItem) => {
          if (String(getReservationId(currentItem)) !== String(reservationId)) {
            return currentItem;
          }

          return markReservationCancelled(currentItem);
        })
      );
    } catch (err) {
      const message = normalizeReservationError(err, 'Rezervasyon iptal edilemedi.');
      setError(message);
    } finally {
      setCancelingId(null);
    }
  }, [loadReservations]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return (
    <ScreenContainer title="Benim Rezervasyonlarım" subtitle="Rezervasyon saatleri yerel zamanla gosterilir.">
      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator color="#6B998B" />
          <Text style={styles.infoText}>Rezervasyonlar yukleniyor...</Text>
        </View>
      ) : null}

      {!loading && error ? (
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => loadReservations()}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error ? (
        <FlatList
          data={items}
          keyExtractor={(item, index) => String(getReservationId(item) ?? index + 1)}
          onRefresh={() => loadReservations(true)}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <View style={[styles.item, !canCancelReservation(item) && styles.cancelledItem]}>
              <View style={styles.itemHeader}>
                <Text style={styles.titleText}>{formatReservationText(item)}</Text>
                <View style={[styles.badge, !canCancelReservation(item) ? styles.badgeCancelled : styles.badgeActive]}>
                  <Text style={styles.badgeText}>{canCancelReservation(item) ? 'Aktif' : 'İptal edildi'}</Text>
                </View>
              </View>

              <Text style={styles.statusText}>{formatStatusLabel(item)}</Text>

              <Text style={styles.detailText}>İptal durumu: {canCancelReservation(item) ? 'İptal edilebilir' : 'İptal edilemez'}</Text>
              {!canCancelReservation(item) ? (
                <Text style={styles.hintText}>{getReservationCancelHint(item)}</Text>
              ) : null}

              <View style={styles.actionRow}>
                <Pressable
                  style={[
                    styles.cancelButton,
                    (!canCancelReservation(item) || cancelingId === getReservationId(item)) && styles.cancelButtonDisabled,
                  ]}
                  disabled={!canCancelReservation(item) || cancelingId === getReservationId(item)}
                  onPress={() => handleCancelReservation(item)}
                >
                  <Text style={styles.cancelButtonText}>
                    {cancelingId === getReservationId(item) ? 'İptal ediliyor...' : 'Rezervasyonu İptal Et'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.infoText}>Aktif rezervasyon bulunmamaktadır.</Text>}
          ListFooterComponent={<HomeReturnButton />}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  cancelledItem: {
    borderColor: '#fecaca',
    backgroundColor: '#fff7f7',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  titleText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeActive: {
    backgroundColor: '#dcfce7',
  },
  badgeCancelled: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  statusText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  detailText: {
    color: '#1e293b',
  },
  hintText: {
    color: '#b45309',
    fontSize: 12,
    lineHeight: 18,
  },
  actionRow: {
    alignItems: 'flex-start',
    marginTop: 4,
  },
  cancelButton: {
    borderRadius: 10,
    backgroundColor: '#b91c1c',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cancelButtonDisabled: {
    backgroundColor: '#ef4444',
    opacity: 0.55,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  infoText: {
    textAlign: 'center',
    color: '#334155',
  },
  errorText: {
    textAlign: 'center',
    color: '#b91c1c',
    fontWeight: '600',
  },
  retryButton: {
    borderRadius: 10,
    backgroundColor: '#6B998B',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
