import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GrimoireBackground } from '@/features/auth/components/GrimoireBackground';
import { AuthText } from '@/features/auth/components/AuthText';
import { loginTheme } from '@/features/auth/constants/loginTheme';
import { loginTypography } from '@/features/auth/constants/loginTypography';

import { AppLogo } from './AppLogo';

const INTRO_DURATION = 550;
const TEXT_DELAY = 280;
const TEXT_DURATION = 450;
const MIN_VISIBLE_MS = 1500;
const FADE_OUT_DURATION = 420;

interface AnimatedSplashOverlayProps {
  isReadyToDismiss: boolean;
  fontsReady?: boolean;
  onDismissComplete: () => void;
}

export function AnimatedSplashOverlay({
  isReadyToDismiss,
  fontsReady = true,
  onDismissComplete,
}: AnimatedSplashOverlayProps) {
  const mountedAt = useRef(Date.now());
  const hasDismissed = useRef(false);

  const overlayOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.92);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);

  useEffect(() => {
    if (!fontsReady) return;

    logoOpacity.value = withTiming(1, {
      duration: INTRO_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withTiming(1, {
      duration: INTRO_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    textOpacity.value = withDelay(
      TEXT_DELAY,
      withTiming(1, { duration: TEXT_DURATION, easing: Easing.out(Easing.cubic) }),
    );
    textTranslateY.value = withDelay(
      TEXT_DELAY,
      withTiming(0, { duration: TEXT_DURATION, easing: Easing.out(Easing.cubic) }),
    );
  }, [fontsReady, logoOpacity, logoScale, textOpacity, textTranslateY]);

  useEffect(() => {
    if (!isReadyToDismiss || hasDismissed.current) return;

    const elapsed = Date.now() - mountedAt.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    const dismissTimer = setTimeout(() => {
      if (hasDismissed.current) return;
      hasDismissed.current = true;
      overlayOpacity.value = withTiming(
        0,
        { duration: FADE_OUT_DURATION, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(onDismissComplete)();
          }
        },
      );
      onDismissComplete();
    }, remaining);

    const fallbackTimer = setTimeout(() => {
      if (!hasDismissed.current) {
        hasDismissed.current = true;
        onDismissComplete();
      }
    }, remaining + 800);

    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(fallbackTimer);
    };
  }, [isReadyToDismiss, onDismissComplete, overlayOpacity]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, overlayStyle]}
      pointerEvents={isReadyToDismiss ? 'none' : 'auto'}
    >
      <GrimoireBackground style={StyleSheet.absoluteFill}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Animated.View style={logoStyle}>
              <View style={styles.logoFrame}>
                <AppLogo size="lg" style={styles.logo} imageStyle={styles.logoImage} />
              </View>
            </Animated.View>

            <Animated.View style={[styles.textBlock, textStyle]}>
              {fontsReady ? (
                <>
                  <AuthText style={styles.title}>Squire</AuthText>
                  <AuthText style={styles.subtitle}>Organize seu universo de campanha</AuthText>
                </>
              ) : null}
            </Animated.View>
          </View>
        </SafeAreaView>
      </GrimoireBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoFrame: {
    marginBottom: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(255, 255, 255, 0.045)',
  },
  logo: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  logoImage: {
    borderRadius: 20,
  },
  textBlock: {
    alignItems: 'center',
  },
  title: {
    ...loginTypography.title,
    marginBottom: 10,
  },
  subtitle: loginTypography.subtitle,
});
