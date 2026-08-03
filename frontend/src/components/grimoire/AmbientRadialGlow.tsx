import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';

import { useComponents } from '@/hooks/useTheme';

interface RadialGlowBlobProps {
  coreColor: string;
  haloColor: string;
  size: number;
  blur: number;
  style?: ViewStyle;
}

function RadialGlowBlob({ coreColor, haloColor, size, blur, style }: RadialGlowBlobProps) {
  const half = size / 2;
  const coreSize = size * 0.58;

  return (
    <View
      pointerEvents="none"
      style={[styles.blob, { width: size, height: size }, style]}
    >
      <View
        style={[
          styles.halo,
          { width: size, height: size, borderRadius: half, backgroundColor: haloColor },
        ]}
      />
      <View
        style={[
          styles.core,
          {
            width: coreSize,
            height: coreSize,
            borderRadius: coreSize / 2,
            backgroundColor: coreColor,
            top: (size - coreSize) / 2,
            left: (size - coreSize) / 2,
          },
        ]}
      />
      {Platform.OS !== 'web' ? (
        <BlurView intensity={blur} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
    </View>
  );
}

interface AmbientRadialGlowProps {
  /** Posição vertical do glow primário (ratio 0–1). Padrão: atrás de cards principais */
  purpleTopRatio?: number;
  /** Distância do fundo para glow secundário (px acima da tab bar) */
  goldBottomOffset?: number;
}

/** Par de glows radiais (primário + secundário) para profundidade ambiente. */
export function AmbientRadialGlow({
  purpleTopRatio,
  goldBottomOffset,
}: AmbientRadialGlowProps) {
  const components = useComponents();
  const purple = components.ambientGlow.purple;
  const gold = components.ambientGlow.gold;
  const { width, height } = useWindowDimensions();

  const topRatio = purpleTopRatio ?? purple.topRatio;
  const bottomOffset = goldBottomOffset ?? gold.bottomOffset;

  const purpleSize = Math.min(width * purple.sizeRatio, purple.maxSize);
  const goldSize = Math.min(width * gold.sizeRatio, gold.maxSize);

  return (
    <View pointerEvents="none" style={styles.root}>
      <RadialGlowBlob
        coreColor={purple.core}
        haloColor={purple.halo}
        size={purpleSize}
        blur={components.ambientGlow.blur}
        style={{ top: height * topRatio, right: purpleSize * purple.bleedRatio }}
      />
      <RadialGlowBlob
        coreColor={gold.core}
        haloColor={gold.halo}
        size={goldSize}
        blur={components.ambientGlow.blur}
        style={{ bottom: bottomOffset, left: goldSize * gold.bleedRatio }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    overflow: 'hidden',
  },
  halo: {
    position: 'absolute',
  },
  core: {
    position: 'absolute',
  },
});
