import type { Campaign } from '@/features/campaign/types';
import type { Note } from '@/features/notes/types';
import type { Npc } from '@/features/npc/types';
import type { Session } from '@/features/session/types';

import type { CampaignRow, NoteRow, NpcRow, SessionRow } from './types/database';

function toDate(value: string): Date {
  return new Date(value);
}

function toIsoDate(value?: Date): string | null {
  return value ? value.toISOString() : null;
}

export function mapCampaignRow(row: CampaignRow): Campaign {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    system: row.system ?? undefined,
    coverImageUrl: row.cover_image_url ?? undefined,
    status: row.status,
    playersCount: row.players_count ?? undefined,
    createdBy: row.created_by,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
}

export function mapSessionRow(row: SessionRow): Session {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    title: row.title,
    sessionNumber: row.session_number ?? undefined,
    playedAt: row.played_at ? toDate(row.played_at) : undefined,
    summary: row.summary,
    status: row.status,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
}

export function mapNpcRow(row: NpcRow): Npc {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    role: row.role ?? undefined,
    race: row.race ?? undefined,
    classType: row.class_type ?? undefined,
    location: row.location ?? undefined,
    portraitUrl: row.portrait_url ?? undefined,
    description: row.description,
    disposition: row.disposition,
    status: row.status ?? 'alive',
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
}

export function mapNoteRow(row: NoteRow): Note {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    title: row.title,
    content: row.content,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
}

export { toIsoDate };
