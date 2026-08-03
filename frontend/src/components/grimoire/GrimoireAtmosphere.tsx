import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useActivePalette } from '@/store/useThemeStore';
import { useVisualTheme } from '@/hooks/useTheme';
import { hexToRgbChannel } from '@/theme/palettes';

const BASE_LOCATIONS = [0, 0.22, 0.46, 0.68, 0.86, 1] as const;
const AMBIENT_LOCATIONS = [0, 0.28, 0.55, 1] as const;

interface GrimoireAtmosphereShellProps {
  children: ReactNode;
}

function mixToward(hex: string, toward: string, amount: number): string {
  const [r1, g1, b1] = hexToRgbChannel(hex).split(',').map((n) => Number(n.trim()));
  const [r2, g2, b2] = hexToRgbChannel(toward).split(',').map((n) => Number(n.trim()));
  const t = Math.min(1, Math.max(0, amount));
  const nr = Math.round((r1 ?? 0) + ((r2 ?? 0) - (r1 ?? 0)) * t);
  const ng = Math.round((g1 ?? 0) + ((g2 ?? 0) - (g1 ?? 0)) * t);
  const nb = Math.round((b1 ?? 0) + ((b2 ?? 0) - (b1 ?? 0)) * t);
  return `#${[nr, ng, nb].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Envolve o conteúdo com gradiente + glow (pai do ScrollView — funciona no Android). */
export function GrimoireAtmosphereShell({ children }: GrimoireAtmosphereShellProps) {
  const palette = useActivePalette();
  const visual = useVisualTheme();
  const primaryRgb = hexToRgbChannel(palette.primary);

  const baseColors = [
    palette.gradientStart,
    mixToward(palette.gradientStart, palette.gradientEnd, 0.22),
    mixToward(palette.gradientStart, palette.gradientEnd, 0.46),
    mixToward(palette.gradientStart, palette.gradientEnd, 0.68),
    mixToward(palette.gradientStart, palette.gradientEnd, 0.86),
    palette.gradientEnd,
  ] as const;

  const ambientColors = [
    `rgba(${primaryRgb}, 0.20)`,
    `rgba(${primaryRgb}, 0.10)`,
    `rgba(${primaryRgb}, 0.04)`,
    'transparent',
  ] as const;

  return (
    <LinearGradient
      colors={[...baseColors]}
      locations={[...BASE_LOCATIONS]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.shell}
    >
      <LinearGradient
        colors={[...(visual.atmosphereAmbient ?? ambientColors)]}
        locations={[...AMBIENT_LOCATIONS]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.foreground}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  foreground: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
