import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, type ReactNode, useEffect, useMemo, useState } from 'react';

import {
  isGoogleSignInConfigured,
  mapGoogleSignInError,
  signInWithGoogleViaFirebase,
  signOutGoogleViaFirebase,
} from '@/services/firebase';
import {
  getCurrentSession,
  getCurrentUserId,
  getUserAvatarUrl,
  getUserDisplayName,
  getUserEmail,
  hasPermanentAccount,
  isAnonymousUser,
  isSupabaseConfigured,
  signInAnonymously as supabaseSignInAnonymously,
  signInWithGoogleTokens,
  signInWithPassword,
  signOut as supabaseSignOut,
  signUpWithEmail as supabaseSignUpWithEmail,
  tryGetSupabaseClient,
} from '@/services/supabase';

interface AuthContextValue {
  /** Supabase configurado (auth e-mail/anônimo + dados). */
  isSupabaseConfigured: boolean;
  /** Firebase + Web Client ID prontos para login Google. */
  isGoogleSignInConfigured: boolean;
  /** Alias de compatibilidade. */
  isConfigured: boolean;
  isLoading: boolean;
  session: Session | null;
  userId: string | null;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isAnonymous: boolean;
  hasEmailAccount: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const supabaseReady = isSupabaseConfigured();
  const googleReady = isGoogleSignInConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(supabaseReady);

  useEffect(() => {
    let mounted = true;
    const authTimeout = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 8_000);

    if (!supabaseReady) {
      clearTimeout(authTimeout);
      return;
    }

    void (async () => {
      try {
        const current = await getCurrentSession();
        if (mounted) setSession(current);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    const supabase = tryGetSupabaseClient();
    const supabaseSub = supabase
      ? supabase.auth.onAuthStateChange((event, nextSession) => {
          if (event === 'SIGNED_OUT') {
            queryClient.clear();
          }
          if (mounted) setSession(nextSession);
        }).data.subscription
      : null;

    return () => {
      mounted = false;
      clearTimeout(authTimeout);
      supabaseSub?.unsubscribe();
    };
  }, [queryClient, supabaseReady]);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;

    return {
      isSupabaseConfigured: supabaseReady,
      isGoogleSignInConfigured: googleReady,
      isConfigured: supabaseReady,
      isLoading,
      session,
      userId: getCurrentUserId(session),
      email: getUserEmail(user),
      displayName: getUserDisplayName(user),
      avatarUrl: getUserAvatarUrl(user),
      isAnonymous: isAnonymousUser(user),
      hasEmailAccount: hasPermanentAccount(session),
      isAuthenticated: Boolean(session),
      signInWithEmail: async (email, password) => {
        const nextSession = await signInWithPassword(email, password);
        setSession(nextSession);
      },
      signUpWithEmail: async (email, password) => {
        const nextSession = await supabaseSignUpWithEmail(email, password);
        setSession(nextSession);
      },
      signInWithGoogle: async () => {
        if (!supabaseReady) {
          throw new Error('Supabase não configurado.');
        }
        if (!googleReady) {
          throw new Error(
            'Login Google não configurado. Preencha EXPO_PUBLIC_FIREBASE_* e EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.',
          );
        }

        try {
          const googleTokens = await signInWithGoogleViaFirebase();
          const nextSession = await signInWithGoogleTokens(googleTokens);
          setSession(nextSession);
        } catch (error) {
          await signOutGoogleViaFirebase();
          throw new Error(mapGoogleSignInError(error));
        }
      },
      signInAnonymously: async () => {
        const nextSession = await supabaseSignInAnonymously();
        setSession(nextSession);
      },
      signOut: async () => {
        await Promise.allSettled([
          supabaseReady ? supabaseSignOut() : Promise.resolve(),
          signOutGoogleViaFirebase(),
        ]);
        queryClient.clear();
        setSession(null);
      },
    };
  }, [supabaseReady, googleReady, isLoading, queryClient, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
