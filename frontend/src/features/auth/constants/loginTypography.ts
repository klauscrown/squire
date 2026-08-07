import { Platform, type TextStyle } from 'react-native';

import { typeRoles } from '@/theme/typography';

import { loginFonts } from './loginFonts';

const androidText: TextStyle = Platform.OS === 'android' ? { includeFontPadding: false } : {};

/**
 * Papéis tipográficos da auth — derivados de `typeRoles`.
 * Cores vêm da paleta ativa nos componentes (como na Home).
 */
export const loginTypography = {
  brand: {
    ...androidText,
    fontFamily: loginFonts.display,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 6,
  },
  brandTagline: {
    ...androidText,
    ...typeRoles.badge,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  welcome: {
    ...androidText,
    ...typeRoles.title,
    textAlign: 'center',
  },
  welcomeSupport: {
    ...androidText,
    ...typeRoles.editorialSm,
    textAlign: 'center',
  },
  title: {
    ...androidText,
    fontFamily: loginFonts.display,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  heading: {
    ...androidText,
    ...typeRoles.display,
    textAlign: 'center',
  },
  subtitle: {
    ...androidText,
    ...typeRoles.editorial,
    textAlign: 'center',
    opacity: 0.94,
    maxWidth: 300,
  },
  noticeLabel: {
    ...androidText,
    ...typeRoles.badge,
    textTransform: 'uppercase',
  },
  noticeBody: {
    ...androidText,
    ...typeRoles.body,
  },
  field: {
    ...androidText,
    ...typeRoles.body,
    fontSize: 15,
    lineHeight: 22,
  },
  fieldError: {
    ...androidText,
    ...typeRoles.caption,
    color: '#EF4444',
  },
  buttonLabel: {
    ...androidText,
    ...typeRoles.button,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  link: {
    ...androidText,
    ...typeRoles.label,
  },
  linkEmphasized: {
    ...androidText,
    ...typeRoles.buttonSm,
  },
  divider: {
    ...androidText,
    ...typeRoles.caption,
  },
  socialLabel: {
    ...androidText,
    ...typeRoles.label,
  },
  registerTitle: {
    ...androidText,
    ...typeRoles.label,
    fontFamily: loginFonts.bodySemibold,
    textAlign: 'center',
  },
  registerSubtitle: {
    ...androidText,
    ...typeRoles.caption,
    textAlign: 'center',
  },
  explorer: {
    ...androidText,
    ...typeRoles.caption,
  },
  outlineButton: {
    ...androidText,
    ...typeRoles.buttonSm,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
} as const satisfies Record<string, TextStyle>;
