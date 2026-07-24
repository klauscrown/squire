import { StyleSheet, View } from 'react-native';
import { BookOpen, NotebookPen, Users } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Text } from '@/components/ui';
import type { CampaignModuleStats } from '@/features/campaign/constants/modules';
import { useTheme } from '@/hooks/useTheme';

interface StatConfig {
  icon: LucideIcon;
  label: string;
  getValue: (s: CampaignModuleStats) => number;
  getSubtitle: (s: CampaignModuleStats, rel: string) => string;
}

const STATS: StatConfig[] = [
  {
    icon: BookOpen,
    label: 'Sessões',
    getValue: (s) => s.sessions,
    getSubtitle: (s, rel) => (s.sessions > 0 ? rel : 'Sua aventura começa aqui'),
  },
  {
    icon: Users,
    label: 'NPCs',
    getValue: (s) => s.npcs,
    getSubtitle: (s) => (s.npcs > 0 ? 'personagens' : 'Aguardando habitantes'),
  },
  {
    icon: NotebookPen,
    label: 'Anotações',
    getValue: (s) => s.notes,
    getSubtitle: (s) => (s.notes > 0 ? 'documentos' : 'Grimório em branco'),
  },
];

interface CampaignQuickStatsProps {
  stats: CampaignModuleStats;
  lastSessionRelative: string;
}

export function CampaignQuickStats({ stats, lastSessionRelative }: CampaignQuickStatsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {STATS.map((stat) => {
        const Icon = stat.icon;
        const value = stat.getValue(stats);
        const subtitle = stat.getSubtitle(stats, lastSessionRelative);

        return (
          <View
            key={stat.label}
            style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <Icon size={18} color={theme.colors.accent} strokeWidth={2} />
            <Text style={[styles.value, { color: theme.colors.foreground }]}>{value}</Text>
            <Text style={[styles.label, { color: theme.colors.muted }]}>{stat.label}</Text>
            <Text numberOfLines={1} style={[styles.subtitle, { color: theme.colors.mutedForeground }]}>
              {subtitle}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 10 },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  value: { fontSize: 24, fontWeight: '700', marginTop: 8 },
  label: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  subtitle: { fontSize: 10, marginTop: 4 },
});
