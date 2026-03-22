import { apiClient } from '../../services/apiClient';

export async function getMyReservations() {
  return apiClient.get('/api/Rezervasyon/my');
}

export async function createReservation(payload) {
  return apiClient.post('/api/Rezervasyon', payload);
}

export async function cancelReservation(id) {
  return apiClient.post(`/api/Rezervasyon/${id}/cancel`);
}
