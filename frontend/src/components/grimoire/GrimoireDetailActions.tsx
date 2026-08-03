import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

interface GrimoireDetailActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  deleteLabel?: string;
  deleting?: boolean;
}

export function GrimoireDetailActions({
  onEdit,
  onDelete,
  deleteLabel = 'Excluir',
  deleting,
}: GrimoireDetailActionsProps) {
  const grimoire = useGrimoire();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onEdit}
        style={({ pressed }) => [
          styles.editButton,
          {
            borderRadius: grimoire.radius.md,
            borderColor: grimoire.colors.glassGoldBorder,
            backgroundColor: grimoire.colors.glassGold,
          },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={[styles.editText, { color: grimoire.colors.gold }]}>Editar</Text>
      </Pressable>

      <Pressable
        onPress={onDelete}
        disabled={deleting}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && { opacity: 0.8 },
          deleting && { opacity: 0.5 },
        ]}
      >
        {deleting ? (
          <ActivityIndicator size="small" color={grimoire.colors.destructive} />
        ) : (
          <Text style={[styles.deleteText, { color: grimoire.colors.destructive }]}>
            {deleteLabel}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editText: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 14,
  },
  deleteButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 14,
  },
});
