import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from '../AuthText';

interface LoginSocialButtonProps {
  label: string;
  icon: ReactNode;
  onPress?: () => void;
}

export function LoginSocialButton({ label, icon, onPress }: LoginSocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <AuthText style={styles.label}>{label}</AuthText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: loginTheme.social.height,
    borderRadius: loginTheme.social.radius,
    borderWidth: 1,
    borderColor: loginTheme.social.border,
    backgroundColor: loginTheme.social.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.88,
  },
  iconWrap: {
    width: 22,
    alignItems: 'center',
  },
  label: {
    fontFamily: loginFonts.bodyMedium,
    fontSize: 14,
    color: loginTheme.text.title,
  },
});
