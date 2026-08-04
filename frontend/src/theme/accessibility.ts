/**
 * Constantes de acessibilidade e toque (HIG / Material ≈ 44pt).
 * Preferir estes tokens a números soltos em componentes.
 */
export const MIN_TOUCH_TARGET = 44;

/** Larguras de referência para layout fluido — não amarrar UI a uma resolução. */
export const LAYOUT_WIDTH = {
  /** Abaixo: gutters e hierarquia mais compactos */
  compact: 360,
  /** Abaixo: campanha hero sem painel de imagem lateral */
  narrow: 400,
} as const;
