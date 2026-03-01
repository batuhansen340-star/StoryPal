import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  type ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { THEMES } from '../../apps/storypal/constants/themes';

const { width, height } = Dimensions.get('window');

interface StoryPageData {
  text: string;
  imagePrompt: string;
}

export default function ViewerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    title?: string;
    pages?: string;
    imageUrls?: string;
    coverUrl?: string;
    themeId?: string;
    characterId?: string;
    storyId?: string;
  }>();

  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const title = params.title ?? 'My Story';
  const themeId = params.themeId ?? 'space';
  const selectedTheme = THEMES.find(t => t.id === themeId);
  const themeGradient = selectedTheme?.gradient ?? [COLORS.primary, COLORS.accent];

  let pages: StoryPageData[] = [];
  let imageUrls: string[] = [];
  const coverUrl = params.coverUrl ?? '';

  try {
    if (params.pages) pages = JSON.parse(params.pages);
    if (params.imageUrls) imageUrls = JSON.parse(params.imageUrls);
  } catch {
    // fallback to empty
  }

  // Build full page list: cover + story pages
  const allPages = [
    { type: 'cover' as const, text: title, imageUrl: coverUrl },
    ...pages.map((p, i) => ({
      type: 'page' as const,
      text: p.text,
      imageUrl: imageUrls[i] ?? '',
    })),
  ];

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goToNext = () => {
    if (currentPage < allPages.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
    }
  };

  const goToPrev = () => {
    if (currentPage > 0) {
      flatListRef.current?.scrollToIndex({ index: currentPage - 1 });
    }
  };

  const renderPage = ({ item, index }: { item: typeof allPages[0]; index: number }) => {
    const isCover = item.type === 'cover';

    return (
      <View style={styles.page}>
        <LinearGradient
          colors={isCover ? (themeGradient as [string, string]) : ['#FFF8F0', '#FFE8D6']}
          style={styles.pageGradient}
        >
          {item.imageUrl ? (
            <Animated.View entering={FadeIn.duration(600)} style={styles.imageContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.pageImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.imageOverlay}
              />
            </Animated.View>
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderEmoji}>
                {isCover ? selectedTheme?.emoji ?? '📖' : '🎨'}
              </Text>
            </View>
          )}

          <Animated.View
            entering={FadeInDown.duration(600).delay(200)}
            style={[
              styles.textContainer,
              isCover && styles.coverTextContainer,
            ]}
          >
            {isCover ? (
              <>
                <Text style={styles.coverTitle}>{item.text}</Text>
                <Text style={styles.coverSubtitle}>A StoryPal Adventure</Text>
              </>
            ) : (
              <View style={styles.storyTextCard}>
                <Text style={styles.storyText}>{item.text}</Text>
              </View>
            )}
          </Animated.View>

          {!isCover && (
            <View style={styles.pageNumber}>
              <Text style={styles.pageNumberText}>{index}</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={allPages}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, i) => i.toString()}
      />

      {/* Navigation */}
      <View style={[styles.navBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentPage + 1} / {allPages.length}
          </Text>
        </View>

        <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
          <Text style={styles.navButtonText}>♡</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Arrows */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 20 }]}>
        {currentPage > 0 && (
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={goToPrev}
            activeOpacity={0.8}
          >
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>
        )}

        <View style={styles.dots}>
          {allPages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentPage && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {currentPage < allPages.length - 1 ? (
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={goToNext}
            activeOpacity={0.8}
          >
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, '#FF8E53']}
              style={styles.doneButtonGradient}
            >
              <Text style={styles.doneButtonText}>Done ✨</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  page: {
    width,
    height,
  },
  pageGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  pageImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholderImage: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  placeholderEmoji: {
    fontSize: 120,
  },
  textContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 140,
  },
  coverTextContainer: {
    alignItems: 'center',
    paddingBottom: 180,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  coverSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  storyTextCard: {
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  storyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 32,
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  pageNumberText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10)',
  },
  navButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  pageIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  pageIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  arrowButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#fff',
  },
  doneButton: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
