import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { grimoire } from '@/theme/grimoire';

/** Céu da login — navy profundo, transição longa, sem faixas duras. */
const SKY_COLORS = ['#141028', '#0E0C22', '#0A0818', grimoire.atmosphere.base] as const;
const SKY_LOCATIONS = [0, 0.38, 0.72, 1] as const;

/** Brilho suave no topo — roxo + toque dourado, some cedo. */
const GLOW_COLORS = [
  'rgba(124, 58, 237, 0.14)',
  'rgba(201, 169, 98, 0.05)',
  'transparent',
] as const;
const GLOW_LOCATIONS = [0, 0.22, 0.55] as const;

interface LoginAtmosphereProps {
  children: ReactNode;
}

/** Fundo dedicado da auth — um gradiente coeso, sem scrims ou SVGs extras. */
export function LoginAtmosphere({ children }: LoginAtmosphereProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[...SKY_COLORS]}
        locations={[...SKY_LOCATIONS]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[...GLOW_COLORS]}
        locations={[...GLOW_LOCATIONS]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: grimoire.atmosphere.base,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
