import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../../packages/shared/types';

const { width } = Dimensions.get('window');

const IDEA_STARTERS = [
  { emoji: '\u{1F680}', text: 'A child who discovers a secret door in their school...' },
  { emoji: '\u{1F40B}', text: 'A talking whale who wants to learn to fly...' },
  { emoji: '\u{1F319}', text: 'The moon decides to visit Earth for one night...' },
  { emoji: '\u{1F382}', text: 'A birthday cake that comes to life...' },
  { emoji: '\u{1F308}', text: 'A rainbow bridge that leads to a land of candy...' },
  { emoji: '\u{1F984}', text: 'A unicorn who lost its sparkle...' },
];

export default function CustomIdeaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ageGroup, language, childName, childAge } = useLocalSearchParams<{
    ageGroup?: string;
    language?: string;
    childName?: string;
    childAge?: string;
  }>();

  const [idea, setIdea] = useState('');
  const minLength = 10;
  const maxLength = 200;
  const isValid = idea.trim().length >= minLength;

  const handleContinue = () => {
    router.push({
      pathname: '/story/select-character',
      params: {
        themeId: 'custom',
        customPrompt: idea.trim(),
        ageGroup: ageGroup ?? '3-5',
        language: language ?? 'en',
        childName: childName ?? '',
        childAge: childAge ?? '',
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.nav}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepDotCompleted]} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>Your Story Idea {'\u{1F4A1}'}</Text>
          <Text style={styles.subtitle}>
            Tell us what your story should be about!
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <TextInput
            style={styles.ideaInput}
            placeholder="Write your story idea here..."
            placeholderTextColor={COLORS.textMuted}
            value={idea}
            onChangeText={setIdea}
            maxLength={maxLength}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {idea.length}/{maxLength}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Text style={styles.sectionLabel}>Need inspiration?</Text>
          <View style={styles.starterGrid}>
            {IDEA_STARTERS.map((starter, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.duration(400).delay(300 + index * 60)}
              >
                <TouchableOpacity
                  style={styles.starterCard}
                  onPress={() => setIdea(starter.text)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.starterEmoji}>{starter.emoji}</Text>
                  <Text style={styles.starterText} numberOfLines={2}>
                    {starter.text}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(600)} style={styles.buttonSection}>
          <TouchableOpacity
            activeOpacity={isValid ? 0.85 : 0.5}
            onPress={isValid ? handleContinue : undefined}
          >
            <LinearGradient
              colors={isValid ? GRADIENTS.primary : ['#ccc', '#ddd']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButton}
            >
              <Text style={styles.continueText}>Continue {'\u2192'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.md,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
    opacity: 0.3,
  },
  stepDotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
    opacity: 1,
  },
  stepDotCompleted: {
    backgroundColor: COLORS.success,
    opacity: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  ideaInput: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    minHeight: 120,
    lineHeight: 24,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  charCount: {
    textAlign: 'right',
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: SPACING.xs,
    marginRight: SPACING.xs,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  starterGrid: {
    gap: SPACING.sm,
  },
  starterCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  starterEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  starterText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  buttonSection: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  continueButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
