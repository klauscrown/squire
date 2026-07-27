import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { Platform } from 'react-native';

import { getFirebaseAuth, tryGetFirebaseAuth } from './client';
import { googleWebClientId, isGoogleSignInConfigured } from './config';

export interface GoogleSignInTokens {
  idToken: string;
  accessToken?: string;
}

let googleSignInConfigured = false;

function ensureGoogleSignInConfigured(): void {
  if (googleSignInConfigured || Platform.OS === 'web') return;

  if (!googleWebClientId) {
    throw new Error(
      'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ausente. Copie o Web Client ID do Firebase Console (Authentication > Google).',
    );
  }

  GoogleSignin.configure({
    webClientId: googleWebClientId,
    offlineAccess: false,
  });

  googleSignInConfigured = true;
}

export function mapGoogleSignInError(error: unknown): string {
  if (!error) return 'Não foi possível entrar com Google.';

  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: string }).code)
      : '';

  if (code === 'auth/popup-closed-by-user' || code === '12501' || code === '-5') {
    return 'Login Google cancelado.';
  }
  if (code === 'auth/account-exists-with-different-credential') {
    return 'Este e-mail já está vinculado a outro método de login.';
  }

  const message = error instanceof Error ? error.message : String(error);
  return message || 'Não foi possível entrar com Google.';
}

/** Login Google via Firebase (web: popup; nativo: Google Sign-In + credential). */
export async function signInWithGoogleViaFirebase(): Promise<GoogleSignInTokens> {
  if (!isGoogleSignInConfigured()) {
    throw new Error(
      'Login Google não configurado. Preencha EXPO_PUBLIC_FIREBASE_* e EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.',
    );
  }

  if (Platform.OS === 'web') {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.idToken) {
      throw new Error('Token Google indisponível após login.');
    }

    return {
      idToken: credential.idToken,
      accessToken: credential.accessToken ?? undefined,
    };
  }

  ensureGoogleSignInConfigured();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();

  if (response.type === 'cancelled' || !response.data?.idToken) {
    throw Object.assign(new Error('Login Google cancelado.'), { code: '12501' });
  }

  const auth = getFirebaseAuth();
  const googleCredential = GoogleAuthProvider.credential(response.data.idToken);
  await signInWithCredential(auth, googleCredential);

  const nativeTokens = await GoogleSignin.getTokens();

  return {
    idToken: nativeTokens.idToken,
    accessToken: nativeTokens.accessToken,
  };
}

export async function signOutGoogleViaFirebase(): Promise<void> {
  const auth = tryGetFirebaseAuth();
  if (!auth) return;

  await firebaseSignOut(auth);

  if (Platform.OS !== 'web') {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Ignora — sessão nativa pode já estar encerrada
    }
  }
}
