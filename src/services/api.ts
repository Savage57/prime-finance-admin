import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('admin_refresh_token');
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', {
            refreshToken
          });
          const { accessToken } = response.data;
          localStorage.setItem('admin_token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_refresh_token');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh_token');
        window.location.href = '/login';
      }
    }

    // Show error toast for non-401 errors
    if (error.response?.status !== 401) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Helper function for POST requests with idempotency key
export function postWithIdempotency(url: string, data: any, idempotencyKey?: string, config?: AxiosRequestConfig) {
  return api.post(url, data, {
    ...config,
    headers: {
      ...config?.headers,
      'Idempotency-Key': idempotencyKey ?? crypto.randomUUID()
    }
  });
}

export default api;