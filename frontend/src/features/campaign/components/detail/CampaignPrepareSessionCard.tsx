import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarDays, Sparkles } from 'lucide-react-native';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { grimoireImages } from '@/assets/grimoire';
import { SurfaceCard } from '@/components/ui';
import type { CampaignModuleStats } from '@/features/campaign/constants/modules';
import { formatSessionDate, formatSessionTime } from '@/features/home/utils/nextSession';
import type { Session } from '@/features/session/types';
import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily, typeRoles } from '@/theme/typography';

interface CampaignPrepareSessionCardProps {
  nextSession?: Session | null;
  stats: CampaignModuleStats;
  onPrepare: () => void;
}

function daysUntil(date: Date): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function buildCopy(session: Session | null | undefined, stats: CampaignModuleStats) {
  if (!session) {
    return {
      dateLine: 'Sem data marcada',
      headline: 'Sua próxima sessão ainda não tem data.',
      sub: 'Defina uma data para organizar os preparativos.',
      cta: 'Planejar sessão',
    };
  }

  const date = session.playedAt;
  const datePart = date ? formatSessionDate(date).toUpperCase() : session.title;
  const timePart = date ? formatSessionTime(date) : null;
  const dateLine = timePart ? `${datePart.replace('.', '')} · ${timePart}` : datePart;

  let headline = 'Prepare a próxima sessão, mestre.';
  if (date) {
    const d = daysUntil(date);
    if (d === 0) headline = 'A sessão é hoje, mestre.';
    else if (d === 1) headline = 'Falta 1 dia para a sessão.';
    else if (d > 1) headline = `Faltam ${d} dias para a sessão.`;
    else headline = 'Data passada — revise o que ficou.';
  }

  const bits: string[] = [];
  if (stats.npcs > 0) {
    bits.push(`${stats.npcs} ${stats.npcs === 1 ? 'NPC' : 'NPCs'}`);
  }
  if (stats.notes > 0) {
    bits.push(`${stats.notes} ${stats.notes === 1 ? 'anotação' : 'anotações'}`);
  }
  const sub =
    bits.length > 0
      ? `Há ${bits.join(' e ')} para revisar.`
      : 'Organize o que o grupo vai enfrentar.';

  return { dateLine, headline, sub, cta: 'Preparar sessão' };
}

/**
 * Card de preparação da próxima sessão — tamanho intermediário.
 */
export function CampaignPrepareSessionCard({
  nextSession,
  stats,
  onPrepare,
}: CampaignPrepareSessionCardProps) {
  const palette = useActivePalette();
  const copy = buildCopy(nextSession, stats);

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPrepare();
  }

  return (
    <SurfaceCard
      variant="elevated"
      radius="md"
      padding="sm"
      shadow={false}
      style={styles.shell}
      contentStyle={styles.inner}
      accessibilityLabel={`${copy.headline} ${copy.cta}`}
    >
      <View style={styles.row}>
        <View style={styles.mascotWrap}>
          <Image
            source={grimoireImages.mascot}
            style={styles.mascot}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>

        <View style={styles.copy}>
          <View style={styles.dateRow}>
            <CalendarDays size={12} color={palette.accent} strokeWidth={1.75} />
            <Text style={[styles.date, { color: palette.accent }]} numberOfLines={1}>
              {copy.dateLine}
            </Text>
          </View>

          <Text
            style={[styles.headline, { color: palette.textPrimary }]}
            numberOfLines={2}
            maxFontSizeMultiplier={1.25}
          >
            {copy.headline}
          </Text>
          <Text
            style={[styles.sub, { color: palette.textSecondary }]}
            numberOfLines={2}
            maxFontSizeMultiplier={1.25}
          >
            {copy.sub}
          </Text>
        </View>

        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={copy.cta}
          style={({ pressed }) => [styles.ctaWrap, pressed && { opacity: 0.9 }]}
        >
          <LinearGradient
            colors={[palette.primary, palette.primaryLight]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.cta}
          >
            <Sparkles size={12} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.ctaLabel}>{copy.cta}</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.rim, { borderColor: `${palette.primaryLight}22` }]}
      />
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginHorizontal: 18,
    marginTop: 10,
    overflow: 'hidden',
  },
  inner: {
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  mascotWrap: {
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 46,
    height: 58,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  date: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    flex: 1,
  },
  headline: {
    ...typeRoles.editorial,
    fontSize: 13,
    lineHeight: 17,
  },
  sub: {
    ...typeRoles.caption,
    fontSize: 10,
    lineHeight: 13,
  },
  ctaWrap: {
    flexShrink: 0,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    minHeight: 36,
  },
  ctaLabel: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    color: '#FFFFFF',
  },
  rim: {
    borderWidth: 1,
    borderRadius: 16,
  },
});
