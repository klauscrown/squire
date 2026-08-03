import type { VisualPalette } from './palettes';
import type { ThemeOpacity } from './createOpacity';
import type { GrimoireTheme } from './createGrimoire';

/**
 * Tokens reutilizáveis de componentes — gerados a partir da paleta ativa.
 */
export function createComponents(
  palette: VisualPalette,
  opacity: ThemeOpacity,
  grimoire: GrimoireTheme,
) {
  const brand = palette.brand;

  return {
    radius: {
      sm: 14,
      md: 18,
      lg: 22,
      xl: 26,
      pill: 999,
    },

    spacing: {
      section: 32,
      stack: 14,
      grid: 12,
      inset: 22,
    },

    home: {
      sectionGap: 22,
      searchMarginTop: 14,
      campaignCardHeight: 240,
    },

    pill: {
      height: 36,
      inactiveSize: 34,
      radius: 999,
      gradient: brand.pillGradient,
      activeIcon: '#FFFFFF',
      activeLabel: '#FFFFFF',
      inactiveIcon: `rgba(168, 164, 156, ${opacity.level.iconMuted})`,
      shadow: {
        color: `rgb(${palette.rgb.primary})`,
        opacity: 0.38,
        radius: 10,
        offsetY: 4,
        elevation: 6,
      },
      spring: { damping: 20, stiffness: 260, mass: 0.75 },
      label: {
        fontSize: 11,
      },
    },

    chip: {
      minHeight: 42,
      radius: 999,
      paddingHorizontal: 18,
      gap: 14,
      activeFill: palette.colors.gold,
      activeText: palette.colors.purpleDeep,
      activeBorder: palette.colors.gold,
      inactiveFill: opacity.card.medium,
      inactiveText: opacity.text.lilacSoft,
      inactiveBorder: opacity.border.goldSubtle,
      inactiveBorderAlt: opacity.border.lilacSubtle,
      pressedFill: opacity.card.strong,
      pressedBorder: opacity.border.goldStrong,
      pressedOpacity: opacity.level.pressed,
      activeShadow: {
        color: '#000000',
        opacity: 0.28,
        radius: 6,
        offsetY: 2,
        elevation: 4,
      },
      label: {
        fontSize: 13,
        lineHeight: 16,
      },
    },

    filledCard: {
      radius: 22,
      minHeight: 196,
      padding: 22,
      bodyMaxWidth: '58%' as const,
      illustration: {
        width: '62%' as const,
        defaultWidth: 280,
        defaultHeight: 312,
        bleedRight: -72,
        bleedBottom: -56,
        opacity: opacity.level.illustration,
        align: 'bottom' as const,
      },
      accentLine: palette.filledCard.accentLine,
      accentGlow: palette.filledCard.accentGlow,
      scrim: {
        start: palette.filledCard.scrim.start,
        mid: palette.filledCard.scrim.mid,
        soft: palette.filledCard.scrim.soft,
        end: palette.filledCard.scrim.end,
        locations: [0, 0.38, 0.62, 1] as const,
      },
    },

    searchBar: {
      minHeight: 60,
      paddingHorizontal: 18,
      gap: 12,
      inputFontSize: 16,
      inputLineHeight: 22,
      iconSize: 22,
      filterSize: 40,
      dividerHeight: 24,
      chipTrackPaddingVertical: 8,
      chipTrackPaddingHorizontal: 18,
    },

    mascotFab: {
      size: 70,
      mascotSize: 55,
      rowMarginTop: 8,
      rowPullDown: 110,
    },

    glass: { ...palette.glass, blur: 48, blurStrong: 72, shadow: {
      color: '#000000',
      opacity: 0.22,
      radius: 16,
      offsetY: 6,
      elevation: 6,
    } },

    shortcutTile: {
      radius: 18,
      iconRadius: 14,
      minHeight: 100,
      iconSize: 44,
      cardFill: opacity.card.subtle,
      frameBorder: opacity.border.goldMedium,
      frameBorderPressed: opacity.border.goldStrong,
      pressedOpacity: opacity.level.pressed,
      variants: {
        names: {
          iconStroke: opacity.iconStroke.gold,
          iconCircleFill: opacity.iconCircle.goldMedium,
          iconCircleBorder: opacity.iconCircle.goldBorderStrong,
        },
        items: {
          iconStroke: opacity.iconStroke.gold,
          iconCircleFill: opacity.iconCircle.goldSubtle,
          iconCircleBorder: opacity.iconCircle.goldBorder,
        },
        notes: {
          iconStroke: opacity.iconStroke.lilac,
          iconCircleFill: opacity.iconCircle.lilacFill,
          iconCircleBorder: opacity.iconCircle.lilacBorder,
        },
        encounter: {
          iconStroke: opacity.iconStroke.blue,
          iconCircleFill: opacity.iconCircle.blueFill,
          iconCircleBorder: opacity.iconCircle.blueBorder,
        },
      },
      label: {
        fontSize: 10,
        lineHeight: 13,
      },
    },

    cta: {
      gradient: brand.ctaGradient,
      foreground: '#FFFFFF',
      radius: 18,
      paddingVertical: 14,
      paddingHorizontal: 20,
      shadow: {
        color: brand.accent,
        opacity: 0.42,
        radius: 14,
        offsetY: 6,
        elevation: 10,
      },
      pressedOpacity: 0.9,
      label: {
        fontSize: 15,
      },
    },

    sectionHeader: {
      marginTop: 4,
      marginBottom: 8,
      accentBar: {
        width: 3,
        height: 20,
        gradient: brand.sectionBar,
      },
      title: {
        fontFamily: 'Cinzel_600SemiBold',
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0.28,
      },
      action: {
        fontSize: 13,
      },
    },

    tabBar: {
      height: 64,
      shellRadius: 22,
      shellAndroid:
        palette.id === 'tormenta' ? 'rgba(12, 6, 8, 0.94)' : 'rgba(10, 12, 28, 0.92)',
      fabGradient: brand.fabGradient,
      fabRing: palette.id === 'tormenta' ? 'rgba(12, 6, 8, 0.96)' : 'rgba(10, 12, 28, 0.96)',
      fabShadow: {
        color: brand.accent,
        opacity: 0.35,
        radius: 12,
        offsetY: 6,
      },
    },

    ambientGlow: {
      blur: grimoire.blur.glow,
      purple: {
        halo: grimoire.atmosphere.homePurple,
        core: grimoire.atmosphere.homePurpleCore,
        sizeRatio: 0.82,
        maxSize: 340,
        topRatio: 0.2,
        bleedRatio: -0.28,
      },
      gold: {
        halo: grimoire.atmosphere.homeGold,
        core: grimoire.atmosphere.homeGoldCore,
        sizeRatio: 0.62,
        maxSize: 260,
        bottomOffset: 28,
        bleedRatio: -0.32,
      },
    },

    illustration: { ...palette.illustration },
  } as const;
}

export type ThemeComponents = ReturnType<typeof createComponents>;
