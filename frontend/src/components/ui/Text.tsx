import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  muted?: boolean;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-semibold',
  body: 'text-base',
  caption: 'text-sm',
  label: 'text-sm font-medium',
};

export function Text({ variant = 'body', muted = false, className, style, ...props }: TextProps) {
  const theme = useTheme();

  const textStyle: TextStyle = {
    color: muted ? theme.colors.muted : theme.colors.foreground,
    fontSize: getFontSize(variant, theme),
  };

  return (
    <RNText
      className={cn(variantStyles[variant], className)}
      style={[textStyle, style]}
      {...props}
    />
  );
}

function getFontSize(variant: TextVariant, theme: ReturnType<typeof useTheme>): number {
  const sizeMap: Record<TextVariant, keyof typeof theme.typography.fontSize> = {
    h1: '3xl',
    h2: '2xl',
    h3: 'xl',
    body: 'md',
    caption: 'sm',
    label: 'sm',
  };

  return theme.typography.fontSize[sizeMap[variant]];
}
