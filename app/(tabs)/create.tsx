import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../../packages/shared/types';
import { AGE_GROUPS } from '../../apps/storypal/constants/themes';
import type { AgeGroup } from '../../packages/shared/types';
import { usePremium } from '../../packages/shared/hooks/usePremium';
import { PaywallScreen } from '../../packages/shared/components/PaywallScreen';
import { getAuthUser } from '../../packages/shared/services/auth';
import { selection } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';

const AGE_GROUP_EMOJIS: Record<AgeGroup, string> = {
  '3-5': '🍼',
  '5-7': '🎒',
  '7-10': '📚',
};

const AGE_GROUP_GRADIENTS: Record<AgeGroup, [string, string]> = {
  '3-5': GRADIENTS.primary,
  '5-7': GRADIENTS.accent,
  '7-10': GRADIENTS.purple,
};

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isPremium, canCreate, dailyRemaining, refresh } = usePremium();
  const { t } = useLanguage();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleSelectAge = (ageGroup: AgeGroup) => {
    selection();
    if (!canCreate) {
      setShowPaywall(true);
      return;
    }
    router.push({
      pathname: '/story/select-language',
      params: { ageGroup },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>{t('createStory')} ✨</Text>
          <Text style={styles.subtitle}>
            {t('chooseAgeGroup')}
          </Text>
        </Animated.View>

        <View style={styles.ageCards}>
          {(Object.entries(AGE_GROUPS) as [AgeGroup, typeof AGE_GROUPS[AgeGroup]][]).map(
            ([key, config], index) => (
              <Animated.View
                key={key}
                entering={FadeInDown.duration(500).delay(index * 150)}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleSelectAge(key)}
                  accessibilityLabel={`${config.label} age group`}
                  accessibilityRole="button"
                >
                  <LinearGradient
                    colors={AGE_GROUP_GRADIENTS[key]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ageCard}
                  >
                    <Text style={styles.ageEmoji}>
                      {AGE_GROUP_EMOJIS[key]}
                    </Text>
                    <View style={styles.ageInfo}>
                      <Text style={styles.ageLabel}>{config.label}</Text>
                      <Text style={styles.ageDesc}>{config.description}</Text>
                      <View style={styles.ageDetails}>
                        <View style={styles.ageBadge}>
                          <Text style={styles.ageBadgeText}>
                            {config.pages} {t('pages')}
                          </Text>
                        </View>
                        <View style={styles.ageBadge}>
                          <Text style={styles.ageBadgeText}>
                            ~{config.maxWordsPerPage} {t('wordsPerPage')}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.ageArrow}>→</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ),
          )}
        </View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(500)}
          style={styles.tipCard}
        >
          <View style={styles.tipGlass}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              {t('ageTip')}
            </Text>
          </View>
        </Animated.View>

        {/* Usage Badge */}
        {!isPremium && (
          <Animated.View entering={FadeInDown.duration(400).delay(600)} style={styles.usageCard}>
            <View style={styles.usageGlass}>
              <Text style={styles.usageEmoji}>{canCreate ? '\u{1F4A1}' : '\u{1F512}'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.usageText}>
                  {canCreate
                    ? `${dailyRemaining} ${t('freeStoriesLeft')}`
                    : t('dailyLimitReached')}
                </Text>
                {!canCreate && (
                  <Text style={styles.usageSubtext}>{t('upgradeUnlimited')}</Text>
                )}
              </View>
              {!canCreate && (
                <TouchableOpacity
                  style={styles.upgradeBadge}
                  onPress={() => setShowPaywall(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.upgradeBadgeText}>{'\u{1F451}'} {t('upgrade')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Paywall Modal */}
      <Modal visible={showPaywall} animationType="slide">
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            refresh();
          }}
        />
      </Modal>
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  ageCards: {
    gap: SPACING.md,
  },
  ageCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  ageEmoji: {
    fontSize: 48,
    marginRight: SPACING.md,
  },
  ageInfo: {
    flex: 1,
  },
  ageLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  ageDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: SPACING.sm,
  },
  ageDetails: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  ageBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  ageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  ageArrow: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '800',
  },
  tipCard: {
    marginTop: SPACING.xl,
  },
  tipGlass: {
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  usageCard: { marginTop: SPACING.md },
  usageGlass: {
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  usageEmoji: { fontSize: 24 },
  usageText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  usageSubtext: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  upgradeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  upgradeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
});
