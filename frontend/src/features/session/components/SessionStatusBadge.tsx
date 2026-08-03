import { StyleSheet, Text, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import { STATUS_LABELS, type SessionStatus } from '../types';

interface SessionStatusBadgeProps {
  status: SessionStatus;
}

export function SessionStatusBadge({ status }: SessionStatusBadgeProps) {
  const grimoire = useGrimoire();

  const tones: Record<SessionStatus, { bg: string; border: string; text: string }> = {
    planned: {
      bg: grimoire.colors.glassGold,
      border: grimoire.colors.glassGoldBorder,
      text: grimoire.colors.gold,
    },
    completed: {
      bg: `${grimoire.colors.success}18`,
      border: `${grimoire.colors.success}55`,
      text: grimoire.colors.success,
    },
    cancelled: {
      bg: `${grimoire.colors.ivoryDim}14`,
      border: `${grimoire.colors.cardBorder}`,
      text: grimoire.colors.ivoryDim,
    },
  };

  const tone = tones[status];

  return (
    <View style={[styles.badge, { backgroundColor: tone.bg, borderColor: tone.border }]}>
      <Text style={[styles.label, { color: tone.text }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    flexShrink: 0,
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
