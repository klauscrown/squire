import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { QUERY_KEYS } from '@/constants';
import { useAuthUserId, useDataMode } from '@/hooks/useAuthUserId';
import { removeMediaByPublicUrl, uploadMediaImage } from '@/services/supabase';

import {
  createCampaign,
  deleteCampaign,
  getCampaign,
  getCampaigns,
  updateCampaign,
} from '../services/campaignService';
import type { Campaign, CreateCampaignInput, UpdateCampaignInput } from '../types';

export { useCampaignOverview } from './useCampaignOverview';

export type CreateCampaignPayload = CreateCampaignInput & {
  /** URI local da capa; enviada ao Storage após criar a campanha (modo nuvem). */
  coverLocalUri?: string | null;
};

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
  const dataMode = useDataMode();

  return useMutation({
    mutationFn: async (input: CreateCampaignPayload): Promise<Campaign> => {
      const { coverLocalUri, coverImageUrl, ...campaignInput } = input;

      const campaign = await createCampaign(
        {
          ...campaignInput,
          coverImageUrl:
            dataMode === 'cloud' ? undefined : (coverImageUrl ?? coverLocalUri ?? undefined),
        },
        userId!,
      );

      if (!coverLocalUri || dataMode !== 'cloud') {
        return campaign;
      }

      if (!userId || userId === 'dev-user') {
        throw new Error('Sessão necessária para enviar imagens à nuvem.');
      }

      let uploadedCoverUrl: string | null = null;

      try {
        uploadedCoverUrl = await uploadMediaImage({
          localUri: coverLocalUri,
          userId,
          folder: 'campaigns',
          entityId: campaign.id,
        });

        await updateCampaign(campaign.id, { coverImageUrl: uploadedCoverUrl });
        return { ...campaign, coverImageUrl: uploadedCoverUrl };
      } catch (error) {
        if (uploadedCoverUrl) {
          await removeMediaByPublicUrl(uploadedCoverUrl).catch(() => {});
        }

        Toast.show({
          type: 'info',
          text1: 'Campanha criada sem a capa',
          text2:
            error instanceof Error
              ? error.message
              : 'Você poderá adicionar outra imagem posteriormente.',
        });
        return campaign;
      }
    },
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
