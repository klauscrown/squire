import { LinearGradient } from 'expo-linear-gradient';
import { MoreHorizontal } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { SurfaceCard } from '@/components/ui';
import { useIsCompactWidth } from '@/hooks/useLayoutMetrics';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import type { Universe } from '../types';
import { UniverseSymbol } from './UniversePrimitives';

interface UniverseHeroCardProps {
  universe: Universe;
  elementCount: number;
  campaignCount: number;
  onOptions: () => void;
}

export function UniverseHeroCard({
  universe,
  elementCount,
  campaignCount,
  onOptions,
}: UniverseHeroCardProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();
  const compact = useIsCompactWidth();
  const reduceMotion = useReducedMotion();
  const glowOpacity = useSharedValue(reduceMotion ? 0.48 : 0.32);

  useEffect(() => {
    if (reduceMotion) {
      glowOpacity.value = 0.48;
      return;
    }

    glowOpacity.value = withRepeat(
      withTiming(0.68, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    return () => cancelAnimation(glowOpacity);
  }, [glowOpacity, reduceMotion]);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return (
    <SurfaceCard
      variant="elevated"
      radius="lg"
      padding="lg"
      shadow={false}
      contentStyle={[styles.content, compact && styles.contentCompact]}
    >
      <LinearGradient
        pointerEvents="none"
        colors={[
          components.filledCard.scrim.soft,
          components.filledCard.scrim.mid,
          components.filledCard.scrim.start,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, { backgroundColor: opacity.iconCircle.lilacFill }, glowStyle]}
      />

      <UniverseSymbol size={compact ? 64 : 76} compact />
      <View style={styles.copy}>
        <Text style={[styles.eyebrow, { color: palette.accent }]}>Universo ativo</Text>
        <Text style={[styles.name, { color: palette.textPrimary }]}>{universe.name}</Text>
        {universe.description ? (
          <Text style={[styles.description, { color: palette.textSecondary }]}>
            {universe.description}
          </Text>
        ) : null}
        <View style={styles.indicators}>
          <View style={[styles.indicator, { backgroundColor: opacity.card.medium }]}>
            <Text style={[styles.indicatorText, { color: palette.textSecondary }]}>
              {elementCount} elementos
            </Text>
          </View>
          <View style={[styles.indicator, { backgroundColor: opacity.card.medium }]}>
            <Text style={[styles.indicatorText, { color: palette.textSecondary }]}>
              {campaignCount} {campaignCount === 1 ? 'campanha' : 'campanhas'}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={onOptions}
        accessibilityRole="button"
        accessibilityLabel="Opções do universo"
        hitSlop={4}
        style={({ pressed }) => [
          styles.optionsButton,
          {
            borderColor: opacity.border.goldSubtle,
            backgroundColor: opacity.card.subtle,
          },
          pressed && { opacity: opacity.level.pressed },
        ]}
      >
        <MoreHorizontal size={20} color={palette.accent} strokeWidth={1.8} />
      </Pressable>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  content: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  contentCompact: {
    gap: 10,
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -64,
    top: -92,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    zIndex: 1,
  },
  eyebrow: {
    ...typeRoles.badge,
    textTransform: 'uppercase',
  },
  name: {
    ...typeRoles.display,
    marginTop: 1,
  },
  description: {
    ...typeRoles.bodySm,
    marginTop: 2,
  },
  indicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 8,
  },
  indicator: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  indicatorText: {
    ...typeRoles.caption,
  },
  optionsButton: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: MIN_TOUCH_TARGET / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    zIndex: 1,
  },
});
