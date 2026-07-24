import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/components/providers/AuthProvider';
import { ROUTES } from '@/constants';
import { useAppStore } from '@/store/appStore';
import { grimoire } from '@/theme/grimoire';

export default function Index() {
  const { isLoading, firebaseUser, session } = useAuth();
  const isExplorerMode = useAppStore((state) => state.isExplorerMode);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={grimoire.colors.gold} />
      </View>
    );
  }

  if (firebaseUser || session || isExplorerMode) {
    return <Redirect href={ROUTES.app.home} />;
  }

  return <Redirect href={ROUTES.auth.login} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: grimoire.colors.background,
  },
});
