import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import {
  GrimoireEmptyState,
  GrimoireModuleScreen,
  ModuleListHeader,
} from '@/components/grimoire';
import { CreateNpcSheet, NpcCard } from '@/features/npc/components';
import { useGetNpcs } from '@/features/npc/hooks';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { grimoire } from '@/theme/grimoire';

export default function NpcsListScreen() {
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();
  const breakpoint = useBreakpoint();
  const [showCreate, setShowCreate] = useState(false);

  const { data: npcs, isLoading, isError, refetch, isFetching } = useGetNpcs(campaignId ?? '');

  const isDesktopGrid = Platform.OS === 'web' && breakpoint === 'desktop';
  const numColumns = isDesktopGrid ? 2 : 1;

  return (
    <GrimoireModuleScreen loading={isLoading} error={isError} errorMessage="Erro ao carregar NPCs">
      <ModuleListHeader
        eyebrow="Mundo"
        title="NPCs"
        subtitle="Habitantes, aliados e figuras do reino"
        onCreatePress={() => setShowCreate(true)}
      />

      {!npcs?.length ? (
        <GrimoireEmptyState
          title="O reino está silencioso"
          description="Crie habitantes, aliados e antagonistas para dar vida à campanha."
          actionLabel="Criar NPC"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <FlatList
          key={`npcs-${numColumns}`}
          data={npcs}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={isDesktopGrid ? styles.gridItem : undefined}>
              <NpcCard npc={item} campaignId={campaignId ?? ''} />
            </View>
          )}
          columnWrapperStyle={isDesktopGrid ? styles.gridRow : undefined}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      )}

      <CreateNpcSheet
        visible={showCreate}
        campaignId={campaignId ?? ''}
        onClose={() => setShowCreate(false)}
      />
    </GrimoireModuleScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: grimoire.spacing.screen,
    paddingBottom: 32,
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 6,
  },
  gridRow: {
    gap: 12,
    marginBottom: 0,
  },
});
