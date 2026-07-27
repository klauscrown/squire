import { DarkTheme, type Theme } from '@react-navigation/native';

import { grimoire } from '@/theme/grimoire';

export const squireNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
    card: grimoire.atmosphere.base,
  },
};
