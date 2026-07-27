export {
  firebaseConfig,
  googleWebClientId,
  isFirebaseConfigured,
  isGoogleSignInConfigured,
} from './config';
export { getFirebaseAuth, tryGetFirebaseAuth } from './client';
export {
  signInWithGoogleViaFirebase,
  signOutGoogleViaFirebase,
  mapGoogleSignInError,
  type GoogleSignInTokens,
} from './googleSignIn';
