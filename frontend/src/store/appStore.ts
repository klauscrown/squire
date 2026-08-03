import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ThemeMode } from '@/types';

interface AppState {
  themeMode: ThemeMode;
  isExplorerMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setExplorerMode: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themeMode: 'dark',
      isExplorerMode: false,
      setThemeMode: (mode) => set({ themeMode: mode }),
      setExplorerMode: (enabled) => set({ isExplorerMode: enabled }),
    }),
    {
      name: 'squire-app-preferences',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    },
  ),
);
