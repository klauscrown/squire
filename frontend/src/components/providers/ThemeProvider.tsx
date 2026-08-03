import { type ReactNode, useMemo } from 'react';

import { useAppStore } from '@/store/appStore';
import { useThemeStore } from '@/store/useThemeStore';
import { createTheme, type ColorScheme } from '@/theme';
import { resolveVisualThemeId, visualThemePacks } from '@/theme/visual';
import { ThemeContext } from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useAppStore((state) => state.themeMode);
  const themeName = useThemeStore((state) => state.themeName);

  const colorScheme: ColorScheme = useMemo(() => {
    if (themeMode === 'light' || themeMode === 'dark') {
      return themeMode;
    }
    return 'dark';
  }, [themeMode]);

  const resolvedId = resolveVisualThemeId(themeName);
  const visual = visualThemePacks[resolvedId] ?? visualThemePacks.default;

  const theme = useMemo(
    () => createTheme(colorScheme, visual),
    [colorScheme, visual],
  );

  const value = useMemo(
    () => ({
      theme,
      colorScheme,
      visualThemeId: visual.id,
      visual,
    }),
    [theme, colorScheme, visual],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
