import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search,
  Eye, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { transactionApi } from '../api/endpoints';
import { formatCurrency, formatDateTime } from '../utils/format';

export function FlaggedOperations() {

  const { data: flaggedTransactions, isLoading } = useQuery({
    queryKey: ['flagged-transactions'],
    queryFn: () => transactionApi.getFlaggedTransactions().then(res => res.data.data),
  });

  if (isLoading) {
    return <PageLoader />;
  }

  console.log('Flagged Data: ', flaggedTransactions)

  const transactions = flaggedTransactions?.transfers || [];
  const billPayments = flaggedTransactions?.billPayments || [];
  const loans = flaggedTransactions?.loans || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'warning',
      COMPLETED: 'success',
      FAILED: 'error'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transfer':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'loan':
        return <ArrowDownLeft className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Operations Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage flagged operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      {/* <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by trace ID or account..."
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
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="transfer">Transfer</option>
                <option value="loan">Loan</option>
                <option value="savings">Savings</option>
                <option value="bill-payment">Bill Payment</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Flagged Transactions Alert */}
      {transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-yellow-800 dark:text-yellow-200">
              {transactions.length} flagged transaction(s) require review
            </span>
          </div>
        </motion.div>
      )}

      {/* Flagged Loans Alert */}
      {loans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-yellow-800 dark:text-yellow-200">
              {loans.length} flagged loan(s) require review
            </span>
          </div>
        </motion.div>
      )}

      {/* Flagged Bill Payment Alert */}
      {billPayments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-yellow-800 dark:text-yellow-200">
              {billPayments.length} flagged bill-payments(s) require review
            </span>
          </div>
        </motion.div>
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Flagged Transaction ({transactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trace ID</TableHead>
                <TableHead>From Account</TableHead>
                <TableHead>To Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    <div className="font-mono text-sm">
                      {transaction.traceId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {transaction.fromAccount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {transaction.toAccount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {transaction.transferType === 'inter' ? (
                        <ArrowUpRight className="h-4 w-4 text-blue-500 mr-2" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      <Badge variant={transaction.transferType === 'inter' ? 'info' : 'success'}>
                        {transaction.transferType}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>{formatDateTime(transaction.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No flagged transactions</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">All transactions are processing normally</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Flagged Loans ({loans.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repayment Date</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Repayment Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>
                    <div className="font-mono text-sm">
                      {formatDateTime(loan.repayment_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {loan.first_name} {loan.last_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {loan.loan_payment_status === 'not-started' ? (
                        <ArrowUpRight className="h-4 w-4 text-red-500 mr-2" />
                      ) : loan.loan_payment_status === 'in-progress' ? (
                        <ArrowUpRight className="h-4 w-4 text-orange-500 mr-2" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      <Badge variant={loan.loan_payment_status === 'not-started' ? 'error' : loan.loan_payment_status === 'in-progress' ? 'warning' : 'success'}>
                        {loan.loan_payment_status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getCategoryIcon(loan.category)}
                      <span className="ml-2 capitalize">{loan.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(loan.amount)}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(loan.status)}</TableCell>
                  <TableCell>{formatDateTime(loan.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {loans.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No flagged loans</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">All loans are processing normally</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billpayment Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Flagged Billpayment ({billPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trace ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billPayments.map((billPayment) => (
                <TableRow key={billPayment._id}>
                  <TableCell>
                    <div className="font-mono text-sm">
                      {billPayment.traceId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {billPayment.customerReference}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getCategoryIcon(billPayment.serviceType)}
                      <span className="ml-2 capitalize">{billPayment.serviceType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(billPayment.amount)}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(billPayment.status)}</TableCell>
                  <TableCell>{formatDateTime(billPayment.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {billPayments.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No flagged bill payments</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">All bill payments are processing normally</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}