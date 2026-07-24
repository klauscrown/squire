/**
 * Experimento tipográfico: Marcellus (Google Fonts) como fonte única.
 * Marcellus só oferece 400 — todos os pesos mapeiam para a mesma face.
 * Reverter: restaurar famílias originais (Manrope/Inter/Sora/Cinzel/Cormorant).
 */

const MARCELLUS = 'Marcellus_400Regular';

const marcellusWeights = {
  regular: MARCELLUS,
  medium: MARCELLUS,
  semibold: MARCELLUS,
  bold: MARCELLUS,
} as const;

export const fontFamily = {
  manrope: { ...marcellusWeights },
  inter: { ...marcellusWeights },
  sora: { ...marcellusWeights },
  cinzel: {
    medium: MARCELLUS,
    semibold: MARCELLUS,
    bold: MARCELLUS,
  },
  cormorant: { ...marcellusWeights },
  /** Alias explícito do experimento */
  marcellus: {
    regular: MARCELLUS,
  },
} as const;

export const typography = {
  fontFamily: {
    regular: MARCELLUS,
    medium: MARCELLUS,
    semibold: MARCELLUS,
    bold: MARCELLUS,
    heading: MARCELLUS,
    display: MARCELLUS,
    lore: MARCELLUS,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  /** Marcellus: títulos ~1.2, corpo ~1.5 */
  lineHeight: {
    xs: 18,
    sm: 21,
    md: 24,
    lg: 27,
    xl: 24,
    '2xl': 29,
    '3xl': 36,
    '4xl': 43,
  },
  letterSpacing: {
    default: 0.2,
    title: 0.2,
    body: 0.2,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '400' as const,
    semibold: '400' as const,
    bold: '400' as const,
  },
} as const;

export type FontFamily = typeof fontFamily;
export type ThemeTypography = typeof typography;
