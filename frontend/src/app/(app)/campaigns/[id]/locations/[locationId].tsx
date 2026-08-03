import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FileText } from 'lucide-react-native';
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
  LocationImageCard,
  LocationTypeBadge,
} from '@/features/location/components';
import { useDeleteLocation, useGetLocation, useUpdateLocation } from '@/features/location/hooks';
import { useUpdateLocationImage } from '@/features/location/hooks/useUpdateLocationImage';
import {
  LOCATION_TYPE_OPTIONS,
  TYPE_LABELS,
  updateLocationSchema,
  type LocationType,
  type UpdateLocationInput,
} from '@/features/location/types';
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

export default function LocationDetailScreen() {
  const { id: campaignId, locationId } = useLocalSearchParams<{
    id: string;
    locationId: string;
  }>();
  const router = useRouter();
  const navigation = useNavigation();
  const grimoire = useGrimoire();
  const [isEditing, setIsEditing] = useState(false);

  const { data: location, isLoading } = useGetLocation(locationId ?? '');
  const { mutate: updateLocation, isPending: isUpdating } = useUpdateLocation(campaignId ?? '');
  const { mutate: deleteLocation, isPending: isDeleting } = useDeleteLocation(campaignId ?? '');
  const { mutate: updateImage, isPending: isUploadingImage } = useUpdateLocationImage(
    campaignId ?? '',
    locationId ?? '',
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateLocationInput>({
    resolver: zodResolver(updateLocationSchema),
    defaultValues: {
      name: '',
      type: 'other',
      region: '',
      description: '',
    },
  });

  const selectedType = (watch('type') ?? 'other') as LocationType;

  useEffect(() => {
    if (location) {
      navigation.setOptions({ headerTitle: location.name });
      reset({
        name: location.name,
        type: location.type,
        region: location.region ?? '',
        description: location.description,
      });
    }
  }, [location, navigation, reset]);

  function handleCancelEdit() {
    if (location) {
      reset({
        name: location.name,
        type: location.type,
        region: location.region ?? '',
        description: location.description,
      });
    }
    setIsEditing(false);
  }

  function onSubmit(data: UpdateLocationInput) {
    if (!location) return;
    updateLocation({ id: location.id, input: data }, { onSuccess: () => setIsEditing(false) });
  }

  function handleDelete() {
    if (!location) return;
    Alert.alert(
      'Excluir local',
      `Tem certeza que deseja excluir "${location.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteLocation(location.id, { onSuccess: () => router.back() }),
        },
      ],
    );
  }

  if (isLoading) {
    return <GrimoireDetailScreen loading glow="petrol-left" />;
  }

  if (!location) {
    return (
      <GrimoireDetailScreen notFoundMessage="Local não encontrado" onBack={() => router.back()} />
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
              placeholder="Nome do local"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
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
              placeholder="Ex.: Reino do Norte"
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
        <LocationTypeBadge type={location.type} />
        {location.region ? (
          <Text style={[styles.region, { color: grimoire.colors.goldMuted }]}>
            {location.region}
          </Text>
        ) : null}
      </View>

      <LocationImageCard
        imageUrl={location.imageUrl}
        onPress={() => updateImage()}
        loading={isUploadingImage}
      />

      <GrimoireDetailSection title="Descrição" icon={FileText} quote>
        {location.description ? (
          <Text style={[styles.bodyText, { color: `${grimoire.colors.ivory}E6` }]}>
            {location.description}
          </Text>
        ) : (
          <Text style={[styles.mutedText, { color: grimoire.colors.ivoryDim }]}>
            Sem descrição
          </Text>
        )}
      </GrimoireDetailSection>

      <GrimoireDetailMeta>
        Criado em {formatDateTime(location.createdAt)} · Atualizado em{' '}
        {formatDateTime(location.updatedAt)}
      </GrimoireDetailMeta>

      <GrimoireDetailActions
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        deleteLabel="Excluir local"
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
  region: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
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
  descriptionField: {
    marginBottom: 20,
  },
});
