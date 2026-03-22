import { apiClient } from '../../services/apiClient';

export async function getAdminOverview() {
  return apiClient.get('/api/Admin/overview');
}
