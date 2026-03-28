import { apiClient } from '../../services/apiClient';

export async function confirmCheckIn(reservationId) {
  return apiClient.post(`/api/rezervasyon/${reservationId}/checkin`);
}

export async function confirmCheckOut(reservationId) {
  return apiClient.post(`/api/rezervasyon/${reservationId}/checkout`);
}
