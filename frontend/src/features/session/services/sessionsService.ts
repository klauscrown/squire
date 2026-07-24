import { shouldUseLocalBackend } from '@/services/dataBackend';



import type { CreateSessionInput, Session, UpdateSessionInput } from '../types';



import * as local from './sessionsService.local';

import * as remote from './sessionsService.supabase';



function getSvc() {

  return shouldUseLocalBackend() ? local : remote;

}



export async function getSessions(campaignId: string): Promise<Session[]> {

  return getSvc().getSessions(campaignId);

}



export async function getSession(id: string): Promise<Session> {

  return getSvc().getSession(id);

}



export async function createSession(

  input: CreateSessionInput,

  campaignId: string,

): Promise<Session> {

  return getSvc().createSession(input, campaignId);

}



export async function updateSession(id: string, input: UpdateSessionInput): Promise<void> {

  return getSvc().updateSession(id, input);

}



export async function deleteSession(id: string): Promise<void> {

  return getSvc().deleteSession(id);

}


