import { createContext, useContext } from 'react';

import { useActivePalette, useThemeStore } from '@/store/useThemeStore';
import { createTheme, type ColorScheme, type Theme } from '@/theme';
import type { ThemeName } from '@/theme/palettes';
import type { VisualThemePack } from '@/theme/visual';

interface ThemeContextValue {
  theme: Theme;
  colorScheme: ColorScheme;
  visualThemeId: ThemeName;
  visual: VisualThemePack;
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

/** Pack visual ativo (default | tormenta) — gradientes, destaques, glass, etc. */
export function useVisualTheme(): VisualThemePack {
  return useThemeContext().visual;
}

export function useVisualThemeId(): ThemeName {
  return useThemeStore((s) => s.themeName);
}

/** Paleta semântica ativa — alias de `useActivePalette`. */
export function usePalette() {
  return useActivePalette();
}

export function useGrimoire() {
  return useThemeContext().visual.grimoire;
}

export function useComponents() {
  return useThemeContext().visual.components;
}

export function usePremium() {
  return useThemeContext().visual.premium;
}

export function useOpacity() {
  return useThemeContext().visual.opacity;
}

export { createTheme };
export { useActivePalette, useThemeStore } from '@/store/useThemeStore';
