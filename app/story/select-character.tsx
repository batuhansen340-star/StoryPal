import React, { useState, useMemo } from 'react';
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
import { getCharactersForLanguage } from '../../apps/storypal/constants/regional-characters';
import { CHARACTER_CATEGORIES } from '../../constants/modern-characters';
import type { ModernCharacter } from '../../constants/modern-characters';
import { selection } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';

const { width } = Dimensions.get('window');

export default function SelectCharacterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, language: appLanguage } = useLanguage();
  const { themeId, ageGroup, language, customPrompt, childName, childAge } = useLocalSearchParams<{
    themeId: string;
    ageGroup: string;
    language: string;
    customPrompt: string;
    childName: string;
    childAge: string;
  }>();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selectedTheme = THEMES.find(th => th.id === themeId);
  const classicCharacters = getCharactersForLanguage(CHARACTERS, appLanguage);

  const filteredCategories = useMemo(() => {
    const ag = ageGroup ?? '3-5';
    return CHARACTER_CATEGORIES.filter(
      cat => cat.ageGroup === 'all' || cat.ageGroup === ag,
    );
  }, [ageGroup]);

  const currentCategoryChars = useMemo(() => {
    if (!selectedCategory) {
      return filteredCategories.flatMap(cat => cat.characters);
    }
    const cat = filteredCategories.find(c => c.id === selectedCategory);
    return cat?.characters ?? [];
  }, [selectedCategory, filteredCategories]);

  const handleSelectModernCharacter = (char: ModernCharacter) => {
    selection();
    router.push({
      pathname: '/story/personalize',
      params: {
        themeId,
        characterId: char.id,
        ageGroup: ageGroup ?? '3-5',
        language: language ?? 'en',
        customPrompt: customPrompt ?? '',
        childName: childName ?? '',
        childAge: childAge ?? '',
        modernCharacter: 'true',
      },
    });
  };

  const handleSelectClassicCharacter = (characterId: string) => {
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
          <Text style={styles.title}>{t('chooseCharacter')} {'\u{1F31F}'}</Text>
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

        {/* Category Horizontal Scroll */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategory && styles.categoryChipActive,
              ]}
              onPress={() => { selection(); setSelectedCategory(null); }}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryChipEmoji}>{'\u2728'}</Text>
              <Text style={[
                styles.categoryChipText,
                !selectedCategory && styles.categoryChipTextActive,
              ]}>{t('allCategories')}</Text>
            </TouchableOpacity>
            {filteredCategories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => { selection(); setSelectedCategory(cat.id); }}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryChipEmoji}>{cat.emoji}</Text>
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id && styles.categoryChipTextActive,
                ]}>{t(cat.nameKey as any)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Modern Characters Grid */}
        <View style={styles.characterGrid}>
          {currentCategoryChars.map((char, index) => (
            <Animated.View
              key={char.id}
              entering={FadeInUp.duration(400).delay(index * 50)}
              style={styles.gridItem}
            >
              <TouchableOpacity
                style={styles.modernCard}
                activeOpacity={0.85}
                onPress={() => handleSelectModernCharacter(char)}
              >
                <View style={styles.modernEmojiContainer}>
                  <Text style={styles.modernEmoji}>{char.emoji}</Text>
                </View>
                <Text style={styles.modernName} numberOfLines={1}>
                  {t(char.nameKey as any)}
                </Text>
                <Text style={styles.modernDesc} numberOfLines={2}>
                  {t(char.descKey as any)}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Classic Characters Section */}
        <Animated.View entering={FadeInUp.duration(400).delay(200)}>
          <View style={styles.sectionDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.sectionTitle}>{t('classicCharacters')}</Text>
            <View style={styles.dividerLine} />
          </View>
        </Animated.View>

        <View style={styles.characterList}>
          {classicCharacters.map((char, index) => (
            <Animated.View
              key={char.id}
              entering={FadeInUp.duration(400).delay(index * 40)}
            >
              <TouchableOpacity
                style={styles.characterCard}
                activeOpacity={0.85}
                onPress={() => handleSelectClassicCharacter(char.id)}
                accessibilityLabel={char.name + ', ' + char.trait}
              >
                <View style={styles.characterEmojiContainer}>
                  <Text style={styles.characterEmoji}>{char.emoji}</Text>
                </View>
                <View style={styles.characterInfo}>
                  <View style={styles.characterNameRow}>
                    <Text style={styles.characterName}>{char.name}</Text>
                    {char.region && <View style={styles.regionalBadge}><Text style={styles.regionalBadgeText}>{'\u{1F30D}'}</Text></View>}
                  </View>
                  <Text style={styles.characterTrait}>{char.trait}</Text>
                  <Text style={styles.characterDesc}>{char.description}</Text>
                </View>
                <Text style={styles.selectArrow}>{'\u2192'}</Text>
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
    marginBottom: SPACING.md,
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
  // Category chips
  categoryScroll: {
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF0EE',
  },
  categoryChipEmoji: {
    fontSize: 18,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  categoryChipTextActive: {
    color: COLORS.primary,
  },
  // Modern character grid
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  gridItem: {
    width: (width - SPACING.lg * 2 - SPACING.sm) / 2,
  },
  modernCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  modernEmojiContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  modernEmoji: {
    fontSize: 36,
  },
  modernName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  modernDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 15,
  },
  // Section divider
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.textMuted,
    opacity: 0.2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  // Classic character list (unchanged)
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
  characterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  characterName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  regionalBadge: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  regionalBadgeText: {
    fontSize: 12,
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
