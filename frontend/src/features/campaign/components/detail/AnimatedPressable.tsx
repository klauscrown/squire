import { type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  durationMs?: number;
}

export function AnimatedPressable({
  children,
  style,
  scaleTo = 0.97,
  durationMs = 200,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressableBase
      {...props}
      disabled={disabled}
      style={[style, animatedStyle, disabled ? { opacity: 0.5 } : undefined]}
      onPressIn={(event) => {
        if (!disabled) {
          scale.value = withTiming(scaleTo, { duration: durationMs });
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withTiming(1, { duration: durationMs });
        onPressOut?.(event);
      }}
    >
      {children}
    </AnimatedPressableBase>
  );
}
