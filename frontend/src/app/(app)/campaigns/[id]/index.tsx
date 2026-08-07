import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { GrimoireScreen } from '@/components/grimoire';
import {
  CampaignDetailNav,
  CampaignModulesSections,
  CampaignOverviewCard,
  CampaignPrepareSessionCard,
} from '@/features/campaign/components/detail';
import { useCampaignOverview, useDeleteCampaign, useGetCampaign } from '@/features/campaign/hooks';
import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

/** Ficha da campanha. */
export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const grimoire = useGrimoire();
  const campaignId = id ?? '';

  const { data: campaign, isLoading } = useGetCampaign(campaignId);
  const {
    stats,
    nextSession,
    chronicleProgress,
    isLoading: isOverviewLoading,
  } = useCampaignOverview(campaignId);
  const { mutate: deleteCampaign } = useDeleteCampaign();

  function handleDelete() {
    if (!campaign) return;
    Alert.alert(
      'Excluir campanha',
      `Tem certeza que deseja excluir "${campaign.title}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteCampaign(campaign.id, { onSuccess: () => router.back() }),
        },
      ],
    );
  }

  function handleMore() {
    Alert.alert(campaign?.title ?? 'Campanha', undefined, [
      { text: 'Excluir campanha', style: 'destructive', onPress: handleDelete },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  function handlePrepare() {
    if (nextSession) {
      router.push(`/(app)/campaigns/${campaignId}/sessions/${nextSession.id}` as never);
      return;
    }
    router.push(`/(app)/campaigns/${campaignId}/sessions` as never);
  }

  if (isLoading || isOverviewLoading) {
    return (
      <GrimoireScreen scrollable={false} glow="none" contentStyle={styles.centered}>
        <ActivityIndicator size="large" color={grimoire.colors.gold} />
      </GrimoireScreen>
    );
  }

  if (!campaign) {
    return (
      <GrimoireScreen scrollable={false} glow="none" contentStyle={styles.centered}>
        <Text style={[styles.notFound, { color: grimoire.colors.ivory }]}>
          Campanha não encontrada
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              borderRadius: grimoire.radius.md,
              borderColor: grimoire.colors.glassGoldBorder,
            },
          ]}
        >
          <Text style={[styles.backButtonText, { color: grimoire.colors.gold }]}>Voltar</Text>
        </Pressable>
      </GrimoireScreen>
    );
  }

  return (
    <GrimoireScreen glow="none" contentStyle={styles.screenContent} tabBarExtraPadding={16}>
      <View>
        <CampaignDetailNav onMore={handleMore} />
        <CampaignOverviewCard campaign={campaign} stats={stats} progress={chronicleProgress} />
        <CampaignPrepareSessionCard
          nextSession={nextSession}
          stats={stats}
          onPrepare={handlePrepare}
        />
        <CampaignModulesSections campaignId={campaign.id} stats={stats} />
      </View>
    </GrimoireScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  notFound: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 14,
  },
});
