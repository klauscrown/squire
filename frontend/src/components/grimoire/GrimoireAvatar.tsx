import { StyleSheet, Text, View } from 'react-native';

import { grimoireImages } from '@/assets/grimoire';
import { useGrimoire } from '@/hooks/useTheme';
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
  const grimoire = useGrimoire();
  const avatar = grimoire.softGlass.avatar;
  const isSoftGlass = variant === 'softGlass';
  const hasPhoto = Boolean(photoUrl?.trim());
  const radius = isSoftGlass ? size / 2 : size >= 48 ? 16 : grimoire.radius.sm;
  const frameStyle = isSoftGlass
    ? {
        overflow: 'hidden' as const,
        borderWidth: avatar.borderWidth,
        borderColor: avatar.borderColor,
        backgroundColor: avatar.backgroundColor,
      }
    : {
        overflow: 'hidden' as const,
        borderWidth: 1,
        borderColor: grimoire.colors.glassGoldBorder,
        ...grimoire.elevation.goldSoft,
      };

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
          !isSoftGlass && { backgroundColor: grimoire.colors.glassGold },
          isSoftGlass && { backgroundColor: avatar.backgroundColor },
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
        {
          width: size,
          height: size,
          borderRadius: radius,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isSoftGlass ? avatar.backgroundColor : grimoire.colors.glassGold,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.34,
            color: isSoftGlass ? grimoire.softGlass.gold : grimoire.colors.gold,
          },
          isSoftGlass && styles.softInitials,
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  initials: {
    fontFamily: fontFamily.cormorant.medium,
    letterSpacing: 1,
  },
  softInitials: {
    fontFamily: fontFamily.cormorant.bold,
    fontWeight: '700',
  },
});
