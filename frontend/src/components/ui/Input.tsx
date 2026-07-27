import { useState } from 'react';
import { Text as RNText, TextInput, type TextInputProps, type TextStyle, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';
import { cn } from '@/utils/cn';

const INPUT_BG = '#1A1A1A';
const INPUT_BORDER = '#2A2A2A';
const INPUT_BORDER_FOCUS = '#E6C280';
const LABEL_COLOR = '#A6A6A6';
const PLACEHOLDER_COLOR = '#4A4A4A';
const TEXT_COLOR = '#E8E8E8';
const ERROR_COLOR = '#EF4444';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  className,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const inputStyle: TextStyle = {
    backgroundColor: INPUT_BG,
    borderColor: error ? ERROR_COLOR : focused ? INPUT_BORDER_FOCUS : INPUT_BORDER,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    color: TEXT_COLOR,
    fontFamily: fontFamily.manrope.regular,
    fontSize: 15,
  };

  return (
    <View className={cn('w-full', containerClassName)}>
      {label ? (
        <RNText
          style={{
            fontFamily: fontFamily.manrope.regular,
            fontSize: 13,
            color: LABEL_COLOR,
            marginBottom: 8,
          }}
        >
          {label}
        </RNText>
      ) : null}
      <TextInput
        placeholderTextColor={PLACEHOLDER_COLOR}
        className={cn('w-full', className)}
        style={[inputStyle, style]}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...props}
      />
      {error ? (
        <RNText
          style={{
            fontFamily: fontFamily.manrope.regular,
            fontSize: 12,
            color: ERROR_COLOR,
            marginTop: 4,
          }}
        >
          {error}
        </RNText>
      ) : null}
    </View>
  );
}
