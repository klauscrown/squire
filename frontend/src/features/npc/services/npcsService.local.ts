/**
 * Serviço local de NPCs (memória).
 */

import type { CreateNpcInput, Npc, UpdateNpcInput } from '../types';

let store: Npc[] = [];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function getNpcs(campaignId: string): Promise<Npc[]> {
  return store
    .filter((n) => n.campaignId === campaignId)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export async function getNpc(id: string): Promise<Npc> {
  const npc = store.find((n) => n.id === id);
  if (!npc) throw new Error('NPC não encontrado.');
  return npc;
}

export async function createNpc(input: CreateNpcInput, campaignId: string): Promise<Npc> {
  const now = new Date();

  const npc: Npc = {
    id: generateId(),
    campaignId,
    name: input.name,
    role: input.role || undefined,
    race: input.race || undefined,
    classType: input.classType || undefined,
    location: input.location || undefined,
    portraitUrl: input.portraitUrl || undefined,
    description: input.description ?? '',
    disposition: input.disposition ?? 'unknown',
    status: input.status ?? 'alive',
    createdAt: now,
    updatedAt: now,
  };

  store = [npc, ...store];
  return npc;
}

export async function updateNpc(id: string, input: UpdateNpcInput): Promise<void> {
  store = store.map((n) => (n.id === id ? { ...n, ...input, updatedAt: new Date() } : n));
}

export async function deleteNpc(id: string): Promise<void> {
  store = store.filter((n) => n.id !== id);
}
