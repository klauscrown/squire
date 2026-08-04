import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

import { grimoireImages } from '@/assets/grimoire';
import { useGrimoire, useVisualThemeId } from '@/hooks/useTheme';
import { hexToRgbChannel } from '@/theme/palettes';

/**
 * Mistura dois hex (`#RRGGBB`) sem hardcodes de cor de tela.
 * Usado no fallback de gradiente (ex.: tema Tormenta).
 */
function mixHex(a: string, b: string, amount: number): string {
  const [r1, g1, b1] = hexToRgbChannel(a).split(',').map((n) => Number(n.trim()));
  const [r2, g2, b2] = hexToRgbChannel(b).split(',').map((n) => Number(n.trim()));
  const t = Math.min(1, Math.max(0, amount));
  const nr = Math.round((r1 ?? 0) + ((r2 ?? 0) - (r1 ?? 0)) * t);
  const ng = Math.round((g1 ?? 0) + ((g2 ?? 0) - (g1 ?? 0)) * t);
  const nb = Math.round((b1 ?? 0) + ((b2 ?? 0) - (b1 ?? 0)) * t);
  return `#${[nr, ng, nb].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Fundo full-bleed.
 * Grimório: arte de atmosfera (gradiente + textura do design).
 * Outros temas: gradiente vertical a partir dos tokens.
 */
export function AtmosphericBackground() {
  const themeId = useVisualThemeId();
  const grimoire = useGrimoire();

  if (themeId === 'default') {
    return (
      <View pointerEvents="none" style={styles.root}>
        {/* Base sólida enquanto a imagem carrega + previne flash */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: grimoire.backgroundAtmosphericBottom },
          ]}
        />
        <Image
          source={grimoireImages.atmosphereBg}
          style={styles.image}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </View>
    );
  }

  const top = grimoire.backgroundAtmosphericTop;
  const middle = grimoire.backgroundAtmosphericMiddle;
  const bottom = grimoire.backgroundAtmosphericBottom;

  const colors = [
    top,
    mixHex(top, middle, 0.28),
    mixHex(top, middle, 0.62),
    middle,
    mixHex(middle, bottom, 0.45),
    mixHex(middle, bottom, 0.78),
    bottom,
  ] as const;

  return (
    <View pointerEvents="none" style={styles.root}>
      <LinearGradient
        colors={[...colors]}
        locations={[0, 0.1, 0.22, 0.38, 0.58, 0.78, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    zIndex: 0,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
});
