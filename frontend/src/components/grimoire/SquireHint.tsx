import { StyleSheet, Text, View } from 'react-native';

import { grimoireImages } from '@/assets/grimoire';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

import { GlassCard } from './GlassCard';
import { GlowPulse } from './GlowPulse';
import { GrimoireImage } from './GrimoireImage';

type SquireHintVariant = 'default' | 'softGlass';

interface SquireHintProps {
  label?: string;
  message: string;
  variant?: SquireHintVariant;
}

export function SquireHint({
  label = 'Conselho do Escudeiro',
  message,
  variant = 'default',
}: SquireHintProps) {
  if (variant === 'softGlass') {
    return (
      <View style={styles.softCard}>
        <View style={styles.softRow}>
          <GrimoireImage source={grimoireImages.mascot} style={styles.softAvatar} contentFit="cover" />
          <View style={styles.textWrap}>
            <Text style={styles.softLabel}>{label}</Text>
            <Text style={styles.softMessage}>{message}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <GlassCard gold style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatarWrap}>
          <GlowPulse color={`${grimoire.colors.gold}88`} size={48} style={styles.avatarGlow} />
          <GrimoireImage source={grimoireImages.mascot} style={styles.avatar} contentFit="cover" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: grimoire.radius.xl,
  },
  softCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(28, 25, 34, 0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  softRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  softAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 4,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    borderRadius: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: grimoire.colors.gold,
    marginBottom: 4,
  },
  softLabel: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    color: 'rgba(230, 194, 128, 0.85)',
    marginBottom: 4,
  },
  message: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 20,
    color: `${grimoire.colors.ivory}D9`,
  },
  softMessage: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(244, 241, 234, 0.72)',
  },
});
