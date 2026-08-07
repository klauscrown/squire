/**
 * Paletas semânticas multi-tema — fonte de verdade para gradiente, primary, accent, surface e texto.
 * Em componentes: use `useActivePalette()` / `useGrimoire()` / `usePremium()` — nunca hex na UI.
 *
 * Hierarquia (Grimório e Tormenta compartilham a mesma arquitetura):
 * - Base profunda (navy ou carvão)
 * - Luz ambiente (azul-violeta / vermelho quente) só em glows, não em grandes áreas
 * - Accent (dourado envelhecido / bronze) só em destaques
 * - Texto principal elevado / secundário acinzentado
 *
 * Não alterar valores de `palettes.default` ao calibrar Tormenta.
 */

export const palettes = {
  default: {
    name: 'Grimório',
    /**
     * Atmosfera profunda (padronizada app-wide):
     * azul navy no topo, quase preto na base — sem cyan vivo.
     */
    gradientStart: '#0A2A55',
    gradientEnd: '#02060F',
    /** Azul estrutural (nav, foco) — contido */
    primary: '#2A5FA8',
    primaryLight: '#5B8ED4',
    /** CTA / ações importantes — dourado envelhecido */
    buttonPrimary: '#C4A35A',
    buttonPrimaryShadow: 'rgba(196, 163, 90, 0.32)',
    fabShadow: 'rgba(42, 95, 168, 0.16)',
    /** Dourado envelhecido — apenas destaques */
    accent: '#C4A35A',
    accentSoft: '#E2D2A4',
    /** Superfície de card sobre a base navy profunda */
    surface: '#0B1424',
    /** Borda estrutural azul-acinzentada */
    surfaceBorder: 'rgba(91, 142, 212, 0.14)',
    /** Branco levemente azulado */
    textPrimary: '#E8EEF7',
    /** Azul-acinzentado legível */
    textSecondary: '#8AA3C2',
    iconVariants: {
      a: '#C4A35A',
      b: '#8BA3C4',
      c: '#6B8DB8',
      d: '#7EB0D4',
    },
  },
  tormenta: {
    name: 'Tormenta',
    /** Base vermelho-carvão (mesma hierarquia: top → base) */
    gradientStart: '#3B0A0A',
    gradientEnd: '#100808',
    /** Vermelho estrutural — nav e foco (grandes áreas usam a base, não o estrutural) */
    primary: '#B91C1C',
    primaryLight: '#EF4444',
    /** CTA primário — vermelho de ação */
    buttonPrimary: '#E11D2E',
    buttonPrimaryShadow: 'rgba(225, 29, 46, 0.32)',
    fabShadow: 'rgba(225, 29, 46, 0.16)',
    /** Bronze — só destaques (equivalente ao dourado) */
    accent: '#C97A3D',
    accentSoft: 'rgba(201, 122, 61, 0.18)',
    surface: '#1A0C0C',
    /** Borda estrutural quente discreta — sem bronze em toda borda */
    surfaceBorder: 'rgba(232, 196, 180, 0.12)',
    textPrimary: '#F5E9E4',
    textSecondary: '#D4B5A8',
    iconVariants: {
      a: '#C97A3D',
      b: '#B5502E',
      c: '#8C6239',
      d: '#8A9AA8',
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
