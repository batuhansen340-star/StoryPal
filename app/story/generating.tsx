import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAI } from '../../packages/shared/hooks/useAI';
import { LoadingAI } from '../../packages/shared/components/LoadingAI';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import type { AgeGroup } from '../../packages/shared/types';
import { notification } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';
import { CHARACTERS } from '../../apps/storypal/constants/themes';
import { REGIONAL_CHARACTERS } from '../../apps/storypal/constants/regional-characters';
import { CHARACTER_CATEGORIES } from '../../constants/modern-characters';

export default function GeneratingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, storyLanguage } = useLanguage();
  const hasStarted = useRef(false);
  const { themeId, characterId, ageGroup, language, personalization, customPrompt, voiceCharacterId, childName, childAge } =
    useLocalSearchParams<{
      themeId: string;
      characterId: string;
      ageGroup: string;
      language: string;
      personalization: string;
      customPrompt: string;
      voiceCharacterId: string;
      childName: string;
      childAge: string;
    }>();

  const {
    status,
    progress,
    totalSteps,
    currentStep,
    story,
    imageUrls,
    coverUrl,
    error,
    generateFullStory,
    reset,
  } = useAI();

  useEffect(() => {
    if (themeId && characterId && !hasStarted.current) {
      hasStarted.current = true;

      let parsedPersonalization;
      try {
        if (personalization) parsedPersonalization = JSON.parse(personalization);
      } catch {
        // ignore parse errors
      }

      // Check modern characters first
      const modernChar = CHARACTER_CATEGORIES
        .flatMap(cat => cat.characters)
        .find(c => c.id === characterId);

      if (modernChar) {
        generateFullStory({
          theme: themeId,
          character: modernChar.name,
          ageGroup: (ageGroup as AgeGroup) ?? '3-5',
          language: language ?? storyLanguage,
          personalization: parsedPersonalization,
          customPrompt: customPrompt || undefined,
          childName: childName || undefined,
          childAge: childAge ? parseInt(childAge, 10) : undefined,
          characterDescription: modernChar.storyHook,
          characterVisualDesc: parsedPersonalization?.faceDescription
            ?? modernChar.visualDesc,
        });
      } else {
        const allChars = [...CHARACTERS, ...REGIONAL_CHARACTERS];
        const charInfo = allChars.find(c => c.id === characterId);

        generateFullStory({
          theme: themeId,
          character: charInfo?.name ?? characterId,
          ageGroup: (ageGroup as AgeGroup) ?? '3-5',
          language: language ?? storyLanguage,
          personalization: parsedPersonalization,
          customPrompt: customPrompt || undefined,
          childName: childName || undefined,
          childAge: childAge ? parseInt(childAge, 10) : undefined,
          characterDescription: charInfo?.description,
          characterVisualDesc: parsedPersonalization?.faceDescription
            ?? charInfo?.description,
        });
      }
    }
  }, [themeId, characterId, ageGroup]);

  useEffect(() => {
    if (status === 'complete' && story) {
      notification('success');
      const timer = setTimeout(() => {
        router.replace({
          pathname: '/story/viewer',
          params: {
            title: story.title,
            pages: JSON.stringify(story.pages),
            imageUrls: JSON.stringify(imageUrls),
            coverUrl: coverUrl ?? '',
            themeId: themeId ?? '',
            characterId: characterId ?? '',
            language: language ?? 'en',
            voiceCharacterId: voiceCharacterId ?? '',
          },
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (error) {
      notification('error');
    }
  }, [error]);

  if (error) {
    return (
      <View style={[styles.errorContainer, { paddingTop: insets.top }]}>
        <Text style={styles.errorEmoji}>{'\u{1F614}'}</Text>
        <Text style={styles.errorTitle}>{t('oops')}</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            reset();
            hasStarted.current = false;
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>{t('tryAgain')} {'\u{2728}'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.goBackText}>{t('goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LoadingAI
      progress={progress}
      totalSteps={totalSteps}
      currentStep={currentStep}
      status={status}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorEmoji: {
    fontSize: 72,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  goBackButton: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
  },
  goBackText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});
