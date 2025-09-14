// examples/pages/LedgerTrialBalance.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  FileText,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { adminApi } from '../apiClient';

// Component imports
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';

// Mock data structure for trial balance (would come from API)
interface TrialBalanceEntry {
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  debitBalance: number;
  creditBalance: number;
  netBalance: number;
}

interface TrialBalanceData {
  entries: TrialBalanceEntry[];
  totals: {
    totalDebits: number;
    totalCredits: number;
    netPosition: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
  generatedAt: string;
}

// Chart colors for different account types
const ACCOUNT_TYPE_COLORS = {
  asset: '#10B981',      // Green
  liability: '#EF4444',  // Red
  equity: '#8B5CF6',     // Purple
  revenue: '#06B6D4',    // Cyan
  expense: '#F59E0B',    // Amber
};

export function LedgerTrialBalance() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    endDate: new Date(), // Today
  });
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');

  // TODO: Replace with actual trial balance endpoint when available
  // This would be something like: GET /backoffice/ledger/trial-balance
  const { 
    data: trialBalanceData, 
    isLoading, 
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['trial-balance', dateRange, accountTypeFilter],
    queryFn: async (): Promise<TrialBalanceData> => {
      // TODO: Replace with actual API call
      // return adminApi.getTrialBalance({
      //   startDate: dateRange.startDate.toISOString(),
      //   endDate: dateRange.endDate.toISOString(),
      //   accountType: accountTypeFilter === 'all' ? undefined : accountTypeFilter
      // });
      
      // Mock data for demonstration
      return {
        entries: [
          {
            accountCode: '1000',
            accountName: 'Cash and Cash Equivalents',
            accountType: 'asset',
            debitBalance: 5000000,
            creditBalance: 0,
            netBalance: 5000000,
          },
          {
            accountCode: '1100',
            accountName: 'User Wallets',
            accountType: 'asset',
            debitBalance: 15000000,
            creditBalance: 0,
            netBalance: 15000000,
          },
          {
            accountCode: '1200',
            accountName: 'Loans Receivable',
            accountType: 'asset',
            debitBalance: 25000000,
            creditBalance: 2000000,
            netBalance: 23000000,
          },
          {
            accountCode: '2000',
            accountName: 'User Deposits',
            accountType: 'liability',
            debitBalance: 0,
            creditBalance: 15000000,
            netBalance: -15000000,
          },
          {
            accountCode: '2100',
            accountName: 'Accrued Interest Payable',
            accountType: 'liability',
            debitBalance: 0,
            creditBalance: 500000,
            netBalance: -500000,
          },
          {
            accountCode: '3000',
            accountName: 'Share Capital',
            accountType: 'equity',
            debitBalance: 0,
            creditBalance: 10000000,
            netBalance: -10000000,
          },
          {
            accountCode: '4000',
            accountName: 'Interest Income',
            accountType: 'revenue',
            debitBalance: 0,
            creditBalance: 3000000,
            netBalance: -3000000,
          },
          {
            accountCode: '4100',
            accountName: 'Fee Income',
            accountType: 'revenue',
            debitBalance: 0,
            creditBalance: 1500000,
            netBalance: -1500000,
          },
          {
            accountCode: '5000',
            accountName: 'Operating Expenses',
            accountType: 'expense',
            debitBalance: 2000000,
            creditBalance: 0,
            netBalance: 2000000,
          },
        ],
        totals: {
          totalDebits: 47000000,
          totalCredits: 32000000,
          netPosition: 15000000,
        },
        period: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
        },
        generatedAt: new Date().toISOString(),
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter entries based on account type
  const filteredEntries = trialBalanceData?.entries.filter(entry => 
    accountTypeFilter === 'all' || entry.accountType === accountTypeFilter
  ) || [];

  // Prepare chart data
  const chartData = Object.entries(
    filteredEntries.reduce((acc, entry) => {
      acc[entry.accountType] = (acc[entry.accountType] || 0) + Math.abs(entry.netBalance);
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, amount]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: amount,
    color: ACCOUNT_TYPE_COLORS[type as keyof typeof ACCOUNT_TYPE_COLORS],
  }));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  // Export functionality
  const handleExport = (format: 'csv' | 'pdf') => {
    // TODO: Implement export functionality
    console.log(`Exporting trial balance as ${format}`);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load trial balance</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trial Balance</h1>
          <p className="text-gray-600 dark:text-gray-400">
            General ledger account balances and financial position
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <DateRangePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onChange={setDateRange}
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Type
              </label>
              <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="asset">Assets</SelectItem>
                  <SelectItem value="liability">Liabilities</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {trialBalanceData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Debits
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(trialBalanceData.totals.totalDebits)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Credits
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(trialBalanceData.totals.totalCredits)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Net Position
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(trialBalanceData.totals.netPosition)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trial Balance Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Account Balances</span>
                {isLoading && <LoadingSpinner size="sm" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Net Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.accountCode}>
                        <TableCell className="font-mono text-sm">
                          {entry.accountCode}
                        </TableCell>
                        <TableCell className="font-medium">
                          {entry.accountName}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            style={{ 
                              borderColor: ACCOUNT_TYPE_COLORS[entry.accountType],
                              color: ACCOUNT_TYPE_COLORS[entry.accountType]
                            }}
                          >
                            {entry.accountType.charAt(0).toUpperCase() + entry.accountType.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {entry.debitBalance > 0 ? formatCurrency(entry.debitBalance) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {entry.creditBalance > 0 ? formatCurrency(entry.creditBalance) : '-'}
                        </TableCell>
                        <TableCell className={`text-right font-mono font-medium ${
                          entry.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {entry.netBalance >= 0 ? '+' : '-'}{formatCurrency(entry.netBalance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {filteredEntries.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No accounts found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Type Distribution Chart */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Balance']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-gray-500 dark:text-gray-400">No data available</p>
                </div>
              )}
              
              {/* Legend */}
              <div className="mt-4 space-y-2">
                {chartData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-gray-600 dark:text-gray-400">{entry.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Balance Verification */}
      {trialBalanceData && (
        <Card>
          <CardHeader>
            <CardTitle>Balance Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Double-Entry Verification
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Debits:</span>
                    <span className="font-mono">{formatCurrency(trialBalanceData.totals.totalDebits)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Credits:</span>
                    <span className="font-mono">{formatCurrency(trialBalanceData.totals.totalCredits)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Difference:</span>
                    <span className={`font-mono font-medium ${
                      trialBalanceData.totals.totalDebits === trialBalanceData.totals.totalCredits
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(Math.abs(trialBalanceData.totals.totalDebits - trialBalanceData.totals.totalCredits))}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Report Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Period:</span>
                    <span>
                      {new Date(trialBalanceData.period.startDate).toLocaleDateString()} - {' '}
                      {new Date(trialBalanceData.period.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Generated:</span>
                    <span>{new Date(trialBalanceData.generatedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Accounts:</span>
                    <span>{filteredEntries.length} accounts</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default LedgerTrialBalance;