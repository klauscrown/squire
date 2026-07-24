import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { grimoire } from '@/theme/grimoire';

/** Transição longa e uniforme — sem saltos perceptíveis */
const BASE_COLORS = [
  grimoire.atmosphere.top,
  grimoire.atmosphere.upper,
  grimoire.atmosphere.mid,
  grimoire.atmosphere.lower,
  grimoire.atmosphere.deep,
  grimoire.atmosphere.base,
] as const;

const BASE_LOCATIONS = [0, 0.22, 0.46, 0.68, 0.86, 1] as const;

/** Luz suave no topo que some gradualmente — sem corte horizontal */
const AMBIENT_COLORS = [
  'rgba(139, 92, 246, 0.20)',
  'rgba(99, 102, 241, 0.10)',
  'rgba(67, 56, 202, 0.04)',
  'transparent',
] as const;

const AMBIENT_LOCATIONS = [0, 0.28, 0.55, 1] as const;

interface GrimoireAtmosphereShellProps {
  children: ReactNode;
}

/** Envolve o conteúdo com gradiente + glow (pai do ScrollView — funciona no Android). */
export function GrimoireAtmosphereShell({ children }: GrimoireAtmosphereShellProps) {
  return (
    <LinearGradient
      colors={[...BASE_COLORS]}
      locations={[...BASE_LOCATIONS]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.shell}
    >
      <LinearGradient
        colors={[...AMBIENT_COLORS]}
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
