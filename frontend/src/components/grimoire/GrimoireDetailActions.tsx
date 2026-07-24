import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { grimoire } from '@/theme/grimoire';
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
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onEdit}
        style={({ pressed }) => [styles.editButton, pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.editText}>Editar</Text>
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
          <Text style={styles.deleteText}>{deleteLabel}</Text>
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
    borderRadius: grimoire.radius.md,
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    backgroundColor: grimoire.colors.glassGold,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editText: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 14,
    color: grimoire.colors.gold,
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
    color: grimoire.colors.destructive,
  },
});
