import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  type ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../types';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  emoji: string;
  title: string;
  description: string;
  gradient: [string, string];
}

const SLIDES: OnboardingSlide[] = [
  {
    emoji: '📚',
    title: 'Welcome to StoryPal!',
    description: 'Create magical stories for your little ones with the power of AI',
    gradient: GRADIENTS.primary,
  },
  {
    emoji: '🎨',
    title: 'Pick a Theme & Character',
    description: 'Choose from enchanting themes like space, ocean, or fairy tales and adorable characters',
    gradient: GRADIENTS.accent,
  },
  {
    emoji: '✨',
    title: 'AI Creates Your Story',
    description: 'Our AI writes a unique story and generates beautiful illustrations just for you',
    gradient: ['#A18CD1', '#FBC2EB'],
  },
  {
    emoji: '📖',
    title: 'Read & Share',
    description: 'Enjoy your personalized storybook and share magical moments together',
    gradient: ['#FF6B6B', '#FFE66D'],
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const slideAnimation = useSharedValue(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
      slideAnimation.value = withSpring(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={styles.slide}>
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emojiContainer}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
      </LinearGradient>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(1);
    return { transform: [{ scale }] };
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, i) => i.toString()}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex ? styles.dotActive : undefined,
              ]}
            />
          ))}
        </View>

        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === SLIDES.length - 1 ? "Let's Go!" : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: height * 0.15,
  },
  emojiContainer: {
    width: 140,
    height: 140,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: 17,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.md,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 60,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: 4,
    opacity: 0.3,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
    opacity: 1,
  },
  nextButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    minWidth: 200,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  skipButton: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});
