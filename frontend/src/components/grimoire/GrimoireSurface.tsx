import { BlurView } from 'expo-blur';
import { type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { grimoire } from '@/theme/grimoire';

interface GrimoireSurfaceProps {
  children: ReactNode;
  gold?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: ViewStyle;
  padding?: number;
  borderRadius?: number;
  onPress?: () => void;
  accentLeft?: boolean;
}

export function GrimoireSurface({
  children,
  gold = false,
  style,
  contentStyle,
  padding = 16,
  borderRadius = grimoire.radius.lg,
  onPress,
  accentLeft = false,
}: GrimoireSurfaceProps) {
  const borderColor = gold ? grimoire.colors.glassGoldBorder : grimoire.colors.glassBorder;
  const backgroundColor = gold ? grimoire.colors.glassGold : grimoire.colors.glass;

  const surface = (
    <View
      style={[
        styles.base,
        {
          borderColor,
          borderRadius,
          borderLeftWidth: accentLeft ? 2 : 1,
          borderLeftColor: accentLeft ? `${grimoire.colors.gold}66` : borderColor,
        },
        style,
      ]}
    >
      {Platform.OS !== 'web' ? (
        <BlurView
          intensity={grimoire.blur.card}
          tint="dark"
          style={[StyleSheet.absoluteFill, { backgroundColor }]}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />
      )}
      <View style={[styles.content, { padding }, contentStyle]}>{children}</View>
    </View>
  );

  if (!onPress) return surface;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}>
      {surface}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
  },
});
