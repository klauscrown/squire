import { palette } from '@/theme/colors';
import { grimoire } from '@/theme/grimoire';

import { loginLayout } from './loginLayout';

/** Paleta e medidas da tela de login — alinhado ao grimório e tokens Squire. */
export const loginTheme = {
  background: {
    base: grimoire.atmosphere.base,
    top: '#141028',
    upper: '#0E0C22',
    mid: '#0A0818',
    lower: '#090714',
    deep: grimoire.atmosphere.deep,
  },
  glass: {
    background: 'rgba(20, 18, 28, 0.88)',
    border: grimoire.colors.glassGoldBorder,
    borderStrong: 'rgba(201, 169, 98, 0.42)',
  },
  input: {
    background: 'rgba(20, 18, 28, 0.72)',
    border: grimoire.colors.inputBorder,
    borderFocus: grimoire.colors.inputBorderFocus,
    placeholder: grimoire.colors.placeholder,
    radius: loginLayout.field.radius,
    height: loginLayout.field.height,
  },
  card: {
    background: 'rgba(20, 18, 28, 0.92)',
    border: grimoire.colors.glassBorder,
    radius: 16,
  },
  text: {
    title: grimoire.colors.ivory,
    subtitle: grimoire.colors.ivoryDim,
    body: '#C4C9D4',
    muted: 'rgba(165, 180, 252, 0.55)',
  },
  brand: {
    title: grimoire.colors.ivory,
    glow: 'rgba(201, 169, 98, 0.32)',
    tagline: grimoire.colors.gold,
  },
  link: grimoire.atmosphere.accent,
  gold: grimoire.colors.gold,
  button: {
    gradientStart: palette.gradientStart,
    gradientMid: palette.gradientMiddle,
    gradientEnd: palette.gradientEnd,
    shadow: palette.gradientMiddle,
    height: loginLayout.button.height,
    radius: loginLayout.button.radius,
  },
  social: {
    background: 'rgba(20, 18, 28, 0.72)',
    border: grimoire.colors.glassBorder,
    borderPressed: grimoire.colors.glassGoldBorder,
    radius: loginLayout.social.radius,
    minHeight: loginLayout.social.height,
    paddingVertical: loginLayout.social.paddingVertical,
    gap: 8,
  },
  settings: {
    background: grimoire.colors.glass,
  },
} as const;

export const loginSpacing = {
  fieldGap: loginLayout.field.gap,
  sectionGap: loginLayout.divider.marginVertical,
  horizontal: loginLayout.screen.horizontal,
} as const;
