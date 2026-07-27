import { StyleSheet, View } from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from '../AuthText';

interface LoginOrnamentDividerProps {
  label: string;
}

export function LoginOrnamentDivider({ label }: LoginOrnamentDividerProps) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <AuthText style={styles.label}>{label}</AuthText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: loginLayout.divider.gap,
    marginVertical: loginLayout.divider.marginVertical,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  label: {
    fontFamily: loginFonts.body,
    fontSize: loginLayout.divider.fontSize,
    letterSpacing: 0.2,
    color: loginTheme.text.subtitle,
  },
});
