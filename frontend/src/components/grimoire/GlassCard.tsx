import { type ReactNode } from 'react';

import { type ViewStyle } from 'react-native';

import { grimoire } from '@/theme/grimoire';

import { GrimoireSurface } from './GrimoireSurface';

interface GlassCardProps {
  children: ReactNode;

  gold?: boolean;

  style?: ViewStyle;
}

export function GlassCard({ children, gold = false, style }: GlassCardProps) {
  return (
    <GrimoireSurface gold={gold} style={style} borderRadius={grimoire.radius.lg}>
      {children}
    </GrimoireSurface>
  );
}
