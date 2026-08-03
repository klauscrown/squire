import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { GrimoireImage, GrimoireListCard } from '@/components/grimoire';
import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import type { Npc } from '../types';
import { NpcDispositionBadge } from './NpcDispositionBadge';
import { NpcStatusBadge } from './NpcStatusBadge';

interface NpcCardProps {
  npc: Npc;
  campaignId: string;
}

function buildMetaLine(npc: Npc): string | null {
  const parts = [npc.role, npc.race, npc.classType].filter((part): part is string =>
    Boolean(part && part.trim()),
  );
  if (parts.length === 0) return null;
  return parts.join(' · ');
}

export function NpcCard({ npc, campaignId }: NpcCardProps) {
  const router = useRouter();
  const grimoire = useGrimoire();
  const metaLine = buildMetaLine(npc);
  const hasPortrait = Boolean(npc.portraitUrl?.trim());

  return (
    <GrimoireListCard onPress={() => router.push(`/(app)/campaigns/${campaignId}/npcs/${npc.id}`)}>
      <View style={styles.row}>
        <View
          style={[
            styles.portraitWrap,
            {
              borderRadius: grimoire.radius.md,
              borderColor: grimoire.colors.glassGoldBorder,
              backgroundColor: grimoire.colors.glass,
            },
          ]}
        >
          {hasPortrait ? (
            <GrimoireImage
              source={{ uri: npc.portraitUrl! }}
              style={styles.portrait}
              recyclingKey={npc.id}
            />
          ) : (
            <View
              style={[
                styles.portraitFallback,
                { backgroundColor: `${grimoire.colors.purpleMid}44` },
              ]}
            >
              <User size={22} color={grimoire.colors.goldMuted} strokeWidth={1.5} />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: grimoire.colors.ivory }]} numberOfLines={1}>
              {npc.name}
            </Text>
            <View style={styles.badges}>
              <NpcStatusBadge status={npc.status} />
              <NpcDispositionBadge disposition={npc.disposition} />
            </View>
          </View>

          {metaLine ? (
            <Text style={[styles.meta, { color: grimoire.colors.gold }]} numberOfLines={1}>
              {metaLine}
            </Text>
          ) : null}

          {npc.description ? (
            <Text
              style={[styles.description, { color: `${grimoire.colors.ivoryDim}CC` }]}
              numberOfLines={2}
            >
              {npc.description}
            </Text>
          ) : null}
        </View>
      </View>
    </GrimoireListCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  portraitWrap: {
    width: 64,
    height: 64,
    overflow: 'hidden',
    borderWidth: 1,
  },
  portrait: {
    width: '100%',
    height: '100%',
  },
  portraitFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 20,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
  },
  meta: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    marginBottom: 4,
  },
  description: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
