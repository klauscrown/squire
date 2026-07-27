import { Platform, type TextStyle } from 'react-native';

import { loginFonts } from './loginFonts';
import { loginTheme } from './loginTheme';

const androidText: TextStyle = Platform.OS === 'android' ? { includeFontPadding: false } : {};

export const loginTypography = {
  title: {
    ...androidText,
    color: loginTheme.text.title,
    fontFamily: loginFonts.display,
    fontSize: 38,
    lineHeight: Math.round(38 * 1.2),
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  heading: {
    ...androidText,
    color: loginTheme.text.title,
    fontFamily: loginFonts.display,
    fontSize: 32,
    lineHeight: Math.round(32 * 1.2),
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  subtitle: {
    ...androidText,
    color: loginTheme.text.subtitle,
    fontFamily: loginFonts.body,
    fontSize: 18,
    lineHeight: Math.round(18 * 1.5),
    letterSpacing: 0.2,
    textAlign: 'center',
    opacity: 0.94,
    maxWidth: 300,
  },
  noticeLabel: {
    ...androidText,
    color: loginTheme.gold,
    fontFamily: loginFonts.label,
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  noticeBody: {
    ...androidText,
    color: loginTheme.text.body,
    fontFamily: loginFonts.body,
    fontSize: 16,
    lineHeight: Math.round(16 * 1.5),
    letterSpacing: 0.2,
    opacity: 0.96,
  },
  buttonLabel: {
    ...androidText,
    color: '#FFFFFF',
    fontFamily: loginFonts.button,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  link: {
    ...androidText,
    color: loginTheme.gold,
    fontFamily: loginFonts.accent,
    fontSize: 16,
    letterSpacing: 0.2,
    opacity: 0.94,
  },
  outlineButton: {
    ...androidText,
    color: loginTheme.text.subtitle,
    fontFamily: loginFonts.button,
    fontSize: 14,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, TextStyle>;
