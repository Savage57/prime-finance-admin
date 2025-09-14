# Role-Based Access Control (RBAC) Matrix

## Overview

This document defines the comprehensive role-based access control system for the MyPrime admin dashboard. The RBAC system ensures that administrative users have appropriate access levels based on their responsibilities and organizational hierarchy.

## Role Definitions

### 1. Super Admin
**Description**: Highest level of system access with full administrative privileges
**Typical Users**: System administrators, C-level executives, IT security team
**Key Characteristics**:
- Can create and manage other admin accounts
- Full access to all system functions and data
- Can modify system settings and configurations
- Access to all audit logs and security features

### 2. Admin
**Description**: Standard administrative access for day-to-day operations
**Typical Users**: Operations managers, senior customer service representatives
**Key Characteristics**:
- Full access to user and transaction management
- Can approve/reject loans and perform financial operations
- Cannot create other admin accounts
- Limited access to system settings

### 3. Manager
**Description**: Supervisory access with approval capabilities but limited system changes
**Typical Users**: Team leads, department managers, compliance officers
**Key Characteristics**:
- Can view and approve transactions within limits
- Access to reports and analytics
- Cannot perform high-risk operations like loan disbursement
- Read-only access to most system settings

### 4. Viewer
**Description**: Read-only access for monitoring and reporting purposes
**Typical Users**: Analysts, junior staff, external auditors (limited scope)
**Key Characteristics**:
- View-only access to dashboards and reports
- Cannot perform any state-changing operations
- Limited access to sensitive financial data
- Cannot access user personal information

### 5. Auditor
**Description**: Specialized access for compliance and audit functions
**Typical Users**: Internal auditors, compliance officers, risk management team
**Key Characteristics**:
- Full access to audit logs and activity trails
- Read-only access to all financial reports
- Cannot perform operational functions
- Special access to reconciliation and compliance data

## Permission Matrix

| Feature Category | Super Admin | Admin | Manager | Viewer | Auditor |
|------------------|-------------|-------|---------|--------|---------|

### Authentication & Profile Management
| Login/Logout | ✓ | ✓ | ✓ | ✓ | ✓ |
| Change Own Password | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update Own Profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Own Activity Logs | ✓ | ✓ | ✓ | ✓ | ✓ |

### Dashboard & Overview
| View Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| View KPI Cards | ✓ | ✓ | ✓ | ✓ | ✓ |
| View System Health | ✓ | ✓ | ✓ | ✗ | ✓ |
| View Recent Activity | ✓ | ✓ | ✓ | ✗ | ✓ |

### User Management
| View Users List | ✓ | ✓ | ✓ | ✓ | ✗ |
| View User Details | ✓ | ✓ | ✓ | ✗ | ✗ |
| Search/Filter Users | ✓ | ✓ | ✓ | ✓ | ✗ |
| Activate/Deactivate Users | ✓ | ✓ | ✗ | ✗ | ✗ |
| View User Wallet Balance | ✓ | ✓ | ✓ | ✗ | ✗ |
| Adjust User Wallet | ✓ | ✓ | ✗ | ✗ | ✗ |
| Export User Data | ✓ | ✓ | ✓ | ✗ | ✗ |
| Impersonate User | ✓ | ✗ | ✗ | ✗ | ✗ |

### Loan Management
| View Loans List | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Loan Details | ✓ | ✓ | ✓ | ✓ | ✓ |
| Filter/Search Loans | ✓ | ✓ | ✓ | ✓ | ✓ |
| Approve Loans | ✓ | ✓ | ✓ | ✗ | ✗ |
| Reject Loans | ✓ | ✓ | ✓ | ✗ | ✗ |
| Disburse Loans | ✓ | ✓ | ✗ | ✗ | ✗ |
| Bulk Loan Actions | ✓ | ✓ | ✗ | ✗ | ✗ |
| View Loan Statistics | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export Loan Data | ✓ | ✓ | ✓ | ✓ | ✓ |

### Savings Management
| View Savings Plans | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Savings Plans | ✓ | ✓ | ✗ | ✗ | ✗ |
| Modify Savings Plans | ✓ | ✓ | ✗ | ✗ | ✗ |
| Activate/Deactivate Plans | ✓ | ✓ | ✗ | ✗ | ✗ |
| View Savings Statistics | ✓ | ✓ | ✓ | ✓ | ✓ |

### Transaction Management
| View All Transactions | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Transaction Details | ✓ | ✓ | ✓ | ✓ | ✓ |
| Search Transactions | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Flagged Transactions | ✓ | ✓ | ✓ | ✗ | ✓ |
| Review Flagged Transactions | ✓ | ✓ | ✓ | ✗ | ✗ |
| Approve/Reject Transactions | ✓ | ✓ | ✓ | ✗ | ✗ |
| Reverse Transactions | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manual Transaction Entry | ✓ | ✗ | ✗ | ✗ | ✗ |

### Reconciliation
| View Reconciliation Status | ✓ | ✓ | ✓ | ✗ | ✓ |
| View Inconsistencies | ✓ | ✓ | ✓ | ✗ | ✓ |
| Resolve Inconsistencies | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manual Reconciliation | ✓ | ✓ | ✗ | ✗ | ✗ |
| Requery Transfers | ✓ | ✓ | ✗ | ✗ | ✗ |
| Export Reconciliation Data | ✓ | ✓ | ✓ | ✗ | ✓ |

### Reports & Analytics
| View Business Reports | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Profit Reports | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Financial Statements | ✓ | ✓ | ✓ | ✗ | ✓ |
| View Trial Balance | ✓ | ✓ | ✓ | ✗ | ✓ |
| View General Ledger | ✓ | ✓ | ✗ | ✗ | ✓ |
| Export Reports (CSV) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export Reports (PDF) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Schedule Reports | ✓ | ✓ | ✗ | ✗ | ✗ |
| Custom Report Builder | ✓ | ✗ | ✗ | ✗ | ✗ |

### Activity Logs & Audit
| View Own Activity Logs | ✓ | ✓ | ✓ | ✓ | ✓ |
| View All Activity Logs | ✓ | ✗ | ✗ | ✗ | ✓ |
| Filter Activity Logs | ✓ | ✗ | ✗ | ✗ | ✓ |
| Export Activity Logs | ✓ | ✗ | ✗ | ✗ | ✓ |
| View System Audit Trail | ✓ | ✗ | ✗ | ✗ | ✓ |
| View Transaction Audit Trail | ✓ | ✓ | ✓ | ✗ | ✓ |

### Admin Management (Super Admin Only)
| Create Admin Accounts | ✓ | ✗ | ✗ | ✗ | ✗ |
| View Admin List | ✓ | ✗ | ✗ | ✗ | ✗ |
| Activate/Deactivate Admins | ✓ | ✗ | ✗ | ✗ | ✗ |
| Modify Admin Permissions | ✓ | ✗ | ✗ | ✗ | ✗ |
| Reset Admin Passwords | ✓ | ✗ | ✗ | ✗ | ✗ |
| View Admin Activity | ✓ | ✗ | ✗ | ✗ | ✗ |

### System Settings
| View System Settings | ✓ | ✓ | ✓ | ✗ | ✗ |
| Modify General Settings | ✓ | ✓ | ✗ | ✗ | ✗ |
| Modify Security Settings | ✓ | ✗ | ✗ | ✗ | ✗ |
| Modify Integration Settings | ✓ | ✗ | ✗ | ✗ | ✗ |
| View API Keys | ✓ | ✗ | ✗ | ✗ | ✗ |
| Regenerate API Keys | ✓ | ✗ | ✗ | ✗ | ✗ |
| Backup/Restore Settings | ✓ | ✗ | ✗ | ✗ | ✗ |

### System Monitoring
| View System Health | ✓ | ✓ | ✓ | ✗ | ✓ |
| View Performance Metrics | ✓ | ✓ | ✗ | ✗ | ✓ |
| View Error Logs | ✓ | ✓ | ✗ | ✗ | ✓ |
| View Queue Status | ✓ | ✓ | ✗ | ✗ | ✗ |
| Restart Services | ✓ | ✗ | ✗ | ✗ | ✗ |
| Clear Caches | ✓ | ✗ | ✗ | ✗ | ✗ |

## Permission Implementation

### Backend Permission Checks

```typescript
// Permission decorator for API endpoints
@RequirePermissions(['user.view', 'user.manage'])
@RequireRole(['admin', 'manager'])
async getUsers(req: Request, res: Response) {
  // Implementation
}

// Middleware for permission checking
export function requirePermissions(permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = req.user.permissions;
    const hasPermission = permissions.every(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permissions,
        current: userPermissions
      });
    }
    
    next();
  };
}
```

### Frontend Permission Checks

```typescript
// React hook for permission checking
export function usePermissions() {
  const { admin } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    return admin?.permissions.includes(permission) || false;
  };
  
  const hasRole = (role: string): boolean => {
    return admin?.role === role;
  };
  
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(admin?.role || '');
  };
  
  return { hasPermission, hasRole, hasAnyRole };
}

// Component-level permission checking
export function ProtectedComponent({ 
  requiredPermissions = [], 
  requiredRoles = [],
  children 
}: ProtectedComponentProps) {
  const { hasPermission, hasAnyRole } = usePermissions();
  
  const hasRequiredPermissions = requiredPermissions.every(hasPermission);
  const hasRequiredRole = requiredRoles.length === 0 || hasAnyRole(requiredRoles);
  
  if (!hasRequiredPermissions || !hasRequiredRole) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
}
```

## Permission Granularity

### Resource-Level Permissions

```typescript
// Fine-grained permissions for specific resources
const PERMISSIONS = {
  // User Management
  'user.view': 'View user information',
  'user.create': 'Create new users',
  'user.edit': 'Edit user information',
  'user.delete': 'Delete users',
  'user.activate': 'Activate/deactivate users',
  'user.impersonate': 'Impersonate users',
  
  // Loan Management
  'loan.view': 'View loan information',
  'loan.approve': 'Approve loan applications',
  'loan.reject': 'Reject loan applications',
  'loan.disburse': 'Disburse approved loans',
  'loan.modify': 'Modify loan terms',
  
  // Financial Operations
  'transaction.view': 'View transactions',
  'transaction.approve': 'Approve transactions',
  'transaction.reverse': 'Reverse transactions',
  'transaction.create': 'Create manual transactions',
  
  // Reports & Analytics
  'report.view': 'View reports',
  'report.export': 'Export reports',
  'report.schedule': 'Schedule automated reports',
  'report.financial': 'View financial reports',
  
  // System Administration
  'admin.create': 'Create admin accounts',
  'admin.manage': 'Manage admin accounts',
  'settings.view': 'View system settings',
  'settings.modify': 'Modify system settings',
  'audit.view': 'View audit logs',
  'system.monitor': 'Monitor system health'
} as const;
```

### Amount-Based Permissions

```typescript
// Permission limits based on transaction amounts
interface AmountLimits {
  maxTransactionAmount: number;
  maxDailyAmount: number;
  maxLoanAmount: number;
  requiresApproval: boolean;
}

const ROLE_LIMITS: Record<string, AmountLimits> = {
  'Super Admin': {
    maxTransactionAmount: Infinity,
    maxDailyAmount: Infinity,
    maxLoanAmount: Infinity,
    requiresApproval: false,
  },
  'Admin': {
    maxTransactionAmount: 10000000, // 10M NGN
    maxDailyAmount: 50000000, // 50M NGN
    maxLoanAmount: 5000000, // 5M NGN
    requiresApproval: false,
  },
  'Manager': {
    maxTransactionAmount: 1000000, // 1M NGN
    maxDailyAmount: 5000000, // 5M NGN
    maxLoanAmount: 1000000, // 1M NGN
    requiresApproval: true,
  },
};
```

## Security Considerations

### Session Management
- JWT tokens with 15-minute expiration
- Refresh tokens with 7-day expiration
- Automatic logout after 30 minutes of inactivity
- Concurrent session limits per user

### IP Address Restrictions
```typescript
// IP-based access control
interface IPRestriction {
  adminId: string;
  allowedIPs: string[];
  allowedRanges: string[];
  restrictionLevel: 'strict' | 'moderate' | 'none';
}

// Super Admins can have strict IP restrictions
// Regular admins can have moderate restrictions
// Viewers may have no IP restrictions
```

### Multi-Factor Authentication
- Required for Super Admin accounts
- Optional but recommended for Admin accounts
- TOTP-based (Google Authenticator, Authy)
- Backup codes for account recovery

### Audit Requirements
- All permission checks must be logged
- Failed permission attempts trigger alerts
- Regular permission reviews and updates
- Automated detection of privilege escalation

## Permission Templates

### Quick Role Assignment
```typescript
const ROLE_TEMPLATES = {
  'Customer Service': [
    'user.view', 'user.edit', 'transaction.view', 
    'loan.view', 'report.view'
  ],
  'Loan Officer': [
    'user.view', 'loan.view', 'loan.approve', 'loan.reject',
    'transaction.view', 'report.view'
  ],
  'Finance Manager': [
    'user.view', 'loan.view', 'loan.disburse', 'transaction.view',
    'transaction.approve', 'report.view', 'report.financial'
  ],
  'Compliance Officer': [
    'user.view', 'transaction.view', 'audit.view', 'report.view',
    'report.financial', 'system.monitor'
  ]
};
```

## Implementation Checklist

### Backend Implementation
- [ ] Permission middleware for all API endpoints
- [ ] Role-based route protection
- [ ] Amount-based permission checks
- [ ] Audit logging for all permission checks
- [ ] IP address validation
- [ ] Session management with proper expiration

### Frontend Implementation
- [ ] Permission-based component rendering
- [ ] Route-level access control
- [ ] Menu item visibility based on permissions
- [ ] Button/action disabling for unauthorized operations
- [ ] Clear error messages for access denied scenarios

### Security Measures
- [ ] Regular permission audits
- [ ] Automated privilege escalation detection
- [ ] Failed access attempt monitoring
- [ ] Multi-factor authentication setup
- [ ] IP restriction configuration
- [ ] Session timeout implementation

### Testing Requirements
- [ ] Unit tests for permission checking functions
- [ ] Integration tests for role-based access
- [ ] End-to-end tests for complete user journeys
- [ ] Security penetration testing
- [ ] Permission boundary testing
- [ ] Audit trail verification

This comprehensive RBAC matrix ensures secure, scalable, and maintainable access control for the MyPrime admin dashboard while providing clear guidelines for implementation and ongoing management.