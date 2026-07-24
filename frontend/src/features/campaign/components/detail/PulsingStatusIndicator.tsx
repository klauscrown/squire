import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import type { CampaignStatus } from '@/features/campaign/types';

const MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
}) as string;

const STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; color: string; glow: string }
> = {
  active: { label: 'Ativa', color: '#4ADE80', glow: '#2DFF2D' },
  paused: { label: 'Pausada', color: '#FACC15', glow: '#FACC15' },
  completed: { label: 'Concluída', color: '#6B7280', glow: '#6B7280' },
};

interface PulsingStatusIndicatorProps {
  status: CampaignStatus;
}

export function PulsingStatusIndicator({ status }: PulsingStatusIndicatorProps) {
  const config = STATUS_CONFIG[status];
  const glowOpacity = useSharedValue(0.2);
  const shouldPulse = status === 'active';

  useEffect(() => {
    if (!shouldPulse) {
      glowOpacity.value = 0.35;
      return;
    }

    glowOpacity.value = withRepeat(
      withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [glowOpacity, shouldPulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.row} accessibilityLabel={`Status: ${config.label}`}>
      <View style={styles.dotWrap}>
        <Animated.View
          style={[
            styles.glowOuter,
            { backgroundColor: `${config.glow}33` },
            glowStyle,
          ]}
        >
          {Platform.OS !== 'web' ? (
            <BlurView intensity={18} tint="dark" style={styles.glowBlur}>
              <View style={[styles.glowCore, { backgroundColor: `${config.glow}55` }]} />
            </BlurView>
          ) : (
            <View style={[styles.glowCore, { backgroundColor: `${config.glow}55` }]} />
          )}
        </Animated.View>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
      </View>
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dotWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowBlur: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    zIndex: 1,
  },
  label: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: 0.3,
  },
});
