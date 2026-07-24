/** Paleta oficial Squire — fonte única para theme TS e Tailwind. */
const palette = {
  bgPrimary: '#0f0d14',
  bgSecondary: '#14121c',
  surface: '#1a1724',
  hover: '#2D343D',
  border: '#31363F',
  borderHover: '#4A5563',

  arcaneBlue: '#3B82F6',
  arcaneBlueHover: '#2563EB',
  arcanePurple: '#7C3AED',
  ancientGold: '#C9A962',

  gradientStart: '#2563EB',
  gradientMiddle: '#4F46E5',
  gradientEnd: '#7C3AED',

  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#38BDF8',

  textPrimary: '#F5F5F5',
  textSecondary: '#C7CCD4',
  textDisabled: '#8B949E',

  moduleCampaigns: '#3B82F6',
  moduleNpcs: '#22C55E',
  moduleSessions: '#7C3AED',
  moduleMaps: '#F97316',
  moduleItems: '#D4A64A',
  moduleMonsters: '#EF4444',
  moduleNotes: '#94A3B8',
  moduleAi: '#38BDF8',

  white: '#FFFFFF',
  black: '#000000',
};

const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

const spacing = {
  xs: 4,
  sm: 8,
  smMd: 12,
  md: 16,
  mdLg: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

const fontFamily = {
  sans: ['Marcellus_400Regular'],
  'sans-medium': ['Marcellus_400Regular'],
  'sans-semibold': ['Marcellus_400Regular'],
  'sans-bold': ['Marcellus_400Regular'],
  mono: ['Marcellus_400Regular'],
  'mono-medium': ['Marcellus_400Regular'],
  heading: ['Marcellus_400Regular'],
  'heading-bold': ['Marcellus_400Regular'],
  display: ['Marcellus_400Regular'],
  'display-medium': ['Marcellus_400Regular'],
  'display-semibold': ['Marcellus_400Regular'],
  lore: ['Marcellus_400Regular'],
  'lore-medium': ['Marcellus_400Regular'],
  'lore-semibold': ['Marcellus_400Regular'],
  'lore-bold': ['Marcellus_400Regular'],
};

function buildTailwindTheme() {
  return {
    fontFamily,
    colors: {
      background: palette.bgPrimary,
      foreground: palette.textPrimary,
      primary: {
        DEFAULT: palette.arcaneBlue,
        hover: palette.arcaneBlueHover,
        foreground: palette.white,
      },
      secondary: {
        DEFAULT: palette.arcanePurple,
        foreground: palette.white,
      },
      accent: {
        DEFAULT: palette.ancientGold,
        foreground: palette.bgPrimary,
      },
      surface: {
        DEFAULT: palette.surface,
        variant: palette.bgSecondary,
      },
      hover: palette.hover,
      muted: {
        DEFAULT: palette.textSecondary,
        foreground: palette.textDisabled,
      },
      border: {
        DEFAULT: palette.border,
        hover: palette.borderHover,
      },
      divider: palette.border,
      success: palette.success,
      warning: palette.warning,
      error: palette.error,
      info: palette.info,
      arcane: {
        blue: palette.arcaneBlue,
        'blue-hover': palette.arcaneBlueHover,
        purple: palette.arcanePurple,
      },
      gold: palette.ancientGold,
      brand: {
        gradient: {
          start: palette.gradientStart,
          middle: palette.gradientMiddle,
          end: palette.gradientEnd,
        },
      },
      module: {
        campaigns: palette.moduleCampaigns,
        npcs: palette.moduleNpcs,
        sessions: palette.moduleSessions,
        maps: palette.moduleMaps,
        items: palette.moduleItems,
        monsters: palette.moduleMonsters,
        notes: palette.moduleNotes,
        ai: palette.moduleAi,
      },
    },
    borderRadius: {
      sm: `${radius.sm}px`,
      md: `${radius.md}px`,
      lg: `${radius.lg}px`,
      xl: `${radius.xl}px`,
      card: `${radius.xl}px`,
      full: `${radius.full}px`,
    },
    spacing,
  };
}

module.exports = {
  palette,
  radius,
  spacing,
  fontFamily,
  buildTailwindTheme,
};
