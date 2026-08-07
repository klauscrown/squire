/**
 * Fontes da auth — aliases dos tokens globais (`fontFamily` / `typeRoles`).
 * Não inventar famílias paralelas: Cinzel (marca/título), Cormorant (lore), Inter (UI).
 */
import { fontFamily } from '@/theme/typography';

export const loginFonts = {
  display: fontFamily.cinzel.bold,
  displayMedium: fontFamily.cinzel.semibold,
  editorial: fontFamily.cormorant.medium,
  editorialRegular: fontFamily.cormorant.regular,
  body: fontFamily.inter.regular,
  bodyMedium: fontFamily.inter.medium,
  bodySemibold: fontFamily.inter.semibold,
  bodyBold: fontFamily.inter.bold,
  label: fontFamily.inter.medium,
  button: fontFamily.inter.semibold,
  accent: fontFamily.inter.medium,
} as const;

export type LoginFontKey = keyof typeof loginFonts;
