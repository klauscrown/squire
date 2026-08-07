import type { LucideIcon } from 'lucide-react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Platform, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginSpacing } from '@/features/auth/constants/loginTheme';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { useComponents, useGrimoire } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';

import { AuthText } from '../AuthText';

interface LoginAuthFieldProps extends TextInputProps {
  icon: LucideIcon;
  error?: string;
  secureToggle?: boolean;
}

/** Campo de auth no material `surfaceCard` da Home (borda ouro, fill navy). */
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
  const palette = useActivePalette();
  const grimoire = useGrimoire();
  const surface = useComponents().surfaceCard;
  const elevated = surface.variants.elevated;
  const interactive = surface.variants.interactive;
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  const borderColor = error
    ? '#EF4444'
    : focused
      ? interactive.pressedBorder
      : elevated.border;

  const height = loginLayout.field.height;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.field,
          {
            height,
            borderRadius: surface.radius.md,
            borderWidth: surface.borderWidth,
            borderColor,
            backgroundColor: elevated.background,
          },
        ]}
      >
        <View style={styles.leadingIcon}>
          <Icon size={18} color={palette.accent} strokeWidth={1.6} />
        </View>

        <TextInput
          {...props}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          placeholderTextColor={grimoire.colors.placeholder}
          style={[
            styles.input,
            {
              height,
              color: palette.textPrimary,
            },
            style,
          ]}
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
            style={[styles.trailingButton, { height }]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
          >
            {hidden ? (
              <Eye size={18} color={palette.textSecondary} strokeWidth={1.5} />
            ) : (
              <EyeOff size={18} color={palette.textSecondary} strokeWidth={1.5} />
            )}
          </Pressable>
        ) : null}
      </View>

      {error ? <AuthText style={styles.error}>{error}</AuthText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: loginSpacing.fieldGap,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadingIcon: {
    width: loginLayout.field.iconSlot,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    ...loginTypography.field,
    paddingRight: 12,
    paddingVertical: 0,
    ...(Platform.OS === 'android'
      ? { includeFontPadding: false, textAlignVertical: 'center' as const }
      : null),
  },
  trailingButton: {
    width: loginLayout.field.iconSlot,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    ...loginTypography.fieldError,
    marginTop: 6,
    marginLeft: 4,
  },
});
