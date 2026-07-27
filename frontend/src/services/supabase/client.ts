import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { isSupabaseConfigured, supabaseConfig } from './config';

/** Cliente Supabase; tipagem manual via Row types em `types/database.ts`. */
export type AppSupabaseClient = SupabaseClient;

let client: AppSupabaseClient | null = null;

export function getSupabaseClient(): AppSupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase não configurado. Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  if (!client) {
    client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  return client;
}

export function tryGetSupabaseClient(): AppSupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseClient();
}
