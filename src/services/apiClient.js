import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://example.com',
  timeout: 10000,
  withCredentials: true,
});
