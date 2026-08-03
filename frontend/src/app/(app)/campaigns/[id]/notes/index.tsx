import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { GrimoireEmptyState, GrimoireModuleScreen, ModuleListHeader } from '@/components/grimoire';
import { CreateNoteSheet, NoteCard } from '@/features/notes/components';
import { useGetNotes } from '@/features/notes/hooks';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useGrimoire } from '@/hooks/useTheme';

export default function NotesListScreen() {
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();
  const grimoire = useGrimoire();
  const breakpoint = useBreakpoint();
  const [showCreate, setShowCreate] = useState(false);

  const { data: notes, isLoading, isError, refetch, isFetching } = useGetNotes(campaignId ?? '');

  const isDesktopGrid = Platform.OS === 'web' && breakpoint === 'desktop';
  const numColumns = isDesktopGrid ? 2 : 1;

  return (
    <GrimoireModuleScreen
      loading={isLoading}
      error={isError}
      errorMessage="Erro ao carregar anotações"
    >
      <ModuleListHeader
        eyebrow="Narrativa"
        title="Anotações"
        subtitle="Grimório pessoal, pistas e segredos do mestre"
        onCreatePress={() => setShowCreate(true)}
      />

      {!notes?.length ? (
        <GrimoireEmptyState
          title="Grimório em branco"
          description="Registre ideias, pistas e lembretes para esta campanha."
          actionLabel="Criar anotação"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <FlatList
          key={`notes-${numColumns}`}
          data={notes}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingHorizontal: grimoire.spacing.screen }]}
          renderItem={({ item }) => (
            <View style={isDesktopGrid ? styles.gridItem : undefined}>
              <NoteCard note={item} campaignId={campaignId ?? ''} />
            </View>
          )}
          columnWrapperStyle={isDesktopGrid ? styles.gridRow : undefined}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      )}

      <CreateNoteSheet
        visible={showCreate}
        campaignId={campaignId ?? ''}
        onClose={() => setShowCreate(false)}
      />
    </GrimoireModuleScreen>
  );
}

const styles = StyleSheet.create({
  list: {
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
