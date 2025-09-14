// examples/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Type definitions based on discovered endpoints
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Viewer' | 'Auditor';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  repaidAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  term: number;
  status: 'pending' | 'approved' | 'disbursed' | 'active' | 'completed' | 'overdue' | 'rejected';
  category: string;
  nextPaymentDate: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalLoans: number;
  activeLoans: number;
  totalSavings: number;
  totalTransactions: number;
  totalRevenue: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export interface ActivityLog {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  admin?: Admin;
}

// API Client Class
class AdminApiClient {
  private axios: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling and token refresh
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.axios(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
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
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem('admin_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('/auth/refresh', {
      refreshToken
    });

    const { accessToken } = response.data;
    localStorage.setItem('admin_token', accessToken);
    return accessToken;
  }

  private handleAuthError() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    window.location.href = '/login';
  }

  // Helper method for POST requests with idempotency key
  private postWithIdempotency<T>(
    url: string, 
    data: any, 
    idempotencyKey?: string, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axios.post(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        'Idempotency-Key': idempotencyKey ?? crypto.randomUUID()
      }
    });
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; admin: Admin }> {
    const response = await this.axios.post<ApiResponse<{ accessToken: string; refreshToken: string; admin: Admin }>>(
      '/api/users/login',
      { email, password }
    );
    return response.data.data;
  }

  async getProfile(): Promise<Admin> {
    const response = await this.axios.get<ApiResponse<Admin>>('/backoffice/profile');
    return response.data.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.axios.post('/backoffice/change-password', { oldPassword, newPassword });
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.axios.get<ApiResponse<DashboardStats>>('/backoffice/dashboard');
    return response.data.data;
  }

  async getSystemHealth(): Promise<{ status: string; checks: any[] }> {
    const response = await this.axios.get<ApiResponse<{ status: string; checks: any[] }>>('/backoffice/system/health');
    return response.data.data;
  }

  // User management endpoints
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<User>> {
    const response = await this.axios.get<ApiResponse<PaginatedResponse<User>>>(
      '/backoffice/users',
      { params }
    );
    return response.data.data;
  }

  async activateUser(userId: string, status: 'active' | 'inactive'): Promise<void> {
    await this.axios.post('/backoffice/users/activate', { userId, status });
  }

  // Loan management endpoints
  async getLoans(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Loan>> {
    const response = await this.axios.get<ApiResponse<PaginatedResponse<Loan>>>(
      '/backoffice/loans',
      { params }
    );
    return response.data.data;
  }

  async getLoanDetails(loanId: string): Promise<Loan> {
    const response = await this.axios.get<ApiResponse<Loan>>(`/backoffice/loans/${loanId}`);
    return response.data.data;
  }

  async disburseLoan(loanId: string, amount?: number, idempotencyKey?: string): Promise<void> {
    await this.postWithIdempotency(
      '/backoffice/loans/disburse',
      { loanId, amount },
      idempotencyKey
    );
  }

  async rejectLoan(loanId: string, reason: string): Promise<void> {
    await this.axios.post(`/backoffice/loans/${loanId}/reject`, { reason });
  }

  async bulkLoanAction(
    loanIds: string[],
    action: 'approve' | 'reject',
    reason?: string,
    idempotencyKey?: string
  ): Promise<any> {
    const response = await this.postWithIdempotency(
      '/backoffice/loans/bulk-action',
      { loanIds, action, reason },
      idempotencyKey
    );
    return response.data;
  }

  async getLoanStats(): Promise<any> {
    const response = await this.axios.get<ApiResponse<any>>('/backoffice/loans/stats');
    return response.data.data;
  }

  // Reports endpoints
  async getBusinessReport(params?: { from?: string; to?: string }): Promise<any> {
    const response = await this.axios.get<ApiResponse<any>>('/backoffice/business-report', { params });
    return response.data.data;
  }

  async getProfitReport(params?: { from?: string; to?: string; service?: string }): Promise<any> {
    const response = await this.axios.get<ApiResponse<any>>('/backoffice/profits', { params });
    return response.data.data;
  }

  // Transaction endpoints
  async getTransactionDetails(traceId: string): Promise<any> {
    const response = await this.axios.get<ApiResponse<any>>(`/backoffice/transactions/${traceId}`);
    return response.data.data;
  }

  async getFlaggedTransactions(params?: { page?: number; limit?: number }): Promise<any[]> {
    const response = await this.axios.get<ApiResponse<any[]>>('/backoffice/transactions/flagged', { params });
    return response.data.data;
  }

  async requeryTransfer(transferId: string, idempotencyKey?: string): Promise<any> {
    const response = await this.postWithIdempotency(
      `/backoffice/transfers/${transferId}/requery`,
      {},
      idempotencyKey
    );
    return response.data;
  }

  // Activity logs
  async getActivityLogs(params?: {
    page?: number;
    limit?: number;
    adminId?: string;
  }): Promise<PaginatedResponse<ActivityLog>> {
    const response = await this.axios.get<ApiResponse<PaginatedResponse<ActivityLog>>>(
      '/backoffice/activity-logs',
      { params }
    );
    return response.data.data;
  }

  // Admin management (Super Admin only)
  async createAdmin(adminData: {
    email: string;
    name: string;
    surname: string;
    password: string;
    phone: string;
    is_super_admin?: boolean;
    permissions?: string[];
  }, idempotencyKey?: string): Promise<Admin> {
    const response = await this.postWithIdempotency<ApiResponse<Admin>>(
      '/backoffice/create',
      adminData,
      idempotencyKey
    );
    return response.data.data;
  }

  async activateAdmin(adminId: string, status: 'active' | 'inactive'): Promise<void> {
    await this.axios.post('/backoffice/activate', { adminId, status });
  }

  async updateAdminPermissions(adminId: string, permissions: string[]): Promise<Admin> {
    const response = await this.axios.put<ApiResponse<Admin>>(
      `/backoffice/${adminId}/permissions`,
      { permissions }
    );
    return response.data.data;
  }

  // Settings
  async getSettings(): Promise<any[]> {
    const response = await this.axios.get<ApiResponse<any[]>>('/backoffice/settings');
    return response.data.data;
  }

  async updateSettings(settings: any[]): Promise<any[]> {
    const response = await this.axios.put<ApiResponse<any[]>>('/backoffice/settings', { settings });
    return response.data.data;
  }
}

// Export singleton instance
export const adminApi = new AdminApiClient();

// React Query hooks for common operations
export const queryKeys = {
  dashboard: ['dashboard'] as const,
  users: (filters?: any) => ['users', filters] as const,
  loans: (filters?: any) => ['loans', filters] as const,
  loanDetails: (id: string) => ['loans', id] as const,
  activityLogs: (filters?: any) => ['activity-logs', filters] as const,
  profile: ['profile'] as const,
  settings: ['settings'] as const,
} as const;