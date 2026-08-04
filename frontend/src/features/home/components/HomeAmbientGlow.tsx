import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';

import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';
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
  const coreSize = size * 0.55;

  return (
    <View pointerEvents="none" style={[styles.blob, { width: size, height: size }, style]}>
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

/**
 * Glow ambiente da Home: luz superior suave + laterais azul/violeta + acento inferior.
 * Reage à troca de tema via `useComponents()`.
 */
export function HomeAmbientGlow() {
  const components = useComponents();
  const glow = components.ambientGlow;
  const { width, height } = useWindowDimensions();

  const topSize = Math.min(width * glow.top.sizeRatio, glow.top.maxSize);
  const purpleSize = Math.min(width * glow.purple.sizeRatio, glow.purple.maxSize);
  const goldSize = Math.min(width * glow.gold.sizeRatio, glow.gold.maxSize);

  return (
    <View pointerEvents="none" style={styles.root}>
      <RadialGlowBlob
        coreColor={glow.top.core}
        haloColor={glow.top.halo}
        size={topSize}
        blur={glow.blur}
        style={{
          top: height * glow.top.topRatio,
          left: (width - topSize) / 2,
        }}
      />
      <RadialGlowBlob
        coreColor={glow.purple.core}
        haloColor={glow.purple.halo}
        size={purpleSize}
        blur={glow.blur}
        style={{
          top: height * glow.purple.topRatio,
          right: purpleSize * glow.purple.bleedRatio,
        }}
      />
      <RadialGlowBlob
        coreColor={glow.gold.core}
        haloColor={glow.gold.halo}
        size={goldSize}
        blur={glow.blur}
        style={{
          bottom: CURVED_TAB_BAR_FOOTPRINT + glow.gold.bottomOffset,
          left: goldSize * glow.gold.bleedRatio,
        }}
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
