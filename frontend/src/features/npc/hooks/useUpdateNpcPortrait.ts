import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { QUERY_KEYS } from '@/constants';
import { useAuthUserId, useDataMode } from '@/hooks/useAuthUserId';
import { pickImageFromLibrary } from '@/services/media/pickImage';
import { uploadMediaImage } from '@/services/supabase';

import { updateNpc } from '../services/npcsService';
import type { Npc } from '../types';

export function useUpdateNpcPortrait(campaignId: string, npcId: string) {
  const queryClient = useQueryClient();
  const userId = useAuthUserId();
  const dataMode = useDataMode();

  return useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: async (): Promise<string> => {
      const picked = await pickImageFromLibrary();
      if (!picked) {
        throw new Error('CANCELLED');
      }

      let portraitUrl = picked.uri;

      if (dataMode === 'cloud') {
        if (!userId || userId === 'dev-user') {
          throw new Error('Sessão necessária para enviar imagens à nuvem.');
        }
        portraitUrl = await uploadMediaImage({
          localUri: picked.uri,
          userId,
          folder: 'npcs',
          entityId: npcId,
          mimeType: picked.mimeType,
        });
      }

      await updateNpc(npcId, { portraitUrl });
      return portraitUrl;
    },
    onSuccess: (portraitUrl) => {
      queryClient.setQueryData<Npc>([QUERY_KEYS.npcs, 'detail', npcId], (prev) =>
        prev ? { ...prev, portraitUrl, updatedAt: new Date() } : prev,
      );
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.npcs, campaignId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.npcs, 'detail', npcId] });
      Toast.show({ type: 'success', text1: 'Retrato atualizado' });
    },
    onError: (error: Error) => {
      if (error.message === 'CANCELLED') return;
      Toast.show({
        type: 'error',
        text1: 'Falha ao importar retrato',
        text2: error.message,
      });
    },
  });
}
