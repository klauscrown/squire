import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import type { Campaign } from '@/features/campaign/types';
import { useGetSessions } from '@/features/session/hooks';
import { useComponents } from '@/hooks/useTheme';

import { NextSessionCard } from './NextSessionCard';
import { resolveNextSession } from '../utils/nextSession';

interface HomeNextSessionSectionProps {
  campaign: Campaign;
}

/**
 * Próxima sessão — só quando existe sessão real.
 * Empty-state fica a cargo de Pendências / Squire (evita cards competindo).
 */
export function HomeNextSessionSection({ campaign }: HomeNextSessionSectionProps) {
  const router = useRouter();
  const home = useComponents().home;
  const { data: sessions, isLoading, isFetching } = useGetSessions(campaign.id);

  const nextSession = useMemo(() => resolveNextSession(sessions), [sessions]);
  const loading = isLoading || (isFetching && sessions == null);

  if (!loading && !nextSession) {
    return null;
  }

  function openSession(sessionId: string) {
    router.push(`/(app)/campaigns/${campaign.id}/sessions/${sessionId}`);
  }

  function openSessionsList() {
    router.push(`/(app)/campaigns/${campaign.id}/sessions`);
  }

  return (
    <View style={[styles.wrap, { marginTop: home.continuityMarginTop }]}>
      <NextSessionCard
        session={nextSession}
        loading={loading}
        onPrepare={(session) => openSession(session.id)}
        onPlan={openSessionsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
});
