function toText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isTruthy(value) {
  if (value === true || value === 1) return true;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'evet';
  }
  return false;
}

function isTerminalStatus(status) {
  return [
    'iptal',
    'iptal edildi',
    'cancel',
    'cancelled',
    'canceled',
    'tamamlandi',
    'tamamlandı',
    'completed',
    'bitmis',
    'bitmiş',
    'finished',
    'done',
    'expired',
    'gecmis',
    'geçmiş',
    'gecmisti',
    'geçmişti',
  ].some((terminal) => status.includes(terminal));
}

export function getReservationId(item) {
  return (
    item?.id ??
    item?.Id ??
    item?._id ??
    item?._Id ??
    item?.rezervasyonId ??
    item?.RezervasyonId ??
    item?.reservationId ??
    item?.ReservationId ??
    item?.kayitId ??
    item?.KayitId ??
    item?.recordId ??
    item?.RecordId ??
    item?.uuid ??
    item?.UUID ??
    null
  );
}

export function normalizeReservationStatus(item) {
  return toText(
    item?.durum ??
      item?.Durum ??
      item?.durumAdi ??
      item?.DurumAdi ??
      item?.status ??
      item?.Status ??
      item?.reservationStatus ??
      item?.ReservationStatus ??
      item?.islemDurumu ??
      item?.IslemDurumu ??
      item?.state ??
      item?.State
  ).toLowerCase();
}

export function isReservationCancelled(item) {
  const status = normalizeReservationStatus(item);
  if (status && (status.includes('iptal') || status.includes('cancel'))) {
    return true;
  }

  if (
    isTruthy(item?.iptalEdildiMi) ||
    isTruthy(item?.IptalEdildiMi) ||
    isTruthy(item?.cancelled) ||
    isTruthy(item?.Cancelled) ||
    isTruthy(item?.isCancelled) ||
    isTruthy(item?.IsCancelled)
  ) {
    return true;
  }

  const cancelledAt =
    item?.cancelledAt ??
    item?.CancelledAt ??
    item?.iptalTarihi ??
    item?.IptalTarihi ??
    item?.iptalZamani ??
    item?.IptalZamani;

  return Boolean(cancelledAt);
}

export function getReservationDateText(item) {
  return toText(item?.tarih ?? item?.Tarih ?? item?.date ?? item?.Date);
}

export function getReservationDateKey(item) {
  const dateText = getReservationDateText(item);
  if (!dateText) return '';

  const isoMatch = dateText.match(/^\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return dateText;

  return date.toISOString().slice(0, 10);
}

export function getReservationStartValue(item) {
  return item?.baslangicSaati ?? item?.BaslangicSaati ?? item?.startTime ?? item?.StartTime ?? null;
}

export function getReservationEndValue(item) {
  return item?.bitisSaati ?? item?.BitisSaati ?? item?.endTime ?? item?.EndTime ?? null;
}

function toHourNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const numeric = Number(String(value).trim());
  if (Number.isFinite(numeric)) return numeric;

  const match = String(value || '').match(/^(\d{1,2})/);
  if (!match) return null;

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getReservationDateTime(item, timeValue) {
  const dateText = getReservationDateText(item);
  const hourValue = toHourNumber(timeValue);
  if (!dateText || hourValue == null) return null;

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return null;

  const hour = ((hourValue % 24) + 24) % 24;
  date.setHours(hour, 0, 0, 0);
  return date;
}

export function isReservationActive(item, now = new Date()) {
  if (isReservationCancelled(item)) return false;

  const status = normalizeReservationStatus(item);
  if (isTerminalStatus(status)) return false;

  const start = getReservationDateTime(item, getReservationStartValue(item));
  const end = getReservationDateTime(item, getReservationEndValue(item));

  if (end && end.getTime() <= now.getTime()) return false;
  if (start && start.getTime() > now.getTime()) return true;
  if (start && end && start.getTime() <= now.getTime() && end.getTime() > now.getTime()) return true;

  return status.length > 0;
}

export function canCancelReservation(item, now = new Date()) {
  if (!getReservationId(item)) return false;

  if (isReservationCancelled(item)) return false;

  const status = normalizeReservationStatus(item);
  if (isTerminalStatus(status)) return false;

  const start = getReservationDateTime(item, getReservationStartValue(item));
  if (start && start.getTime() <= now.getTime()) return false;

  return true;
}

export function getReservationCancelHint(item, now = new Date()) {
  if (!getReservationId(item)) {
    return 'Rezervasyon bilgisi bulunamadı.';
  }

  if (canCancelReservation(item, now)) {
    return '';
  }

  return 'Başlamış, bitmiş veya iptal edilmiş rezervasyonlar iptal edilemez.';
}

export function hasBlockingReservationForDate(reservations, dateKey, now = new Date()) {
  if (!Array.isArray(reservations) || !dateKey) return false;

  return reservations.some((item) => getReservationDateKey(item) === dateKey && isReservationActive(item, now));
}

export function getBlockingReservationForDate(reservations, dateKey, now = new Date()) {
  if (!Array.isArray(reservations) || !dateKey) return null;

  return reservations.find((item) => getReservationDateKey(item) === dateKey && isReservationActive(item, now)) || null;
}

export function normalizeReservationError(error, fallbackMessage = 'Rezervasyon islemi tamamlanamadi.') {
  const data = error?.response?.data;
  const message = toText(
    typeof data === 'string' ? data : data?.error ?? data?.message ?? error?.message ?? fallbackMessage
  );

  const normalized = message.toLowerCase();

  if (normalized.includes('aynı gün içinde yalnızca tek rezervasyon') || normalized.includes('aynı anda sadece 1 aktif rezervasyon') || normalized.includes('aktif rezervasyonunuz var')) {
    return 'Bu işlem için zaten aktif bir rezervasyonunuz var. Önce mevcut rezervasyonu iptal edin.';
  }

  if (normalized.includes('bu saatlerde zaten bir rezervasyonunuz var') || normalized.includes('çakışan rezervasyon')) {
    return 'Seçtiğiniz saat aralığında başka bir rezervasyonunuz var.';
  }

  if (normalized.includes('maksimum 4 saat')) {
    return 'En fazla 4 saatlik ardışık slot seçebilirsiniz.';
  }

  if (normalized.includes('geçmiş saatlere rezervasyon yapamazsınız') || normalized.includes('gecmis saatlere rezervasyon yapamazsiniz')) {
    return 'Geçmiş saatlere rezervasyon yapamazsınız. Lütfen ileri bir saat seçin.';
  }

  if (normalized.includes('slot uygun değil') || normalized.includes('uygun degil') || normalized.includes('doluydu')) {
    return 'Seçtiğiniz slot artık uygun değil. Lütfen listeyi yenileyin.';
  }

  if (normalized.includes('iptal') && normalized.includes('süre')) {
    return 'Bu rezervasyonun iptal süresi geçmiş olabilir.';
  }

  return message || fallbackMessage;
}
