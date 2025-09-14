import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transferApi } from '../api/endpoints';

export function useTransfer(id: string) {
  return useQuery({
    queryKey: ['transfer', id],
    queryFn: () => transferApi.getTransfer(id).then(res => res.data),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      toUserId?: string;
      recipientAccount?: string;
      amount: number;
      type: 'internal' | 'external';
      description?: string;
      idempotencyKey?: string;
    }) =>
      transferApi.createTransfer({
        toUserId: data.toUserId,
        recipientAccount: data.recipientAccount,
        amount: data.amount,
        type: data.type,
        description: data.description,
      }, data.idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useRequeryTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; idempotencyKey?: string }) =>
      transferApi.requeryTransfer(data.id, data.idempotencyKey),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfer', variables.id] });
    },
  });
}