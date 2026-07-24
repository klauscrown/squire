import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Plus } from 'phosphor-react-native';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

interface CampaignEmptyStateProps {
  onCreatePress: () => void;
}

export function CampaignEmptyState({ onCreatePress }: CampaignEmptyStateProps) {
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
      <View style={styles.card}>
        <LinearGradient
          colors={[`${grimoire.colors.purpleMid}40`, grimoire.colors.card]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.inner}>
          <Text style={styles.title}>O Escudeiro aguarda seu comando</Text>
          <Text style={styles.body}>
            Crie sua primeira campanha para começarmos a organizar suas sessões de RPG.
          </Text>
          <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={styles.button}>
            <Plus size={18} color={grimoire.colors.purpleDeep} weight="bold" />
            <Text style={styles.buttonText}>Criar campanha</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: grimoire.colors.gold,
    borderRadius: grimoire.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 15,
    color: grimoire.colors.purpleDeep,
    letterSpacing: 0.2,
  },
});
