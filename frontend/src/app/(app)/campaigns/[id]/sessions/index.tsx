import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { GrimoireEmptyState, GrimoireModuleScreen, ModuleListHeader } from '@/components/grimoire';
import { CreateSessionSheet, SessionCard } from '@/features/session/components';
import { useGetSessions } from '@/features/session/hooks';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useGrimoire } from '@/hooks/useTheme';

export default function SessionsListScreen() {
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();
  const grimoire = useGrimoire();
  const breakpoint = useBreakpoint();
  const [showCreate, setShowCreate] = useState(false);

  const {
    data: sessions,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetSessions(campaignId ?? '');

  const isDesktopGrid = Platform.OS === 'web' && breakpoint === 'desktop';
  const numColumns = isDesktopGrid ? 2 : 1;

  return (
    <GrimoireModuleScreen
      loading={isLoading}
      error={isError}
      errorMessage="Erro ao carregar sessões"
      onRetry={() => refetch()}
    >
      <ModuleListHeader
        eyebrow="Jornada"
        title="Sessões"
        subtitle="Registro das jornadas e encontros da campanha"
        onCreatePress={() => setShowCreate(true)}
      />

      {!sessions?.length ? (
        <GrimoireEmptyState
          title="Nenhuma sessão registrada"
          description="Registre cada sessão de jogo com resumo, data e status."
          actionLabel="Criar sessão"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <FlatList
          key={`sessions-${numColumns}`}
          data={sessions}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingHorizontal: grimoire.spacing.screen }]}
          ItemSeparatorComponent={
            isDesktopGrid ? undefined : () => <View style={styles.separator} />
          }
          renderItem={({ item }) => (
            <View style={isDesktopGrid ? styles.gridItem : undefined}>
              <SessionCard session={item} campaignId={campaignId ?? ''} />
            </View>
          )}
          columnWrapperStyle={isDesktopGrid ? styles.gridRow : undefined}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      )}

      <CreateSessionSheet
        visible={showCreate}
        campaignId={campaignId ?? ''}
        onClose={() => setShowCreate(false)}
      />
    </GrimoireModuleScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 40,
    paddingTop: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    marginLeft: 68,
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
