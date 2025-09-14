# Ledger & Financial Reports Specification

## Overview

This document defines the comprehensive reporting requirements for the MyPrime admin dashboard, focusing on ledger management, financial reports, and audit trails. All reports are based on double-entry bookkeeping principles and provide real-time financial insights.

## Core Ledger Structure

### Chart of Accounts

```sql
-- Account Categories and Codes
1000-1999: Assets
  1000: Cash and Cash Equivalents
  1100: User Wallets (Customer Deposits)
  1200: Loans Receivable
  1300: Interest Receivable
  1400: Fee Receivable
  1500: Prepaid Expenses
  1600: Fixed Assets
  1700: Intangible Assets

2000-2999: Liabilities
  2000: User Deposits (Mirror of User Wallets)
  2100: Accrued Interest Payable
  2200: Accrued Fees Payable
  2300: Accounts Payable
  2400: Accrued Expenses
  2500: Deferred Revenue
  2600: Long-term Debt

3000-3999: Equity
  3000: Share Capital
  3100: Retained Earnings
  3200: Current Year Earnings

4000-4999: Revenue
  4000: Interest Income (Loans)
  4100: Fee Income (Transfers)
  4200: Service Charges
  4300: Penalty Income
  4400: Other Income

5000-5999: Expenses
  5000: Operating Expenses
  5100: Interest Expense
  5200: Provision for Bad Debts
  5300: Technology Expenses
  5400: Marketing Expenses
  5500: Administrative Expenses
```

## Required Reports

### 1. Trial Balance Report

**Endpoint**: `GET /backoffice/ledger/trial-balance`

**Parameters**:
- `startDate`: ISO date string (optional, defaults to beginning of current month)
- `endDate`: ISO date string (optional, defaults to current date)
- `accountType`: string (optional, filter by asset|liability|equity|revenue|expense)

**Response Structure**:
```typescript
interface TrialBalanceResponse {
  entries: Array<{
    accountCode: string;
    accountName: string;
    accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    debitBalance: number;
    creditBalance: number;
    netBalance: number;
  }>;
  totals: {
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
    difference: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
  generatedAt: string;
}
```

**SQL Aggregation**:
```sql
SELECT 
  a.account_code,
  a.account_name,
  a.account_type,
  COALESCE(SUM(CASE WHEN je.debit_amount > 0 THEN je.debit_amount ELSE 0 END), 0) as debit_balance,
  COALESCE(SUM(CASE WHEN je.credit_amount > 0 THEN je.credit_amount ELSE 0 END), 0) as credit_balance,
  COALESCE(SUM(je.debit_amount - je.credit_amount), 0) as net_balance
FROM accounts a
LEFT JOIN journal_entries je ON a.account_code = je.account_code
WHERE je.transaction_date BETWEEN ? AND ?
  AND je.status = 'posted'
GROUP BY a.account_code, a.account_name, a.account_type
ORDER BY a.account_code;
```

### 2. General Ledger Report

**Endpoint**: `GET /backoffice/ledger/general-ledger`

**Parameters**:
- `accountCode`: string (optional, specific account)
- `startDate`: ISO date string
- `endDate`: ISO date string
- `transactionType`: string (optional, filter by type)
- `page`: number (pagination)
- `limit`: number (page size)

**Response Structure**:
```typescript
interface GeneralLedgerResponse {
  account: {
    code: string;
    name: string;
    type: string;
    openingBalance: number;
    closingBalance: number;
  };
  entries: Array<{
    transactionId: string;
    transactionDate: string;
    description: string;
    reference: string;
    debitAmount: number;
    creditAmount: number;
    runningBalance: number;
    transactionType: string;
  }>;
  pagination: PaginationInfo;
}
```

### 3. Balance Sheet

**Endpoint**: `GET /backoffice/reports/balance-sheet`

**Parameters**:
- `asOfDate`: ISO date string (defaults to current date)
- `comparative`: boolean (include previous period)

**Response Structure**:
```typescript
interface BalanceSheetResponse {
  asOfDate: string;
  assets: {
    currentAssets: Array<AccountBalance>;
    nonCurrentAssets: Array<AccountBalance>;
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: Array<AccountBalance>;
    nonCurrentLiabilities: Array<AccountBalance>;
    totalLiabilities: number;
  };
  equity: {
    shareCapital: number;
    retainedEarnings: number;
    currentYearEarnings: number;
    totalEquity: number;
  };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
}
```

### 4. Profit & Loss Statement

**Endpoint**: `GET /backoffice/reports/profit-loss`

**Parameters**:
- `startDate`: ISO date string
- `endDate`: ISO date string
- `comparative`: boolean (include previous period)
- `groupBy`: string (monthly|quarterly|yearly)

**Response Structure**:
```typescript
interface ProfitLossResponse {
  period: { startDate: string; endDate: string; };
  revenue: {
    interestIncome: number;
    feeIncome: number;
    serviceCharges: number;
    otherIncome: number;
    totalRevenue: number;
  };
  expenses: {
    operatingExpenses: number;
    interestExpense: number;
    provisionForBadDebts: number;
    technologyExpenses: number;
    marketingExpenses: number;
    administrativeExpenses: number;
    totalExpenses: number;
  };
  netIncome: number;
  margins: {
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
  };
}
```

### 5. Cash Flow Statement

**Endpoint**: `GET /backoffice/reports/cash-flow`

**Parameters**:
- `startDate`: ISO date string
- `endDate`: ISO date string
- `method`: string (direct|indirect)

**Response Structure**:
```typescript
interface CashFlowResponse {
  period: { startDate: string; endDate: string; };
  operatingActivities: {
    netIncome: number;
    adjustments: Array<{ description: string; amount: number; }>;
    workingCapitalChanges: Array<{ description: string; amount: number; }>;
    netCashFromOperating: number;
  };
  investingActivities: {
    activities: Array<{ description: string; amount: number; }>;
    netCashFromInvesting: number;
  };
  financingActivities: {
    activities: Array<{ description: string; amount: number; }>;
    netCashFromFinancing: number;
  };
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}
```

### 6. Loan Portfolio Report

**Endpoint**: `GET /backoffice/reports/loan-portfolio`

**Parameters**:
- `asOfDate`: ISO date string
- `status`: string (optional filter)
- `riskCategory`: string (optional filter)

**Response Structure**:
```typescript
interface LoanPortfolioResponse {
  summary: {
    totalLoans: number;
    totalPrincipal: number;
    totalOutstanding: number;
    averageInterestRate: number;
    portfolioYield: number;
  };
  byStatus: Array<{
    status: string;
    count: number;
    principal: number;
    outstanding: number;
    percentage: number;
  }>;
  agingAnalysis: Array<{
    bucket: string; // 0-30, 31-60, 61-90, 90+ days
    count: number;
    amount: number;
    percentage: number;
  }>;
  riskAnalysis: Array<{
    riskCategory: string;
    count: number;
    amount: number;
    provisionRequired: number;
  }>;
}
```

### 7. Daily Transaction Summary

**Endpoint**: `GET /backoffice/reports/daily-summary`

**Parameters**:
- `date`: ISO date string (defaults to current date)
- `includeDetails`: boolean (include transaction breakdown)

**Response Structure**:
```typescript
interface DailySummaryResponse {
  date: string;
  summary: {
    totalTransactions: number;
    totalVolume: number;
    totalFees: number;
    successRate: number;
  };
  byType: Array<{
    type: string;
    count: number;
    volume: number;
    fees: number;
    averageAmount: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
    volume: number;
    percentage: number;
  }>;
  hourlyDistribution: Array<{
    hour: number;
    count: number;
    volume: number;
  }>;
}
```

### 8. Reconciliation Report

**Endpoint**: `GET /backoffice/reports/reconciliation`

**Parameters**:
- `date`: ISO date string
- `provider`: string (optional, specific provider)
- `status`: string (optional, reconciled|unreconciled|disputed)

**Response Structure**:
```typescript
interface ReconciliationResponse {
  date: string;
  summary: {
    totalTransactions: number;
    reconciledCount: number;
    unreconciledCount: number;
    disputedCount: number;
    reconciliationRate: number;
  };
  discrepancies: Array<{
    transactionId: string;
    internalAmount: number;
    providerAmount: number;
    difference: number;
    status: string;
    notes: string;
  }>;
  providerSummary: Array<{
    provider: string;
    transactionCount: number;
    reconciliationRate: number;
    totalDiscrepancies: number;
  }>;
}
```

## Audit Trail Requirements

### Journal Entry Audit

Every journal entry must include:
- `createdBy`: Admin user ID
- `createdAt`: Timestamp
- `modifiedBy`: Admin user ID (if modified)
- `modifiedAt`: Timestamp (if modified)
- `status`: draft|posted|reversed
- `reversalReason`: Text (if reversed)
- `approvedBy`: Admin user ID (if approval required)
- `approvedAt`: Timestamp (if approved)

### Transaction Audit Trail

**Endpoint**: `GET /backoffice/audit/transaction-trail/:transactionId`

**Response Structure**:
```typescript
interface TransactionAuditTrail {
  transactionId: string;
  timeline: Array<{
    timestamp: string;
    action: string;
    performedBy: string;
    details: Record<string, any>;
    ipAddress: string;
    userAgent: string;
  }>;
  journalEntries: Array<{
    entryId: string;
    accountCode: string;
    accountName: string;
    debitAmount: number;
    creditAmount: number;
    status: string;
    createdBy: string;
    createdAt: string;
  }>;
  relatedTransactions: Array<{
    transactionId: string;
    relationship: string; // reversal, adjustment, etc.
    amount: number;
    createdAt: string;
  }>;
}
```

## Reconciliation Workflows

### 1. Daily Reconciliation Process

```sql
-- Daily reconciliation check
WITH internal_summary AS (
  SELECT 
    DATE(created_at) as transaction_date,
    transaction_type,
    COUNT(*) as internal_count,
    SUM(amount) as internal_amount
  FROM transactions 
  WHERE DATE(created_at) = ?
  GROUP BY DATE(created_at), transaction_type
),
provider_summary AS (
  SELECT 
    DATE(settlement_date) as transaction_date,
    transaction_type,
    COUNT(*) as provider_count,
    SUM(amount) as provider_amount
  FROM provider_settlements 
  WHERE DATE(settlement_date) = ?
  GROUP BY DATE(settlement_date), transaction_type
)
SELECT 
  i.transaction_date,
  i.transaction_type,
  i.internal_count,
  i.internal_amount,
  p.provider_count,
  p.provider_amount,
  (i.internal_count - p.provider_count) as count_difference,
  (i.internal_amount - p.provider_amount) as amount_difference
FROM internal_summary i
FULL OUTER JOIN provider_summary p 
  ON i.transaction_date = p.transaction_date 
  AND i.transaction_type = p.transaction_type;
```

### 2. Exception Handling

**Endpoint**: `GET /backoffice/reconciliation/exceptions`

**Response Structure**:
```typescript
interface ReconciliationExceptions {
  unmatched: Array<{
    transactionId: string;
    amount: number;
    type: string;
    source: 'internal' | 'provider';
    age: number; // days since transaction
    priority: 'high' | 'medium' | 'low';
  }>;
  duplicates: Array<{
    transactionIds: string[];
    amount: number;
    detectedAt: string;
  }>;
  amountMismatches: Array<{
    transactionId: string;
    internalAmount: number;
    providerAmount: number;
    difference: number;
  }>;
}
```

## Report Export Formats

### CSV Export Structure
- UTF-8 encoding
- Comma-separated values
- Headers in first row
- Numeric values without currency symbols
- Dates in ISO format (YYYY-MM-DD)

### PDF Export Requirements
- Company branding/logo
- Report title and parameters
- Generation timestamp
- Page numbers
- Summary totals
- Digital signature (optional)

### Excel Export Features
- Multiple worksheets for complex reports
- Formatted numbers and dates
- Charts and graphs where applicable
- Pivot table data sources
- Conditional formatting for variances

## Performance Considerations

### Indexing Strategy
```sql
-- Essential indexes for reporting performance
CREATE INDEX idx_journal_entries_date_account ON journal_entries(transaction_date, account_code);
CREATE INDEX idx_transactions_date_type ON transactions(created_at, transaction_type);
CREATE INDEX idx_transactions_status_date ON transactions(status, created_at);
CREATE INDEX idx_loans_status_date ON loans(status, created_at);
CREATE INDEX idx_audit_logs_date_admin ON audit_logs(created_at, admin_id);
```

### Caching Strategy
- Cache daily summaries after EOD processing
- Cache month-end reports for 24 hours
- Invalidate caches on data corrections
- Use Redis for frequently accessed reports

### Data Archiving
- Archive transactions older than 7 years
- Maintain summary data for archived periods
- Implement data retention policies
- Ensure audit trail preservation

## Security & Compliance

### Access Controls
- Role-based report access
- Sensitive data masking for non-privileged users
- Audit log for all report access
- IP address restrictions for financial reports

### Data Privacy
- PII masking in exported reports
- Secure report delivery mechanisms
- Automatic report expiration
- Encrypted storage for sensitive reports

### Regulatory Compliance
- SOX compliance for financial reports
- GDPR compliance for user data
- Local banking regulations
- Audit trail requirements

This comprehensive reporting framework ensures accurate financial reporting, regulatory compliance, and operational transparency for the MyPrime admin dashboard.