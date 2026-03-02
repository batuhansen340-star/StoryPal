import React from 'react';
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
import { CHARACTERS, THEMES } from '../../apps/storypal/constants/themes';
import { selection } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';

const { width } = Dimensions.get('window');

export default function SelectCharacterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const { themeId, ageGroup, language, customPrompt, childName, childAge } = useLocalSearchParams<{
    themeId: string;
    ageGroup: string;
    language: string;
    customPrompt: string;
    childName: string;
    childAge: string;
  }>();

  const selectedTheme = THEMES.find(t => t.id === themeId);

  const handleSelectCharacter = (characterId: string) => {
    selection();
    router.push({
      pathname: '/story/personalize',
      params: {
        themeId,
        characterId,
        ageGroup: ageGroup ?? '3-5',
        language: language ?? 'en',
        customPrompt: customPrompt ?? '',
        childName: childName ?? '',
        childAge: childAge ?? '',
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Nav */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.nav}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>{'← ' + t('back')}</Text>
        </TouchableOpacity>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepDotCompleted]} />
          <View style={[styles.stepDot, styles.stepDotCompleted]} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>{t('chooseCharacter')} 🌟</Text>
          <Text style={styles.subtitle}>{t('characterSubtitle')}</Text>

          {selectedTheme && (
            <View style={styles.selectedTheme}>
              <LinearGradient
                colors={selectedTheme.gradient}
                style={styles.selectedThemeBadge}
              >
                <Text style={styles.selectedThemeEmoji}>{selectedTheme.emoji}</Text>
                <Text style={styles.selectedThemeText}>{selectedTheme.name}</Text>
              </LinearGradient>
            </View>
          )}
        </Animated.View>

        <View style={styles.characterList}>
          {CHARACTERS.map((char, index) => (
            <Animated.View
              key={char.id}
              entering={FadeInUp.duration(400).delay(index * 60)}
            >
              <TouchableOpacity
                style={styles.characterCard}
                activeOpacity={0.85}
                onPress={() => handleSelectCharacter(char.id)}
                accessibilityLabel={char.name + ', ' + char.trait}
              >
                <View style={styles.characterEmojiContainer}>
                  <Text style={styles.characterEmoji}>{char.emoji}</Text>
                </View>
                <View style={styles.characterInfo}>
                  <Text style={styles.characterName}>{char.name}</Text>
                  <Text style={styles.characterTrait}>{char.trait}</Text>
                  <Text style={styles.characterDesc}>{char.description}</Text>
                </View>
                <Text style={styles.selectArrow}>→</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

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
    marginBottom: SPACING.md,
  },
  selectedTheme: {
    marginBottom: SPACING.lg,
  },
  selectedThemeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: SPACING.sm,
  },
  selectedThemeEmoji: {
    fontSize: 18,
  },
  selectedThemeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  characterList: {
    gap: SPACING.md,
  },
  characterCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  characterEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterEmoji: {
    fontSize: 32,
  },
  characterInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  characterName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  characterTrait: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 1,
  },
  characterDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  selectArrow: {
    fontSize: 20,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});
