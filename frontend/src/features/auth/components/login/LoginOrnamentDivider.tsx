import { StyleSheet, View } from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from '../AuthText';

interface LoginOrnamentDividerProps {
  label: string;
}

function Dot() {
  return <View style={styles.dot} />;
}

export function LoginOrnamentDivider({ label }: LoginOrnamentDividerProps) {
  return (
    <View style={styles.row}>
      <View style={styles.lineWrap}>
        <Dot />
        <View style={styles.line} />
      </View>
      <AuthText style={styles.label}>{label}</AuthText>
      <View style={styles.lineWrap}>
        <View style={styles.line} />
        <Dot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 18,
  },
  lineWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(129, 140, 248, 0.22)',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: loginTheme.link,
    opacity: 0.7,
  },
  label: {
    fontFamily: loginFonts.body,
    fontSize: 12,
    color: loginTheme.text.muted,
  },
});
