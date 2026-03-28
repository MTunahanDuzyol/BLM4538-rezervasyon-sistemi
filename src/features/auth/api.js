import { apiClient } from '../../services/apiClient';

export async function login(payload) {
  return apiClient.post('/api/auth/login', payload);
}

export async function register(payload) {
  return apiClient.post('/api/auth/register', payload);
}

export async function logout() {
  return apiClient.post('/api/auth/logout');
}

export async function getUserByEmail(email) {
  return apiClient.get('/api/auth/users/by-email', {
    params: { email },
  });
}

export async function getUserBySchoolNo(schoolNo) {
  return apiClient.get('/api/auth/users/by-school-no', {
    params: { schoolNo },
  });
}
