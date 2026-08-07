import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants';

import {
  createUniverse,
  createUniverseConnection,
  createUniverseElement,
  deleteUniverseElement,
  getActiveUniverse,
  getCampaignUniverseLinks,
  getUniverse,
  getUniverseConnections,
  getUniverseElement,
  getUniverseElements,
  getUniverses,
  linkCampaignToUniverse,
  selectActiveUniverse,
  unlinkCampaignFromUniverse,
  updateUniverse,
  updateUniverseElement,
} from '../services';
import type {
  CreateUniverseConnectionInput,
  CreateUniverseElementInput,
  CreateUniverseInput,
  UpdateUniverseElementInput,
  UpdateUniverseInput,
} from '../types';

function invalidateUniverseRoot(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.universes] });
}

export function useGetUniverses() {
  return useQuery({
    queryKey: [QUERY_KEYS.universes],
    queryFn: getUniverses,
  });
}

export function useGetUniverse(universeId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.universes, 'detail', universeId],
    queryFn: () => getUniverse(universeId ?? ''),
    enabled: Boolean(universeId),
  });
}

export function useGetActiveUniverse() {
  return useQuery({
    queryKey: [QUERY_KEYS.universes, 'active'],
    queryFn: getActiveUniverse,
  });
}

export function useCreateUniverse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUniverseInput) => createUniverse(input),
    onSuccess: (universe) => {
      invalidateUniverseRoot(queryClient);
      queryClient.setQueryData([QUERY_KEYS.universes, 'active'], universe);
      queryClient.setQueryData([QUERY_KEYS.universes, 'detail', universe.id], universe);
    },
  });
}

export function useUpdateUniverse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUniverseInput }) =>
      updateUniverse(id, input),
    onSuccess: (universe) => {
      invalidateUniverseRoot(queryClient);
      queryClient.setQueryData([QUERY_KEYS.universes, 'active'], universe);
      queryClient.setQueryData([QUERY_KEYS.universes, 'detail', universe.id], universe);
    },
  });
}

export function useSelectActiveUniverse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (universeId: string) => selectActiveUniverse(universeId),
    onSuccess: (universe) => {
      queryClient.setQueryData([QUERY_KEYS.universes, 'active'], universe);
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.universeElements] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.campaignUniverseLinks] });
    },
  });
}

export function useGetUniverseElements(universeId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.universeElements, universeId],
    queryFn: () => getUniverseElements(universeId ?? ''),
    enabled: Boolean(universeId),
  });
}

export function useGetUniverseElement(elementId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.universeElements, 'detail', elementId],
    queryFn: () => getUniverseElement(elementId ?? ''),
    enabled: Boolean(elementId),
  });
}

export function useCreateUniverseElement(universeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUniverseElementInput) => createUniverseElement(input, universeId),
    onSuccess: (element) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.universeElements, universeId] });
      queryClient.setQueryData([QUERY_KEYS.universeElements, 'detail', element.id], element);
    },
  });
}

export function useUpdateUniverseElement(universeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUniverseElementInput }) =>
      updateUniverseElement(id, input),
    onSuccess: (element) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.universeElements, universeId] });
      queryClient.setQueryData([QUERY_KEYS.universeElements, 'detail', element.id], element);
    },
  });
}

export function useDeleteUniverseElement(universeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (elementId: string) => deleteUniverseElement(elementId),
    onSuccess: (_data, elementId) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.universeElements, universeId] });
      void queryClient.removeQueries({
        queryKey: [QUERY_KEYS.universeElements, 'detail', elementId],
      });
      void queryClient.removeQueries({
        queryKey: [QUERY_KEYS.universeConnections, elementId],
      });
    },
  });
}

export function useGetUniverseConnections(elementId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.universeConnections, elementId],
    queryFn: () => getUniverseConnections(elementId ?? ''),
    enabled: Boolean(elementId),
  });
}

export function useCreateUniverseConnection(sourceElementId: string, universeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUniverseConnectionInput) =>
      createUniverseConnection(sourceElementId, input),
    onSuccess: (connection) => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.universeConnections, connection.sourceElementId],
      });
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.universeConnections, connection.targetElementId],
      });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.universeElements, universeId] });
    },
  });
}

export function useGetCampaignUniverseLinks(universeId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.campaignUniverseLinks, universeId],
    queryFn: () => getCampaignUniverseLinks(universeId ?? ''),
    enabled: Boolean(universeId),
  });
}

export function useLinkCampaignToUniverse(universeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (campaignId: string) => linkCampaignToUniverse(campaignId, universeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.campaignUniverseLinks, universeId],
      });
    },
  });
}

export function useUnlinkCampaignFromUniverse(universeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (campaignId: string) => unlinkCampaignFromUniverse(campaignId, universeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.campaignUniverseLinks, universeId],
      });
    },
  });
}
