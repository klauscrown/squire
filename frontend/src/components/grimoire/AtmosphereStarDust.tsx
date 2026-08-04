import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';

interface StarSpec {
  left: number;
  top: number;
  size: number;
  tone: 'dim' | 'mid' | 'bright';
}

/** Campo de pontos de luz muito sutis — sem animação agressiva. */
export function AtmosphereStarDust() {
  const grimoire = useGrimoire();
  const { width, height } = useWindowDimensions();
  const dust = grimoire.starDust;

  const stars = useMemo<StarSpec[]>(() => {
    // Distribuição determinística (sem aleatoriedade a cada render)
    const seeds = [
      [0.08, 0.06, 1.5, 'dim'],
      [0.18, 0.12, 1.2, 'mid'],
      [0.32, 0.05, 1.8, 'dim'],
      [0.46, 0.14, 1.3, 'bright'],
      [0.62, 0.08, 1.1, 'dim'],
      [0.78, 0.11, 1.6, 'mid'],
      [0.9, 0.04, 1.2, 'dim'],
      [0.12, 0.22, 1.1, 'dim'],
      [0.28, 0.28, 1.4, 'mid'],
      [0.55, 0.24, 1.2, 'dim'],
      [0.72, 0.3, 1.5, 'mid'],
      [0.88, 0.2, 1.1, 'dim'],
      [0.22, 0.38, 1.0, 'dim'],
      [0.4, 0.42, 1.3, 'bright'],
      [0.68, 0.4, 1.1, 'dim'],
      [0.84, 0.45, 1.4, 'mid'],
      [0.15, 0.55, 1.0, 'dim'],
      [0.5, 0.58, 1.2, 'dim'],
      [0.76, 0.62, 1.1, 'mid'],
      [0.35, 0.7, 1.0, 'dim'],
      [0.6, 0.74, 1.3, 'dim'],
      [0.9, 0.68, 1.1, 'mid'],
      [0.25, 0.82, 1.0, 'dim'],
      [0.48, 0.88, 1.2, 'dim'],
    ] as const;

    return seeds.map(([x, y, size, tone]) => ({
      left: width * x,
      top: height * y,
      size,
      tone,
    }));
  }, [width, height]);

  return (
    <View pointerEvents="none" style={styles.root}>
      {stars.map((star, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            borderRadius: star.size,
            backgroundColor: dust[star.tone],
            opacity: star.tone === 'bright' ? 0.9 : star.tone === 'mid' ? 0.75 : 0.55,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
});
