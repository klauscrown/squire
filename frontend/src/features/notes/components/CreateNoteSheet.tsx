import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { GrimoireInput, GrimoireOptionPills } from '@/components/grimoire';
import { FormSheet } from '@/components/ui';
import { GrimoireGoldButton } from '@/features/auth/components';

import { useCreateNote } from '../hooks';
import { createNoteSchema, type CreateNoteInput } from '../types';

interface CreateNoteSheetProps {
  visible: boolean;
  campaignId: string;
  onClose: () => void;
}

export function CreateNoteSheet({ visible, campaignId, onClose }: CreateNoteSheetProps) {
  const { mutate: createNote, isPending } = useCreateNote(campaignId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  function handleClose() {
    reset();
    onClose();
  }

  function onSubmit(data: CreateNoteInput) {
    createNote(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  }

  return (
    <FormSheet visible={visible} title="Nova Runa" onClose={handleClose}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Título"
            placeholder="Nome da anotação"
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
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Conteúdo"
            placeholder="Escreva sua anotação..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.content?.message}
            multiline
            numberOfLines={8}
            style={{ minHeight: 160, textAlignVertical: 'top' }}
          />
        )}
      />

      <GrimoireGoldButton
        title="Gravar runa"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />
    </FormSheet>
  );
}
