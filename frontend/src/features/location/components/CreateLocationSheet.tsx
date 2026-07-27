import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { GrimoireInput, GrimoireOptionPills } from '@/components/grimoire';
import { FormSheet } from '@/components/ui';
import { GrimoireGoldButton } from '@/features/auth/components';

import { useCreateLocation } from '../hooks';
import {
  createLocationSchema,
  LOCATION_TYPE_OPTIONS,
  TYPE_LABELS,
  type CreateLocationInput,
  type LocationType,
} from '../types';

interface CreateLocationSheetProps {
  visible: boolean;
  campaignId: string;
  onClose: () => void;
}

export function CreateLocationSheet({ visible, campaignId, onClose }: CreateLocationSheetProps) {
  const { mutate: createLocation, isPending } = useCreateLocation(campaignId);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateLocationInput>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      name: '',
      type: 'other',
      region: '',
      description: '',
    },
  });

  const selectedType = (watch('type') ?? 'other') as LocationType;

  function handleClose() {
    reset();
    onClose();
  }

  function onSubmit(data: CreateLocationInput) {
    createLocation(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  }

  return (
    <FormSheet visible={visible} title="Novo local" onClose={handleClose}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Nome"
            placeholder="Ex.: Taverna do Corvo"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            autoFocus
          />
        )}
      />

      <GrimoireOptionPills
        label="Tipo"
        options={LOCATION_TYPE_OPTIONS}
        value={selectedType}
        onChange={(type) => setValue('type', type)}
        getLabel={(type) => TYPE_LABELS[type]}
      />

      <Controller
        control={control}
        name="region"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Região"
            placeholder="Ex.: Reino do Norte, Costa Esmeralda"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.region?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Descrição"
            placeholder="Atmosfera, habitantes, segredos..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.description?.message}
            multiline
            numberOfLines={6}
            style={{ minHeight: 120, textAlignVertical: 'top' }}
          />
        )}
      />

      <GrimoireGoldButton
        title="Registrar local"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />
    </FormSheet>
  );
}
