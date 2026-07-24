import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ROUTES } from '@/constants';
import { GlassSurface } from '@/features/home/components/ui/GlassSurface';
import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

interface HomeSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function HomeSearchBar({ value, onChangeText }: HomeSearchBarProps) {
  const router = useRouter();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 6 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 280, delay: 50 }}
      style={styles.wrap}
    >
      <GlassSurface radius={premium.radius.lg} shadow>
        <View style={styles.content}>
          <Search size={20} color={premium.text.muted} strokeWidth={1.75} />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Buscar campanhas, sessões, NPCs..."
            placeholderTextColor={premium.text.faint}
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={() => router.push(ROUTES.app.campaigns)}
          />
          <Pressable
            style={styles.filter}
            accessibilityRole="button"
            accessibilityLabel="Filtros"
            onPress={() => router.push(ROUTES.app.campaigns)}
          >
            <SlidersHorizontal size={18} color={premium.text.muted} strokeWidth={1.75} />
          </Pressable>
        </View>
      </GlassSurface>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    lineHeight: 20,
    color: premium.text.primary,
    padding: 0,
  },
  filter: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
