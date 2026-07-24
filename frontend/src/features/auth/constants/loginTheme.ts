/** Paleta e medidas da tela de login — alinhado ao mockup de referência. */
export const loginTheme = {
  background: {
    base: '#02040A',
    top: '#0A0E21',
    mid: '#070812',
    bottom: '#02040A',
  },
  glass: {
    background: 'rgba(18, 22, 41, 0.88)',
    border: 'rgba(123, 97, 255, 0.32)',
    borderStrong: 'rgba(129, 140, 248, 0.55)',
  },
  input: {
    background: '#121629',
    border: 'rgba(123, 97, 255, 0.32)',
    borderFocus: 'rgba(77, 136, 255, 0.75)',
    placeholder: 'rgba(165, 180, 252, 0.38)',
    radius: 14,
    height: 52,
  },
  card: {
    background: 'rgba(14, 17, 32, 0.92)',
    border: 'rgba(123, 97, 255, 0.22)',
    radius: 16,
  },
  text: {
    title: '#F5F1E6',
    subtitle: '#8B93A8',
    body: '#C4C9D4',
    muted: 'rgba(165, 180, 252, 0.65)',
  },
  brand: {
    title: '#E8E4F0',
    glow: 'rgba(255, 255, 255, 0.45)',
    tagline: '#D4AF37',
  },
  link: '#A78BFA',
  gold: '#D4AF37',
  button: {
    gradientStart: '#4F46E5',
    gradientMid: '#6366F1',
    gradientEnd: '#3B82F6',
    shadow: '#4F46E5',
    height: 52,
    radius: 14,
  },
  social: {
    background: '#121629',
    border: 'rgba(123, 97, 255, 0.24)',
    radius: 14,
    height: 50,
  },
  settings: {
    background: 'rgba(255, 255, 255, 0.08)',
  },
} as const;

export const loginSpacing = {
  fieldGap: 14,
  sectionGap: 22,
  horizontal: 24,
} as const;
