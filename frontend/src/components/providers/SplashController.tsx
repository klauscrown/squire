import * as SplashScreen from 'expo-splash-screen';
import { type ReactNode, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useLoginFonts } from '@/features/auth/hooks/useLoginFonts';
import { grimoire } from '@/theme/grimoire';

import { useAuth } from './AuthProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

const MAX_WAIT_MS = 12_000;

interface SplashControllerProps {
  children: ReactNode;
}

export function SplashController({ children }: SplashControllerProps) {
  const { isLoading: authLoading } = useAuth();
  const [nativeReady, setNativeReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [fontsLoaded, fontError] = useLoginFonts();

  const fontsReady = fontsLoaded || Boolean(fontError);
  const bootReady = nativeReady && (!authLoading || timedOut) && (fontsReady || timedOut);

  useEffect(() => {
    SplashScreen.hideAsync()
      .catch(() => {})
      .finally(() => setNativeReady(true));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => clearTimeout(timeout);
  }, []);

  if (!bootReady) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={grimoire.colors.gold} />
      </View>
    );
  }

  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: grimoire.colors.background,
  },
});
