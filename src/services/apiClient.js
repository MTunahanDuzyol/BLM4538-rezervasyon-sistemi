import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.select({
  android: 'http://10.0.2.2:5259',
  default: 'http://localhost:5259',
});

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('[API] Request', {
      method: config.method,
      url: `${config.baseURL || ''}${config.url || ''}`,
    });
    return config;
  },
  (error) => {
    console.log('[API] Request setup failed', { message: error?.message });
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('[API] Response', {
      status: response.status,
      url: `${response.config?.baseURL || ''}${response.config?.url || ''}`,
    });
    return response;
  },
  (error) => {
    console.log('[API] Response failed', {
      status: error?.response?.status,
      message: error?.message,
      url: `${error?.config?.baseURL || ''}${error?.config?.url || ''}`,
    });
    return Promise.reject(error);
  }
);
