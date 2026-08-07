import { loginLayout } from './loginLayout';

/**
 * Espaçamentos e chaves estáveis da auth.
 * Cores/materiais: use `useActivePalette` + `useComponents()` (padrão Home).
 * Mantido para compat (splash / refs antigas).
 */
export const loginSpacing = {
  fieldGap: loginLayout.field.gap,
  sectionGap: loginLayout.divider.marginVertical,
  horizontal: loginLayout.screen.horizontal,
} as const;

/** @deprecated Preferir tokens da Home (`useActivePalette` / `useComponents`). */
export const loginTheme = {
  input: {
    radius: loginLayout.field.radius,
    height: loginLayout.field.height,
  },
  button: {
    height: loginLayout.button.height,
    radius: loginLayout.button.radius,
  },
  social: {
    radius: loginLayout.social.radius,
    minHeight: loginLayout.social.height,
    paddingVertical: loginLayout.social.paddingVertical,
    gap: 8,
  },
  /** fallbacks estáticos só para splash/overlay legados */
  text: {
    title: '#E8EEF7',
    subtitle: '#8AA3C2',
    body: '#C4C9D4',
    muted: 'rgba(138, 163, 194, 0.7)',
  },
  brand: {
    title: '#E8EEF7',
    glow: 'rgba(196, 163, 90, 0.32)',
    tagline: '#C4A35A',
  },
  gold: '#C4A35A',
  link: '#C4A35A',
} as const;
