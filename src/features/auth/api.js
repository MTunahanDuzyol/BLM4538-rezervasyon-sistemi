import { apiClient } from '../../services/apiClient';

export async function login(payload) {
  return apiClient.post('/api/Auth/login', payload);
}

export async function register(payload) {
  return apiClient.post('/api/Auth/register', payload);
}

export async function logout() {
  return apiClient.post('/api/Auth/logout');
}
