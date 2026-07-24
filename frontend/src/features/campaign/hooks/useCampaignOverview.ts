import { useMemo } from 'react';

import { useGetNotes } from '@/features/notes/hooks';
import { useGetNpcs } from '@/features/npc/hooks';
import { useGetSessions } from '@/features/session/hooks';
import { formatDateInput } from '@/features/session/types';

import type { CampaignModuleStats } from '../constants/modules';
import type { Session } from '@/features/session/types';

function getLastSession(sessions: Session[] | undefined): Session | null {
  if (!sessions?.length) return null;

  const withDate = sessions.filter((s) => s.playedAt);
  if (withDate.length) {
    return withDate.reduce((latest, current) =>
      current.playedAt!.getTime() > latest.playedAt!.getTime() ? current : latest,
    );
  }

  return sessions.reduce((latest, current) =>
    current.updatedAt.getTime() > latest.updatedAt.getTime() ? current : latest,
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return `Há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  const months = Math.floor(diffDays / 30);
  return `Há ${months} ${months === 1 ? 'mês' : 'meses'}`;
}

export function useCampaignOverview(campaignId: string) {
  const sessionsQuery = useGetSessions(campaignId);
  const npcsQuery = useGetNpcs(campaignId);
  const notesQuery = useGetNotes(campaignId);

  const stats: CampaignModuleStats = useMemo(
    () => ({
      sessions: sessionsQuery.data?.length ?? 0,
      npcs: npcsQuery.data?.length ?? 0,
      notes: notesQuery.data?.length ?? 0,
      quests: 0,
      items: 0,
      locations: 0,
      factions: 0,
    }),
    [sessionsQuery.data, npcsQuery.data, notesQuery.data],
  );

  const lastSession = useMemo(
    () => getLastSession(sessionsQuery.data),
    [sessionsQuery.data],
  );

  const lastSessionLabel = useMemo(() => {
    if (!lastSession) return 'Nenhuma sessão registrada';
    const date = lastSession.playedAt ?? lastSession.updatedAt;
    return `Última sessão: ${formatDateInput(date)}`;
  }, [lastSession]);

  const lastSessionRelative = useMemo(() => {
    if (!lastSession) return 'Nenhuma sessão';
    const date = lastSession.playedAt ?? lastSession.updatedAt;
    return getRelativeTime(date);
  }, [lastSession]);

  const isLoading =
    sessionsQuery.isLoading || npcsQuery.isLoading || notesQuery.isLoading;

  return {
    stats,
    lastSession,
    lastSessionLabel,
    lastSessionRelative,
    isLoading,
  };
}
