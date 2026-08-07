import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  HelpCircle,
  ImagePlus,
  Paperclip,
  Plus,
  Sparkles,
  Trash2,
  Users,
  Wand2,
} from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { grimoireImages } from '@/assets/grimoire';
import { GrimoireAtmosphereShell } from '@/components/grimoire/GrimoireAtmosphere';
import { useCreateCampaign } from '@/features/campaign/hooks';
import { createCampaignSchema, type CreateCampaignInput } from '@/features/campaign/types';
import { useComponents, useGrimoire, useOpacity } from '@/hooks/useTheme';
import { pickImageFromLibrary } from '@/services/media/pickImage';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import {
  CREATE_STEPS,
  INITIAL_LEVELS,
  RPG_SYSTEMS,
  createEmptyCharacter,
  type CharacterDraft,
} from './constants';
import { OptionPickerModal } from './OptionPickerModal';
import { PremiumField, PremiumSelect } from './PremiumField';

type PickerKind = 'system' | 'level' | null;

function CharacterRow({
  character,
  index,
  canRemove,
  onChange,
  onRemove,
  onAttach,
}: {
  character: CharacterDraft;
  index: number;
  canRemove: boolean;
  onChange: (id: string, patch: Partial<CharacterDraft>) => void;
  onRemove: (id: string) => void;
  onAttach: (id: string) => void;
}) {
  const palette = useActivePalette();
  const surface = useComponents().surfaceCard;
  const elevated = surface.variants.elevated;
  const interactive = surface.variants.interactive;

  return (
    <View
      style={[
        styles.characterCard,
        {
          backgroundColor: elevated.background,
          borderColor: elevated.border,
          borderWidth: surface.borderWidth,
        },
      ]}
    >
      <View style={styles.characterHeader}>
        <Text style={[styles.characterIndex, { color: palette.textSecondary }]}>
          Personagem {index + 1}
        </Text>
        {canRemove ? (
          <Pressable
            onPress={() => onRemove(character.id)}
            hitSlop={8}
            style={styles.characterRemove}
            accessibilityLabel="Remover personagem"
          >
            <Trash2 size={15} color="rgba(248, 113, 113, 0.85)" strokeWidth={1.75} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.characterFields}>
        <View style={styles.characterField}>
          <Text style={[styles.characterLabel, { color: palette.textSecondary }]}>
            Nome (opcional)
          </Text>
          <TextInput
            value={character.name}
            onChangeText={(text) => onChange(character.id, { name: text })}
            placeholder="Ex: Aelindra"
            placeholderTextColor={`${palette.textSecondary}6B`}
            style={[
              styles.characterInput,
              {
                backgroundColor: interactive.background,
                borderColor: elevated.border,
                borderWidth: surface.borderWidth,
                color: palette.textPrimary,
              },
            ]}
          />
        </View>

        <View style={styles.characterField}>
          <Text style={[styles.characterLabel, { color: palette.textSecondary }]}>
            Classe (opcional)
          </Text>
          <TextInput
            value={character.className}
            onChangeText={(text) => onChange(character.id, { className: text })}
            placeholder="Ex: Ladina"
            placeholderTextColor={`${palette.textSecondary}6B`}
            style={[
              styles.characterInput,
              {
                backgroundColor: interactive.background,
                borderColor: elevated.border,
                borderWidth: surface.borderWidth,
                color: palette.textPrimary,
              },
            ]}
          />
        </View>

        <Pressable
          onPress={() => onAttach(character.id)}
          style={[
            styles.attachBtn,
            {
              backgroundColor: interactive.background,
              borderColor: character.attachmentUri ? palette.accent : elevated.border,
              borderWidth: surface.borderWidth,
            },
          ]}
          accessibilityLabel="Anexar arquivo"
        >
          <Paperclip
            size={18}
            color={character.attachmentUri ? palette.accent : palette.textSecondary}
            strokeWidth={1.75}
          />
        </Pressable>
      </View>

      {character.attachmentUri ? (
        <Text style={[styles.attachHint, { color: palette.accent }]} numberOfLines={1}>
          Anexo adicionado
        </Text>
      ) : null}
    </View>
  );
}

export function CreateCampaignScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useActivePalette();
  const grimoire = useGrimoire();
  const opacity = useOpacity();
  const components = useComponents();
  const surface = components.surfaceCard;
  const elevated = surface.variants.elevated;
  const cta = components.cta;
  const secondary = grimoire.colors.ivoryDim;

  const footerPadBottom = Math.max(insets.bottom, 10);
  /** Barra do botão ~48 + padding top/bottom — sem “tab strip” cheia de fundo opaco */
  const footerHeight = 10 + (MIN_TOUCH_TARGET + 4) + footerPadBottom;

  const { mutate: createCampaign, isPending } = useCreateCampaign();
  const [step, setStep] = useState(0);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [initialLevel, setInitialLevel] = useState<string | undefined>();
  const [characters, setCharacters] = useState<CharacterDraft[]>([createEmptyCharacter()]);
  const [picker, setPicker] = useState<PickerKind>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateCampaignInput>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      title: '',
      description: '',
      system: '',
      status: 'active',
      playersCount: undefined,
    },
    mode: 'onChange',
  });

  const title = watch('title') ?? '';
  const description = watch('description') ?? '';
  const system = watch('system') ?? '';

  const filledCharacters = characters.filter(
    (character) => character.name.trim() || character.className.trim(),
  );

  function updateCharacter(id: string, patch: Partial<CharacterDraft>) {
    setCharacters((current) =>
      current.map((character) => (character.id === id ? { ...character, ...patch } : character)),
    );
  }

  function addCharacter() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCharacters((current) => [...current, createEmptyCharacter()]);
  }

  function removeCharacter(id: string) {
    setCharacters((current) =>
      current.length <= 1 ? current : current.filter((character) => character.id !== id),
    );
  }

  async function handlePickImage() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const picked = await pickImageFromLibrary();
    if (picked?.uri) setCoverUri(picked.uri);
  }

  async function handleAttachCharacter(id: string) {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const picked = await pickImageFromLibrary();
    if (picked?.uri) updateCharacter(id, { attachmentUri: picked.uri });
  }

  function handleBack() {
    if (step > 0) {
      setStep((current) => current - 1);
      return;
    }
    router.back();
  }

  function showHelp() {
    Alert.alert(
      'Nova campanha',
      'Preencha as informações básicas, adicione personagens opcionalmente e revise antes de criar.',
    );
  }

  async function handleContinue() {
    if (step === 0) {
      const valid = await trigger(['title', 'system']);
      if (!valid) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      setStep(2);
      return;
    }
    handleSubmit(onSubmit)();
  }

  function onSubmit(data: CreateCampaignInput) {
    const playersCount = filledCharacters.length > 0 ? filledCharacters.length : undefined;

    createCampaign(
      {
        ...data,
        playersCount,
        coverLocalUri: coverUri,
      },
      {
        onSuccess: (campaign) => {
          router.replace(`/(app)/campaigns/${campaign.id}`);
        },
      },
    );
  }

  function renderStepper() {
    return (
      <View style={styles.stepperWrap}>
        <View style={[styles.stepperTrack, { backgroundColor: opacity.card.subtle }]} />
        <View style={styles.stepperRow}>
          {CREATE_STEPS.map((item, index) => {
            const isActive = index === step;
            const isDone = index < step;
            return (
              <View key={item.id} style={styles.stepCol}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor: isActive
                        ? palette.accent
                        : isDone
                          ? `${palette.accent}3D`
                          : elevated.background,
                      borderColor: isActive || isDone ? palette.accent : elevated.border,
                      borderWidth: surface.borderWidth,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      {
                        color:
                          isActive || isDone ? cta.foreground : secondary,
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: isActive
                        ? palette.accent
                        : isDone
                          ? palette.accentSoft
                          : secondary,
                      fontFamily: isActive
                        ? typeRoles.label.fontFamily
                        : typeRoles.caption.fontFamily,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  function renderHero() {
    return (
      <View style={styles.hero}>
        <View
          style={[
            styles.heroIcon,
            {
              backgroundColor: opacity.card.subtle,
              borderColor: elevated.border,
              borderWidth: surface.borderWidth,
            },
          ]}
        >
          <Wand2 size={16} color={palette.accent} strokeWidth={1.7} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={[styles.heroTitle, { color: palette.accent }]} maxFontSizeMultiplier={1.2}>
            Crie uma nova campanha
          </Text>
          <Text style={[styles.heroSubtitle, { color: secondary }]} maxFontSizeMultiplier={1.25}>
            Dê vida ao seu mundo e guarde todas as memórias da sua história.
          </Text>
        </View>
      </View>
    );
  }

  function renderStepOneSections() {
    return (
      <>
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionHeading, { color: palette.textPrimary }]}>
            Imagem da campanha (opcional)
          </Text>
          <Pressable
            onPress={handlePickImage}
            style={[
              styles.imageCard,
              {
                borderColor: elevated.border,
                borderWidth: surface.borderWidth,
                borderRadius: components.radius.md,
              },
            ]}
          >
            <ImageBackground
              source={coverUri ? { uri: coverUri } : grimoireImages.campaignEldoria}
              style={styles.imageBackground}
              imageStyle={{ borderRadius: components.radius.md - 1 }}
            >
              <LinearGradient
                colors={['rgba(11, 17, 32, 0.18)', 'rgba(2, 8, 24, 0.78)']}
                style={styles.imageOverlay}
              >
                <View
                  style={[
                    styles.imageAction,
                    {
                      backgroundColor: opacity.card.medium,
                      borderColor: elevated.border,
                      borderWidth: surface.borderWidth,
                    },
                  ]}
                >
                  <ImagePlus size={18} color={palette.textPrimary} strokeWidth={1.75} />
                </View>
                <Text style={[styles.imageTitle, { color: palette.textPrimary }]}>
                  Adicionar imagem
                </Text>
                <Text style={[styles.imageHint, { color: secondary }]}>
                  PNG, JPG ou WEBP • Máx. 5MB
                </Text>
              </LinearGradient>
            </ImageBackground>
          </Pressable>
        </View>

        <View style={styles.sectionBlock}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <PremiumField
                label="Nome da campanha"
                required
                placeholder="Ex: As Cinzas de Galrasia"
                value={value}
                onChangeText={(text) => onChange(text.slice(0, 60))}
                onBlur={onBlur}
                error={errors.title?.message}
                counter={`${value.length}/60`}
              />
            )}
          />

          <View style={styles.rowFields}>
            <View style={styles.rowField}>
              <Controller
                control={control}
                name="system"
                render={() => (
                  <PremiumSelect
                    label="Sistema"
                    required
                    placeholder="Selecione o sistema"
                    value={system || undefined}
                    error={errors.system?.message}
                    onPress={() => setPicker('system')}
                  />
                )}
              />
            </View>
            <View style={styles.rowField}>
              <PremiumSelect
                label="Nível inicial"
                placeholder="Ex: 1"
                value={initialLevel}
                onPress={() => setPicker('level')}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <PremiumField
                label="Descrição (opcional)"
                placeholder="Conte um pouco sobre o mundo, a história e o tom da campanha..."
                value={value ?? ''}
                onChangeText={(text) => onChange(text.slice(0, 300))}
                onBlur={onBlur}
                error={errors.description?.message}
                counter={`${(value ?? '').length}/300`}
                multiline
                numberOfLines={5}
              />
            )}
          />
        </View>
      </>
    );
  }

  function renderStepContent() {
    if (step === 1) {
      return (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIcon,
                {
                  backgroundColor: `${palette.accent}1F`,
                  borderColor: elevated.border,
                  borderWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Users size={15} color={palette.accent} strokeWidth={2} />
            </View>
            <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Personagens</Text>
          </View>
          <Text style={[styles.sectionHint, { color: secondary }]}>
            Adicione os heróis da campanha de forma opcional. Você pode incluir nome, classe e um
            anexo para cada um.
          </Text>

          {characters.map((character, index) => (
            <CharacterRow
              key={character.id}
              character={character}
              index={index}
              canRemove={characters.length > 1}
              onChange={updateCharacter}
              onRemove={removeCharacter}
              onAttach={handleAttachCharacter}
            />
          ))}

          <Pressable
            onPress={addCharacter}
            style={[
              styles.addCharacterBtn,
              {
                borderColor: elevated.border,
                borderWidth: surface.borderWidth,
                backgroundColor: `${palette.accent}14`,
              },
            ]}
          >
            <Plus size={16} color={palette.accent} strokeWidth={2} />
            <Text style={[styles.addCharacterLabel, { color: palette.accent }]}>
              Adicionar personagem
            </Text>
          </Pressable>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIcon,
                {
                  backgroundColor: `${palette.accent}1F`,
                  borderColor: elevated.border,
                  borderWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <Sparkles size={15} color={palette.accent} strokeWidth={2} />
            </View>
            <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Revisão final</Text>
          </View>
          <View
            style={[
              styles.reviewCard,
              {
                backgroundColor: elevated.background,
                borderColor: elevated.border,
                borderWidth: surface.borderWidth,
              },
            ]}
          >
            <Text style={[styles.reviewLabel, { color: secondary }]}>Campanha</Text>
            <Text style={[styles.reviewValue, { color: palette.textPrimary }]}>{title}</Text>
            <Text style={[styles.reviewLabel, { color: secondary }]}>Sistema</Text>
            <Text style={[styles.reviewValue, { color: palette.textPrimary }]}>
              {system || '—'}
            </Text>
            <Text style={[styles.reviewLabel, { color: secondary }]}>Nível inicial</Text>
            <Text style={[styles.reviewValue, { color: palette.textPrimary }]}>
              {initialLevel || '—'}
            </Text>
            <Text style={[styles.reviewLabel, { color: secondary }]}>Personagens</Text>
            {filledCharacters.length > 0 ? (
              filledCharacters.map((character, index) => (
                <Text
                  key={character.id}
                  style={[styles.reviewValue, { color: palette.textPrimary }]}
                >
                  {index + 1}.{' '}
                  {[character.name.trim() || 'Sem nome', character.className.trim() || 'Sem classe']
                    .filter(Boolean)
                    .join(' • ')}
                  {character.attachmentUri ? ' • Anexo' : ''}
                </Text>
              ))
            ) : (
              <Text style={[styles.reviewValue, { color: palette.textPrimary }]}>
                Nenhum personagem adicionado
              </Text>
            )}
            {description ? (
              <>
                <Text style={[styles.reviewLabel, { color: secondary }]}>Descrição</Text>
                <Text style={[styles.reviewValue, { color: palette.textPrimary }]}>
                  {description}
                </Text>
              </>
            ) : null}
          </View>
        </View>
      );
    }

    return null;
  }

  const continueLabel =
    isPending
      ? 'Criando...'
      : step === CREATE_STEPS.length - 1
        ? 'Criar campanha'
        : 'OK';

  return (
    <GrimoireAtmosphereShell>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          <View style={styles.header}>
            <Pressable
              onPress={handleBack}
              style={[
                styles.headerBtn,
                {
                  backgroundColor: opacity.card.subtle,
                  borderColor: elevated.border,
                  borderWidth: surface.borderWidth,
                },
              ]}
              hitSlop={8}
              accessibilityLabel="Voltar"
            >
              <ArrowLeft size={24} color={palette.textPrimary} strokeWidth={1.75} />
            </Pressable>
            <View style={styles.headerCenter}>
              <Text
                style={[styles.headerTitle, { color: palette.accent }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
                maxFontSizeMultiplier={1.2}
              >
                Nova Campanha
              </Text>
              <View style={[styles.progressTrack, { backgroundColor: opacity.card.subtle }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((step + 1) / CREATE_STEPS.length) * 100}%`,
                      backgroundColor: palette.accent,
                    },
                  ]}
                />
              </View>
            </View>
            <Pressable
              onPress={showHelp}
              style={[
                styles.headerBtn,
                {
                  backgroundColor: opacity.card.subtle,
                  borderColor: elevated.border,
                  borderWidth: surface.borderWidth,
                },
              ]}
              hitSlop={8}
              accessibilityLabel="Ajuda"
            >
              <HelpCircle size={24} color={palette.textSecondary} strokeWidth={1.75} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: footerHeight + 28 },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {step === 0 ? renderHero() : null}
            {renderStepper()}
            {step === 0 ? renderStepOneSections() : renderStepContent()}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* CTA flutuante — sem faixa preta de “tab” embaixo */}
        <View
          pointerEvents="box-none"
          style={[styles.footer, { paddingBottom: footerPadBottom }]}
        >
          <Pressable
            onPress={handleContinue}
            disabled={isPending}
            style={({ pressed }) => [
              styles.continueBtn,
              {
                borderRadius: cta.radius,
                backgroundColor: palette.buttonPrimary,
                minHeight: MIN_TOUCH_TARGET + 4,
                opacity: isPending ? 0.72 : pressed ? 0.9 : 1,
                ...Platform.select({
                  ios: {
                    shadowColor: palette.buttonPrimary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.45,
                    shadowRadius: 12,
                  },
                  android: { elevation: 10 },
                  default: {},
                }),
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={continueLabel}
          >
            <Text style={[styles.continueLabel, { color: cta.foreground }]}>{continueLabel}</Text>
          </Pressable>
        </View>

        <OptionPickerModal
          visible={picker === 'system'}
          title="Selecione o sistema"
          options={RPG_SYSTEMS}
          selected={system || undefined}
          onSelect={(value) => setValue('system', value, { shouldValidate: true })}
          onClose={() => setPicker(null)}
        />

        <OptionPickerModal
          visible={picker === 'level'}
          title="Nível inicial"
          options={INITIAL_LEVELS}
          selected={initialLevel}
          onSelect={setInitialLevel}
          onClose={() => setPicker(null)}
        />
      </View>
    </GrimoireAtmosphereShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    flexShrink: 0,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    ...typeRoles.title,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0.3,
    textAlign: 'center',
    width: '100%',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    gap: 22,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 2,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
  },
  heroTitle: {
    ...typeRoles.titleSm,
    fontSize: 16,
    lineHeight: 22,
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    ...typeRoles.editorialSm,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    maxWidth: 300,
  },
  stepperWrap: {
    position: 'relative',
    paddingTop: 4,
    paddingBottom: 6,
  },
  stepperTrack: {
    position: 'absolute',
    top: 19,
    left: '12%',
    right: '12%',
    height: 2,
    borderRadius: 999,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    ...typeRoles.caption,
    fontFamily: typeRoles.buttonSm.fontFamily,
  },
  stepLabel: {
    ...typeRoles.caption,
    fontSize: 10,
    textAlign: 'center',
  },
  sectionBlock: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  sectionIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    ...typeRoles.label,
    fontFamily: typeRoles.buttonSm.fontFamily,
    marginBottom: 4,
  },
  sectionTitle: {
    ...typeRoles.label,
    fontFamily: typeRoles.buttonSm.fontFamily,
  },
  sectionHint: {
    ...typeRoles.bodySm,
    marginBottom: 4,
  },
  imageCard: {
    overflow: 'hidden',
  },
  imageBackground: {
    minHeight: 168,
    justifyContent: 'center',
  },
  imageOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  imageAction: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  imageTitle: {
    ...typeRoles.label,
    fontFamily: typeRoles.buttonSm.fontFamily,
  },
  imageHint: {
    ...typeRoles.caption,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
    minWidth: 0,
  },
  characterCard: {
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  characterIndex: {
    ...typeRoles.caption,
  },
  characterRemove: {
    padding: 4,
  },
  characterFields: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  characterField: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  characterLabel: {
    ...typeRoles.label,
    fontSize: 12,
  },
  characterInput: {
    minHeight: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    ...typeRoles.body,
  },
  attachBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachHint: {
    ...typeRoles.caption,
  },
  addCharacterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addCharacterLabel: {
    ...typeRoles.buttonSm,
  },
  reviewCard: {
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  reviewLabel: {
    ...typeRoles.badge,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  reviewValue: {
    ...typeRoles.body,
    fontSize: 15,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    elevation: 50,
    paddingHorizontal: 22,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  continueBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  continueLabel: {
    ...typeRoles.button,
    fontSize: 16,
  },
});
