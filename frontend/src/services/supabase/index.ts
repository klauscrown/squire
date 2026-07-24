export { signInAnonymously, signOut, getCurrentSession, getCurrentUserId } from './auth';
export { getSupabaseClient, tryGetSupabaseClient } from './client';
export { isSupabaseConfigured, supabaseConfig } from './config';
export { assertSupabaseOk, assertSupabaseVoid } from './errors';
export { stripUndefined } from './utils';
export { mapCampaignRow, mapSessionRow, mapNpcRow, mapNoteRow, toIsoDate } from './mappers';
export {
  MEDIA_BUCKET,
  uploadMediaImage,
  removeMediaByPublicUrl,
  type MediaFolder,
  type UploadMediaInput,
} from './storage';
export type { Database, CampaignRow, SessionRow, NpcRow, NoteRow } from './types/database';
