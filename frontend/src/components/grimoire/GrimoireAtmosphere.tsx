import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AtmosphereStarDust } from './AtmosphereStarDust';
import { AtmosphericBackground } from './AtmosphericBackground';

interface GrimoireAtmosphereShellProps {
  children: ReactNode;
  /** Inclui stardust sutil (padrão: ligado — base visual do app) */
  starDust?: boolean;
}

/**
 * Shell de atmosfera: fundo full-bleed + conteúdo em cima.
 * SafeAreaView fica no `GrimoireScreen` (filho) para não cortar o fundo sob a status bar.
 */
export function GrimoireAtmosphereShell({
  children,
  /** Desligado por padrão: o fundo de referência é gradiente limpo, sem poeira. */
  starDust = false,
}: GrimoireAtmosphereShellProps) {
  return (
    <View style={styles.shell}>
      <AtmosphericBackground />
      {starDust ? <AtmosphereStarDust /> : null}
      <View style={styles.foreground}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    position: 'relative',
  },
  foreground: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});
