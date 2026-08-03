import { useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import { GrimoireFadeIn } from './GrimoireFadeIn';

interface ModuleListHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  createLabel?: string;
  onCreatePress?: () => void;
  showBack?: boolean;
}

export function ModuleListHeader({
  eyebrow,
  title,
  subtitle,
  createLabel = 'Criar',
  onCreatePress,
  showBack = true,
}: ModuleListHeaderProps) {
  const router = useRouter();
  const grimoire = useGrimoire();

  return (
    <GrimoireFadeIn
      style={{
        ...styles.container,
        paddingHorizontal: grimoire.spacing.screen,
      }}
    >
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
          style={({ pressed }) => [
            styles.backButton,
            {
              borderColor: grimoire.colors.glassBorder,
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <ArrowLeft size={16} color={grimoire.colors.ivory} strokeWidth={1.5} />
        </Pressable>
      ) : null}

      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text style={[styles.eyebrow, { color: grimoire.colors.goldMuted }]}>{eyebrow}</Text>
          <Text style={[styles.title, { color: grimoire.colors.ivory }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: `${grimoire.colors.ivoryDim}B3` }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {onCreatePress ? (
          <Pressable
            onPress={onCreatePress}
            accessibilityLabel={createLabel}
            style={({ pressed }) => [
              styles.createButton,
              {
                backgroundColor: grimoire.colors.gold,
                ...grimoire.elevation.goldGlow,
              },
              pressed && { transform: [{ scale: 0.95 }] },
            ]}
          >
            <Plus size={18} color={grimoire.colors.purpleDeep} strokeWidth={2} />
          </Pressable>
        ) : null}
      </View>
    </GrimoireFadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  textBlock: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 32,
    lineHeight: 36,
    marginTop: 4,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});
