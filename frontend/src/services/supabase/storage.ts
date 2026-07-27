import { getSupabaseClient } from './client';

export const MEDIA_BUCKET = 'media';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export type MediaFolder = 'npcs' | 'campaigns' | 'locations';

export interface UploadMediaInput {
  localUri: string;
  userId: string;
  folder: MediaFolder;
  entityId: string;
  mimeType?: string | null;
  /** Extensão sem ponto; inferida do mime se omitida. */
  extension?: string;
}

function extensionFromMime(mime: string): string {
  switch (mime) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    default:
      return 'jpg';
  }
}

function normalizeMime(mime?: string | null): string {
  if (mime && ALLOWED_MIME.has(mime)) return mime;
  return 'image/jpeg';
}

/**
 * Faz upload de uma imagem local para o bucket `media`.
 * Path: `{userId}/{folder}/{entityId}/{timestamp}.{ext}`
 */
export async function uploadMediaImage(input: UploadMediaInput): Promise<string> {
  const supabase = getSupabaseClient();
  const contentType = normalizeMime(input.mimeType);
  const ext = input.extension ?? extensionFromMime(contentType);
  const path = `${input.userId}/${input.folder}/${input.entityId}/${Date.now()}.${ext}`;

  const response = await fetch(input.localUri);
  if (!response.ok) {
    throw new Error('Não foi possível ler a imagem selecionada.');
  }

  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, arrayBuffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || 'Erro ao enviar imagem.');
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  if (!data.publicUrl) {
    throw new Error('Não foi possível obter a URL pública da imagem.');
  }

  return data.publicUrl;
}

/** Remove um objeto a partir da URL pública do bucket `media` (best-effort). */
export async function removeMediaByPublicUrl(publicUrl: string): Promise<void> {
  const marker = `/object/public/${MEDIA_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;

  const path = decodeURIComponent(publicUrl.slice(idx + marker.length));
  if (!path) return;

  const supabase = getSupabaseClient();
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}
