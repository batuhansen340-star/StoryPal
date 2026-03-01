import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { VOICE_CHARACTERS } from '../../constants/voice-characters';
import { speak, stop as stopTTS, getSpeechLanguageCode } from '../../packages/shared/services/tts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md) / 2;

export default function SelectVoiceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { themeId, characterId, ageGroup, language, personalization, customPrompt } =
    useLocalSearchParams<{
      themeId: string;
      characterId: string;
      ageGroup: string;
      language: string;
      personalization: string;
      customPrompt: string;
    }>();

  const [selectedVoice, setSelectedVoice] = useState('narrator');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const previewVoice = async (voiceId: string) => {
    const voice = VOICE_CHARACTERS.find(v => v.id === voiceId);
    if (!voice) return;

    setSelectedVoice(voiceId);
    setIsPreviewPlaying(true);

    await stopTTS();
    await speak('Once upon a time, in a magical land far away...', {
      language: getSpeechLanguageCode(language ?? 'en'),
      speed: 'normal',
      isBedtimeMode: false,
      voiceCharacter: voice,
      onDone: () => setIsPreviewPlaying(false),
    });
  };

  const handleContinue = () => {
    stopTTS();
    router.push({
      pathname: '/story/generating',
      params: {
        themeId,
        characterId,
        ageGroup: ageGroup ?? '3-5',
        language: language ?? 'en',
        personalization: personalization ?? '',
        customPrompt: customPrompt ?? '',
        voiceCharacterId: selectedVoice,
      },
    });
  };

  const handleSkip = () => {
    stopTTS();
    router.push({
      pathname: '/story/generating',
      params: {
        themeId,
        characterId,
        ageGroup: ageGroup ?? '3-5',
        language: language ?? 'en',
        personalization: personalization ?? '',
        customPrompt: customPrompt ?? '',
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.nav}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => { stopTTS(); router.back(); }}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepDotCompleted]} />
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
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>Choose a Voice {'\u{1F3A4}'}</Text>
          <Text style={styles.subtitle}>
            Tap a card to preview the voice!
          </Text>
        </Animated.View>

        <View style={styles.grid}>
          {VOICE_CHARACTERS.map((voice, index) => {
            const isSelected = selectedVoice === voice.id;
            return (
              <Animated.View
                key={voice.id}
                entering={FadeInUp.duration(400).delay(index * 60)}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => previewVoice(voice.id)}
                >
                  <LinearGradient
                    colors={voice.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.voiceCard, isSelected && styles.voiceCardSelected]}
                  >
                    <Text style={styles.voiceEmoji}>{voice.emoji}</Text>
                    <Text style={styles.voiceName}>{voice.name}</Text>
                    <Text style={styles.voiceDesc}>{voice.description}</Text>
                    {voice.isPremium && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>{'\u{1F451}'}</Text>
                      </View>
                    )}
                    {isSelected && (
                      <View style={styles.selectedCheck}>
                        <Text style={styles.checkText}>{'\u2713'}</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.buttonSection}>
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
            <Text style={styles.skipText}>Skip voice selection</Text>
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
    marginBottom: SPACING.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  voiceCard: {
    width: CARD_WIDTH,
    height: 160,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    justifyContent: 'flex-end',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  voiceCardSelected: {
    borderColor: '#fff',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  voiceEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  voiceName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  voiceDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  premiumBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
  premiumText: {
    fontSize: 16,
  },
  selectedCheck: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.success,
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
});
