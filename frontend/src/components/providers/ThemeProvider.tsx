import { type ReactNode, useMemo } from 'react';

import { useAppStore } from '@/store/appStore';
import { createTheme, type ColorScheme } from '@/theme';
import { ThemeContext } from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useAppStore((state) => state.themeMode);

  const colorScheme: ColorScheme = useMemo(() => {
    if (themeMode === 'light' || themeMode === 'dark') {
      return themeMode;
    }
    return 'dark';
  }, [themeMode]);

  const theme = useMemo(() => createTheme(colorScheme), [colorScheme]);

  const value = useMemo(
    () => ({
      theme,
      colorScheme,
    }),
    [theme, colorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
