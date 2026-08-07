import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Campaign } from '@/features/campaign/types';
import type { Session } from '@/features/session/types';
import { useGetSessions } from '@/features/session/hooks';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import { ActiveCampaignCard } from './ActiveCampaignCard';
import {
  formatSessionDate,
  formatSessionTime,
  resolveNextSession,
} from '../utils/nextSession';

interface HomeActiveCampaignProps {
  campaign?: Campaign | null;
  loading?: boolean;
  onPress: (campaign: Campaign) => void;
  onViewAll?: () => void;
}

function buildNextSessionLine(next: Session | null): string | null {
  if (!next) return null;

  const date = next.playedAt;
  if (!date) {
    const title = next.title?.trim();
    return title ? `Próxima sessão: ${title}` : null;
  }

  const day = formatSessionDate(date);
  const time = formatSessionTime(date);
  return time ? `Próxima sessão: ${day} · ${time}` : `Próxima sessão: ${day}`;
}

/**
 * Bloco da campanha ativa — único card protagonista da Home.
 */
export function HomeActiveCampaign({
  campaign,
  loading = false,
  onPress,
  onViewAll,
}: HomeActiveCampaignProps) {
  const palette = useActivePalette();
  const home = useComponents().home;
  const campaignId = campaign?.id ?? '';

  const {
    data: sessions,
    isLoading: sessionsLoading,
    isFetching,
  } = useGetSessions(campaignId);

  const nextSession = useMemo(() => resolveNextSession(sessions), [sessions]);
  const nextSessionLine = useMemo(() => buildNextSessionLine(nextSession), [nextSession]);
  const nextSessionLoading =
    Boolean(campaignId) &&
    !loading &&
    (sessionsLoading || (isFetching && sessions == null));

  return (
    <View style={[styles.section, { marginTop: home.heroMarginTop }]}>
      {onViewAll && !loading ? (
        <View style={styles.sectionRow}>
          <View style={styles.sectionSpacer} />
          <Pressable
            onPress={onViewAll}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Ver todas as campanhas"
            style={({ pressed }) => [styles.viewAllBtn, pressed && styles.viewAllPressed]}
          >
            <Text style={[styles.viewAll, { color: palette.textSecondary }]}>Ver todas</Text>
          </Pressable>
        </View>
      ) : null}

      <ActiveCampaignCard
        campaign={campaign}
        loading={loading}
        onPress={onPress}
        actionLabel="Continuar"
        nextSessionLine={nextSessionLine}
        nextSessionLoading={nextSessionLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  sectionSpacer: {
    flex: 1,
  },
  viewAllBtn: {
    minHeight: MIN_TOUCH_TARGET,
    minWidth: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  viewAllPressed: {
    opacity: 0.7,
  },
  viewAll: {
    ...typeRoles.label,
    fontSize: 13,
  },
});
