import { StyleSheet, Text, View } from 'react-native';

import { grimoireImages } from '@/assets/grimoire';
import { useGrimoire } from '@/hooks/useTheme';
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
  const grimoire = useGrimoire();
  const soft = grimoire.softGlass;

  if (variant === 'softGlass') {
    return (
      <View
        style={[
          styles.softCard,
          {
            borderColor: soft.hintCard.borderColor,
          },
        ]}
      >
        <View style={styles.softRow}>
          <GrimoireImage
            source={grimoireImages.mascot}
            style={styles.softAvatar}
            contentFit="contain"
          />
          <View style={styles.textWrap}>
            <Text style={[styles.softLabel, { color: soft.gold }]}>{label}</Text>
            <Text style={styles.softMessage}>{message}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <GlassCard gold style={{ borderRadius: grimoire.radius.xl }}>
      <View style={styles.row}>
        <View style={styles.avatarWrap}>
          <GlowPulse color={`${grimoire.colors.gold}88`} size={48} style={styles.avatarGlow} />
          <GrimoireImage source={grimoireImages.mascot} style={styles.avatar} contentFit="contain" />
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.label, { color: grimoire.colors.gold }]}>{label}</Text>
          <Text style={[styles.message, { color: grimoire.colors.ivoryDim }]}>{message}</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  softCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(28, 25, 34, 0.72)',
    borderWidth: StyleSheet.hairlineWidth,
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
    marginBottom: 4,
  },
  softLabel: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    marginBottom: 4,
    opacity: 0.85,
  },
  message: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  softMessage: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(244, 241, 234, 0.78)',
  },
});
