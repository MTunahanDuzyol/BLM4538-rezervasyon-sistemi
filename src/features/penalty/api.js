import { apiClient } from '../../services/apiClient';

export async function getMyViolations() {
  return apiClient.get('/api/Ihlal/me');
}

export async function getMyPenaltyScore() {
  return apiClient.get('/api/Ihlal/me/puan');
}

export async function runViolationControl() {
  return apiClient.post('/api/Ihlal/kontrol');
}
