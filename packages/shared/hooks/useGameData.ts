import { useMemo } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface WordHuntData {
  targetWords: string[];
  gridLetters: string[][];
  wordPositions: { word: string; row: number; col: number; direction: 'horizontal' | 'vertical' }[];
}

interface StorySortData {
  sentences: { text: string; correctOrder: number }[];
}

export interface GameData {
  quiz: QuizQuestion[];
  wordHunt: WordHuntData;
  storySort: StorySortData;
}

const COMMON_WORDS = new Set([
  'the', 'a', 'an', 'is', 'was', 'were', 'are', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
  'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'because', 'but', 'and', 'or', 'if', 'while', 'that', 'this',
  'these', 'those', 'it', 'its', 'he', 'she', 'they', 'them', 'his',
  'her', 'their', 'my', 'your', 'our', 'me', 'him', 'us', 'who', 'what',
  'which', 'whom', 'whose', 'i', 'you', 'we', 'up', 'said', 'one', 'two',
  'also', 'about', 'like', 'many', 'much', 'even', 'well', 'back', 'long',
  'made', 'come', 'came', 'went', 'got', 'get', 'let', 'put', 'take',
  'took', 'make', 'know', 'see', 'saw', 'look', 'looked', 'time', 'way',
  'thing', 'think', 'tell', 'told', 'down', 'now', 'still', 'find',
]);

function extractWords(text: string): string[] {
  return text
    .replace(/[^a-zA-Z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w.toLowerCase());
}

function extractSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

function extractInterestingWords(pages: string[], count: number): string[] {
  const allWords = pages.flatMap(extractWords);
  const wordFreq = new Map<string, number>();

  for (const word of allWords) {
    if (word.length >= 4 && !COMMON_WORDS.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) ?? 0) + 1);
    }
  }

  return [...wordFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count * 2)
    .map(([word]) => word)
    .filter((word) => word.length <= 8)
    .slice(0, count);
}

function generateQuiz(pages: string[], title: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const allWords = pages.flatMap(extractWords);
  const interestingWords = extractInterestingWords(pages, 20);

  // Question about the title
  if (title) {
    const wrongTitles = [
      'The Big Adventure',
      'A Sunny Day',
      'The Magic Garden',
      'Under the Stars',
    ].filter((t) => t.toLowerCase() !== title.toLowerCase());
    const options = shuffleArray([title, ...wrongTitles.slice(0, 3)]);
    questions.push({
      question: 'What is the title of this story?',
      options,
      correctIndex: options.indexOf(title),
    });
  }

  // Questions about content from each page
  for (let i = 0; i < Math.min(pages.length, 4); i++) {
    const pageText = pages[i];
    const pageSentences = extractSentences(pageText);
    if (pageSentences.length === 0) continue;

    const pageWords = extractWords(pageText).filter(
      (w) => w.length >= 4 && !COMMON_WORDS.has(w)
    );
    if (pageWords.length === 0) continue;

    const targetWord = pageWords[0];
    const wrongOptions = interestingWords
      .filter((w) => w !== targetWord)
      .slice(0, 5);

    if (wrongOptions.length < 3) continue;

    const selectedWrong = shuffleArray(wrongOptions).slice(0, 3);
    const options = shuffleArray([targetWord, ...selectedWrong]);

    questions.push({
      question: `Which word appears in the story on page ${i + 1}?`,
      options,
      correctIndex: options.indexOf(targetWord),
    });
  }

  // Question about first page events
  if (pages.length > 0) {
    const firstSentences = extractSentences(pages[0]);
    if (firstSentences.length > 0) {
      const correctSentence = firstSentences[0].slice(0, 60) + (firstSentences[0].length > 60 ? '...' : '');
      const wrongSentences: string[] = [];
      for (let i = 1; i < pages.length && wrongSentences.length < 3; i++) {
        const sents = extractSentences(pages[i]);
        if (sents.length > 0) {
          const s = sents[0].slice(0, 60) + (sents[0].length > 60 ? '...' : '');
          wrongSentences.push(s);
        }
      }

      if (wrongSentences.length >= 2) {
        while (wrongSentences.length < 3) {
          wrongSentences.push('Something completely different happened');
        }
        const options = shuffleArray([correctSentence, ...wrongSentences]);
        questions.push({
          question: 'What happened at the beginning of the story?',
          options,
          correctIndex: options.indexOf(correctSentence),
        });
      }
    }
  }

  return questions.slice(0, 5);
}

function generateWordHunt(pages: string[]): WordHuntData {
  const GRID_SIZE = 8;
  const targetWords = extractInterestingWords(pages, 8)
    .filter((w) => w.length <= GRID_SIZE)
    .slice(0, 6);

  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => '')
  );

  const wordPositions: WordHuntData['wordPositions'] = [];

  for (const word of targetWords) {
    let placed = false;
    const upperWord = word.toUpperCase();

    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const direction: 'horizontal' | 'vertical' =
        Math.random() > 0.5 ? 'horizontal' : 'vertical';

      const maxRow = direction === 'vertical' ? GRID_SIZE - upperWord.length : GRID_SIZE - 1;
      const maxCol = direction === 'horizontal' ? GRID_SIZE - upperWord.length : GRID_SIZE - 1;

      if (maxRow < 0 || maxCol < 0) continue;

      const row = Math.floor(Math.random() * (maxRow + 1));
      const col = Math.floor(Math.random() * (maxCol + 1));

      let canPlace = true;
      for (let k = 0; k < upperWord.length; k++) {
        const r = direction === 'vertical' ? row + k : row;
        const c = direction === 'horizontal' ? col + k : col;
        const existing = grid[r][c];
        if (existing !== '' && existing !== upperWord[k]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let k = 0; k < upperWord.length; k++) {
          const r = direction === 'vertical' ? row + k : row;
          const c = direction === 'horizontal' ? col + k : col;
          grid[r][c] = upperWord[k];
        }
        wordPositions.push({ word: upperWord, row, col, direction });
        placed = true;
      }
    }
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return {
    targetWords: wordPositions.map((wp) => wp.word),
    gridLetters: grid,
    wordPositions,
  };
}

function generateStorySort(pages: string[]): StorySortData {
  const keyEvents: { text: string; correctOrder: number }[] = [];

  const step = Math.max(1, Math.floor(pages.length / 6));
  for (let i = 0; i < pages.length && keyEvents.length < 6; i += step) {
    const sentences = extractSentences(pages[i]);
    if (sentences.length > 0) {
      const sentence = sentences[0].slice(0, 80) + (sentences[0].length > 80 ? '...' : '');
      keyEvents.push({
        text: sentence,
        correctOrder: keyEvents.length,
      });
    }
  }

  if (keyEvents.length < 4) {
    for (let i = 0; i < pages.length && keyEvents.length < 4; i++) {
      const sentences = extractSentences(pages[i]);
      for (const s of sentences) {
        if (keyEvents.length >= 6) break;
        const trimmed = s.slice(0, 80) + (s.length > 80 ? '...' : '');
        if (!keyEvents.some((e) => e.text === trimmed)) {
          keyEvents.push({
            text: trimmed,
            correctOrder: keyEvents.length,
          });
        }
      }
    }
  }

  return {
    sentences: shuffleArray(keyEvents),
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useGameData(storyPages: string[], title: string, _language: string): GameData {
  return useMemo(() => {
    if (!storyPages || storyPages.length === 0) {
      return {
        quiz: [],
        wordHunt: {
          targetWords: [],
          gridLetters: Array.from({ length: 8 }, () => Array(8).fill('A')),
          wordPositions: [],
        },
        storySort: { sentences: [] },
      };
    }

    return {
      quiz: generateQuiz(storyPages, title),
      wordHunt: generateWordHunt(storyPages),
      storySort: generateStorySort(storyPages),
    };
  }, [storyPages, title]);
}
