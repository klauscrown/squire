/**

 * Serviço local de campanhas (memória).

 * Usado quando Supabase não está configurado.

 */



import type { Campaign, CreateCampaignInput, UpdateCampaignInput } from '../types';



let store: Campaign[] = [];



function generateId(): string {

  return Date.now().toString(36) + Math.random().toString(36).slice(2);

}



export async function getCampaigns(userId: string): Promise<Campaign[]> {

  return store

    .filter((c) => c.createdBy === userId)

    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

}



export async function getCampaign(id: string): Promise<Campaign> {

  const campaign = store.find((c) => c.id === id);

  if (!campaign) throw new Error('Campanha não encontrada.');

  return campaign;

}



export async function createCampaign(

  input: CreateCampaignInput,

  userId: string,

): Promise<Campaign> {

  const now = new Date();



  const campaign: Campaign = {

    id: generateId(),

    title: input.title,

    description: input.description || undefined,

    system: input.system || undefined,

    status: input.status ?? 'active',

    playersCount:

      input.playersCount && input.playersCount !== '' ? Number(input.playersCount) : undefined,

    coverImageUrl: input.coverImageUrl || undefined,

    createdBy: userId,

    createdAt: now,

    updatedAt: now,

  };



  store = [campaign, ...store];

  return campaign;

}



export async function updateCampaign(id: string, input: UpdateCampaignInput): Promise<void> {

  store = store.map((c) =>

    c.id === id ? { ...c, ...input, updatedAt: new Date() } : c,

  );

}



export async function deleteCampaign(id: string): Promise<void> {

  store = store.filter((c) => c.id !== id);

}


