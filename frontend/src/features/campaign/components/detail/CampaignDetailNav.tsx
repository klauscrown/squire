import { useRouter } from 'expo-router';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';

import { AnimatedPressable } from './AnimatedPressable';
import { OrnamentalSectionTitle } from './OrnamentalSectionTitle';

interface CampaignDetailNavProps {
  onMore?: () => void;
}

/**
 * Nav da ficha: voltar · CAMPANHA ATIVA ornamental · menu.
 */
export function CampaignDetailNav({ onMore }: CampaignDetailNavProps) {
  const router = useRouter();
  const grimoire = useGrimoire();
  const palette = useActivePalette();

  return (
    <View style={styles.row}>
      <AnimatedPressable
        onPress={() => router.back()}
        accessibilityLabel="Voltar"
        style={[
          styles.iconBtn,
          {
            borderColor: palette.surfaceBorder,
            backgroundColor: grimoire.colors.glass,
          },
        ]}
      >
        <ArrowLeft size={18} color={palette.textPrimary} strokeWidth={1.75} />
      </AnimatedPressable>

      <View style={styles.titleSlot}>
        <OrnamentalSectionTitle title="Campanha" size="nav" />
      </View>

      <AnimatedPressable
        onPress={onMore}
        accessibilityLabel="Mais opções"
        disabled={!onMore}
        style={[
          styles.iconBtn,
          {
            borderColor: palette.surfaceBorder,
            backgroundColor: grimoire.colors.glass,
            opacity: onMore ? 1 : 0.4,
          },
        ]}
      >
        <MoreVertical size={18} color={palette.textPrimary} strokeWidth={1.75} />
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingTop: 2,
    paddingBottom: 10,
  },
  titleSlot: {
    flex: 1,
    minWidth: 0,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
