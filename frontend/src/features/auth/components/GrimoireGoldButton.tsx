import { ActivityIndicator, Platform, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import { AuthText } from './AuthText';

interface GrimoireGoldButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
}

export function GrimoireGoldButton({
  title,
  onPress,
  loading = false,
  disabled,
  variant = 'solid',
  style,
}: GrimoireGoldButtonProps) {
  const grimoire = useGrimoire();
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          borderRadius: grimoire.radius.lg,
        },
        isOutline
          ? {
              backgroundColor: grimoire.colors.glass,
              borderWidth: 1,
              borderColor: grimoire.colors.glassGoldBorder,
            }
          : {
              backgroundColor: grimoire.colors.gold,
              ...grimoire.elevation.goldGlow,
            },
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {isOutline && Platform.OS !== 'web' ? (
        <BlurView intensity={grimoire.blur.input} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
      {loading ? (
        <ActivityIndicator color={isOutline ? grimoire.colors.gold : grimoire.colors.purpleDeep} />
      ) : (
        <AuthText
          style={[
            styles.label,
            { color: grimoire.colors.purpleDeep },
            isOutline && { color: grimoire.colors.ivory, fontFamily: fontFamily.inter.medium },
          ]}
        >
          {title}
        </AuthText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  label: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
});
