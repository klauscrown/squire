import * as Haptics from 'expo-haptics';
import { CalendarDays, ChevronRight, Clock3, Plus } from 'lucide-react-native';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useIsCompactWidth } from '@/hooks/useLayoutMetrics';
import { useComponents, useGrimoire, useOpacity, usePremium } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';
import type { Session } from '@/features/session/types';

import {
  formatSessionDate,
  formatSessionTime,
  preparationStatusLabel,
} from '../utils/nextSession';

export interface NextSessionCardProps {
  session?: Session | null;
  loading?: boolean;
  onPrepare?: (session: Session) => void;
  onPlan?: () => void;
}

/**
 * Card secundário de próxima sessão — menor que ActiveCampaignCard.
 * Dourado só em: data importante, ícone e ação principal.
 */
export function NextSessionCard({
  session,
  loading = false,
  onPrepare,
  onPlan,
}: NextSessionCardProps) {
  const palette = useActivePalette();
  const grimoire = useGrimoire();
  const premium = usePremium();
  const opacity = useOpacity();
  const components = useComponents();
  const compact = useIsCompactWidth();
  const secondary = grimoire.colors.ivoryDim;

  if (loading) {
    return (
      <SurfaceCard
        variant="subtle"
        radius="md"
        padding="md"
        shadow={false}
        accessibilityLabel="Carregando próxima sessão"
        contentStyle={styles.loadingShell}
      >
        <ActivityIndicator color={palette.accent} size="small" />
        <Text style={[styles.loadingText, { color: secondary }]}>Buscando sessões…</Text>
      </SurfaceCard>
    );
  }

  if (!session) {
    return (
      <SurfaceCard
        variant="interactive"
        radius="md"
        padding="md"
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPlan?.();
        }}
        accessibilityLabel="Planejar próxima sessão"
        contentStyle={[styles.emptyShell, { minHeight: MIN_TOUCH_TARGET + 12 }]}
      >
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: opacity.iconCircle.goldSubtle,
              borderColor: opacity.border.goldSubtle,
            },
          ]}
        >
          <Plus size={18} color={palette.accent} strokeWidth={2} />
        </View>
        <View style={styles.emptyCopy}>
          <Text style={[styles.emptyTitle, { color: palette.textPrimary }]} numberOfLines={1}>
            Nenhuma sessão agendada
          </Text>
          <Text style={[styles.emptyDetail, { color: secondary }]} numberOfLines={2}>
            Planeje a próxima mesa e organize o que falta preparar.
          </Text>
        </View>
        <Text style={[styles.emptyAction, { color: palette.accent }]}>Planejar</Text>
      </SurfaceCard>
    );
  }

  const dateLabel = session.playedAt ? formatSessionDate(session.playedAt) : null;
  const timeLabel = session.playedAt ? formatSessionTime(session.playedAt) : null;
  const prepLabel = preparationStatusLabel(session);
  const title =
    session.sessionNumber != null
      ? `#${session.sessionNumber} · ${session.title}`
      : session.title;

  return (
    <SurfaceCard
      variant="interactive"
      radius="md"
      padding="md"
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPrepare?.(session);
      }}
      accessibilityLabel={`Preparar sessão ${session.title}`}
      contentStyle={styles.body}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: opacity.iconCircle.goldSubtle,
              borderColor: opacity.border.goldSubtle,
            },
          ]}
        >
          <CalendarDays size={18} color={palette.accent} strokeWidth={1.85} />
        </View>

        <View style={styles.metaCol}>
          <Text style={[styles.sectionEyebrow, { color: secondary }]}>Próxima sessão</Text>
          <Text style={[styles.sessionTitle, { color: palette.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>

      <View style={[styles.detailsRow, compact && styles.detailsRowCompact]}>
        {dateLabel ? (
          <Text style={[styles.dateText, { color: palette.accent }]} numberOfLines={1}>
            {dateLabel}
          </Text>
        ) : (
          <Text style={[styles.mutedMeta, { color: secondary }]} numberOfLines={1}>
            Data a definir
          </Text>
        )}

        {timeLabel ? (
          <View style={styles.timeChip}>
            <Clock3 size={12} color={secondary} strokeWidth={1.75} />
            <Text style={[styles.timeText, { color: secondary }]}>{timeLabel}</Text>
          </View>
        ) : null}

        <View
          style={[
            styles.prepPill,
            {
              backgroundColor: premium.surface.icon,
              borderColor: premium.surface.cardBorderSubtle,
            },
          ]}
        >
          <Text style={[styles.prepText, { color: secondary }]} numberOfLines={1}>
            {prepLabel}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.cta,
          {
            borderRadius: components.cta.radius - 2,
            backgroundColor: palette.buttonPrimary,
            minHeight: MIN_TOUCH_TARGET - 8,
          },
        ]}
        pointerEvents="none"
      >
        <Text style={[styles.ctaLabel, { color: components.cta.foreground }]}>
          Preparar sessão
        </Text>
        <ChevronRight size={15} color={components.cta.foreground} strokeWidth={2.2} />
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 12,
  },
  loadingShell: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    ...typeRoles.bodySm,
  },
  emptyShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
  },
  emptyCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  emptyTitle: {
    ...typeRoles.label,
    fontFamily: typeRoles.buttonSm.fontFamily,
  },
  emptyDetail: {
    ...typeRoles.caption,
    fontFamily: typeRoles.body.fontFamily,
  },
  emptyAction: {
    ...typeRoles.buttonSm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  metaCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  sectionEyebrow: {
    ...typeRoles.caption,
  },
  sessionTitle: {
    ...typeRoles.label,
    fontFamily: typeRoles.buttonSm.fontFamily,
    fontSize: 15,
    lineHeight: 21,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 48,
  },
  detailsRowCompact: {
    paddingLeft: 0,
  },
  dateText: {
    ...typeRoles.meta,
  },
  mutedMeta: {
    ...typeRoles.bodySm,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    ...typeRoles.caption,
  },
  prepPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '100%',
  },
  prepText: {
    ...typeRoles.badge,
  },
  cta: {
    alignSelf: 'flex-start',
    marginLeft: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  ctaLabel: {
    ...typeRoles.buttonSm,
  },
});
