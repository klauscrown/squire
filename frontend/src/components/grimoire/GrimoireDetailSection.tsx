import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

import { GlassCard } from './GlassCard';

interface GrimoireDetailSectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  quote?: boolean;
}

export function GrimoireDetailSection({
  title,
  icon: Icon,
  children,
  quote = false,
}: GrimoireDetailSectionProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        {Icon ? <Icon size={12} color={grimoire.colors.gold} strokeWidth={2} /> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={quote ? styles.quoteBody : undefined}>{children}</View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: grimoire.radius.lg,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  title: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: grimoire.colors.gold,
  },
  quoteBody: {
    borderLeftWidth: 2,
    borderLeftColor: `${grimoire.colors.gold}4D`,
    paddingLeft: 12,
    paddingVertical: 4,
  },
});
