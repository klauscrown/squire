import { type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { usePressScale } from '@/hooks/usePressScale';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { motion } from '@/theme/motion';

import { AuthText } from '../AuthText';

interface LoginSocialButtonProps {
  label: string;
  icon: ReactNode;
  onPress?: () => void;
}

/** Social = surfaceCard interactive (mesmos cards da Home). */
export function LoginSocialButton({ label, icon, onPress }: LoginSocialButtonProps) {
  const palette = useActivePalette();
  const surface = useComponents().surfaceCard;
  const interactive = surface.variants.interactive;
  const disabled = !onPress;
  const { animatedStyle, setPressed } = usePressScale(interactive.pressedScale ?? motion.press.scale);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) setPressed(true);
      }}
      onPressOut={() => setPressed(false)}
      style={styles.flex}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            styles.button,
            {
              height: loginLayout.social.height,
              borderRadius: surface.radius.md,
              borderWidth: surface.borderWidth,
              borderColor: pressed && !disabled ? interactive.pressedBorder : interactive.border,
              backgroundColor:
                pressed && !disabled ? interactive.pressedBackground : interactive.background,
              opacity: disabled ? 0.45 : pressed ? interactive.pressedOpacity : 1,
              ...Platform.select({
                ios: {
                  shadowColor: interactive.shadow.color,
                  shadowOffset: { width: 0, height: interactive.shadow.offsetY },
                  shadowOpacity: interactive.shadow.opacity,
                  shadowRadius: interactive.shadow.radius,
                },
                android: { elevation: interactive.shadow.elevation },
                default: {},
              }),
            },
            animatedStyle,
          ]}
        >
          <View style={styles.content}>
            <View
              style={[
                styles.iconBadge,
                {
                  width: loginLayout.social.iconBadge,
                  height: loginLayout.social.iconBadge,
                  borderRadius: loginLayout.social.iconRadius,
                  borderColor: interactive.border,
                  backgroundColor: interactive.background,
                },
              ]}
            >
              {icon}
            </View>
            <AuthText
              style={[
                styles.label,
                { color: disabled ? palette.textSecondary : palette.textPrimary },
              ]}
            >
              {label}
            </AuthText>
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  button: {
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingVertical: loginLayout.social.paddingVertical,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: loginLayout.social.iconToLabel,
  },
  label: {
    ...loginTypography.socialLabel,
    textAlign: 'center',
  },
});
