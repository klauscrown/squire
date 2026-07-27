export {
  signInAnonymously,
  signInWithPassword,
  signInWithGoogleTokens,
  signUpWithEmail,
  signOut,
  getCurrentSession,
  getCurrentUserId,
  getUserEmail,
  getUserDisplayName,
  getUserAvatarUrl,
  isAnonymousUser,
  hasPermanentAccount,
  mapSupabaseAuthError,
  type GoogleAuthTokens,
} from './auth';
export { getSupabaseClient, tryGetSupabaseClient } from './client';
export { isSupabaseConfigured, supabaseConfig } from './config';
export { assertSupabaseOk, assertSupabaseVoid } from './errors';
export { stripUndefined } from './utils';
export {
  mapCampaignRow,
  mapSessionRow,
  mapNpcRow,
  mapNoteRow,
  mapLocationRow,
  toIsoDate,
} from './mappers';
export {
  MEDIA_BUCKET,
  uploadMediaImage,
  removeMediaByPublicUrl,
  type MediaFolder,
  type UploadMediaInput,
} from './storage';
export type {
  Database,
  CampaignRow,
  SessionRow,
  NpcRow,
  NoteRow,
  LocationRow,
} from './types/database';
