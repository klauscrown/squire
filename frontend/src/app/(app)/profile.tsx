import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/components/providers/AuthProvider';
import {
  GrimoireAvatar,
  GrimoireFadeIn,
  GrimoireHeader,
  GrimoireScreen,
  SectionLabel,
  SquireHint,
  StatTile,
} from '@/components/grimoire';
import { ROUTES } from '@/constants';
import { useGetCampaigns } from '@/features/campaign/hooks';
import { useDataMode } from '@/hooks/useAuthUserId';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

export default function ProfileScreen() {
  const router = useRouter();
  const { session, firebaseUser, email } = useAuth();
  const dataMode = useDataMode();
  const { data: campaigns } = useGetCampaigns();

  const totalCampaigns = campaigns?.length ?? 0;
  const activeCampaigns = campaigns?.filter((c) => c.status === 'active').length ?? 0;

  const displayName =
    firebaseUser?.displayName?.trim() ||
    (email ? email.split('@')[0] : null) ||
    (firebaseUser ? 'Mestre' : 'Explorador');
  const displaySubtitle = firebaseUser
    ? 'Conta com e-mail'
    : dataMode === 'cloud'
      ? 'Sessão anônima na nuvem'
      : 'Modo local neste dispositivo';

  const modeLabel = dataMode === 'cloud' ? 'NUVEM' : 'LOCAL';

  return (
    <GrimoireScreen glow="none">
      <GrimoireFadeIn>
        <GrimoireHeader
          variant="profile"
          eyebrow="Mestre"
          title="Sua Lenda"
          subtitle="O grimório registra cada saga que você conduz."
        />
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={80}>
        <View style={styles.heroCard}>
          <View style={styles.profileRow}>
            <GrimoireAvatar
              variant="softGlass"
              photoUrl={firebaseUser?.photoURL}
              name={displayName}
              size={56}
            />
            <View style={styles.profileText}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.roleSubtitle}>{displaySubtitle}</Text>
            </View>
          </View>

          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>• {modeLabel}</Text>
          </View>

          {email ? <Text style={styles.meta}>{email}</Text> : null}
          {!email && session?.user.id ? (
            <Text style={styles.meta}>ID: {session.user.id.slice(0, 8)}…</Text>
          ) : null}
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={160}>
        <View style={styles.statsRow}>
          <StatTile variant="softGlass" label="Crônicas" value={String(totalCampaigns).padStart(2, '0')} />
          <StatTile variant="softGlass" label="Ativas" value={String(activeCampaigns).padStart(2, '0')} />
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={240}>
        <View style={styles.section}>
          <SectionLabel title="Grimório" />
          <SquireHint
            variant="softGlass"
            message="Continue narrando. Em breve, esta página registrará cada conquista do Mestre."
          />
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={320}>
        <Pressable
          onPress={() => router.push(ROUTES.app.campaigns)}
          style={({ pressed }) => [styles.linkWrap, pressed && styles.linkPressed]}
        >
          <Text style={styles.link}>Ir para crônicas →</Text>
        </Pressable>
      </GrimoireFadeIn>
    </GrimoireScreen>
  );
}

const soft = grimoire.softGlass;

const styles = StyleSheet.create({
  heroCard: {
    marginTop: 24,
    borderRadius: soft.heroCard.borderRadius,
    backgroundColor: soft.heroCard.backgroundColor,
    borderWidth: 1,
    borderColor: soft.heroCard.borderColor,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowRadius: 10,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontFamily: fontFamily.cormorant.bold,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  roleSubtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: soft.muted,
    marginTop: 4,
  },
  modeBadge: {
    alignSelf: 'flex-start',
    borderRadius: soft.statusPill.borderRadius,
    backgroundColor: soft.statusPill.backgroundColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 16,
  },
  modeBadgeText: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: soft.gold,
  },
  meta: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: soft.muted,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  section: {
    marginTop: 32,
  },
  linkWrap: {
    marginTop: 24,
    alignSelf: 'flex-start',
  },
  linkPressed: {
    opacity: 0.72,
  },
  link: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: soft.gold,
  },
});
