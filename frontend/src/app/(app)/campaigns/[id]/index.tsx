import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { GrimoireFadeIn, GrimoireScreen, SquireHint } from '@/components/grimoire';
import {
  CampaignActions,
  CampaignHero,
  CampaignModules,
} from '@/features/campaign/components/detail';
import { useCampaignOverview, useDeleteCampaign, useGetCampaign } from '@/features/campaign/hooks';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const campaignId = id ?? '';

  const { data: campaign, isLoading } = useGetCampaign(campaignId);
  const { stats, lastSessionRelative, isLoading: isOverviewLoading } =
    useCampaignOverview(campaignId);
  const { mutate: deleteCampaign, isPending: isDeleting } = useDeleteCampaign();

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

  if (isLoading || isOverviewLoading) {
    return (
      <GrimoireScreen scrollable={false} glow="purple-right" contentStyle={styles.centered}>
        <ActivityIndicator size="large" color={grimoire.colors.gold} />
      </GrimoireScreen>
    );
  }

  if (!campaign) {
    return (
      <GrimoireScreen scrollable={false} glow="purple-right" contentStyle={styles.centered}>
        <Text style={styles.notFound}>Campanha não encontrada</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </GrimoireScreen>
    );
  }

  return (
    <GrimoireScreen glow="purple-right" contentStyle={styles.screenContent}>
      <GrimoireFadeIn delay={0}>
        <CampaignHero campaign={campaign} lastSessionRelative={lastSessionRelative} />
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={80}>
        <View style={styles.hintWrap}>
          <SquireHint
            label="O Escudeiro sussurra"
            message={
              stats.npcs > 0
                ? `${stats.npcs} habitantes do reino aguardam. Que tal apresentar um novo aliado à party?`
                : 'Comece registrando NPCs e anotações para dar vida ao seu mundo.'
            }
          />
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={120}>
        <CampaignModules
          campaignId={campaign.id}
          stats={stats}
          lastSessionRelative={lastSessionRelative}
        />
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={180}>
        <CampaignActions onDelete={handleDelete} loading={isDeleting} />
      </GrimoireFadeIn>
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
    color: grimoire.colors.ivory,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    borderRadius: grimoire.radius.md,
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 14,
    color: grimoire.colors.gold,
  },
  hintWrap: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
});
