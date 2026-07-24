import type { LucideIcon } from 'lucide-react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
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
      <View
        style={[
          styles.field,
          { borderColor },
          focused && styles.fieldFocused,
        ]}
      >
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
  fieldFocused: {
    shadowColor: '#6366F1',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  leadingIcon: {
    width: 46,
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
  },
  trailingButton: {
    width: 46,
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
