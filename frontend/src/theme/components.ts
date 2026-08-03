import { defaultVisualTheme, type ThemeComponents } from './visual';

/**
 * Tokens reutilizáveis de componentes — tema Arcano (padrão).
 * Preferir `useComponents()` / `useVisualTheme()` para reagir à troca de tema.
 */
export const components = defaultVisualTheme.components;

export type { ThemeComponents };
