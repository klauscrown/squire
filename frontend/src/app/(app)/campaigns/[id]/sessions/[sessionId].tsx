import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import {
  GrimoireDetailActions,
  GrimoireDetailMeta,
  GrimoireDetailScreen,
  GrimoireDetailSection,
  GrimoireInput,
  GrimoireOptionPills,
} from '@/components/grimoire';
import { GrimoireGoldButton } from '@/features/auth/components';
import { SessionStatusBadge } from '@/features/session/components';
import { useDeleteSession, useGetSession, useUpdateSession } from '@/features/session/hooks';
import {
  formatDateInput,
  STATUS_LABELS,
  updateSessionSchema,
  type SessionStatus,
  type UpdateSessionInput,
} from '@/features/session/types';
import { grimoire } from '@/theme/grimoire';
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

const STATUS_OPTIONS: SessionStatus[] = ['planned', 'completed', 'cancelled'];

export default function SessionDetailScreen() {
  const { id: campaignId, sessionId } = useLocalSearchParams<{
    id: string;
    sessionId: string;
  }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  const { data: session, isLoading } = useGetSession(sessionId ?? '');
  const { mutate: updateSession, isPending: isUpdating } = useUpdateSession(campaignId ?? '');
  const { mutate: deleteSession, isPending: isDeleting } = useDeleteSession(campaignId ?? '');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateSessionInput>({
    resolver: zodResolver(updateSessionSchema),
    defaultValues: {
      title: '',
      sessionNumber: undefined,
      playedAt: '',
      summary: '',
      status: 'planned',
    },
  });

  const selectedStatus = watch('status');

  useEffect(() => {
    if (session) {
      navigation.setOptions({ headerTitle: session.title });
      reset({
        title: session.title,
        sessionNumber: session.sessionNumber,
        playedAt: formatDateInput(session.playedAt),
        summary: session.summary,
        status: session.status,
      });
    }
  }, [session, navigation, reset]);

  function handleCancelEdit() {
    if (session) {
      reset({
        title: session.title,
        sessionNumber: session.sessionNumber,
        playedAt: formatDateInput(session.playedAt),
        summary: session.summary,
        status: session.status,
      });
    }
    setIsEditing(false);
  }

  function onSubmit(data: UpdateSessionInput) {
    if (!session) return;
    updateSession({ id: session.id, input: data }, { onSuccess: () => setIsEditing(false) });
  }

  function handleDelete() {
    if (!session) return;
    Alert.alert(
      'Excluir sessão',
      `Tem certeza que deseja excluir "${session.title}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteSession(session.id, { onSuccess: () => router.back() }),
        },
      ],
    );
  }

  if (isLoading) {
    return <GrimoireDetailScreen loading />;
  }

  if (!session) {
    return (
      <GrimoireDetailScreen
        notFoundMessage="Sessão não encontrada"
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
              placeholder="Nome da sessão"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="sessionNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <GrimoireInput
              label="Número da sessão"
              placeholder="1"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(text ? Number(text) : undefined)}
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
              label="Data da sessão"
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
          value={selectedStatus ?? 'planned'}
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
              numberOfLines={8}
              style={{ minHeight: 160, textAlignVertical: 'top' }}
              containerStyle={styles.summaryField}
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
      <View style={styles.badgesRow}>
        {session.sessionNumber != null ? (
          <Text style={styles.sessionNumber}>Sessão #{session.sessionNumber}</Text>
        ) : null}
        <SessionStatusBadge status={session.status} />
      </View>

      <GrimoireDetailSection title="Resumo da jornada" icon={BookOpen} quote>
        {session.summary ? (
          <Text style={styles.bodyText}>{session.summary}</Text>
        ) : (
          <Text style={styles.mutedText}>Sem resumo registrado</Text>
        )}
      </GrimoireDetailSection>

      <GrimoireDetailMeta>
        {session.playedAt ? `Jogada em ${formatDateTime(session.playedAt)} · ` : ''}
        Criada em {formatDateTime(session.createdAt)} · Atualizada em{' '}
        {formatDateTime(session.updatedAt)}
      </GrimoireDetailMeta>

      <GrimoireDetailActions
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        deleteLabel="Excluir sessão"
        deleting={isDeleting}
      />
    </GrimoireDetailScreen>
  );
}

const styles = StyleSheet.create({
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  sessionNumber: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: grimoire.colors.goldMuted,
  },
  bodyText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    lineHeight: 24,
    color: `${grimoire.colors.ivory}E6`,
  },
  mutedText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 22,
    color: grimoire.colors.ivoryDim,
  },
  summaryField: {
    marginBottom: 20,
  },
});
