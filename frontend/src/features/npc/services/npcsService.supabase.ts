import {
  assertSupabaseOk,
  assertSupabaseVoid,
  getSupabaseClient,
  mapNpcRow,
  stripUndefined,
} from '@/services/supabase';

import type { CreateNpcInput, Npc, UpdateNpcInput } from '../types';

export async function getNpcs(campaignId: string): Promise<Npc[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('npcs')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('name', { ascending: true });

  const rows = assertSupabaseOk(data, error, 'Erro ao carregar NPCs.');
  return rows.map(mapNpcRow);
}

export async function getNpc(id: string): Promise<Npc> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('npcs').select('*').eq('id', id).maybeSingle();

  const row = assertSupabaseOk(data, error, 'NPC não encontrado.');
  return mapNpcRow(row);
}

export async function createNpc(input: CreateNpcInput, campaignId: string): Promise<Npc> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('npcs')
    .insert({
      campaign_id: campaignId,
      name: input.name,
      role: input.role || null,
      race: input.race || null,
      class_type: input.classType || null,
      location: input.location || null,
      portrait_url: input.portraitUrl || null,
      description: input.description ?? '',
      disposition: input.disposition ?? 'unknown',
      status: input.status ?? 'alive',
    })
    .select('*')
    .single();

  const row = assertSupabaseOk(data, error, 'Erro ao criar NPC.');
  return mapNpcRow(row);
}

export async function updateNpc(id: string, input: UpdateNpcInput): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('npcs')
    .update(
      stripUndefined({
        name: input.name,
        role: input.role,
        race: input.race,
        class_type: input.classType,
        location: input.location,
        description: input.description,
        disposition: input.disposition,
        status: input.status,
        ...(input.portraitUrl !== undefined ? { portrait_url: input.portraitUrl || null } : {}),
      }),
    )
    .eq('id', id);

  assertSupabaseVoid(error, 'Erro ao atualizar NPC.');
}

export async function deleteNpc(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('npcs').delete().eq('id', id);
  assertSupabaseVoid(error, 'Erro ao excluir NPC.');
}
