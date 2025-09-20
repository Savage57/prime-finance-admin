/**
 * ==============================
 * ENUMS & CONSTANTS
 * ==============================
 */
export type USERROLES = "admin" | "user";
export type USERSTATUS = "active" | "inactive";

export type LOANCATEGORY = "personal" | "working";
export type LOANTYPE = "request" | "repay";
export type LOANSTATUS = "pending" | "rejected" | "accepted";
export type LOANPAYMENTSTATUS = "complete" | "in-progress" | "not-started";

export type MOBILENETWORKS = "01" | "02" | "03" | "04";
export type BONUSTYPE = "01" | "02";
export type CABLETV = "dstv" | "gotv" | "startimes";
export type METERTYPE = "01" | "02";

export type ServiceType =
  | "airtime"
  | "data"
  | "tv"
  | "power"
  | "betting"
  | "internet"
  | "waec"
  | "jamb";

/**
 * ==============================
 * PERMISSIONS
 * ==============================
 */
export type AdminPermission =
  | "view_users"
  | "manage_users"
  | "view_loans"
  | "manage_loans"
  | "view_transactions"
  | "manage_transactions"
  | "view_reports"
  | "manage_settings"
  | "view_savings"
  | "manage_savings"
  | "view_bill_payments"
  | "manage_bill_payments"
  | "view_notifications"
  | "send_notifications"
  | "manage_notifications";

/**
 * ==============================
 * USER & ADMIN MODELS
 * ==============================
 */
export interface Update {
  pin?: number;
  type: "pin" | "password";
  status: "validated" | "invalid" | "awaiting_validation";
  created_at: string;
}

export interface User {
  _id: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  created_at: string;
  email: string;
  password: string;
  email_confirmed_at: string;
  refresh_tokens: string[];
  is_anonymous: boolean;
  last_sign_in_at?: string;
  phone: string;
  role: USERROLES;
  status: USERSTATUS;
  updatedAt: string;
  user_metadata: {
    bvn?: string;
    nin?: string;
    sub?: string;
    email?: string;
    phone?: string;
    surname?: string;
    gender?: string;
    first_name?: string;
    dateOfBirth?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    signupBonusReceived?: boolean;
    ladderIndex?: number;
    creditScore?: number;
    accountNo?: string;
    address?: string;
    wallet?: string;
    pin?: string;
    profile_photo?: string;
    file?: string;
    types?: string;
    verified_address?: "verified" | "pending" | "unverified";
  };
  is_super_admin?: boolean;
  updates: Update[];
  linked_accounts?: {
    id: string;
    name: string;
    email: string;
    ref: string;
    bank: string;
    account_number: string;
  }[];
  permissions: AdminPermission[];
  createdAt: string;
}

/**
 * ==============================
 * LOANS
 * ==============================
 */
export interface Subscriber {
  Subscriber_ID: string;
  Name: string;
  Phone: string;
  Address: string;
}

export interface LoanDetails {
  loanProvider: string;
  accountNumber: string;
  loanAmount: number;
  outstandingBalance: number;
  status: string;
  performanceStatus: string;
  overdueAmount: number;
  type: string;
  loanDuration: string;
  repaymentFrequency: string;
  repaymentBehavior: string;
  paymentProfile: string;
  dateAccountOpened: string;
  lastUpdatedAt: string;
  loanCount: number;
  monthlyInstallmentAmt: number;
}

export interface ICreditScore {
  lastReported: string;
  creditorName: string;
  totalDebt: string;
  outstandingBalance: number;
  activeLoan: number;
  loansTaken: number;
  repaymentHistory: string;
  openedDate: string;
  lengthOfCreditHistory: string;
  remarks: string;
  creditors: Subscriber[];
  loan_details: LoanDetails[];
}

export interface Loan {
  _id: string;
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  bvn: string;
  nin: string;
  address: string;
  amount: number;
  requested_amount: number;
  outstanding: number;
  repayment_amount: number;
  percentage: number;
  repayment_date: string;
  loan_date: string;
  category: LOANCATEGORY;
  type: LOANTYPE;
  status: LOANSTATUS;
  loan_payment_status: LOANPAYMENTSTATUS;
  reason: string;
  duration: number;
  credit_message: string;
  credit_score: ICreditScore | null;
  repayment_history: {
    amount: number;
    outstanding: number;
    date: string;
    action: string;
  }[];
  adminAction?: {
    action: "Approve" | "Reject";
    adminId: string | "system";
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BulkLoanActionRequest {
  loanIds: string[];
  action: "approve" | "reject";
  reason?: string;
}

/**
 * ==============================
 * TRANSACTIONS / TRANSFERS
 * ==============================
 */
export interface Transfer {
  _id: string;
  userId: string;
  traceId: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  transferType: "intra" | "inter";
  status: "PENDING" | "COMPLETED" | "FAILED";
  providerRef?: string;
  beneficiaryName?: string;
  bankCode?: string;
  reference: string;
  remark?: string;
  naration?: string;
  processedAt?: Date;
  meta?: Record<string, any>;
  createdAt: Date;
}

/**
 * ==============================
 * SAVINGS
 * ==============================
 */
export interface SavingsPlan {
  _id: string;
  userId: string;
  planName: string;
  planType: "LOCKED" | "FLEXIBLE";
  principal: number;
  interestEarned: number;
  targetAmount?: number;
  durationDays?: number;
  interestRate: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  maturityDate?: Date;
  locked: boolean;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * ==============================
 * BILL PAYMENTS
 * ==============================
 */
export interface BillPayment {
  _id: string;
  userId: string;
  traceId: string;
  serviceType: ServiceType;
  serviceId: string;
  customerReference: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  providerRef?: string;
  createdAt: Date;
  processedAt?: Date;
  meta?: Record<string, any>;
}

/**
 * ==============================
 * ADMIN ANALYTICS & REPORTING
 * ==============================
 */
export interface AdminStats {
  users: { total: number; active: number; inactive: number; newThisMonth: number };
  loans: { total: number; pending: number; active: number; overdue: number; totalDisbursed: number; totalOutstanding: number };
  transfers: { total: number; pending: number; completed: number; failed: number; totalVolume: number };
  billPayments: { total: number; pending: number; completed: number; failed: number; totalVolume: number };
  savings: { totalPlans: number; activePlans: number; totalPrincipal: number; totalInterestEarned: number };
  revenue: { totalRevenue: number; loanInterest: number; billPaymentFees: number; transferFees: number; savingsPenalties: number };
}

export interface SystemHealth {
  database: 'healthy' | 'warning' | 'critical';
  redis: 'healthy' | 'warning' | 'critical';
  providers: {
    vfd: 'healthy' | 'warning' | 'critical';
    clubConnect: 'healthy' | 'warning' | 'critical';
    flutterwave: 'healthy' | 'warning' | 'critical';
    paystack: 'healthy' | 'warning' | 'critical';
    monnify: 'healthy' | 'warning' | 'critical';
    [key: string]: string; // fallback for any additional providers
  };
  workers: {
    billPaymentsPoller: 'running' | 'stopped' | 'error';
    transfersPoller: 'running' | 'stopped' | 'error';
    loanPenalties: 'running' | 'stopped' | 'error';
    savingsMaturities: 'running' | 'stopped' | 'error';
    [key: string]: string; // fallback for any additional workers
  };
}

export interface BusinessReport {
  period: { startDate: string; endDate: string };
  userAcquisition: { newUsers: number };
  loanPerformance: any;
  revenue: { breakdown: any[]; total: number };
  transactionVolumes: { transfers: any; billPayments: any };
}

export interface FlaggedTransactions {
  transfers: any[];
  loans: any[];
  total: number;
}

/**
 * ==============================
 * SETTINGS & CONFIG
 * ==============================
 */
export interface Settings {
    autoLoanApproval: boolean;         // enable/disable automatic loan approval
    maxLoanAmount: number;             // maximum loan amount allowed
    minCreditScore: number;            // minimum credit score required
    maxLoanTerm: number;               // maximum loan term in months/days
    loanEnabled: boolean;              // toggle loan feature
    transferEnabled: boolean;          // toggle transfers
    transferDailyLimit: number;        // daily transfer cap
    savingsEnabled: boolean;           // toggle savings
    billPaymentEnabled: boolean;       // toggle bill payments
    savingsPenalty: number;            // penalty for early withdrawal
    savingsInterestRate: number;       // e.g., 0.025 = 2.5%
    updatedBy: string;                 // adminId who last updated
    updatedAt: Date;                   // last updated timestamp
    companyName: string;
    companyPhone: string;
    companyEmail: string;
    companyAddress: string;
    companyTimezone: string;
    maintenanceMode: boolean;          // put platform in maintenance mode
    singleton: string;
  }

/**
 * ==============================
 * WRAPPERS
 * ==============================
 */
export interface ApiResponse<T> {
  success: string;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T>  {
  data: T;
  success: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateSettingsRequest {
  settings: Array<{ key: string; value: string }>;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  };
  loans: {
    total: number;
    pending: number;
    active: number;
    overdue: number;
    totalDisbursed: number;
    totalOutstanding: number;
  };
  transfers: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalVolume: number;
  };
  billPayments: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalVolume: number;
  };
  savings: {
    totalPlans: number;
    activePlans: number;
    totalPrincipal: number;
    totalInterestEarned: number;
  };
  revenue: {
    totalRevenue: number;
    loanInterest: number;
    billPaymentFees: number;
    transferFees: number;
    savingsPenalties: number;
  };
}


export interface ActivityLog {
  logs: {
    id: string;
    adminId: string;
    action: string;
    resource: string;
    resourceId: string;
    details: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
    admin?: User;
  }[];
  page: number;
  total: number;
  pages: number;
}

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
