import React from 'react';
import { Text, Platform, StyleSheet, type TextStyle, type StyleProp } from 'react-native';

interface EmojiTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

/**
 * iOS simulator ve bazı cihazlarda emoji rendering sorunu yaşanabiliyor.
 * Bu bileşen emoji karakterlerin doğru font ile render edilmesini sağlar.
 */
export function EmojiText({ children, style }: EmojiTextProps) {
  return (
    <Text
      style={[styles.emoji, style]}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  emoji: {
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'sans-serif' },
    }),
  },
});
