import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../../packages/shared/types';
import { selection } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';

interface GameCard {
  id: string;
  emoji: string;
  titleKey: 'quizTitle' | 'wordHuntTitle' | 'storySortTitle';
  descKey: 'quizDesc' | 'wordHuntDesc' | 'storySortDesc';
  gradient: [string, string];
  route: '/story/quiz' | '/story/word-hunt' | '/story/story-sort';
}

const GAME_CARDS: GameCard[] = [
  {
    id: 'quiz',
    emoji: '\uD83D\uDCDD',
    titleKey: 'quizTitle',
    descKey: 'quizDesc',
    gradient: [COLORS.primary, COLORS.secondary],
    route: '/story/quiz',
  },
  {
    id: 'word-hunt',
    emoji: '\uD83D\uDD0D',
    titleKey: 'wordHuntTitle',
    descKey: 'wordHuntDesc',
    gradient: [COLORS.accent, '#44B09E'],
    route: '/story/word-hunt',
  },
  {
    id: 'story-sort',
    emoji: '\uD83D\uDCD6',
    titleKey: 'storySortTitle',
    descKey: 'storySortDesc',
    gradient: ['#A18CD1', '#FBC2EB'],
    route: '/story/story-sort',
  },
];

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{
    pages?: string;
    title?: string;
    language?: string;
  }>();

  const handleSelectGame = (game: GameCard) => {
    selection();
    router.push({
      pathname: game.route,
      params: {
        pages: params.pages ?? '[]',
        title: params.title ?? '',
        language: params.language ?? 'en',
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
          <Text style={styles.backText}>{'\u2190 ' + t('back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.dismiss()}
          activeOpacity={0.7}
        >
          <Text style={styles.closeText}>{t('close')}</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>{t('storyGames')} {'\uD83C\uDFAE'}</Text>
          <Text style={styles.subtitle}>{t('testWhatYouLearned')} {'\uD83E\uDDE0'}</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {GAME_CARDS.map((game, index) => (
            <Animated.View
              key={game.id}
              entering={FadeInUp.delay(index * 150).duration(500)}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSelectGame(game)}
              >
                <LinearGradient
                  colors={game.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gameCard}
                >
                  <Text style={styles.gameEmoji}>{game.emoji}</Text>
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameTitle}>{t(game.titleKey)}</Text>
                    <Text style={styles.gameDesc}>{t(game.descKey)}</Text>
                  </View>
                  <Text style={styles.gameArrow}>{'\u203A'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.md,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: SPACING.sm,
    paddingLeft: SPACING.md,
  },
  closeText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  cardsContainer: {
    gap: SPACING.md,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  gameEmoji: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  gameDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  gameArrow: {
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
    marginLeft: SPACING.sm,
  },
});
