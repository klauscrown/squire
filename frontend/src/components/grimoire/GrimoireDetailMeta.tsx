import { type ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

interface GrimoireDetailMetaProps {
  children: ReactNode;
}

export function GrimoireDetailMeta({ children }: GrimoireDetailMetaProps) {
  return <Text style={styles.meta}>{children}</Text>;
}

const styles = StyleSheet.create({
  meta: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    lineHeight: 17,
    color: `${grimoire.colors.ivoryDim}99`,
    marginBottom: 20,
    marginTop: 4,
  },
});
