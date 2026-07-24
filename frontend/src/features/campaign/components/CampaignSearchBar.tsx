import { MotiView } from 'moti';
import { MagnifyingGlass } from 'phosphor-react-native';
import { StyleSheet, TextInput, View } from 'react-native';

import { GlassSurface } from '@/features/home/components/ui/GlassSurface';
import { grimoire } from '@/theme/grimoire';
import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

interface CampaignSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function CampaignSearchBar({ value, onChangeText }: CampaignSearchBarProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 6 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 280, delay: 80 }}
      style={styles.wrap}
    >
      <GlassSurface radius={premium.radius.lg} shadow>
        <View style={styles.content}>
          <MagnifyingGlass size={22} color={premium.text.muted} weight="regular" />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Buscar por nome ou sistema..."
            placeholderTextColor={premium.text.faint}
            style={styles.input}
            returnKeyType="search"
          />
        </View>
      </GlassSurface>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 18,
    gap: 14,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    lineHeight: 20,
    color: grimoire.colors.ivory,
    padding: 0,
  },
});
