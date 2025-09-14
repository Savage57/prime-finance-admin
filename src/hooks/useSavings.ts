import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savingsApi } from '../api/endpoints';

export function useSavings(userId: string) {
  return useQuery({
    queryKey: ['savings', userId],
    queryFn: () => savingsApi.getSavings(userId).then(res => res.data),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useDepositSavings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { amount: number; idempotencyKey?: string }) =>
      savingsApi.deposit(data.amount, data.idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useWithdrawSavings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { amount: number; idempotencyKey?: string }) =>
      savingsApi.withdraw(data.amount, data.idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}