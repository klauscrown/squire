import * as Haptics from 'expo-haptics';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily, typeRoles } from '@/theme/typography';

interface MasterModuleTileProps {
  label: string;
  hint: string;
  icon: LucideIcon;
  enabled: boolean;
  onPress: () => void;
}

/**
 * Tile da Mesa do Mestre — layout em coluna, tamanho intermediário.
 */
export function MasterModuleTile({
  label,
  hint,
  icon: Icon,
  enabled,
  onPress,
}: MasterModuleTileProps) {
  const palette = useActivePalette();

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }

  return (
    <SurfaceCard
      variant="interactive"
      radius="sm"
      padding={10}
      onPress={handlePress}
      disabled={!enabled}
      shadow={false}
      accessibilityLabel={enabled ? `${label}, ${hint}` : `${label}, em breve`}
      style={[styles.shell, !enabled && styles.disabled]}
      contentStyle={styles.inner}
    >
      <View
        style={[
          styles.iconWrap,
          {
            borderColor: `${palette.primaryLight}40`,
            backgroundColor: `${palette.primary}22`,
          },
        ]}
      >
        <Icon size={17} color={palette.primaryLight} strokeWidth={1.75} />
      </View>

      <View style={styles.copy}>
        <Text style={[styles.label, { color: palette.textPrimary }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.hint, { color: palette.textSecondary }]} numberOfLines={1}>
          {enabled ? hint : 'Em breve'}
        </Text>
      </View>

      <ChevronRight size={14} color={palette.textSecondary} strokeWidth={1.5} />
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.55,
  },
  inner: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  label: {
    ...typeRoles.label,
    fontFamily: fontFamily.inter.semibold,
    fontSize: 11,
    lineHeight: 14,
  },
  hint: {
    ...typeRoles.caption,
    fontSize: 9,
    lineHeight: 12,
  },
});
