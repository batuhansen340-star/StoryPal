import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { COLORS } from '../packages/shared/types';
import { NetworkBanner } from '../packages/shared/components/NetworkBanner';
import { ErrorBoundary } from '../packages/shared/components/ErrorBoundary';
import { LanguageProvider } from '../constants/LanguageContext';
import { SubscriptionProvider } from '../constants/SubscriptionContext';
import { UsageProvider } from '../constants/UsageContext';
import { configureRevenueCat } from '../packages/shared/services/revenue-cat';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
    configureRevenueCat();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ErrorBoundary>
      <LanguageProvider>
      <SubscriptionProvider>
      <UsageProvider>
      <StatusBar style="dark" />
      <NetworkBanner />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'none' }} />
        <Stack.Screen name="auth" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen
          name="story"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="paywall" options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }} />
      </Stack>
      </UsageProvider>
      </SubscriptionProvider>
      </LanguageProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
