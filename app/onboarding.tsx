import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { setOnboardingDone } from '../packages/shared/services/auth';
import { createChildProfile } from '../packages/shared/services/child-profiles';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../packages/shared/types';
import { useLanguage } from '../constants/LanguageContext';

const { width, height } = Dimensions.get('window');

type AgeGroupOption = '3-5' | '5-7' | '7-10';

const STEP_COUNT = 4;

export default function OnboardingScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [childName, setChildName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroupOption | null>(null);

  const finishOnboarding = useCallback(async () => {
    if (childName.trim()) {
      const ageMap: Record<AgeGroupOption, number> = { '3-5': 4, '5-7': 6, '7-10': 8 };
      const age = ageGroup ? ageMap[ageGroup] : 4;
      await createChildProfile({ name: childName.trim(), age, avatarId: 'child' });
      await AsyncStorage.setItem('storypal_default_child_name', childName.trim());
    }
    if (ageGroup) {
      await AsyncStorage.setItem('storypal_default_age_group', ageGroup);
    }
    await setOnboardingDone();
    router.replace('/auth');
  }, [childName, ageGroup, router]);

  const handleNext = useCallback(async () => {
    if (currentIndex < STEP_COUNT - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await finishOnboarding();
    }
  }, [currentIndex, finishOnboarding]);

  const handleSkip = useCallback(async () => {
    await finishOnboarding();
  }, [finishOnboarding]);

  const handleNotifAllow = useCallback(async () => {
    try {
      await Notifications.requestPermissionsAsync();
    } catch {
      // Permission denied or unavailable — continue
    }
    await finishOnboarding();
  }, [finishOnboarding]);

  const canProceedFromStep1 = childName.trim().length > 0 && ageGroup !== null;

  const ageOptions: { key: AgeGroupOption; labelKey: string; emoji: string }[] = [
    { key: '3-5', labelKey: 'onboardingAgeGroup35', emoji: '🍼' },
    { key: '5-7', labelKey: 'onboardingAgeGroup57', emoji: '🎒' },
    { key: '7-10', labelKey: 'onboardingAgeGroup710', emoji: '📚' },
  ];

  const renderStep = ({ index }: { item: number; index: number }) => {
    if (index === 0) {
      return (
        <View style={styles.slide}>
          <LinearGradient
            colors={GRADIENTS.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.slideGradient}
          >
            <View style={styles.slideContent}>
              <Animated.Text entering={FadeIn.duration(800)} style={styles.slideEmoji}>
                📖
              </Animated.Text>
              <Animated.Text entering={FadeInUp.duration(600).delay(200)} style={styles.slideTitle}>
                {t('onboardingWelcome')}
              </Animated.Text>
              <Animated.Text entering={FadeInUp.duration(600).delay(400)} style={styles.slideSubtitle}>
                {t('onboardingWelcomeSubtitle')}
              </Animated.Text>
              <Animated.View entering={FadeInUp.duration(600).delay(600)}>
                <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.15)']}
                    style={styles.startButton}
                  >
                    <Text style={styles.startButtonText}>{t('onboardingStart')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </View>
      );
    }

    if (index === 1) {
      return (
        <View style={styles.slide}>
          <LinearGradient
            colors={GRADIENTS.purple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.slideGradient}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.slideContent}
            >
              <Text style={styles.formEmoji}>🧒</Text>
              <Text style={styles.formTitle}>{t('onboardingChildName')}</Text>
              <TextInput
                style={styles.nameInput}
                placeholder={t('onboardingChildNamePlaceholder')}
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={childName}
                onChangeText={setChildName}
                autoCapitalize="words"
                returnKeyType="done"
                maxLength={30}
              />

              <Text style={[styles.formTitle, { marginTop: SPACING.xl }]}>
                {t('onboardingAgeGroup')}
              </Text>
              <View style={styles.ageRow}>
                {ageOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.ageOption,
                      ageGroup === opt.key && styles.ageOptionSelected,
                    ]}
                    onPress={() => setAgeGroup(opt.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.ageEmoji}>{opt.emoji}</Text>
                    <Text style={[
                      styles.ageLabel,
                      ageGroup === opt.key && styles.ageLabelSelected,
                    ]}>
                      {t(opt.labelKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.85}
                disabled={!canProceedFromStep1}
                style={{ opacity: canProceedFromStep1 ? 1 : 0.5 }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.15)']}
                  style={styles.startButton}
                >
                  <Text style={styles.startButtonText}>{t('next')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </LinearGradient>
        </View>
      );
    }

    if (index === 2) {
      const displayName = childName.trim() || '✨';
      const giftTitle = t('onboardingGift').replace('{name}', displayName);

      return (
        <View style={styles.slide}>
          <LinearGradient
            colors={['#4ECDC4', '#44CF6C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.slideGradient}
          >
            <View style={styles.slideContent}>
              <Animated.Text entering={FadeIn.duration(800)} style={styles.slideEmoji}>
                🎁
              </Animated.Text>
              <Animated.Text entering={FadeInUp.duration(600).delay(200)} style={styles.slideTitle}>
                {giftTitle}
              </Animated.Text>
              <Animated.Text entering={FadeInUp.duration(600).delay(400)} style={styles.slideSubtitle}>
                {t('onboardingGiftSubtitle')}
              </Animated.Text>

              <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.featureList}>
                {[
                  { icon: '✨', key: 'onboardingGiftFeature1' },
                  { icon: '🎨', key: 'onboardingGiftFeature2' },
                  { icon: '🚀', key: 'onboardingGiftFeature3' },
                ].map((f, i) => (
                  <View key={i} style={styles.featureItem}>
                    <Text style={styles.featureItemIcon}>{f.icon}</Text>
                    <Text style={styles.featureItemText}>{t(f.key)}</Text>
                  </View>
                ))}
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(600).delay(700)}>
                <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.15)']}
                    style={styles.startButton}
                  >
                    <Text style={styles.startButtonText}>{t('next')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </View>
      );
    }

    // Step 3: Notification permission
    return (
      <View style={styles.slide}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.slideGradient}
        >
          <View style={styles.slideContent}>
            <Animated.Text entering={FadeIn.duration(800)} style={styles.slideEmoji}>
              🔔
            </Animated.Text>
            <Animated.Text entering={FadeInUp.duration(600).delay(200)} style={styles.slideTitle}>
              {t('onboardingNotifTitle')}
            </Animated.Text>
            <Animated.Text entering={FadeInUp.duration(600).delay(400)} style={styles.slideSubtitle}>
              {t('onboardingNotifSubtitle')}
            </Animated.Text>

            <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.notifButtons}>
              <TouchableOpacity onPress={handleNotifAllow} activeOpacity={0.85}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.15)']}
                  style={styles.startButton}
                >
                  <Text style={styles.startButtonText}>{t('onboardingNotifAllow')}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={finishOnboarding} activeOpacity={0.7} style={styles.skipNotifBtn}>
                <Text style={styles.skipNotifText}>{t('onboardingNotifSkip')}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={[0, 1, 2, 3]}
        renderItem={renderStep}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Controls overlay */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
        {/* Skip */}
        {currentIndex < STEP_COUNT - 1 && (
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipButton}>
            <Text style={styles.skipText}>{t('skip')}</Text>
          </TouchableOpacity>
        )}
        {currentIndex === STEP_COUNT - 1 && <View style={styles.skipButton} />}

        {/* Dots */}
        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.skipButton} />
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
    width: '100%',
  },
  slideEmoji: {
    fontSize: 100,
    marginBottom: SPACING.xl,
  },
  slideTitle: {
    fontSize: 30,
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
  startButton: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.xl + SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  // Step 1 — child info
  formEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  nameInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ageRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  ageOption: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 90,
  },
  ageOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: '#fff',
  },
  ageEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  ageLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '700',
  },
  ageLabelSelected: {
    color: '#fff',
  },
  // Step 2 — gift
  featureList: {
    marginTop: SPACING.lg,
    gap: SPACING.md,
    width: '100%',
    paddingHorizontal: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  featureItemIcon: {
    fontSize: 24,
  },
  featureItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  // Step 3 — notifications
  notifButtons: {
    marginTop: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.md,
  },
  skipNotifBtn: {
    padding: SPACING.sm,
  },
  skipNotifText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  // Controls
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
  },
});
