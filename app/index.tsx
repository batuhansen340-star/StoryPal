import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { isOnboardingDone, getAuthUser } from '../packages/shared/services/auth';
import { COLORS } from '../packages/shared/types';

type Target = '/(tabs)' | '/onboarding' | '/auth';

export default function IndexScreen() {
  const [target, setTarget] = useState<Target | null>(null);

  useEffect(() => {
    (async () => {
      const done = await isOnboardingDone();
      if (!done) {
        setTarget('/onboarding');
        return;
      }
      const user = await getAuthUser();
      if (!user) {
        setTarget('/auth');
        return;
      }
      setTarget('/(tabs)');
    })();
  }, []);

  if (!target) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <Redirect href={target} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
