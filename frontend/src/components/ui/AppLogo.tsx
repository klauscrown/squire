import { Image, type ImageStyle, View, type ViewStyle } from 'react-native';

import { logoImage } from '@/assets';
import { useTheme } from '@/hooks/useTheme';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

const SIZES = {
  sm: 40,
  md: 64,
  lg: 96,
} as const;

export function AppLogo({ size = 'md', style, imageStyle }: AppLogoProps) {
  const theme = useTheme();
  const dim = SIZES[size];

  return (
    <View
      style={[
        {
          width: dim,
          height: dim,
          borderRadius: theme.radius.xl,
          overflow: 'hidden',
          ...theme.elevation.md,
        },
        style,
      ]}
    >
      <Image
        source={logoImage}
        style={[{ width: dim, height: dim }, imageStyle]}
        resizeMode="cover"
        accessibilityLabel="Squire"
      />
    </View>
  );
}
