import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants';

import { createNpc, deleteNpc, getNpc, getNpcs, updateNpc } from '../services/npcsService';
import type { CreateNpcInput, UpdateNpcInput } from '../types';

export function useGetNpcs(campaignId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.npcs, campaignId],
    queryFn: () => getNpcs(campaignId),
    enabled: Boolean(campaignId),
  });
}

export function useGetNpc(npcId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.npcs, 'detail', npcId],
    queryFn: () => getNpc(npcId),
    enabled: Boolean(npcId),
  });
}

export function useCreateNpc(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNpcInput) => createNpc(input, campaignId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.npcs, campaignId] });
    },
  });
}

export function useUpdateNpc(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNpcInput }) => updateNpc(id, input),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.npcs, campaignId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.npcs, 'detail', id] });
    },
  });
}

export function useDeleteNpc(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNpc(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.npcs, campaignId] });
    },
  });
}
