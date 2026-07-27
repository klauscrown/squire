import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { GrimoireEmptyState, GrimoireModuleScreen, ModuleListHeader } from '@/components/grimoire';
import { CreateLocationSheet, LocationCard } from '@/features/location/components';
import { useGetLocations } from '@/features/location/hooks';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { grimoire } from '@/theme/grimoire';

export default function LocationsListScreen() {
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();
  const breakpoint = useBreakpoint();
  const [showCreate, setShowCreate] = useState(false);

  const {
    data: locations,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetLocations(campaignId ?? '');

  const isDesktopGrid = Platform.OS === 'web' && breakpoint === 'desktop';
  const numColumns = isDesktopGrid ? 2 : 1;

  return (
    <GrimoireModuleScreen
      loading={isLoading}
      error={isError}
      errorMessage="Erro ao carregar locais"
    >
      <ModuleListHeader
        eyebrow="Mundo"
        title="Locais"
        subtitle="Cidades, tavernas, masmorras e regiões"
        onCreatePress={() => setShowCreate(true)}
      />

      {!locations?.length ? (
        <GrimoireEmptyState
          title="O mapa está em branco"
          description="Registre assentamentos, masmorras e marcos para dar profundidade ao seu mundo."
          actionLabel="Criar local"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <FlatList
          key={`locations-${numColumns}`}
          data={locations}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={isDesktopGrid ? styles.gridItem : undefined}>
              <LocationCard location={item} campaignId={campaignId ?? ''} />
            </View>
          )}
          columnWrapperStyle={isDesktopGrid ? styles.gridRow : undefined}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      )}

      <CreateLocationSheet
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
