import React, { useState, useCallback } from 'react';
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
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { useGameData } from '../../packages/shared/hooks/useGameData';
import { selection, notification } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';

type CardStatus = 'neutral' | 'correct' | 'wrong' | 'hinted';

export default function StorySortScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{
    pages?: string;
    title?: string;
    language?: string;
  }>();

  const storyPages: string[] = (() => {
    try {
      const parsed = JSON.parse(params.pages ?? '[]');
      return parsed.map((p: string | { text: string }) =>
        typeof p === 'string' ? p : p.text
      );
    } catch {
      return [];
    }
  })();

  const { storySort } = useGameData(storyPages, params.title ?? '', params.language ?? 'en');

  const [order, setOrder] = useState<number[]>(() =>
    storySort.sentences.map((_, i) => i)
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [cardStatuses, setCardStatuses] = useState<CardStatus[]>(() =>
    storySort.sentences.map(() => 'neutral')
  );
  const [isSolved, setIsSolved] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleCardPress = useCallback(
    (index: number) => {
      if (isSolved) return;

      selection();

      if (selectedIndex === null) {
        setSelectedIndex(index);
        setCardStatuses((prev) => prev.map((s, i) => (i === index ? 'hinted' : 'neutral')));
      } else if (selectedIndex === index) {
        setSelectedIndex(null);
        setCardStatuses((prev) => prev.map(() => 'neutral'));
      } else {
        const newOrder = [...order];
        [newOrder[selectedIndex], newOrder[index]] = [newOrder[index], newOrder[selectedIndex]];
        setOrder(newOrder);
        setSelectedIndex(null);
        setCardStatuses((prev) => prev.map(() => 'neutral'));
      }
    },
    [selectedIndex, order, isSolved]
  );

  const handleCheckOrder = useCallback(() => {
    const newStatuses: CardStatus[] = order.map((orderIndex) => {
      const sentence = storySort.sentences[orderIndex];
      const currentPosition = order.indexOf(orderIndex);
      return sentence.correctOrder === currentPosition ? 'correct' : 'wrong';
    });

    setCardStatuses(newStatuses);

    const allCorrect = newStatuses.every((s) => s === 'correct');
    if (allCorrect) {
      notification('success');
      setIsSolved(true);
    } else {
      notification('error');
      setTimeout(() => {
        setCardStatuses((prev) => prev.map(() => 'neutral'));
      }, 2000);
    }
  }, [order, storySort.sentences]);

  const handleHint = useCallback(() => {
    if (isSolved) return;

    // Find the first card that is in the wrong position
    for (let position = 0; position < order.length; position++) {
      const currentSentenceIndex = order[position];
      const sentence = storySort.sentences[currentSentenceIndex];
      if (sentence.correctOrder !== position) {
        // Find the card that should be at this position
        const correctSentenceIndex = order.findIndex(
          (idx) => storySort.sentences[idx].correctOrder === position
        );

        if (correctSentenceIndex !== -1) {
          const newStatuses = cardStatuses.map(() => 'neutral' as CardStatus);
          newStatuses[correctSentenceIndex] = 'hinted';
          setCardStatuses(newStatuses);
          setHintsUsed((h) => h + 1);

          setTimeout(() => {
            setCardStatuses((prev) => prev.map(() => 'neutral'));
          }, 2000);
        }
        break;
      }
    }
  }, [order, storySort.sentences, cardStatuses, isSolved]);

  const handlePlayAgain = () => {
    const shuffled = [...order].sort(() => Math.random() - 0.5);
    setOrder(shuffled);
    setSelectedIndex(null);
    setCardStatuses(storySort.sentences.map(() => 'neutral'));
    setIsSolved(false);
    setHintsUsed(0);
  };

  if (storySort.sentences.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>{'\uD83E\uDD14'}</Text>
          <Text style={styles.emptyText}>{t('noStoryEvents')}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
            <Text style={styles.actionButtonText}>{t('backToGames')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isSolved) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView contentContainerStyle={styles.celebrationContent}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>{'\uD83C\uDF89'}</Text>
            <Text style={styles.celebrationTitle}>{t('wellDone')}</Text>
            <Text style={styles.celebrationSubtitle}>
              {hintsUsed === 0
                ? t('perfectScore')
                : `${t('greatJob')} (${hintsUsed} ${t('hint').toLowerCase()}${hintsUsed > 1 ? 's' : ''} used)`}
            </Text>

            <View style={styles.sortedList}>
              {order.map((orderIndex, position) => (
                <View key={position} style={styles.solvedCard}>
                  <Text style={styles.solvedNumber}>{position + 1}</Text>
                  <Text style={styles.solvedText} numberOfLines={2}>
                    {storySort.sentences[orderIndex].text}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.celebrationButtons}>
              <TouchableOpacity activeOpacity={0.8} onPress={handlePlayAgain}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.celebrationButtonGradient}
                >
                  <Text style={styles.celebrationButtonText}>{t('playAgain')} {'\uD83D\uDD04'}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.celebrationBackButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={styles.celebrationBackText}>{t('backToGames')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.nav}>
        <TouchableOpacity
          style={styles.navBack}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.navBackText}>{'\u2190 ' + t('back')}</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>{t('storySortTitle')} {'\uD83D\uDCD6'}</Text>
          <Text style={styles.subtitle}>{t('storySortDesc')}</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {order.map((orderIndex, position) => {
            const sentence = storySort.sentences[orderIndex];
            const status = cardStatuses[position];
            const isSelected = selectedIndex === position;

            return (
              <Animated.View
                key={`${orderIndex}-${position}`}
                entering={FadeInUp.delay(position * 80).duration(400)}
              >
                <TouchableOpacity
                  style={[
                    styles.sortCard,
                    isSelected && styles.sortCardSelected,
                    status === 'correct' && styles.sortCardCorrect,
                    status === 'wrong' && styles.sortCardWrong,
                    status === 'hinted' && styles.sortCardHinted,
                  ]}
                  onPress={() => handleCardPress(position)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.sortNumber,
                      isSelected && styles.sortNumberSelected,
                      status === 'correct' && styles.sortNumberCorrect,
                      status === 'wrong' && styles.sortNumberWrong,
                      status === 'hinted' && styles.sortNumberHinted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortNumberText,
                        (isSelected || status !== 'neutral') && styles.sortNumberTextActive,
                      ]}
                    >
                      {position + 1}
                    </Text>
                  </View>
                  <Text style={styles.sortText} numberOfLines={3}>
                    {sentence.text}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.hintButton}
            onPress={handleHint}
            activeOpacity={0.8}
          >
            <Text style={styles.hintButtonText}>{'\uD83D\uDCA1'} {t('hint')}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} onPress={handleCheckOrder}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkButton}
            >
              <Text style={styles.checkButtonText}>{t('checkOrder')} {'\u2713'}</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  navBack: {
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.md,
  },
  navBackText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  cardsContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  sortCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
  },
  sortCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF0EE',
  },
  sortCardCorrect: {
    borderColor: COLORS.success,
    backgroundColor: '#E8F5E9',
  },
  sortCardWrong: {
    borderColor: COLORS.error,
    backgroundColor: '#FFEBEE',
  },
  sortCardHinted: {
    borderColor: COLORS.warning,
    backgroundColor: '#FFF8E1',
  },
  sortNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  sortNumberSelected: {
    backgroundColor: COLORS.primary,
  },
  sortNumberCorrect: {
    backgroundColor: COLORS.success,
  },
  sortNumberWrong: {
    backgroundColor: COLORS.error,
  },
  sortNumberHinted: {
    backgroundColor: COLORS.warning,
  },
  sortNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  sortNumberTextActive: {
    color: '#FFFFFF',
  },
  sortText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
    lineHeight: 21,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  hintButton: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.warning,
  },
  hintButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  checkButton: {
    flex: 1,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Celebration
  celebrationContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  celebrationCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  sortedList: {
    width: '100%',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  solvedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  solvedNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.success,
    marginRight: SPACING.sm,
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    overflow: 'hidden',
  },
  solvedText: {
    flex: 1,
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
  celebrationButtons: {
    width: '100%',
    gap: SPACING.sm,
  },
  celebrationButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  celebrationButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  celebrationBackButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    borderRadius: RADIUS.md,
  },
  celebrationBackText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
});
