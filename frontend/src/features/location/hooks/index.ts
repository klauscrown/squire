import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants';

import {
  createLocation,
  deleteLocation,
  getLocation,
  getLocations,
  updateLocation,
} from '../services/locationsService';
import type { CreateLocationInput, UpdateLocationInput } from '../types';

export function useGetLocations(campaignId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.locations, campaignId],
    queryFn: () => getLocations(campaignId),
    enabled: Boolean(campaignId),
  });
}

export function useGetLocation(locationId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.locations, 'detail', locationId],
    queryFn: () => getLocation(locationId),
    enabled: Boolean(locationId),
  });
}

export function useCreateLocation(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLocationInput) => createLocation(input, campaignId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.locations, campaignId] });
    },
  });
}

export function useUpdateLocation(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLocationInput }) =>
      updateLocation(id, input),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.locations, campaignId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.locations, 'detail', id] });
    },
  });
}

export function useDeleteLocation(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.locations, campaignId] });
    },
  });
}
