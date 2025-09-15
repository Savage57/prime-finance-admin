import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Shield, 
  UserCheck, 
  UserX, 
  Edit,
  Eye,
  Key,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { adminApi } from '../api/endpoints';
import { formatDate } from '../utils/format';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export function AdminManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { admin: currentAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Only Super Admins can access this page
  if (!currentAdmin?.is_super_admin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only Super Admins can access admin management
          </p>
        </div>
      </div>
    );
  }

  const { data: admins, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: () => adminApi.getAdmins().then(res => res.data.data),
  });

  const activateAdminMutation = useMutation({
    mutationFn: ({ adminId, isActive }: { adminId: string; isActive: boolean }) =>
      adminApi.activateUser(adminId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Admin status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update admin status');
    },
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const adminsList = admins || [];

  const getRoleBadge = (admin: any) => {
    if (admin.is_super_admin) {
      return <Badge variant="error"><Crown className="h-3 w-3 mr-1" />Super Admin</Badge>;
    }
    return <Badge variant="default">Admin</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return <Badge variant={isActive ? 'success' : 'error'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
  };

  const handleStatusToggle = (admin: any) => {
    if (admin._id === currentAdmin?._id) {
      toast.error('You cannot deactivate your own account');
      return;
    }

    const action = admin.status === 'active' ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} ${admin.user_metadata.first_name} ${admin.user_metadata.surname}?`)) {
      activateAdminMutation.mutate({ 
        adminId: admin._id, 
        isActive: admin.status !== 'active' 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage administrator accounts and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Admin
          </Button>
        </div>
      </div>

      {/* Super Admin Notice */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
      >
        <div className="flex items-center">
          <Crown className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-blue-800 dark:text-blue-200">
            Super Admin Access: You have full administrative privileges
          </span>
        </div>
      </motion.div>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Administrator Accounts ({adminsList.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminsList.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {admin.user_metadata.first_name?.[0]}{admin.user_metadata.surname?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {admin.user_metadata.first_name} {admin.user_metadata.surname}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {admin._id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getRoleBadge(admin)}</TableCell>
                  <TableCell>{getStatusBadge(admin.status === 'active')}</TableCell>
                  <TableCell>{formatDate(admin.created_at)}</TableCell>
                  <TableCell>
                    {admin.last_sign_in_at ? formatDate(admin.last_sign_in_at) : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {admin._id !== currentAdmin?._id && (
                        <Button
                          variant={admin.status === 'active' ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleStatusToggle(admin)}
                          disabled={activateAdminMutation.isPending}
                        >
                          {admin.status === 'active' ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {adminsList.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No administrators found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Permission</th>
                  <th className="text-center py-2 px-4">Super Admin</th>
                  <th className="text-center py-2 px-4">Admin</th>
                  <th className="text-center py-2 px-4">Manager</th>
                  <th className="text-center py-2 px-4">Viewer</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-2 px-4">User Management</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Loan Approval</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✗</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Loan Disbursement</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✗</td>
                  <td className="text-center py-2 px-4">✗</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Admin Creation</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✗</td>
                  <td className="text-center py-2 px-4">✗</td>
                  <td className="text-center py-2 px-4">✗</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">System Settings</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✓</td>
                  <td className="text-center py-2 px-4">✗</td>
                  <td className="text-center py-2 px-4">✗</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}