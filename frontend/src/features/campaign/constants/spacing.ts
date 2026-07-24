import { spacing } from '@/theme/spacing';

/** Escala de espaçamento premium para telas de campanha (8/12/16/20/24/32). */
export const CAMPAIGN_SPACING = {
  xs: spacing.sm,
  sm: spacing.smMd,
  md: spacing.md,
  lg: spacing.mdLg,
  xl: spacing.lg,
  '2xl': spacing.xl,
} as const;
