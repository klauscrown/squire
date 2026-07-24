import { useAuth } from '@/components/providers/AuthProvider';
import { useAppStore } from '@/store/appStore';

export const DEV_USER_ID = 'dev-user';

/** ID usado nas writes do Supabase (RLS). Sempre a sessão Supabase, nunca o UID Firebase. */
export function useAuthUserId(): string | null {
  const { isSupabaseConfigured, session } = useAuth();
  const isExplorerMode = useAppStore((state) => state.isExplorerMode);

  if (!isSupabaseConfigured || isExplorerMode || !session?.user.id) {
    return DEV_USER_ID;
  }

  return session.user.id;
}

export function useDataMode(): 'local' | 'cloud' {
  const { isSupabaseConfigured, session } = useAuth();
  const isExplorerMode = useAppStore((state) => state.isExplorerMode);

  if (!isSupabaseConfigured || isExplorerMode || !session) {
    return 'local';
  }

  return 'cloud';
}
