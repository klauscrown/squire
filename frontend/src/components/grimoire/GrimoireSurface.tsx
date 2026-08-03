import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useGrimoire } from '@/hooks/useTheme';

/** Alinhado ao CampaignCard (damping 16 / stiffness 280). */
const PRESS_SPRING = { damping: 16, stiffness: 280 };
const PRESSED_SCALE = 0.97;

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
  borderRadius,
  onPress,
  accentLeft = false,
}: GrimoireSurfaceProps) {
  const grimoire = useGrimoire();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resolvedRadius = borderRadius ?? grimoire.radius.lg;
  const borderColor = gold ? grimoire.colors.glassGoldBorder : grimoire.colors.glassBorder;
  const backgroundColor = gold ? grimoire.colors.glassGold : grimoire.colors.glass;

  const surfaceStyle = [
    styles.base,
    {
      borderColor,
      borderRadius: resolvedRadius,
      borderLeftWidth: accentLeft ? 2 : 1,
      borderLeftColor: accentLeft ? `${grimoire.colors.gold}66` : borderColor,
    },
    style,
  ];

  const body = (
    <>
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
    </>
  );

  if (!onPress) {
    return <View style={surfaceStyle}>{body}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(PRESSED_SCALE, PRESS_SPRING);
        if (Platform.OS !== 'web') {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      onPressOut={() => {
        scale.value = withSpring(1, PRESS_SPRING);
      }}
    >
      <Animated.View style={[surfaceStyle, animatedStyle]}>{body}</Animated.View>
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
