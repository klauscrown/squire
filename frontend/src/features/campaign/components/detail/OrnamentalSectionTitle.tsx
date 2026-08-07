import { StyleSheet, Text, View } from 'react-native';

import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily } from '@/theme/typography';

interface OrnamentalSectionTitleProps {
  title: string;
  /** default = seção; nav = header da tela */
  size?: 'nav' | 'section';
}

/**
 * Título ornamental centrado — linhas + diamante + label dourado.
 */
export function OrnamentalSectionTitle({
  title,
  size = 'section',
}: OrnamentalSectionTitleProps) {
  const palette = useActivePalette();
  const isNav = size === 'nav';
  const line = `${palette.accent}33`;
  const diamond = `${palette.accent}99`;

  return (
    <View style={styles.row} accessibilityRole="header">
      <View style={[styles.line, { backgroundColor: line }]} />
      <View style={[styles.diamond, { backgroundColor: diamond }]} />
      <Text
        style={[
          styles.title,
          {
            color: palette.accent,
            fontSize: isNav ? 11 : 12,
            letterSpacing: isNav ? 2 : 2.2,
          },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View style={[styles.diamond, { backgroundColor: diamond }]} />
      <View style={[styles.line, { backgroundColor: line }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  diamond: {
    width: 4,
    height: 4,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontFamily: fontFamily.cinzel.semibold,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
});
