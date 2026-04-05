import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../../packages/shared/types';
import { EmojiText } from '../../packages/shared/components/EmojiText';
import { useStats } from '../../packages/shared/hooks/useStats';
import { THEMES, CHARACTERS } from '../../apps/storypal/constants/themes';
import { REGIONAL_CHARACTERS } from '../../apps/storypal/constants/regional-characters';
import { EmptyState } from '../../packages/shared/components/EmptyState';
import { useLanguage } from '../../constants/LanguageContext';

// Achievement definitions
interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  condition: (stats: ReturnType<typeof useStats>['stats']) => boolean;
  gradient: [string, string];
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_story', emoji: '\u{1F31F}', title: 'First Tale', description: 'Create your first story', condition: (s) => (s?.totalStories ?? 0) >= 1, gradient: ['#FFD700', '#FFA500'] },
  { id: 'storyteller', emoji: '\u{1F4DA}', title: 'Storyteller', description: 'Create 5 stories', condition: (s) => (s?.totalStories ?? 0) >= 5, gradient: ['#FF6B6B', '#FF8E53'] },
  { id: 'bookworm', emoji: '\u{1F41B}', title: 'Bookworm', description: 'Create 10 stories', condition: (s) => (s?.totalStories ?? 0) >= 10, gradient: ['#A18CD1', '#FBC2EB'] },
  { id: 'author', emoji: '\u{270D}\u{FE0F}', title: 'Author', description: 'Create 25 stories', condition: (s) => (s?.totalStories ?? 0) >= 25, gradient: ['#4ECDC4', '#44B09E'] },
  { id: 'streak_3', emoji: '\u{1F525}', title: 'On Fire', description: '3-day streak', condition: (s) => (s?.longestStreak ?? 0) >= 3, gradient: ['#F39C12', '#E74C3C'] },
  { id: 'streak_7', emoji: '\u{1F680}', title: 'Unstoppable', description: '7-day streak', condition: (s) => (s?.longestStreak ?? 0) >= 7, gradient: ['#E74C3C', '#C0392B'] },
  { id: 'explorer', emoji: '\u{1F30D}', title: 'Explorer', description: 'Use 3+ themes', condition: (s) => Object.keys(s?.storiesByTheme ?? {}).length >= 3, gradient: ['#2ECC71', '#27AE60'] },
  { id: 'polyglot', emoji: '\u{1F5E3}\u{FE0F}', title: 'Polyglot', description: 'Write in 2+ languages', condition: (s) => (s?.languagesUsed?.length ?? 0) >= 2, gradient: ['#3498DB', '#2980B9'] },
];

const THEME_MAP: Record<string, { name: string; emoji: string }> = {};
for (const th of THEMES) {
  THEME_MAP[th.id] = { name: th.name, emoji: th.emoji };
}

const CHAR_MAP: Record<string, { name: string; emoji: string }> = {};
for (const c of [...CHARACTERS, ...REGIONAL_CHARACTERS]) {
  CHAR_MAP[c.id] = { name: c.name, emoji: c.emoji };
}

function StatCard({ emoji, label, value, delay }: { emoji: string; label: string; value: string | number; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)} style={styles.statCard}>
      <EmojiText style={styles.statEmoji}>{emoji}</EmojiText>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

function BarItem({ label, emoji, count, max }: { label: string; emoji: string; count: number; max: number }) {
  const width = max > 0 ? Math.max(8, (count / max) * 100) : 8;
  return (
    <View style={styles.barRow}>
      <EmojiText style={styles.barEmoji}>{emoji}</EmojiText>
      <Text style={styles.barLabel} numberOfLines={1}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${width}%` }]} />
      </View>
      <Text style={styles.barCount}>{count}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { stats, loading, refresh } = useStats();
  const { t } = useLanguage();

  if (!stats || (stats.totalStories === 0 && !loading)) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        >
          <EmptyState
            emoji={'\u{1F4CA}'}
            title={t('noStatsYet')}
            subtitle={t('noStatsText')}
          />
        </ScrollView>
      </View>
    );
  }

  const themeEntries = Object.entries(stats.storiesByTheme).sort((a, b) => b[1] - a[1]);
  const charEntries = Object.entries(stats.storiesByCharacter).sort((a, b) => b[1] - a[1]);
  const maxTheme = themeEntries[0]?.[1] ?? 1;
  const maxChar = charEntries[0]?.[1] ?? 1;

  const favTheme = stats.favoriteTheme ? THEME_MAP[stats.favoriteTheme] : null;
  const favChar = stats.favoriteCharacter ? CHAR_MAP[stats.favoriteCharacter] : null;

  const achievements = useMemo(() =>
    ACHIEVEMENTS.map(a => ({ ...a, unlocked: a.condition(stats) })),
    [stats]
  );
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>{t('yourStats')} <EmojiText>{'\u{1F4CA}'}</EmojiText></Text>
          <Text style={styles.subtitle}>{t('yourJourney')}</Text>
        </Animated.View>

        {/* Main Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard emoji={'\u{1F4DA}'} label={t('stories')} value={stats.totalStories} delay={100} />
          <StatCard emoji={'\u{1F4C4}'} label={t('pagesLabel')} value={stats.totalPages} delay={150} />
          <StatCard emoji={'\u{1F525}'} label={t('streak')} value={`${stats.currentStreak}d`} delay={200} />
          <StatCard emoji={'\u{1F3C6}'} label={t('bestStreak')} value={`${stats.longestStreak}d`} delay={250} />
        </View>

        {/* Activity */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}><EmojiText>{'\u{1F4C5}'}</EmojiText> {t('activity')}</Text>
          <View style={styles.activityRow}>
            <View style={styles.activityItem}>
              <Text style={styles.activityValue}>{stats.storiesThisWeek}</Text>
              <Text style={styles.activityLabel}>{t('thisWeek')}</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityItem}>
              <Text style={styles.activityValue}>{stats.storiesThisMonth}</Text>
              <Text style={styles.activityLabel}>{t('thisMonth')}</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityItem}>
              <Text style={styles.activityValue}>{stats.languagesUsed.length}</Text>
              <Text style={styles.activityLabel}>{t('languages')}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeInDown.duration(400).delay(350)} style={styles.section}>
          <Text style={styles.sectionTitle}>
            <EmojiText>{'\u{1F3C6}'}</EmojiText> {t('achievements') ?? 'Achievements'} ({unlockedCount}/{ACHIEVEMENTS.length})
          </Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((a) => (
              <View key={a.id} style={[styles.achievementCard, !a.unlocked && styles.achievementLocked]}>
                {a.unlocked ? (
                  <LinearGradient colors={a.gradient} style={styles.achievementGradient}>
                    <EmojiText style={styles.achievementEmoji}>{a.emoji}</EmojiText>
                    <Text style={styles.achievementTitle}>{a.title}</Text>
                    <Text style={styles.achievementDesc}>{a.description}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.achievementGradient}>
                    <EmojiText style={[styles.achievementEmoji, { opacity: 0.3 }]}>{'\u{1F512}'}</EmojiText>
                    <Text style={[styles.achievementTitle, { color: COLORS.textMuted }]}>{a.title}</Text>
                    <Text style={[styles.achievementDesc, { color: COLORS.textMuted }]}>{a.description}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Favorites */}
        {(favTheme || favChar) && (
          <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}><EmojiText>{'\u2B50'}</EmojiText> {t('favorites')}</Text>
            <View style={styles.favoritesRow}>
              {favTheme && (
                <View style={styles.favoriteCard}>
                  <EmojiText style={styles.favoriteEmoji}>{favTheme.emoji}</EmojiText>
                  <Text style={styles.favoriteLabel}>{t('theme')}</Text>
                  <Text style={styles.favoriteName}>{favTheme.name}</Text>
                </View>
              )}
              {favChar && (
                <View style={styles.favoriteCard}>
                  <EmojiText style={styles.favoriteEmoji}>{favChar.emoji}</EmojiText>
                  <Text style={styles.favoriteLabel}>{t('character')}</Text>
                  <Text style={styles.favoriteName}>{favChar.name}</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Theme Breakdown */}
        {themeEntries.length > 0 && (
          <Animated.View entering={FadeInDown.duration(400).delay(500)} style={styles.section}>
            <Text style={styles.sectionTitle}><EmojiText>{'\u{1F3A8}'}</EmojiText> {t('storiesByTheme')}</Text>
            {themeEntries.map(([id, count]) => {
              const tm = THEME_MAP[id];
              return (
                <BarItem
                  key={id}
                  label={tm?.name ?? id}
                  emoji={tm?.emoji ?? '\u{1F3A8}'}
                  count={count}
                  max={maxTheme}
                />
              );
            })}
          </Animated.View>
        )}

        {/* Character Breakdown */}
        {charEntries.length > 0 && (
          <Animated.View entering={FadeInDown.duration(400).delay(600)} style={styles.section}>
            <Text style={styles.sectionTitle}><EmojiText>{'\u{1F31F}'}</EmojiText> {t('storiesByCharacter')}</Text>
            {charEntries.map(([id, count]) => {
              const c = CHAR_MAP[id];
              return (
                <BarItem
                  key={id}
                  label={c?.name ?? id}
                  emoji={c?.emoji ?? '\u{1F31F}'}
                  count={count}
                  max={maxChar}
                />
              );
            })}
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: SPACING.lg },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.xs },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: SPACING.lg },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, marginBottom: SPACING.lg },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: 'center',
    shadowColor: COLORS.cardShadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 3,
  },
  statEmoji: { fontSize: 28, marginBottom: SPACING.xs },
  statValue: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  statLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginTop: 2 },

  section: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.cardShadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },

  activityRow: { flexDirection: 'row', alignItems: 'center' },
  activityItem: { flex: 1, alignItems: 'center' },
  activityValue: { fontSize: 24, fontWeight: '900', color: COLORS.primary },
  activityLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, marginTop: 2 },
  activityDivider: { width: 1, height: 40, backgroundColor: COLORS.backgroundDark },

  favoritesRow: { flexDirection: 'row', gap: SPACING.md },
  favoriteCard: {
    flex: 1, backgroundColor: COLORS.backgroundDark, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: 'center',
  },
  favoriteEmoji: { fontSize: 32, marginBottom: SPACING.xs },
  favoriteLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  favoriteName: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginTop: 2, textAlign: 'center' },

  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  barEmoji: { fontSize: 18, width: 28 },
  barLabel: { width: 80, fontSize: 12, fontWeight: '600', color: COLORS.textLight },
  barTrack: {
    flex: 1, height: 12, backgroundColor: COLORS.backgroundDark,
    borderRadius: 6, marginHorizontal: SPACING.sm, overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 6 },
  barCount: { width: 24, fontSize: 13, fontWeight: '800', color: COLORS.text, textAlign: 'right' },

  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  achievementCard: {
    width: '48%' as unknown as number,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  achievementLocked: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: RADIUS.lg,
  },
  achievementGradient: {
    padding: SPACING.md,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  achievementEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 2,
  },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
});
