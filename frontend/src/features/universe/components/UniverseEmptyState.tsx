import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  Castle,
  Package,
  Shield,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { GrimoireFadeIn, GrimoireHeader } from '@/components/grimoire';
import { SurfaceCard } from '@/components/ui';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import { UniversePrimaryButton, UniverseSymbol, UniverseTextAction } from './UniversePrimitives';

interface Possibility {
  label: string;
  icon: LucideIcon;
}

const POSSIBILITIES: readonly Possibility[] = [
  { label: 'Personagens', icon: Users },
  { label: 'Locais', icon: Castle },
  { label: 'Histórias', icon: BookOpen },
  { label: 'Itens', icon: Package },
  { label: 'Facções', icon: Shield },
  { label: 'Fragmentos', icon: Sparkles },
];

interface UniverseEmptyStateProps {
  onCreate: () => void;
  onLearnMore: () => void;
}

export function UniverseEmptyState({ onCreate, onLearnMore }: UniverseEmptyStateProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();

  return (
    <>
      <GrimoireFadeIn>
        <GrimoireHeader
          eyebrow="Biblioteca do mestre"
          title="Meu Universo"
          subtitle="Um cenário permanente, além de qualquer campanha."
        />
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={80}>
        <SurfaceCard
          variant="elevated"
          radius="lg"
          padding="lg"
          shadow={false}
          style={{ marginTop: components.home.heroMarginTop }}
          contentStyle={styles.heroContent}
        >
          <LinearGradient
            pointerEvents="none"
            colors={[opacity.card.strong, opacity.card.subtle]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View pointerEvents="none" style={styles.constellation}>
            <Sparkles
              size={148}
              color={palette.primaryLight}
              strokeWidth={0.45}
              opacity={opacity.level.subtle}
            />
          </View>

          <UniverseSymbol size={104} />

          <Text style={[styles.title, { color: palette.textPrimary }]}>Seu mundo começa aqui</Text>
          <Text style={[styles.body, { color: palette.textSecondary }]}>
            Crie um espaço permanente para guardar personagens, locais, histórias, itens e tudo que
            forma o seu cenário.
          </Text>

          <View style={styles.actions}>
            <UniversePrimaryButton label="Criar meu universo" onPress={onCreate} />
            <UniverseTextAction label="Saiba como funciona" onPress={onLearnMore} />
          </View>
        </SurfaceCard>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={150}>
        <View style={{ marginTop: components.spacing.section }}>
          <Text style={[styles.previewLabel, { color: palette.textSecondary }]}>
            Dentro do seu universo
          </Text>
          <View style={[styles.previewGrid, { gap: components.spacing.grid }]}>
            {POSSIBILITIES.map((item) => {
              const Icon = item.icon;
              return (
                <View key={item.label} style={styles.previewItem}>
                  <View
                    style={[
                      styles.previewIcon,
                      {
                        borderColor: opacity.iconCircle.goldBorder,
                        backgroundColor: opacity.iconCircle.goldSubtle,
                      },
                    ]}
                  >
                    <Icon size={18} color={palette.accent} strokeWidth={1.65} />
                  </View>
                  <Text style={[styles.previewText, { color: palette.textPrimary }]}>
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </GrimoireFadeIn>
    </>
  );
}

const styles = StyleSheet.create({
  heroContent: {
    minHeight: 330,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 12,
  },
  constellation: {
    position: 'absolute',
    top: -24,
    right: -20,
  },
  title: {
    ...typeRoles.display,
    marginTop: 4,
    textAlign: 'center',
  },
  body: {
    ...typeRoles.body,
    maxWidth: 520,
    textAlign: 'center',
  },
  actions: {
    marginTop: 8,
    alignItems: 'center',
    gap: 2,
  },
  previewLabel: {
    ...typeRoles.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewItem: {
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 94,
    alignItems: 'center',
    gap: 7,
    paddingVertical: 10,
  },
  previewIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    ...typeRoles.caption,
    textAlign: 'center',
  },
});
