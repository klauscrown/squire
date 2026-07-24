import { useRouter } from 'expo-router';
import { Calendar, ChevronLeft, Users } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { CAMPAIGN_SPACING } from '@/features/campaign/constants/spacing';
import type { Campaign } from '@/features/campaign/types';
import { useTheme } from '@/hooks/useTheme';

import { AnimatedPressable } from './AnimatedPressable';
import { CampaignMetaChip } from './CampaignMetaChip';
import { CampaignStatusBadge } from '../CampaignStatusBadge';

interface CampaignHeaderProps {
  campaign: Campaign;
  lastSessionLabel: string;
}

export function CampaignHeader({ campaign, lastSessionLabel }: CampaignHeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const lastSessionShort = lastSessionLabel.replace('Última sessão: ', '');

  return (
    <View style={{ paddingTop: insets.top + CAMPAIGN_SPACING.sm, marginBottom: CAMPAIGN_SPACING.lg }}>
      <AnimatedPressable
        onPress={() => router.back()}
        style={{
          width: 40,
          height: 40,
          borderRadius: theme.radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surfaceVariant,
          marginBottom: CAMPAIGN_SPACING.lg,
        }}
        accessibilityLabel="Voltar"
      >
        <ChevronLeft size={22} color={theme.colors.foreground} strokeWidth={2} />
      </AnimatedPressable>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: CAMPAIGN_SPACING.sm,
          marginBottom: CAMPAIGN_SPACING.md,
        }}
      >
        <CampaignStatusBadge status={campaign.status} variant="subtle" />
        {campaign.system ? (
          <Text variant="caption" muted>
            {campaign.system}
          </Text>
        ) : null}
      </View>

      <Text
        variant="h1"
        numberOfLines={3}
        style={{
          fontSize: 32,
          lineHeight: 38,
          fontWeight: theme.typography.fontWeight.semibold,
          marginBottom: CAMPAIGN_SPACING.md,
        }}
      >
        {campaign.title}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: CAMPAIGN_SPACING.md,
        }}
      >
        {campaign.playersCount ? (
          <CampaignMetaChip
            icon={Users}
            label={`${campaign.playersCount} ${campaign.playersCount === 1 ? 'jogador' : 'jogadores'}`}
          />
        ) : null}
        <CampaignMetaChip icon={Calendar} label={lastSessionShort} />
      </View>
    </View>
  );
}
