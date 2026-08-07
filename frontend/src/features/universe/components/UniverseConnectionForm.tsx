import { zodResolver } from '@hookform/resolvers/zod';
import { Link2 } from 'lucide-react-native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { GrimoireInput } from '@/components/grimoire';
import { SurfaceCard } from '@/components/ui';
import { GrimoireGoldButton } from '@/features/auth/components';
import { useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_CATEGORY_ICONS } from '../data/categoryIcons';
import { UNIVERSE_CATEGORY_META } from '../data/demoUniverse';
import { useCreateUniverseConnection } from '../hooks';
import {
  createUniverseConnectionSchema,
  type CreateUniverseConnectionInput,
  type UniverseElement,
  type UniverseElementSummary,
} from '../types';

interface UniverseConnectionFormProps {
  source: UniverseElement;
  candidates: readonly UniverseElementSummary[];
  onCreated: () => void;
}

export function UniverseConnectionForm({
  source,
  candidates,
  onCreated,
}: UniverseConnectionFormProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();
  const { mutate: createConnection, isPending } = useCreateUniverseConnection(
    source.id,
    source.universeId,
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateUniverseConnectionInput>({
    resolver: zodResolver(createUniverseConnectionSchema),
    defaultValues: {
      targetElementId: '',
      relationLabel: '',
      inverseRelationLabel: '',
      context: '',
      isSecret: false,
      startedAt: '',
      endedAt: '',
    },
  });

  const targetId = useWatch({ control, name: 'targetElementId' });

  function onSubmit(input: CreateUniverseConnectionInput) {
    createConnection(input, { onSuccess: onCreated });
  }

  return (
    <View>
      <View style={styles.introRow}>
        <Link2 size={19} color={palette.accent} strokeWidth={1.7} />
        <Text style={[styles.intro, { color: palette.textSecondary }]}>
          Relacione {source.name} a outro conteúdo. A relação aparecerá nas duas fichas.
        </Text>
      </View>

      <Text style={[styles.fieldLabel, { color: palette.accent }]}>Conteúdo relacionado</Text>
      <View style={styles.candidateList}>
        {candidates.map((candidate) => {
          const selected = candidate.id === targetId;
          const Icon = UNIVERSE_CATEGORY_ICONS[candidate.category];
          return (
            <SurfaceCard
              key={candidate.id}
              variant="interactive"
              radius="sm"
              padding="sm"
              shadow={false}
              onPress={() => setValue('targetElementId', candidate.id, { shouldValidate: true })}
              accessibilityLabel={`Relacionar a ${candidate.name}`}
              style={styles.candidate}
              contentStyle={styles.candidateContent}
            >
              <View
                style={[
                  styles.candidateIcon,
                  {
                    borderColor: selected ? opacity.border.goldStrong : opacity.border.goldSubtle,
                    backgroundColor: selected ? opacity.card.medium : opacity.card.subtle,
                  },
                ]}
              >
                <Icon size={17} color={palette.accent} strokeWidth={1.7} />
              </View>
              <View style={styles.candidateCopy}>
                <Text style={[styles.candidateName, { color: palette.textPrimary }]}>
                  {candidate.name}
                </Text>
                <Text style={[styles.candidateCategory, { color: palette.textSecondary }]}>
                  {UNIVERSE_CATEGORY_META[candidate.category].singular}
                </Text>
              </View>
            </SurfaceCard>
          );
        })}
      </View>
      {errors.targetElementId?.message ? (
        <Text style={[styles.validationText, { color: palette.accent }]}>
          {errors.targetElementId.message}
        </Text>
      ) : null}

      <Controller
        control={control}
        name="relationLabel"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Relação"
            placeholder="Ex.: envolve, pertence a, foi forjada por"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.relationLabel?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="inverseRelationLabel"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Relação inversa opcional"
            placeholder={`Como ${targetId ? 'o outro conteúdo' : 'o destino'} se relaciona a ${source.name}?`}
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.inverseRelationLabel?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="context"
        render={({ field: { onChange, onBlur, value } }) => (
          <GrimoireInput
            label="Contexto opcional"
            placeholder="Uma nota breve sobre esta relação."
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.context?.message}
            multiline
            numberOfLines={3}
            style={styles.contextInput}
          />
        )}
      />

      <View style={styles.submit}>
        <GrimoireGoldButton
          title="Adicionar conexão"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 18,
  },
  intro: {
    ...typeRoles.bodySm,
    flex: 1,
  },
  fieldLabel: {
    ...typeRoles.badge,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  candidateList: {
    gap: 8,
    marginBottom: 8,
  },
  candidate: {
    width: '100%',
  },
  candidateContent: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  candidateIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candidateCopy: {
    flex: 1,
  },
  candidateName: {
    ...typeRoles.label,
  },
  candidateCategory: {
    ...typeRoles.caption,
    marginTop: 1,
  },
  validationText: {
    ...typeRoles.caption,
    marginBottom: 12,
  },
  contextInput: {
    minHeight: 82,
    textAlignVertical: 'top',
  },
  submit: {
    marginTop: 8,
  },
});
