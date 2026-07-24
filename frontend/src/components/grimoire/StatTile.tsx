import { StyleSheet, Text, View } from 'react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

import { GlassCard } from './GlassCard';

type StatTileVariant = 'default' | 'softGlass';

interface StatTileProps {
  label: string;
  value: string | number;
  variant?: StatTileVariant;
}

export function StatTile({ label, value, variant = 'default' }: StatTileProps) {
  if (variant === 'softGlass') {
    const isZero = String(value) === '0' || String(value) === '00';
    return (
      <View style={styles.softTile}>
        <Text style={styles.softLabel}>{label}</Text>
        <Text style={[styles.softValue, isZero && styles.softValueMuted]}>{value}</Text>
      </View>
    );
  }

  return (
    <GlassCard style={styles.tile}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: grimoire.radius.lg,
    ...grimoire.elevation.goldSoft,
  },
  softTile: {
    flex: 1,
    minHeight: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(22, 20, 27, 0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: `${grimoire.colors.ivoryDim}99`,
  },
  softLabel: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 11,
    letterSpacing: 0.4,
    color: 'rgba(255, 255, 255, 0.48)',
  },
  value: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 24,
    color: grimoire.colors.goldBright,
    marginTop: 4,
  },
  softValue: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 20,
    fontVariant: ['tabular-nums'],
    color: grimoire.softGlass.gold,
    marginTop: 6,
  },
  softValueMuted: {
    color: 'rgba(230, 194, 128, 0.38)',
  },
});
