import { apiClient } from '../../services/apiClient';

export async function getMyViolations() {
  return apiClient.get('/api/ihlal/me');
}

export async function getMyPenaltyScore() {
  return apiClient.get('/api/ihlal/me/puan');
}

export async function runViolationControl() {
  return apiClient.post('/api/ihlal/kontrol');
}

export async function getUserViolations(kullaniciId) {
  return apiClient.get(`/api/ihlal/user/${kullaniciId}`);
}

export async function getUserViolationScore(kullaniciId) {
  return apiClient.get(`/api/ihlal/user/${kullaniciId}/puan`);
}

export async function getAllViolations() {
  return apiClient.get('/api/ihlal/all');
}

export async function getViolationTypes() {
  return apiClient.get('/api/ihlal/tipleri');
}

export async function createViolation(payload) {
  return apiClient.post('/api/ihlal/create', payload);
}

export async function deleteViolation(ihlalId) {
  return apiClient.delete(`/api/ihlal/${ihlalId}`);
}
