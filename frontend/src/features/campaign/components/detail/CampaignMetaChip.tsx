import { type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { CAMPAIGN_SPACING } from '@/features/campaign/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

interface CampaignMetaChipProps {
  icon: LucideIcon;
  label: string;
}

export function CampaignMetaChip({ icon: Icon, label }: CampaignMetaChipProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: CAMPAIGN_SPACING.xs / 2,
      }}
    >
      <Icon size={14} color={theme.colors.muted} strokeWidth={2} />
      <Text variant="caption" muted>
        {label}
      </Text>
    </View>
  );
}
