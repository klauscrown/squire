import {
  assertSupabaseOk,
  assertSupabaseVoid,
  getSupabaseClient,
  mapCampaignRow,
  stripUndefined,
} from '@/services/supabase';

import type { Campaign, CreateCampaignInput, UpdateCampaignInput } from '../types';

export async function getCampaigns(userId: string): Promise<Campaign[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  const rows = assertSupabaseOk(data, error, 'Erro ao carregar campanhas.');
  return rows.map(mapCampaignRow);
}

export async function getCampaign(id: string): Promise<Campaign> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).maybeSingle();

  const row = assertSupabaseOk(data, error, 'Campanha não encontrada.');
  return mapCampaignRow(row);
}

export async function createCampaign(
  input: CreateCampaignInput,
  userId: string,
): Promise<Campaign> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      title: input.title,
      description: input.description || null,
      system: input.system || null,
      status: input.status ?? 'active',
      players_count:
        input.playersCount && input.playersCount !== '' ? Number(input.playersCount) : null,
      cover_image_url: input.coverImageUrl || null,
      created_by: userId,
    })
    .select('*')
    .single();

  const row = assertSupabaseOk(data, error, 'Erro ao criar campanha.');
  return mapCampaignRow(row);
}

export async function updateCampaign(id: string, input: UpdateCampaignInput): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('campaigns')
    .update(
      stripUndefined({
        title: input.title,
        description: input.description,
        system: input.system,
        status: input.status,
        players_count: input.playersCount,
      }),
    )
    .eq('id', id);

  assertSupabaseVoid(error, 'Erro ao atualizar campanha.');
}

export async function deleteCampaign(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('campaigns').delete().eq('id', id);
  assertSupabaseVoid(error, 'Erro ao excluir campanha.');
}
