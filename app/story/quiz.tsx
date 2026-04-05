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

export default function QuizScreen() {
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
      const pagesParsed = JSON.parse(params.pages ?? '[]');
      if (!Array.isArray(pagesParsed)) return [];
      return pagesParsed.map((p: string | { text: string }) =>
        typeof p === 'string' ? p : p.text
      );
    } catch (err) {
      console.warn('[QuizScreen] Failed to parse pages:', err);
      return [];
    }
  })();

  const { quiz } = useGameData(storyPages, params.title ?? '', params.language ?? 'en', t as (key: string) => string);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedAnswer !== null) return;

      selection();
      setSelectedAnswer(index);
      const correct = index === quiz[currentQuestion].correctIndex;
      setIsCorrect(correct);

      if (correct) {
        notification('success');
        setCorrectCount((c) => c + 1);
      } else {
        notification('error');
      }

      setTimeout(() => {
        if (currentQuestion < quiz.length - 1) {
          setCurrentQuestion((c) => c + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        } else {
          setShowResults(true);
        }
      }, 1500);
    },
    [selectedAnswer, currentQuestion, quiz]
  );

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCorrectCount(0);
    setShowResults(false);
  };

  const handleBackToGames = () => {
    router.back();
  };

  if (quiz.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>{'\uD83E\uDD14'}</Text>
          <Text style={styles.emptyText}>{t('noQuizQuestions')}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
            <Text style={styles.actionButtonText}>{t('backToGames')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showResults) {
    const isPerfect = correctCount === quiz.length;
    const stars = Array.from({ length: quiz.length }, (_, i) =>
      i < correctCount ? '\u2B50' : '\u2606'
    ).join(' ');

    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView contentContainerStyle={styles.resultsContent}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.resultsCard}>
            <Text style={styles.resultsEmoji}>
              {isPerfect ? '\uD83C\uDF89' : '\uD83C\uDF1F'}
            </Text>
            <Text style={styles.resultsTitle}>
              {isPerfect ? t('perfectScore') : t('greatJob')}
            </Text>
            <Text style={styles.starsRow}>{stars}</Text>
            <Text style={styles.scoreText}>
              {t('score')}: {correctCount}/{quiz.length}
            </Text>

            <View style={styles.resultButtons}>
              <TouchableOpacity
                style={[styles.resultButton, styles.playAgainButton]}
                onPress={handlePlayAgain}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.resultButtonGradient}
                >
                  <Text style={styles.resultButtonText}>{t('playAgain')} {'\uD83D\uDD04'}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.resultButton, styles.backButton]}
                onPress={handleBackToGames}
                activeOpacity={0.8}
              >
                <Text style={styles.backButtonText}>{t('backToGames')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  const question = quiz[currentQuestion];

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
        <View style={styles.progressContainer}>
          {quiz.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i === currentQuestion && styles.progressDotActive,
                i < currentQuestion && styles.progressDotDone,
              ]}
            />
          ))}
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          key={currentQuestion}
          entering={FadeInUp.duration(500)}
        >
          <View style={styles.questionCard}>
            <Text style={styles.questionNumber}>
              {currentQuestion + 1}/{quiz.length}
            </Text>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>

          <View style={styles.answersContainer}>
            {question.options.map((option, index) => {
              let buttonStyle: object = styles.answerButton;
              let textStyle: object = styles.answerText;

              if (selectedAnswer !== null) {
                if (index === question.correctIndex) {
                  buttonStyle = { ...styles.answerButton, ...styles.correctAnswer };
                  textStyle = { ...styles.answerText, ...styles.correctAnswerText };
                } else if (index === selectedAnswer && !isCorrect) {
                  buttonStyle = { ...styles.answerButton, ...styles.wrongAnswer };
                  textStyle = { ...styles.answerText, ...styles.wrongAnswerText };
                }
              }

              return (
                <Animated.View
                  key={index}
                  entering={FadeInUp.delay(index * 100).duration(400)}
                >
                  <TouchableOpacity
                    style={[buttonStyle, selectedAnswer !== null && styles.answerDisabled]}
                    onPress={() => handleAnswer(index)}
                    activeOpacity={0.8}
                    disabled={selectedAnswer !== null}
                  >
                    <Text style={styles.answerLabel}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                    <Text style={textStyle} numberOfLines={3}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {selectedAnswer !== null && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>
                {isCorrect
                  ? t('correct') + ' \uD83C\uDF89'
                  : t('tryAgain') + ' \uD83D\uDE4F'}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
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
  progressContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.switchTrack,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.3 }],
  },
  progressDotDone: {
    backgroundColor: COLORS.success,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  questionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  questionNumber: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 28,
  },
  answersContainer: {
    gap: SPACING.sm,
  },
  answerButton: {
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
  answerDisabled: {
    opacity: 0.9,
  },
  correctAnswer: {
    borderColor: COLORS.success,
    backgroundColor: '#E8F5E9',
  },
  wrongAnswer: {
    borderColor: COLORS.error,
    backgroundColor: '#FFEBEE',
  },
  answerLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundDark,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    lineHeight: 22,
    flexShrink: 1,
  },
  correctAnswerText: {
    color: '#2E7D32',
  },
  wrongAnswerText: {
    color: COLORS.error,
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  // Results
  resultsContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  resultsCard: {
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
  resultsEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  starsRow: {
    fontSize: 32,
    marginBottom: SPACING.md,
    letterSpacing: 4,
  },
  scoreText: {
    fontSize: 20,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: SPACING.xl,
  },
  resultButtons: {
    width: '100%',
    gap: SPACING.sm,
  },
  resultButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  playAgainButton: {},
  resultButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  resultButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    borderRadius: RADIUS.md,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
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
});
