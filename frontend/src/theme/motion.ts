/**
 * Motion discreto da UI (Reanimated).
 * Entradas curtas, pressed contido — sem loops de fundo.
 */
export const motion = {
  /** Entrada de cards (fade + translateY) */
  enter: {
    durationMs: 240,
    translateY: 8,
  },
  /** Pressed — escala leve, duração no intervalo 180–320ms */
  press: {
    scale: 0.98,
    durationInMs: 180,
    durationOutMs: 200,
  },
  /** Atraso entre cards secundários na mesma seção */
  staggerMs: 48,
  /** Delays da hierarquia da Home */
  home: {
    header: 0,
    campaign: 40,
    nextSession: 110,
    shortcuts: 170,
  },
} as const;
