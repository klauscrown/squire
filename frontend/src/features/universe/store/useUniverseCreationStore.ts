import { create } from 'zustand';

import type { UniverseElementCategory } from '../types';

type UniverseCreationView =
  | 'menu'
  | 'form'
  | 'detail'
  | 'connection'
  | 'library'
  | 'universe-form'
  | 'universe-options'
  | 'universe-picker'
  | 'campaign-link';

type UniverseFormMode = 'create' | 'edit';

interface UniverseCreationState {
  visible: boolean;
  view: UniverseCreationView;
  suggestedCategory?: UniverseElementCategory;
  selectedCategory?: UniverseElementCategory;
  elementId?: string;
  libraryCategory?: UniverseElementCategory | 'archive';
  universeFormMode?: UniverseFormMode;
  openMenu: (suggestedCategory?: UniverseElementCategory) => void;
  openForm: (category?: UniverseElementCategory) => void;
  openDetail: (elementId: string) => void;
  openElementEdit: (elementId: string) => void;
  openConnection: (elementId: string) => void;
  openLibrary: (category?: UniverseElementCategory | 'archive') => void;
  openUniverseForm: (mode: UniverseFormMode) => void;
  openUniverseOptions: () => void;
  openUniversePicker: () => void;
  openCampaignLink: () => void;
  back: () => void;
  close: () => void;
}

const CLOSED_STATE = {
  visible: false,
  view: 'menu' as const,
  suggestedCategory: undefined,
  selectedCategory: undefined,
  elementId: undefined,
  libraryCategory: undefined,
  universeFormMode: undefined,
};

export const useUniverseCreationStore = create<UniverseCreationState>((set, get) => ({
  ...CLOSED_STATE,
  openMenu: (suggestedCategory) =>
    set({
      visible: true,
      view: 'menu',
      suggestedCategory,
      selectedCategory: undefined,
      elementId: undefined,
      libraryCategory: undefined,
    }),
  openForm: (category) =>
    set({
      visible: true,
      view: 'form',
      selectedCategory: category,
      elementId: undefined,
      libraryCategory: undefined,
    }),
  openDetail: (elementId) =>
    set({
      visible: true,
      view: 'detail',
      elementId,
      suggestedCategory: undefined,
      selectedCategory: undefined,
      libraryCategory: undefined,
    }),
  openElementEdit: (elementId) =>
    set({
      visible: true,
      view: 'form',
      elementId,
      suggestedCategory: undefined,
      selectedCategory: undefined,
      libraryCategory: undefined,
    }),
  openConnection: (elementId) => set({ visible: true, view: 'connection', elementId }),
  openLibrary: (libraryCategory) =>
    set({
      visible: true,
      view: 'library',
      libraryCategory,
      elementId: undefined,
    }),
  openUniverseForm: (universeFormMode) =>
    set({
      visible: true,
      view: 'universe-form',
      universeFormMode,
      elementId: undefined,
    }),
  openUniverseOptions: () =>
    set({
      visible: true,
      view: 'universe-options',
      elementId: undefined,
    }),
  openUniversePicker: () =>
    set({
      visible: true,
      view: 'universe-picker',
      elementId: undefined,
    }),
  openCampaignLink: () =>
    set({
      visible: true,
      view: 'campaign-link',
      elementId: undefined,
    }),
  back: () => {
    const { view, elementId } = get();
    if (view === 'connection' && elementId) {
      set({ view: 'detail' });
      return;
    }
    if (view === 'form' && elementId) {
      set({ view: 'detail', selectedCategory: undefined });
      return;
    }
    if (view === 'form') {
      set({ view: 'menu', selectedCategory: undefined });
      return;
    }
    set(CLOSED_STATE);
  },
  close: () => set(CLOSED_STATE),
}));
