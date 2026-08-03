import { type ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

interface GrimoireDetailMetaProps {
  children: ReactNode;
}

export function GrimoireDetailMeta({ children }: GrimoireDetailMetaProps) {
  const grimoire = useGrimoire();

  return (
    <Text style={[styles.meta, { color: `${grimoire.colors.ivoryDim}99` }]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  meta: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 20,
    marginTop: 4,
  },
});
