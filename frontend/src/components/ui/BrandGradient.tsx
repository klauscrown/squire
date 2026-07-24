import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface BrandGradientProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function BrandGradient({ children, style }: BrandGradientProps) {
  const theme = useTheme();
  const { start, middle, end } = theme.colors.gradient;

  return (
    <LinearGradient
      colors={[start, middle, end]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
