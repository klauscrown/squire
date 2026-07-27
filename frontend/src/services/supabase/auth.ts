import type { AuthError, Session, SignInWithIdTokenCredentials, User } from '@supabase/supabase-js';

import { getSupabaseClient } from './client';
import { isSupabaseConfigured } from './config';

function requireSession(session: Session | null, fallbackMessage: string): Session {
  if (!session) {
    throw new Error(fallbackMessage);
  }

  return session;
}

export function mapSupabaseAuthError(error: unknown): string {
  if (!error) return 'Não foi possível concluir a autenticação.';

  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as AuthError).message)
      : error instanceof Error
        ? error.message
        : String(error);

  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }
  if (normalized.includes('user already registered')) {
    return 'Este e-mail já está cadastrado.';
  }
  if (normalized.includes('password should be at least')) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  if (normalized.includes('signup is disabled')) {
    return 'Cadastro por e-mail não está habilitado no Supabase.';
  }
  if (normalized.includes('anonymous sign-ins are disabled')) {
    return 'Login anônimo não está habilitado no Supabase.';
  }
  if (normalized.includes('email address') && normalized.includes('invalid')) {
    return 'Informe um e-mail válido.';
  }
  if (normalized.includes('identity is already linked')) {
    return 'Esta conta Google já está vinculada a outro usuário.';
  }
  if (normalized.includes('bad id token') || normalized.includes('invalid jwt')) {
    return 'Token Google inválido. Verifique a configuração do provider Google no Supabase.';
  }

  return message || 'Não foi possível concluir a autenticação.';
}

export function getUserEmail(user: User | null | undefined): string | null {
  return user?.email?.trim() || null;
}

export function getUserDisplayName(user: User | null | undefined): string | null {
  const metadataName =
    typeof user?.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name.trim()
      : typeof user?.user_metadata?.name === 'string'
        ? user.user_metadata.name.trim()
        : '';

  if (metadataName) return metadataName;

  const email = getUserEmail(user);
  if (email?.includes('@')) {
    return email.split('@')[0] ?? null;
  }

  return null;
}

export function getUserAvatarUrl(user: User | null | undefined): string | null {
  const avatar =
    typeof user?.user_metadata?.avatar_url === 'string'
      ? user.user_metadata.avatar_url.trim()
      : typeof user?.user_metadata?.picture === 'string'
        ? user.user_metadata.picture.trim()
        : '';

  return avatar || null;
}

export function isAnonymousUser(user: User | null | undefined): boolean {
  return Boolean(user?.is_anonymous);
}

export function hasPermanentAccount(session: Session | null): boolean {
  if (!session?.user) return false;
  return !isAnonymousUser(session.user);
}

export interface GoogleAuthTokens {
  idToken: string;
  accessToken?: string;
  nonce?: string;
}

/** Converte token Google (via Firebase) em sessão Supabase — preserva user anônimo via linkIdentity. */
export async function signInWithGoogleTokens(tokens: GoogleAuthTokens): Promise<Session> {
  const supabase = getSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const currentUser = userData.user;

  const credentials: SignInWithIdTokenCredentials = {
    provider: 'google',
    token: tokens.idToken,
    access_token: tokens.accessToken,
    nonce: tokens.nonce,
  };

  if (currentUser?.is_anonymous) {
    const { data, error } = await supabase.auth.linkIdentity(credentials);

    if (error) {
      throw new Error(mapSupabaseAuthError(error));
    }

    return requireSession(data.session, 'Conta Google vinculada, mas a sessão não foi restaurada.');
  }

  const { data, error } = await supabase.auth.signInWithIdToken(credentials);

  if (error) {
    throw new Error(mapSupabaseAuthError(error));
  }

  return requireSession(data.session, 'Não foi possível entrar com Google.');
}

export async function signInAnonymously(): Promise<Session> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw new Error(mapSupabaseAuthError(error));
  }

  return requireSession(data.session, 'Não foi possível iniciar sessão anônima.');
}

export async function signInWithPassword(email: string, password: string): Promise<Session> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(mapSupabaseAuthError(error));
  }

  return requireSession(data.session, 'Não foi possível entrar.');
}

export async function signUpWithEmail(email: string, password: string): Promise<Session> {
  const supabase = getSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const currentUser = userData.user;

  if (currentUser?.is_anonymous) {
    const { error: updateError } = await supabase.auth.updateUser({ email, password });

    if (updateError) {
      throw new Error(mapSupabaseAuthError(updateError));
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(mapSupabaseAuthError(sessionError));
    }

    return requireSession(
      sessionData.session,
      'Conta criada, mas a sessão não pôde ser restaurada. Entre novamente.',
    );
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(mapSupabaseAuthError(error));
  }

  if (data.session) {
    return data.session;
  }

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    throw new Error(
      'Conta criada. Se a confirmação por e-mail estiver ativa no Supabase, confirme antes de entrar.',
    );
  }

  return requireSession(signInData.session, 'Conta criada, mas não foi possível iniciar a sessão.');
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(mapSupabaseAuthError(error));
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(mapSupabaseAuthError(error));
  }

  return data.session;
}

export function getCurrentUserId(session: Session | null): string | null {
  return session?.user.id ?? null;
}
