import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { THEMES } from '../../apps/storypal/constants/themes';
import { getAuthUser } from '../../packages/shared/services/auth';
import {
  getSavedStories,
  deleteStory,
  type SavedStory,
} from '../../packages/shared/services/story-storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md) / 2;

type LibraryState = 'loading' | 'guest-locked' | 'empty' | 'stories';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [state, setState] = useState<LibraryState>('loading');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const user = await getAuthUser();
        if (!user) {
          setState('guest-locked');
          return;
        }
        const saved = await getSavedStories();
        setStories(saved);
        setState(saved.length > 0 ? 'stories' : 'empty');
      })();
    }, [])
  );

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete Story',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteStory(id);
            const updated = await getSavedStories();
            setStories(updated);
            if (updated.length === 0) setState('empty');
          },
        },
      ]
    );
  };

  const openStory = (story: SavedStory) => {
    router.push({
      pathname: '/story/viewer',
      params: {
        title: story.title,
        pages: story.pages,
        imageUrls: story.imageUrls,
        coverUrl: story.coverUrl,
        themeId: story.theme,
        characterId: story.character,
        language: story.language,
        savedStoryId: story.id,
      },
    });
  };

  const getThemeGradient = (themeId: string): [string, string] => {
    const theme = THEMES.find(t => t.id === themeId);
    return theme?.gradient ?? [COLORS.primary, COLORS.accent];
  };

  const getThemeEmoji = (themeId: string): string => {
    const theme = THEMES.find(t => t.id === themeId);
    return theme?.emoji ?? '\u{1F4D6}';
  };

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  // Guest locked state
  if (state === 'guest-locked') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headerArea}>
          <Text style={styles.title}>My Library {'\u{1F4DA}'}</Text>
        </Animated.View>
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.lockState}>
          <Text style={styles.lockEmoji}>{'\u{1F512}'}</Text>
          <Text style={styles.lockTitle}>Sign In to Save Stories</Text>
          <Text style={styles.lockText}>
            Create an account to save your stories and access them anytime.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/auth')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.primary, '#FF8E53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.lockButton}
            >
              <Text style={styles.lockButtonText}>Sign In {'\u{2728}'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Empty state
  if (state === 'empty') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headerArea}>
          <Text style={styles.title}>My Library {'\u{1F4DA}'}</Text>
          <Text style={styles.subtitle}>0 stories</Text>
        </Animated.View>
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>{'\u{1F4D6}'}</Text>
          <Text style={styles.emptyTitle}>No stories yet!</Text>
          <Text style={styles.emptyText}>
            Create your first magical story and it will appear here
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/create')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.primary, '#FF8E53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>Create Story {'\u{2728}'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Stories list
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Animated.View entering={FadeInDown.duration(600)}>
            <Text style={styles.title}>My Library {'\u{1F4DA}'}</Text>
            <Text style={styles.subtitle}>
              {stories.length} {stories.length === 1 ? 'story' : 'stories'}
            </Text>
          </Animated.View>
        }
        ListFooterComponent={<View style={{ height: 120 }} />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(400).delay(index * 80)}>
            <TouchableOpacity
              style={styles.storyCard}
              activeOpacity={0.85}
              onPress={() => openStory(item)}
              onLongPress={() => handleDelete(item.id, item.title)}
            >
              <LinearGradient
                colors={getThemeGradient(item.theme)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.storyCardCover}
              >
                <Text style={styles.storyEmoji}>
                  {getThemeEmoji(item.theme)}
                </Text>
              </LinearGradient>
              <View style={styles.storyInfo}>
                <Text style={styles.storyTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.storyMeta}>
                  {item.character} {'\u00B7'} {formatDate(item.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerArea: {
    paddingHorizontal: SPACING.lg,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
  },
  row: {
    gap: SPACING.md,
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
    marginBottom: SPACING.lg,
  },
  // Guest locked
  lockState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SPACING.xl,
  },
  lockEmoji: {
    fontSize: 72,
    marginBottom: SPACING.md,
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  lockText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  lockButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  lockButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  // Empty
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
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  // Story cards
  storyCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
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
  },
});
