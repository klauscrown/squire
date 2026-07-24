import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
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
        colors={[loginTheme.button.gradientStart, loginTheme.button.gradientMid, loginTheme.button.gradientEnd]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            {Icon ? <Icon size={15} color="#FFFFFF" strokeWidth={2.2} /> : null}
            <AuthText style={styles.label}>{title}</AuthText>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: loginTheme.button.radius,
    shadowColor: loginTheme.button.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    marginTop: 6,
  },
  gradient: {
    height: loginTheme.button.height,
    borderRadius: loginTheme.button.radius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontFamily: loginFonts.button,
    fontSize: 15,
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
