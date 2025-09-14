import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loanApi } from '../api/endpoints';

export function useLoans() {
  return useQuery({
    queryKey: ['loans'],
    queryFn: () => loanApi.getLoans().then(res => res.data),
    staleTime: 30_000,
    cacheTime: 5 * 60_000,
  });
}

export function useLoanStats() {
  return useQuery({
    queryKey: ['loanStats'],
    queryFn: () => loanApi.getStats().then(res => res.data),
    staleTime: 60_000,
  });
}

export function useDisburseLoan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { userId: string; amount: number; term: number; idempotencyKey?: string }) =>
      loanApi.disburseLoan(
        { userId: data.userId, amount: data.amount, term: data.term },
        data.idempotencyKey
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loanStats'] });
    },
  });
}