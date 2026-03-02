import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../../packages/shared/types';
import { THEMES } from '../../apps/storypal/constants/themes';
import { getAuthUser } from '../../packages/shared/services/auth';
import {
  getSavedStories,
  deleteStory,
  type SavedStory,
} from '../../packages/shared/services/story-storage';
import { EmptyState } from '../../packages/shared/components/EmptyState';
import { SkeletonCard } from '../../packages/shared/components/SkeletonLoader';
import { notification } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md) / 2;

type LibraryState = 'loading' | 'guest-locked' | 'empty' | 'stories';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
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
        // Both logged-in and guest users can see their saved stories
        const saved = await getSavedStories();
        setStories(saved);
        setState(saved.length > 0 ? 'stories' : 'empty');
      })();
    }, [])
  );

  const handleDelete = async (id: string, title: string) => {
    const doDelete = async () => {
      await deleteStory(id);
      notification('success');
      const updated = await getSavedStories();
      setStories(updated);
      if (updated.length === 0) setState('empty');
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${title}"?`)) {
        await doDelete();
      }
    } else {
      Alert.alert('Delete Story', `Are you sure you want to delete "${title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const openStory = (story: SavedStory) => {
    router.push({
      pathname: '/story/viewer',
      params: {
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

  // Loading state with skeleton
  if (state === 'loading') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerArea}>
          <Text style={styles.title}>{t('myLibrary')} {'\u{1F4DA}'}</Text>
        </View>
        <View style={styles.skeletonGrid}>
          <SkeletonCard style={{ width: CARD_WIDTH }} />
          <SkeletonCard style={{ width: CARD_WIDTH }} />
          <SkeletonCard style={{ width: CARD_WIDTH }} />
          <SkeletonCard style={{ width: CARD_WIDTH }} />
        </View>
      </View>
    );
  }

  // Guest locked state
  if (state === 'guest-locked') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headerArea}>
          <Text style={styles.title}>{t('myLibrary')} {'\u{1F4DA}'}</Text>
        </Animated.View>
        <EmptyState
          emoji={'\u{1F512}'}
          title="Sign In to Save Stories"
          subtitle="Create an account to save your stories and access them anytime."
          buttonText="Sign In \u{2728}"
          onPress={() => router.push('/auth')}
        />
      </View>
    );
  }

  // Empty state
  if (state === 'empty') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headerArea}>
          <Text style={styles.title}>{t('myLibrary')} {'\u{1F4DA}'}</Text>
          <Text style={styles.subtitle}>0 {t('storiesCreated')}</Text>
        </Animated.View>
        <EmptyState
          emoji={'\u{1F4D6}'}
          title={t('noStoriesYet')}
          subtitle={t('noStoriesText')}
          buttonText="Create Story \u{2728}"
          onPress={() => router.push('/(tabs)/create')}
        />
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
            <Text style={styles.title}>{t('myLibrary')} {'\u{1F4DA}'}</Text>
            <Text style={styles.subtitle}>
              {stories.length} {t('storiesCreated')}
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
              accessibilityLabel={item.title}
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
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
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
