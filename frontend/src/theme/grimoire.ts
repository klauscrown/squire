/**
 * Tokens visuais do grimório digital — adaptados do protótipo Lovable.
 */
export const grimoire = {
  /** Fundo em camadas — deltas pequenos entre stops para fade natural */
  atmosphere: {
    top: '#2B1A66',
    upper: '#231552',
    mid: '#1C1244',
    lower: '#150E36',
    deep: '#0E0A28',
    base: '#08061A',
    glow: 'rgba(99, 102, 241, 0.35)',
    accent: '#A5B4FC',
  },

  colors: {
    background: '#08061A',
    foreground: '#EFEDE8',
    ivory: '#EFEDE8',
    ivoryDim: '#A8A49C',
    gold: '#C9A962',
    goldBright: '#E8D4A0',
    goldMuted: 'rgba(201, 169, 98, 0.7)',
    purpleDeep: '#1a0f2e',
    purpleMid: '#2d1a4d',
    petrol: '#1a2838',
    card: '#14121c',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassGold: 'rgba(201, 169, 98, 0.08)',
    glassGoldBorder: 'rgba(201, 169, 98, 0.25)',
    inputBg: 'rgba(255, 255, 255, 0.04)',
    inputBorder: 'rgba(255, 255, 255, 0.10)',
    inputBorderFocus: 'rgba(201, 169, 98, 0.55)',
    placeholder: 'rgba(168, 164, 156, 0.45)',
    success: '#34d399',
    destructive: '#ef4444',
    tabBar: 'rgba(15, 13, 20, 0.85)',
    tabInactive: 'rgba(168, 164, 156, 0.6)',
  },

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
      shadowColor: '#000',
      shadowOpacity: 0.45,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
    goldGlow: {
      shadowColor: '#C9A962',
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    goldSoft: {
      shadowColor: '#C9A962',
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

  /** Soft Glassmorphism + Dark Gold Fantasy (Quartel-General) */
  softGlass: {
    background: '#020408',
    gold: '#E6C280',
    muted: '#8C8C8C',
    hintCard: {
      backgroundColor: 'rgba(28, 25, 34, 0.85)',
      borderColor: 'rgba(230, 194, 128, 0.25)',
      borderRadius: 22,
    },
    heroCard: {
      backgroundColor: 'rgba(28, 25, 34, 0.85)',
      borderColor: 'rgba(230, 194, 128, 0.2)',
      borderRadius: 24,
    },
    avatar: {
      borderColor: '#E6C280',
      borderWidth: 1.5,
      backgroundColor: 'rgba(230, 194, 128, 0.15)',
    },
    statusPill: {
      backgroundColor: 'rgba(230, 194, 128, 0.15)',
      borderRadius: 20,
    },
    statCard: {
      backgroundColor: 'rgba(22, 20, 27, 0.75)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 18,
    },
    shortcutCard: {
      backgroundColor: 'rgba(24, 22, 30, 0.85)',
      borderColor: 'rgba(230, 194, 128, 0.12)',
      borderRadius: 22,
      minHeight: 130,
      iconBackground: 'rgba(230, 194, 128, 0.1)',
    },
    syncPill: {
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    emptyCta: {
      borderColor: 'rgba(230, 194, 128, 0.22)',
      accentLine: 'rgba(230, 194, 128, 0.35)',
    },
    settingsCard: {
      backgroundColor: 'rgba(25, 23, 29, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 24,
      padding: 18,
    },
    themeTrack: {
      backgroundColor: 'rgba(15, 14, 19, 0.6)',
      borderRadius: 30,
      padding: 4,
    },
    localModeBadge: {
      backgroundColor: 'rgba(230, 194, 128, 0.12)',
      borderColor: 'rgba(230, 194, 128, 0.3)',
      borderRadius: 20,
    },
    signOutPill: {
      backgroundColor: 'rgba(230, 160, 120, 0.1)',
      borderColor: 'rgba(230, 160, 120, 0.28)',
      color: '#E8B48A',
    },
  },
} as const;

export type GrimoireTheme = typeof grimoire;
