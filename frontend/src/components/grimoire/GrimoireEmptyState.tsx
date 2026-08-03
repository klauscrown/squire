import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
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
  const grimoire = useGrimoire();

  return (
    <View style={[styles.wrap, { paddingHorizontal: grimoire.spacing.screen }]}>
      <View
        style={[
          styles.card,
          {
            borderRadius: grimoire.radius.hero,
            borderColor: grimoire.colors.glassGoldBorder,
          },
        ]}
      >
        <LinearGradient
          colors={[`${grimoire.colors.purpleMid}40`, grimoire.colors.card]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.inner}>
          <Text style={[styles.title, { color: grimoire.colors.ivory }]}>{title}</Text>
          <Text style={[styles.body, { color: grimoire.colors.ivoryDim }]}>{description}</Text>
          <TouchableOpacity
            onPress={onAction}
            activeOpacity={0.85}
            style={[
              styles.button,
              {
                backgroundColor: grimoire.colors.gold,
                borderRadius: grimoire.radius.md,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: grimoire.colors.purpleDeep }]}>
              {actionLabel}
            </Text>
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
    paddingBottom: 32,
  },
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  inner: {
    padding: 28,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 15,
  },
});
