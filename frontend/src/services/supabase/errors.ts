import type { PostgrestError } from '@supabase/supabase-js';

export function assertSupabaseOk<T>(
  data: T | null,
  error: PostgrestError | null,
  fallbackMessage: string,
): T {
  if (error) {
    throw new Error(error.message || fallbackMessage);
  }

  if (data === null || data === undefined) {
    throw new Error(fallbackMessage);
  }

  return data;
}

export function assertSupabaseVoid(error: PostgrestError | null, fallbackMessage: string): void {
  if (error) {
    throw new Error(error.message || fallbackMessage);
  }
}
