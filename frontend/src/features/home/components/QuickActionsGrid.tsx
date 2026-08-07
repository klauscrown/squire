import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  MapPin,
  NotebookPen,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { GrimoireFadeIn } from '@/components/grimoire';
import { SurfaceCard } from '@/components/ui';
import { ROUTES } from '@/constants';
import { getModuleRoute, type ModuleKey } from '@/features/campaign/constants/modules';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { motion } from '@/theme/motion';
import { typeRoles } from '@/theme/typography';

type ShortcutId = 'npcs' | 'locations' | 'sessions' | 'notes';

interface ShortcutDef {
  id: ShortcutId;
  moduleKey: ModuleKey;
  title: string;
  Icon: LucideIcon;
}

const SHORTCUTS: readonly ShortcutDef[] = [
  { id: 'npcs', moduleKey: 'npcs', title: 'Criar NPC', Icon: Users },
  { id: 'locations', moduleKey: 'locations', title: 'Adicionar local', Icon: MapPin },
  { id: 'sessions', moduleKey: 'sessions', title: 'Planejar sessão', Icon: BookOpen },
  { id: 'notes', moduleKey: 'notes', title: 'Nova anotação', Icon: NotebookPen },
];

interface ShortcutTileProps {
  item: ShortcutDef;
  campaignId?: string | null;
}

function ShortcutTile({ item, campaignId }: ShortcutTileProps) {
  const router = useRouter();
  const palette = useActivePalette();
  const opacity = useOpacity();
  const components = useComponents();
  const tile = components.shortcutTile;

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (!campaignId) {
      router.push(ROUTES.app.campaigns);
      return;
    }

    const route = getModuleRoute(item.moduleKey, campaignId);
    if (route) {
      router.push(route as never);
    }
  }

  return (
    <SurfaceCard
      variant="interactive"
      radius="sm"
      padding="sm"
      shadow={false}
      onPress={handlePress}
      accessibilityLabel={item.title}
      contentStyle={[styles.tile, { minHeight: Math.max(tile.minHeight, MIN_TOUCH_TARGET) }]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            width: tile.iconSize,
            height: tile.iconSize,
            borderRadius: tile.iconRadius,
            backgroundColor: opacity.card.subtle,
            borderColor: tile.frameBorder,
          },
        ]}
      >
        <item.Icon size={18} color={palette.accent} strokeWidth={1.75} />
      </View>

      <View style={styles.copy}>
        <Text style={[styles.title, { color: palette.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </SurfaceCard>
  );
}

export interface QuickActionsGridProps {
  campaignId?: string | null;
}

export function QuickActionsGrid({ campaignId }: QuickActionsGridProps) {
  const components = useComponents();
  const palette = useActivePalette();
  const gap = components.spacing.grid;
  const home = components.home;

  /** Sem campanha: atalhos competem com o CTA de criar — esconder. */
  if (!campaignId) {
    return null;
  }

  const rows: ShortcutDef[][] = [];
  for (let i = 0; i < SHORTCUTS.length; i += 2) {
    rows.push(SHORTCUTS.slice(i, i + 2) as ShortcutDef[]);
  }

  return (
    <View style={[styles.section, { marginTop: home.shortcutsMarginTop }]}>
      <GrimoireFadeIn delay={motion.home.shortcuts}>
        <Text style={[styles.sectionLabel, { color: palette.textSecondary }]}>Ações rápidas</Text>
      </GrimoireFadeIn>
      <View style={[styles.grid, { gap }]}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.row, { gap }]}>
            {row.map((item, colIndex) => {
              const index = rowIndex * 2 + colIndex;
              return (
                <GrimoireFadeIn
                  key={item.id}
                  delay={motion.home.shortcuts + motion.staggerMs * (index + 1)}
                  style={styles.tileSlot}
                >
                  <ShortcutTile item={item} campaignId={campaignId} />
                </GrimoireFadeIn>
              );
            })}
            {row.length === 1 ? <View style={styles.tileSlot} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  sectionLabel: {
    ...typeRoles.caption,
    marginBottom: 10,
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  tileSlot: {
    flex: 1,
    minWidth: 0,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  title: {
    ...typeRoles.label,
    fontSize: 13,
    lineHeight: 16,
  },
});
