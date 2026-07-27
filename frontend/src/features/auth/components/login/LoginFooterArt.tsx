import { Pressable, StyleSheet, View } from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginLayout } from '@/features/auth/constants/loginLayout';

import { AuthText } from '../AuthText';

interface LoginFooterArtProps {
  onExplore?: () => void;
  exploreLoading?: boolean;
}

export function LoginFooterArt({ onExplore, exploreLoading }: LoginFooterArtProps) {
  if (!onExplore) return null;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onExplore}
        disabled={exploreLoading}
        style={({ pressed }) => [styles.explorerBtn, pressed && styles.explorerPressed]}
      >
        <AuthText style={styles.explorerText}>
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
    fontFamily: loginFonts.body,
    fontSize: loginLayout.footer.fontSize,
    lineHeight: 16,
    color: 'rgba(165, 180, 252, 0.52)',
  },
});
