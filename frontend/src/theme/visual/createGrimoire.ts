import type { VisualPalette } from './palettes';
import { hexToRgbChannel } from '../palettes';

/**
 * Tokens visuais do grimório digital — gerados a partir da paleta ativa.
 */
export function createGrimoire(palette: VisualPalette) {
  const soft = palette.softGlass;
  const c = palette.colors;

  return {
    /** Fundo full-screen — AtmosphericBackground */
    backgroundAtmosphericTop: palette.backgroundAtmosphericTop,
    backgroundAtmosphericMiddle: palette.backgroundAtmosphericMiddle,
    backgroundAtmosphericBottom: palette.backgroundAtmosphericBottom,
    ambientPrimary: palette.ambientPrimary,
    ambientSecondary: palette.ambientSecondary,

    atmosphere: {
      top: palette.atmosphere.top,
      upper: palette.atmosphere.upper,
      mid: palette.atmosphere.mid,
      lower: palette.atmosphere.lower,
      deep: palette.atmosphere.deep,
      base: palette.atmosphere.base,
      glow: palette.atmosphere.glow,
      accent: palette.atmosphere.accent,
      homePurple: palette.atmosphere.ambientPrimary,
      homePurpleCore: palette.atmosphere.ambientPrimaryCore,
      homeGold: palette.atmosphere.ambientSecondary,
      homeGoldCore: palette.atmosphere.ambientSecondaryCore,
      topWash: palette.atmosphere.topWash,
      topWashCore: palette.atmosphere.topWashCore,
      sideLeft: palette.atmosphere.sideLeft,
      sideRight: palette.atmosphere.sideRight,
      ambientPrimary: palette.ambientPrimary,
      ambientSecondary: palette.ambientSecondary,
    },

    starDust: { ...palette.starDust },

    colors: { ...c },

    radius: {
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
      hero: 28,
      full: 9999,
    },

    spacing: {
      xs: 8,
      sm: 12,
      md: 16,
      screen: 24,
      section: 32,
      lg: 40,
    },

    blur: {
      card: 24,
      input: 20,
      tabBar: 40,
      glow: 60,
    },

    typography: {
      eyebrow: {
        fontSize: 10,
        letterSpacing: 3,
      },
      label: {
        fontSize: 10,
        letterSpacing: 2.5,
      },
      body: {
        fontSize: 14,
        lineHeight: 22,
      },
      input: {
        fontSize: 15,
        lineHeight: 20,
      },
    },

    elevation: {
      hero: {
        shadowColor: palette.colors.background,
        shadowOpacity: 0.45,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 12,
      },
      goldGlow: {
        shadowColor: palette.elevation.goldGlow,
        shadowOpacity: 0.35,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      },
      goldSoft: {
        shadowColor: palette.elevation.goldSoft,
        shadowOpacity: 0.6,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
      },
    },

    animation: {
      fadeUp: { duration: 500, translateY: 12 },
      glowPulse: { duration: 2000 },
      mistDrift: { duration: 22000 },
    },

    softGlass: {
      background: soft.background,
      gold: soft.gold,
      muted: soft.muted,
      hintCard: {
        backgroundColor: palette.colors.card,
        borderColor: soft.hintBorder,
        borderRadius: 20,
      },
      heroCard: {
        backgroundColor: palette.colors.card,
        borderColor: soft.heroBorder,
        borderRadius: 22,
      },
      avatar: {
        borderColor: soft.avatarBorder,
        borderWidth: 1.5,
        backgroundColor: soft.avatarBg,
      },
      statusPill: {
        backgroundColor: soft.statusPillBg,
        borderRadius: 20,
      },
      statCard: {
        backgroundColor: soft.background,
        borderColor: palette.colors.cardBorder,
        borderRadius: 18,
      },
      shortcutCard: {
        backgroundColor: soft.background,
        borderColor: soft.shortcutBorder,
        borderRadius: 18,
        minHeight: 120,
        iconBackground: soft.shortcutIconBg,
      },
      syncPill: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
      },
      emptyCta: {
        borderColor: soft.emptyCtaBorder,
        accentLine: soft.emptyCtaAccent,
      },
      settingsCard: {
        backgroundColor: soft.background,
        borderColor: palette.colors.cardBorder,
        borderRadius: 22,
        padding: 18,
      },
      themeTrack: {
        backgroundColor: `rgba(${hexToRgbChannel(palette.colors.background)}, 0.55)`,
        borderRadius: 30,
        padding: 4,
        selectedBackground: soft.avatarBg,
      },
      localModeBadge: {
        backgroundColor: soft.localBadgeBg,
        borderColor: soft.localBadgeBorder,
        borderRadius: 20,
      },
      signOutPill: {
        backgroundColor: soft.signOutBg,
        borderColor: soft.signOutBorder,
        color: soft.signOutColor,
      },
    },
  } as const;
}

export type GrimoireTheme = ReturnType<typeof createGrimoire>;
