import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

/**
 * Configuração pública do Firebase (cliente).
 * Expo carrega automaticamente `frontend/.env` e injeta `EXPO_PUBLIC_*` em `process.env`.
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

function readEnv(name: string): string {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: readEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: readEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId,
  );
}

function createFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    if (__DEV__) {
      console.warn(
        '[firebase] Variáveis EXPO_PUBLIC_FIREBASE_* ausentes ou incompletas. App/Auth/Firestore não inicializados.',
      );
    }
    return null;
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

function createFirebaseAuth(app: FirebaseApp): Auth {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // Fast Refresh, app já inicializado, ou export RN indisponível no bundler
    if (__DEV__) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('already been initialized')) {
        console.warn('[firebase] Auth persistence RN indisponível, usando getAuth().', message);
      }
    }
    return getAuth(app);
  }
}

/** App Firebase (null se as env vars não estiverem configuradas). */
export const firebaseApp: FirebaseApp | null = createFirebaseApp();

/** Instância do Firebase Auth (com persistência no dispositivo nativo). */
export const auth: Auth | null = firebaseApp ? createFirebaseAuth(firebaseApp) : null;

/** Instância do Cloud Firestore. */
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;

/** Alias semântico para Firestore. */
export const firestore: Firestore | null = db;

export function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error(
      'Firebase Auth não disponível. Defina as variáveis EXPO_PUBLIC_FIREBASE_* em frontend/.env',
    );
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!db) {
    throw new Error(
      'Firestore não disponível. Defina as variáveis EXPO_PUBLIC_FIREBASE_* em frontend/.env',
    );
  }
  return db;
}
