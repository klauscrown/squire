import { useRouter } from 'expo-router';
import { UserRound } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { grimoireImages } from '@/assets/grimoire';
import { useAuth } from '@/components/providers/AuthProvider';
import { GrimoireImage } from '@/components/grimoire';
import { ROUTES } from '@/constants';
import { useIsCompactWidth } from '@/hooks/useLayoutMetrics';
import { usePressScale } from '@/hooks/usePressScale';
import { useComponents, useGrimoire, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { motion } from '@/theme/motion';
import { fontFamily, typeRoles } from '@/theme/typography';

export type HomeHeaderMode = 'onboarding' | 'journey';

interface HomeHeaderProps {
  /**
   * onboarding — sem campanha (promessa de início)
   * journey — com campanha (preparação da mesa)
   */
  mode?: HomeHeaderMode;
  /** Sobrescreve o texto de apoio editorial, se necessário. */
  supportText?: string;
}

function resolveMasterName(
  displayName: string | null | undefined,
  email: string | null | undefined,
): string {
  const fromProfile = displayName?.trim();
  if (fromProfile) return fromProfile.split(/\s+/)[0] ?? fromProfile;
  if (email?.includes('@')) return email.split('@')[0] ?? 'Mestre';
  return 'Mestre';
}

function greetingForNow(name: string): string {
  const hour = new Date().getHours();
  const period = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  return `${period}, ${name}`;
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'M';
}

const COPY = {
  journey: {
    title: 'Prepare a\njornada',
    support: 'Seu escudeiro já revisou a crônica.',
  },
  onboarding: {
    title: 'Comece a\nJornada',
    support: 'Seu escudeiro espera a primeira história.',
  },
} as const;

const MASCOT_SIZE = 68;
const MASCOT_COMPACT = 58;
const ACTION_SIZE = 44;
const MASCOT_LIFT = -12;
const MASCOT_SHIFT_X = -6;
const FLOAT_AMPLITUDE = 3.5;
const FLOAT_CYCLE_MS = 2800;

/**
 * Cabeçalho da Home:
 * [mascote] · [saudação + título ouro + apoio] · [perfil do mestre]
 */
export function HomeHeader({ mode = 'journey', supportText }: HomeHeaderProps) {
  const router = useRouter();
  const { displayName, email, avatarUrl } = useAuth();
  const palette = useActivePalette();
  const grimoire = useGrimoire();
  const opacity = useOpacity();
  const radius = useComponents().radius;
  const compact = useIsCompactWidth();
  const reduceMotion = useReducedMotion();
  const masterName = resolveMasterName(displayName, email);
  const greeting = greetingForNow(masterName);
  const secondary = grimoire.colors.ivoryDim;
  const mascotSize = compact ? MASCOT_COMPACT : MASCOT_SIZE;
  const ringPad = 5;
  const ringSize = mascotSize + ringPad * 2;
  const { animatedStyle, setPressed } = usePressScale(motion.press.scale);
  const copy = COPY[mode];
  const title = copy.title;
  const support = supportText ?? copy.support;
  const hasPhoto = Boolean(avatarUrl?.trim());

  const floatPhase = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      // eslint-disable-next-line react-hooks/immutability
      floatPhase.value = 0;
      return;
    }
    // eslint-disable-next-line react-hooks/immutability
    floatPhase.value = 0;
    // eslint-disable-next-line react-hooks/immutability
    floatPhase.value = withRepeat(
      withTiming(1, {
        duration: FLOAT_CYCLE_MS,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [floatPhase, reduceMotion]);

  const mascotFloatStyle = useAnimatedStyle(() => {
    const y = Math.sin(floatPhase.value * Math.PI * 2) * FLOAT_AMPLITUDE;
    return {
      transform: [
        { translateX: MASCOT_SHIFT_X },
        { translateY: MASCOT_LIFT + y },
      ],
    };
  });

  return (
    <View style={[styles.root, compact && styles.rootCompact]}>
      <Animated.View
        style={[
          styles.mascotWrap,
          { width: ringSize, height: ringSize },
          mascotFloatStyle,
        ]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View
          style={[
            styles.mascotRing,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderColor: opacity.border.goldSubtle,
            },
          ]}
        />
        <GrimoireImage
          source={grimoireImages.mascot}
          style={[styles.mascotImage, { width: mascotSize, height: mascotSize }]}
          contentFit="contain"
          recyclingKey="home-header-mascot-v2"
        />
      </Animated.View>

      <View style={styles.copy}>
        <Text
          style={[styles.greeting, { color: secondary }]}
          numberOfLines={1}
          maxFontSizeMultiplier={1.2}
        >
          {greeting.toUpperCase()}
        </Text>

        <Text
          style={[styles.title, { color: palette.accent }, compact && styles.titleCompact]}
          maxFontSizeMultiplier={1.25}
        >
          {title}
        </Text>

        <Text
          style={[styles.support, { color: secondary }]}
          numberOfLines={2}
          maxFontSizeMultiplier={1.25}
        >
          {support}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push(ROUTES.app.profile)}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        accessibilityLabel="Perfil do mestre"
        hitSlop={8}
        style={styles.actionHit}
      >
        <Animated.View
          style={[
            styles.actionBtn,
            {
              width: ACTION_SIZE,
              height: ACTION_SIZE,
              borderRadius: radius.pill,
              borderColor: opacity.border.goldSubtle,
              backgroundColor: opacity.card.subtle,
              ...Platform.select({
                ios: {
                  shadowColor: palette.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.28,
                  shadowRadius: 8,
                },
                android: { elevation: 3 },
                default: {},
              }),
            },
            animatedStyle,
          ]}
        >
          {hasPhoto ? (
            <GrimoireImage
              source={{ uri: avatarUrl! }}
              style={styles.avatarImage}
              contentFit="cover"
              recyclingKey="home-profile-avatar"
            />
          ) : displayName || email ? (
            <Text style={[styles.initials, { color: palette.accent }]}>
              {initialsFrom(masterName)}
            </Text>
          ) : (
            <UserRound size={20} color={palette.accent} strokeWidth={1.85} />
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingTop: 2,
    paddingBottom: 2,
  },
  rootCompact: {
    gap: 8,
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: -4,
  },
  mascotRing: {
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'transparent',
    opacity: 0.85,
  },
  mascotImage: {
    zIndex: 1,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    justifyContent: 'center',
  },
  greeting: {
    ...typeRoles.caption,
    fontFamily: fontFamily.inter.medium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: fontFamily.cinzel.semibold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  titleCompact: {
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  support: {
    ...typeRoles.editorialSm,
    fontSize: 14,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 1,
    maxWidth: '100%',
  },
  actionHit: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  avatarImage: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
  },
  initials: {
    ...typeRoles.buttonSm,
  },
});
