import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Scroll } from 'lucide-react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

import { AnimatedPressable } from './AnimatedPressable';

interface CampaignActionsProps {
  onDelete: () => void;
  loading?: boolean;
}

export function CampaignActions({ onDelete, loading }: CampaignActionsProps) {
  return (
    <View style={styles.container}>
      <AnimatedPressable onPress={onDelete} disabled={loading} style={styles.deleteButton}>
        {loading ? (
          <ActivityIndicator size="small" color={grimoire.colors.destructive} />
        ) : (
          <Scroll size={15} color={grimoire.colors.destructive} strokeWidth={1.5} />
        )}
        <Text style={styles.deleteText}>Excluir campanha</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: grimoire.radius.lg,
    borderWidth: 1,
    borderColor: `${grimoire.colors.destructive}33`,
    backgroundColor: `${grimoire.colors.destructive}10`,
    width: '100%',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    color: `${grimoire.colors.destructive}CC`,
  },
});
