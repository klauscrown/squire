/** Tipografia da tela de login — serif no logo, sans no UI (como o mockup). */
export const loginFonts = {
  display: 'Cinzel_700Bold',
  displayMedium: 'Cinzel_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  label: 'Inter_500Medium',
  button: 'Inter_600SemiBold',
  accent: 'Inter_500Medium',
} as const;

export type LoginFontKey = keyof typeof loginFonts;
