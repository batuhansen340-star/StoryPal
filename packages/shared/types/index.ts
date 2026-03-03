export type AgeGroup = '3-5' | '5-7' | '7-10';

export interface AgeGroupConfig {
  label: string;
  pages: number;
  maxWordsPerPage: number;
  description: string;
}

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  gradient: [string, string];
  description: string;
}

export interface Character {
  id: string;
  name: string;
  emoji: string;
  trait: string;
  description: string;
  region?: string;
}

export interface StoryPage {
  id: string;
  storyId: string;
  pageNumber: number;
  text: string;
  imageUrl: string | null;
  imagePrompt: string;
}

export interface Story {
  id: string;
  userId: string;
  title: string;
  theme: string;
  character: string;
  ageGroup: AgeGroup;
  language: string;
  pages: StoryPage[];
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  isPremium: boolean;
  subscriptionPlan: 'free' | 'monthly' | 'yearly' | 'lifetime' | null;
  storiesCreatedToday: number;
  lastStoryDate: string | null;
  createdAt: string;
}

export interface UsageLog {
  id: string;
  userId: string;
  action: 'story_created' | 'image_generated' | 'text_generated';
  cost: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PersonalizationData {
  name?: string;
  gender?: 'girl' | 'boy';
  hairColor: string;
  skinTone: string;
  hasGlasses: boolean;
  photoUri?: string;
  faceDescription?: string;
  usePhotoFace?: boolean;
}

export interface StoryChoice {
  id: string;
  emoji: string;
  text: string;
  nextPageIndex: number;
}

export interface StoryGenerationRequest {
  theme: string;
  character: string;
  ageGroup: AgeGroup;
  language: string;
  personalization?: PersonalizationData;
  customPrompt?: string;
}

export interface StoryGenerationResponse {
  title: string;
  pages: {
    text: string;
    imagePrompt: string;
    choices?: StoryChoice[];
  }[];
}

export interface CharacterSheet {
  baseDescription: string;
  features: string[];
  style: string;
  consistencyPrompt: string;
}

export interface VoiceCharacter {
  id: string;
  name: string;
  emoji: string;
  description: string;
  pitch: number;
  rate: number;
  gradient: [string, string];
  isPremium: boolean;
  elevenLabsVoiceId?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

export const COLORS = {
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#E55A5A',
  secondary: '#FF8E53',
  background: '#FFF8F0',
  backgroundDark: '#FFF0E0',
  text: '#2D2D2D',
  textLight: '#6B6B6B',
  textMuted: '#9B9B9B',
  accent: '#4ECDC4',
  accentLight: '#7EDDD6',
  card: '#FFFFFF',
  cardShadow: 'rgba(255, 107, 107, 0.15)',
  success: '#6BCB77',
  warning: '#FFD93D',
  error: '#FF6B6B',
  overlay: 'rgba(0, 0, 0, 0.5)',
  glass: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
  switchTrack: '#E0E0E0',
} as const;

export const GRADIENTS = {
  primary: [COLORS.primary, COLORS.secondary] as [string, string],
  accent: [COLORS.accent, '#44B09E'] as [string, string],
  purple: ['#A18CD1', '#FBC2EB'] as [string, string],
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;
