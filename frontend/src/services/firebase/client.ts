import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

import { firebaseConfig, isFirebaseConfigured } from './config';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function createFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    if (__DEV__) {
      console.warn(
        '[firebase] Variáveis EXPO_PUBLIC_FIREBASE_* ausentes. Login Google indisponível.',
      );
    }
    return null;
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    if (!app) {
      app = createFirebaseApp();
    }

    if (!app) {
      throw new Error(
        'Firebase não configurado. Defina EXPO_PUBLIC_FIREBASE_* em frontend/.env para login Google.',
      );
    }

    auth = getAuth(app);
  }

  return auth;
}

export function tryGetFirebaseAuth(): Auth | null {
  if (!isFirebaseConfigured()) return null;

  try {
    return getFirebaseAuth();
  } catch {
    return null;
  }
}
