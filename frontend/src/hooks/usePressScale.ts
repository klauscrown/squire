import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/theme/motion';

const PRESS_EASE = Easing.out(Easing.quad);

/**
 * Escala pressed (0.98) com Reanimated; ignora animação se reduce motion estiver ativo.
 */
export function usePressScale(scaleTo = motion.press.scale) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function setPressed(pressed: boolean) {
    const next = pressed ? scaleTo : 1;
    // SharedValue do Reanimated é mutável por design.
    if (reduceMotion) {
      // eslint-disable-next-line react-hooks/immutability
      scale.value = next;
      return;
    }
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withTiming(next, {
      duration: pressed ? motion.press.durationInMs : motion.press.durationOutMs,
      easing: PRESS_EASE,
    });
  }

  return { animatedStyle, setPressed };
}
