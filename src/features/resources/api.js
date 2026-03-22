import { apiClient } from '../../services/apiClient';

export async function getResources() {
  return apiClient.get('/api/Alan');
}

export async function getAvailability(resourceId, date) {
  return apiClient.get('/api/Availability', {
    params: { resourceId, date },
  });
}
