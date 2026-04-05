import { apiClient } from '../../services/apiClient';

const fallbackAnnouncements = [
  {
    id: 'local-1',
    title: 'Sistem Duyurusu',
    description: 'Duyuru servisi baglantisi gecici olarak bulunamadi. Duyurular yakinda tekrar aktif olacaktir.',
  },
];

export async function getActiveAnnouncements() {
  const candidateEndpoints = [
    '/api/announcements/active',
    '/api/announcements',
    '/api/announcement/active',
    '/api/announcement',
    '/api/duyuru/active',
    '/api/duyuru',
    '/api/duyurular/active',
    '/api/duyurular',
  ];

  let lastError = null;

  for (const endpoint of candidateEndpoints) {
    try {
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        throw error;
      }

      lastError = error;
    }
  }

  if (lastError) {
    console.log('[Announcements] API endpointleri basarisiz, fallback duyurular kullaniliyor.', {
      status: lastError?.response?.status,
      message: lastError?.message,
    });
    return { data: fallbackAnnouncements, isFallback: true };
  }

  return { data: fallbackAnnouncements, isFallback: true };
}
