import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../../packages/shared/types';
import { EmojiText } from '../../packages/shared/components/EmojiText';
import { THEMES, CHARACTERS } from '../../apps/storypal/constants/themes';
import { impact, selection } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';
import { useSubscriptionContext } from '../../constants/SubscriptionContext';
import { useUsage } from '../../constants/UsageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const POPULAR_THEMES = THEMES.slice(0, 6);
const FEATURED_CHARACTERS = CHARACTERS.slice(0, 6);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const { isPremium } = useSubscriptionContext();
  const { dailyStoriesUsed, freeLimit } = useUsage();
  const [childName, setChildName] = useState<string | null>(null);
  const remaining = freeLimit - dailyStoriesUsed;

  useEffect(() => {
    AsyncStorage.getItem('storypal_default_child_name')
      .then((name) => { if (name) setChildName(name); })
      .catch(() => { /* storage read failed — safe to ignore */ });
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <View>
            <Text style={styles.greeting} accessibilityRole="header">
              {childName ? `${t('greeting').replace('!', '')} ${childName}!` : t('greeting')} 👋
            </Text>
            <Text style={styles.title}>{t('homeTitle')}</Text>
          </View>
        </Animated.View>

        {/* Usage Banner */}
        {!isPremium && (
          <Animated.View entering={FadeInDown.duration(600).delay(100)}>
            <LinearGradient
              colors={['#EBF5FB', '#FFFFFF']}
              style={styles.usageBanner}
            >
              <Text style={styles.usageBannerText}>
                {remaining > 0
                  ? `✨ ${remaining} ${t('storiesRemaining')}`
                  : t('noStoriesLeft')}
              </Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/paywall', params: { childName: childName ?? '' } })}
                activeOpacity={0.8}
                style={styles.usagePremiumBtn}
              >
                <Text style={styles.usagePremiumText}>{t('goPremium')}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Create Story CTA */}
        <Animated.View entering={FadeInDown.duration(600).delay(150)}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              impact('light');
              router.push('/(tabs)/create');
            }}
            accessibilityLabel="Create a new story"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaCard}
            >
              <View style={styles.ctaContent}>
                <EmojiText style={styles.ctaEmoji}>✨</EmojiText>
                <Text style={styles.ctaTitle}>{t('createNewStory')}</Text>
                <Text style={styles.ctaSubtitle}>{t('ctaSubtitle')}</Text>
              </View>
              <View style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>{t('start')} →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Popular Themes */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)}>
          <Text style={styles.sectionTitle}>{t('popularThemes')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {POPULAR_THEMES.map((theme, index) => (
              <Animated.View
                key={theme.id}
                entering={FadeInRight.duration(400).delay(index * 100)}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    selection();
                    router.push('/(tabs)/create');
                  }}
                  accessibilityLabel={`${theme.name} — ${theme.description}`}
                  accessibilityRole="button"
                >
                  <LinearGradient
                    colors={theme.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.themeCard}
                  >
                    <EmojiText style={styles.themeEmoji}>{theme.emoji}</EmojiText>
                    <Text style={styles.themeName}>{theme.name}</Text>
                    <Text style={styles.themeDesc}>{theme.description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Characters */}
        <Animated.View entering={FadeInDown.duration(600).delay(450)}>
          <Text style={styles.sectionTitle}>{t('meetCharacters')}</Text>
          <View style={styles.characterGrid}>
            {FEATURED_CHARACTERS.map((char, index) => (
              <Animated.View
                key={char.id}
                entering={FadeInDown.duration(400).delay(index * 80)}
              >
                <TouchableOpacity
                  style={styles.characterCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    selection();
                    router.push('/(tabs)/create');
                  }}
                  accessibilityLabel={`${char.name} — ${char.trait}`}
                  accessibilityRole="button"
                >
                  <View style={styles.characterEmojiContainer}>
                    <EmojiText style={styles.characterEmoji}>{char.emoji}</EmojiText>
                  </View>
                  <Text style={styles.characterName}>{char.name}</Text>
                  <Text style={styles.characterTrait}>{char.trait}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Stats Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)}>
          <View style={styles.statsCard}>
            <View style={styles.statsGlass}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{freeLimit}</Text>
                <Text style={styles.statLabel}>{t('freeStoriesToday')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{THEMES.length}</Text>
                <Text style={styles.statLabel}>{t('themesAvailable')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{CHARACTERS.length}</Text>
                <Text style={styles.statLabel}>{t('charactersToChoose')}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 40,
  },
  usageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  usageBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  usagePremiumBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  usagePremiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  ctaCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaContent: {
    marginBottom: SPACING.md,
  },
  ctaEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  horizontalScroll: {
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  themeCard: {
    width: 160,
    height: 180,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    justifyContent: 'flex-end',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  themeEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  themeDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  characterCard: {
    width: (width - SPACING.lg * 2 - SPACING.md * 2) / 3,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  characterEmojiContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  characterEmoji: {
    fontSize: 28,
  },
  characterName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  characterTrait: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statsCard: {
    marginBottom: SPACING.lg,
  },
  statsGlass: {
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    flexDirection: 'row',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.glassBorder,
  },
});
