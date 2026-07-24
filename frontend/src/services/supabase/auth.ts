import type { Session } from '@supabase/supabase-js';

import { getSupabaseClient } from './client';
import { isSupabaseConfigured } from './config';

export async function signInAnonymously(): Promise<Session> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error || !data.session) {
    throw new Error(error?.message ?? 'Não foi possível iniciar sessão anônima.');
  }

  return data.session;
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

export function getCurrentUserId(session: Session | null): string | null {
  return session?.user.id ?? null;
}
