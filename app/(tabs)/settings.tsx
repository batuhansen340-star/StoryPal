import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { getLanguageByCode } from '../../constants/languages';
import { type AuthUser, getAuthUser, signOut } from '../../packages/shared/services/auth';

interface SettingsRowProps {
  emoji: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingsRow({ emoji, title, subtitle, onPress, rightElement }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingsRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.settingsRowLeft}>
        <View style={styles.settingsIconContainer}>
          <Text style={styles.settingsEmoji}>{emoji}</Text>
        </View>
        <View>
          <Text style={styles.settingsTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement ?? (onPress ? <Text style={styles.settingsArrow}>›</Text> : null)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentLang, setCurrentLang] = useState('en');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('storypal_language').then(saved => {
        if (saved) setCurrentLang(saved);
      });
      getAuthUser().then(u => setAuthUser(u));
    }, [])
  );

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>Settings ⚙️</Text>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={[COLORS.primary, '#FF8E53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileCard}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarEmoji}>{authUser?.isGuest ? '\u{1F47B}' : '\u{1F9D2}'}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{authUser?.displayName ?? 'Story Explorer'}</Text>
                <Text style={styles.profilePlan}>
                  {authUser?.isGuest ? 'Guest' : authUser?.email ?? 'Free Plan'} {'\u00B7'} 2 stories/day
                </Text>
              </View>
              <View style={styles.upgradeBadge}>
                <Text style={styles.upgradeBadgeText}>Upgrade {'\u{1F451}'}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* General */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Text style={styles.sectionLabel}>General</Text>
          <View style={styles.settingsCard}>
            <SettingsRow
              emoji="🔔"
              title="Notifications"
              subtitle="Story reminders"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#ddd', true: COLORS.primaryLight }}
                  thumbColor={notificationsEnabled ? COLORS.primary : '#f4f4f4'}
                />
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              emoji={getLanguageByCode(currentLang).flag}
              title="Language"
              subtitle={getLanguageByCode(currentLang).nativeName}
              onPress={() => router.push('/story/select-language')}
            />
            <View style={styles.divider} />
            <SettingsRow
              emoji="👶"
              title="Default Age Group"
              subtitle="3-5 Years"
              onPress={() => {}}
            />
          </View>
        </Animated.View>

        {/* Subscription */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <Text style={styles.sectionLabel}>Subscription</Text>
          <View style={styles.settingsCard}>
            <SettingsRow
              emoji="👑"
              title="Manage Subscription"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              emoji="🔄"
              title="Restore Purchases"
              onPress={() => Alert.alert('Restore', 'Checking for previous purchases...')}
            />
          </View>
        </Animated.View>

        {/* Support */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <Text style={styles.sectionLabel}>Support</Text>
          <View style={styles.settingsCard}>
            <SettingsRow
              emoji="❓"
              title="Help Center"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              emoji="📧"
              title="Contact Us"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              emoji="⭐"
              title="Rate StoryPal"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              emoji="📜"
              title="Privacy Policy"
              onPress={() => {}}
            />
          </View>
        </Animated.View>

        {/* Account */}
        <Animated.View entering={FadeInDown.duration(500).delay(500)}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.settingsCard}>
            <SettingsRow
              emoji={'\u{1F6AA}'}
              title="Sign Out"
              onPress={handleSignOut}
            />
          </View>
        </Animated.View>

        <Text style={styles.version}>StoryPal v1.0.0</Text>

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
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  profileCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  profilePlan: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  upgradeBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  upgradeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  settingsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settingsEmoji: {
    fontSize: 20,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingsSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  settingsArrow: {
    fontSize: 24,
    color: COLORS.textMuted,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.backgroundDark,
    marginLeft: 68,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: SPACING.md,
  },
});
