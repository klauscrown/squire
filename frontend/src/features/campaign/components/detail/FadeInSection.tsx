import { type ReactNode, useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface FadeInSectionProps {
  children: ReactNode;
  delayMs?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeInSection({ children, delayMs = 0, style }: FadeInSectionProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(delayMs, withTiming(1, { duration: 220 }));
    translateY.value = withDelay(delayMs, withTiming(0, { duration: 220 }));
  }, [delayMs, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ width: '100%', alignSelf: 'stretch' }, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
