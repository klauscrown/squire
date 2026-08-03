import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily } from '@/theme/typography';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  action?: ReactNode;
  /** Primeira seção da tela — reduz margem superior extra */
  isFirst?: boolean;
}

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
  action,
  isFirst = false,
}: SectionHeaderProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const header = components.sectionHeader;

  return (
    <View
      style={[
        styles.wrap,
        { marginTop: isFirst ? 0 : header.marginTop, marginBottom: header.marginBottom },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.titleWrap}>
          <LinearGradient
            colors={[palette.primaryLight, palette.primary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              width: header.accentBar.width,
              height: header.accentBar.height,
              borderRadius: components.radius.pill,
            }}
          />
          <Text
            style={[
              styles.title,
              {
                fontFamily: header.title.fontFamily,
                fontSize: header.title.fontSize,
                lineHeight: header.title.lineHeight,
                letterSpacing: header.title.letterSpacing,
                color: palette.textPrimary,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        {action}
        {!action && actionLabel && onActionPress ? (
          <Pressable
            onPress={onActionPress}
            hitSlop={8}
            accessibilityRole="button"
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
          >
            <Text
              style={{
                fontFamily: fontFamily.inter.medium,
                fontSize: header.action.fontSize,
                color: palette.primaryLight,
              }}
            >
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  title: {
    flexShrink: 1,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  actionBtnPressed: {
    opacity: 0.7,
  },
});
