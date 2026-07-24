import { shouldUseLocalBackend } from '@/services/dataBackend';



import type { CreateNoteInput, Note, UpdateNoteInput } from '../types';



import * as local from './notesService.local';

import * as remote from './notesService.supabase';



function getSvc() {

  return shouldUseLocalBackend() ? local : remote;

}



export async function getNotes(campaignId: string): Promise<Note[]> {

  return getSvc().getNotes(campaignId);

}



export async function getNote(id: string): Promise<Note> {

  return getSvc().getNote(id);

}



export async function createNote(input: CreateNoteInput, campaignId: string): Promise<Note> {

  return getSvc().createNote(input, campaignId);

}



export async function updateNote(id: string, input: UpdateNoteInput): Promise<void> {

  return getSvc().updateNote(id, input);

}



export async function deleteNote(id: string): Promise<void> {

  return getSvc().deleteNote(id);

}


