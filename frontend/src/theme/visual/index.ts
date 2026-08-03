import {
  DEFAULT_VISUAL_THEME,
  VISUAL_PALETTES,
  resolveVisualThemeId,
  type VisualPalette,
  type VisualThemeId,
} from './palettes';
import { createComponents, type ThemeComponents } from './createComponents';
import { createGrimoire, type GrimoireTheme } from './createGrimoire';
import { createOpacity, type ThemeOpacity } from './createOpacity';
import { createPremium, type PremiumTheme } from './createPremium';

export interface VisualThemePack {
  id: VisualThemeId;
  label: string;
  description: string;
  palette: VisualPalette;
  grimoire: GrimoireTheme;
  opacity: ThemeOpacity;
  components: ThemeComponents;
  premium: PremiumTheme;
  atmosphereAmbient: VisualPalette['atmosphereAmbient'];
}

export function createVisualTheme(id: VisualThemeId): VisualThemePack {
  const resolved = resolveVisualThemeId(id);
  const palette = VISUAL_PALETTES[resolved];
  const opacity = createOpacity(palette);
  const grimoire = createGrimoire(palette);
  const components = createComponents(palette, opacity, grimoire);
  const premium = createPremium(palette, components, opacity);

  return {
    id: palette.id,
    label: palette.label,
    description: palette.description,
    palette,
    grimoire,
    opacity,
    components,
    premium,
    atmosphereAmbient: palette.atmosphereAmbient,
  };
}

export const visualThemePacks: Record<VisualThemeId, VisualThemePack> = {
  default: createVisualTheme('default'),
  tormenta: createVisualTheme('tormenta'),
};

export const defaultVisualTheme = visualThemePacks[DEFAULT_VISUAL_THEME];

export {
  DEFAULT_VISUAL_THEME,
  VISUAL_PALETTES,
  resolveVisualThemeId,
  type VisualPalette,
  type VisualThemeId,
};
export type { GrimoireTheme, PremiumTheme, ThemeComponents, ThemeOpacity };
