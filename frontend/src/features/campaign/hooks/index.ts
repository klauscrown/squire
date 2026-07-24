import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';



import { QUERY_KEYS } from '@/constants';

import { useAuthUserId } from '@/hooks/useAuthUserId';



import {

  createCampaign,

  deleteCampaign,

  getCampaign,

  getCampaigns,

  updateCampaign,

} from '../services/campaignService';

import type { CreateCampaignInput, UpdateCampaignInput } from '../types';

export { useCampaignOverview } from './useCampaignOverview';

export function useGetCampaigns() {

  const userId = useAuthUserId();



  return useQuery({

    queryKey: [QUERY_KEYS.campaigns, userId],

    queryFn: () => getCampaigns(userId!),

    enabled: Boolean(userId),

  });

}



export function useGetCampaign(id: string) {

  return useQuery({

    queryKey: [QUERY_KEYS.campaigns, id],

    queryFn: () => getCampaign(id),

    enabled: Boolean(id),

  });

}



export function useCreateCampaign() {

  const queryClient = useQueryClient();

  const userId = useAuthUserId();



  return useMutation({

    mutationFn: (input: CreateCampaignInput) => createCampaign(input, userId!),

    onSuccess: () => {

      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.campaigns] });

    },

  });

}



export function useUpdateCampaign() {

  const queryClient = useQueryClient();



  return useMutation({

    mutationFn: ({ id, input }: { id: string; input: UpdateCampaignInput }) =>

      updateCampaign(id, input),

    onSuccess: (_data, { id }) => {

      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.campaigns] });

      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.campaigns, id] });

    },

  });

}



export function useDeleteCampaign() {

  const queryClient = useQueryClient();



  return useMutation({

    mutationFn: (id: string) => deleteCampaign(id),

    onSuccess: () => {

      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.campaigns] });

    },

  });

}


