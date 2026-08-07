import { CalendarDays, ChevronRight, Link2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import type { LinkedCampaignSummary } from '../types';

interface LinkedCampaignCardProps {
  campaign: LinkedCampaignSummary;
  onPress: () => void;
}

export function LinkedCampaignCard({ campaign, onPress }: LinkedCampaignCardProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();

  return (
    <SurfaceCard
      variant="interactive"
      radius="sm"
      padding="sm"
      shadow={false}
      onPress={onPress}
      accessibilityLabel={`Abrir campanha ${campaign.title}, status ${campaign.status}`}
      style={styles.card}
      contentStyle={styles.content}
    >
      <View
        style={[
          styles.icon,
          {
            borderColor: opacity.iconCircle.blueBorder,
            backgroundColor: opacity.iconCircle.blueFill,
          },
        ]}
      >
        <Link2 size={18} color={opacity.iconStroke.blue} strokeWidth={1.7} />
      </View>
      <View style={styles.copy}>
        <View style={styles.heading}>
          <Text style={[styles.title, { color: palette.textPrimary }]}>{campaign.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: opacity.iconCircle.blueFill }]}>
            <Text style={[styles.statusText, { color: opacity.iconStroke.blue }]}>
              {campaign.status}
            </Text>
          </View>
        </View>
        <Text style={[styles.meta, { color: palette.textSecondary }]}>
          {campaign.system} · {campaign.usedElements} elementos utilizados
        </Text>
        {campaign.nextSession ? (
          <View style={styles.nextSession}>
            <CalendarDays size={12} color={palette.textSecondary} strokeWidth={1.6} />
            <Text style={[styles.meta, { color: palette.textSecondary }]}>
              Próxima sessão: {campaign.nextSession}
            </Text>
          </View>
        ) : null}
      </View>
      <ChevronRight size={16} color={palette.textSecondary} strokeWidth={1.5} />
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '100%',
    flexGrow: 1,
    minWidth: 220,
  },
  content: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    ...typeRoles.label,
    flexShrink: 1,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  statusText: {
    ...typeRoles.badge,
    fontSize: 9,
    textTransform: 'uppercase',
  },
  meta: {
    ...typeRoles.caption,
    marginTop: 2,
  },
  nextSession: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 2,
  },
});
