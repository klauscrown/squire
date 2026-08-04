import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActiveCampaignCard } from './ActiveCampaignCard';
import type { Campaign } from '@/features/campaign/types';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

interface HomeActiveCampaignProps {
  campaign?: Campaign | null;
  loading?: boolean;
  onPress: (campaign: Campaign) => void;
  onViewAll?: () => void;
}

/**
 * Bloco da campanha ativa na Home — section label + ActiveCampaignCard.
 */
export function HomeActiveCampaign({
  campaign,
  loading = false,
  onPress,
  onViewAll,
}: HomeActiveCampaignProps) {
  const palette = useActivePalette();
  const home = useComponents().home;

  return (
    <View style={{ marginTop: home.heroMarginTop }}>
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionLabel, { color: palette.accent }]} maxFontSizeMultiplier={1.3}>
          Campanha ativa
        </Text>
        {onViewAll && !loading ? (
          <Pressable
            onPress={onViewAll}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Ver todas as campanhas"
            style={({ pressed }) => [styles.viewAllBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={[styles.viewAll, { color: palette.textSecondary }]}>Ver todas</Text>
          </Pressable>
        ) : null}
      </View>

      <ActiveCampaignCard
        campaign={campaign}
        loading={loading}
        onPress={onPress}
        actionLabel="Continuar campanha"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  sectionLabel: {
    ...typeRoles.caption,
    flexShrink: 1,
  },
  viewAllBtn: {
    minHeight: MIN_TOUCH_TARGET,
    minWidth: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  viewAll: {
    ...typeRoles.label,
  },
});
