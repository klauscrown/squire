import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { grimoireImages } from '@/assets/grimoire';
import { GrimoireImage } from '@/components/grimoire/GrimoireImage';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';

interface SquireMascotFabProps {
  onPress: () => void;
}

export function SquireMascotFab({ onPress }: SquireMascotFabProps) {
  const palette = useActivePalette();
  const fab = useComponents().mascotFab;

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }

  return (
    <View
      style={[styles.container, { width: fab.size, height: fab.size }]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.glowRing,
          {
            width: fab.size + 8,
            height: fab.size + 8,
            borderRadius: (fab.size + 8) / 2,
            backgroundColor: palette.accentSoft,
          },
        ]}
      />
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Escudeiro — abrir conselho"
        hitSlop={8}
      >
        <View
          style={[
            styles.ring,
            {
              width: fab.size,
              height: fab.size,
              borderRadius: fab.size / 2,
              backgroundColor: palette.gradientEnd,
              borderColor: palette.surfaceBorder,
              ...Platform.select({
                ios: {
                  shadowColor: palette.accent,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.28,
                  shadowRadius: 14,
                },
                android: {
                  elevation: 8,
                },
                default: {},
              }),
            },
          ]}
        >
          <GrimoireImage
            source={grimoireImages.mascot}
            style={{
              width: fab.mascotSize,
              height: fab.mascotSize,
              borderRadius: fab.mascotSize / 2,
            }}
            contentFit="contain"
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.94 }],
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
