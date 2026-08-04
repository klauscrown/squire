/**
 * Tipografia do app:
 * - Títulos principais → Cinzel (serif)
 * - Subtítulos editoriais → Cormorant Garamond (serif)
 * - UI funcional (botões, datas, badges, labels) → Inter (sans)
 *
 * Escala base: mínimo 12px. Preferir `typeRoles` em telas novas.
 */

export const fontFamily = {
  manrope: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
  },
  inter: {
    regular: 'Inter_400Regular',
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

/** Tamanho mínimo de texto legível no app. */
export const MIN_FONT_SIZE = 12;

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
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
    xs: 18,
    sm: 21,
    md: 24,
    lg: 28,
    xl: 28,
    '2xl': 34,
    '3xl': 42,
    '4xl': 42,
  },
  letterSpacing: {
    default: 0,
    title: 0.28,
    body: 0,
    caption: 0.3,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  /** Proibição soft: nunca renderizar UI funcional abaixo disto. */
  minFontSize: MIN_FONT_SIZE,
} as const;

/**
 * Papéis semânticos — escolha o papel; não improvise família/tamanho.
 * Serif (Cinzel/Cormorant) nunca em datas, badges, botões ou captions funcionais.
 */
export const typeRoles = {
  /** Hero da tela — Cinzel */
  display: {
    fontFamily: fontFamily.cinzel.semibold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0.2,
  },
  /** Título principal de card/seção — Cinzel */
  title: {
    fontFamily: fontFamily.cinzel.semibold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0.15,
  },
  titleSm: {
    fontFamily: fontFamily.cinzel.semibold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.12,
  },
  /** Subtítulo editorial / frase de lore — Cormorant */
  editorial: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  editorialSm: {
    fontFamily: fontFamily.cormorant.regular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  /** Corpo funcional — Inter */
  body: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0,
  },
  /** Labels de seção / UI — Inter */
  label: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.15,
  },
  /** Caption / meta (mín. 12) — Inter */
  caption: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.3,
  },
  /** Botões e CTAs — Inter */
  button: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  buttonSm: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  /** Badges / status / sistema — Inter (nunca serif) */
  badge: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  /** Datas e horários — Inter */
  meta: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
} as const;

export type FontFamily = typeof fontFamily;
export type ThemeTypography = typeof typography;
export type TypeRole = keyof typeof typeRoles;
