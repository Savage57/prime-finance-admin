// API Types based on Swagger/OpenAPI specification
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

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Super Admin' | 'Admin';
  permissions: string[];
  isActive: boolean;
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

export interface Transaction {
  id: string;
  traceId: string;
  userId: string;
  type: 'transfer' | 'withdrawal' | 'deposit' | 'loan_repayment' | 'bill_payment';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Transfer {
  id: string;
  fromUserId: string;
  toUserId?: string;
  amount: number;
  fee: number;
  status: 'pending' | 'success' | 'failed';
  type: 'internal' | 'external';
  recipientAccount?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsPlan {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  interestRate: number;
  category: string;
  status: 'active' | 'completed' | 'paused';
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

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  updatedAt: string;
}

// API Response Types
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

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateAdminRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: 'Super Admin' | 'Admin';
  permissions: string[];
}

export interface DisburseLoanRequest {
  loanId: string;
  amount: number;
  notes?: string;
}

export interface BulkLoanActionRequest {
  loanIds: string[];
  action: 'approve' | 'reject';
  reason?: string;
}

export interface UpdateSettingsRequest {
  settings: Array<{
    key: string;
    value: string;
  }>;
}