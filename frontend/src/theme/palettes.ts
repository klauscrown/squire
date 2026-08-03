/**
 * Paletas semânticas multi-tema — fonte de verdade para gradiente, primary, accent, surface e texto.
 * Em componentes: use `useActivePalette()` (único jeito suportado de aplicar cor de tema).
 *
 * Tormenta está calibrado para replicar o padrão de dois temas nas próximas telas.
 * Não alterar valores de `palettes.default` ao calibrar ou estender Tormenta.
 *
 * Tokens detalhados (atmosphere, glass, brand…) são derivados em `theme/visual`.
 */

export const palettes = {
  default: {
    name: 'Grimório',
    /** Atmosphere top — alinhado a grimoire.atmosphere.top */
    gradientStart: '#2B1A66',
    /** Atmosphere base — alinhado a grimoire.atmosphere.base */
    gradientEnd: '#08061A',
    /** Roxo principal — tokens.arcanePurple / botões, pill ativa */
    primary: '#7C3AED',
    primaryLight: '#A78BFA',
    /** Alias do primary — default não usa CTA separado (só Tormenta diferencia) */
    buttonPrimary: '#7C3AED',
    buttonPrimaryShadow: 'rgba(124, 58, 237, 0.42)',
    /** Glow suave do FAB — mais baixo que o CTA retangular */
    fabShadow: 'rgba(124, 58, 237, 0.18)',
    /** Dourado antigo — tokens.ancientGold / chips, ícones, destaques */
    accent: '#C9A962',
    accentSoft: 'rgba(201, 169, 98, 0.15)',
    /** Wash de card — opacity.card.subtle */
    surface: 'rgba(124, 58, 237, 0.08)',
    surfaceBorder: 'rgba(201, 169, 98, 0.2)',
    textPrimary: '#EFEDE8',
    textSecondary: '#A8A49C',
    /** Diferenciação cíclica dos quick actions (dourado / lilás / violeta / azul) */
    iconVariants: {
      a: '#C9A962',
      b: '#E9D5FF',
      c: '#A78BFA',
      d: '#93C5FD',
    },
  },
  tormenta: {
    name: 'Tormenta',
    gradientStart: '#3B0A0A',
    gradientEnd: '#0A0505',
    /** Vermelho estrutural — pill de nav, bordas, ícones ativos */
    primary: '#B91C1C',
    primaryLight: '#EF4444',
    /** CTA primário — vermelho quente/vibrante (salto sobre o card) */
    buttonPrimary: '#E11D2E',
    buttonPrimaryShadow: 'rgba(225, 29, 46, 0.35)',
    /** Glow do FAB circular — mais contido que o CTA do card */
    fabShadow: 'rgba(225, 29, 46, 0.18)',
    /** Bronze/ferrugem no lugar do dourado */
    accent: '#C97A3D',
    accentSoft: 'rgba(201, 122, 61, 0.15)',
    surface: 'rgba(185, 28, 28, 0.08)',
    surfaceBorder: 'rgba(201, 122, 61, 0.2)',
    textPrimary: '#F5E9E4',
    /**
     * Subtítulos/descrições sobre gradientEnd (#0A0505).
     * Tormenta exige salto de luminosidade maior que o Grimório (vermelho escurece mais rápido).
     */
    textSecondary: '#F0D5C9',
    /** Variações quentes + 1 contraste frio no ícone de combate/encontro */
    iconVariants: {
      a: '#C97A3D', // bronze — Gerar nomes
      b: '#B5502E', // cobre queimado — Gerar Itens
      c: '#8C6239', // ferrugem/latão escuro — Notas Rápidas
      d: '#8A9AA8', // cinza-ferro frio — Gerar Encontro (quebra temperatura)
    },
  },
} as const;

export type ThemeName = keyof typeof palettes;
export type ThemePalette = (typeof palettes)[ThemeName];
export type IconVariantKey = keyof ThemePalette['iconVariants'];

export const ICON_VARIANT_KEYS = ['a', 'b', 'c', 'd'] as const satisfies readonly IconVariantKey[];

export const DEFAULT_THEME_NAME: ThemeName = 'default';

export const THEME_NAMES = Object.keys(palettes) as ThemeName[];

export function getPalette(name: ThemeName): ThemePalette {
  return palettes[name] ?? palettes.default;
}

/** Soft fill a partir de um hex de iconVariants (círculos/áreas dos quick actions). */
export function iconVariantSoft(hex: string, alpha = 0.18): string {
  return `rgba(${hexToRgbChannel(hex)}, ${alpha})`;
}

/** Borda suave a partir do mesmo hex. */
export function iconVariantBorder(hex: string, alpha = 0.36): string {
  return `rgba(${hexToRgbChannel(hex)}, ${alpha})`;
}

/** Converte `#RRGGBB` em canal `r, g, b` para composição rgba. */
export function hexToRgbChannel(hex: string): string {
  const raw = hex.replace('#', '').trim();
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return '0, 0, 0';
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}
