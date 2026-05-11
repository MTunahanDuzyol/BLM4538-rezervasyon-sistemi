import { apiClient } from '../../services/apiClient';
import { isDemoUser } from '../../services/authSession';
import { DEMO_STATS } from '../../services/demoData';

export async function getMyStats() {
  if (isDemoUser()) {
    return { data: DEMO_STATS };
  }

  return apiClient.get('/api/stats/me');
}
