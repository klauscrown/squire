import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';

export type GlowVariant = 'purple-right' | 'purple-left' | 'petrol-left';

interface AmbientGlowProps {
  variant?: GlowVariant;
  style?: ViewStyle;
  animate?: boolean;
}

export function AmbientGlow({ variant = 'purple-right', style, animate = true }: AmbientGlowProps) {
  const grimoire = useGrimoire();

  const configMap: Record<
    GlowVariant,
    { top: number; left?: number; right?: number; color: string; size: number }
  > = {
    'purple-right': { top: -96, right: -96, color: grimoire.colors.purpleMid, size: 384 },
    'purple-left': { top: -96, left: -80, color: grimoire.colors.purpleMid, size: 384 },
    'petrol-left': { top: -96, left: -80, color: grimoire.colors.petrol, size: 384 },
  };

  const config = configMap[variant];

  const glowCluster = (
    <View
      style={[
        styles.glowCluster,
        {
          top: config.top,
          left: config.left,
          right: config.right,
          width: config.size,
          height: config.size,
        },
      ]}
    >
      {[0, 1, 2].map((ring) => {
        const ringSize = config.size * (1 + ring * 0.22);
        return (
          <View
            key={ring}
            style={{
              position: 'absolute',
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              backgroundColor: config.color,
              opacity: 0.24 - ring * 0.07,
              top: (config.size - ringSize) / 2,
              left: (config.size - ringSize) / 2,
            }}
          />
        );
      })}
      {Platform.OS !== 'web' ? (
        <BlurView intensity={grimoire.blur.glow} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
    </View>
  );

  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      {animate ? (
        <MotiView
          from={{ translateX: 0, translateY: 0 }}
          animate={{ translateX: 14, translateY: -10 }}
          transition={{
            type: 'timing',
            duration: grimoire.animation.mistDrift.duration,
            loop: true,
          }}
        >
          {glowCluster}
        </MotiView>
      ) : (
        glowCluster
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  glowCluster: {
    position: 'absolute',
    overflow: 'hidden',
  },
});
