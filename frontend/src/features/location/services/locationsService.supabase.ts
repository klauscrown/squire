import {
  assertSupabaseOk,
  assertSupabaseVoid,
  getSupabaseClient,
  mapLocationRow,
  stripUndefined,
  type LocationRow,
} from '@/services/supabase';

import type { CreateLocationInput, Location, UpdateLocationInput } from '../types';

export async function getLocations(campaignId: string): Promise<Location[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('name', { ascending: true });

  const rows = assertSupabaseOk(data, error, 'Erro ao carregar locais.') as LocationRow[];
  return rows.map(mapLocationRow);
}

export async function getLocation(id: string): Promise<Location> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  const row = assertSupabaseOk(data, error, 'Local não encontrado.') as LocationRow;
  return mapLocationRow(row);
}

export async function createLocation(
  input: CreateLocationInput,
  campaignId: string,
): Promise<Location> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('locations')
    .insert({
      campaign_id: campaignId,
      name: input.name,
      type: input.type ?? 'other',
      region: input.region || null,
      description: input.description ?? '',
      image_url: input.imageUrl || null,
    })
    .select('*')
    .single();

  const row = assertSupabaseOk(data, error, 'Erro ao criar local.') as LocationRow;
  return mapLocationRow(row);
}

export async function updateLocation(id: string, input: UpdateLocationInput): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('locations')
    .update(
      stripUndefined({
        name: input.name,
        type: input.type,
        region: input.region,
        description: input.description,
        ...(input.imageUrl !== undefined ? { image_url: input.imageUrl || null } : {}),
      }),
    )
    .eq('id', id);

  assertSupabaseVoid(error, 'Erro ao atualizar local.');
}

export async function deleteLocation(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('locations').delete().eq('id', id);
  assertSupabaseVoid(error, 'Erro ao excluir local.');
}
