import type { VisualPalette } from './palettes';
import type { ThemeComponents } from './createComponents';
import type { ThemeOpacity } from './createOpacity';
import { hexToRgbChannel } from '../palettes';

function rgba(rgb: string, value: number): string {
  return `rgba(${rgb}, ${value})`;
}

/**
 * Tokens primitivos premium + aliases — gerados a partir da paleta ativa.
 */
export function createPremium(
  palette: VisualPalette,
  components: ThemeComponents,
  opacity: ThemeOpacity,
) {
  const brand = palette.brand;

  return {
    accent: brand.accent,
    accentSoft: brand.accentSoft,
    accentBlue: brand.accentBlue,
    accentLight: brand.accentLight,
    accentViolet: brand.accentViolet,
    accentFuchsia: brand.accentFuchsia,
    gradient: brand.gradient,

    foregroundOnGradient: palette.semantic.textPrimary,

    opacity,

    text: {
      primary: palette.semantic.textPrimary,
      secondary: palette.semantic.textSecondary,
      muted: rgba(hexToRgbChannel(palette.semantic.textSecondary), 0.72),
      faint: rgba(hexToRgbChannel(palette.semantic.textSecondary), 0.45),
      accent: palette.semantic.accent,
    },

    glass: components.glass,
    surface: {
      card: `rgba(${hexToRgbChannel(palette.semantic.gradientStart)}, 0.28)`,
      cardBorder: components.glass.cardBorder,
      cardBorderSubtle: `rgba(${hexToRgbChannel(palette.semantic.textSecondary)}, 0.12)`,
      icon: `rgba(${palette.rgb.primary}, 0.12)`,
      divider: `rgba(${hexToRgbChannel(palette.semantic.textSecondary)}, 0.1)`,
      elevated: palette.colors.card,
      scrim: palette.filledCard.scrim,
    },

    overlay: {
      backdrop: `rgba(${hexToRgbChannel(palette.semantic.gradientEnd)}, 0.72)`,
    },

    shadow: {
      color: palette.semantic.gradientEnd,
      card: components.glass.shadow,
      cta: components.cta.shadow,
    },

    fab: {
      ring: components.tabBar.fabRing,
      glow: palette.filledCard.accentGlow,
    },

    emptyState: {
      accentLine: components.filledCard.accentLine,
      accentGlow: components.filledCard.accentGlow,
      scrimStart: components.filledCard.scrim.start,
      scrimMid: components.filledCard.scrim.mid,
      scrimEnd: components.filledCard.scrim.end,
    },

    illustration: components.illustration,

    shortcuts: {
      frameBorder: components.shortcutTile.frameBorder,
      frameBorderPressed: components.shortcutTile.frameBorderPressed,
      iconStroke: components.shortcutTile.variants.names.iconStroke,
      iconFill: components.shortcutTile.variants.names.iconCircleFill,
      fills: [
        components.shortcutTile.cardFill,
        components.shortcutTile.cardFill,
        components.shortcutTile.cardFill,
        components.shortcutTile.cardFill,
      ] as const,
    },

    radius: components.radius,
    spacing: components.spacing,

    tabBar: {
      inactiveIcon: components.pill.inactiveIcon,
      activeIcon: components.pill.activeIcon,
      pillGradient: components.pill.gradient,
      fabGradient: components.tabBar.fabGradient,
      shellAndroid: components.tabBar.shellAndroid,
      fabRing: components.tabBar.fabRing,
      pillShadow: components.pill.shadow,
      fabShadow: components.tabBar.fabShadow,
    },

    searchChip: components.chip,
  } as const;
}

export type PremiumTheme = ReturnType<typeof createPremium>;
