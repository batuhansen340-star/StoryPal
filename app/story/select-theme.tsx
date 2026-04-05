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
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../../packages/shared/types';
import { EmojiText } from '../../packages/shared/components/EmojiText';
import { THEMES } from '../../apps/storypal/constants/themes';
import { selection } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md) / 2;

export default function SelectThemeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const { ageGroup, language, childName, childAge } = useLocalSearchParams<{ ageGroup?: string; language?: string; childName?: string; childAge?: string }>();

  const handleSelectTheme = (themeId: string) => {
    selection();
    router.push({
      pathname: '/story/select-character',
      params: { themeId, ageGroup: ageGroup ?? '3-5', language: language ?? 'en', childName: childName ?? '', childAge: childAge ?? '' },
    });
  };

  const handleCustomIdea = () => {
    router.push({
      pathname: '/story/custom-idea',
      params: { ageGroup: ageGroup ?? '3-5', language: language ?? 'en', childName: childName ?? '', childAge: childAge ?? '' },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back Button */}
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
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>{t('pickTheme')} <EmojiText>🎨</EmojiText></Text>
          <Text style={styles.subtitle}>
            {t('themeSubtitle')}
          </Text>
        </Animated.View>

        {/* Your Idea Card */}
        <Animated.View entering={FadeInUp.duration(400)}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleCustomIdea}>
            <LinearGradient
              colors={GRADIENTS.purple}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.customIdeaCard}
            >
              <EmojiText style={styles.customIdeaEmoji}>{'\u{1FA84}'}</EmojiText>
              <View style={styles.customIdeaContent}>
                <Text style={styles.customIdeaTitle}>{t('yourIdea')}</Text>
                <Text style={styles.customIdeaDesc}>{t('writeOwnIdea')}</Text>
              </View>
              <Text style={styles.customIdeaArrow}>{'\u2192'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.grid}>
          {THEMES.map((theme, index) => (
            <Animated.View
              key={theme.id}
              entering={FadeInUp.duration(400).delay(index * 80)}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSelectTheme(theme.id)}
                accessibilityLabel={theme.name + ' theme'}
              >
                <LinearGradient
                  colors={theme.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.themeCard}
                >
                  <EmojiText style={styles.themeEmoji}>{theme.emoji}</EmojiText>
                  <Text style={styles.themeName}>{theme.nameKey ? t(theme.nameKey as any) : theme.name}</Text>
                  <Text style={styles.themeDesc}>{theme.descKey ? t(theme.descKey as any) : theme.description}</Text>
                </LinearGradient>
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
    marginBottom: SPACING.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  themeCard: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    justifyContent: 'flex-end',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  themeEmoji: {
    fontSize: 44,
    marginBottom: SPACING.sm,
  },
  themeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  themeDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  customIdeaCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: '#A18CD1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  customIdeaEmoji: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  customIdeaContent: {
    flex: 1,
  },
  customIdeaTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  customIdeaDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  customIdeaArrow: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
});
