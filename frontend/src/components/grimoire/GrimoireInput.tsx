import { BlurView } from 'expo-blur';
import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

interface GrimoireInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function GrimoireInput({
  label,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: GrimoireInputProps) {
  const grimoire = useGrimoire();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? grimoire.colors.destructive
    : focused
      ? grimoire.colors.inputBorderFocus
      : grimoire.colors.inputBorder;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text
          style={[
            styles.label,
            {
              fontSize: grimoire.typography.label.fontSize,
              letterSpacing: grimoire.typography.label.letterSpacing,
              color: grimoire.colors.goldMuted,
            },
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputWrap,
          {
            borderColor,
            borderRadius: grimoire.radius.lg,
            backgroundColor: Platform.OS === 'web' ? grimoire.colors.inputBg : 'transparent',
          },
        ]}
      >
        {Platform.OS !== 'web' ? (
          <BlurView intensity={grimoire.blur.input} tint="dark" style={StyleSheet.absoluteFill} />
        ) : null}

        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: grimoire.colors.inputBg }]}
          pointerEvents="none"
        />

        <TextInput
          {...props}
          placeholderTextColor={grimoire.colors.placeholder}
          style={[
            styles.input,
            {
              fontSize: grimoire.typography.input.fontSize,
              lineHeight: grimoire.typography.input.lineHeight,
              color: grimoire.colors.ivory,
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
      </View>

      {error ? (
        <Text style={[styles.error, { color: grimoire.colors.destructive }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputWrap: {
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 52,
    justifyContent: 'center',
  },
  input: {
    fontFamily: fontFamily.inter.regular,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
  },
  error: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    marginTop: 6,
  },
});
