import { DarkTheme, type Theme } from 'expo-router';

import { grimoire } from '@/theme/grimoire';

export const squireNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
    card: grimoire.atmosphere.base,
  },
};
