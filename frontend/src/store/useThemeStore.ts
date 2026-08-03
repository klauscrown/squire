import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_THEME_NAME, getPalette, palettes, type ThemeName } from '@/theme/palettes';
import { resolveVisualThemeId } from '@/theme/visual';

interface ThemeState {
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeName: DEFAULT_THEME_NAME,
      setTheme: (name) => set({ themeName: resolveVisualThemeId(name) }),
    }),
    {
      name: 'squire-theme',
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted, current) => {
        const raw = (persisted ?? {}) as Partial<ThemeState>;
        return {
          ...current,
          ...raw,
          themeName: resolveVisualThemeId(raw.themeName),
        };
      },
    },
  ),
);

export function useActivePalette() {
  const themeName = useThemeStore((s) => s.themeName);
  return palettes[themeName] ?? getPalette(DEFAULT_THEME_NAME);
}

/** @deprecated Preferir `useActivePalette` — alias legado. */
export const usePalette = useActivePalette;
