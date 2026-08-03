import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Plus } from 'phosphor-react-native';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

interface CampaignEmptyStateProps {
  onCreatePress: () => void;
}

export function CampaignEmptyState({ onCreatePress }: CampaignEmptyStateProps) {
  const grimoire = useGrimoire();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onCreatePress();
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 400, delay: 200 }}
      style={styles.wrap}
    >
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
          <Text style={[styles.title, { color: grimoire.colors.ivory }]}>
            O Escudeiro aguarda seu comando
          </Text>
          <Text style={[styles.body, { color: grimoire.colors.ivoryDim }]}>
            Crie sua primeira campanha para começarmos a organizar suas sessões de RPG.
          </Text>
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.85}
            style={[
              styles.button,
              {
                backgroundColor: grimoire.colors.gold,
                borderRadius: grimoire.radius.md,
              },
            ]}
          >
            <Plus size={18} color={grimoire.colors.purpleDeep} weight="bold" />
            <Text style={[styles.buttonText, { color: grimoire.colors.purpleDeep }]}>
              Criar campanha
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 48,
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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
