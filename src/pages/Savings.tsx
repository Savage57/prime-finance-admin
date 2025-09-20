import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  PiggyBank, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Plus,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { savingsApi } from '../api/endpoints';
import { formatCurrency, formatDate } from '../utils/format';

export function Savings() {
  const [page, setPage] = useState(1);

  const { data: savingsData, isLoading } = useQuery({
    queryKey: ['savings', page],
    queryFn: () => savingsApi.getSavingsByCategory({ category: undefined, page, limit: 20 }).then(res => res.data.data),
  });

  console.log('Savings Data:', savingsData);

  const { data: savingsStats } = useQuery({
    queryKey: ['savings-stats'],
    queryFn: () => savingsApi.getSavingsStats().then(res => res.data.data),
  });

  console.log('Savings Stats:', savingsStats);

  if (isLoading) {
    return <PageLoader />;
  }

  const savingsPlans = savingsData?.plans || [];
  const users = savingsData?.users || [];
  const pagination = {
    limit: 20,
    page: savingsData?.page || 1,
    total: savingsData?.total || 0,
    pages: savingsData?.pages || 1
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'success',
      completed: 'default',
      cancelled: 'error'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      LOCKED: 'warning',
      FLEXIBLE: 'info'
    } as const;
    
    return <Badge variant={variants[type as keyof typeof variants] || 'default'}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage savings plans and monitor performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {savingsStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Plans</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {savingsStats.totalPlans || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <PiggyBank className="h-6 w-6 text-purple-600" />
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Plans</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {savingsStats.activePlans || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <TrendingUp className="h-6 w-6 text-green-600" />
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Principal</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(savingsStats.totalPrincipal || 0)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <DollarSign className="h-6 w-6 text-blue-600" />
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interest Earned</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(savingsStats.totalInterestEarned || 0)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Savings Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Savings Plans ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest Earned</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savingsPlans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {plan.planName}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(plan.planType)}</TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(plan.principal)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">
                      {formatCurrency(plan.interestEarned)}
                    </span>
                  </TableCell>
                  <TableCell>{plan.interestRate}%</TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell>{formatDate(plan.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        {plan.status === "ACTIVE" ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {savingsPlans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No savings plans found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
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
      )}
    </div>
  );
}