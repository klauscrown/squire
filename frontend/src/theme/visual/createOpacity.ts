import type { VisualPalette, VisualRgbChannels } from './palettes';

function alpha(channel: string, value: number): string {
  return `rgba(${channel}, ${value})`;
}

/**
 * Opacidades e fills semânticos — chips, quick actions e superfícies translúcidas.
 */
export function createOpacity(palette: VisualPalette) {
  const rgb: VisualRgbChannels = palette.rgb;

  return {
    level: {
      subtle: 0.11,
      medium: 0.14,
      strong: 0.22,
      borderSubtle: 0.24,
      borderMedium: 0.26,
      borderStrong: 0.38,
      pressed: 0.92,
      muted: 0.8,
      illustration: 0.78,
      iconMuted: 0.6,
      textSoft: 0.92,
    },

    card: {
      subtle: alpha(rgb.primary, 0.11),
      medium: alpha(rgb.primary, 0.14),
      strong: alpha(rgb.primary, 0.22),
    },

    border: {
      goldSubtle: alpha(rgb.accent, 0.24),
      goldMedium: alpha(rgb.accent, 0.26),
      goldStrong: alpha(rgb.accent, 0.38),
      lilacSubtle: alpha(rgb.soft, 0.28),
    },

    iconCircle: {
      goldSubtle: alpha(rgb.accent, 0.14),
      goldMedium: alpha(rgb.accent, 0.2),
      goldBorder: alpha(rgb.accent, 0.32),
      goldBorderStrong: alpha(rgb.accent, 0.36),
      lilacFill: alpha(rgb.soft, 0.22),
      lilacBorder: alpha(rgb.soft, 0.38),
      blueFill: alpha(rgb.cool, 0.2),
      blueBorder: alpha(rgb.coolSoft, 0.36),
    },

    text: {
      lilacSoft: alpha(rgb.softText, 0.92),
    },

    iconStroke: {
      gold: palette.iconStroke.gold,
      lilac: palette.iconStroke.lilac,
      blue: palette.iconStroke.blue,
    },
  } as const;
}

export type ThemeOpacity = ReturnType<typeof createOpacity>;
