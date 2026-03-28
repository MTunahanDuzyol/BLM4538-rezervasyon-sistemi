import { apiClient } from '../../services/apiClient';

export async function getActiveAnnouncements() {
  return apiClient.get('/api/announcements/active');
}
