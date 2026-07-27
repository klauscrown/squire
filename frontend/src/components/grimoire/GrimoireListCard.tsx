import { type ReactNode } from 'react';

import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { grimoire } from '@/theme/grimoire';

import { GrimoireSurface } from './GrimoireSurface';

interface GrimoireListCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  gold?: boolean;
  accentLeft?: boolean;
}

export function GrimoireListCard({
  children,
  onPress,
  style,
  gold = false,
  accentLeft = false,
}: GrimoireListCardProps) {
  return (
    <GrimoireSurface
      gold={gold}
      accentLeft={accentLeft}
      onPress={onPress}
      style={StyleSheet.flatten([{ marginBottom: 12 }, style])}
      borderRadius={grimoire.radius.lg}
    >
      {children}
    </GrimoireSurface>
  );
}
