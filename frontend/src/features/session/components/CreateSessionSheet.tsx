import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { GrimoireInput, GrimoireOptionPills } from '@/components/grimoire';
import { FormSheet } from '@/components/ui';
import { GrimoireGoldButton } from '@/features/auth/components';

import { useCreateSession } from '../hooks';
import {
  createSessionSchema,
  STATUS_LABELS,
  type CreateSessionInput,
  type SessionStatus,
} from '../types';

interface CreateSessionSheetProps {
  visible: boolean;
  campaignId: string;
  onClose: () => void;
}

const STATUS_OPTIONS: SessionStatus[] = ['planned', 'completed', 'cancelled'];

export function CreateSessionSheet({ visible, campaignId, onClose }: CreateSessionSheetProps) {
  const { mutate: createSession, isPending } = useCreateSession(campaignId);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      title: '',
      sessionNumber: '',
      playedAt: '',
      summary: '',
      status: 'planned',
    },
  });

  const selectedStatus = watch('status');

  function handleClose() {
    reset();
    onClose();
  }

  function onSubmit(data: CreateSessionInput) {
    createSession(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  }

  return (
    <FormSheet visible={visible} title="Nova Sessão" onClose={handleClose}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Título"
            placeholder="Nome da sessão"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.title?.message}
            autoFocus
          />
        )}
      />

      <Controller
        control={control}
        name="sessionNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Número"
            placeholder="Auto (próximo disponível)"
            value={value?.toString() ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.sessionNumber?.message}
            keyboardType="number-pad"
          />
        )}
      />

      <Controller
        control={control}
        name="playedAt"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Data"
            placeholder="DD/MM/AAAA"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.playedAt?.message}
          />
        )}
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
        name="summary"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Resumo"
            placeholder="O que aconteceu nesta sessão..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.summary?.message}
            multiline
            numberOfLines={6}
            style={{ minHeight: 120, textAlignVertical: 'top' }}
          />
        )}
      />

      <GrimoireGoldButton
        title="Registrar sessão"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />
    </FormSheet>
  );
}
