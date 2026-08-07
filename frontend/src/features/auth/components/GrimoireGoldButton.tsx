import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { loginTypography } from '@/features/auth/constants/loginTypography';
import { usePressScale } from '@/hooks/usePressScale';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { motion } from '@/theme/motion';

import { AuthText } from './AuthText';

interface GrimoireGoldButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
}

/** CTA dourado alinhado ao `components.cta` da Home. */
export function GrimoireGoldButton({
  title,
  onPress,
  loading = false,
  disabled,
  variant = 'solid',
  style,
}: GrimoireGoldButtonProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const cta = components.cta;
  const surface = components.surfaceCard;
  const interactive = surface.variants.interactive;
  const isOutline = variant === 'outline';
  const inactive = Boolean(disabled || loading);
  const { animatedStyle, setPressed } = usePressScale(motion.press.scale);

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.wrap, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            styles.base,
            {
              borderRadius: isOutline ? surface.radius.md : cta.radius,
              minHeight: MIN_TOUCH_TARGET,
              opacity: inactive ? 0.5 : pressed ? cta.pressedOpacity : 1,
              ...(isOutline
                ? {
                    backgroundColor: pressed
                      ? interactive.pressedBackground
                      : interactive.background,
                    borderWidth: surface.borderWidth,
                    borderColor: pressed ? interactive.pressedBorder : interactive.border,
                  }
                : {
                    backgroundColor: palette.buttonPrimary,
                    ...Platform.select({
                      ios: {
                        shadowColor: palette.buttonPrimary,
                        shadowOffset: { width: 0, height: cta.shadow.offsetY },
                        shadowOpacity: cta.shadow.opacity,
                        shadowRadius: cta.shadow.radius,
                      },
                      android: { elevation: cta.shadow.elevation },
                      default: {},
                    }),
                  }),
            },
            animatedStyle,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={isOutline ? palette.accent : cta.foreground} />
          ) : (
            <AuthText
              style={[
                styles.label,
                { color: isOutline ? palette.textPrimary : cta.foreground },
              ]}
            >
              {title}
            </AuthText>
          )}
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: 12,
  },
  base: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    overflow: 'hidden',
  },
  label: {
    ...loginTypography.buttonLabel,
  },
});
