import type { LucideIcon } from 'lucide-react-native';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  type PressableProps,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { usePressScale } from '@/hooks/usePressScale';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { motion } from '@/theme/motion';

import { AuthText } from './AuthText';

interface PremiumPrimaryButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  loading?: boolean;
  style?: ViewStyle;
  icon?: LucideIcon;
}

/**
 * CTA principal da auth — ouro sólido + glow, mesmo idioma do botão "Começar" da Home.
 */
export function PremiumPrimaryButton({
  title,
  loading = false,
  disabled,
  style,
  icon: Icon,
  ...props
}: PremiumPrimaryButtonProps) {
  const palette = useActivePalette();
  const cta = useComponents().cta;
  const inactive = Boolean(disabled || loading);
  const { animatedStyle, setPressed } = usePressScale(motion.press.scale);

  return (
    <Pressable
      disabled={inactive}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.wrap, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      {...props}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            styles.shell,
            {
              borderRadius: cta.radius,
              backgroundColor: palette.buttonPrimary,
              minHeight: MIN_TOUCH_TARGET,
              opacity: inactive ? 0.55 : pressed ? cta.pressedOpacity : 1,
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
            },
            animatedStyle,
          ]}
        >
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator color={cta.foreground} />
            ) : (
              <>
                {Icon ? (
                  <Icon
                    size={loginLayout.button.iconSize}
                    color={cta.foreground}
                    strokeWidth={2.2}
                  />
                ) : null}
                <AuthText style={[styles.label, { color: cta.foreground }]}>{title}</AuthText>
              </>
            )}
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginTop: loginLayout.button.marginTop,
  },
  shell: {
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    minHeight: MIN_TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  label: {
    ...loginTypography.buttonLabel,
  },
});
