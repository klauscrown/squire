/**

 * Serviço local de sessões (memória).

 */

import type { CreateSessionInput, Session, UpdateSessionInput } from '../types';
import { parseDateInput, resolveSessionNumber } from '../types';

let store: Session[] = [];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function nextSessionNumber(campaignId: string): number {
  const numbers = store

    .filter((s) => s.campaignId === campaignId && s.sessionNumber != null)

    .map((s) => s.sessionNumber!);

  return numbers.length ? Math.max(...numbers) + 1 : 1;
}

function sortSessions(a: Session, b: Session): number {
  if (a.sessionNumber != null && b.sessionNumber != null) {
    return b.sessionNumber - a.sessionNumber;
  }

  if (a.sessionNumber != null) return -1;

  if (b.sessionNumber != null) return 1;

  const aDate = a.playedAt ?? a.createdAt;

  const bDate = b.playedAt ?? b.createdAt;

  return bDate.getTime() - aDate.getTime();
}

export async function getSessions(campaignId: string): Promise<Session[]> {
  return store.filter((s) => s.campaignId === campaignId).sort(sortSessions);
}

export async function getSession(id: string): Promise<Session> {
  const session = store.find((s) => s.id === id);

  if (!session) throw new Error('Sessão não encontrada.');

  return session;
}

export async function createSession(
  input: CreateSessionInput,

  campaignId: string,
): Promise<Session> {
  const now = new Date();

  const session: Session = {
    id: generateId(),

    campaignId,

    title: input.title,

    sessionNumber: resolveSessionNumber(input.sessionNumber) ?? nextSessionNumber(campaignId),

    playedAt: parseDateInput(input.playedAt),

    summary: input.summary ?? '',

    status: input.status ?? 'planned',

    createdAt: now,

    updatedAt: now,
  };

  store = [session, ...store];

  return session;
}

export async function updateSession(id: string, input: UpdateSessionInput): Promise<void> {
  store = store.map((s) => {
    if (s.id !== id) return s;

    const playedAt = input.playedAt !== undefined ? parseDateInput(input.playedAt) : s.playedAt;

    return {
      ...s,

      ...input,

      playedAt,

      updatedAt: new Date(),
    };
  });
}

export async function deleteSession(id: string): Promise<void> {
  store = store.filter((s) => s.id !== id);
}
