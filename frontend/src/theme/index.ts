import { animation, type ThemeAnimation } from './animation';
import { colors, palette, type ColorScheme, type ModuleColorKey, type ThemeColors } from './colors';
import { elevation, type ThemeElevation } from './elevation';
import { radius, type ThemeRadius } from './radius';
import { spacing, type ThemeSpacing } from './spacing';
import { fontFamily, typography, type FontFamily, type ThemeTypography } from './typography';

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  radius: ThemeRadius;
  elevation: ThemeElevation;
  animation: ThemeAnimation;
}

export function createTheme(scheme: ColorScheme): Theme {
  return {
    colors: colors[scheme],
    spacing,
    typography,
    radius,
    elevation,
    animation,
  };
}

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export { animation, colors, elevation, fontFamily, palette, radius, spacing, typography };
export type { ColorScheme, FontFamily, ModuleColorKey, ThemeAnimation, ThemeColors, ThemeElevation, ThemeRadius, ThemeSpacing, ThemeTypography };
