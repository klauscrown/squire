import { defaultVisualTheme, type ThemeOpacity } from './visual';

/**
 * Opacidades e fills semânticos — tema Arcano (padrão).
 * Preferir `useOpacity()` / `useVisualTheme()` para reagir à troca de tema.
 */
export const opacity = defaultVisualTheme.opacity;

export type { ThemeOpacity };
