import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { useStats } from '../../packages/shared/hooks/useStats';
import { THEMES, CHARACTERS } from '../../apps/storypal/constants/themes';
import { EmptyState } from '../../packages/shared/components/EmptyState';

const THEME_MAP: Record<string, { name: string; emoji: string }> = {};
for (const t of THEMES) {
  THEME_MAP[t.id] = { name: t.name, emoji: t.emoji };
}

const CHAR_MAP: Record<string, { name: string; emoji: string }> = {};
for (const c of CHARACTERS) {
  CHAR_MAP[c.id] = { name: c.name, emoji: c.emoji };
}

function StatCard({ emoji, label, value, delay }: { emoji: string; label: string; value: string | number; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)} style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

function BarItem({ label, emoji, count, max }: { label: string; emoji: string; count: number; max: number }) {
  const width = max > 0 ? Math.max(8, (count / max) * 100) : 8;
  return (
    <View style={styles.barRow}>
      <Text style={styles.barEmoji}>{emoji}</Text>
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

  if (!stats || (stats.totalStories === 0 && !loading)) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        >
          <EmptyState
            emoji={'\u{1F4CA}'}
            title="No Stats Yet"
            subtitle="Create your first story to see your reading stats!"
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>Your Stats {'\u{1F4CA}'}</Text>
          <Text style={styles.subtitle}>Your storytelling journey</Text>
        </Animated.View>

        {/* Main Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard emoji={'\u{1F4DA}'} label="Stories" value={stats.totalStories} delay={100} />
          <StatCard emoji={'\u{1F4C4}'} label="Pages" value={stats.totalPages} delay={150} />
          <StatCard emoji={'\u{1F525}'} label="Streak" value={`${stats.currentStreak}d`} delay={200} />
          <StatCard emoji={'\u{1F3C6}'} label="Best Streak" value={`${stats.longestStreak}d`} delay={250} />
        </View>

        {/* Activity */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>{'\u{1F4C5}'} Activity</Text>
          <View style={styles.activityRow}>
            <View style={styles.activityItem}>
              <Text style={styles.activityValue}>{stats.storiesThisWeek}</Text>
              <Text style={styles.activityLabel}>This Week</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityItem}>
              <Text style={styles.activityValue}>{stats.storiesThisMonth}</Text>
              <Text style={styles.activityLabel}>This Month</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityItem}>
              <Text style={styles.activityValue}>{stats.languagesUsed.length}</Text>
              <Text style={styles.activityLabel}>Languages</Text>
            </View>
          </View>
        </Animated.View>

        {/* Favorites */}
        {(favTheme || favChar) && (
          <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>{'\u2B50'} Favorites</Text>
            <View style={styles.favoritesRow}>
              {favTheme && (
                <View style={styles.favoriteCard}>
                  <Text style={styles.favoriteEmoji}>{favTheme.emoji}</Text>
                  <Text style={styles.favoriteLabel}>Theme</Text>
                  <Text style={styles.favoriteName}>{favTheme.name}</Text>
                </View>
              )}
              {favChar && (
                <View style={styles.favoriteCard}>
                  <Text style={styles.favoriteEmoji}>{favChar.emoji}</Text>
                  <Text style={styles.favoriteLabel}>Character</Text>
                  <Text style={styles.favoriteName}>{favChar.name}</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Theme Breakdown */}
        {themeEntries.length > 0 && (
          <Animated.View entering={FadeInDown.duration(400).delay(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>{'\u{1F3A8}'} Stories by Theme</Text>
            {themeEntries.map(([id, count]) => {
              const t = THEME_MAP[id];
              return (
                <BarItem
                  key={id}
                  label={t?.name ?? id}
                  emoji={t?.emoji ?? '\u{1F3A8}'}
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
            <Text style={styles.sectionTitle}>{'\u{1F31F}'} Stories by Character</Text>
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

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
});
