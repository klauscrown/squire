import { defaultVisualTheme, type PremiumTheme } from './visual';
import { components } from './components';
import { opacity } from './opacity';

/**
 * Tokens primitivos premium + aliases legados — tema Arcano (padrão).
 * Preferir `usePremium()` / `useVisualTheme()` para reagir à troca de tema.
 */
export const premium = defaultVisualTheme.premium;

export type { PremiumTheme };
export { components, opacity };
