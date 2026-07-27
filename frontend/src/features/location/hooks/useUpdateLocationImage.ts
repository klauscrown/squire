import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { QUERY_KEYS } from '@/constants';
import { useAuthUserId, useDataMode } from '@/hooks/useAuthUserId';
import { pickImageFromLibrary } from '@/services/media/pickImage';
import { uploadMediaImage } from '@/services/supabase';

import { updateLocation } from '../services/locationsService';
import type { Location } from '../types';

export function useUpdateLocationImage(campaignId: string, locationId: string) {
  const queryClient = useQueryClient();
  const userId = useAuthUserId();
  const dataMode = useDataMode();

  return useMutation({
    mutationFn: async (): Promise<string> => {
      const picked = await pickImageFromLibrary();
      if (!picked) {
        throw new Error('CANCELLED');
      }

      let imageUrl = picked.uri;

      if (dataMode === 'cloud') {
        if (!userId || userId === 'dev-user') {
          throw new Error('Sessão necessária para enviar imagens à nuvem.');
        }
        imageUrl = await uploadMediaImage({
          localUri: picked.uri,
          userId,
          folder: 'locations',
          entityId: locationId,
          mimeType: picked.mimeType,
        });
      }

      await updateLocation(locationId, { imageUrl });
      return imageUrl;
    },
    onSuccess: (imageUrl) => {
      queryClient.setQueryData<Location>([QUERY_KEYS.locations, 'detail', locationId], (prev) =>
        prev ? { ...prev, imageUrl, updatedAt: new Date() } : prev,
      );
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.locations, campaignId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.locations, 'detail', locationId] });
      Toast.show({ type: 'success', text1: 'Imagem atualizada' });
    },
    onError: (error: Error) => {
      if (error.message === 'CANCELLED') return;
      Toast.show({
        type: 'error',
        text1: 'Falha ao importar imagem',
        text2: error.message,
      });
    },
  });
}
