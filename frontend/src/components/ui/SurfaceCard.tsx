import { type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  View,
  type AccessibilityRole,
  type AccessibilityState,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { usePressScale } from '@/hooks/usePressScale';
import { useComponents } from '@/hooks/useTheme';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { motion } from '@/theme/motion';

export type SurfaceCardVariant = 'elevated' | 'subtle' | 'interactive';
export type SurfaceCardRadius = 'sm' | 'md' | 'lg' | number;
export type SurfaceCardPadding = 'none' | 'sm' | 'md' | 'lg' | number;

export interface SurfaceCardProps {
  children: ReactNode;
  /**
   * elevated — protagonista, sombra controlada  
   * subtle — apoio, quase plana  
   * interactive — toque com pressed (padrão se `onPress` existir)
   */
  variant?: SurfaceCardVariant;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radius?: SurfaceCardRadius;
  padding?: SurfaceCardPadding;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  /** Sombra: elevated liga por padrão; subtle/interactive desligadas por padrão. */
  shadow?: boolean;
}

function resolveRadius(
  defaultRadius: number,
  map: { sm: number; md: number; lg: number },
  value: SurfaceCardRadius | undefined,
): number {
  if (value == null) return defaultRadius;
  if (typeof value === 'number') return value;
  return map[value];
}

function resolvePadding(
  map: { sm: number; md: number; lg: number },
  value: SurfaceCardPadding | undefined,
): number {
  if (value == null || value === 'md') return map.md;
  if (value === 'none') return 0;
  if (typeof value === 'number') return value;
  return map[value];
}

/**
 * Superfície de card reutilizável — navy translúcido, borda 1px, sem blur/glass.
 * Consome tokens de `useComponents().surfaceCard` (reage ao tema).
 * Pressed: escala 0.98 via Reanimated (sem animação permanente).
 */
export function SurfaceCard({
  children,
  variant: variantProp,
  onPress,
  disabled = false,
  style,
  contentStyle,
  radius,
  padding = 'md',
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  shadow,
}: SurfaceCardProps) {
  const components = useComponents();
  const tokens = components.surfaceCard;
  const variant: SurfaceCardVariant = variantProp ?? (onPress ? 'interactive' : 'subtle');
  const config = tokens.variants[variant];
  const resolvedRadius = resolveRadius(tokens.radius.md, tokens.radius, radius);
  const resolvedPadding = resolvePadding(tokens.padding, padding);
  const useShadow = shadow ?? variant === 'elevated';
  const interactive = tokens.variants.interactive;
  const pressScale = interactive.pressedScale ?? motion.press.scale;
  const { animatedStyle, setPressed } = usePressScale(pressScale);

  const shadowStyle = useShadow
    ? Platform.select({
        ios: {
          shadowColor: config.shadow.color,
          shadowOpacity: config.shadow.opacity,
          shadowRadius: config.shadow.radius,
          shadowOffset: { width: 0, height: config.shadow.offsetY },
        },
        android: {
          elevation: config.shadow.elevation,
        },
        default: {},
      })
    : undefined;

  const baseStyle: ViewStyle = {
    borderRadius: resolvedRadius,
    borderWidth: tokens.borderWidth,
    borderColor: config.border,
    backgroundColor: config.background,
    overflow: 'hidden',
    ...shadowStyle,
  };

  const content = <View style={[{ padding: resolvedPadding }, contentStyle]}>{children}</View>;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole={accessibilityRole ?? 'button'}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ ...accessibilityState, disabled }}
        style={[{ minHeight: MIN_TOUCH_TARGET }, style]}
      >
        {({ pressed }) => (
          <Animated.View
            style={[
              baseStyle,
              {
                minHeight: MIN_TOUCH_TARGET,
                backgroundColor: pressed ? interactive.pressedBackground : config.background,
                borderColor: pressed ? interactive.pressedBorder : config.border,
                opacity: pressed ? interactive.pressedOpacity : disabled ? 0.55 : 1,
              },
              animatedStyle,
            ]}
          >
            {content}
          </Animated.View>
        )}
      </Pressable>
    );
  }

  return (
    <View
      style={[baseStyle, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
    >
      {content}
    </View>
  );
}

/** Tokens de superfície para composição custom. */
export function useSurfaceCardTokens() {
  return useComponents().surfaceCard;
}
