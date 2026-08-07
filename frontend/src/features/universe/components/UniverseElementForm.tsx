import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GrimoireInput, GrimoireOptionPills } from '@/components/grimoire';
import { GrimoireGoldButton } from '@/features/auth/components';
import { useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_CATEGORIES, UNIVERSE_CATEGORY_META } from '../data/demoUniverse';
import { useCreateUniverseElement, useUpdateUniverseElement } from '../hooks';
import {
  createUniverseElementSchema,
  type CreateUniverseElementInput,
  type UniverseElement,
  type UniverseElementCategory,
} from '../types';

interface UniverseElementFormProps {
  universeId: string;
  initialCategory?: UniverseElementCategory;
  element?: UniverseElement;
  onCreated: (element: UniverseElement) => void;
}

export function UniverseElementForm({
  universeId,
  initialCategory,
  element,
  onCreated,
}: UniverseElementFormProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();
  const [showOptional, setShowOptional] = useState(false);
  const { mutate: createElement, isPending: isCreating } = useCreateUniverseElement(universeId);
  const { mutate: updateElement, isPending: isUpdating } = useUpdateUniverseElement(universeId);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateUniverseElementInput>({
    resolver: zodResolver(createUniverseElementSchema),
    defaultValues: {
      name: element?.name ?? '',
      category: element?.category ?? initialCategory ?? 'character',
      description: element?.description ?? '',
      tags: element?.tags?.join(', ') ?? '',
      imageUrl: element?.imageUrl ?? '',
      state: element?.state ?? '',
      occurredAt: element?.occurredAt ?? '',
      secretNotes: element?.secretNotes ?? '',
      isSecret: element?.isSecret ?? false,
    },
  });

  const selectedCategory = useWatch({ control, name: 'category' });
  const isSecret = useWatch({ control, name: 'isSecret' }) ?? false;

  function onSubmit(input: CreateUniverseElementInput) {
    if (element) {
      updateElement({ id: element.id, input }, { onSuccess: onCreated });
      return;
    }
    createElement(input, { onSuccess: onCreated });
  }

  return (
    <View>
      <Text style={[styles.helper, { color: palette.textSecondary }]}>
        Somente o nome é obrigatório. Salve agora e complete o restante quando quiser.
      </Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Nome"
            placeholder="Como este conteúdo é conhecido?"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            autoFocus
          />
        )}
      />

      <GrimoireOptionPills
        label="Categoria"
        options={[...UNIVERSE_CATEGORIES]}
        value={selectedCategory}
        onChange={(category) => setValue('category', category)}
        getLabel={(category) => UNIVERSE_CATEGORY_META[category].singular}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Descrição opcional"
            placeholder="Uma frase já basta para começar."
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.description?.message}
            multiline
            numberOfLines={4}
            style={styles.descriptionInput}
          />
        )}
      />

      <Pressable
        onPress={() => setShowOptional((current) => !current)}
        accessibilityRole="button"
        accessibilityState={{ expanded: showOptional }}
        style={({ pressed }) => [
          styles.optionalToggle,
          {
            borderColor: opacity.border.goldSubtle,
            backgroundColor: opacity.card.subtle,
          },
          pressed && { opacity: opacity.level.pressed },
        ]}
      >
        <Text style={[styles.optionalLabel, { color: palette.accent }]}>Detalhes opcionais</Text>
        {showOptional ? (
          <ChevronUp size={18} color={palette.accent} strokeWidth={1.7} />
        ) : (
          <ChevronDown size={18} color={palette.accent} strokeWidth={1.7} />
        )}
      </Pressable>

      {showOptional ? (
        <View style={styles.optionalFields}>
          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange, onBlur, value } }) => (
              <GrimoireInput
                label="Tags"
                placeholder="Ex.: Divino, Profecia, Ruínas"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.tags?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="imageUrl"
            render={({ field: { onChange, onBlur, value } }) => (
              <GrimoireInput
                label="Imagem"
                placeholder="URL da imagem"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.imageUrl?.message}
                keyboardType="url"
                autoCapitalize="none"
              />
            )}
          />

          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GrimoireInput
                    label="Estado"
                    placeholder="Ex.: desaparecido"
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.state?.message}
                  />
                )}
              />
            </View>
            <View style={styles.column}>
              <Controller
                control={control}
                name="occurredAt"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GrimoireInput
                    label="Data ou período"
                    placeholder="Ex.: Era da Ruptura"
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.occurredAt?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="secretNotes"
            render={({ field: { onChange, onBlur, value } }) => (
              <GrimoireInput
                label="Notas secretas"
                placeholder="Informações reservadas ao mestre."
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.secretNotes?.message}
                multiline
                numberOfLines={4}
                style={styles.secretInput}
              />
            )}
          />

          <Pressable
            onPress={() => setValue('isSecret', !isSecret)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSecret }}
            style={({ pressed }) => [
              styles.secretToggle,
              {
                borderColor: isSecret ? opacity.border.goldStrong : opacity.border.goldSubtle,
                backgroundColor: isSecret ? opacity.card.medium : opacity.card.subtle,
              },
              pressed && { opacity: opacity.level.pressed },
            ]}
          >
            <EyeOff size={17} color={palette.accent} strokeWidth={1.7} />
            <View style={styles.secretCopy}>
              <Text style={[styles.secretTitle, { color: palette.textPrimary }]}>
                Conteúdo reservado ao mestre
              </Text>
              <Text style={[styles.secretDescription, { color: palette.textSecondary }]}>
                Opcional e editável depois.
              </Text>
            </View>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.submit}>
        <GrimoireGoldButton
          title={element ? 'Salvar alterações' : 'Salvar no universo'}
          onPress={handleSubmit(onSubmit)}
          loading={isCreating || isUpdating}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  helper: {
    ...typeRoles.bodySm,
    marginBottom: 16,
  },
  descriptionInput: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  optionalToggle: {
    minHeight: MIN_TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  optionalLabel: {
    ...typeRoles.buttonSm,
  },
  optionalFields: {
    marginTop: 2,
  },
  twoColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  column: {
    flex: 1,
    minWidth: 180,
  },
  secretInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  secretToggle: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  secretCopy: {
    flex: 1,
  },
  secretTitle: {
    ...typeRoles.label,
  },
  secretDescription: {
    ...typeRoles.caption,
    marginTop: 2,
  },
  submit: {
    marginTop: 18,
  },
});
