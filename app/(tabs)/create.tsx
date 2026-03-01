import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { AGE_GROUPS } from '../../apps/storypal/constants/themes';
import type { AgeGroup } from '../../packages/shared/types';

const AGE_GROUP_EMOJIS: Record<AgeGroup, string> = {
  '3-5': '🍼',
  '5-7': '🎒',
  '7-10': '📚',
};

const AGE_GROUP_GRADIENTS: Record<AgeGroup, [string, string]> = {
  '3-5': ['#FF6B6B', '#FF8E53'],
  '5-7': ['#4ECDC4', '#44B09E'],
  '7-10': ['#A18CD1', '#FBC2EB'],
};

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSelectAge = (ageGroup: AgeGroup) => {
    router.push({
      pathname: '/story/select-language',
      params: { ageGroup },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>Create a Story ✨</Text>
          <Text style={styles.subtitle}>
            First, choose the age group for your story
          </Text>
        </Animated.View>

        <View style={styles.ageCards}>
          {(Object.entries(AGE_GROUPS) as [AgeGroup, typeof AGE_GROUPS[AgeGroup]][]).map(
            ([key, config], index) => (
              <Animated.View
                key={key}
                entering={FadeInDown.duration(500).delay(index * 150)}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleSelectAge(key)}
                >
                  <LinearGradient
                    colors={AGE_GROUP_GRADIENTS[key]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ageCard}
                  >
                    <Text style={styles.ageEmoji}>
                      {AGE_GROUP_EMOJIS[key]}
                    </Text>
                    <View style={styles.ageInfo}>
                      <Text style={styles.ageLabel}>{config.label}</Text>
                      <Text style={styles.ageDesc}>{config.description}</Text>
                      <View style={styles.ageDetails}>
                        <View style={styles.ageBadge}>
                          <Text style={styles.ageBadgeText}>
                            {config.pages} pages
                          </Text>
                        </View>
                        <View style={styles.ageBadge}>
                          <Text style={styles.ageBadgeText}>
                            ~{config.maxWordsPerPage} words/page
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.ageArrow}>→</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ),
          )}
        </View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(500)}
          style={styles.tipCard}
        >
          <View style={styles.tipGlass}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              Younger ages get simpler stories with bigger pictures.
              Older ages get longer adventures with richer details!
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  ageCards: {
    gap: SPACING.md,
  },
  ageCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  ageEmoji: {
    fontSize: 48,
    marginRight: SPACING.md,
  },
  ageInfo: {
    flex: 1,
  },
  ageLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  ageDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: SPACING.sm,
  },
  ageDetails: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  ageBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  ageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  ageArrow: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '800',
  },
  tipCard: {
    marginTop: SPACING.xl,
  },
  tipGlass: {
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
});
