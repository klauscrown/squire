import { useRouter } from 'expo-router';
import { UserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/components/providers/AuthProvider';
import { GrimoireImage } from '@/components/grimoire';
import { ROUTES } from '@/constants';
import { useIsCompactWidth } from '@/hooks/useLayoutMetrics';
import { useComponents, useGrimoire } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { fontFamily, typeRoles } from '@/theme/typography';

interface HomeHeaderProps {
  journeyHint?: string;
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
  if (hour < 12) return `Bom dia, ${name}`;
  if (hour < 18) return `Boa tarde, ${name}`;
  return `Boa noite, ${name}`;
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'M';
}

const DEFAULT_JOURNEY_HINT = 'Revise a campanha e prepare a próxima sessão.';

/**
 * Cabeçalho: saudação Inter · título Cinzel · frase editorial Cormorant · perfil.
 */
export function HomeHeader({ journeyHint = DEFAULT_JOURNEY_HINT }: HomeHeaderProps) {
  const router = useRouter();
  const { displayName, email, avatarUrl } = useAuth();
  const palette = useActivePalette();
  const grimoire = useGrimoire();
  const radius = useComponents().radius;
  const compact = useIsCompactWidth();
  const masterName = resolveMasterName(displayName, email);
  const greeting = greetingForNow(masterName);
  const hasPhoto = Boolean(avatarUrl?.trim());
  const secondary = grimoire.colors.ivoryDim;

  return (
    <View style={styles.root}>
      <View style={styles.copy}>
        <Text style={[styles.greeting, { color: secondary }]} numberOfLines={1}>
          {greeting}
        </Text>

        <Text
          style={[
            styles.title,
            {
              color: palette.textPrimary,
              // Contorno dourado suave (RN: textShadow; Cinzel já via typeRoles.display)
              textShadowColor: `${palette.accent}59`,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 4,
            },
            compact && styles.titleCompact,
          ]}
          numberOfLines={2}
          maxFontSizeMultiplier={1.35}
        >
          Prepare a jornada
        </Text>

        <Text
          style={[styles.hint, { color: secondary }]}
          numberOfLines={compact ? 3 : 2}
          maxFontSizeMultiplier={1.35}
        >
          {journeyHint}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push(ROUTES.app.profile)}
        accessibilityRole="button"
        accessibilityLabel="Abrir perfil"
        hitSlop={8}
        style={({ pressed }) => [
          styles.profileBtn,
          {
            width: MIN_TOUCH_TARGET,
            height: MIN_TOUCH_TARGET,
            borderRadius: radius.pill,
            borderColor: grimoire.colors.glassBorder,
            backgroundColor: grimoire.colors.glass,
            opacity: pressed ? 0.82 : 1,
          },
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
          <UserRound size={20} color={secondary} strokeWidth={1.75} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 4,
    paddingBottom: 2,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  greeting: {
    ...typeRoles.caption,
    fontFamily: fontFamily.inter.regular,
  },
  title: {
    ...typeRoles.display,
    fontFamily: fontFamily.cinzel.semibold,
  },
  titleCompact: {
    fontFamily: fontFamily.cinzel.semibold,
    fontSize: 22,
    lineHeight: 28,
  },
  hint: {
    ...typeRoles.editorial,
    maxWidth: '100%',
  },
  profileBtn: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarImage: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
  },
  initials: {
    ...typeRoles.buttonSm,
  },
});
