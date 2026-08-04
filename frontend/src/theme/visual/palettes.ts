/**
 * Expansão das paletas semânticas (`theme/palettes`) em tokens visuais completos.
 * Mesma arquitetura para Grimório e Tormenta — só os materiais mudam via paleta.
 */

import {
  DEFAULT_THEME_NAME,
  getPalette,
  hexToRgbChannel,
  type ThemeName,
  type ThemePalette,
} from '../palettes';

export type VisualThemeId = ThemeName;

export interface VisualRgbChannels {
  primary: string;
  accent: string;
  soft: string;
  softText: string;
  cool: string;
  coolSoft: string;
}

export interface VisualPalette {
  id: VisualThemeId;
  label: string;
  description: string;
  semantic: ThemePalette;

  backgroundAtmosphericTop: string;
  backgroundAtmosphericMiddle: string;
  backgroundAtmosphericBottom: string;
  ambientPrimary: string;
  ambientSecondary: string;

  atmosphere: {
    top: string;
    upper: string;
    mid: string;
    lower: string;
    deep: string;
    base: string;
    glow: string;
    accent: string;
    ambientPrimary: string;
    ambientPrimaryCore: string;
    ambientSecondary: string;
    ambientSecondaryCore: string;
    topWash: string;
    topWashCore: string;
    sideLeft: string;
    sideRight: string;
  };

  atmosphereAmbient: readonly [string, string, string, string];

  starDust: {
    dim: string;
    mid: string;
    bright: string;
  };

  colors: {
    background: string;
    foreground: string;
    ivory: string;
    ivoryDim: string;
    gold: string;
    goldBright: string;
    goldMuted: string;
    purpleDeep: string;
    purpleMid: string;
    petrol: string;
    card: string;
    cardBorder: string;
    glass: string;
    glassBorder: string;
    glassGold: string;
    glassGoldBorder: string;
    inputBg: string;
    inputBorder: string;
    inputBorderFocus: string;
    placeholder: string;
    success: string;
    destructive: string;
    tabBar: string;
    tabInactive: string;
    overlay: string;
    popupFill: string;
    actionGoldFill: string;
    ivoryAlpha85: string;
    goldAlpha55: string;
  };

  brand: {
    accent: string;
    accentSoft: string;
    accentBlue: string;
    accentLight: string;
    accentViolet: string;
    accentFuchsia: string;
    gradient: readonly [string, string];
    pillGradient: readonly [string, string, string];
    fabGradient: readonly [string, string, string];
    sectionBar: readonly [string, string];
    ctaGradient: readonly [string, string];
  };

  glass: {
    fill: string;
    fillWeb: string;
    fillStrong: string;
    fillAndroid: string;
    border: string;
    borderStrong: string;
    highlight: string;
    cardBorder: string;
  };

  filledCard: {
    accentLine: string;
    accentGlow: string;
    scrim: {
      start: string;
      mid: string;
      soft: string;
      end: string;
    };
  };

  illustration: {
    bookFill: string;
    bookPage: string;
    bookStroke: string;
    scrollFill: string;
    scrollStroke: string;
    quillStroke: string;
    shieldFill: string;
    shieldStroke: string;
    glow: string;
  };

  softGlass: {
    background: string;
    gold: string;
    muted: string;
    hintBorder: string;
    heroBorder: string;
    avatarBorder: string;
    avatarBg: string;
    statusPillBg: string;
    shortcutBorder: string;
    shortcutIconBg: string;
    emptyCtaBorder: string;
    emptyCtaAccent: string;
    localBadgeBg: string;
    localBadgeBorder: string;
    signOutBg: string;
    signOutBorder: string;
    signOutColor: string;
  };

  elevation: {
    goldGlow: string;
    goldSoft: string;
  };

  rgb: VisualRgbChannels;

  iconStroke: {
    gold: string;
    lilac: string;
    blue: string;
  };
}

function rgba(channel: string, alpha: number): string {
  return `rgba(${channel}, ${alpha})`;
}

function mixTowardBlack(hex: string, amount: number): string {
  const [r, g, b] = hexToRgbChannel(hex).split(',').map((n) => Number(n.trim()));
  const t = Math.min(1, Math.max(0, amount));
  const nr = Math.round((r ?? 0) * (1 - t));
  const ng = Math.round((g ?? 0) * (1 - t));
  const nb = Math.round((b ?? 0) * (1 - t));
  return `#${[nr, ng, nb].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgbChannel(hex).split(',').map((n) => Number(n.trim()));
  const t = Math.min(1, Math.max(0, amount));
  const nr = Math.round((r ?? 0) + (255 - (r ?? 0)) * t);
  const ng = Math.round((g ?? 0) + (255 - (g ?? 0)) * t);
  const nb = Math.round((b ?? 0) + (255 - (b ?? 0)) * t);
  return `#${[nr, ng, nb].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function mixColors(a: string, b: string, amount: number): string {
  const [r1, g1, b1] = hexToRgbChannel(a).split(',').map((n) => Number(n.trim()));
  const [r2, g2, b2] = hexToRgbChannel(b).split(',').map((n) => Number(n.trim()));
  const t = Math.min(1, Math.max(0, amount));
  const nr = Math.round((r1 ?? 0) + ((r2 ?? 0) - (r1 ?? 0)) * t);
  const ng = Math.round((g1 ?? 0) + ((g2 ?? 0) - (g1 ?? 0)) * t);
  const nb = Math.round((b1 ?? 0) + ((b2 ?? 0) - (b1 ?? 0)) * t);
  return `#${[nr, ng, nb].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function expandVisualPalette(id: ThemeName): VisualPalette {
  const semantic = getPalette(id);
  const primaryRgb = hexToRgbChannel(semantic.primary);
  const accentRgb = hexToRgbChannel(semantic.accent);
  const lightRgb = hexToRgbChannel(semantic.primaryLight);
  const secondaryRgb = hexToRgbChannel(semantic.textSecondary);
  const topRgb = hexToRgbChannel(semantic.gradientStart);
  const baseRgb = hexToRgbChannel(semantic.gradientEnd);
  const isTormenta = id === 'tormenta';

  const softHex = isTormenta
    ? lighten(semantic.primaryLight, 0.42)
    : lighten(semantic.primaryLight, 0.32);
  const softTextHex = isTormenta ? softHex : lighten(semantic.primaryLight, 0.2);
  const coolHex = isTormenta ? semantic.primaryLight : lighten(semantic.primary, 0.16);
  const coolSoftHex = isTormenta
    ? lighten(semantic.primaryLight, 0.18)
    : lighten(semantic.primaryLight, 0.12);

  /** Luz ambiente secundária — azul-violeta só no Grimório (baixa opacidade). */
  const ambientVioletRgb = isTormenta ? primaryRgb : '96, 110, 168';

  /** Mid/lower puxam mais para o escuro — curva cinematográfica (topo vivo, base quase preta). */
  const middle = isTormenta
    ? mixTowardBlack(semantic.gradientStart, 0.45)
    : mixColors(semantic.gradientStart, semantic.gradientEnd, 0.58);
  const upper = isTormenta
    ? mixTowardBlack(semantic.gradientStart, 0.22)
    : mixColors(semantic.gradientStart, semantic.gradientEnd, 0.28);
  const lower = isTormenta
    ? mixTowardBlack(semantic.gradientStart, 0.62)
    : mixColors(semantic.gradientStart, semantic.gradientEnd, 0.82);
  const deep = isTormenta
    ? mixTowardBlack(semantic.gradientEnd, 0.08)
    : mixTowardBlack(semantic.gradientEnd, 0.04);

  return {
    id,
    label: semantic.name,
    description: isTormenta
      ? 'Vermelho e carvão — mesma hierarquia do Grimório.'
      : 'Azul profundo e dourado envelhecido — grimório premium.',
    semantic,

    backgroundAtmosphericTop: semantic.gradientStart,
    backgroundAtmosphericMiddle: middle,
    backgroundAtmosphericBottom: semantic.gradientEnd,
    ambientPrimary: rgba(lightRgb, isTormenta ? 0.14 : 0.14),
    ambientSecondary: rgba(ambientVioletRgb, isTormenta ? 0.09 : 0.07),

    atmosphere: {
      top: semantic.gradientStart,
      upper,
      mid: middle,
      lower,
      deep,
      base: semantic.gradientEnd,
      glow: rgba(lightRgb, isTormenta ? 0.18 : 0.12),
      accent: lighten(semantic.primaryLight, 0.12),
      ambientPrimary: rgba(lightRgb, isTormenta ? 0.11 : 0.1),
      ambientPrimaryCore: rgba(lightRgb, isTormenta ? 0.06 : 0.05),
      ambientSecondary: rgba(ambientVioletRgb, isTormenta ? 0.08 : 0.06),
      ambientSecondaryCore: rgba(ambientVioletRgb, isTormenta ? 0.04 : 0.035),
      topWash: rgba(lightRgb, isTormenta ? 0.11 : 0.1),
      topWashCore: rgba(lightRgb, isTormenta ? 0.05 : 0.045),
      sideLeft: rgba(primaryRgb, isTormenta ? 0.09 : 0.07),
      sideRight: rgba(ambientVioletRgb, isTormenta ? 0.07 : 0.05),
    },

    atmosphereAmbient: [
      rgba(lightRgb, isTormenta ? 0.12 : 0.11),
      rgba(primaryRgb, isTormenta ? 0.06 : 0.05),
      rgba(baseRgb, 0.02),
      'transparent',
    ],

    starDust: {
      dim: rgba(hexToRgbChannel(semantic.textPrimary), 0.09),
      mid: rgba(lightRgb, 0.14),
      bright: rgba(accentRgb, 0.12),
    },

    colors: {
      background: semantic.gradientEnd,
      foreground: semantic.textPrimary,
      ivory: semantic.textPrimary,
      ivoryDim: semantic.textSecondary,
      gold: semantic.accent,
      goldBright: lighten(semantic.accent, 0.2),
      goldMuted: rgba(accentRgb, 0.62),
      purpleDeep: mixTowardBlack(semantic.gradientEnd, 0.18),
      purpleMid: mixColors(semantic.gradientStart, semantic.gradientEnd, 0.35),
      petrol: isTormenta
        ? mixColors(semantic.surface, semantic.gradientEnd, 0.35)
        : mixColors(semantic.surface, semantic.gradientEnd, 0.4),
      card: semantic.surface,
      cardBorder: rgba(secondaryRgb, 0.15),
      glass: rgba(topRgb, 0.2),
      glassBorder: rgba(secondaryRgb, 0.13),
      glassGold: rgba(accentRgb, 0.1),
      glassGoldBorder: rgba(accentRgb, 0.2),
      inputBg: rgba(topRgb, 0.18),
      inputBorder: rgba(secondaryRgb, 0.16),
      inputBorderFocus: rgba(accentRgb, 0.42),
      placeholder: rgba(secondaryRgb, 0.55),
      success: '#34d399',
      destructive: '#ef4444',
      tabBar: rgba(baseRgb, 0.94),
      tabInactive: rgba(secondaryRgb, 0.68),
      overlay: rgba(baseRgb, 0.72),
      popupFill: rgba(baseRgb, 0.96),
      actionGoldFill: semantic.accentSoft,
      ivoryAlpha85: rgba(hexToRgbChannel(semantic.textPrimary), 0.85),
      goldAlpha55: rgba(accentRgb, 0.52),
    },

    brand: {
      accent: semantic.primaryLight,
      accentSoft: lighten(semantic.primaryLight, 0.08),
      accentBlue: coolHex,
      accentLight: coolSoftHex,
      accentViolet: softHex,
      accentFuchsia: softHex,
      gradient: [coolHex, semantic.primary] as const,
      pillGradient: [
        mixTowardBlack(semantic.primary, 0.12),
        semantic.primary,
        lighten(semantic.primary, 0.06),
      ] as const,
      fabGradient: [coolHex, semantic.primary, mixTowardBlack(semantic.primary, 0.08)] as const,
      sectionBar: [semantic.primaryLight, semantic.primary] as const,
      /** CTA mais escuro (menos amarelo pálido) */
      ctaGradient: isTormenta
        ? ([mixTowardBlack(semantic.buttonPrimary, 0.1), semantic.buttonPrimary] as const)
        : ([
            mixTowardBlack(semantic.accent, 0.06),
            mixTowardBlack(semantic.accent, 0.22),
          ] as const),
    },

    glass: {
      fill: rgba(topRgb, 0.3),
      fillWeb: rgba(topRgb, 0.7),
      fillStrong: rgba(baseRgb, 0.52),
      fillAndroid: rgba(baseRgb, 0.76),
      border: rgba(secondaryRgb, 0.13),
      borderStrong: rgba(lightRgb, 0.26),
      highlight: rgba(hexToRgbChannel(semantic.textPrimary), 0.035),
      /** Borda dourada sutil em cards filled (hero campanha) */
      cardBorder: rgba(accentRgb, 0.28),
    },

    filledCard: {
      accentLine: rgba(accentRgb, 0.32),
      accentGlow: rgba(primaryRgb, 0.07),
      scrim: {
        start: rgba(baseRgb, 0.97),
        mid: rgba(baseRgb, 0.88),
        soft: rgba(baseRgb, 0.48),
        end: 'transparent',
      },
    },

    illustration: {
      bookFill: rgba(primaryRgb, 0.26),
      bookPage: rgba(hexToRgbChannel(semantic.textPrimary), 0.1),
      bookStroke: semantic.primaryLight,
      scrollFill: rgba(accentRgb, 0.14),
      scrollStroke: semantic.accent,
      quillStroke: lighten(semantic.primaryLight, 0.08),
      shieldFill: rgba(primaryRgb, 0.16),
      shieldStroke: semantic.primaryLight,
      glow: rgba(lightRgb, 0.09),
    },

    softGlass: {
      background: lighten(semantic.gradientEnd, 0.04),
      gold: lighten(semantic.accent, 0.14),
      muted: semantic.textSecondary,
      hintBorder: rgba(secondaryRgb, 0.15),
      heroBorder: rgba(secondaryRgb, 0.13),
      avatarBorder: rgba(accentRgb, 0.32),
      avatarBg: semantic.accentSoft,
      statusPillBg: rgba(accentRgb, 0.12),
      shortcutBorder: rgba(secondaryRgb, 0.12),
      shortcutIconBg: rgba(primaryRgb, 0.1),
      emptyCtaBorder: rgba(accentRgb, 0.26),
      emptyCtaAccent: rgba(accentRgb, 0.32),
      localBadgeBg: rgba(accentRgb, 0.1),
      localBadgeBorder: rgba(accentRgb, 0.22),
      signOutBg: rgba(secondaryRgb, 0.1),
      signOutBorder: rgba(secondaryRgb, 0.2),
      signOutColor: semantic.textSecondary,
    },

    elevation: {
      goldGlow: semantic.accent,
      goldSoft: semantic.accent,
    },

    rgb: {
      primary: primaryRgb,
      accent: accentRgb,
      soft: hexToRgbChannel(softHex),
      softText: hexToRgbChannel(softTextHex),
      cool: hexToRgbChannel(coolHex),
      coolSoft: hexToRgbChannel(coolSoftHex),
    },

    iconStroke: {
      gold: semantic.accent,
      lilac: softHex,
      blue: coolSoftHex,
    },
  };
}

export const VISUAL_PALETTES: Record<VisualThemeId, VisualPalette> = {
  default: expandVisualPalette('default'),
  tormenta: expandVisualPalette('tormenta'),
};

export const DEFAULT_VISUAL_THEME: VisualThemeId = DEFAULT_THEME_NAME;

export function resolveVisualThemeId(id: string | null | undefined): VisualThemeId {
  if (id === 'tormenta') return 'tormenta';
  if (id === 'default' || id === 'arcane') return 'default';
  return DEFAULT_VISUAL_THEME;
}
