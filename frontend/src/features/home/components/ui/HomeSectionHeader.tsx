import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

interface HomeSectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  action?: ReactNode;
}

export function HomeSectionHeader({
  title,
  actionLabel,
  onActionPress,
  action,
}: HomeSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action}
      {!action && actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={8} accessibilityRole="button">
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 17,
    letterSpacing: -0.2,
    color: premium.text.primary,
  },
  action: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 13,
    color: premium.accentSoft,
  },
});
