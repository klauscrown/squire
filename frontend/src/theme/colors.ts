/**
 * Paleta oficial Squire — Dark Mode.
 * Referência: identidade visual "biblioteca antiga iluminada por magia".
 */

import { palette as paletteTokens } from './tokens.js';

export const palette = paletteTokens;

function createThemeColors() {
  return {
    primary: palette.arcaneBlue,
    primaryHover: palette.arcaneBlueHover,
    primaryForeground: palette.white,
    secondary: palette.arcanePurple,
    secondaryForeground: palette.white,
    accent: palette.ancientGold,
    accentForeground: palette.bgPrimary,
    background: palette.bgPrimary,
    surface: palette.surface,
    surfaceVariant: palette.bgSecondary,
    hover: palette.hover,
    foreground: palette.textPrimary,
    muted: palette.textSecondary,
    mutedForeground: palette.textDisabled,
    border: palette.border,
    borderHover: palette.borderHover,
    divider: palette.border,
    error: palette.error,
    errorForeground: palette.white,
    success: palette.success,
    successForeground: palette.white,
    warning: palette.warning,
    warningForeground: palette.bgPrimary,
    info: palette.info,
    infoForeground: palette.white,
    modules: {
      campaigns: palette.moduleCampaigns,
      npcs: palette.moduleNpcs,
      sessions: palette.moduleSessions,
      maps: palette.moduleMaps,
      items: palette.moduleItems,
      monsters: palette.moduleMonsters,
      notes: palette.moduleNotes,
      ai: palette.moduleAi,
    },
    gradient: {
      start: palette.gradientStart,
      middle: palette.gradientMiddle,
      end: palette.gradientEnd,
      colors: [palette.gradientStart, palette.gradientMiddle, palette.gradientEnd] as const,
    },
  };
}

/** Squire usa dark mode como padrão; light mantém a mesma paleta por design. */
export const colors = {
  dark: createThemeColors(),
  light: createThemeColors(),
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColors = (typeof colors)[ColorScheme];
export type ModuleColorKey = keyof ThemeColors['modules'];
