import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { THEMES } from '../../apps/storypal/constants/themes';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md) / 2;

// Placeholder data — will be replaced with real data from Supabase
const PLACEHOLDER_STORIES = [
  {
    id: '1',
    title: 'Luna and the Star Dragon',
    theme: 'space',
    character: 'Luna',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: "Whiskers' Ocean Quest",
    theme: 'ocean',
    character: 'Whiskers',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: 'The Enchanted Forest',
    theme: 'forest',
    character: 'Clover',
    createdAt: '2024-01-13',
  },
];

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [stories] = useState(PLACEHOLDER_STORIES);

  const getThemeGradient = (themeId: string): [string, string] => {
    const theme = THEMES.find(t => t.id === themeId);
    return theme?.gradient ?? [COLORS.primary, COLORS.accent];
  };

  const getThemeEmoji = (themeId: string): string => {
    const theme = THEMES.find(t => t.id === themeId);
    return theme?.emoji ?? '📖';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>My Library 📚</Text>
          <Text style={styles.subtitle}>
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} created
          </Text>
        </Animated.View>

        {stories.length === 0 ? (
          <Animated.View
            entering={FadeInUp.duration(600).delay(200)}
            style={styles.emptyState}
          >
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyTitle}>No stories yet!</Text>
            <Text style={styles.emptyText}>
              Create your first magical story and it will appear here
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)/create')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[COLORS.primary, '#FF8E53']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyButtonGradient}
              >
                <Text style={styles.emptyButtonText}>Create Story ✨</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.grid}>
            {stories.map((story, index) => (
              <Animated.View
                key={story.id}
                entering={FadeInDown.duration(400).delay(index * 100)}
              >
                <TouchableOpacity
                  style={styles.storyCard}
                  activeOpacity={0.85}
                  onPress={() => router.push({
                    pathname: '/story/viewer',
                    params: { storyId: story.id },
                  })}
                >
                  <LinearGradient
                    colors={getThemeGradient(story.theme)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.storyCardCover}
                  >
                    <Text style={styles.storyEmoji}>
                      {getThemeEmoji(story.theme)}
                    </Text>
                  </LinearGradient>
                  <View style={styles.storyInfo}>
                    <Text style={styles.storyTitle} numberOfLines={2}>
                      {story.title}
                    </Text>
                    <Text style={styles.storyMeta}>
                      {story.character} · {story.theme}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}

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
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  emptyButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyButtonGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  storyCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  storyCardCover: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyEmoji: {
    fontSize: 48,
  },
  storyInfo: {
    padding: SPACING.md,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  storyMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: 'capitalize',
  },
});
