import type { LucideIcon } from 'lucide-react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Platform, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginSpacing, loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from '../AuthText';

interface LoginAuthFieldProps extends TextInputProps {
  icon: LucideIcon;
  error?: string;
  secureToggle?: boolean;
}

export function LoginAuthField({
  icon: Icon,
  error,
  secureToggle,
  secureTextEntry,
  style,
  onFocus,
  onBlur,
  ...props
}: LoginAuthFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  const borderColor = error
    ? '#ef4444'
    : focused
      ? loginTheme.input.borderFocus
      : loginTheme.input.border;

  return (
    <View style={styles.container}>
      <View style={[styles.field, { borderColor }]}>
        <View style={styles.leadingIcon}>
          <Icon size={18} color={loginTheme.link} strokeWidth={1.5} />
        </View>

        <TextInput
          {...props}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          placeholderTextColor={loginTheme.input.placeholder}
          style={[styles.input, style]}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
        />

        {secureToggle ? (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            style={styles.trailingButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
          >
            {hidden ? (
              <Eye size={18} color={loginTheme.text.muted} strokeWidth={1.5} />
            ) : (
              <EyeOff size={18} color={loginTheme.text.muted} strokeWidth={1.5} />
            )}
          </Pressable>
        ) : null}
      </View>

      {error ? <AuthText style={styles.error}>{error}</AuthText> : null}
    </View>
  );
}

const FIELD_HEIGHT = loginTheme.input.height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: loginSpacing.fieldGap,
  },
  field: {
    height: FIELD_HEIGHT,
    borderRadius: loginTheme.input.radius,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: loginTheme.input.background,
  },
  leadingIcon: {
    width: loginLayout.field.iconSlot,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: FIELD_HEIGHT,
    fontFamily: loginFonts.body,
    fontSize: 15,
    color: loginTheme.text.title,
    paddingRight: 12,
    paddingVertical: 0,
    ...(Platform.OS === 'android'
      ? { includeFontPadding: false, textAlignVertical: 'center' as const }
      : null),
  },
  trailingButton: {
    width: loginLayout.field.iconSlot,
    height: FIELD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontFamily: loginFonts.body,
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    marginLeft: 4,
  },
});
