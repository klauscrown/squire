import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { GrimoireInput, GrimoireOptionPills } from '@/components/grimoire';
import { FormSheet } from '@/components/ui';
import { GrimoireGoldButton } from '@/features/auth/components';

import { useCreateNpc } from '../hooks';
import {
  createNpcSchema,
  DISPOSITION_LABELS,
  STATUS_LABELS,
  type CreateNpcInput,
  type NpcDisposition,
  type NpcStatus,
} from '../types';

interface CreateNpcSheetProps {
  visible: boolean;
  campaignId: string;
  onClose: () => void;
}

const DISPOSITION_OPTIONS: NpcDisposition[] = ['ally', 'neutral', 'enemy', 'unknown'];
const STATUS_OPTIONS: NpcStatus[] = ['alive', 'dead', 'missing'];

export function CreateNpcSheet({ visible, campaignId, onClose }: CreateNpcSheetProps) {
  const { mutate: createNpc, isPending } = useCreateNpc(campaignId);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateNpcInput>({
    resolver: zodResolver(createNpcSchema),
    defaultValues: {
      name: '',
      role: '',
      race: '',
      classType: '',
      location: '',
      description: '',
      disposition: 'unknown',
      status: 'alive',
    },
  });

  const selectedDisposition = watch('disposition');
  const selectedStatus = (watch('status') ?? 'alive') as NpcStatus;

  function handleClose() {
    reset();
    onClose();
  }

  function onSubmit(data: CreateNpcInput) {
    createNpc(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  }

  return (
    <FormSheet visible={visible} title="Novo NPC" onClose={handleClose}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Nome"
            placeholder="Nome do personagem"
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
        name="role"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Função"
            placeholder="Ex.: Taberneiro, Líder da guilda"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.role?.message}
          />
        )}
      />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="race"
            render={({ field: { onChange, onBlur, value } }) => (
              <GrimoireInput
                label="Raça"
                placeholder="Humano, Elfo..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.race?.message}
              />
            )}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="classType"
            render={({ field: { onChange, onBlur, value } }) => (
              <GrimoireInput
                label="Classe"
                placeholder="Druida, Guarda..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.classType?.message}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Localização"
            placeholder="Ex: Nova Malpetrim, Taverna..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.location?.message}
          />
        )}
      />

      <GrimoireOptionPills
        label="Disposição"
        options={DISPOSITION_OPTIONS}
        value={selectedDisposition}
        onChange={(disposition) => setValue('disposition', disposition)}
        getLabel={(disposition) => DISPOSITION_LABELS[disposition]}
      />

      <GrimoireOptionPills
        label="Status"
        options={STATUS_OPTIONS}
        value={selectedStatus}
        onChange={(status) => setValue('status', status)}
        getLabel={(status) => STATUS_LABELS[status]}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Descrição"
            placeholder="Aparência, personalidade, segredos..."
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
        title="Convocar NPC"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />
    </FormSheet>
  );
}
