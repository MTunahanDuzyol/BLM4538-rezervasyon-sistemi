import { apiClient } from '../../services/apiClient';

export async function getMyStats() {
  return apiClient.get('/api/Stats/me');
}
