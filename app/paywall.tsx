import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../packages/shared/types';
import { useLanguage } from '../constants/LanguageContext';
import { useSubscriptionContext } from '../constants/SubscriptionContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md * 2) / 3;

interface TierData {
  id: string;
  emoji: string;
  nameKey: string;
  price: string;
  descKey: string;
  features: string[];
  highlighted: boolean;
  badgeKey?: string;
  borderColor: string;
}

const TIERS: TierData[] = [
  {
    id: 'starter',
    emoji: '\u{1F319}',
    nameKey: 'tierStarter',
    price: '$2.99',
    descKey: 'tierStarterDesc',
    features: ['3 stories/day', '30 characters', '2 voices', '5 languages', 'Quiz'],
    highlighted: false,
    borderColor: '#E0E0E0',
  },
  {
    id: 'hero',
    emoji: '\u2B50',
    nameKey: 'tierHero',
    price: '$4.99',
    descKey: 'tierHeroDesc',
    features: ['Unlimited stories', '62 characters', '\u{1F4F8} Photo hero', '6 voices', '10 languages', '3 games', 'Unlimited library'],
    highlighted: true,
    badgeKey: 'mostPopular',
    borderColor: '#F39C12',
  },
  {
    id: 'family',
    emoji: '\u{1F451}',
    nameKey: 'tierFamily',
    price: '$9.99',
    descKey: 'tierFamilyDesc',
    features: ['Everything in Hero', '3 kid profiles', 'Bedtime mode'],
    highlighted: false,
    borderColor: '#E0E0E0',
  },
];

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const { purchasePackage, restorePurchases } = useSubscriptionContext();
  const { childName } = useLocalSearchParams<{ childName?: string }>();

  const displayName = childName || t('paywallSubtitle').split(' ')[0];
  const paywallTitle = t('paywallTitle').replace('{name}', displayName);

  const handlePurchase = async (tierId: string) => {
    const success = await purchasePackage(tierId);
    if (success) {
      router.back();
    }
  };

  const handleRestore = async () => {
    await restorePurchases();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1B4F72', '#2E86C1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient, { paddingTop: insets.top + SPACING.md }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <Text style={styles.headerEmoji}>{'\u2728'}</Text>
            <Text style={styles.title}>{paywallTitle}</Text>
            <Text style={styles.subtitle}>{t('paywallSubtitle')}</Text>
          </Animated.View>

          {/* Tier Cards */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tiersContainer}
              snapToInterval={CARD_WIDTH + SPACING.md}
              decelerationRate="fast"
            >
              {TIERS.map((tier, index) => (
                <Animated.View
                  key={tier.id}
                  entering={FadeInUp.duration(400).delay(index * 100)}
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handlePurchase(tier.id)}
                    style={[
                      styles.tierCard,
                      {
                        borderColor: tier.borderColor,
                        width: CARD_WIDTH,
                      },
                      tier.highlighted && styles.tierCardHighlighted,
                    ]}
                  >
                    {tier.badgeKey && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{t(tier.badgeKey as any)}</Text>
                      </View>
                    )}
                    <Text style={styles.tierEmoji}>{tier.emoji}</Text>
                    <Text style={styles.tierName}>{t(tier.nameKey as any)}</Text>
                    <Text style={styles.tierPrice}>{tier.price}<Text style={styles.tierPeriod}>{t('perMonth')}</Text></Text>
                    <View style={styles.tierFeatures}>
                      {tier.features.map((f, i) => (
                        <Text key={i} style={styles.tierFeature}>{'\u2713'} {f}</Text>
                      ))}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* CTA */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.ctaSection}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handlePurchase('hero')}
            >
              <LinearGradient
                colors={['#F39C12', '#E67E22']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaButton}
              >
                <Text style={styles.ctaText}>{t('freeTrialButton')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Trust */}
          <Animated.View entering={FadeInDown.duration(600).delay(500)} style={styles.trustSection}>
            <Text style={styles.trustText}>{t('trustBadge')}</Text>
            <Text style={styles.socialProof}>{t('socialProof')}</Text>
          </Animated.View>

          {/* Bottom links */}
          <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.laterText}>{t('laterButton')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRestore} activeOpacity={0.7}>
              <Text style={styles.restoreText}>{t('restorePurchase')}</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: insets.bottom + 40 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  tiersContainer: {
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  tierCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 280,
  },
  tierCardHighlighted: {
    borderColor: '#F39C12',
    transform: [{ scale: 1.05 }],
    shadowColor: '#F39C12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  badge: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#F39C12',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  tierEmoji: {
    fontSize: 36,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  tierName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tierPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  tierPeriod: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tierFeatures: {
    alignSelf: 'stretch',
    gap: 4,
  },
  tierFeature: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  ctaSection: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  ctaButton: {
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
    shadowColor: '#F39C12',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  trustSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  trustText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  socialProof: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomLinks: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  laterText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  restoreText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
