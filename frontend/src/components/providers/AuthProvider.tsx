import type { Session } from '@supabase/supabase-js';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { isFirebaseConfigured } from '@/services/firebase';
import {
  mapFirebaseAuthError,
  signInWithEmail as firebaseSignInWithEmail,
  signOutFirebase,
  signUpWithEmail as firebaseSignUpWithEmail,
  subscribeFirebaseAuth,
} from '@/services/firebaseAuth';
import {
  getCurrentSession,
  getCurrentUserId,
  isSupabaseConfigured,
  signInAnonymously as supabaseSignInAnonymously,
  signOut as supabaseSignOut,
  tryGetSupabaseClient,
} from '@/services/supabase';

interface AuthContextValue {
  /** Supabase configurado (persistência de campanhas/dados). */
  isSupabaseConfigured: boolean;
  /** Firebase configurado (login e-mail/senha). */
  isFirebaseConfigured: boolean;
  /** Alias: Supabase configurado (compatível com telas existentes). */
  isConfigured: boolean;
  isLoading: boolean;
  /** Usuário Firebase (conta com e-mail), se houver. */
  firebaseUser: FirebaseUser | null;
  /** Sessão Supabase (anônima), usada para dados na nuvem. */
  session: Session | null;
  /** ID preferencial da conta Firebase; fallback Supabase. */
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

async function ensureSupabaseDataSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;

  const current = await getCurrentSession();
  if (current) return current;

  return supabaseSignInAnonymously();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const firebaseReady = isFirebaseConfigured();
  const supabaseReady = isSupabaseConfigured();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(firebaseReady || supabaseReady);

  useEffect(() => {
    let mounted = true;
    const authTimeout = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 8_000);

    if (!firebaseReady && !supabaseReady) {
      setIsLoading(false);
      clearTimeout(authTimeout);
      return;
    }

    let remaining = (firebaseReady ? 1 : 0) + (supabaseReady ? 1 : 0);
    let firebaseSettled = false;

    function settle() {
      remaining -= 1;
      if (remaining <= 0 && mounted) {
        setIsLoading(false);
      }
    }

    const unsubscribeFirebase = firebaseReady
      ? subscribeFirebaseAuth((user) => {
          if (mounted) setFirebaseUser(user);
          if (!firebaseSettled) {
            firebaseSettled = true;
            settle();
          }
        })
      : null;

    if (supabaseReady) {
      void (async () => {
        try {
          const current = await getCurrentSession();
          if (mounted) setSession(current);
        } finally {
          settle();
        }
      })();
    }

    const supabase = tryGetSupabaseClient();
    const supabaseSub = supabase
      ? supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (mounted) setSession(nextSession);
        }).data.subscription
      : null;

    return () => {
      mounted = false;
      clearTimeout(authTimeout);
      unsubscribeFirebase?.();
      supabaseSub?.unsubscribe();
    };
  }, [firebaseReady, supabaseReady]);

  const value = useMemo<AuthContextValue>(() => {
    const supabaseUserId = getCurrentUserId(session);

    return {
      isSupabaseConfigured: supabaseReady,
      isFirebaseConfigured: firebaseReady,
      isConfigured: supabaseReady,
      isLoading,
      firebaseUser,
      session,
      userId: firebaseUser?.uid ?? supabaseUserId,
      email: firebaseUser?.email ?? null,
      isAuthenticated: Boolean(firebaseUser || session),
      signInWithEmail: async (email, password) => {
        try {
          const user = await firebaseSignInWithEmail(email, password);
          setFirebaseUser(user);
          try {
            const dataSession = await ensureSupabaseDataSession();
            setSession(dataSession);
          } catch {
            // Conta Firebase ok; dados podem ficar locais se a nuvem falhar
          }
        } catch (error) {
          throw new Error(mapFirebaseAuthError(error));
        }
      },
      signUpWithEmail: async (email, password) => {
        try {
          const user = await firebaseSignUpWithEmail(email, password);
          setFirebaseUser(user);
          try {
            const dataSession = await ensureSupabaseDataSession();
            setSession(dataSession);
          } catch {
            // Conta Firebase ok; dados podem ficar locais se a nuvem falhar
          }
        } catch (error) {
          throw new Error(mapFirebaseAuthError(error));
        }
      },
      signInAnonymously: async () => {
        const nextSession = await supabaseSignInAnonymously();
        setSession(nextSession);
      },
      signOut: async () => {
        await Promise.allSettled([
          signOutFirebase(),
          supabaseReady ? supabaseSignOut() : Promise.resolve(),
        ]);
        setFirebaseUser(null);
        setSession(null);
      },
    };
  }, [firebaseReady, supabaseReady, isLoading, firebaseUser, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
