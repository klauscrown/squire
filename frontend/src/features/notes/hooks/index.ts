import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants';

import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from '../services/notesService';
import type { CreateNoteInput, UpdateNoteInput } from '../types';

export function useGetNotes(campaignId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.notes, campaignId],
    queryFn: () => getNotes(campaignId),
    enabled: Boolean(campaignId),
  });
}

export function useGetNote(noteId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.notes, 'detail', noteId],
    queryFn: () => getNote(noteId),
    enabled: Boolean(noteId),
  });
}

export function useCreateNote(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNoteInput) => createNote(input, campaignId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notes, campaignId] });
    },
  });
}

export function useUpdateNote(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNoteInput }) =>
      updateNote(id, input),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notes, campaignId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notes, 'detail', id] });
    },
  });
}

export function useDeleteNote(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notes, campaignId] });
    },
  });
}
