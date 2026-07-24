import { StyleSheet, View } from 'react-native';

interface OrnamentalDividerProps {
  marginVertical?: number;
}

export function OrnamentalDivider({ marginVertical = 24 }: OrnamentalDividerProps) {
  return (
    <View style={[styles.container, { marginVertical }]}>
      <View style={styles.line} />
      <View style={styles.diamond} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24 },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(212, 166, 74, 0.15)' },
  diamond: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(212, 166, 74, 0.3)',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 12,
  },
});
