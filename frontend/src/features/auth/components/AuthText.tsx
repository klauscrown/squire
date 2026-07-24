import {
  Platform,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

/** Texto sem classes Tailwind — evita sobrescrever fontFamily customizada. */
export function AuthText({ style, ...props }: RNTextProps) {
  const baseStyle: TextStyle | undefined =
    Platform.OS === 'android' ? { includeFontPadding: false } : undefined;

  return <RNText style={[baseStyle, style]} {...props} />;
}
