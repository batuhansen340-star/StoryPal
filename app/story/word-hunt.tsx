import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { useGameData } from '../../packages/shared/hooks/useGameData';
import { selection, notification } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';

const { width } = Dimensions.get('window');
const GRID_SIZE = 8;
const GRID_PADDING = SPACING.lg * 2;
const CELL_SIZE = Math.floor((width - GRID_PADDING - SPACING.sm * 2) / GRID_SIZE);

export default function WordHuntScreen() {
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
      console.warn('[WordHuntScreen] Failed to parse pages:', err);
      return [];
    }
  })();

  const { wordHunt } = useGameData(storyPages, params.title ?? '', params.language ?? 'en');

  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const cellKey = (r: number, c: number) => `${r}-${c}`;

  const checkForWord = useCallback(
    (cells: Set<string>) => {
      for (const wp of wordHunt.wordPositions) {
        if (foundWords.has(wp.word)) continue;

        const wordCells: string[] = [];
        for (let k = 0; k < wp.word.length; k++) {
          const r = wp.direction === 'vertical' ? wp.row + k : wp.row;
          const c = wp.direction === 'horizontal' ? wp.col + k : wp.col;
          wordCells.push(cellKey(r, c));
        }

        const allSelected = wordCells.every((ck) => cells.has(ck));
        if (allSelected) {
          notification('success');
          const newFound = new Set(foundWords);
          newFound.add(wp.word);
          setFoundWords(newFound);

          const newFoundCells = new Set(foundCells);
          wordCells.forEach((ck) => newFoundCells.add(ck));
          setFoundCells(newFoundCells);

          setSelectedCells(new Set());

          if (newFound.size === wordHunt.targetWords.length) {
            setTimeout(() => setShowCelebration(true), 500);
          }
          return;
        }
      }
    },
    [foundWords, foundCells, wordHunt]
  );

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      const key = cellKey(row, col);
      if (foundCells.has(key)) return;

      selection();
      const newSelected = new Set(selectedCells);
      if (newSelected.has(key)) {
        newSelected.delete(key);
      } else {
        newSelected.add(key);
      }
      setSelectedCells(newSelected);
      checkForWord(newSelected);
    },
    [selectedCells, foundCells, checkForWord]
  );

  const handleClearSelection = () => {
    setSelectedCells(new Set());
  };

  if (wordHunt.targetWords.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>{'\uD83E\uDD14'}</Text>
          <Text style={styles.emptyText}>{t('noWordsExtracted')}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
            <Text style={styles.actionButtonText}>{t('backToGames')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showCelebration) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.celebrationContainer}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>{'\uD83C\uDF89'}</Text>
            <Text style={styles.celebrationTitle}>{t('wellDone')}</Text>
            <Text style={styles.celebrationSubtitle}>
              {t('wordsFound')}: {wordHunt.targetWords.length}/{wordHunt.targetWords.length}
            </Text>

            <View style={styles.celebrationButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setFoundWords(new Set());
                  setFoundCells(new Set());
                  setSelectedCells(new Set());
                  setShowCelebration(false);
                }}
              >
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
        </View>
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
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {foundWords.size}/{wordHunt.targetWords.length}
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>{t('wordHuntTitle')} {'\uD83D\uDD0D'}</Text>
        </Animated.View>

        {/* Letter Grid */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.gridContainer}>
          {wordHunt.gridLetters.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {row.map((letter, colIndex) => {
                const key = cellKey(rowIndex, colIndex);
                const isSelected = selectedCells.has(key);
                const isFound = foundCells.has(key);

                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.gridCell,
                      isSelected && styles.gridCellSelected,
                      isFound && styles.gridCellFound,
                    ]}
                    onPress={() => handleCellPress(rowIndex, colIndex)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.gridLetter,
                        isSelected && styles.gridLetterSelected,
                        isFound && styles.gridLetterFound,
                      ]}
                    >
                      {letter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </Animated.View>

        {selectedCells.size > 0 && (
          <Animated.View entering={FadeIn.duration(200)}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSelection}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>{t('clearSelection')}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Word List */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.wordListContainer}>
          <Text style={styles.wordListTitle}>{t('wordsFound')}:</Text>
          <View style={styles.wordList}>
            {wordHunt.targetWords.map((word) => (
              <View
                key={word}
                style={[
                  styles.wordChip,
                  foundWords.has(word) && styles.wordChipFound,
                ]}
              >
                <Text
                  style={[
                    styles.wordChipText,
                    foundWords.has(word) && styles.wordChipTextFound,
                  ]}
                >
                  {foundWords.has(word) ? '\u2713 ' : ''}{word}
                </Text>
              </View>
            ))}
          </View>
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
  counterBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  gridContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    alignSelf: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    margin: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  gridCellSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  gridCellFound: {
    backgroundColor: '#C8E6C9',
  },
  gridLetter: {
    fontSize: CELL_SIZE * 0.45,
    fontWeight: '700',
    color: COLORS.text,
  },
  gridLetterSelected: {
    color: '#FFFFFF',
  },
  gridLetterFound: {
    color: '#2E7D32',
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  clearButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  wordListContainer: {
    marginTop: SPACING.lg,
  },
  wordListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  wordChip: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.switchTrack,
  },
  wordChipFound: {
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.success,
  },
  wordChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    flexShrink: 1,
  },
  wordChipTextFound: {
    color: '#2E7D32',
    textDecorationLine: 'line-through',
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
  celebrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
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
    fontSize: 18,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: SPACING.xl,
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
