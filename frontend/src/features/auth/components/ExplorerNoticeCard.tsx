import { StyleSheet, View } from 'react-native';

import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { useActivePalette } from '@/store/useThemeStore';

import { AuthText } from './AuthText';

interface ExplorerNoticeCardProps {
  isSupabaseMode: boolean;
}

export function ExplorerNoticeCard({ isSupabaseMode }: ExplorerNoticeCardProps) {
  const palette = useActivePalette();

  return (
    <SurfaceCard variant="subtle" radius="lg" padding="md" style={styles.card}>
      <View>
        <AuthText style={[styles.title, { color: palette.accent }]}>
          {isSupabaseMode ? 'Modo Explorador' : 'Modo Local'}
        </AuthText>
        <AuthText style={[styles.body, { color: palette.textSecondary }]}>
          {isSupabaseMode
            ? 'Comece sem conta. Salve suas crônicas neste dispositivo e sincronize quando sentir que o reino cresceu.'
            : 'Entre com e-mail para conta permanente, ou continue sem conta para explorar localmente.'}
        </AuthText>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
    width: '100%',
  },
  title: {
    ...loginTypography.noticeLabel,
    marginBottom: 6,
  },
  body: {
    ...loginTypography.noticeBody,
  },
});
