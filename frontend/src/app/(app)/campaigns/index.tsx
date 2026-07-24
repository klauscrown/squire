import { type ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Plus } from 'phosphor-react-native';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '@/constants';
import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';
import { AmbientGlow } from '@/components/grimoire/AmbientGlow';
import { GrimoireAtmosphereShell } from '@/components/grimoire/GrimoireAtmosphere';
import { GrimoireHeader } from '@/components/grimoire/GrimoireHeader';
import {
  CampaignActionsSheet,
  CampaignCard,
  CampaignEmptyState,
  CampaignSearchBar,
} from '@/features/campaign/components';
import { useGetCampaigns } from '@/features/campaign/hooks';
import type { Campaign } from '@/features/campaign/types';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

function CampaignsShell({ children }: { children: ReactNode }) {
  return (
    <GrimoireAtmosphereShell>
      <SafeAreaView style={styles.root} edges={['top']}>
        <AmbientGlow variant="purple-left" />
        {children}
      </SafeAreaView>
    </GrimoireAtmosphereShell>
  );
}

export default function CampaignsScreen() {
  const router = useRouter();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: campaigns, isLoading, isError, refetch, isFetching } = useGetCampaigns();

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return campaigns;
    return campaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.system?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query),
    );
  }, [campaigns, searchQuery]);

  const handleCampaignPress = useCallback(
    (campaign: Campaign) => {
      router.push(`/(app)/campaigns/${campaign.id}`);
    },
    [router],
  );

  const handleCreatePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(ROUTES.app.campaignCreate);
  }, [router]);

  if (isLoading) {
    return (
      <CampaignsShell>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={grimoire.colors.gold} />
        </View>
      </CampaignsShell>
    );
  }

  if (isError) {
    return (
      <CampaignsShell>
        <View style={styles.errorWrap}>
          <Text style={styles.errorTitle}>Erro ao carregar</Text>
          <Text style={styles.errorBody}>Verifique sua conexão e tente novamente.</Text>
        </View>
      </CampaignsShell>
    );
  }

  const hasNoCampaigns = !campaigns?.length;

  if (hasNoCampaigns) {
    return (
      <CampaignsShell>
        <View style={styles.emptyRoot}>
          <CampaignEmptyState onCreatePress={handleCreatePress} />
        </View>
      </CampaignsShell>
    );
  }

  return (
    <CampaignsShell>
      <FlatList
        style={styles.list}
        data={filteredCampaigns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isFetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <>
            <MotiView
              from={{ opacity: 0, translateY: -8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300 }}
            >
              <GrimoireHeader
                eyebrow="Grimório"
                title="Suas Crônicas"
                subtitle="A história de cada reino que você moldou."
                action={
                  <Pressable
                    onPress={handleCreatePress}
                    style={({ pressed }) => [
                      styles.createBtn,
                      pressed && { transform: [{ scale: 0.95 }] },
                    ]}
                  >
                    <Plus size={20} color={grimoire.colors.purpleDeep} weight="bold" />
                  </Pressable>
                }
              />
            </MotiView>
            <View style={styles.searchWrap}>
              <CampaignSearchBar value={searchQuery} onChangeText={setSearchQuery} />
            </View>
            {filteredCampaigns.length === 0 ? (
              <Text style={styles.emptySearchText}>
                Nenhuma crônica encontrada para "{searchQuery}".
              </Text>
            ) : null}
          </>
        }
        renderItem={({ item, index }) => (
          <CampaignCard
            campaign={item}
            index={index}
            onPress={handleCampaignPress}
            onLongPress={setSelectedCampaign}
            style={styles.cardSpacing}
          />
        )}
      />

      {selectedCampaign ? (
        <CampaignActionsSheet
          campaign={selectedCampaign}
          onDismiss={() => setSelectedCampaign(null)}
          onContinue={(campaign) => router.push(`/(app)/campaigns/${campaign.id}`)}
          onEdit={(campaign) => router.push(`/(app)/campaigns/${campaign.id}`)}
          onDuplicate={() => setSelectedCampaign(null)}
          onArchive={() => setSelectedCampaign(null)}
          onDelete={() => setSelectedCampaign(null)}
        />
      ) : null}
    </CampaignsShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  list: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  emptyRoot: {
    flex: 1,
    paddingHorizontal: grimoire.spacing.screen,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 18,
    color: grimoire.colors.ivory,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorBody: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: grimoire.colors.ivoryDim,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: grimoire.spacing.screen,
    paddingBottom: CURVED_TAB_BAR_FOOTPRINT + 16,
  },
  createBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: grimoire.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: grimoire.colors.gold,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  searchWrap: {
    marginTop: 24,
    marginBottom: 8,
  },
  cardSpacing: {
    marginBottom: 20,
  },
  emptySearchText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: grimoire.colors.ivoryDim,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
