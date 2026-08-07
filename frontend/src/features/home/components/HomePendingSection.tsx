import * as Haptics from 'expo-haptics';
import { CalendarPlus, ChevronRight } from 'lucide-react-native';
import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import type { Campaign } from '@/features/campaign/types';
import { useGetSessions } from '@/features/session/hooks';
import { usePressScale } from '@/hooks/usePressScale';
import { useComponents, useGrimoire } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { useIsCompactWidth } from '@/hooks/useLayoutMetrics';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { motion } from '@/theme/motion';
import { typeRoles } from '@/theme/typography';

import { resolveNextSession } from '../utils/nextSession';

interface HomePendingSectionProps {
  campaign: Campaign;
}

/**
 * Pendências — listagem secundária (não card protagonista).
 * Oculta se já houver próxima sessão (estado real, sem persistência extra).
 */
export function HomePendingSection({ campaign }: HomePendingSectionProps) {
  const router = useRouter();
  const palette = useActivePalette();
  const grimoire = useGrimoire();
  const home = useComponents().home;
  const compact = useIsCompactWidth();
  const secondary = grimoire.colors.ivoryDim;
  const { animatedStyle, setPressed } = usePressScale(motion.press.scale);

  const { data: sessions, isLoading, isFetching } = useGetSessions(campaign.id);
  const nextSession = useMemo(() => resolveNextSession(sessions), [sessions]);
  const loading = isLoading || (isFetching && sessions == null);

  if (loading || nextSession) {
    return null;
  }

  function handlePlanSession() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/(app)/campaigns/${campaign.id}/sessions` as never);
  }

  return (
    <View style={[styles.wrap, { marginTop: home.continuityMarginTop }]}>
      <Text
        style={[styles.sectionTitle, { color: secondary }]}
        maxFontSizeMultiplier={1.25}
      >
        Pendências
      </Text>

      <Pressable
        onPress={handlePlanSession}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        accessibilityLabel="Agendar a próxima sessão"
      >
        <Animated.View style={[styles.row, compact && styles.rowCompact, animatedStyle]}>
          <CalendarPlus size={compact ? 15 : 16} color={secondary} strokeWidth={1.75} />

          <Text
            style={[styles.itemLabel, { color: palette.textPrimary }]}
            numberOfLines={2}
            maxFontSizeMultiplier={1.25}
          >
            Agendar a próxima sessão
          </Text>

          <ChevronRight size={16} color={secondary} strokeWidth={1.75} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  sectionTitle: {
    ...typeRoles.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
    opacity: 0.9,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  rowCompact: {
    gap: 8,
    minHeight: MIN_TOUCH_TARGET - 2,
  },
  itemLabel: {
    ...typeRoles.label,
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
