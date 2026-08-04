import type { Session } from '@/features/session/types';

/** Próxima sessão planejada da campanha (agendada / a preparar). */
export function resolveNextSession(sessions: Session[] | undefined | null): Session | null {
  if (!sessions?.length) return null;

  const planned = sessions.filter((s) => s.status === 'planned');
  if (!planned.length) return null;

  const withDate = planned
    .filter((s) => s.playedAt != null)
    .sort((a, b) => a.playedAt!.getTime() - b.playedAt!.getTime());

  if (withDate.length) {
    const now = Date.now();
    const upcoming = withDate.find((s) => s.playedAt!.getTime() >= now - 12 * 60 * 60 * 1000);
    return upcoming ?? withDate[withDate.length - 1] ?? null;
  }

  return [...planned].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0] ?? null;
}

/** Status de preparação — language de mesa, não só enum cru. */
export function preparationStatusLabel(session: Session): string {
  if (session.status === 'cancelled') return 'Cancelada';
  if (session.status === 'completed') return 'Realizada';

  const hasNotes = Boolean(session.summary?.trim());
  const date = session.playedAt;

  if (date) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    if (date.getTime() < startOfToday.getTime()) {
      return hasNotes ? 'Atraso — revisar notas' : 'Preparação pendente';
    }
    if (date.getTime() <= endOfToday.getTime()) {
      return hasNotes ? 'Pronta para hoje' : 'Preparar para hoje';
    }
  }

  return hasNotes ? 'Em preparação' : 'A preparar';
}

export function formatSessionDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

export function formatSessionTime(date: Date): string | null {
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0;
  if (!hasTime) return null;
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
