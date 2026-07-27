import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text as RNText,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';
import { cn } from '@/utils/cn';

const GOLD = '#E6C280';
const GOLD_PRESSED = '#D4B06A';
const DARK_TEXT = '#2A2A2A';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'hud';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  style,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  const variantStyles = getVariantStyles(variant, theme);
  const sizeStyles = getSizeStyles(size, theme);
  const isHud = variant === 'hud';

  return (
    <Pressable
      disabled={disabled || loading}
      className={cn('items-center justify-center', className)}
      style={({ pressed }) => [
        variantStyles.container,
        sizeStyles,
        { borderRadius: isHud ? 8 : 12 },
        pressed && variantStyles.pressed,
        (disabled || loading) && { opacity: 0.5 },
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <RNText
          style={{
            color: variantStyles.textColor,
            fontFamily: fontFamily.manrope.bold,
            fontSize: isHud ? 14 : 15,
            fontWeight: '700',
            letterSpacing: isHud ? 1 : 0.3,
            textTransform: isHud ? 'uppercase' : 'none',
          }}
        >
          {title}
        </RNText>
      )}
    </Pressable>
  );
}

type VariantStyle = {
  container: ViewStyle;
  pressed: ViewStyle;
  textColor: string;
};

function getVariantStyles(
  variant: ButtonVariant,
  theme: ReturnType<typeof useTheme>,
): VariantStyle {
  const styles: Record<ButtonVariant, VariantStyle> = {
    primary: {
      container: { backgroundColor: GOLD },
      pressed: { backgroundColor: GOLD_PRESSED, transform: [{ scale: 0.98 }] },
      textColor: DARK_TEXT,
    },
    secondary: {
      container: {
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#262626',
      },
      pressed: { backgroundColor: '#222222', transform: [{ scale: 0.98 }] },
      textColor: '#A6A6A6',
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#262626',
      },
      pressed: { backgroundColor: '#1A1A1A', transform: [{ scale: 0.98 }] },
      textColor: GOLD,
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      pressed: { backgroundColor: '#1A1A1A', transform: [{ scale: 0.98 }] },
      textColor: GOLD,
    },
    hud: {
      container: {
        backgroundColor: '#0D0D0D',
        borderWidth: 1,
        borderColor: GOLD,
        alignSelf: 'stretch',
      },
      pressed: {
        backgroundColor: '#161616',
        borderColor: GOLD_PRESSED,
        transform: [{ scale: 0.98 }],
      },
      textColor: GOLD,
    },
  };

  return styles[variant];
}

function getSizeStyles(size: ButtonSize, theme: ReturnType<typeof useTheme>): ViewStyle {
  const sizes: Record<ButtonSize, ViewStyle> = {
    sm: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 36,
    },
    md: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm + 6,
      minHeight: 48,
    },
    lg: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      minHeight: 54,
    },
  };

  return sizes[size];
}
