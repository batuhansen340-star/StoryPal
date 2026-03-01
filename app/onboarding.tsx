import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { setOnboardingDone } from '../packages/shared/services/auth';
import { COLORS, SPACING, RADIUS } from '../packages/shared/types';

const { width, height } = Dimensions.get('window');

interface Slide {
  emoji: string;
  title: string;
  subtitle: string;
  gradient: [string, string];
}

const SLIDES: Slide[] = [
  {
    emoji: '\u{1F4D6}',
    title: 'Welcome to StoryPal',
    subtitle: 'Create magical bedtime stories your child will love. Every story is unique, personalized, and beautifully illustrated.',
    gradient: [COLORS.primary, '#FF8E53'],
  },
  {
    emoji: '\u{2728}',
    title: 'AI-Powered Stories',
    subtitle: 'Choose a theme, pick a character, and watch as AI writes a one-of-a-kind story just for your little one.',
    gradient: ['#A18CD1', '#FBC2EB'],
  },
  {
    emoji: '\u{1F3A8}',
    title: 'Beautiful Illustrations',
    subtitle: 'Every page comes alive with colorful illustrations. Read along with text-to-speech in 10 languages.',
    gradient: ['#4ECDC4', '#44CF6C'],
  },
  {
    emoji: '\u{1F680}',
    title: 'Ready to Begin?',
    subtitle: 'Create 2 free stories every day. Unlock unlimited stories, premium themes, and more with StoryPal Premium.',
    gradient: ['#667eea', '#764ba2'],
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await setOnboardingDone();
      router.replace('/auth');
    }
  };

  const handleSkip = async () => {
    await setOnboardingDone();
    router.replace('/auth');
  };

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => (
    <View style={styles.slide}>
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.slideGradient}
      >
        <View style={styles.slideContent}>
          <Animated.Text
            entering={FadeIn.duration(800)}
            style={styles.slideEmoji}
          >
            {item.emoji}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.duration(600).delay(200)}
            style={styles.slideTitle}
          >
            {item.title}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.duration(600).delay(400)}
            style={styles.slideSubtitle}
          >
            {item.subtitle}
          </Animated.Text>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
        {/* Skip */}
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* Next / Get Started */}
        <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.15)']}
            style={styles.nextButton}
          >
            <Text style={styles.nextText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Top safe area */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width,
    height,
  },
  slideGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  slideEmoji: {
    fontSize: 100,
    marginBottom: SPACING.xl,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  slideSubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.md,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  skipButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minWidth: 70,
  },
  skipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#fff',
  },
  nextButton: {
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
  },
});
