import api, { postWithIdempotency } from './api';
import type {
  User,
  Admin,
  Loan,
  Transaction,
  Transfer,
  SavingsPlan,
  DashboardStats,
  ActivityLog,
  SystemSettings,
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  CreateAdminRequest,
  DisburseLoanRequest,
  BulkLoanActionRequest,
  UpdateSettingsRequest,
} from '../types/api';

// Authentication
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; admin: Admin }>>('/users/login', data),
  
  getProfile: () =>
    api.get<ApiResponse<Admin>>('/backoffice/profile'),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<ApiResponse<void>>('/backoffice/change-password', data),
  
  updateProfile: (data: Partial<Admin>) =>
    api.put<ApiResponse<Admin>>('/backoffice/update', data),
};

// Admin Management
export const adminApi = {
  createAdmin: (data: CreateAdminRequest, idempotencyKey?: string) =>
    postWithIdempotency('/backoffice/create', data, idempotencyKey),
  
  activateAdmin: (adminId: string, isActive: boolean) =>
    api.post<ApiResponse<void>>('/backoffice/activate', { adminId, isActive }),
  
  updatePermissions: (adminId: string, permissions: string[]) =>
    api.put<ApiResponse<Admin>>(`/backoffice/${adminId}/permissions`, { permissions }),
  
  getAdminProfile: (adminId: string) =>
    api.get<ApiResponse<Admin>>(`/backoffice/${adminId}`),
};

// User Management
export const userApi = {
  getUsers: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<User>>>('/backoffice/users', { params }),
  
  activateUser: (userId: string, isActive: boolean) =>
    api.post<ApiResponse<void>>('/backoffice/users/activate', { userId, isActive }),
};

// Loan Management
export const loanApi = {
  getLoans: (params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    category?: string;
    userId?: string;
  }) =>
    api.get<ApiResponse<PaginatedResponse<Loan>>>('/backoffice/loans', { params }),
  
  getLoanDetails: (loanId: string) =>
    api.get<ApiResponse<Loan>>(`/backoffice/loans/${loanId}`),
  
  disburseLoan: (data: DisburseLoanRequest, idempotencyKey?: string) =>
    postWithIdempotency('/backoffice/loans/disburse', data, idempotencyKey),
  
  rejectLoan: (loanId: string, reason: string) =>
    api.post<ApiResponse<void>>(`/backoffice/loans/${loanId}/reject`, { reason }),
  
  getLoanStats: () =>
    api.get<ApiResponse<any>>('/backoffice/loans/stats'),
  
  getLoansByCategory: (category: string) =>
    api.get<ApiResponse<Loan[]>>(`/backoffice/loans/category/${category}`),
  
  bulkLoanAction: (data: BulkLoanActionRequest, idempotencyKey?: string) =>
    postWithIdempotency('/backoffice/loans/bulk-action', data, idempotencyKey),
};

// Savings Management
export const savingsApi = {
  getSavings: (params?: { page?: number; limit?: number; category?: string }) =>
    api.get<ApiResponse<PaginatedResponse<SavingsPlan>>>('/backoffice/savings', { params }),
  
  getSavingsStats: () =>
    api.get<ApiResponse<any>>('/backoffice/savings/stats'),
  
  getSavingsByCategory: (category: string) =>
    api.get<ApiResponse<SavingsPlan[]>>(`/backoffice/savings/by-category`, { params: { category } }),
};

// Dashboard & Reports
export const dashboardApi = {
  getDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/backoffice/dashboard'),
  
  getSystemHealth: () =>
    api.get<ApiResponse<{ status: string; checks: any[] }>>('/backoffice/system/health'),
  
  getBusinessReport: (params?: { startDate?: string; endDate?: string }) =>
    api.get<ApiResponse<any>>('/backoffice/business-report', { params }),
  
  getProfitReport: (params?: { startDate?: string; endDate?: string }) =>
    api.get<ApiResponse<any>>('/backoffice/profits', { params }),
};

// Transactions & Reconciliation
export const transactionApi = {
  getTransactionByTraceId: (traceId: string) =>
    api.get<ApiResponse<Transaction>>(`/backoffice/transactions/${traceId}`),
  
  requeryTransfer: (transferId: string, idempotencyKey?: string) =>
    postWithIdempotency(`/backoffice/transfers/${transferId}/requery`, {}, idempotencyKey),
  
  getReconciliationInconsistencies: () =>
    api.get<ApiResponse<any[]>>('/backoffice/reconciliation/inconsistencies'),
  
  getFlaggedTransactions: () =>
    api.get<ApiResponse<Transaction[]>>('/backoffice/transactions/flagged'),
};

// Activity Logs
export const activityApi = {
  getActivityLogs: (params?: { page?: number; limit?: number; adminId?: string }) =>
    api.get<ApiResponse<PaginatedResponse<ActivityLog>>>('/backoffice/activity-logs', { params }),
};

// Settings
export const settingsApi = {
  getSettings: () =>
    api.get<ApiResponse<SystemSettings[]>>('/backoffice/settings'),
  
  updateSettings: (data: UpdateSettingsRequest) =>
    api.put<ApiResponse<SystemSettings[]>>('/backoffice/settings', data),
};