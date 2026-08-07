import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { FormSheet } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_CATEGORY_META } from '../data/demoUniverse';
import {
  useDeleteUniverseElement,
  useGetActiveUniverse,
  useGetUniverseElement,
  useGetUniverseElements,
} from '../hooks';
import { useUniverseCreationStore } from '../store/useUniverseCreationStore';
import type { Universe, UniverseElement } from '../types';
import { UniverseCampaignLinker } from './UniverseCampaignLinker';
import { UniverseConnectionForm } from './UniverseConnectionForm';
import { UniverseCreationMenu } from './UniverseCreationMenu';
import { UniverseElementDetail } from './UniverseElementDetail';
import { UniverseElementForm } from './UniverseElementForm';
import { UniverseForm } from './UniverseForm';
import { UniverseLibraryView } from './UniverseLibraryView';
import { UniverseOptionsMenu } from './UniverseOptionsMenu';
import { UniversePicker } from './UniversePicker';

export function UniverseCreationHost() {
  const router = useRouter();
  const palette = useActivePalette();
  const opacity = useOpacity();
  const visible = useUniverseCreationStore((state) => state.visible);
  const view = useUniverseCreationStore((state) => state.view);
  const suggestedCategory = useUniverseCreationStore((state) => state.suggestedCategory);
  const selectedCategory = useUniverseCreationStore((state) => state.selectedCategory);
  const elementId = useUniverseCreationStore((state) => state.elementId);
  const libraryCategory = useUniverseCreationStore((state) => state.libraryCategory);
  const universeFormMode = useUniverseCreationStore((state) => state.universeFormMode);
  const openMenu = useUniverseCreationStore((state) => state.openMenu);
  const openForm = useUniverseCreationStore((state) => state.openForm);
  const openDetail = useUniverseCreationStore((state) => state.openDetail);
  const openElementEdit = useUniverseCreationStore((state) => state.openElementEdit);
  const openConnection = useUniverseCreationStore((state) => state.openConnection);
  const openUniverseForm = useUniverseCreationStore((state) => state.openUniverseForm);
  const openUniversePicker = useUniverseCreationStore((state) => state.openUniversePicker);
  const back = useUniverseCreationStore((state) => state.back);
  const close = useUniverseCreationStore((state) => state.close);
  const { data: activeUniverse } = useGetActiveUniverse();
  const { data: selectedElement } = useGetUniverseElement(elementId);
  const { data: allElements = [] } = useGetUniverseElements(activeUniverse?.id);
  const { mutate: deleteElement } = useDeleteUniverseElement(activeUniverse?.id ?? '');
  const effectiveView = !activeUniverse && view !== 'universe-form' ? 'universe-form' : view;
  const isEditingElement = effectiveView === 'form' && Boolean(elementId);

  const title =
    effectiveView === 'menu'
      ? 'Criar no universo'
      : effectiveView === 'form'
        ? isEditingElement
          ? 'Editar conteúdo'
          : selectedCategory
            ? `Novo ${UNIVERSE_CATEGORY_META[selectedCategory].singular.toLocaleLowerCase('pt-BR')}`
            : 'Novo conteúdo'
        : effectiveView === 'connection'
          ? 'Nova conexão'
          : effectiveView === 'library'
            ? libraryCategory === 'archive'
              ? 'Acervo do universo'
              : libraryCategory
                ? UNIVERSE_CATEGORY_META[libraryCategory].label
                : 'Biblioteca do universo'
            : effectiveView === 'universe-form'
              ? universeFormMode === 'edit'
                ? 'Editar universo'
                : 'Criar universo'
              : effectiveView === 'universe-picker'
                ? 'Trocar universo'
                : effectiveView === 'universe-options'
                  ? 'Opções do universo'
                  : effectiveView === 'campaign-link'
                    ? 'Vincular campanhas'
                    : 'Ficha do universo';

  function handleElementSaved(element: UniverseElement) {
    Toast.show({
      type: 'success',
      text1: isEditingElement ? 'Alterações salvas' : 'Salvo no universo',
      text2: `${element.name} faz parte de ${activeUniverse?.name ?? 'seu universo'}.`,
    });
    openDetail(element.id);
  }

  function handleUniverseSaved(universe: Universe) {
    Toast.show({
      type: 'success',
      text1: universeFormMode === 'edit' ? 'Universo atualizado' : 'Universo criado',
      text2: `${universe.name} está pronto para receber suas histórias.`,
    });
    close();
  }

  function confirmDeleteElement(element: UniverseElement) {
    const remove = () =>
      deleteElement(element.id, {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Conteúdo excluído' });
          close();
        },
      });

    if (Platform.OS === 'web') {
      if (
        globalThis.confirm(`Excluir ${element.name}? As conexões relacionadas serão removidas.`)
      ) {
        remove();
      }
      return;
    }

    Alert.alert(
      `Excluir ${element.name}?`,
      'O conteúdo e as conexões relacionadas serão removidos deste dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: remove,
        },
      ],
    );
  }

  function handleCreateFromLibrary(category?: UniverseElement['category']) {
    if (category) {
      openForm(category);
      return;
    }
    openMenu();
  }

  return (
    <FormSheet visible={visible} title={title} onClose={close}>
      {effectiveView !== 'menu' && effectiveView !== 'universe-form' ? (
        <Pressable
          onPress={back}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={({ pressed }) => [
            styles.backButton,
            {
              borderColor: opacity.border.goldSubtle,
              backgroundColor: opacity.card.subtle,
            },
            pressed && { opacity: opacity.level.pressed },
          ]}
        >
          <ArrowLeft size={17} color={palette.accent} strokeWidth={1.8} />
          <Text style={[styles.backLabel, { color: palette.accent }]}>Voltar</Text>
        </Pressable>
      ) : null}

      {effectiveView === 'menu' && activeUniverse ? (
        <UniverseCreationMenu
          universeName={activeUniverse.name}
          suggestedCategory={suggestedCategory}
          onSelectCategory={openForm}
          onViewAll={() => openForm()}
        />
      ) : null}

      {effectiveView === 'form' && activeUniverse && (!isEditingElement || selectedElement) ? (
        <UniverseElementForm
          key={elementId ?? selectedCategory ?? 'all'}
          universeId={activeUniverse.id}
          initialCategory={selectedCategory}
          element={isEditingElement ? selectedElement : undefined}
          onCreated={handleElementSaved}
        />
      ) : null}

      {effectiveView === 'detail' && elementId ? (
        <UniverseElementDetail
          elementId={elementId}
          onAddConnection={() => openConnection(elementId)}
          onOpenElement={openDetail}
          onEdit={() => openElementEdit(elementId)}
          onDelete={() => selectedElement && confirmDeleteElement(selectedElement)}
        />
      ) : null}

      {effectiveView === 'connection' && selectedElement && activeUniverse ? (
        <UniverseConnectionForm
          source={selectedElement}
          candidates={allElements.filter((element) => element.id !== selectedElement.id)}
          onCreated={() => openDetail(selectedElement.id)}
        />
      ) : null}

      {effectiveView === 'library' && activeUniverse ? (
        <UniverseLibraryView
          universeId={activeUniverse.id}
          initialCategory={libraryCategory}
          onOpenElement={openDetail}
          onCreate={handleCreateFromLibrary}
        />
      ) : null}

      {effectiveView === 'universe-form' ? (
        <UniverseForm
          key={universeFormMode === 'edit' ? activeUniverse?.id : 'new'}
          universe={universeFormMode === 'edit' ? (activeUniverse ?? undefined) : undefined}
          onSaved={handleUniverseSaved}
        />
      ) : null}

      {effectiveView === 'universe-picker' ? (
        <UniversePicker
          activeUniverseId={activeUniverse?.id}
          onSelected={(universe) => {
            Toast.show({ type: 'success', text1: `${universe.name} agora está ativo` });
            close();
          }}
          onCreate={() => openUniverseForm('create')}
        />
      ) : null}

      {effectiveView === 'universe-options' && activeUniverse ? (
        <UniverseOptionsMenu
          universe={activeUniverse}
          onEdit={() => openUniverseForm('edit')}
          onSwitch={openUniversePicker}
          onCreate={() => openUniverseForm('create')}
        />
      ) : null}

      {effectiveView === 'campaign-link' && activeUniverse ? (
        <UniverseCampaignLinker
          universeId={activeUniverse.id}
          universeName={activeUniverse.name}
          onCreateCampaign={() => {
            close();
            router.push(ROUTES.app.campaignCreate);
          }}
        />
      ) : null}

      {(effectiveView === 'connection' || (effectiveView === 'form' && elementId)) &&
      !selectedElement ? (
        <View style={styles.loadingSpace} />
      ) : null}
    </FormSheet>
  );
}

const styles = StyleSheet.create({
  backButton: {
    minHeight: MIN_TOUCH_TARGET,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  backLabel: {
    ...typeRoles.buttonSm,
  },
  loadingSpace: {
    minHeight: 180,
  },
});
