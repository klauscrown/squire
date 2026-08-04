import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useGetSessions } from '@/features/session/hooks';
import { useComponents } from '@/hooks/useTheme';
import type { Campaign } from '@/features/campaign/types';

import { NextSessionCard } from './NextSessionCard';
import { resolveNextSession } from '../utils/nextSession';

interface HomeNextSessionSectionProps {
  campaign: Campaign;
}

/**
 * Bloco "Próxima sessão" da Home — card secundário com dados reais.
 */
export function HomeNextSessionSection({ campaign }: HomeNextSessionSectionProps) {
  const router = useRouter();
  const home = useComponents().home;
  const { data: sessions, isLoading, isFetching } = useGetSessions(campaign.id);

  const nextSession = useMemo(() => resolveNextSession(sessions), [sessions]);
  const loading = isLoading || (isFetching && sessions == null);

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
