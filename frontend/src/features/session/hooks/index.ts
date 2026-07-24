import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants';

import {
  createSession,
  deleteSession,
  getSession,
  getSessions,
  updateSession,
} from '../services/sessionsService';
import type { CreateSessionInput, UpdateSessionInput } from '../types';

export function useGetSessions(campaignId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.sessions, campaignId],
    queryFn: () => getSessions(campaignId),
    enabled: Boolean(campaignId),
  });
}

export function useGetSession(sessionId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.sessions, 'detail', sessionId],
    queryFn: () => getSession(sessionId),
    enabled: Boolean(sessionId),
  });
}

export function useCreateSession(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSessionInput) => createSession(input, campaignId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sessions, campaignId] });
    },
  });
}

export function useUpdateSession(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSessionInput }) =>
      updateSession(id, input),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sessions, campaignId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sessions, 'detail', id] });
    },
  });
}

export function useDeleteSession(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sessions, campaignId] });
    },
  });
}
