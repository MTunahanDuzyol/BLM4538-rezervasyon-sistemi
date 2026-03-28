import { apiClient } from '../../services/apiClient';

export async function sendDiagnosticsTestEmail(payload) {
  return apiClient.post('/api/admin/diagnostics/test-email', payload);
}

export async function sendQrTestEmail(payload) {
  return apiClient.post('/api/adminqr/test-email', payload);
}

export async function ensureQrCodes() {
  return apiClient.post('/api/adminqr/ensure-codes');
}

export async function getQrResourceCode(kaynakId) {
  return apiClient.get(`/api/adminqr/resource/${kaynakId}/code`);
}

export async function getQrResources() {
  return apiClient.get('/api/adminqr/resources');
}
