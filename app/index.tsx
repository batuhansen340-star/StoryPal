import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { isOnboardingDone, getAuthUser } from '../packages/shared/services/auth';
import { COLORS } from '../packages/shared/types';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const done = await isOnboardingDone();
      if (!done) {
        router.replace('/onboarding');
        return;
      }
      const user = await getAuthUser();
      if (!user) {
        router.replace('/auth');
        return;
      }
      router.replace('/(tabs)');
    })();
  }, []);

  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
