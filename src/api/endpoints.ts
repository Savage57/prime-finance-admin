import api, { postWithIdempotency } from './apiClient';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  walletBalance: number;
}

export interface Loan {
  id: string;
  amount: number;
  repaidAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  term: number;
  status: 'pending' | 'active' | 'completed' | 'defaulted';
  nextPaymentDate: string;
}

export interface Transaction {
  id: string;
  traceId: string;
  type: 'transfer' | 'withdrawal' | 'deposit' | 'loan_repayment' | 'bill_payment';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  description: string;
  createdAt: string;
  updatedAt: string;
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
}

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/users/login', { email, password }),
  
  getProfile: () =>
    api.get<User>('/backoffice/profile'),
};

// Loan endpoints
export const loanApi = {
  getLoans: () =>
    api.get<Loan[]>('/backoffice/loans'),
  
  disburseLoan: (loanData: { userId: string; amount: number; term: number }, idempotencyKey?: string) =>
    postWithIdempotency('/backoffice/loans/disburse', loanData, idempotencyKey),
  
  getStats: () =>
    api.get('/backoffice/loans/stats'),
};

// Savings endpoints
export const savingsApi = {
  getSavings: (userId: string) =>
    api.get(`/backoffice/savings/${userId}`),
  
  deposit: (amount: number, idempotencyKey?: string) =>
    postWithIdempotency('/backoffice/savings/deposit', { amount }, idempotencyKey),
  
  withdraw: (amount: number, idempotencyKey?: string) =>
    postWithIdempotency('/backoffice/savings/withdraw', { amount }, idempotencyKey),
};

// Transfer endpoints
export const transferApi = {
  createTransfer: (transferData: {
    toUserId?: string;
    recipientAccount?: string;
    amount: number;
    type: 'internal' | 'external';
    description?: string;
  }, idempotencyKey?: string) =>
    postWithIdempotency('/backoffice/transfers', transferData, idempotencyKey),
  
  getTransfer: (id: string) =>
    api.get<Transfer>(`/backoffice/transfers/${id}`),
  
  requeryTransfer: (id: string, idempotencyKey?: string) =>
    postWithIdempotency(`/backoffice/transfers/${id}/requery`, {}, idempotencyKey),
};

// Withdrawal endpoints
export const withdrawalApi = {
  createWithdrawal: (withdrawalData: {
    amount: number;
    bankAccount: string;
    bankCode: string;
    description?: string;
  }, idempotencyKey?: string) =>
    postWithIdempotency('/backoffice/withdrawals', withdrawalData, idempotencyKey),
};

// Transaction endpoints
export const transactionApi = {
  getTransaction: (traceId: string) =>
    api.get<Transaction>(`/backoffice/transactions/${traceId}`),
  
  getFlaggedTransactions: () =>
    api.get<Transaction[]>('/backoffice/transactions/flagged'),
};

// Dashboard endpoints
export const dashboardApi = {
  getDashboard: () =>
    api.get('/backoffice/dashboard'),
};