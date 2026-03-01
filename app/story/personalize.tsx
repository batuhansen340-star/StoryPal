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
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';

const { width } = Dimensions.get('window');

const HAIR_COLORS = [
  { id: 'blonde', label: 'Blonde', color: '#F5D76E' },
  { id: 'brown', label: 'Brown', color: '#8B6914' },
  { id: 'black', label: 'Black', color: '#2D2D2D' },
  { id: 'red', label: 'Red', color: '#D4380D' },
  { id: 'pink', label: 'Pink', color: '#FF69B4' },
  { id: 'blue', label: 'Blue', color: '#4A90D9' },
];

const SKIN_TONES = [
  { id: 'light', label: 'Light', color: '#FDDBB4' },
  { id: 'medium', label: 'Medium', color: '#D4A574' },
  { id: 'dark', label: 'Dark', color: '#8D5524' },
];

const GENDERS = [
  { id: 'girl', emoji: '\u{1F467}' },
  { id: 'boy', emoji: '\u{1F466}' },
  { id: 'skip', emoji: '\u{2728}' },
];

export default function PersonalizeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { themeId, characterId, ageGroup, language } = useLocalSearchParams<{
    themeId: string;
    characterId: string;
    ageGroup: string;
    language: string;
  }>();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<string>('skip');
  const [hairColor, setHairColor] = useState<string>('brown');
  const [skinTone, setSkinTone] = useState<string>('medium');
  const [hasGlasses, setHasGlasses] = useState(false);

  // Demo mode: no premium gate, always allow
  const isPremium = true;

  const handleContinue = () => {
    const personalization = JSON.stringify({
      name: name.trim() || undefined,
      gender: gender !== 'skip' ? gender : undefined,
      hairColor,
      skinTone,
      hasGlasses,
    });

    router.push({
      pathname: '/story/generating',
      params: {
        themeId,
        characterId,
        ageGroup: ageGroup ?? '3-5',
        language: language ?? 'en',
        personalization,
      },
    });
  };

  const handleSkip = () => {
    router.push({
      pathname: '/story/generating',
      params: {
        themeId,
        characterId,
        ageGroup: ageGroup ?? '3-5',
        language: language ?? 'en',
      },
    });
  };

  if (!isPremium) {
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
        </Animated.View>

        <View style={styles.lockedContainer}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.lockedContent}>
            <Text style={styles.lockedEmoji}>{'\u{1F512}'}</Text>
            <Text style={styles.lockedTitle}>Premium Feature</Text>
            <Text style={styles.lockedText}>
              Unlock personalization {'\u2014'} make YOUR child the hero!
            </Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.unlockButton}>
              <LinearGradient
                colors={[COLORS.primary, '#FF8E53']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.unlockGradient}
              >
                <Text style={styles.unlockText}>{'\u{1F451}'} Unlock Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

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
          <View style={[styles.stepDot, styles.stepDotCompleted]} />
          <View style={[styles.stepDot, styles.stepDotCompleted]} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>Make It Personal {'\u{2728}'}</Text>
          <Text style={styles.subtitle}>Put your child in the story!</Text>
        </Animated.View>

        {/* Avatar Preview */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarBody, { backgroundColor: SKIN_TONES.find(s => s.id === skinTone)?.color ?? '#D4A574' }]}>
              <View style={[styles.avatarHair, { backgroundColor: HAIR_COLORS.find(h => h.id === hairColor)?.color ?? '#8B6914' }]} />
              <View style={styles.avatarFace}>
                <View style={styles.avatarEyes}>
                  <View style={styles.avatarEye} />
                  <View style={styles.avatarEye} />
                </View>
                {hasGlasses && (
                  <View style={styles.avatarGlasses}>
                    <View style={styles.avatarGlassLens} />
                    <View style={styles.avatarGlassBridge} />
                    <View style={styles.avatarGlassLens} />
                  </View>
                )}
                <View style={styles.avatarMouth} />
              </View>
            </View>
            {name.trim() !== '' && (
              <Text style={styles.avatarName}>{name}</Text>
            )}
          </View>
        </Animated.View>

        {/* Name Input */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Text style={styles.sectionLabel}>Child's Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter name..."
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            maxLength={20}
            autoCapitalize="words"
          />
        </Animated.View>

        {/* Gender */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <Text style={styles.sectionLabel}>Gender</Text>
          <View style={styles.optionRow}>
            {GENDERS.map(g => (
              <TouchableOpacity
                key={g.id}
                style={[styles.genderCard, gender === g.id && styles.optionSelected]}
                onPress={() => setGender(g.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.genderEmoji}>{g.emoji}</Text>
                <Text style={[styles.genderLabel, gender === g.id && styles.optionLabelSelected]}>
                  {g.id === 'girl' ? 'Girl' : g.id === 'boy' ? 'Boy' : 'Skip'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Hair Color */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <Text style={styles.sectionLabel}>Hair Color</Text>
          <View style={styles.colorRow}>
            {HAIR_COLORS.map(h => (
              <TouchableOpacity
                key={h.id}
                style={[
                  styles.colorCircle,
                  { backgroundColor: h.color },
                  hairColor === h.id && styles.colorCircleSelected,
                ]}
                onPress={() => setHairColor(h.id)}
                activeOpacity={0.8}
              />
            ))}
          </View>
        </Animated.View>

        {/* Skin Tone */}
        <Animated.View entering={FadeInDown.duration(500).delay(500)}>
          <Text style={styles.sectionLabel}>Skin Tone</Text>
          <View style={styles.colorRow}>
            {SKIN_TONES.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.skinCircle,
                  { backgroundColor: s.color },
                  skinTone === s.id && styles.colorCircleSelected,
                ]}
                onPress={() => setSkinTone(s.id)}
                activeOpacity={0.8}
              />
            ))}
          </View>
        </Animated.View>

        {/* Glasses */}
        <Animated.View entering={FadeInDown.duration(500).delay(600)}>
          <Text style={styles.sectionLabel}>Glasses</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.glassesCard, !hasGlasses && styles.optionSelected]}
              onPress={() => setHasGlasses(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.glassesEmoji}>{'\u{1F60A}'}</Text>
              <Text style={[styles.genderLabel, !hasGlasses && styles.optionLabelSelected]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.glassesCard, hasGlasses && styles.optionSelected]}
              onPress={() => setHasGlasses(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.glassesEmoji}>{'\u{1F913}'}</Text>
              <Text style={[styles.genderLabel, hasGlasses && styles.optionLabelSelected]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Continue Button */}
        <Animated.View entering={FadeInDown.duration(500).delay(700)} style={styles.buttonSection}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleContinue}>
            <LinearGradient
              colors={[COLORS.primary, '#FF8E53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButton}
            >
              <Text style={styles.continueText}>Continue {'\u2192'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip personalization</Text>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarBody: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarHair: {
    position: 'absolute',
    top: -4,
    left: 10,
    right: 10,
    height: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  avatarFace: {
    marginTop: 10,
    alignItems: 'center',
  },
  avatarEyes: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 6,
  },
  avatarEye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D2D2D',
  },
  avatarGlasses: {
    position: 'absolute',
    top: -4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGlassLens: {
    width: 18,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#4A4A4A',
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
  },
  avatarGlassBridge: {
    width: 6,
    height: 2,
    backgroundColor: '#4A4A4A',
  },
  avatarMouth: {
    width: 14,
    height: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: '#FF6B6B',
  },
  avatarName: {
    marginTop: SPACING.sm,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  nameInput: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  genderCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
  },
  genderEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  optionLabelSelected: {
    color: COLORS.primary,
  },
  colorRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  skinCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  colorCircleSelected: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  glassesCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  glassesEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  buttonSection: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
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
  skipButton: {
    padding: SPACING.sm,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  // Locked state styles
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  lockedContent: {
    alignItems: 'center',
  },
  lockedEmoji: {
    fontSize: 72,
    marginBottom: SPACING.md,
  },
  lockedTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  lockedText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  unlockButton: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  unlockGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  unlockText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
