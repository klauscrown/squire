import { useAppStore } from '@/store/appStore';
import { isSupabaseConfigured } from '@/services/supabase';

export function shouldUseLocalBackend(): boolean {
  if (!isSupabaseConfigured()) return true;
  return useAppStore.getState().isExplorerMode;
}
