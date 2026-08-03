import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Feather } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import {
  GrimoireDetailActions,
  GrimoireDetailMeta,
  GrimoireDetailScreen,
  GrimoireDetailSection,
  GrimoireInput,
} from '@/components/grimoire';
import { GrimoireGoldButton } from '@/features/auth/components';
import { useDeleteNote, useGetNote, useUpdateNote } from '@/features/notes/hooks';
import { updateNoteSchema, type UpdateNoteInput } from '@/features/notes/types';
import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

function formatDateTime(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NoteDetailScreen() {
  const { id: campaignId, noteId } = useLocalSearchParams<{ id: string; noteId: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const grimoire = useGrimoire();
  const [isEditing, setIsEditing] = useState(false);

  const { data: note, isLoading } = useGetNote(noteId ?? '');
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote(campaignId ?? '');
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote(campaignId ?? '');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateNoteInput>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: { title: '', content: '' },
  });

  useEffect(() => {
    if (note) {
      navigation.setOptions({ headerTitle: note.title });
      reset({ title: note.title, content: note.content });
    }
  }, [note, navigation, reset]);

  function handleCancelEdit() {
    if (note) reset({ title: note.title, content: note.content });
    setIsEditing(false);
  }

  function onSubmit(data: UpdateNoteInput) {
    if (!note) return;
    updateNote({ id: note.id, input: data }, { onSuccess: () => setIsEditing(false) });
  }

  function handleDelete() {
    if (!note) return;
    Alert.alert(
      'Excluir anotação',
      `Tem certeza que deseja excluir "${note.title}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteNote(note.id, { onSuccess: () => router.back() }),
        },
      ],
    );
  }

  if (isLoading) {
    return <GrimoireDetailScreen loading />;
  }

  if (!note) {
    return (
      <GrimoireDetailScreen
        notFoundMessage="Anotação não encontrada"
        onBack={() => router.back()}
      />
    );
  }

  if (isEditing) {
    return (
      <GrimoireDetailScreen>
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
              numberOfLines={10}
              style={{ minHeight: 200, textAlignVertical: 'top' }}
              containerStyle={styles.contentField}
            />
          )}
        />

        <GrimoireGoldButton title="Salvar" onPress={handleSubmit(onSubmit)} loading={isUpdating} />
        <GrimoireGoldButton title="Cancelar" variant="outline" onPress={handleCancelEdit} />
      </GrimoireDetailScreen>
    );
  }

  return (
    <GrimoireDetailScreen>
      <GrimoireDetailSection title="Registro do grimório" icon={Feather} quote>
        {note.content ? (
          <Text style={[styles.bodyText, { color: `${grimoire.colors.ivory}E6` }]}>
            {note.content}
          </Text>
        ) : (
          <Text style={[styles.mutedText, { color: grimoire.colors.ivoryDim }]}>Sem conteúdo</Text>
        )}
      </GrimoireDetailSection>

      <GrimoireDetailMeta>
        Criada em {formatDateTime(note.createdAt)} · Atualizada em {formatDateTime(note.updatedAt)}
      </GrimoireDetailMeta>

      <GrimoireDetailActions
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        deleteLabel="Excluir anotação"
        deleting={isDeleting}
      />
    </GrimoireDetailScreen>
  );
}

const styles = StyleSheet.create({
  bodyText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    lineHeight: 24,
  },
  mutedText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  contentField: {
    marginBottom: 20,
  },
});
