import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercent?: boolean;
}

export function ProgressBar({ progress, label, showPercent = true }: ProgressBarProps) {
  const grimoire = useGrimoire();
  const clamped = Math.max(0, Math.min(1, progress));
  const percent = Math.round(clamped * 100);

  return (
    <View>
      {(label || showPercent) && (
        <View style={styles.header}>
          {label ? (
            <Text style={[styles.label, { color: `${grimoire.colors.ivoryDim}99` }]}>{label}</Text>
          ) : (
            <View />
          )}
          {showPercent ? (
            <Text style={[styles.percent, { color: grimoire.colors.gold }]}>{percent}%</Text>
          ) : null}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: grimoire.colors.glass }]}>
        <LinearGradient
          colors={[`${grimoire.colors.gold}80`, grimoire.colors.gold]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.fill, { width: `${percent}%` }, grimoire.elevation.goldSoft]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  percent: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  track: {
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
