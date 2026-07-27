import { StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '@/theme/typography';

import { TYPE_LABELS, type LocationType } from '../types';

const STYLES: Record<LocationType, { bg: string; border: string; text: string }> = {
  settlement: {
    bg: 'rgba(230, 194, 128, 0.12)',
    border: 'rgba(230, 194, 128, 0.35)',
    text: '#E6C280',
  },
  dungeon: {
    bg: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.35)',
    text: '#A78BFA',
  },
  wilderness: {
    bg: 'rgba(45, 255, 45, 0.1)',
    border: 'rgba(45, 255, 45, 0.35)',
    text: '#7DFF7D',
  },
  landmark: {
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.35)',
    text: '#38BDF8',
  },
  building: {
    bg: 'rgba(251, 146, 60, 0.12)',
    border: 'rgba(251, 146, 60, 0.35)',
    text: '#FB923C',
  },
  other: {
    bg: 'rgba(166, 166, 166, 0.1)',
    border: 'rgba(255, 255, 255, 0.12)',
    text: '#A6A6A6',
  },
};

interface LocationTypeBadgeProps {
  type: LocationType;
}

export function LocationTypeBadge({ type }: LocationTypeBadgeProps) {
  const tone = STYLES[type];

  return (
    <View style={[styles.badge, { backgroundColor: tone.bg, borderColor: tone.border }]}>
      <Text style={[styles.label, { color: tone.text }]}>{TYPE_LABELS[type]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
