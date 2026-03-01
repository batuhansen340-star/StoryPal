import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Platform,
  type ViewToken,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import type { StoryChoice } from '../../packages/shared/types';
import { THEMES } from '../../apps/storypal/constants/themes';
import { speak, stop as stopTTS, type TTSSpeed } from '../../packages/shared/services/tts';
import { getSpeechLanguageCode } from '../../packages/shared/services/tts';
import { getVoiceCharacterById } from '../../constants/voice-characters';
import { getRecordingForPage } from '../../packages/shared/services/audio-recorder';
import { Audio } from 'expo-av';
import { saveStory, getStoryById } from '../../packages/shared/services/story-storage';
import { shareStoryPDF } from '../../packages/shared/services/story-export';

const { width, height } = Dimensions.get('window');

interface StoryPageData {
  text: string;
  imagePrompt: string;
  choices?: StoryChoice[];
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
    voiceCharacterId?: string;
    savedStoryId?: string;
  }>();

  const [currentPage, setCurrentPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [bedtimeMode, setBedtimeMode] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState<TTSSpeed>('normal');
  const [showControls, setShowControls] = useState(false);
  const [showSweetDreams, setShowSweetDreams] = useState(false);
  const [useParentVoice, setUseParentVoice] = useState(false);
  const [hasParentRecording, setHasParentRecording] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(!!params.savedStoryId && !params.pages);
  const [isExporting, setIsExporting] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const autoPlayRef = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const hasSaved = useRef(false);

  // Story data as state — initialized from params, updated from storage for saved stories
  const [title, setTitle] = useState(params.title ?? 'My Story');
  const [themeId, setThemeId] = useState(params.themeId ?? 'space');
  const [languageCode, setLanguageCode] = useState(params.language ?? 'en');
  const [pages, setPages] = useState<StoryPageData[]>(() => {
    try { return params.pages ? JSON.parse(params.pages) : []; }
    catch { return []; }
  });
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    try { return params.imageUrls ? JSON.parse(params.imageUrls) : []; }
    catch { return []; }
  });
  const [coverUrl, setCoverUrl] = useState(params.coverUrl ?? '');

  const voiceCharacterId = params.voiceCharacterId;
  const voiceCharacter = voiceCharacterId ? getVoiceCharacterById(voiceCharacterId) : undefined;
  const selectedTheme = THEMES.find(t => t.id === themeId);
  const themeGradient = selectedTheme?.gradient ?? [COLORS.primary, COLORS.accent];
  const storyId = params.storyId ?? params.savedStoryId ?? 'demo';

  // Load saved story from AsyncStorage
  useEffect(() => {
    if (!params.savedStoryId || params.pages) return;
    (async () => {
      const saved = await getStoryById(params.savedStoryId as string);
      if (!saved) { setIsLoadingSaved(false); return; }
      setTitle(saved.title);
      setThemeId(saved.theme);
      setLanguageCode(saved.language);
      setCoverUrl(saved.coverUrl);
      try { setPages(JSON.parse(saved.pages)); } catch {}
      try { setImageUrls(JSON.parse(saved.imageUrls)); } catch {}
      setIsLoadingSaved(false);
    })();
  }, [params.savedStoryId]);

  const allPages = [
    { type: 'cover' as const, text: title, imageUrl: coverUrl, choices: undefined as StoryChoice[] | undefined },
    ...pages.map((p, i) => ({
      type: 'page' as const,
      text: p.text,
      imageUrl: imageUrls[i] ?? '',
      choices: p.choices,
    })),
  ];

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  useEffect(() => {
    return () => {
      stopTTS();
      soundRef.current?.unloadAsync();
    };
  }, []);

  // Auto-save new stories (not from library) — runs once
  useEffect(() => {
    if (hasSaved.current) return;
    if (!params.savedStoryId && params.pages && params.title) {
      hasSaved.current = true;
      console.log('[Viewer] Auto-saving story:', params.title);
      saveStory({
        title: params.title,
        theme: themeId,
        character: params.characterId ?? '',
        language: languageCode,
        pages: params.pages,
        imageUrls: params.imageUrls ?? '[]',
        coverUrl: coverUrl,
      })
        .then(() => console.log('[Viewer] Story saved successfully'))
        .catch((err) => console.warn('[Viewer] Auto-save failed:', err));
    }
  }, [params.savedStoryId, params.pages, params.title]);

  // Check for parent recording on page change
  useEffect(() => {
    if (currentPage > 0) {
      getRecordingForPage(storyId, currentPage - 1).then(uri => {
        setHasParentRecording(!!uri);
      });
    }
  }, [currentPage, storyId]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Web fallback: onViewableItemsChanged doesn't fire reliably on web
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS !== 'web') return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(prev => prev !== page ? page : prev);
  }, []);

  const playParentRecording = useCallback(async (pageIndex: number) => {
    const uri = await getRecordingForPage(storyId, pageIndex - 1);
    if (!uri) return;

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync({ uri });
    soundRef.current = sound;

    setIsSpeaking(true);
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setIsSpeaking(false);
        if (autoPlayRef.current && pageIndex < allPages.length - 1) {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: pageIndex + 1 });
          }, 800);
        }
      }
    });
    await sound.playAsync();
  }, [allPages, storyId]);

  const speakCurrentPage = useCallback(async (pageIndex: number) => {
    const page = allPages[pageIndex];
    if (!page) return;

    // Check for parent voice
    if (useParentVoice) {
      const uri = await getRecordingForPage(storyId, pageIndex - 1);
      if (uri) {
        await playParentRecording(pageIndex);
        return;
      }
    }

    setIsSpeaking(true);
    await speak(page.text, {
      language: getSpeechLanguageCode(languageCode),
      speed: ttsSpeed,
      isBedtimeMode: bedtimeMode,
      voiceCharacter,
      onDone: () => {
        setIsSpeaking(false);
        if (autoPlayRef.current && pageIndex < allPages.length - 1) {
          // Don't auto-advance on choice pages
          const currentPageData = allPages[pageIndex];
          if (currentPageData?.choices && currentPageData.choices.length > 0) return;

          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: pageIndex + 1 });
          }, 800);
        } else if (autoPlayRef.current && pageIndex === allPages.length - 1 && bedtimeMode) {
          setShowSweetDreams(true);
        }
      },
    });
  }, [allPages, languageCode, ttsSpeed, bedtimeMode, voiceCharacter, useParentVoice, storyId, playParentRecording]);

  useEffect(() => {
    if (autoPlay) {
      speakCurrentPage(currentPage);
    }
  }, [currentPage, autoPlay]);

  const handlePlayPause = async () => {
    if (isSpeaking) {
      await stopTTS();
      if (soundRef.current) {
        await soundRef.current.stopAsync();
      }
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

  const handleChoice = (choice: StoryChoice) => {
    stopTTS();
    flatListRef.current?.scrollToIndex({ index: choice.nextPageIndex + 1 }); // +1 for cover
  };

  const handleRecordVoice = () => {
    stopTTS();
    router.push({
      pathname: '/story/record-voice',
      params: {
        title,
        pages: params.pages ?? '[]',
        storyId,
      },
    });
  };

  const handleSharePDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await shareStoryPDF({
        title,
        pages: pages.map((p, i) => ({
          text: p.text,
          imageUrl: imageUrls[i] || undefined,
        })),
        coverUrl: coverUrl || undefined,
      });
    } catch (err) {
      console.warn('[Viewer] PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const bgColors = bedtimeMode
    ? [BEDTIME_BG, '#16213e']
    : ['#FFF8F0', '#FFE8D6'];

  const currentPageData = allPages[currentPage];
  const hasChoices = currentPageData?.choices && currentPageData.choices.length > 0;

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
              <>
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

                {/* Choice Buttons */}
                {item.choices && item.choices.length > 0 && (
                  <View style={styles.choicesContainer}>
                    {item.choices.map((choice, ci) => (
                      <React.Fragment key={choice.id}>
                        {ci > 0 && (
                          <Text style={styles.choiceOr}>or</Text>
                        )}
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => handleChoice(choice)}
                        >
                          <LinearGradient
                            colors={
                              choice.id === 'purple' ? ['#A18CD1', '#FBC2EB'] :
                              choice.id === 'green' ? ['#52B788', '#95D5B2'] :
                              [COLORS.primary, '#FF8E53']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.choiceButton}
                          >
                            <Text style={styles.choiceEmoji}>{choice.emoji}</Text>
                            <Text style={styles.choiceText}>{choice.text}</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </React.Fragment>
                    ))}
                  </View>
                )}
              </>
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

  if (isLoadingSaved) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 48 }}>{'\u{1F4D6}'}</Text>
      </View>
    );
  }

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
        onScroll={handleScroll}
        scrollEventThrottle={100}
        keyExtractor={(_, i) => i.toString()}
      />

      {/* Top Navigation */}
      <View style={[styles.navBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.navButton, bedtimeMode && styles.navButtonBedtime]}
          onPress={() => { stopTTS(); router.replace('/(tabs)'); }}
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
          {/* Voice Character Display */}
          {voiceCharacter && (
            <>
              <View style={styles.controlRow}>
                <Text style={styles.controlEmoji}>{voiceCharacter.emoji}</Text>
                <Text style={[styles.controlLabel, bedtimeMode && styles.controlLabelBedtime]}>
                  {voiceCharacter.name}
                </Text>
              </View>
              <View style={styles.controlDivider} />
            </>
          )}

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

          <View style={styles.controlDivider} />

          {/* Parent Voice Toggle */}
          <TouchableOpacity
            style={[styles.controlRow, !hasParentRecording && styles.controlRowDisabled]}
            onPress={() => hasParentRecording && setUseParentVoice(!useParentVoice)}
            activeOpacity={hasParentRecording ? 0.8 : 1}
          >
            <Text style={styles.controlEmoji}>{'\u{1F3A4}'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.controlLabel, bedtimeMode && styles.controlLabelBedtime]}>
                Parent Voice
              </Text>
              {!hasParentRecording && (
                <Text style={styles.controlHint}>Record to enable</Text>
              )}
            </View>
            {hasParentRecording && (
              <View style={[styles.toggleTrack, useParentVoice && styles.toggleTrackActive]}>
                <View style={[styles.toggleThumb, useParentVoice && styles.toggleThumbActive]} />
              </View>
            )}
          </TouchableOpacity>

          {/* Record Voice Button */}
          <TouchableOpacity
            style={styles.controlRow}
            onPress={handleRecordVoice}
            activeOpacity={0.8}
          >
            <Text style={styles.controlEmoji}>{'\u{1F3A4}'}</Text>
            <Text style={[styles.controlLabel, bedtimeMode && styles.controlLabelBedtime]}>
              Record Voice
            </Text>
            <Text style={styles.controlArrow}>{'\u2192'}</Text>
          </TouchableOpacity>

          <View style={styles.controlDivider} />

          {/* Share PDF Button */}
          <TouchableOpacity
            style={[styles.controlRow, isExporting && styles.controlRowDisabled]}
            onPress={handleSharePDF}
            activeOpacity={0.8}
          >
            <Text style={styles.controlEmoji}>{isExporting ? '\u{23F3}' : '\u{1F4E4}'}</Text>
            <Text style={[styles.controlLabel, bedtimeMode && styles.controlLabelBedtime]}>
              {isExporting ? 'Exporting...' : 'Share as PDF'}
            </Text>
            <Text style={styles.controlArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 20 }]}>
        {currentPage > 0 ? (
          <TouchableOpacity
            style={[styles.arrowButton, bedtimeMode && styles.arrowButtonBedtime]}
            onPress={goToPrev}
            activeOpacity={0.8}
          >
            <Text style={styles.arrowText}>{'\u2190'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 52 }} />
        )}

        {/* Play/Pause Button — always visible */}
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
          hasChoices ? (
            <View style={{ width: 52 }} />
          ) : (
            <TouchableOpacity
              style={[styles.arrowButton, bedtimeMode && styles.arrowButtonBedtime]}
              onPress={goToNext}
              activeOpacity={0.8}
            >
              <Text style={styles.arrowText}>{'\u2192'}</Text>
            </TouchableOpacity>
          )
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
    borderRadius: 16,
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
    fontSize: 140,
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
  // Choices
  choicesContainer: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    minWidth: width * 0.65,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  choiceEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  choiceOr: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
    fontStyle: 'italic',
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
  controlRowDisabled: {
    opacity: 0.5,
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
  controlHint: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  controlArrow: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  controlDivider: {
    height: 1,
    backgroundColor: COLORS.backgroundDark,
    marginVertical: 2,
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
