import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressBar, SectionLabel } from '@/components/grimoire';
import {
  getModuleByKey,
  getModuleRoute,
  MODULE_DISPLAY_ORDER,
  type CampaignModuleStats,
  type ModuleKey,
} from '@/features/campaign/constants/modules';
import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import { ModuleCard } from './ModuleCard';

const GRID_COLUMNS = 4;
const GRID_GAP = 8;

interface CampaignModulesProps {
  campaignId: string;
  stats: CampaignModuleStats;
  lastSessionRelative: string;
}

function estimateProgress(stats: CampaignModuleStats): number {
  const total = stats.sessions + stats.npcs + stats.notes;
  if (total === 0) return 0.08;
  return Math.min(0.92, 0.12 + total / 40);
}

export function CampaignModules({ campaignId, stats, lastSessionRelative }: CampaignModulesProps) {
  const router = useRouter();
  const grimoire = useGrimoire();
  const progress = estimateProgress(stats);
  const [gridWidth, setGridWidth] = useState(0);

  const cellWidth = gridWidth > 0 ? (gridWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS : 0;

  function handlePress(key: ModuleKey) {
    const mod = getModuleByKey(key);
    if (!mod.enabled) {
      Alert.alert('Em breve', 'Este módulo ainda não está disponível.');
      return;
    }

    const route = getModuleRoute(key, campaignId);
    if (route) router.push(route as never);
  }

  function handleStartJourney() {
    handlePress('sessions');
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[`${grimoire.colors.purpleMid}66`, grimoire.colors.card, grimoire.colors.card]}
        style={[
          styles.journeyCard,
          {
            borderRadius: grimoire.radius.xl,
            borderColor: grimoire.colors.glassGoldBorder,
            shadowColor: grimoire.colors.gold,
          },
        ]}
      >
        <View style={styles.journeyHeader}>
          <View>
            <Text style={[styles.journeyEyebrow, { color: grimoire.colors.gold }]}>
              Próxima sessão
            </Text>
            <Text style={[styles.journeyTitle, { color: grimoire.colors.ivory }]}>
              {stats.sessions > 0 ? lastSessionRelative : 'A definir'}
            </Text>
          </View>
          <Pressable
            onPress={handleStartJourney}
            style={({ pressed }) => [
              styles.journeyButton,
              {
                borderRadius: grimoire.radius.md,
                backgroundColor: grimoire.colors.gold,
              },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={[styles.journeyButtonText, { color: grimoire.colors.purpleDeep }]}>
              {stats.sessions > 0 ? 'Continuar' : 'Iniciar Jornada'}
            </Text>
          </Pressable>
        </View>
        <ProgressBar progress={progress} label="Progresso da crônica" />
      </LinearGradient>

      <View style={styles.modulesSection}>
        <SectionLabel title="Jornada" />
        <View
          style={styles.moduleGrid}
          onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
        >
          {cellWidth > 0 &&
            MODULE_DISPLAY_ORDER.map((key) => {
              const mod = getModuleByKey(key);
              return (
                <View key={key} style={{ width: cellWidth }}>
                  <ModuleCard
                    label={mod.label}
                    hint={mod.enabled ? mod.getStatLabel?.(stats) || mod.tagline : 'Em breve'}
                    icon={mod.icon}
                    enabled={mod.enabled}
                    onPress={() => handlePress(key)}
                  />
                </View>
              );
            })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: -16,
  },
  journeyCard: {
    borderWidth: 1,
    padding: 20,
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  journeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  journeyEyebrow: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  journeyTitle: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 22,
    marginTop: 4,
  },
  journeyButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  journeyButtonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  modulesSection: {
    marginTop: 32,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
});
