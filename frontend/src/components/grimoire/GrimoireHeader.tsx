import { type ReactNode } from 'react';
import { StyleSheet, Text, type TextStyle, View } from 'react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

type GrimoireHeaderVariant = 'default' | 'softGlass' | 'profile';

interface GrimoireHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  syncStatus?: ReactNode;
  variant?: GrimoireHeaderVariant;
  titleStyle?: TextStyle;
}

export function GrimoireHeader({
  eyebrow,
  title,
  subtitle,
  action,
  syncStatus,
  variant = 'default',
  titleStyle,
}: GrimoireHeaderProps) {
  const isSoftGlass = variant === 'softGlass';
  const isProfile = variant === 'profile';

  return (
    <View style={[styles.row, isSoftGlass && styles.rowSoft]}>
      <View style={styles.textBlock}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, (isSoftGlass || isProfile) && styles.eyebrowSoft]}>
            {eyebrow}
          </Text>
        ) : null}
        <Text
          style={[
            styles.title,
            isSoftGlass && styles.titleSoft,
            isProfile && styles.titleProfile,
            !eyebrow && styles.titleNoEyebrow,
            titleStyle,
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          typeof subtitle === 'string' ? (
            <Text style={[styles.subtitle, (isSoftGlass || isProfile) && styles.subtitleSoft]}>
              {subtitle}
            </Text>
          ) : (
            <View style={styles.subtitleSlot}>{subtitle}</View>
          )
        ) : null}
        {syncStatus}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowSoft: {
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: grimoire.colors.goldMuted,
  },
  eyebrowSoft: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 11,
    letterSpacing: 1.6,
    color: 'rgba(230, 194, 128, 0.72)',
  },
  title: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 30,
    lineHeight: 36,
    color: grimoire.colors.ivory,
    marginTop: 4,
  },
  titleSoft: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: 0.2,
    color: '#F4F1EA',
    marginTop: 6,
  },
  titleNoEyebrow: {
    marginTop: 0,
  },
  titleProfile: {
    fontFamily: fontFamily.cormorant.bold,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    lineHeight: 18,
    color: `${grimoire.colors.ivoryDim}B3`,
    marginTop: 4,
  },
  subtitleSoft: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(244, 241, 234, 0.78)',
    marginTop: 8,
  },
  subtitleSlot: {
    marginTop: 8,
  },
});
