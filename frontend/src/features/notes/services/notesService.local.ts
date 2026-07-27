/**

 * Serviço local de anotações (memória).

 */

import type { CreateNoteInput, Note, UpdateNoteInput } from '../types';

let store: Note[] = [];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function getNotes(campaignId: string): Promise<Note[]> {
  return store

    .filter((n) => n.campaignId === campaignId)

    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getNote(id: string): Promise<Note> {
  const note = store.find((n) => n.id === id);

  if (!note) throw new Error('Anotação não encontrada.');

  return note;
}

export async function createNote(input: CreateNoteInput, campaignId: string): Promise<Note> {
  const now = new Date();

  const note: Note = {
    id: generateId(),

    campaignId,

    title: input.title,

    content: input.content ?? '',

    createdAt: now,

    updatedAt: now,
  };

  store = [note, ...store];

  return note;
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<void> {
  store = store.map((n) => (n.id === id ? { ...n, ...input, updatedAt: new Date() } : n));
}

export async function deleteNote(id: string): Promise<void> {
  store = store.filter((n) => n.id !== id);
}
