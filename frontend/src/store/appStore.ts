import { create } from 'zustand';

import type { ThemeMode } from '@/types';

interface AppState {
  themeMode: ThemeMode;
  isExplorerMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setExplorerMode: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  themeMode: 'dark',
  isExplorerMode: false,
  setThemeMode: (mode) => set({ themeMode: mode }),
  setExplorerMode: (enabled) => set({ isExplorerMode: enabled }),
}));
