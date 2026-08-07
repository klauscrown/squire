import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { GrimoireInput } from '@/components/grimoire';
import { GrimoireGoldButton } from '@/features/auth/components';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import { useCreateUniverse, useUpdateUniverse } from '../hooks';
import { createUniverseSchema, type CreateUniverseInput, type Universe } from '../types';

interface UniverseFormProps {
  universe?: Universe;
  onSaved: (universe: Universe) => void;
}

export function UniverseForm({ universe, onSaved }: UniverseFormProps) {
  const palette = useActivePalette();
  const { mutate: createUniverse, isPending: isCreating } = useCreateUniverse();
  const { mutate: updateUniverse, isPending: isUpdating } = useUpdateUniverse();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUniverseInput>({
    resolver: zodResolver(createUniverseSchema),
    defaultValues: {
      name: universe?.name ?? '',
      description: universe?.description ?? '',
      icon: universe?.icon ?? 'orbit',
    },
  });

  function onSubmit(input: CreateUniverseInput) {
    if (universe) {
      updateUniverse({ id: universe.id, input }, { onSuccess: onSaved });
      return;
    }

    createUniverse(input, { onSuccess: onSaved });
  }

  return (
    <View>
      <Text style={[styles.helper, { color: palette.textSecondary }]}>
        {universe
          ? 'Atualize a identidade deste cenário. Todo o conteúdo e os vínculos serão preservados.'
          : 'Dê um nome ao cenário. Personagens, locais e histórias poderão ser adicionados depois.'}
      </Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Nome"
            placeholder="Ex.: Crônicas do Véu"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            autoFocus
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Descrição opcional"
            placeholder="Uma frase que capture a essência deste mundo."
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.description?.message}
            multiline
            numberOfLines={5}
            style={styles.description}
          />
        )}
      />

      <GrimoireGoldButton
        title={universe ? 'Salvar alterações' : 'Criar universo'}
        onPress={handleSubmit(onSubmit)}
        loading={isCreating || isUpdating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  helper: {
    ...typeRoles.bodySm,
    marginBottom: 16,
  },
  description: {
    minHeight: 112,
    textAlignVertical: 'top',
  },
});
