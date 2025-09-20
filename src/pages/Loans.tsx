import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Download,
  CreditCard,
  UserPlus2,
  Send,
  LineChart,
  TrendingDown,
  CalendarX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { loanApi } from '../api/endpoints';
import { formatCurrency, formatDate } from '../utils/format';
import { toast } from 'react-hot-toast';
import { Loan } from '../types/api';

export function Loans() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: loansData, isLoading } = useQuery({
    queryKey: ['loans', page, search, statusFilter],
    queryFn: () => loanApi.getLoansByCategory({
      page,
      limit: 20,
      category: statusFilter === 'all' ? undefined : statusFilter,
      search: search || undefined,
    }).then(res => res.data.data),
  });

  console.log('Loan Data: ', loansData);

  const { data: loanStats } = useQuery({
    queryKey: ['loan-stats'],
    queryFn: () => loanApi.getLoanStats().then(res => res.data.data),
  });

  const disburseLoanMutation = useMutation({
    mutationFn: ({ loanId, amount }: { loanId: string; amount?: number }) =>
      loanApi.disburseLoan({ loanId, amount }, crypto.randomUUID()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loan-stats'] });
      toast.success('Loan disbursed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to disburse loan');
    },
  });

  const rejectLoanMutation = useMutation({
    mutationFn: ({ loanId, reason }: { loanId: string; reason: string }) =>
      loanApi.rejectLoan(loanId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loan-stats'] });
      toast.success('Loan rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject loan');
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: ({ loanIds, action, reason }: { loanIds: string[]; action: 'approve' | 'reject'; reason?: string }) =>
      loanApi.bulkLoanAction({ loanIds, action, reason }, crypto.randomUUID()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loan-stats'] });
      setSelectedLoans([]);
      toast.success('Bulk action completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Bulk action failed');
    },
  });

  if (isLoading && !search) {
    return <PageLoader />;
  }

  const loans = loansData?.loans || [];
  const users = loansData?.users || [];
  const pagination = {
    limit: 20,
    page: loansData?.page || 1,
    pages: loansData?.pages || 1,
    total: loansData?.total || 0,
  };

  const convertBadge = (loan: Loan): string => {
    const { status, loan_payment_status: payStatus, repayment_date } = loan;
    const now = new Date();
    const repaymentDate = new Date(repayment_date);

    // Normalize dates to day-level (ignore hours/minutes)
    const isSameDay = (d1: Date, d2: Date) =>
      d1.toDateString() === d2.toDateString();

    const isDue = isSameDay(repaymentDate, now);
    const isOverdue = repaymentDate < now && !isDue;

    if (status === "pending") return "pending";
    if (status === "rejected") return "rejected";

    if (status === "accepted") {
      if ((payStatus === "not-started" || payStatus === "in-progress") && isOverdue)
        return "overdue";
      if ((payStatus === "not-started" || payStatus === "in-progress") && isDue)
        return "due";
      if (payStatus === "not-started") return "not-started";
      if (payStatus === "in-progress") return "in-progress";
      if (payStatus === "complete") return "completed";
      return "active";
    }

    return "unknown"; // fallback
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "warning",
      active: "info",
      completed: "success",
      overdue: "error",
      due: "warning",
      rejected: "error",
      "not-started": "error",
      "in-progress": "warning",
      unknown: "default",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  const handleLoanAction = (loanId: string, action: 'approve' | 'reject' | 'disburse') => {
    if (action === 'disburse') {
      const amount = prompt('Please enter the amount to disburse:');
      if (amount) {
        disburseLoanMutation.mutate({ loanId, amount: Number(amount) });
      }
    } else if (action === 'reject') {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason) {
        rejectLoanMutation.mutate({ loanId, reason });
      }
    }
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedLoans.length === 0) {
      toast.error('Please select loans first');
      return;
    }

    let reason;
    if (action === 'reject') {
      reason = prompt('Please provide a reason for rejection:');
      if (!reason) return;
    }

    bulkActionMutation.mutate({ loanIds: selectedLoans, action, reason });
  };

  const handleSelectLoan = (loanId: string) => {
    setSelectedLoans(prev => 
      prev.includes(loanId) 
        ? prev.filter(id => id !== loanId)
        : [...prev, loanId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLoans.length === loans.length) {
      setSelectedLoans([]);
    } else {
      setSelectedLoans(loans.map(loan => loan._id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loan Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage loan applications and disbursements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {loanStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Loans</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loanStats.totalLoans.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending ({loanStats.pendingLoans?.toLocaleString("en-US") || 0})</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦{loanStats.pendingAmount.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active ({ loanStats.activeLoans?.toLocaleString("en-US") || 0})</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦{loanStats.activeAmount.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <LineChart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue ({ loanStats.overdueLoans?.toLocaleString("en-US") || 0})</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦{loanStats.overdueAmount?.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <CalendarX className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fully Repaid ({ loanStats.repaidLoans?.toLocaleString("en-US") || 0 })</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦{loanStats.repaidAmount.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Repaying ({ loanStats.repaidingLoans?.toLocaleString("en-US") || 0 })</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦{loanStats.repaidingAmount.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Not Started</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loanStats.notStarted?.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due ({loanStats.dueLoans?.toLocaleString("en-US") || 0})</p>
                    <p className="text-2xl font-bold text-gray-900 pr-2 dark:text-white">
                      ₦{loanStats.dueAmount?.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applied ({ loanStats.appliedUsers.toLocaleString("en-US") || 0 })</p>
                    <p className="text-2xl font-bold text-gray-900 pr-2 dark:text-white">
                      ₦{loanStats.totalApplied.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <UserPlus2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disbursed ({loanStats.disbursedUsers.toLocaleString("en-US") || 0})</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦{loanStats.totalDisbursed.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Send className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Realized Profits</p>
                    <p className="text-2xl font-bold text-gray-900 pr-2 dark:text-white">
                      ₦{loanStats.realizedProfit.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/20">
                    <TrendingUp className="h-6 w-6 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unrealized Profits</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦{loanStats.unrealizedProfit.toLocaleString("en-US") || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search loans by borrower name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="due">Due</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedLoans.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedLoans.length} loan(s) selected
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  size="sm" 
                  onClick={() => handleBulkAction('approve')}
                  disabled={bulkActionMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Selected
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleBulkAction('reject')}
                  disabled={bulkActionMutation.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Loans ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedLoans.length === loans.length && loans.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedLoans.includes(loan._id)}
                      onChange={() => handleSelectLoan(loan._id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {loan.first_name} {loan.last_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {loan.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(loan.amount)}
                    </span>
                  </TableCell>
                  <TableCell>{loan.duration} days</TableCell>
                  <TableCell>{loan.percentage || 10}%</TableCell>
                  <TableCell>{getStatusBadge(convertBadge(loan))}</TableCell>
                  <TableCell>{formatDate(loan.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {loan.status === 'pending' && (
                        <>
                          <Button 
                            variant='secondary'
                            size="sm" 
                            onClick={() => handleLoanAction(loan._id, 'disburse')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleLoanAction(loan._id, 'reject')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {loans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No loans found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}