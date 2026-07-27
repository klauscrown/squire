import { StyleSheet, Text, View } from 'react-native';

import { grimoireImages } from '@/assets/grimoire';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

import { GrimoireImage } from './GrimoireImage';

type GrimoireAvatarVariant = 'default' | 'softGlass';

interface GrimoireAvatarProps {
  photoUrl?: string | null;
  name?: string | null;
  size?: number;
  variant?: GrimoireAvatarVariant;
}

function getInitials(name?: string | null): string {
  const source = name?.trim();
  if (!source) return 'M';

  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return `${first}${second}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function GrimoireAvatar({
  photoUrl,
  name,
  size = 56,
  variant = 'default',
}: GrimoireAvatarProps) {
  const isSoftGlass = variant === 'softGlass';
  const hasPhoto = Boolean(photoUrl?.trim());
  const radius = isSoftGlass ? size / 2 : size >= 48 ? 16 : grimoire.radius.sm;
  const frameStyle = isSoftGlass ? styles.softFrame : styles.frame;

  if (hasPhoto) {
    return (
      <View style={[frameStyle, { width: size, height: size, borderRadius: radius }]}>
        <GrimoireImage
          source={{ uri: photoUrl! }}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
        />
      </View>
    );
  }

  const initials = getInitials(name);
  const useMascot = initials === 'M' && !name?.trim();

  if (useMascot) {
    return (
      <View
        style={[
          frameStyle,
          isSoftGlass ? styles.softInitialsFrame : styles.mascotFrame,
          { width: size, height: size, borderRadius: radius },
        ]}
      >
        <GrimoireImage
          source={grimoireImages.mascot}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <View
      style={[
        frameStyle,
        isSoftGlass ? styles.softInitialsFrame : styles.initialsFrame,
        { width: size, height: size, borderRadius: radius },
      ]}
    >
      <Text
        style={[styles.initials, isSoftGlass && styles.softInitials, { fontSize: size * 0.34 }]}
      >
        {initials}
      </Text>
    </View>
  );
}

const avatar = grimoire.softGlass.avatar;

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    ...grimoire.elevation.goldSoft,
  },
  softFrame: {
    overflow: 'hidden',
    borderWidth: avatar.borderWidth,
    borderColor: avatar.borderColor,
    backgroundColor: avatar.backgroundColor,
  },
  mascotFrame: {
    backgroundColor: grimoire.colors.glassGold,
  },
  initialsFrame: {
    backgroundColor: grimoire.colors.glassGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  softInitialsFrame: {
    backgroundColor: avatar.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fontFamily.cormorant.medium,
    color: grimoire.colors.gold,
    letterSpacing: 1,
  },
  softInitials: {
    fontFamily: fontFamily.cormorant.bold,
    fontWeight: '700',
    color: grimoire.softGlass.gold,
  },
});
