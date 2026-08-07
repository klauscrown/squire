import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  getModuleByKey,
  getModuleRoute,
  getModuleTileLabel,
  MASTER_TABLE_MODULES,
  UNIVERSE_MODULES,
  type CampaignModuleStats,
  type ModuleKey,
} from '@/features/campaign/constants/modules';
import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily } from '@/theme/typography';

import { MasterModuleTile } from './MasterModuleTile';
import { OrnamentalSectionTitle } from './OrnamentalSectionTitle';

interface CampaignModulesSectionsProps {
  campaignId: string;
  stats: CampaignModuleStats;
}

function UniverseChip({
  label,
  icon: Icon,
  enabled,
  onPress,
}: {
  label: string;
  icon: LucideIcon;
  enabled: boolean;
  onPress: () => void;
}) {
  const palette = useActivePalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={enabled ? label : `${label}, em breve`}
      style={({ pressed }) => [
        styles.chip,
        {
          opacity: enabled ? (pressed ? 0.75 : 1) : 0.62,
        },
      ]}
    >
      <View
        style={[
          styles.chipIcon,
          {
            borderColor: `${palette.primaryLight}40`,
            backgroundColor: `${palette.primary}22`,
          },
        ]}
      >
        <Icon size={20} color={palette.primaryLight} strokeWidth={1.75} />
      </View>
      <Text style={[styles.chipLabel, { color: palette.textPrimary }]} numberOfLines={1}>
        {label}
      </Text>
      {!enabled ? (
        <Text style={[styles.chipHint, { color: palette.textSecondary }]}>Em breve</Text>
      ) : null}
    </Pressable>
  );
}

/**
 * Mesa do Mestre + Mais do Universo — densidade média.
 */
export function CampaignModulesSections({ campaignId, stats }: CampaignModulesSectionsProps) {
  const router = useRouter();

  function handlePress(key: ModuleKey) {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const mod = getModuleByKey(key);
    if (!mod.enabled) {
      Alert.alert('Em breve', 'Este módulo ainda não está disponível.');
      return;
    }

    const route = getModuleRoute(key, campaignId);
    if (route) router.push(route as never);
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHead}>
        <OrnamentalSectionTitle title="Mesa do mestre" />
      </View>

      <View style={styles.masterGrid}>
        {MASTER_TABLE_MODULES.map((key) => {
          const mod = getModuleByKey(key);
          return (
            <View key={key} style={styles.masterCell}>
              <MasterModuleTile
                label={mod.label}
                hint={getModuleTileLabel(mod, stats)}
                icon={mod.icon}
                enabled={mod.enabled}
                onPress={() => handlePress(key)}
              />
            </View>
          );
        })}
      </View>

      <View style={[styles.sectionHead, styles.universeHead]}>
        <OrnamentalSectionTitle title="Mais do universo" />
      </View>

      <View style={styles.universeRow}>
        {UNIVERSE_MODULES.map((key) => {
          const mod = getModuleByKey(key);
          return (
            <UniverseChip
              key={key}
              label={mod.label}
              icon={mod.icon}
              enabled={mod.enabled}
              onPress={() => handlePress(key)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingHorizontal: 18,
  },
  sectionHead: {
    marginBottom: 10,
  },
  universeHead: {
    marginTop: 14,
  },
  masterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  masterCell: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '47%',
  },
  universeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    flex: 1,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
  chipIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  chipHint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 9,
    lineHeight: 11,
    textAlign: 'center',
  },
});
