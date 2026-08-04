import type { VisualPalette } from './palettes';
import type { ThemeOpacity } from './createOpacity';
import type { GrimoireTheme } from './createGrimoire';
import { hexToRgbChannel } from '../palettes';

function mixTowardBlackish(hex: string): string {
  const [r, g, b] = hexToRgbChannel(hex).split(',').map((n) => Number(n.trim()));
  const nr = Math.round((r ?? 0) * 0.2);
  const ng = Math.round((g ?? 0) * 0.2);
  const nb = Math.round((b ?? 0) * 0.2);
  return `#${[nr, ng, nb].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

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

    /**
     * Superfície de card padrão (sem blur excessivo).
     * elevated | subtle | interactive — via SurfaceCard.
     */
    surfaceCard: (() => {
      const mid = hexToRgbChannel(grimoire.backgroundAtmosphericMiddle);
      const goldChannel = hexToRgbChannel(palette.semantic.accent);
      const fill = (a: number) => `rgba(${mid}, ${a})`;
      /** Borda dourada sutil — cards de home (campanha, atalhos) */
      const border = (a: number) => `rgba(${goldChannel}, ${a})`;
      const shadowBase = mixTowardBlackish(palette.semantic.gradientEnd);

      return {
        borderWidth: 1,
        radius: {
          sm: 16,
          md: 18,
          lg: 20,
        },
        padding: {
          sm: 12,
          md: 14,
          lg: 18,
        },
        variants: {
          elevated: {
            background: fill(0.82),
            border: border(0.28),
            shadow: {
              color: shadowBase,
              opacity: 0.28,
              radius: 16,
              offsetY: 8,
              elevation: 6,
            },
          },
          subtle: {
            background: fill(0.45),
            border: border(0.2),
            shadow: {
              color: shadowBase,
              opacity: 0.1,
              radius: 8,
              offsetY: 3,
              elevation: 2,
            },
          },
          interactive: {
            background: fill(0.58),
            border: border(0.22),
            pressedBackground: fill(0.72),
            pressedBorder: border(0.38),
            pressedOpacity: 0.94,
            pressedScale: 0.98,
            shadow: {
              color: shadowBase,
              opacity: 0.16,
              radius: 10,
              offsetY: 4,
              elevation: 3,
            },
          },
        },
      } as const;
    })(),

    home: {
      sectionGap: 26,
      searchMarginTop: 18,
      campaignCardHeight: 236,
      /** Hierarquia Home: hero >> continuidade > atalhos */
      heroMarginTop: 20,
      /** Altura moderada — protagonista sem dominar a viewport */
      heroHeight: 176,
      continuityMarginTop: 20,
      shortcutsMarginTop: 28,
      bottomSpacer: 12,
      tabBarExtraPad: 8,
      activeCampaign: {
        minHeight: 168,
        padding: 18,
        /** Ilustração lateral (~38% da composição) */
        imageWidthRatio: 0.38,
        goldAccentWidth: 3,
        goldAccentHeight: 28,
        /** Overlay da imagem — derivado da base, sem preto chapado */
        imageOverlayMid: `rgba(${hexToRgbChannel(grimoire.backgroundAtmosphericBottom)}, 0.55)`,
        imageOverlayEnd: `rgba(${hexToRgbChannel(grimoire.backgroundAtmosphericBottom)}, 0.72)`,
        skeleton: {
          soft: opacity.card.subtle,
          mid: opacity.card.medium,
          strong: opacity.card.strong,
        },
      },
    },

    pill: {
      height: 36,
      inactiveSize: 34,
      radius: 999,
      gradient: brand.pillGradient,
      activeIcon: palette.semantic.textPrimary,
      activeLabel: palette.semantic.textPrimary,
      inactiveIcon: `rgba(${hexToRgbChannel(palette.semantic.textSecondary)}, ${opacity.level.iconMuted})`,
      shadow: {
        color: `rgb(${palette.rgb.primary})`,
        opacity: 0.38,
        radius: 10,
        offsetY: 4,
        elevation: 6,
      },
      spring: { damping: 20, stiffness: 260, mass: 0.75 },
      label: {
        fontSize: 12,
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
        color: mixTowardBlackish(palette.semantic.gradientEnd),
        opacity: 0.24,
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

    glass: { ...palette.glass, blur: 52, blurStrong: 76, shadow: {
      color: mixTowardBlackish(palette.semantic.gradientEnd),
      opacity: 0.28,
      radius: 18,
      offsetY: 8,
      elevation: 8,
    } },

    shortcutTile: {
      radius: 16,
      iconRadius: 12,
      /** Compacto — inferior aos cards principais; toque ≥ 44 */
      minHeight: 52,
      iconSize: 32,
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
        fontSize: 13,
        lineHeight: 16,
      },
    },

    cta: {
      gradient: brand.ctaGradient,
      foreground: palette.id === 'tormenta' ? '#FFFFFF' : palette.semantic.gradientEnd,
      /** Mais arredondado (quase pill) */
      radius: 999,
      paddingVertical: 13,
      paddingHorizontal: 20,
      shadow: {
        color: brand.ctaGradient[1],
        opacity: 0.36,
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
      marginTop: 2,
      marginBottom: 12,
      accentBar: {
        width: 3,
        height: 18,
        gradient: brand.sectionBar,
      },
      title: {
        fontFamily: 'Cinzel_600SemiBold',
        fontSize: 17,
        lineHeight: 26,
        letterSpacing: 0.4,
      },
      action: {
        fontSize: 13,
      },
    },

    tabBar: {
      height: 64,
      shellRadius: 22,
      /** Cor sólida — sem blur/camadas que leem como gradiente */
      shellFill: palette.semantic.surface,
      shellBorder: `rgba(${hexToRgbChannel(palette.semantic.accent)}, 0.18)`,
      shellAndroid: palette.semantic.surface,
      fabGradient: brand.fabGradient,
      fabRing: `rgba(${hexToRgbChannel(palette.semantic.gradientEnd)}, 0.96)`,
      fabShadow: {
        color: brand.accent,
        opacity: 0.32,
        radius: 12,
        offsetY: 6,
      },
    },

    ambientGlow: {
      blur: grimoire.blur.glow,
      purple: {
        halo: grimoire.atmosphere.homePurple,
        core: grimoire.atmosphere.homePurpleCore,
        sizeRatio: 0.88,
        maxSize: 360,
        topRatio: 0.08,
        bleedRatio: -0.3,
      },
      gold: {
        halo: grimoire.atmosphere.homeGold,
        core: grimoire.atmosphere.homeGoldCore,
        sizeRatio: 0.58,
        maxSize: 240,
        bottomOffset: 36,
        bleedRatio: -0.36,
      },
      top: {
        halo: grimoire.atmosphere.topWash,
        core: grimoire.atmosphere.topWashCore,
        sizeRatio: 1.05,
        maxSize: 420,
        topRatio: -0.06,
      },
    },

    illustration: { ...palette.illustration },
  } as const;
}

export type ThemeComponents = ReturnType<typeof createComponents>;
