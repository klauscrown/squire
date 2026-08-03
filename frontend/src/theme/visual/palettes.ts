/**
 * Expansão das paletas semânticas (`theme/palettes`) em tokens visuais completos.
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
  /** Paleta semântica de origem */
  semantic: ThemePalette;

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
  };

  atmosphereAmbient: readonly [string, string, string, string];

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

function expandVisualPalette(id: ThemeName): VisualPalette {
  const semantic = getPalette(id);
  const primaryRgb = hexToRgbChannel(semantic.primary);
  const accentRgb = hexToRgbChannel(semantic.accent);
  const lightRgb = hexToRgbChannel(semantic.primaryLight);
  const isTormenta = id === 'tormenta';

  const softHex = isTormenta ? '#FECACA' : '#E9D5FF';
  const softTextHex = isTormenta ? '#FECACA' : '#D8B4FE';
  const coolHex = isTormenta ? semantic.primaryLight : '#3B82F6';
  const coolSoftHex = isTormenta ? lighten(semantic.primaryLight, 0.25) : '#60A5FA';

  return {
    id,
    label: semantic.name,
    description: isTormenta
      ? 'Vermelho e preto — inspirado em Tormenta20.'
      : 'Roxo e dourado — grimório clássico do Squire.',
    semantic,

    atmosphere: {
      top: semantic.gradientStart,
      upper: mixTowardBlack(semantic.gradientStart, 0.18),
      mid: mixTowardBlack(semantic.gradientStart, 0.36),
      lower: mixTowardBlack(semantic.gradientStart, 0.55),
      deep: mixTowardBlack(semantic.gradientEnd, 0.15),
      base: semantic.gradientEnd,
      glow: rgba(primaryRgb, 0.32),
      accent: lighten(semantic.primaryLight, 0.2),
      ambientPrimary: rgba(primaryRgb, 0.14),
      ambientPrimaryCore: rgba(primaryRgb, 0.09),
      ambientSecondary: rgba(accentRgb, 0.12),
      ambientSecondaryCore: rgba(accentRgb, 0.08),
    },

    atmosphereAmbient: [
      rgba(primaryRgb, 0.22),
      rgba(primaryRgb, 0.11),
      rgba(primaryRgb, 0.04),
      'transparent',
    ],

    colors: {
      background: semantic.gradientEnd,
      foreground: semantic.textPrimary,
      ivory: semantic.textPrimary,
      ivoryDim: semantic.textSecondary,
      gold: semantic.accent,
      goldBright: lighten(semantic.accent, 0.28),
      goldMuted: rgba(accentRgb, 0.7),
      purpleDeep: mixTowardBlack(semantic.gradientEnd, 0.35),
      purpleMid: mixTowardBlack(semantic.gradientStart, 0.25),
      petrol: isTormenta ? '#1A1012' : '#1a2838',
      card: isTormenta ? '#140A0C' : '#14121c',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      glass: 'rgba(255, 255, 255, 0.05)',
      glassBorder: 'rgba(255, 255, 255, 0.08)',
      glassGold: rgba(accentRgb, 0.1),
      glassGoldBorder: rgba(accentRgb, 0.25),
      inputBg: 'rgba(255, 255, 255, 0.04)',
      inputBorder: 'rgba(255, 255, 255, 0.10)',
      inputBorderFocus: rgba(accentRgb, 0.55),
      placeholder: rgba(hexToRgbChannel(semantic.textSecondary), 0.45),
      success: '#34d399',
      destructive: '#ef4444',
      tabBar: isTormenta ? 'rgba(12, 6, 8, 0.88)' : 'rgba(15, 13, 20, 0.85)',
      tabInactive: rgba(hexToRgbChannel(semantic.textSecondary), 0.6),
      overlay: 'rgba(0, 0, 0, 0.55)',
      popupFill: isTormenta ? 'rgba(14, 6, 8, 0.98)' : 'rgba(14, 12, 28, 0.98)',
      actionGoldFill: semantic.accentSoft,
      ivoryAlpha85: rgba(hexToRgbChannel(semantic.textPrimary), 0.85),
      goldAlpha55: rgba(accentRgb, 0.55),
    },

    brand: {
      accent: isTormenta ? semantic.primary : '#6366F1',
      accentSoft: isTormenta ? semantic.primaryLight : '#818CF8',
      accentBlue: isTormenta ? semantic.primaryLight : '#3B82F6',
      accentLight: isTormenta ? lighten(semantic.primaryLight, 0.2) : '#93C5FD',
      accentViolet: semantic.primaryLight,
      accentFuchsia: isTormenta ? '#FB7185' : '#C084FC',
      gradient: isTormenta
        ? [mixTowardBlack(semantic.primary, 0.25), semantic.primary]
        : ['#2563EB', '#6366F1'],
      pillGradient: [mixTowardBlack(semantic.primary, 0.2), semantic.primary, semantic.accent],
      fabGradient: isTormenta
        ? [mixTowardBlack(semantic.primary, 0.25), semantic.primary, mixTowardBlack(semantic.primary, 0.1)]
        : ['#3B82F6', '#6366F1', semantic.primary],
      sectionBar: [semantic.primaryLight, isTormenta ? semantic.primary : '#6366F1'],
      ctaGradient: isTormenta
        ? [mixTowardBlack(semantic.primary, 0.25), semantic.primary]
        : ['#2563EB', '#6366F1'],
    },

    glass: {
      fill: isTormenta ? 'rgba(24, 10, 12, 0.42)' : 'rgba(17, 24, 39, 0.38)',
      fillWeb: isTormenta ? 'rgba(24, 10, 12, 0.78)' : 'rgba(17, 24, 39, 0.72)',
      fillStrong: isTormenta ? 'rgba(16, 6, 8, 0.48)' : 'rgba(11, 17, 32, 0.42)',
      fillAndroid: isTormenta ? 'rgba(18, 8, 10, 0.78)' : 'rgba(12, 16, 32, 0.72)',
      border: 'rgba(255, 255, 255, 0.08)',
      borderStrong: rgba(lightRgb, 0.26),
      highlight: 'rgba(255, 255, 255, 0.05)',
      cardBorder: rgba(lightRgb, 0.24),
    },

    filledCard: {
      accentLine: rgba(lightRgb, 0.38),
      accentGlow: rgba(primaryRgb, 0.12),
      scrim: {
        start: rgba(hexToRgbChannel(semantic.gradientEnd), 0.98),
        mid: rgba(hexToRgbChannel(semantic.gradientEnd), 0.88),
        soft: rgba(hexToRgbChannel(semantic.gradientEnd), 0.52),
        end: 'transparent',
      },
    },

    illustration: {
      bookFill: rgba(primaryRgb, 0.32),
      bookPage: rgba(hexToRgbChannel(semantic.textPrimary), 0.12),
      bookStroke: semantic.primaryLight,
      scrollFill: rgba(accentRgb, 0.18),
      scrollStroke: semantic.accent,
      quillStroke: lighten(semantic.primaryLight, 0.15),
      shieldFill: rgba(primaryRgb, 0.2),
      shieldStroke: semantic.primaryLight,
      glow: rgba(lightRgb, 0.14),
    },

    softGlass: {
      background: mixTowardBlack(semantic.gradientEnd, 0.4),
      gold: lighten(semantic.accent, 0.2),
      muted: semantic.textSecondary,
      hintBorder: rgba(accentRgb, 0.25),
      heroBorder: rgba(accentRgb, 0.2),
      avatarBorder: lighten(semantic.accent, 0.15),
      avatarBg: semantic.accentSoft,
      statusPillBg: semantic.accentSoft,
      shortcutBorder: rgba(accentRgb, 0.14),
      shortcutIconBg: rgba(accentRgb, 0.1),
      emptyCtaBorder: rgba(accentRgb, 0.22),
      emptyCtaAccent: rgba(accentRgb, 0.35),
      localBadgeBg: rgba(accentRgb, 0.12),
      localBadgeBorder: rgba(accentRgb, 0.3),
      signOutBg: 'rgba(230, 160, 120, 0.1)',
      signOutBorder: 'rgba(230, 160, 120, 0.28)',
      signOutColor: '#E8B48A',
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

/** Aceita id legado `arcane` persistido antes da renomeação. */
export function resolveVisualThemeId(id: string | null | undefined): VisualThemeId {
  if (id === 'tormenta') return 'tormenta';
  if (id === 'default' || id === 'arcane') return 'default';
  return DEFAULT_VISUAL_THEME;
}
