import { apiClient } from '../../services/apiClient';

export async function confirmCheckIn(payload) {
  return apiClient.post('/api/CheckIn/confirm', payload);
}

export async function confirmCheckOut(payload) {
  return apiClient.post('/api/CheckOut/confirm', payload);
}
