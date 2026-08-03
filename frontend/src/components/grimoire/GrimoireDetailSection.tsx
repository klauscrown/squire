import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useGrimoire } from '@/hooks/useTheme';
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
  const grimoire = useGrimoire();

  return (
    <GlassCard style={{ ...styles.card, borderRadius: grimoire.radius.lg }}>
      <View style={styles.header}>
        {Icon ? <Icon size={12} color={grimoire.colors.gold} strokeWidth={2} /> : null}
        <Text style={[styles.title, { color: grimoire.colors.gold }]}>{title}</Text>
      </View>
      <View
        style={
          quote
            ? [
                styles.quoteBody,
                { borderLeftColor: `${grimoire.colors.gold}4D` },
              ]
            : undefined
        }
      >
        {children}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
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
  },
  quoteBody: {
    borderLeftWidth: 2,
    paddingLeft: 12,
    paddingVertical: 4,
  },
});
