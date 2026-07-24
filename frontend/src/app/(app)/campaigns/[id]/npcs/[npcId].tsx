import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FileText, Shield } from 'lucide-react-native';
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
import {
  NpcDispositionBadge,
  NpcPortraitCard,
  NpcStatusBadge,
  NpcStatusSelector,
} from '@/features/npc/components';
import { useDeleteNpc, useGetNpc, useUpdateNpc } from '@/features/npc/hooks';
import { useUpdateNpcPortrait } from '@/features/npc/hooks/useUpdateNpcPortrait';
import {
  DISPOSITION_LABELS,
  updateNpcSchema,
  type NpcDisposition,
  type NpcStatus,
  type UpdateNpcInput,
} from '@/features/npc/types';
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

const DISPOSITION_OPTIONS: NpcDisposition[] = ['ally', 'neutral', 'enemy', 'unknown'];

export default function NpcDetailScreen() {
  const { id: campaignId, npcId } = useLocalSearchParams<{ id: string; npcId: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  const { data: npc, isLoading } = useGetNpc(npcId ?? '');
  const { mutate: updateNpc, isPending: isUpdating } = useUpdateNpc(campaignId ?? '');
  const { mutate: deleteNpc, isPending: isDeleting } = useDeleteNpc(campaignId ?? '');
  const { mutate: updatePortrait, isPending: isUploadingPortrait } = useUpdateNpcPortrait(
    campaignId ?? '',
    npcId ?? '',
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateNpcInput>({
    resolver: zodResolver(updateNpcSchema),
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

  useEffect(() => {
    if (npc) {
      navigation.setOptions({ headerTitle: npc.name });
      reset({
        name: npc.name,
        role: npc.role ?? '',
        race: npc.race ?? '',
        classType: npc.classType ?? '',
        location: npc.location ?? '',
        description: npc.description,
        disposition: npc.disposition,
        status: npc.status,
      });
    }
  }, [npc, navigation, reset]);

  function handleCancelEdit() {
    if (npc) {
      reset({
        name: npc.name,
        role: npc.role ?? '',
        race: npc.race ?? '',
        classType: npc.classType ?? '',
        location: npc.location ?? '',
        description: npc.description,
        disposition: npc.disposition,
        status: npc.status,
      });
    }
    setIsEditing(false);
  }

  function onSubmit(data: UpdateNpcInput) {
    if (!npc) return;
    updateNpc({ id: npc.id, input: data }, { onSuccess: () => setIsEditing(false) });
  }

  function handleDelete() {
    if (!npc) return;
    Alert.alert(
      'Excluir NPC',
      `Tem certeza que deseja excluir "${npc.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteNpc(npc.id, { onSuccess: () => router.back() }),
        },
      ],
    );
  }

  if (isLoading) {
    return <GrimoireDetailScreen loading glow="petrol-left" />;
  }

  if (!npc) {
    return (
      <GrimoireDetailScreen notFoundMessage="NPC não encontrado" onBack={() => router.back()} />
    );
  }

  if (isEditing) {
    return (
      <GrimoireDetailScreen glow="petrol-left">
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
            />
          )}
        />

        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, onBlur, value } }) => (
            <GrimoireInput
              label="Função / Cargo"
              placeholder="Ex.: Taberneiro, Líder da guilda"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.role?.message}
            />
          )}
        />

        <View style={styles.rowInputs}>
          <View style={styles.halfInput}>
            <Controller
              control={control}
              name="race"
              render={({ field: { onChange, onBlur, value } }) => (
                <GrimoireInput
                  label="Raça"
                  placeholder="Ex: Humano"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.race?.message}
                  containerStyle={styles.halfField}
                />
              )}
            />
          </View>
          <View style={styles.halfInput}>
            <Controller
              control={control}
              name="classType"
              render={({ field: { onChange, onBlur, value } }) => (
                <GrimoireInput
                  label="Classe / Tipo"
                  placeholder="Ex: Druida"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.classType?.message}
                  containerStyle={styles.halfField}
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
              placeholder="Ex: Taverna do Corvo"
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
          value={selectedDisposition ?? 'unknown'}
          onChange={(disposition) => setValue('disposition', disposition)}
          getLabel={(disposition) => DISPOSITION_LABELS[disposition]}
        />

        <NpcStatusSelector
          value={selectedStatus}
          onChange={(status) => setValue('status', status)}
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
              numberOfLines={8}
              style={{ minHeight: 160, textAlignVertical: 'top' }}
              containerStyle={styles.descriptionField}
            />
          )}
        />

        <GrimoireGoldButton title="Salvar" onPress={handleSubmit(onSubmit)} loading={isUpdating} />
        <GrimoireGoldButton title="Cancelar" variant="outline" onPress={handleCancelEdit} />
      </GrimoireDetailScreen>
    );
  }

  return (
    <GrimoireDetailScreen glow="petrol-left">
      <View style={styles.badgesRow}>
        {npc.role ? <Text style={styles.role}>{npc.role}</Text> : null}
        <NpcDispositionBadge disposition={npc.disposition} />
        <NpcStatusBadge status={npc.status} />
      </View>

      <NpcPortraitCard
        portraitUrl={npc.portraitUrl}
        onPress={() => updatePortrait()}
        loading={isUploadingPortrait}
      />

      {(npc.race || npc.classType || npc.location) ? (
        <GrimoireDetailSection title="Ficha técnica" icon={Shield}>
          <View style={styles.attrsRow}>
            <View style={styles.attrCol}>
              <Text style={styles.attrLabel}>Raça</Text>
              <Text style={styles.attrValue} numberOfLines={2}>
                {npc.race?.trim() || '—'}
              </Text>
            </View>
            <View style={styles.attrCol}>
              <Text style={styles.attrLabel}>Classe</Text>
              <Text style={styles.attrValue} numberOfLines={2}>
                {npc.classType?.trim() || '—'}
              </Text>
            </View>
          </View>
          {npc.location ? (
            <View style={styles.locationBlock}>
              <Text style={styles.attrLabel}>Localização</Text>
              <Text style={styles.attrValue} numberOfLines={2}>
                {npc.location}
              </Text>
            </View>
          ) : null}
        </GrimoireDetailSection>
      ) : null}

      <GrimoireDetailSection title="Biografia" icon={FileText} quote>
        {npc.description ? (
          <Text style={styles.bodyText}>{npc.description}</Text>
        ) : (
          <Text style={styles.mutedText}>Sem descrição</Text>
        )}
      </GrimoireDetailSection>

      <GrimoireDetailMeta>
        Criado em {formatDateTime(npc.createdAt)} · Atualizado em {formatDateTime(npc.updatedAt)}
      </GrimoireDetailMeta>

      <GrimoireDetailActions
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        deleteLabel="Excluir NPC"
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
  role: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: grimoire.colors.goldMuted,
  },
  attrsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  attrCol: {
    flex: 1,
  },
  attrLabel: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: `${grimoire.colors.ivoryDim}99`,
  },
  attrValue: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 20,
    color: grimoire.colors.ivory,
    marginTop: 4,
  },
  locationBlock: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: grimoire.colors.cardBorder,
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
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  halfField: {
    marginBottom: 0,
  },
  descriptionField: {
    marginBottom: 20,
  },
});
