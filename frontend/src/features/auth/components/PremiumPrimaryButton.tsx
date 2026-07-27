import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from './AuthText';

interface PremiumPrimaryButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  loading?: boolean;
  style?: ViewStyle;
  icon?: LucideIcon;
}

export function PremiumPrimaryButton({
  title,
  loading = false,
  disabled,
  style,
  icon: Icon,
  ...props
}: PremiumPrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.wrap,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...props}
    >
      <LinearGradient
        colors={[
          loginTheme.button.gradientStart,
          loginTheme.button.gradientMid,
          loginTheme.button.gradientEnd,
        ]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              {Icon ? (
                <Icon
                  size={loginLayout.button.iconSize}
                  color="#FFFFFF"
                  strokeWidth={2.2}
                />
              ) : null}
              <AuthText style={styles.label}>{title}</AuthText>
            </>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: loginTheme.button.radius,
    overflow: 'hidden',
    shadowColor: loginTheme.button.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginTop: loginLayout.button.marginTop,
  },
  gradient: {
    height: loginTheme.button.height,
    borderRadius: loginTheme.button.radius,
  },
  content: {
    flex: 1,
    height: loginTheme.button.height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  label: {
    fontFamily: loginFonts.button,
    fontSize: loginLayout.button.fontSize,
    lineHeight: 20,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.55,
  },
});
