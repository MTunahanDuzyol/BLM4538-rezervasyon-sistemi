import { apiClient } from '../../services/apiClient';

export async function getResources() {
  return apiClient.get('/api/alan');
}

export async function getAvailability(resourceId, date) {
  return apiClient.get('/api/availability', {
    params: { resourceId, date },
  });
}
