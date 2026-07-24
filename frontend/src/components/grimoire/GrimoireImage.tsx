import { Image, type ImageProps } from 'expo-image';
import { StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

interface GrimoireImageProps extends Omit<ImageProps, 'style'> {
  style?: StyleProp<ImageStyle>;
}

export function GrimoireImage({
  style,
  contentFit = 'cover',
  transition = 250,
  cachePolicy = 'memory-disk',
  ...props
}: GrimoireImageProps) {
  return (
    <Image
      {...props}
      contentFit={contentFit}
      transition={transition}
      cachePolicy={cachePolicy}
      style={[styles.base, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: '100%',
  },
});
