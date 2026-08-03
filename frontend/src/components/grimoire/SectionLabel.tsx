import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

type SectionLabelVariant = 'default' | 'softGlass';

interface SectionLabelProps {
  title: string;
  action?: ReactNode;
  variant?: SectionLabelVariant;
}

export function SectionLabel({ title, action, variant = 'default' }: SectionLabelProps) {
  const grimoire = useGrimoire();

  return (
    <View style={[styles.row, variant === 'softGlass' && styles.rowSoft]}>
      <Text
        style={[
          styles.title,
          { color: `${grimoire.colors.ivoryDim}B3` },
          variant === 'softGlass' && styles.titleSoft,
        ]}
      >
        {title}
      </Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowSoft: {
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  titleSoft: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 13,
    letterSpacing: 0.2,
    textTransform: 'none',
    fontWeight: '600',
    color: 'rgba(244, 241, 234, 0.78)',
  },
});
