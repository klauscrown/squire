import { shouldUseLocalBackend } from '@/services/dataBackend';



import type { Campaign, CreateCampaignInput, UpdateCampaignInput } from '../types';



import * as local from './campaignService.local';

import * as remote from './campaignService.supabase';



function getSvc() {

  return shouldUseLocalBackend() ? local : remote;

}



export async function getCampaigns(userId: string): Promise<Campaign[]> {

  return getSvc().getCampaigns(userId);

}



export async function getCampaign(id: string): Promise<Campaign> {

  return getSvc().getCampaign(id);

}



export async function createCampaign(

  input: CreateCampaignInput,

  userId: string,

): Promise<Campaign> {

  return getSvc().createCampaign(input, userId);

}



export async function updateCampaign(id: string, input: UpdateCampaignInput): Promise<void> {

  return getSvc().updateCampaign(id, input);

}



export async function deleteCampaign(id: string): Promise<void> {

  return getSvc().deleteCampaign(id);

}


