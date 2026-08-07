import type { Session } from '@/features/session/types';

import {
  formatSessionDate,
  formatSessionTime,
  resolveNextSession,
} from './nextSession';

export type SquireContextKind = 'loading' | 'noCampaign' | 'noSession' | 'hasSession';

export interface SquireContextContent {
  kind: SquireContextKind;
  message: string;
  actionLabel: string;
}

/**
 * Mensagem contextual do Squire na Home — só copy/ação a partir do estado real.
 */
export function resolveSquireContext(
  options: {
    campaignsLoading?: boolean;
    hasCampaign: boolean;
    sessionsLoading?: boolean;
    sessions: Session[] | undefined | null;
  },
): SquireContextContent {
  const { campaignsLoading, hasCampaign, sessionsLoading, sessions } = options;

  if (campaignsLoading) {
    return {
      kind: 'loading',
      message: 'Consultando o grimório…',
      actionLabel: '',
    };
  }

  if (!hasCampaign) {
    return {
      kind: 'noCampaign',
      message: 'Mestre, ainda não há uma campanha para preparar.',
      actionLabel: 'Nova campanha',
    };
  }

  if (sessionsLoading) {
    return {
      kind: 'loading',
      message: 'Revisando as sessões…',
      actionLabel: '',
    };
  }

  const next = resolveNextSession(sessions);
  if (!next) {
    return {
      kind: 'noSession',
      message: 'Mestre, ainda não há uma próxima sessão agendada.',
      actionLabel: 'Planejar sessão',
    };
  }

  const date = next.playedAt;
  let when = 'em breve';
  if (date) {
    const dateLabel = formatSessionDate(date);
    const timeLabel = formatSessionTime(date);
    when = timeLabel ? `${dateLabel} às ${timeLabel}` : dateLabel;
  }

  return {
    kind: 'hasSession',
    message: `Mestre, a próxima sessão está marcada para ${when}.`,
    actionLabel: 'Preparar sessão',
  };
}
