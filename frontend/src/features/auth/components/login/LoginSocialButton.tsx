import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from '../AuthText';

interface LoginSocialButtonProps {
  label: string;
  icon: ReactNode;
  onPress?: () => void;
}

export function LoginSocialButton({ label, icon, onPress }: LoginSocialButtonProps) {
  const disabled = !onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={
        disabled ? undefined : { color: 'rgba(165, 180, 252, 0.14)', borderless: false }
      }
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <View style={styles.content}>
        <View style={styles.iconBadge}>{icon}</View>
        <AuthText style={[styles.label, disabled ? styles.labelDisabled : null]}>{label}</AuthText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: loginLayout.social.height,
    borderRadius: loginLayout.social.radius,
    borderWidth: 1,
    borderColor: loginTheme.social.border,
    backgroundColor: loginTheme.social.background,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    height: loginLayout.social.height,
    paddingVertical: loginLayout.social.paddingVertical,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.92,
    borderColor: loginTheme.social.borderPressed,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
  iconBadge: {
    width: loginLayout.social.iconBadge,
    height: loginLayout.social.iconBadge,
    borderRadius: loginLayout.social.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: loginLayout.social.iconToLabel,
  },
  label: {
    fontFamily: loginFonts.bodyMedium,
    fontSize: loginLayout.social.labelSize,
    lineHeight: 18,
    color: loginTheme.text.title,
    textAlign: 'center',
  },
  labelDisabled: {
    color: loginTheme.text.subtitle,
  },
});
