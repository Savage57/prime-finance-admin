import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  CreditCard,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { dashboardApi, activityApi } from '../api/endpoints';
import { formatCurrency } from '../utils/format';

export function Dashboard() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getDashboard().then(res => res.data.data),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  console.log('Dashboard Data:', dashboardData);

  const { data: systemHealth, isLoading: isHealthLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => dashboardApi.getSystemHealth().then(res => res.data.data),
    refetchInterval: 60000, // Refresh every minute
  });

  console.log('System Health:', systemHealth);

  const { data: recentActivity, isLoading: isActivityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => activityApi.getActivityLogs({ limit: 5 }).then(res => res.data.data),
  });

  console.log('Recent Activity:', recentActivity);

  if (isDashboardLoading || isHealthLoading || isActivityLoading) {
    return <PageLoader />;
  }

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData.users.total || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Loans',
      value: dashboardData.loans.active || 0,
      change: '+8%',
      changeType: 'positive' as const,
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Savings',
      value: formatCurrency(dashboardData.savings.totalPlans || 0),
      change: '+15%',
      changeType: 'positive' as const,
      icon: PiggyBank,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Revenue',
      value: formatCurrency(dashboardData.revenue.totalRevenue || 0),
      change: '+23%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="success">Healthy</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'critical':
        return <Badge variant="error">Critical</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health Alert */}
      {systemHealth?.database !== 'healthy' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-yellow-800 dark:text-yellow-200">
              System health status: {getHealthBadge(systemHealth.database || 'unknown')}
            </span>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'positive' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(recentActivity?.logs || []).map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.admin?.user_metadata?.first_name} {activity.admin?.user_metadata?.surname}</span>
                        {' '}{activity.action} {activity.resource}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!recentActivity || (recentActivity?.logs || []).length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Health Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  System Health
                </span>
                {getHealthBadge(systemHealth?.database || 'unknown')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Object.entries(systemHealth?.providers || {}), ...Object.entries(systemHealth?.workers || {})].map(([name, status], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {name}
                    </span>
                    <Badge variant={status === 'running' || status === 'healthy' ? 'success' : 'error'}>
                      {status}
                    </Badge>
                  </div>
                ))}
                {(!systemHealth?.workers || Object.entries(systemHealth?.workers || {}).length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No health checks available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}