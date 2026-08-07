import { LinearGradient } from 'expo-linear-gradient';
import { Orbit, Plus, type LucideIcon } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

interface UniversePrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  stretch?: boolean;
}

export function UniversePrimaryButton({
  label,
  onPress,
  icon: Icon = Plus,
  stretch = false,
}: UniversePrimaryButtonProps) {
  const components = useComponents();
  const cta = components.cta;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        stretch && styles.stretch,
        pressed && { opacity: cta.pressedOpacity },
      ]}
    >
      <LinearGradient
        colors={[...cta.gradient]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.primaryButton,
          {
            borderRadius: cta.radius,
            ...Platform.select({
              ios: {
                shadowColor: cta.shadow.color,
                shadowOpacity: cta.shadow.opacity,
                shadowRadius: cta.shadow.radius,
                shadowOffset: { width: 0, height: cta.shadow.offsetY },
              },
              android: { elevation: cta.shadow.elevation },
              default: {},
            }),
          },
        ]}
      >
        <Icon size={17} color={cta.foreground} strokeWidth={2.2} />
        <Text style={[styles.primaryLabel, { color: cta.foreground }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

interface UniverseTextActionProps {
  label: string;
  onPress: () => void;
}

export function UniverseTextAction({ label, onPress }: UniverseTextActionProps) {
  const palette = useActivePalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [styles.textAction, pressed && styles.pressed]}
    >
      <Text style={[styles.textActionLabel, { color: palette.accent }]}>{label}</Text>
    </Pressable>
  );
}

interface UniverseSymbolProps {
  size?: number;
  compact?: boolean;
}

export function UniverseSymbol({ size = 96, compact = false }: UniverseSymbolProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();
  const iconSize = compact ? size * 0.45 : size * 0.52;

  return (
    <View
      style={[
        styles.symbol,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: opacity.iconCircle.goldBorder,
          backgroundColor: opacity.iconCircle.blueFill,
        },
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.symbolOrbit,
          {
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: size,
            borderColor: opacity.iconCircle.lilacBorder,
          },
        ]}
      />
      <Orbit size={iconSize} color={palette.primaryLight} strokeWidth={1.25} />
      <View
        style={[
          styles.symbolCore,
          {
            width: size * 0.1,
            height: size * 0.1,
            borderRadius: size,
            backgroundColor: palette.accent,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stretch: {
    alignSelf: 'stretch',
  },
  primaryButton: {
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: 18,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryLabel: {
    ...typeRoles.button,
  },
  textAction: {
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textActionLabel: {
    ...typeRoles.buttonSm,
  },
  pressed: {
    opacity: 0.72,
  },
  symbol: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  symbolOrbit: {
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
    transform: [{ rotate: '-18deg' }],
  },
  symbolCore: {
    position: 'absolute',
  },
});
