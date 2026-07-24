import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/features/home/components/ui/GlassSurface';
import { HomeSectionHeader } from '@/features/home/components/ui/HomeSectionHeader';
import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

interface HomeCreateCampaignCardProps {
  onPress: () => void;
}

export function HomeCreateCampaignCard({ onPress }: HomeCreateCampaignCardProps) {
  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }

  return (
    <View style={styles.section}>
      <HomeSectionHeader title="Campanhas" />
      <GlassSurface radius={premium.radius.xl}>
        <View style={styles.body}>
          <Text style={styles.title}>Comece sua primeira crônica</Text>
          <Text style={styles.subtitle}>
            Crie uma campanha e organize sessões, NPCs e notas em um só lugar.
          </Text>
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            accessibilityRole="button"
            accessibilityLabel="Criar campanha"
          >
            <LinearGradient
              colors={[...premium.gradient]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.ctaGradient}
            >
              <Plus size={18} color="#FFF" strokeWidth={2.2} />
              <Text style={styles.ctaLabel}>Nova campanha</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: premium.spacing.section,
  },
  body: {
    padding: 22,
    gap: 10,
  },
  title: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 18,
    color: premium.text.primary,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 21,
    color: premium.text.secondary,
  },
  cta: {
    marginTop: 8,
    borderRadius: premium.radius.md,
    overflow: 'hidden',
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  ctaLabel: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
