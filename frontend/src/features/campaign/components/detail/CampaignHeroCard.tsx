import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import type { CampaignModuleStats } from '@/features/campaign/constants/modules';
import { CAMPAIGN_SPACING } from '@/features/campaign/constants/spacing';
import type { Campaign } from '@/features/campaign/types';
import { useTheme } from '@/hooks/useTheme';

import { CampaignOverviewStats } from './CampaignOverviewStats';

const SYNOPSIS_PREVIEW_LENGTH = 160;

interface CampaignHeroCardProps {
  campaign: Campaign;
  stats: CampaignModuleStats;
}

export function CampaignHeroCard({ campaign, stats }: CampaignHeroCardProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const synopsis = campaign.description ?? 'Sem sinopse definida.';
  const isLong = synopsis.length > SYNOPSIS_PREVIEW_LENGTH;
  const displayedSynopsis =
    expanded || !isLong ? synopsis : `${synopsis.slice(0, SYNOPSIS_PREVIEW_LENGTH).trim()}…`;

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: CAMPAIGN_SPACING.lg,
        marginBottom: CAMPAIGN_SPACING['2xl'],
        gap: CAMPAIGN_SPACING.lg,
        ...theme.elevation.md,
      }}
    >
      <View>
        <Text
          variant="label"
          style={{
            color: theme.colors.accent,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: CAMPAIGN_SPACING.xs,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            fontSize: 11,
          }}
        >
          Sinopse
        </Text>
        <Text variant="body" muted style={{ lineHeight: 24 }}>
          {displayedSynopsis}
        </Text>
        {isLong ? (
          <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={8}>
            <Text
              variant="caption"
              style={{
                color: theme.colors.accent,
                marginTop: CAMPAIGN_SPACING.sm,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              {expanded ? 'Ver menos' : 'Ver mais'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <CampaignOverviewStats stats={stats} />
    </View>
  );
}
