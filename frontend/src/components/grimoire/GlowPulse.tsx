import { MotiView } from 'moti';

import { type ViewStyle } from 'react-native';

interface GlowPulseProps {
  color: string;

  size?: number;

  style?: ViewStyle;
}

export function GlowPulse({ color, size = 6, style }: GlowPulseProps) {
  return (
    <MotiView
      from={{ opacity: 0.55, scale: 1 }}

      animate={{ opacity: 1, scale: 1.2 }}

      transition={{
        type: 'timing',

        duration: 2000,

        loop: true,
      }}

      style={[
        {
          width: size,

          height: size,

          borderRadius: size / 2,

          backgroundColor: color,

          shadowColor: color,

          shadowOpacity: 0.85,

          shadowRadius: size,

          shadowOffset: { width: 0, height: 0 },
        },

        style,
      ]}
    />
  );
}
