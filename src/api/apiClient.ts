import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: false,
  timeout: 20000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('auth.refreshToken');
      if (refreshToken) {
        try {
          const response = await api.post('/api/auth/refresh', {
            refreshToken
          });
          const { accessToken } = response.data;
          localStorage.setItem('auth.token', accessToken);
          // Retry the original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        } catch (refreshError: any) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('auth.token');
          localStorage.removeItem('auth.refreshToken');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
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