import { StyleSheet, Text, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import { STATUS_LABELS, type CampaignStatus } from '../types';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  size?: 'default' | 'small';
}

export function CampaignStatusBadge({ status, size = 'default' }: CampaignStatusBadgeProps) {
  const grimoire = useGrimoire();
  const isSmall = size === 'small';

  const tones: Record<
    CampaignStatus,
    { bg: string; border: string; text: string; dot: string }
  > = {
    active: {
      bg: `${grimoire.colors.success}18`,
      border: `${grimoire.colors.success}44`,
      text: grimoire.colors.success,
      dot: grimoire.colors.success,
    },
    paused: {
      bg: grimoire.colors.glassGold,
      border: grimoire.colors.glassGoldBorder,
      text: grimoire.colors.gold,
      dot: grimoire.colors.gold,
    },
    completed: {
      bg: `${grimoire.colors.ivoryDim}14`,
      border: grimoire.colors.cardBorder,
      text: grimoire.colors.ivoryDim,
      dot: grimoire.colors.ivoryDim,
    },
  };

  const tone = tones[status];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: tone.bg,
          borderColor: tone.border,
          paddingHorizontal: isSmall ? 6 : 8,
          paddingVertical: isSmall ? 2 : 3,
          gap: isSmall ? 4 : 5,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: tone.dot,
            width: isSmall ? 5 : 6,
            height: isSmall ? 5 : 6,
          },
        ]}
      />
      <Text style={[styles.label, { color: tone.text, fontSize: isSmall ? 10 : 11 }]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    borderRadius: 999,
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
