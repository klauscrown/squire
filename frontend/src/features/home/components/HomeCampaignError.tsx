import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useIsCompactWidth } from '@/hooks/useLayoutMetrics';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { fontFamily } from '@/theme/typography';

export interface HomeCampaignErrorProps {
  onRetry: () => void;
}

/** Estado de erro ao carregar campanhas na Home. */
export function HomeCampaignError({ onRetry }: HomeCampaignErrorProps) {
  const palette = useActivePalette();
  const home = useComponents().home;
  const compact = useIsCompactWidth();

  return (
    <View
      style={[
        styles.feedbackState,
        {
          marginTop: home.heroMarginTop,
          minHeight: compact ? 140 : 168,
        },
      ]}
    >
      <Text style={[styles.feedbackText, { color: palette.textSecondary }]}>
        Não foi possível carregar suas campanhas.
      </Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Tentar carregar campanhas novamente"
        hitSlop={8}
        style={({ pressed }) => [
          styles.retryBtn,
          {
            minHeight: MIN_TOUCH_TARGET,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <Text style={[styles.retryText, { color: palette.accent }]}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  feedbackText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  retryBtn: {
    minWidth: MIN_TOUCH_TARGET,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 14,
    lineHeight: 20,
  },
});
