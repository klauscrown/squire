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
  SlidersHorizontal,
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { grimoireImages } from '@/assets/grimoire';
import { GrimoireAtmosphereShell } from '@/components/grimoire/GrimoireAtmosphere';
import { useCreateCampaign } from '@/features/campaign/hooks';
import { createCampaignSchema, type CreateCampaignInput } from '@/features/campaign/types';
import { pickImageFromLibrary } from '@/services/media/pickImage';
import { grimoire } from '@/theme/grimoire';
import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

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
  return (
    <View style={styles.characterCard}>
      <View style={styles.characterHeader}>
        <Text style={styles.characterIndex}>Personagem {index + 1}</Text>
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
          <Text style={styles.characterLabel}>Nome (opcional)</Text>
          <TextInput
            value={character.name}
            onChangeText={(text) => onChange(character.id, { name: text })}
            placeholder="Ex: Aelindra"
            placeholderTextColor="rgba(148, 163, 184, 0.42)"
            style={styles.characterInput}
          />
        </View>

        <View style={styles.characterField}>
          <Text style={styles.characterLabel}>Classe (opcional)</Text>
          <TextInput
            value={character.className}
            onChangeText={(text) => onChange(character.id, { className: text })}
            placeholder="Ex: Ladina"
            placeholderTextColor="rgba(148, 163, 184, 0.42)"
            style={styles.characterInput}
          />
        </View>

        <Pressable
          onPress={() => onAttach(character.id)}
          style={[
            styles.attachBtn,
            character.attachmentUri && styles.attachBtnActive,
          ]}
          accessibilityLabel="Anexar arquivo"
        >
          <Paperclip
            size={18}
            color={character.attachmentUri ? premium.accentSoft : 'rgba(148, 163, 184, 0.72)'}
            strokeWidth={1.75}
          />
        </Pressable>
      </View>

      {character.attachmentUri ? (
        <Text style={styles.attachHint} numberOfLines={1}>
          Anexo adicionado
        </Text>
      ) : null}
    </View>
  );
}

export function CreateCampaignScreen() {
  const router = useRouter();
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

  const progress = ((step + 1) / CREATE_STEPS.length) * 100;

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
        coverImageUrl: coverUri ?? undefined,
        playersCount,
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
        <View style={styles.stepperTrack} />
        <View style={styles.stepperRow}>
          {CREATE_STEPS.map((item, index) => {
            const isActive = index === step;
            const isDone = index < step;
            return (
              <View key={item.id} style={styles.stepCol}>
                <View
                  style={[
                    styles.stepCircle,
                    isActive && styles.stepCircleActive,
                    isDone && styles.stepCircleDone,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      (isActive || isDone) && styles.stepNumberActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isDone && styles.stepLabelDone,
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
        <View style={styles.heroIcon}>
          <Wand2 size={24} color="#E2E8F0" strokeWidth={1.6} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>
            Crie uma{'\n'}
            <Text style={styles.heroAccent}>nova campanha</Text>
            <Text style={styles.heroSpark}> ✨</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
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
          <Text style={styles.sectionHeading}>Imagem da campanha (opcional)</Text>
          <Pressable onPress={handlePickImage} style={styles.imageCard}>
            <ImageBackground
              source={coverUri ? { uri: coverUri } : grimoireImages.campaignEldoria}
              style={styles.imageBackground}
              imageStyle={styles.imageBackgroundInner}
            >
              <LinearGradient
                colors={['rgba(11, 17, 32, 0.15)', 'rgba(11, 17, 32, 0.72)']}
                style={styles.imageOverlay}
              >
                <View style={styles.imageAction}>
                  <ImagePlus size={20} color="#F8FAFC" strokeWidth={1.75} />
                </View>
                <Text style={styles.imageTitle}>Adicionar imagem</Text>
                <Text style={styles.imageHint}>PNG, JPG ou WEBP • Máx. 5MB</Text>
              </LinearGradient>
            </ImageBackground>
          </Pressable>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <SlidersHorizontal size={15} color={premium.accentSoft} strokeWidth={2} />
            </View>
            <Text style={styles.sectionTitle}>Informações básicas</Text>
          </View>

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
            <View style={styles.sectionIcon}>
              <Users size={15} color={premium.accentSoft} strokeWidth={2} />
            </View>
            <Text style={styles.sectionTitle}>Personagens</Text>
          </View>
          <Text style={styles.sectionHint}>
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

          <Pressable onPress={addCharacter} style={styles.addCharacterBtn}>
            <Plus size={16} color={premium.accentSoft} strokeWidth={2} />
            <Text style={styles.addCharacterLabel}>Adicionar personagem</Text>
          </Pressable>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Sparkles size={15} color={premium.accentSoft} strokeWidth={2} />
            </View>
            <Text style={styles.sectionTitle}>Revisão final</Text>
          </View>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>Campanha</Text>
            <Text style={styles.reviewValue}>{title}</Text>
            <Text style={styles.reviewLabel}>Sistema</Text>
            <Text style={styles.reviewValue}>{system || '—'}</Text>
            <Text style={styles.reviewLabel}>Nível inicial</Text>
            <Text style={styles.reviewValue}>{initialLevel || '—'}</Text>
            <Text style={styles.reviewLabel}>Personagens</Text>
            {filledCharacters.length > 0 ? (
              filledCharacters.map((character, index) => (
                <Text key={character.id} style={styles.reviewValue}>
                  {index + 1}.{' '}
                  {[character.name.trim() || 'Sem nome', character.className.trim() || 'Sem classe']
                    .filter(Boolean)
                    .join(' • ')}
                  {character.attachmentUri ? ' • Anexo' : ''}
                </Text>
              ))
            ) : (
              <Text style={styles.reviewValue}>Nenhum personagem adicionado</Text>
            )}
            {description ? (
              <>
                <Text style={styles.reviewLabel}>Descrição</Text>
                <Text style={styles.reviewValue}>{description}</Text>
              </>
            ) : null}
          </View>
        </View>
      );
    }

    return null;
  }

  const continueLabel = step === CREATE_STEPS.length - 1 ? 'Criar campanha' : 'Continuar';
  const continueHint =
    step === CREATE_STEPS.length - 1
      ? 'Finalizar e abrir a crônica'
      : `Ir para ${CREATE_STEPS[step + 1]?.label.toLowerCase()}`;

  return (
    <GrimoireAtmosphereShell>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.headerBtn} hitSlop={8}>
            <ArrowLeft size={22} color={premium.text.primary} strokeWidth={1.75} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Nova Campanha</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
          <Pressable onPress={showHelp} style={styles.headerBtn} hitSlop={8}>
            <HelpCircle size={22} color={premium.text.secondary} strokeWidth={1.75} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 ? renderHero() : null}
          {renderStepper()}
          {step === 0 ? renderStepOneSections() : renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleContinue}
            disabled={isPending}
            style={({ pressed }) => [styles.continueWrap, pressed && styles.continuePressed]}
          >
            <LinearGradient
              colors={['#2563EB', '#6366F1', '#7C3AED']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.continueGradient}
            >
              <Sparkles size={17} color="#FFFFFF" strokeWidth={1.75} />
              <View style={styles.continueCopy}>
                <Text style={styles.continueLabel}>
                  {isPending ? 'Criando...' : continueLabel}
                </Text>
                <Text style={styles.continueHint}>{continueHint}</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

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
      </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#F8FAFC',
  },
  progressTrack: {
    width: '100%',
    height: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#6366F1',
    shadowColor: '#818CF8',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 26,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  heroCopy: {
    flex: 1,
    gap: 6,
    paddingTop: 1,
  },
  heroTitle: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 22,
    lineHeight: 28,
    color: '#F8FAFC',
  },
  heroAccent: {
    color: '#818CF8',
    fontFamily: fontFamily.inter.bold,
  },
  heroSpark: {
    color: '#818CF8',
  },
  heroSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(148, 163, 184, 0.72)',
    maxWidth: 280,
  },
  stepperWrap: {
    position: 'relative',
    paddingTop: 2,
    paddingBottom: 2,
  },
  stepperTrack: {
    position: 'absolute',
    top: 15,
    left: '12%',
    right: '12%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 999,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  stepCircleActive: {
    backgroundColor: '#6366F1',
    borderColor: '#818CF8',
    shadowColor: '#6366F1',
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  stepCircleDone: {
    backgroundColor: 'rgba(99, 102, 241, 0.24)',
    borderColor: 'rgba(129, 140, 248, 0.55)',
  },
  stepNumber: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 12,
    color: 'rgba(148, 163, 184, 0.55)',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 10,
    color: 'rgba(148, 163, 184, 0.45)',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#818CF8',
    fontFamily: fontFamily.inter.semibold,
  },
  stepLabelDone: {
    color: 'rgba(129, 140, 248, 0.72)',
  },
  sectionBlock: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  sectionHeading: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 15,
    color: '#F8FAFC',
    marginBottom: 2,
  },
  sectionTitle: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 15,
    color: '#F8FAFC',
  },
  sectionHint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 19,
    color: premium.text.muted,
  },
  imageCard: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  imageBackground: {
    minHeight: 182,
    justifyContent: 'center',
  },
  imageBackgroundInner: {
    borderRadius: 14,
  },
  imageOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 34,
    gap: 7,
  },
  imageAction: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    marginBottom: 2,
  },
  imageTitle: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 14,
    color: '#F8FAFC',
  },
  imageHint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: 'rgba(148, 163, 184, 0.55)',
  },
  rowFields: {
    flexDirection: 'row',
    gap: 10,
  },
  rowField: {
    flex: 1,
    minWidth: 0,
  },
  characterCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    gap: 10,
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  characterIndex: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    color: 'rgba(148, 163, 184, 0.72)',
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
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    color: 'rgba(203, 213, 225, 0.72)',
  },
  characterInput: {
    minHeight: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: premium.text.primary,
  },
  attachBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 0,
  },
  attachBtnActive: {
    borderColor: 'rgba(99, 102, 241, 0.45)',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  attachHint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: premium.accentSoft,
  },
  addCharacterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.28)',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  addCharacterLabel: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 13,
    color: premium.accentSoft,
  },
  reviewCard: {
    borderRadius: 14,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    gap: 6,
  },
  reviewLabel: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: premium.text.faint,
    marginTop: 4,
  },
  reviewValue: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: premium.text.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(11, 17, 32, 0.82)',
  },
  continueWrap: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  continuePressed: {
    opacity: 0.94,
    transform: [{ scale: 0.992 }],
  },
  continueGradient: {
    minHeight: 56,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  continueCopy: {
    flex: 1,
    gap: 1,
  },
  continueLabel: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  continueHint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.68)',
  },
});
