import * as Haptics from 'expo-haptics';
import { Sparkles } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import type { Campaign } from '@/features/campaign/types';
import { useGetSessions } from '@/features/session/hooks';
import { useGrimoire } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { useIsCompactWidth } from '@/hooks/useLayoutMetrics';
import { typeRoles } from '@/theme/typography';

import { resolveNextSession } from '../utils/nextSession';
import { resolveSquireContext } from '../utils/squireContext';

interface HomeSquireContextProps {
  campaign: Campaign | null;
  campaignsLoading?: boolean;
  onCreateCampaign?: () => void;
}

/**
 * Nudge secundário do Squire — strip flat, abaixo do cabeçalho.
 * Não compete com o card de campanha (sem borda/elevação de card).
 */
export function HomeSquireContext({
  campaign,
  campaignsLoading = false,
  onCreateCampaign,
}: HomeSquireContextProps) {
  const router = useRouter();
  const palette = useActivePalette();
  const grimoire = useGrimoire();
  const compact = useIsCompactWidth();
  const secondary = grimoire.colors.ivoryDim;

  const campaignId = campaign?.id ?? '';
  const { data: sessions, isLoading, isFetching } = useGetSessions(campaignId);

  const sessionsLoading =
    Boolean(campaignId) && (isLoading || (isFetching && sessions == null));

  const content = useMemo(
    () =>
      resolveSquireContext({
        campaignsLoading,
        hasCampaign: Boolean(campaign),
        sessionsLoading,
        sessions,
      }),
    [campaign, campaignsLoading, sessions, sessionsLoading],
  );

  const nextSession = useMemo(() => resolveNextSession(sessions), [sessions]);

  function handleAction() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (content.kind === 'noCampaign') {
      onCreateCampaign?.();
      return;
    }

    if (!campaign) return;

    if (content.kind === 'hasSession' && nextSession) {
      router.push(`/(app)/campaigns/${campaign.id}/sessions/${nextSession.id}` as never);
      return;
    }

    router.push(`/(app)/campaigns/${campaign.id}/sessions` as never);
  }

  if (content.kind === 'loading') {
    return (
      <View
        style={[styles.root, compact && styles.rootCompact]}
        accessibilityLabel={content.message}
        accessibilityState={{ busy: true }}
      >
        <ActivityIndicator size="small" color={palette.accent} />
        <Text
          style={[styles.message, { color: secondary }]}
          numberOfLines={compact ? 3 : 2}
        >
          {content.message}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.root, compact && styles.rootCompact]}
      accessibilityRole="text"
      accessibilityLabel={`${content.message}. ${content.actionLabel}`}
    >
      <View style={styles.iconSlot}>
        <Sparkles size={13} color={secondary} strokeWidth={1.75} />
      </View>

      <Text
        style={[styles.message, { color: secondary }]}
        numberOfLines={compact ? 3 : 2}
        maxFontSizeMultiplier={1.25}
      >
        {content.message}
      </Text>

      {content.actionLabel ? (
        <Pressable
          onPress={handleAction}
          accessibilityRole="button"
          accessibilityLabel={content.actionLabel}
          hitSlop={8}
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
        >
          <Text style={[styles.actionLabel, { color: palette.accent }]} numberOfLines={1}>
            {content.actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 2,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  rootCompact: {
    marginTop: 8,
    gap: 6,
  },
  iconSlot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    opacity: 0.85,
  },
  message: {
    ...typeRoles.caption,
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.92,
  },
  action: {
    flexShrink: 0,
    paddingVertical: 6,
    paddingHorizontal: 4,
    maxWidth: '38%',
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionLabel: {
    ...typeRoles.buttonSm,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
  },
});
