import { apiClient } from '../../services/apiClient';

export async function getMyStats() {
  return apiClient.get('/api/stats/me');
}
