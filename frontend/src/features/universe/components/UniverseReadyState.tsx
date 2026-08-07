import {
  BookOpen,
  Castle,
  ChevronRight,
  Link2,
  MoreHorizontal,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GrimoireFadeIn, GrimoireHeader, SectionLabel } from '@/components/grimoire';
import { SurfaceCard } from '@/components/ui';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import type { Universe } from '../types';
import { UniversePrimaryButton, UniverseSymbol } from './UniversePrimitives';

interface CategoryGuide {
  title: string;
  description: string;
  icon: LucideIcon;
}

const CATEGORY_GUIDES: readonly CategoryGuide[] = [
  {
    title: 'Povos & Personagens',
    description: 'Quem vive no cenário e quais vínculos movem suas histórias.',
    icon: Users,
  },
  {
    title: 'Terras & Lugares',
    description: 'Reinos, cidades, ruínas e caminhos que formam o mundo.',
    icon: Castle,
  },
  {
    title: 'Histórias & Relíquias',
    description: 'Eventos, conhecimentos, itens e criaturas memoráveis.',
    icon: BookOpen,
  },
];

interface UniverseReadyStateProps {
  universe: Universe;
  onOptions: () => void;
  onCreateFirst: () => void;
  onAddFragment: () => void;
  onLinkCampaign: () => void;
}

export function UniverseReadyState({
  universe,
  onOptions,
  onCreateFirst,
  onAddFragment,
  onLinkCampaign,
}: UniverseReadyStateProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();

  return (
    <>
      <GrimoireFadeIn>
        <GrimoireHeader
          eyebrow="Biblioteca do mestre"
          title="Meu Universo"
          subtitle="Seu cenário permanente começa a tomar forma."
        />
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={70}>
        <SurfaceCard
          variant="elevated"
          radius="lg"
          padding="lg"
          shadow={false}
          style={{ marginTop: components.home.heroMarginTop }}
          contentStyle={styles.heroContent}
        >
          <UniverseSymbol size={72} compact />
          <View style={styles.heroCopy}>
            <Text style={[styles.universeName, { color: palette.textPrimary }]}>
              {universe.name}
            </Text>
            <Text style={[styles.universeDescription, { color: palette.textSecondary }]}>
              {universe.description ||
                'Um cenário novo, esperando seus primeiros lugares, povos e histórias.'}
            </Text>
          </View>
          <Pressable
            onPress={onOptions}
            accessibilityRole="button"
            accessibilityLabel="Editar ou trocar universo"
            style={({ pressed }) => [
              styles.optionsButton,
              {
                borderColor: opacity.border.goldSubtle,
                backgroundColor: opacity.card.subtle,
              },
              pressed && { opacity: opacity.level.pressed },
            ]}
          >
            <MoreHorizontal size={20} color={palette.accent} strokeWidth={1.8} />
          </Pressable>
        </SurfaceCard>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={130}>
        <View style={[styles.firstStory, { marginTop: components.spacing.section }]}>
          <Sparkles size={24} color={palette.accent} strokeWidth={1.55} />
          <Text style={[styles.firstStoryTitle, { color: palette.textPrimary }]}>
            Seu universo está pronto para receber a primeira história.
          </Text>
          <UniversePrimaryButton label="Criar primeiro elemento" onPress={onCreateFirst} />
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={190}>
        <View style={{ marginTop: components.spacing.section }}>
          <SectionLabel title="Por onde começar" />
          <View style={[styles.categoryGrid, { gap: components.spacing.grid }]}>
            {CATEGORY_GUIDES.map((guide) => {
              const Icon = guide.icon;
              return (
                <SurfaceCard
                  key={guide.title}
                  variant="subtle"
                  radius="sm"
                  padding="sm"
                  shadow={false}
                  style={styles.categoryCard}
                  contentStyle={styles.categoryContent}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      {
                        borderColor: opacity.iconCircle.goldBorder,
                        backgroundColor: opacity.iconCircle.goldSubtle,
                      },
                    ]}
                  >
                    <Icon size={19} color={palette.accent} strokeWidth={1.65} />
                  </View>
                  <Text style={[styles.categoryTitle, { color: palette.textPrimary }]}>
                    {guide.title}
                  </Text>
                  <Text style={[styles.categoryDescription, { color: palette.textSecondary }]}>
                    {guide.description}
                  </Text>
                </SurfaceCard>
              );
            })}
          </View>
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={250}>
        <View style={{ marginTop: components.spacing.section }}>
          <SectionLabel title="Atalhos" />
          <View style={[styles.shortcuts, { gap: components.spacing.grid }]}>
            <SurfaceCard
              variant="interactive"
              radius="sm"
              padding="sm"
              shadow={false}
              onPress={onAddFragment}
              accessibilityLabel="Adicionar fragmento"
              style={styles.shortcutCard}
              contentStyle={styles.shortcutContent}
            >
              <Sparkles size={20} color={opacity.iconStroke.lilac} strokeWidth={1.7} />
              <View style={styles.shortcutCopy}>
                <Text style={[styles.shortcutTitle, { color: palette.textPrimary }]}>
                  Adicionar fragmento
                </Text>
                <Text style={[styles.shortcutBody, { color: palette.textSecondary }]}>
                  Guarde uma ideia rápida
                </Text>
              </View>
              <ChevronRight size={16} color={palette.textSecondary} strokeWidth={1.5} />
            </SurfaceCard>

            <SurfaceCard
              variant="interactive"
              radius="sm"
              padding="sm"
              shadow={false}
              onPress={onLinkCampaign}
              accessibilityLabel="Vincular campanha existente"
              style={styles.shortcutCard}
              contentStyle={styles.shortcutContent}
            >
              <Link2 size={20} color={opacity.iconStroke.blue} strokeWidth={1.7} />
              <View style={styles.shortcutCopy}>
                <Text style={[styles.shortcutTitle, { color: palette.textPrimary }]}>
                  Vincular campanha
                </Text>
                <Text style={[styles.shortcutBody, { color: palette.textSecondary }]}>
                  Conecte uma crônica existente
                </Text>
              </View>
              <ChevronRight size={16} color={palette.textSecondary} strokeWidth={1.5} />
            </SurfaceCard>
          </View>
        </View>
      </GrimoireFadeIn>
    </>
  );
}

const styles = StyleSheet.create({
  heroContent: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  universeName: {
    ...typeRoles.title,
  },
  universeDescription: {
    ...typeRoles.bodySm,
    marginTop: 3,
  },
  optionsButton: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: MIN_TOUCH_TARGET / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  firstStory: {
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 16,
  },
  firstStoryTitle: {
    ...typeRoles.editorial,
    maxWidth: 480,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryCard: {
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 150,
  },
  categoryContent: {
    minHeight: 118,
    gap: 6,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  categoryTitle: {
    ...typeRoles.label,
  },
  categoryDescription: {
    ...typeRoles.caption,
  },
  shortcuts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  shortcutCard: {
    flexBasis: '46%',
    flexGrow: 1,
    minWidth: 220,
  },
  shortcutContent: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shortcutCopy: {
    flex: 1,
    minWidth: 0,
  },
  shortcutTitle: {
    ...typeRoles.label,
  },
  shortcutBody: {
    ...typeRoles.caption,
    marginTop: 2,
  },
});
