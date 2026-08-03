import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Scroll } from 'lucide-react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import { AnimatedPressable } from './AnimatedPressable';

interface CampaignActionsProps {
  onDelete: () => void;
  loading?: boolean;
}

export function CampaignActions({ onDelete, loading }: CampaignActionsProps) {
  const grimoire = useGrimoire();

  return (
    <View style={styles.container}>
      <AnimatedPressable
        onPress={onDelete}
        disabled={loading}
        style={[
          styles.deleteButton,
          {
            borderRadius: grimoire.radius.lg,
            borderColor: `${grimoire.colors.destructive}33`,
            backgroundColor: `${grimoire.colors.destructive}10`,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={grimoire.colors.destructive} />
        ) : (
          <Scroll size={15} color={grimoire.colors.destructive} strokeWidth={1.5} />
        )}
        <Text style={[styles.deleteText, { color: `${grimoire.colors.destructive}CC` }]}>
          Excluir campanha
        </Text>
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
    borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
  },
});
