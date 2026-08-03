/**
 * Tipografia do app: Cinzel nos títulos (h1–h3), Inter no corpo e UI.
 * - Títulos: Cinzel_600SemiBold
 * - Corpo: Inter_400Regular
 * - Labels e botões: Inter_500Medium
 * Escala de tamanho: 12, 14, 16, 20, 24, 32
 */

export const fontFamily = {
  manrope: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
  },
  inter: {
    /** Corpo */
    regular: 'Inter_400Regular',
    /** Labels e botões */
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  sora: {
    regular: 'Sora_400Regular',
    medium: 'Sora_500Medium',
    semibold: 'Sora_600SemiBold',
    bold: 'Sora_700Bold',
  },
  cinzel: {
    medium: 'Cinzel_500Medium',
    /** h1, h2, h3 */
    semibold: 'Cinzel_600SemiBold',
    bold: 'Cinzel_700Bold',
  },
  cormorant: {
    regular: 'CormorantGaramond_400Regular',
    medium: 'CormorantGaramond_500Medium',
    semibold: 'CormorantGaramond_600SemiBold',
    bold: 'CormorantGaramond_700Bold',
  },
} as const;

export const typography = {
  fontFamily: {
    /** Corpo de texto */
    regular: 'Inter_400Regular',
    /** Labels e botões */
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    /** h1, h2, h3 */
    heading: 'Cinzel_600SemiBold',
    display: 'Cinzel_600SemiBold',
    lore: 'CormorantGaramond_500Medium',
  },
  /** Escala: 12 · 14 · 16 · 20 · 24 · 32 */
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 40,
    '4xl': 40,
  },
  letterSpacing: {
    default: 0,
    title: 0.28,
    body: 0,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export type FontFamily = typeof fontFamily;
export type ThemeTypography = typeof typography;
