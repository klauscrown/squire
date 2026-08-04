import { type ReactNode, useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/theme/motion';

interface GrimoireFadeInProps {
  children: ReactNode;
  /** Atraso em ms antes da entrada (stagger). */
  delay?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Deslocamento vertical inicial em px.
   * @default motion.enter.translateY (8)
   */
  translateY?: number;
  /**
   * Duração da entrada em ms (180–320 recomendado).
   * @default motion.enter.durationMs (240)
   */
  durationMs?: number;
}

const ENTER_EASE = Easing.out(Easing.cubic);

/**
 * Entrada discreta: fade + translateY curto.
 * Respeita reduce motion (mostra o estado final sem animar).
 */
export function GrimoireFadeIn({
  children,
  delay = 0,
  style,
  translateY = motion.enter.translateY,
  durationMs = motion.enter.durationMs,
}: GrimoireFadeInProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const offsetY = useSharedValue(reduceMotion ? 0 : translateY);

  useEffect(() => {
    if (reduceMotion) {
      // SharedValue do Reanimated é mutável por design.
      // eslint-disable-next-line react-hooks/immutability
      opacity.value = 1;
      // eslint-disable-next-line react-hooks/immutability
      offsetY.value = 0;
      return;
    }

    const config = { duration: durationMs, easing: ENTER_EASE };
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withDelay(delay, withTiming(1, config));
    // eslint-disable-next-line react-hooks/immutability
    offsetY.value = withDelay(delay, withTiming(0, config));
  }, [delay, durationMs, offsetY, opacity, reduceMotion, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: offsetY.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
