import { StyleSheet, View } from 'react-native';

import { GlassCard } from '@/components/grimoire';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

import { AuthText } from './AuthText';

interface ExplorerNoticeCardProps {
  isSupabaseMode: boolean;
}

export function ExplorerNoticeCard({ isSupabaseMode }: ExplorerNoticeCardProps) {
  return (
    <GlassCard gold style={styles.card}>
      <AuthText style={styles.title}>
        {isSupabaseMode ? 'Modo Explorador' : 'Modo Local'}
      </AuthText>
      <AuthText style={styles.body}>
        {isSupabaseMode
          ? 'Comece sem conta. Salve suas crônicas neste dispositivo e sincronize quando sentir que o reino cresceu.'
          : 'Entre com e-mail para conta permanente, ou continue sem conta para explorar localmente.'}
      </AuthText>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: grimoire.radius.xl,
    marginBottom: 24,
  },
  title: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: grimoire.colors.gold,
    marginBottom: 6,
  },
  body: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    lineHeight: 18,
    color: `${grimoire.colors.ivory}BF`,
  },
});
