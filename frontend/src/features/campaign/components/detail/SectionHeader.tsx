import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.accent, { backgroundColor: theme.colors.accent }]} />
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: theme.colors.accent,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          marginBottom: subtitle ? 4 : 0,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ fontSize: 13, color: theme.colors.muted }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  accent: { width: 24, height: 2, borderRadius: 1, marginBottom: 12, opacity: 0.6 },
});
