import { StyleSheet, View } from 'react-native';

import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';

import { AuthText } from '../AuthText';

interface LoginOrnamentDividerProps {
  label: string;
}

export function LoginOrnamentDivider({ label }: LoginOrnamentDividerProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();

  return (
    <View style={styles.row}>
      <View style={[styles.line, { backgroundColor: opacity.border.lilacSubtle }]} />
      <AuthText style={[styles.label, { color: palette.textSecondary }]}>{label}</AuthText>
      <View style={[styles.line, { backgroundColor: opacity.border.lilacSubtle }]} />
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
  },
  label: {
    ...loginTypography.divider,
  },
});
