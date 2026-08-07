import { DarkTheme, type Theme } from '@react-navigation/native';

export const squireNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    /** Transparente para o fundo mana (AtmosphericBackground) continuar sob cenas e tab bar. */
    background: 'transparent',
    card: 'transparent',
  },
};
