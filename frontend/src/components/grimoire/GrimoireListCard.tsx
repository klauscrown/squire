import { type ReactNode } from 'react';

import { type ViewStyle } from 'react-native';



import { grimoire } from '@/theme/grimoire';



import { GrimoireSurface } from './GrimoireSurface';



interface GrimoireListCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
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
      style={[{ marginBottom: 12 }, style]}
      borderRadius={grimoire.radius.lg}
    >
      {children}
    </GrimoireSurface>
  );
}

