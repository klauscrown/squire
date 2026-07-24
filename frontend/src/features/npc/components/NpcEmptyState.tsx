import { StyleSheet, Text, View } from 'react-native';
import { Users } from 'lucide-react-native';

import { Button } from '@/components/ui';
import { fontFamily } from '@/theme/typography';

const BRONZE = '#A3937B';

interface NpcEmptyStateProps {
  onCreatePress: () => void;
}

export function NpcEmptyState({ onCreatePress }: NpcEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Users size={28} color={BRONZE} strokeWidth={1.75} />
        </View>

        <Text style={styles.title}>Nenhum NPC</Text>

        <Text style={styles.body}>
          O mundo aguarda seus personagens. Que tal dar vida ao primeiro habitante hoje?
        </Text>

        <Button title="Criar NPC" onPress={onCreatePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontFamily: fontFamily.manrope.bold,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    fontFamily: fontFamily.manrope.regular,
    fontSize: 13,
    lineHeight: 20,
    color: '#8C8C8C',
    textAlign: 'center',
    marginBottom: 24,
  },
});
