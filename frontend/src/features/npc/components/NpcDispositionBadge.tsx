import { StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '@/theme/typography';

import { DISPOSITION_LABELS, type NpcDisposition } from '../types';

const STYLES: Record<
  NpcDisposition,
  { bg: string; border: string; text: string }
> = {
  ally: {
    bg: 'rgba(45, 255, 45, 0.1)',
    border: 'rgba(45, 255, 45, 0.35)',
    text: '#7DFF7D',
  },
  neutral: {
    bg: 'rgba(230, 194, 128, 0.12)',
    border: 'rgba(230, 194, 128, 0.35)',
    text: '#E6C280',
  },
  enemy: {
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.35)',
    text: '#F87171',
  },
  unknown: {
    bg: 'rgba(166, 166, 166, 0.1)',
    border: 'rgba(255, 255, 255, 0.12)',
    text: '#A6A6A6',
  },
};

interface NpcDispositionBadgeProps {
  disposition: NpcDisposition;
}

export function NpcDispositionBadge({ disposition }: NpcDispositionBadgeProps) {
  const tone = STYLES[disposition];

  return (
    <View style={[styles.badge, { backgroundColor: tone.bg, borderColor: tone.border }]}>
      <Text style={[styles.label, { color: tone.text }]}>
        {DISPOSITION_LABELS[disposition]}
      </Text>
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
