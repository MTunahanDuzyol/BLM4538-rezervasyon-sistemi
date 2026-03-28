import { apiClient } from '../../services/apiClient';

export async function getMyReservations() {
  return apiClient.get('/api/rezervasyon/my');
}

export async function createReservation(payload) {
  return apiClient.post('/api/rezervasyon', payload);
}

export async function cancelReservation(id) {
  return apiClient.post(`/api/rezervasyon/${id}/cancel`);
}

export async function checkInReservation(id) {
  return apiClient.post(`/api/rezervasyon/${id}/checkin`);
}

export async function checkOutReservation(id) {
  return apiClient.post(`/api/rezervasyon/${id}/checkout`);
}

export async function getReservationSlots(params) {
  return apiClient.get('/api/rezervasyon/slots', { params });
}

export async function reserveSlot(payload) {
  return apiClient.post('/api/rezervasyon/slots/reserve', payload);
}

export async function reserveDay(payload) {
  return apiClient.post('/api/rezervasyon/day/reserve', payload);
}
