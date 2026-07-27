import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { grimoireImages } from '@/assets/grimoire';
import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';
import { GrimoireImage } from '@/components/grimoire/GrimoireImage';
import { grimoire } from '@/theme/grimoire';
import { premium } from '@/theme/premium';

const FAB_SIZE = 72;
const MASCOT_SIZE = 58;

interface SquireMascotFabProps {
  onPress: () => void;
}

export function SquireMascotFab({ onPress }: SquireMascotFabProps) {
  const insets = useSafeAreaInsets();
  const bottom = CURVED_TAB_BAR_FOOTPRINT + Math.max(insets.bottom, 8) - 2;

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }

  return (
    <View style={[styles.container, { bottom }]} pointerEvents="box-none">
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Escudeiro — abrir conselho"
        hitSlop={4}
      >
        <View style={styles.ring}>
          <GrimoireImage
            source={grimoireImages.mascot}
            style={styles.mascot}
            contentFit="contain"
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: grimoire.spacing.screen,
    zIndex: 10,
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
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 12, 28, 0.96)',
    borderWidth: 1.5,
    borderColor: premium.glass.borderStrong,
    ...Platform.select({
      ios: {
        shadowColor: grimoire.colors.gold,
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
  mascot: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    borderRadius: MASCOT_SIZE / 2,
  },
});
