import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/adminApi';
import type { LoginRequest } from '../types/api';

export function useAuth() {
  const { admin, isAuthenticated, setAuth, clearAuth, updateAdmin } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => authApi.getProfile().then(res => res.data.data),
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, admin } = response.data.data;
      setAuth(admin, accessToken, refreshToken);
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<typeof admin>) => authApi.updateProfile(data),
    onSuccess: (response) => {
      updateAdmin(response.data.data);
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
  };

  return {
    admin: profile || admin,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutateAsync,
    logout,
    changePassword: changePasswordMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
  };
}