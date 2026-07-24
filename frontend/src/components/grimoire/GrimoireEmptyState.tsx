import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

interface GrimoireEmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function GrimoireEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: GrimoireEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <LinearGradient
          colors={[`${grimoire.colors.purpleMid}40`, grimoire.colors.card]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.inner}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{description}</Text>
          <TouchableOpacity onPress={onAction} activeOpacity={0.85} style={styles.button}>
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: grimoire.spacing.screen,
    paddingBottom: 32,
  },
  card: {
    borderRadius: grimoire.radius.hero,
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    overflow: 'hidden',
  },
  inner: {
    padding: 28,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 24,
    color: grimoire.colors.ivory,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 22,
    color: grimoire.colors.ivoryDim,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: grimoire.colors.gold,
    borderRadius: grimoire.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 15,
    color: grimoire.colors.purpleDeep,
  },
});
