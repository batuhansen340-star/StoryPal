import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { THEMES } from '../../apps/storypal/constants/themes';
import { speak, stop as stopTTS, type TTSSpeed } from '../../packages/shared/services/tts';
import { getSpeechLanguageCode } from '../../packages/shared/services/tts';

const { width, height } = Dimensions.get('window');

interface StoryPageData {
  text: string;
  imagePrompt: string;
}

const BEDTIME_BG = '#1a1a2e';
const BEDTIME_TEXT = '#E8E8F0';

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
    language?: string;
  }>();

  const [currentPage, setCurrentPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [bedtimeMode, setBedtimeMode] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState<TTSSpeed>('normal');
  const [showControls, setShowControls] = useState(false);
  const [showSweetDreams, setShowSweetDreams] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const autoPlayRef = useRef(false);

  const title = params.title ?? 'My Story';
  const themeId = params.themeId ?? 'space';
  const languageCode = params.language ?? 'en';
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

  const allPages = [
    { type: 'cover' as const, text: title, imageUrl: coverUrl },
    ...pages.map((p, i) => ({
      type: 'page' as const,
      text: p.text,
      imageUrl: imageUrls[i] ?? '',
    })),
  ];

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const speakCurrentPage = useCallback(async (pageIndex: number) => {
    const page = allPages[pageIndex];
    if (!page || page.type === 'cover') return;

    setIsSpeaking(true);
    await speak(page.text, {
      language: getSpeechLanguageCode(languageCode),
      speed: ttsSpeed,
      isBedtimeMode: bedtimeMode,
      onDone: () => {
        setIsSpeaking(false);
        if (autoPlayRef.current && pageIndex < allPages.length - 1) {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: pageIndex + 1 });
          }, 800);
        } else if (autoPlayRef.current && pageIndex === allPages.length - 1 && bedtimeMode) {
          setShowSweetDreams(true);
        }
      },
    });
  }, [allPages, languageCode, ttsSpeed, bedtimeMode]);

  useEffect(() => {
    if (autoPlay && currentPage > 0) {
      speakCurrentPage(currentPage);
    }
  }, [currentPage, autoPlay]);

  const handlePlayPause = async () => {
    if (isSpeaking) {
      await stopTTS();
      setIsSpeaking(false);
    } else {
      speakCurrentPage(currentPage);
    }
  };

  const goToNext = () => {
    if (currentPage < allPages.length - 1) {
      stopTTS();
      flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
    }
  };

  const goToPrev = () => {
    if (currentPage > 0) {
      stopTTS();
      flatListRef.current?.scrollToIndex({ index: currentPage - 1 });
    }
  };

  const cycleSpeed = () => {
    const speeds: TTSSpeed[] = ['slow', 'normal', 'fast'];
    const idx = speeds.indexOf(ttsSpeed);
    setTtsSpeed(speeds[(idx + 1) % speeds.length]);
  };

  const toggleBedtime = () => {
    setBedtimeMode(prev => !prev);
    setShowSweetDreams(false);
  };

  const bgColors = bedtimeMode
    ? [BEDTIME_BG, '#16213e']
    : ['#FFF8F0', '#FFE8D6'];

  const renderPage = ({ item, index }: { item: typeof allPages[0]; index: number }) => {
    const isCover = item.type === 'cover';

    return (
      <View style={styles.page}>
        <LinearGradient
          colors={isCover ? (themeGradient as [string, string]) : (bgColors as [string, string])}
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
                colors={['transparent', bedtimeMode ? 'rgba(26,26,46,0.8)' : 'rgba(0,0,0,0.6)']}
                style={styles.imageOverlay}
              />
            </Animated.View>
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderEmoji}>
                {isCover ? selectedTheme?.emoji ?? '\u{1F4D6}' : '\u{1F3A8}'}
              </Text>
              {bedtimeMode && !isCover && (
                <View style={styles.starsContainer}>
                  <Text style={styles.star}>{'\u2B50'}</Text>
                  <Text style={[styles.star, styles.star2]}>{'\u{2728}'}</Text>
                  <Text style={[styles.star, styles.star3]}>{'\u{1F31F}'}</Text>
                </View>
              )}
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
              <View style={[
                styles.storyTextCard,
                bedtimeMode && styles.storyTextCardBedtime,
              ]}>
                <Text style={[
                  styles.storyText,
                  bedtimeMode && styles.storyTextBedtime,
                ]}>
                  {item.text}
                </Text>
              </View>
            )}
          </Animated.View>

          {!isCover && (
            <View style={styles.pageNumber}>
              <Text style={[styles.pageNumberText, bedtimeMode && { color: 'rgba(255,255,255,0.4)' }]}>
                {index}
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  if (showSweetDreams) {
    return (
      <View style={styles.sweetDreamsContainer}>
        <LinearGradient
          colors={[BEDTIME_BG, '#0f3460', BEDTIME_BG]}
          style={styles.sweetDreamsGradient}
        >
          <Animated.View entering={FadeIn.duration(2000)} style={styles.sweetDreamsContent}>
            <Text style={styles.sweetDreamsMoon}>{'\u{1F319}'}</Text>
            <Text style={styles.sweetDreamsText}>Sweet dreams...</Text>
            <Text style={styles.sweetDreamsStars}>{'\u2B50'} {'\u{2728}'} {'\u{1F31F}'}</Text>
          </Animated.View>
          <TouchableOpacity
            style={styles.sweetDreamsClose}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.7}
          >
            <Text style={styles.sweetDreamsCloseText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

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

      {/* Top Navigation */}
      <View style={[styles.navBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.navButton, bedtimeMode && styles.navButtonBedtime]}
          onPress={() => { stopTTS(); router.back(); }}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>{'\u2715'}</Text>
        </TouchableOpacity>

        <View style={[styles.pageIndicator, bedtimeMode && styles.pageIndicatorBedtime]}>
          <Text style={styles.pageIndicatorText}>
            {currentPage + 1} / {allPages.length}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.navButton, bedtimeMode && styles.navButtonBedtime]}
          onPress={() => setShowControls(!showControls)}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>{'\u{1F3B5}'}</Text>
        </TouchableOpacity>
      </View>

      {/* TTS Controls Panel */}
      {showControls && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={[styles.controlsPanel, { top: insets.top + 64 }, bedtimeMode && styles.controlsPanelBedtime]}
        >
          {/* Bedtime Mode Toggle */}
          <TouchableOpacity
            style={[styles.controlRow, bedtimeMode && styles.controlRowActive]}
            onPress={toggleBedtime}
            activeOpacity={0.8}
          >
            <Text style={styles.controlEmoji}>{bedtimeMode ? '\u{1F319}' : '\u{2600}\u{FE0F}'}</Text>
            <Text style={[styles.controlLabel, bedtimeMode && styles.controlLabelBedtime]}>
              Bedtime Mode
            </Text>
            <View style={[styles.toggleTrack, bedtimeMode && styles.toggleTrackActive]}>
              <View style={[styles.toggleThumb, bedtimeMode && styles.toggleThumbActive]} />
            </View>
          </TouchableOpacity>

          {/* Auto-Play Toggle */}
          <TouchableOpacity
            style={styles.controlRow}
            onPress={() => setAutoPlay(!autoPlay)}
            activeOpacity={0.8}
          >
            <Text style={styles.controlEmoji}>{'\u{1F504}'}</Text>
            <Text style={[styles.controlLabel, bedtimeMode && styles.controlLabelBedtime]}>
              Auto-Play
            </Text>
            <View style={[styles.toggleTrack, autoPlay && styles.toggleTrackActive]}>
              <View style={[styles.toggleThumb, autoPlay && styles.toggleThumbActive]} />
            </View>
          </TouchableOpacity>

          {/* Speed */}
          <TouchableOpacity
            style={styles.controlRow}
            onPress={cycleSpeed}
            activeOpacity={0.8}
          >
            <Text style={styles.controlEmoji}>{'\u{23E9}'}</Text>
            <Text style={[styles.controlLabel, bedtimeMode && styles.controlLabelBedtime]}>
              Speed
            </Text>
            <View style={styles.speedBadge}>
              <Text style={styles.speedBadgeText}>
                {ttsSpeed === 'slow' ? 'Slow' : ttsSpeed === 'fast' ? 'Fast' : 'Normal'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 20 }]}>
        {currentPage > 0 && (
          <TouchableOpacity
            style={[styles.arrowButton, bedtimeMode && styles.arrowButtonBedtime]}
            onPress={goToPrev}
            activeOpacity={0.8}
          >
            <Text style={styles.arrowText}>{'\u2190'}</Text>
          </TouchableOpacity>
        )}

        {/* Play/Pause Button */}
        {currentPage > 0 && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={bedtimeMode ? ['#0f3460', '#1a1a2e'] : [COLORS.primary, '#FF8E53']}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playButtonText}>
                {isSpeaking ? '\u{23F8}\u{FE0F}' : '\u{25B6}\u{FE0F}'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.dots}>
          {allPages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentPage && styles.dotActive,
                bedtimeMode && styles.dotBedtime,
                i === currentPage && bedtimeMode && styles.dotActiveBedtime,
              ]}
            />
          ))}
        </View>

        {currentPage < allPages.length - 1 ? (
          <TouchableOpacity
            style={[styles.arrowButton, bedtimeMode && styles.arrowButtonBedtime]}
            onPress={goToNext}
            activeOpacity={0.8}
          >
            <Text style={styles.arrowText}>{'\u2192'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              stopTTS();
              if (bedtimeMode) {
                setShowSweetDreams(true);
              } else {
                router.replace('/(tabs)');
              }
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={bedtimeMode ? ['#0f3460', '#1a1a2e'] : [COLORS.primary, '#FF8E53']}
              style={styles.doneButtonGradient}
            >
              <Text style={styles.doneButtonText}>
                {bedtimeMode ? '\u{1F319}' : 'Done \u{2728}'}
              </Text>
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
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    fontSize: 20,
    top: '20%',
    left: '15%',
  },
  star2: {
    top: '30%',
    left: '75%',
    fontSize: 16,
  },
  star3: {
    top: '15%',
    left: '50%',
    fontSize: 24,
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
  storyTextCardBedtime: {
    backgroundColor: 'rgba(15, 52, 96, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  storyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 32,
    textAlign: 'center',
  },
  storyTextBedtime: {
    color: BEDTIME_TEXT,
    fontWeight: '500',
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
  },
  navButtonBedtime: {
    backgroundColor: 'rgba(15, 52, 96, 0.6)',
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
  pageIndicatorBedtime: {
    backgroundColor: 'rgba(15, 52, 96, 0.6)',
  },
  pageIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  // TTS Controls Panel
  controlsPanel: {
    position: 'absolute',
    right: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
    minWidth: 200,
  },
  controlsPanelBedtime: {
    backgroundColor: '#16213e',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  controlRowActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
  },
  controlEmoji: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  controlLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  controlLabelBedtime: {
    color: BEDTIME_TEXT,
  },
  toggleTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackActive: {
    backgroundColor: COLORS.primary,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  speedBadge: {
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  speedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  // Bottom
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
  arrowButtonBedtime: {
    backgroundColor: 'rgba(15, 52, 96, 0.6)',
  },
  arrowText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
  playButton: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 24,
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
  dotBedtime: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActiveBedtime: {
    backgroundColor: 'rgba(255,255,255,0.6)',
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
  // Sweet Dreams
  sweetDreamsContainer: {
    flex: 1,
  },
  sweetDreamsGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sweetDreamsContent: {
    alignItems: 'center',
  },
  sweetDreamsMoon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  sweetDreamsText: {
    fontSize: 36,
    fontWeight: '300',
    color: BEDTIME_TEXT,
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  sweetDreamsStars: {
    fontSize: 28,
    letterSpacing: 8,
  },
  sweetDreamsClose: {
    position: 'absolute',
    bottom: 60,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  sweetDreamsCloseText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '600',
  },
});
