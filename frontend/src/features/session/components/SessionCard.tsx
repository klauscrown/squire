import { useRouter } from 'expo-router';
import { BookOpen, CheckCircle2, ChevronRight, CircleSlash } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '@/theme/typography';

import { STATUS_LABELS, type Session, type SessionStatus } from '../types';

interface SessionCardProps {
  session: Session;
  campaignId: string;
}

const STATUS_ICON: Record<
  SessionStatus,
  {
    Icon: typeof BookOpen;
    iconColor: string;
    iconBg: string;
  }
> = {
  planned: {
    Icon: BookOpen,
    iconColor: '#E6C280',
    iconBg: 'rgba(230, 194, 128, 0.16)',
  },
  completed: {
    Icon: CheckCircle2,
    iconColor: '#34D399',
    iconBg: 'rgba(52, 211, 153, 0.16)',
  },
  cancelled: {
    Icon: CircleSlash,
    iconColor: '#94A3B8',
    iconBg: 'rgba(148, 163, 184, 0.14)',
  },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function SessionCard({ session, campaignId }: SessionCardProps) {
  const router = useRouter();
  const tone = STATUS_ICON[session.status];
  const { Icon } = tone;

  return (
    <Pressable
      onPress={() => router.push(`/(app)/campaigns/${campaignId}/sessions/${session.id}`)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${session.title}. ${STATUS_LABELS[session.status]}`}
    >
      <View style={[styles.iconWrap, { backgroundColor: tone.iconBg }]}>
        <Icon size={22} color={tone.iconColor} strokeWidth={1.75} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {session.sessionNumber != null ? `#${session.sessionNumber} · ` : ''}
            {session.title}
          </Text>
        </View>

        <Text style={styles.status} numberOfLines={1}>
          {STATUS_LABELS[session.status]}
        </Text>

        {session.summary ? (
          <Text style={styles.summary} numberOfLines={2}>
            {session.summary}
          </Text>
        ) : null}

        <Text style={styles.meta}>
          {session.playedAt
            ? `Jogada em ${formatDate(session.playedAt)}`
            : `Criada em ${formatDate(session.createdAt)}`}
        </Text>
      </View>

      <View style={styles.navBtn} accessibilityElementsHidden>
        <ChevronRight size={18} color="rgba(230, 194, 128, 0.85)" strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 22,
    paddingHorizontal: 4,
  },
  rowPressed: {
    opacity: 0.72,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 20,
    lineHeight: 26,
    color: '#F4F1EA',
  },
  status: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(230, 194, 128, 0.55)',
  },
  summary: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(168, 164, 156, 0.48)',
    marginTop: 2,
  },
  meta: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: 'rgba(168, 164, 156, 0.36)',
    marginTop: 2,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(230, 194, 128, 0.22)',
    flexShrink: 0,
  },
});
