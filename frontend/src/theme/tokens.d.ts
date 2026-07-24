export const palette: {
  readonly bgPrimary: '#111315';
  readonly bgSecondary: '#1A1E23';
  readonly surface: '#232931';
  readonly hover: '#2D343D';
  readonly border: '#31363F';
  readonly borderHover: '#4A5563';
  readonly arcaneBlue: '#3B82F6';
  readonly arcaneBlueHover: '#2563EB';
  readonly arcanePurple: '#7C3AED';
  readonly ancientGold: '#D4A64A';
  readonly gradientStart: '#2563EB';
  readonly gradientMiddle: '#4F46E5';
  readonly gradientEnd: '#7C3AED';
  readonly success: '#22C55E';
  readonly warning: '#F59E0B';
  readonly error: '#EF4444';
  readonly info: '#38BDF8';
  readonly textPrimary: '#F5F5F5';
  readonly textSecondary: '#C7CCD4';
  readonly textDisabled: '#8B949E';
  readonly moduleCampaigns: '#3B82F6';
  readonly moduleNpcs: '#22C55E';
  readonly moduleSessions: '#7C3AED';
  readonly moduleMaps: '#F97316';
  readonly moduleItems: '#D4A64A';
  readonly moduleMonsters: '#EF4444';
  readonly moduleNotes: '#94A3B8';
  readonly moduleAi: '#38BDF8';
  readonly white: '#FFFFFF';
  readonly black: '#000000';
};

export const radius: {
  readonly none: 0;
  readonly sm: 4;
  readonly md: 8;
  readonly lg: 12;
  readonly xl: 16;
  readonly full: 9999;
};

export const spacing: {
  readonly xs: 4;
  readonly sm: 8;
  readonly smMd: 12;
  readonly md: 16;
  readonly mdLg: 20;
  readonly lg: 24;
  readonly xl: 32;
  readonly '2xl': 48;
  readonly '3xl': 64;
};

export const fontFamily: {
  readonly sans: readonly ['Marcellus_400Regular'];
  readonly 'sans-medium': readonly ['Marcellus_400Regular'];
  readonly 'sans-semibold': readonly ['Marcellus_400Regular'];
  readonly 'sans-bold': readonly ['Marcellus_400Regular'];
  readonly heading: readonly ['Marcellus_400Regular'];
  readonly 'heading-bold': readonly ['Marcellus_400Regular'];
  readonly display: readonly ['Marcellus_400Regular'];
  readonly 'display-medium': readonly ['Marcellus_400Regular'];
  readonly 'display-semibold': readonly ['Marcellus_400Regular'];
  readonly lore: readonly ['Marcellus_400Regular'];
  readonly 'lore-medium': readonly ['Marcellus_400Regular'];
  readonly 'lore-semibold': readonly ['Marcellus_400Regular'];
  readonly 'lore-bold': readonly ['Marcellus_400Regular'];
};

export function buildTailwindTheme(): Record<string, unknown>;
