import { type ReactNode } from 'react';

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useGrimoire } from '@/hooks/useTheme';
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
  const grimoire = useGrimoire();

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
            <Text style={[styles.errorText, { color: grimoire.colors.ivoryDim }]}>
              {errorMessage}
            </Text>
            {onRetry ? (
              <Pressable
                onPress={onRetry}
                style={[
                  styles.retryButton,
                  {
                    borderRadius: grimoire.radius.md,
                    borderColor: grimoire.colors.glassGoldBorder,
                  },
                ]}
              >
                <Text style={[styles.retryText, { color: grimoire.colors.gold }]}>
                  Tentar novamente
                </Text>
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
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryText: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 14,
  },
});
