# Admin Dashboard UI Specification

## Overview

This specification defines a comprehensive admin dashboard for MyPrime financial services platform, built with React + TypeScript + Tailwind CSS. The dashboard provides complete administrative control over users, loans, savings, transactions, and system operations.

## Architecture

### Tech Stack
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: shadcn/ui + lucide-react icons
- **Charts**: Recharts for data visualization
- **State Management**: React Query + Zustand for global state
- **Forms**: react-hook-form + Zod validation
- **Authentication**: JWT with refresh token flow

### Design System

#### Color Palette
- **Primary Green**: #0EA55E (6 shades: green-50 to green-900)
- **Secondary**: White (light mode) / Black (dark mode)
- **Accent Colors**: Teal (#06B6D4), Amber (#F59E0B), Violet (#8B5CF6), Cyan (#06B6D4)
- **Status Colors**: Success (green), Warning (amber), Error (red), Info (blue)

#### Typography
- **Font**: Inter or system font stack
- **Scale**: XS (12px) to XL (28px)
- **Line Heights**: 1.2 for headings, 1.5 for body text

#### Spacing & Layout
- **Grid**: 8px base unit (1, 2, 4, 6, 8, 12, 16, 24, 32px)
- **Containers**: Max-width with responsive breakpoints
- **Cards**: Elevated surfaces with subtle shadows

## Authentication & Authorization

### Login Page (`/login`)
**Endpoint**: `POST /api/users/login`

**Components**:
- `LoginForm`: Email/password fields with validation
- `ThemeToggle`: Dark/light mode switcher
- `LoadingSpinner`: During authentication

**Features**:
- Email validation (required, valid format)
- Password validation (required, min 6 characters)
- Remember me checkbox
- Error handling for invalid credentials
- Automatic redirect to dashboard on success
- Demo credentials display

**Security**:
- JWT token storage (localStorage with httpOnly fallback)
- Automatic token refresh
- Session timeout handling
- Rate limiting protection

### Role-Based Access Control (RBAC)

**Roles**:
1. **Super Admin**: Full system access, can create/manage other admins
2. **Admin**: Standard administrative functions
3. **Manager**: Limited admin functions (view-only for sensitive operations)
4. **Viewer**: Read-only access to reports and data
5. **Auditor**: Access to logs, reports, and audit trails

**Permission Matrix**:
```
Feature                 | SuperAdmin | Admin | Manager | Viewer | Auditor
------------------------|------------|-------|---------|--------|--------
User Management         | ✓          | ✓     | ✓       | ✓      | ✓
User Activation         | ✓          | ✓     | ✗       | ✗      | ✗
Loan Approval           | ✓          | ✓     | ✓       | ✗      | ✗
Loan Disbursement       | ✓          | ✓     | ✗       | ✗      | ✗
Admin Creation          | ✓          | ✗     | ✗       | ✗      | ✗
System Settings         | ✓          | ✓     | ✗       | ✗      | ✗
Financial Reports       | ✓          | ✓     | ✓       | ✓      | ✓
Activity Logs           | ✓          | ✓     | ✓       | ✗      | ✓
Reconciliation          | ✓          | ✓     | ✗       | ✗      | ✓
```

## Page Specifications

### 1. Dashboard (`/dashboard`)
**Primary Endpoint**: `GET /backoffice/dashboard`

**Components**:
- `DashboardStats`: KPI cards with real-time data
- `SystemHealthIndicator`: Health status with alerts
- `RecentActivityFeed`: Latest admin actions
- `QuickActions`: Shortcuts to common tasks

**KPIs Displayed**:
- Total Users (with 24h change)
- Active Loans (with portfolio value)
- Total Savings (with growth rate)
- Transaction Volume (24h/7d/30d)
- System Health Status
- Pending Approvals Count

**Features**:
- Auto-refresh every 30 seconds
- Drill-down navigation to detailed views
- Responsive grid layout
- Dark/light theme support

### 2. Users Management (`/users`)
**Primary Endpoint**: `GET /backoffice/users`

**Components**:
- `UsersTable`: Paginated data table
- `UserFilters`: Search and status filters
- `UserDetailModal`: User profile and wallet info
- `ActivateUserModal`: Account activation/deactivation

**Table Columns**:
- Avatar + Name (firstName + lastName)
- Email (with verification status)
- Phone (formatted)
- Wallet Balance (formatted currency)
- Status Badge (Active/Inactive)
- Join Date (relative time)
- Actions (View, Activate/Deactivate)

**Features**:
- Server-side pagination (20 items per page)
- Real-time search (debounced)
- Status filtering (All, Active, Inactive)
- Bulk actions for multiple users
- Export to CSV functionality
- User impersonation (if endpoint exists)

**Actions**:
- **View**: Opens user detail modal with transaction history
- **Activate/Deactivate**: `POST /backoffice/users/activate`
- **Export**: CSV download of filtered results

### 3. Loan Management (`/loans`)
**Primary Endpoint**: `GET /backoffice/loans`

**Components**:
- `LoansTable`: Loan applications and active loans
- `LoanFilters`: Status and date range filters
- `LoanDetailView`: Complete loan information
- `DisburseLoanModal`: Loan disbursement interface
- `RejectLoanModal`: Rejection with reason
- `BulkLoanActionModal`: Bulk approve/reject

**Table Columns**:
- Borrower Info (name + user ID)
- Loan Amount (formatted currency)
- Interest Rate (percentage)
- Term (months)
- Status Badge (color-coded)
- Application Date
- Monthly Payment
- Actions (View, Approve, Reject, Disburse)

**Status Colors**:
- Pending: Yellow
- Approved: Blue
- Disbursed: Green
- Active: Green
- Completed: Gray
- Overdue: Red
- Rejected: Red

**Features**:
- Status-based filtering
- Date range selection
- Bulk selection with actions
- Loan calculator integration
- Repayment schedule visualization
- Document viewer for supporting files

**Detailed Actions**:
- **Approve**: Changes status to approved
- **Reject**: `POST /backoffice/loans/:id/reject` with reason
- **Disburse**: `POST /backoffice/loans/disburse` with idempotency
- **Bulk Action**: `POST /backoffice/loans/bulk-action`

### 4. Loan Detail Page (`/loans/:id`)
**Primary Endpoint**: `GET /backoffice/loans/:id`

**Components**:
- `LoanSummaryCard`: Key loan information
- `BorrowerProfileCard`: User information and credit history
- `RepaymentScheduleTable`: Payment timeline
- `LoanHistoryTimeline`: Status changes and actions
- `DocumentViewer`: Supporting documents
- `LoanActionsPanel`: Available actions based on status

**Information Displayed**:
- Loan amount and terms
- Interest rate and fees
- Repayment schedule
- Payment history
- Borrower credit profile
- Risk assessment
- Supporting documents
- Audit trail

### 5. Savings Management (`/savings`)
**Primary Endpoint**: `GET /backoffice/savings`

**Components**:
- `SavingsPlansTable`: Available savings products
- `SavingsStatsCards`: Portfolio overview
- `CreateSavingsPlanModal`: New product creation
- `EditSavingsPlanModal`: Product modification

**Features**:
- Savings product management
- Interest rate configuration
- Minimum/maximum amounts
- Term settings
- Auto-renewal options
- Performance analytics

### 6. Transaction Management (`/transactions`)
**Primary Endpoints**: 
- `GET /backoffice/transactions/flagged`
- `GET /backoffice/transactions/:traceId`

**Components**:
- `TransactionsTable`: All transactions with filters
- `FlaggedTransactionsTable`: Risk management queue
- `TransactionDetailModal`: Complete transaction view
- `ReconciliationPanel`: Manual reconciliation tools

**Features**:
- Transaction search by trace ID
- Status-based filtering
- Amount range filtering
- Date range selection
- Flagged transaction review
- Manual reconciliation
- Export capabilities

### 7. Reports (`/reports`)
**Primary Endpoints**:
- `GET /backoffice/business-report`
- `GET /backoffice/profits`

**Components**:
- `ReportSelector`: Choose report type
- `DateRangePicker`: Time period selection
- `BusinessReportView`: Revenue and transaction analytics
- `ProfitReportView`: P&L by service
- `ExportOptions`: PDF/CSV/Excel export

**Available Reports**:
1. **Business Report**: Revenue, fees, transaction volumes
2. **Profit Report**: P&L breakdown by service
3. **Loan Portfolio Report**: Loan performance metrics
4. **Savings Growth Report**: Savings account analytics
5. **User Activity Report**: Registration and engagement metrics
6. **Transaction Summary**: Daily/weekly/monthly summaries

### 8. Reconciliation (`/reconciliation`)
**Primary Endpoint**: `GET /backoffice/reconciliation/inconsistencies`

**Components**:
- `InconsistenciesTable`: Detected issues
- `ReconciliationWorkflow`: Step-by-step resolution
- `ManualEntryForm`: Manual ledger adjustments
- `AuditTrail`: All reconciliation actions

**Features**:
- Automated inconsistency detection
- Manual reconciliation workflow
- Ledger entry creation/modification
- Audit trail maintenance
- Provider reconciliation
- Balance verification

### 9. Activity Logs (`/activity`)
**Primary Endpoint**: `GET /backoffice/activity-logs`

**Components**:
- `ActivityLogsTable`: Paginated audit trail
- `AdminFilter`: Filter by admin user
- `ActionFilter`: Filter by action type
- `LogDetailModal`: Detailed log entry view

**Features**:
- Complete audit trail
- Admin action tracking
- IP address logging
- Timestamp precision
- Export capabilities
- Search and filtering

### 10. Settings (`/settings`)
**Primary Endpoints**:
- `GET /backoffice/settings`
- `PUT /backoffice/settings`

**Components**:
- `SettingsCategories`: Organized setting groups
- `SettingsForm`: Configuration interface
- `BackupRestore`: Settings backup/restore
- `SystemConfiguration`: Core system settings

**Setting Categories**:
1. **General**: Company info, timezone, currency
2. **Security**: Password policies, session timeouts
3. **Notifications**: Email templates, webhook URLs
4. **Integration**: Provider credentials, API keys
5. **Features**: Feature toggles, limits
6. **Appearance**: Branding, themes

### 11. Admin Management (`/admin-management`)
**Primary Endpoints**:
- `POST /backoffice/create` (Super Admin only)
- `POST /backoffice/activate`
- `PUT /backoffice/:adminId/permissions`

**Components**:
- `AdminsTable`: List of admin users
- `CreateAdminModal`: New admin creation (Super Admin only)
- `EditPermissionsModal`: Permission management
- `RoleTemplates`: Predefined permission sets

**Features** (Super Admin Only):
- Create new admin accounts
- Assign roles and permissions
- Activate/deactivate admin accounts
- Permission matrix management
- Role template creation

## Data Flow & State Management

### API Client Pattern
```typescript
// Typed API client with error handling
class AdminApiClient {
  private axios: AxiosInstance;
  
  constructor() {
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 30000,
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor for auth token
    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    // Response interceptor for token refresh
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshToken();
          return this.axios.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }
}
```

### React Query Integration
```typescript
// Custom hooks for data fetching
export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => adminApi.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User status updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
```

## Component Library

### Core Components

#### DataTable
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: PaginationState;
  sorting?: SortingState;
  filtering?: FilteringState;
  selection?: SelectionState;
  loading?: boolean;
  error?: string;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onFilteringChange?: (filtering: FilteringState) => void;
  onSelectionChange?: (selection: SelectionState) => void;
}
```

#### StatusBadge
```typescript
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline';
}
```

#### KPICard
```typescript
interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ComponentType;
  color?: 'primary' | 'success' | 'warning' | 'error';
  loading?: boolean;
}
```

#### ConfirmationModal
```typescript
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  loading?: boolean;
}
```

## Error Handling & Loading States

### Error Boundaries
- Global error boundary for unhandled errors
- Page-level error boundaries for graceful degradation
- Component-level error states for specific failures

### Loading States
- Skeleton loaders for data tables
- Spinner overlays for actions
- Progressive loading for large datasets
- Optimistic updates where appropriate

### Toast Notifications
- Success confirmations for actions
- Error messages with retry options
- Warning alerts for important changes
- Info notifications for system updates

## Accessibility (WCAG AA)

### Keyboard Navigation
- Full keyboard accessibility for all interactive elements
- Logical tab order throughout the application
- Keyboard shortcuts for common actions
- Focus management in modals and dropdowns

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content
- Alternative text for images and icons

### Visual Accessibility
- High contrast color combinations
- Scalable text (up to 200% zoom)
- Clear focus indicators
- Color-blind friendly palette

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy features

### Data Optimization
- React Query caching strategies
- Pagination for large datasets
- Debounced search inputs
- Optimistic updates

### Bundle Optimization
- Tree shaking for unused code
- Compression and minification
- CDN delivery for static assets
- Service worker for caching

## Security Considerations

### Authentication Security
- JWT token expiration handling
- Secure token storage
- Automatic logout on inactivity
- Multi-factor authentication support

### Data Protection
- Input sanitization and validation
- XSS prevention
- CSRF protection
- Secure API communication (HTTPS)

### Audit Trail
- Complete action logging
- IP address tracking
- Session management
- Data access logging

## Testing Strategy

### Unit Tests
- Component rendering tests
- Hook functionality tests
- Utility function tests
- API client tests

### Integration Tests
- API integration tests
- Form submission flows
- Authentication flows
- Error handling scenarios

### E2E Tests
- Critical user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance

## Deployment & Monitoring

### Build Process
- TypeScript compilation
- Asset optimization
- Environment configuration
- Health check endpoints

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API response times

### Maintenance
- Automated dependency updates
- Security vulnerability scanning
- Performance audits
- Accessibility testing

## Future Enhancements

### Phase 2 Features
- Real-time notifications
- Advanced reporting dashboard
- Mobile app support
- API rate limiting dashboard

### Phase 3 Features
- Machine learning insights
- Automated risk assessment
- Advanced reconciliation
- Multi-tenant support

This specification provides a comprehensive foundation for building a production-ready admin dashboard that maps directly to the discovered API endpoints while maintaining high standards for user experience, security, and maintainability.