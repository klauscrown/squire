import { ActivityIndicator, Platform, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { grimoire } from '@/theme/grimoire';
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
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.solid,
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
        <AuthText style={[styles.label, isOutline && styles.outlineLabel]}>{title}</AuthText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 56,
    borderRadius: grimoire.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  solid: {
    backgroundColor: grimoire.colors.gold,
    ...grimoire.elevation.goldGlow,
  },
  outline: {
    backgroundColor: grimoire.colors.glass,
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
  },
  label: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: grimoire.colors.purpleDeep,
  },
  outlineLabel: {
    color: grimoire.colors.ivory,
    fontFamily: fontFamily.inter.medium,
    letterSpacing: 1,
    textTransform: 'none',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.55,
  },
});
