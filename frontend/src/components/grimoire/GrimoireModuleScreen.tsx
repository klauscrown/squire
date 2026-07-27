import { type ReactNode } from 'react';

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { grimoire } from '@/theme/grimoire';

import { fontFamily } from '@/theme/typography';

import { AmbientGlow, type GlowVariant } from './AmbientGlow';

import { GrimoireAtmosphereShell } from './GrimoireAtmosphere';

interface GrimoireModuleScreenProps {
  children: ReactNode;

  glow?: GlowVariant;

  loading?: boolean;

  error?: boolean;

  errorMessage?: string;

  onRetry?: () => void;
}

export function GrimoireModuleScreen({
  children,

  glow = 'purple-left',

  loading,

  error,

  errorMessage = 'Erro ao carregar',

  onRetry,
}: GrimoireModuleScreenProps) {
  if (loading) {
    return (
      <GrimoireAtmosphereShell>
        <SafeAreaView style={styles.root} edges={['top']}>
          <AmbientGlow variant={glow} />

          <View style={styles.centered}>
            <ActivityIndicator size="large" color={grimoire.colors.gold} />
          </View>
        </SafeAreaView>
      </GrimoireAtmosphereShell>
    );
  }

  if (error) {
    return (
      <GrimoireAtmosphereShell>
        <SafeAreaView style={styles.root} edges={['top']}>
          <AmbientGlow variant={glow} />

          <View style={styles.centered}>
            <Text style={styles.errorText}>{errorMessage}</Text>

            {onRetry ? (
              <Pressable onPress={onRetry} style={styles.retryButton}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </Pressable>
            ) : null}
          </View>
        </SafeAreaView>
      </GrimoireAtmosphereShell>
    );
  }

  return (
    <GrimoireAtmosphereShell>
      <SafeAreaView style={styles.root} edges={['top']}>
        <AmbientGlow variant={glow} />

        {children}
      </SafeAreaView>
    </GrimoireAtmosphereShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,

    backgroundColor: 'transparent',
  },

  centered: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 32,
  },

  errorText: {
    fontFamily: fontFamily.inter.regular,

    fontSize: 16,

    color: grimoire.colors.ivoryDim,

    textAlign: 'center',

    marginBottom: 16,
  },

  retryButton: {
    borderRadius: grimoire.radius.md,

    borderWidth: 1,

    borderColor: grimoire.colors.glassGoldBorder,

    paddingHorizontal: 20,

    paddingVertical: 12,
  },

  retryText: {
    fontFamily: fontFamily.inter.medium,

    fontSize: 14,

    color: grimoire.colors.gold,
  },
});
