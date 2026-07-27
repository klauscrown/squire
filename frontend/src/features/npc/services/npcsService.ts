import { shouldUseLocalBackend } from '@/services/dataBackend';

import type { CreateNpcInput, Npc, UpdateNpcInput } from '../types';

import * as local from './npcsService.local';

import * as remote from './npcsService.supabase';

function getSvc() {
  return shouldUseLocalBackend() ? local : remote;
}

export async function getNpcs(campaignId: string): Promise<Npc[]> {
  return getSvc().getNpcs(campaignId);
}

export async function getNpc(id: string): Promise<Npc> {
  return getSvc().getNpc(id);
}

export async function createNpc(input: CreateNpcInput, campaignId: string): Promise<Npc> {
  return getSvc().createNpc(input, campaignId);
}

export async function updateNpc(id: string, input: UpdateNpcInput): Promise<void> {
  return getSvc().updateNpc(id, input);
}

export async function deleteNpc(id: string): Promise<void> {
  return getSvc().deleteNpc(id);
}
