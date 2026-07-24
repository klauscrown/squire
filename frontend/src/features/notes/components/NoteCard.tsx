import { useRouter } from 'expo-router';
import { Feather } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { GrimoireListCard } from '@/components/grimoire';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  campaignId: string;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function NoteCard({ note, campaignId }: NoteCardProps) {
  const router = useRouter();

  return (
    <GrimoireListCard
      accentLeft
      onPress={() => router.push(`/(app)/campaigns/${campaignId}/notes/${note.id}`)}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Feather size={18} color={grimoire.colors.gold} strokeWidth={1.5} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
          {note.content ? (
            <Text style={styles.contentText} numberOfLines={2}>
              {note.content}
            </Text>
          ) : null}
          <Text style={styles.meta}>Atualizada em {formatDate(note.updatedAt)}</Text>
        </View>
      </View>
    </GrimoireListCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: grimoire.radius.sm,
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    backgroundColor: grimoire.colors.glassGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 20,
    color: grimoire.colors.ivory,
    marginBottom: 4,
  },
  contentText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 20,
    color: `${grimoire.colors.ivoryDim}CC`,
    marginBottom: 6,
  },
  meta: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: `${grimoire.colors.ivoryDim}99`,
  },
});
