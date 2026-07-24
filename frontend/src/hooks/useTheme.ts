import { createContext, useContext } from 'react';

import { createTheme, type ColorScheme, type Theme } from '@/theme';

interface ThemeContextValue {
  theme: Theme;
  colorScheme: ColorScheme;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }

  return context;
}

export function useTheme(): Theme {
  return useThemeContext().theme;
}

export function useColorScheme(): ColorScheme {
  return useThemeContext().colorScheme;
}

export { createTheme };
