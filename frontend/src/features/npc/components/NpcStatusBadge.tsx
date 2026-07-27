import { StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '@/theme/typography';

import { STATUS_LABELS, type NpcStatus } from '../types';

const DOT_COLORS: Record<NpcStatus, string> = {
  alive: '#2DFF2D',
  dead: '#6A6A6A',
  missing: '#7B5EA7',
};

const BADGE_BG: Record<NpcStatus, string> = {
  alive: 'rgba(45, 255, 45, 0.1)',
  dead: 'rgba(106, 106, 106, 0.12)',
  missing: 'rgba(123, 94, 167, 0.14)',
};

const BADGE_BORDER: Record<NpcStatus, string> = {
  alive: 'rgba(45, 255, 45, 0.35)',
  dead: 'rgba(255, 255, 255, 0.12)',
  missing: 'rgba(123, 94, 167, 0.4)',
};

const LABEL_COLORS: Record<NpcStatus, string> = {
  alive: '#7DFF7D',
  dead: '#A6A6A6',
  missing: '#B8A0D4',
};

interface NpcStatusBadgeProps {
  status: NpcStatus;
}

export function NpcStatusBadge({ status }: NpcStatusBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: BADGE_BG[status],
          borderColor: BADGE_BORDER[status],
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: DOT_COLORS[status] }]} />
      <Text style={[styles.label, { color: LABEL_COLORS[status] }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
