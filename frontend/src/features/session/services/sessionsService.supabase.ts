import {
  assertSupabaseOk,
  assertSupabaseVoid,
  getSupabaseClient,
  mapSessionRow,
  stripUndefined,
  toIsoDate,
} from '@/services/supabase';

import type { CreateSessionInput, Session, UpdateSessionInput } from '../types';
import { parseDateInput } from '../types';

function sortSessions(a: Session, b: Session): number {
  if (a.sessionNumber != null && b.sessionNumber != null) {
    return b.sessionNumber - a.sessionNumber;
  }
  if (a.sessionNumber != null) return -1;
  if (b.sessionNumber != null) return 1;

  const aDate = a.playedAt ?? a.createdAt;
  const bDate = b.playedAt ?? b.createdAt;
  return bDate.getTime() - aDate.getTime();
}

async function nextSessionNumber(campaignId: string): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('session_number')
    .eq('campaign_id', campaignId)
    .not('session_number', 'is', null)
    .order('session_number', { ascending: false })
    .limit(1);

  const rows = assertSupabaseOk(data, error, 'Erro ao calcular número da sessão.');
  const current = rows[0]?.session_number;
  return current != null ? current + 1 : 1;
}

export async function getSessions(campaignId: string): Promise<Session[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('campaign_id', campaignId);

  const rows = assertSupabaseOk(data, error, 'Erro ao carregar sessões.');
  return rows.map(mapSessionRow).sort(sortSessions);
}

export async function getSession(id: string): Promise<Session> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('sessions').select('*').eq('id', id).maybeSingle();

  const row = assertSupabaseOk(data, error, 'Sessão não encontrada.');
  return mapSessionRow(row);
}

export async function createSession(
  input: CreateSessionInput,
  campaignId: string,
): Promise<Session> {
  const supabase = getSupabaseClient();
  const sessionNumber =
    input.sessionNumber && input.sessionNumber !== ''
      ? Number(input.sessionNumber)
      : await nextSessionNumber(campaignId);

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      campaign_id: campaignId,
      title: input.title,
      session_number: sessionNumber,
      played_at: toIsoDate(parseDateInput(input.playedAt)),
      summary: input.summary ?? '',
      status: input.status ?? 'planned',
    })
    .select('*')
    .single();

  const row = assertSupabaseOk(data, error, 'Erro ao criar sessão.');
  return mapSessionRow(row);
}

export async function updateSession(id: string, input: UpdateSessionInput): Promise<void> {
  const supabase = getSupabaseClient();
  const playedAt =
    input.playedAt !== undefined ? toIsoDate(parseDateInput(input.playedAt)) : undefined;

  const { error } = await supabase
    .from('sessions')
    .update(
      stripUndefined({
        title: input.title,
        session_number: input.sessionNumber,
        played_at: playedAt,
        summary: input.summary,
        status: input.status,
      }),
    )
    .eq('id', id);

  assertSupabaseVoid(error, 'Erro ao atualizar sessão.');
}

export async function deleteSession(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('sessions').delete().eq('id', id);
  assertSupabaseVoid(error, 'Erro ao excluir sessão.');
}
