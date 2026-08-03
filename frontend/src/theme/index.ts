import { animation, type ThemeAnimation } from './animation';
import { colors, palette, type ColorScheme, type ModuleColorKey, type ThemeColors } from './colors';
import { components, type ThemeComponents } from './components';
import { elevation, type ThemeElevation } from './elevation';
import { opacity, type ThemeOpacity } from './opacity';
import { radius, type ThemeRadius } from './radius';
import { spacing, type ThemeSpacing } from './spacing';
import { fontFamily, typography, type FontFamily, type ThemeTypography } from './typography';
import { defaultVisualTheme, type VisualThemePack } from './visual';

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  radius: ThemeRadius;
  elevation: ThemeElevation;
  animation: ThemeAnimation;
  components: ThemeComponents;
  opacity: ThemeOpacity;
}

export function createTheme(scheme: ColorScheme, visual: VisualThemePack = defaultVisualTheme): Theme {
  return {
    colors: colors[scheme],
    spacing,
    typography,
    radius,
    elevation,
    animation,
    components: visual.components,
    opacity: visual.opacity,
  };
}

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export { animation, colors, components, elevation, fontFamily, opacity, palette, radius, spacing, typography };
export type {
  ColorScheme,
  FontFamily,
  ModuleColorKey,
  ThemeAnimation,
  ThemeColors,
  ThemeComponents,
  ThemeElevation,
  ThemeOpacity,
  ThemeRadius,
  ThemeSpacing,
  ThemeTypography,
};

export {
  DEFAULT_THEME_NAME,
  THEME_NAMES,
  getPalette,
  hexToRgbChannel,
  palettes,
  type ThemeName,
  type ThemePalette,
} from './palettes';

export {
  DEFAULT_VISUAL_THEME,
  createVisualTheme,
  defaultVisualTheme,
  resolveVisualThemeId,
  visualThemePacks,
  type VisualThemeId,
  type VisualThemePack,
} from './visual';
