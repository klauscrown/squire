import { Pressable, StyleSheet, View } from 'react-native';

import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { useActivePalette } from '@/store/useThemeStore';

import { AuthText } from '../AuthText';

interface LoginFooterArtProps {
  onExplore?: () => void;
  exploreLoading?: boolean;
}

export function LoginFooterArt({ onExplore, exploreLoading }: LoginFooterArtProps) {
  const palette = useActivePalette();

  if (!onExplore) return null;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onExplore}
        disabled={exploreLoading}
        style={({ pressed }) => [styles.explorerBtn, pressed && styles.explorerPressed]}
      >
        <AuthText style={[styles.explorerText, { color: palette.textSecondary }]}>
          {exploreLoading ? 'Abrindo…' : 'Continuar como explorador'}
        </AuthText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: loginLayout.footer.marginTop,
  },
  explorerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  explorerPressed: {
    opacity: 0.7,
  },
  explorerText: {
    ...loginTypography.explorer,
    opacity: 0.72,
  },
});
