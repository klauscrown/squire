import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import { AmbientGlow, type GlowVariant } from './AmbientGlow';
import { GrimoireAtmosphereShell } from './GrimoireAtmosphere';

interface GrimoireDetailScreenProps {
  children?: ReactNode;
  glow?: GlowVariant;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  notFoundMessage?: string;
  onBack?: () => void;
}

export function GrimoireDetailScreen({
  children,
  glow = 'purple-left',
  loading,
  error,
  errorMessage = 'Erro ao carregar',
  onRetry,
  notFoundMessage,
  onBack,
}: GrimoireDetailScreenProps) {
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

  if (error || notFoundMessage) {
    return (
      <GrimoireAtmosphereShell>
        <SafeAreaView style={styles.root} edges={['top']}>
          <AmbientGlow variant={glow} />
          <View style={styles.centered}>
            <Text style={[styles.message, { color: grimoire.colors.ivoryDim }]}>
              {notFoundMessage ?? errorMessage}
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
            {onBack ? (
              <Pressable
                onPress={onBack}
                style={[
                  styles.retryButton,
                  {
                    marginTop: 8,
                    borderRadius: grimoire.radius.md,
                    borderColor: grimoire.colors.glassGoldBorder,
                  },
                ]}
              >
                <Text style={[styles.retryText, { color: grimoire.colors.gold }]}>Voltar</Text>
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
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: grimoire.spacing.screen },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </GrimoireAtmosphereShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  message: {
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
