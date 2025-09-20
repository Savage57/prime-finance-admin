import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search,
  Eye, 
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  ArrowLeftRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { transactionApi } from '../api/endpoints';
import { formatCurrency, formatDateTime } from '../utils/format';

export function Transactions() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);

  const { data: transactionData, isLoading } = useQuery({
    queryKey: ['transactions', page, search, status, type],
    queryFn: () => transactionApi.getTransactions({ 
      page, 
      limit: 20,
      search: search || undefined,
      status: status === 'all' ? undefined : status,
      type: type === 'all' ? undefined : type
    }).then(res => res.data.data),
  });

  if (isLoading && !search) {
    return <PageLoader />;
  }

  console.log('Transaction Data: ', transactionData)

  const transactions = transactionData?.transfers || [];

  const pagination = {
    page: transactionData?.page || 1,
    limit: 20,
    pages: transactionData?.pages || 1,
    total: transactionData?.total || 0,
  };

  const pageFunc = () => pagination && pagination.pages > 1 && (
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
          disabled={page === pagination.pages}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'warning',
      COMPLETED: 'success',
      FAILED: 'error'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage transactions
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
      <Card>
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="inter">Inter Transfer</option>
                <option value="intra">Intra Transfer</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowLeftRight className="h-5 w-5 mr-2 text-blue-600" />
            Trasaction ({transactions.length})
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
              <p className="text-gray-500 dark:text-gray-400">No transactions</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">All transactions are processing normally</p>
            </div>
          )}
        </CardContent>
      </Card>

      {pageFunc()}
    </div>
  );
}