import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../types';
import { EmojiText } from './EmojiText';

interface NetworkBannerProps {
  t?: (key: string) => string;
}

export function NetworkBanner({ t }: NetworkBannerProps = {}) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      setIsOffline(!navigator.onLine);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // Native: no built-in offline detection without @react-native-community/netinfo
    // If the package is installed, it can be integrated here.
    // For now, native relies on request failures to indicate offline status.
  }, []);

  if (!isOffline) return null;

  return (
    <Animated.View entering={FadeInUp.duration(300)} exiting={FadeOutUp.duration(300)} style={styles.banner}>
      <EmojiText style={styles.emoji}>{'\u{1F4E1}'}</EmojiText>
      <Text style={styles.text}>{t ? t('noInternet') : 'No internet connection'}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emoji: {
    fontSize: 16,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
});
