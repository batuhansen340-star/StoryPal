import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { PurchasesPackage } from 'react-native-purchases';
import { useSubscription } from '../hooks/useSubscription';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../types';

const { width } = Dimensions.get('window');

interface PaywallScreenProps {
  userId?: string;
  onClose: () => void;
  onSuccess: () => void;
  t: (key: string) => string;
}

type TierKey = 'starter' | 'premium' | 'family';

interface TierConfig {
  key: TierKey;
  labelKey: string;
  badgeKey?: string;
  periodKey: string;
}

const TIER_MAP: Record<string, TierConfig> = {
  '$rc_monthly': {
    key: 'starter',
    labelKey: 'paywallStarter',
    periodKey: 'paywallPerMonth',
  },
  '$rc_annual': {
    key: 'premium',
    labelKey: 'paywallPremium',
    badgeKey: 'paywallMostPopular',
    periodKey: 'paywallPerYear',
  },
  '$rc_lifetime': {
    key: 'family',
    labelKey: 'paywallFamily',
    badgeKey: 'paywallBestValue',
    periodKey: 'paywallOneTime',
  },
};

export function PaywallScreen({ userId, onClose, onSuccess, t }: PaywallScreenProps) {
  const { packages, isLoading, purchase, restore } = useSubscription(userId);

  const handlePurchase = useCallback(async (pkg: PurchasesPackage) => {
    const success = await purchase(pkg);
    if (success) onSuccess();
  }, [purchase, onSuccess]);

  const handleRestore = useCallback(async () => {
    const success = await restore();
    if (success) onSuccess();
  }, [restore, onSuccess]);

  const premiumPkg = packages.find(
    (p) => String(p.packageType) === '$rc_annual'
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53', '#FFBA6B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.crownEmoji}>👑</Text>
        <Text style={styles.title}>{t('paywallTitle')}</Text>
        <Text style={styles.subtitle}>{t('paywallSubtitle')}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Features */}
        <View style={styles.featuresCard}>
          {[
            { icon: '✨', key: 'paywallUnlimitedStories' },
            { icon: '🎨', key: 'paywallAllThemes' },
            { icon: '📖', key: 'paywallHdIllustrations' },
            { icon: '💾', key: 'paywallSaveShare' },
          ].map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{t(feature.key)}</Text>
            </View>
          ))}
        </View>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <Text style={styles.socialProofText}>⭐ {t('paywallSocialProof')}</Text>
        </View>

        {/* Plans */}
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : packages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{t('paywallLoadingPlans')}</Text>
          </View>
        ) : (
          <View style={styles.plans}>
            {packages.map((pkg) => {
              const tier = TIER_MAP[String(pkg.packageType)] ?? {
                key: 'starter' as TierKey,
                labelKey: 'paywallStarter',
                periodKey: 'paywallPerMonth',
              };
              const isPremiumTier = tier.key === 'premium';

              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    styles.planCard,
                    isPremiumTier && styles.planCardHighlighted,
                  ]}
                  onPress={() => handlePurchase(pkg)}
                  activeOpacity={0.8}
                >
                  {tier.badgeKey && (
                    <View style={[
                      styles.badge,
                      isPremiumTier && styles.badgePremium,
                    ]}>
                      <Text style={styles.badgeText}>{t(tier.badgeKey)}</Text>
                    </View>
                  )}
                  <Text style={[
                    styles.planName,
                    isPremiumTier && styles.planNameHighlighted,
                  ]}>
                    {t(tier.labelKey)}
                  </Text>
                  <Text style={[
                    styles.planPrice,
                    isPremiumTier && styles.planPriceHighlighted,
                  ]}>
                    {pkg.product.priceString}
                  </Text>
                  <Text style={styles.planPeriod}>{t(tier.periodKey)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* CTA Button */}
        {premiumPkg && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handlePurchase(premiumPkg)}
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaText}>{t('paywallFreeTrial')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Trust Badges */}
        <View style={styles.trustRow}>
          <View style={styles.trustBadge}>
            <Text style={styles.trustIcon}>🔒</Text>
            <Text style={styles.trustText}>{t('paywallTrustCancel')}</Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.trustIcon}>🛡️</Text>
            <Text style={styles.trustText}>{t('paywallTrustCoppa')}</Text>
          </View>
        </View>

        {/* Restore */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreText}>{t('paywallRestorePurchases')}</Text>
        </TouchableOpacity>

        {/* Continue free */}
        <TouchableOpacity style={styles.continueButton} onPress={onClose}>
          <Text style={styles.continueText}>{t('paywallContinueFree')}</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>{t('paywallDisclaimer')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  closeButton: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  crownEmoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginTop: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  featuresCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: -20,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  socialProof: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  socialProofText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  loader: {
    marginTop: SPACING.xl,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    padding: SPACING.lg,
  },
  emptyStateText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  plans: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  planCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 130,
    justifyContent: 'center',
  },
  planCardHighlighted: {
    borderColor: COLORS.primary,
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -10,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgePremium: {
    backgroundColor: COLORS.primary,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  planName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  planNameHighlighted: {
    color: COLORS.primary,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  planPriceHighlighted: {
    color: COLORS.primary,
  },
  planPeriod: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  ctaButton: {
    marginTop: SPACING.lg,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.lg,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  trustIcon: {
    fontSize: 16,
  },
  trustText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  restoreButton: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
    padding: SPACING.sm,
  },
  restoreText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  continueButton: {
    alignSelf: 'center',
    marginTop: SPACING.sm,
    padding: SPACING.sm,
  },
  continueText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xxl,
    lineHeight: 16,
    paddingHorizontal: SPACING.md,
  },
});
