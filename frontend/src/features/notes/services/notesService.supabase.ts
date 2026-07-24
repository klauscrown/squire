import {
  assertSupabaseOk,
  assertSupabaseVoid,
  getSupabaseClient,
  mapNoteRow,
  stripUndefined,
} from '@/services/supabase';

import type { CreateNoteInput, Note, UpdateNoteInput } from '../types';

export async function getNotes(campaignId: string): Promise<Note[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('updated_at', { ascending: false });

  const rows = assertSupabaseOk(data, error, 'Erro ao carregar anotações.');
  return rows.map(mapNoteRow);
}

export async function getNote(id: string): Promise<Note> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('notes').select('*').eq('id', id).maybeSingle();

  const row = assertSupabaseOk(data, error, 'Anotação não encontrada.');
  return mapNoteRow(row);
}

export async function createNote(input: CreateNoteInput, campaignId: string): Promise<Note> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('notes')
    .insert({
      campaign_id: campaignId,
      title: input.title,
      content: input.content ?? '',
    })
    .select('*')
    .single();

  const row = assertSupabaseOk(data, error, 'Erro ao criar anotação.');
  return mapNoteRow(row);
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('notes')
    .update(
      stripUndefined({
        title: input.title,
        content: input.content,
      }),
    )
    .eq('id', id);

  assertSupabaseVoid(error, 'Erro ao atualizar anotação.');
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('notes').delete().eq('id', id);
  assertSupabaseVoid(error, 'Erro ao excluir anotação.');
}
