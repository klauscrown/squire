/** Tokens do visual premium (referência Apple / glass indigo). */
export const premium = {
  accent: '#6366F1',
  accentSoft: '#818CF8',
  accentBlue: '#3B82F6',
  accentLight: '#93C5FD',
  gradient: ['#2563EB', '#6366F1'] as const,

  text: {
    primary: '#F4F1EA',
    secondary: 'rgba(168, 164, 156, 0.72)',
    muted: 'rgba(168, 164, 156, 0.52)',
    faint: 'rgba(168, 164, 156, 0.38)',
  },

  glass: {
    fill: 'rgba(17, 24, 39, 0.38)',
    fillWeb: 'rgba(17, 24, 39, 0.72)',
    fillStrong: 'rgba(11, 17, 32, 0.42)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(165, 180, 252, 0.22)',
    blur: 48,
    blurStrong: 72,
  },

  surface: {
    card: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(165, 180, 252, 0.22)',
    cardBorderSubtle: 'rgba(255, 255, 255, 0.10)',
    icon: 'rgba(99, 102, 241, 0.14)',
    divider: 'rgba(255, 255, 255, 0.07)',
  },

  radius: {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 26,
    pill: 999,
  },

  spacing: {
    section: 28,
    stack: 14,
    grid: 12,
  },
} as const;
