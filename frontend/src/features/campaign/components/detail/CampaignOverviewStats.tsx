import { BookOpen, NotebookPen, Users } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import type { CampaignModuleStats } from '@/features/campaign/constants/modules';
import { CAMPAIGN_SPACING } from '@/features/campaign/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

interface CampaignOverviewStatsProps {
  stats: CampaignModuleStats;
}

const STAT_ITEMS = [
  {
    key: 'sessions' as const,
    label: 'Sessões',
    icon: BookOpen,
    getValue: (s: CampaignModuleStats) => s.sessions,
  },
  {
    key: 'npcs' as const,
    label: 'NPCs',
    icon: Users,
    getValue: (s: CampaignModuleStats) => s.npcs,
  },
  {
    key: 'notes' as const,
    label: 'Anotações',
    icon: NotebookPen,
    getValue: (s: CampaignModuleStats) => s.notes,
  },
];

export function CampaignOverviewStats({ stats }: CampaignOverviewStatsProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: CAMPAIGN_SPACING.sm,
      }}
    >
      {STAT_ITEMS.map((item) => {
        const Icon = item.icon;
        const value = item.getValue(stats);

        return (
          <View
            key={item.key}
            style={{
              flex: 1,
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: theme.radius.lg,
              paddingVertical: CAMPAIGN_SPACING.md,
              paddingHorizontal: CAMPAIGN_SPACING.sm,
              alignItems: 'center',
            }}
          >
            <Icon
              size={18}
              color={theme.colors.accent}
              strokeWidth={2}
            />
            <View style={{ height: CAMPAIGN_SPACING.xs }} />
            <Text
              variant="h3"
              style={{
                fontWeight: theme.typography.fontWeight.semibold,
                marginBottom: 2,
              }}
            >
              {value}
            </Text>
            <Text variant="caption" muted>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
