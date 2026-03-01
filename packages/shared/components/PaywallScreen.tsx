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
import { COLORS, SPACING, RADIUS } from '../types';

const { width } = Dimensions.get('window');

interface PaywallScreenProps {
  userId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PLAN_LABELS: Record<string, { name: string; badge?: string }> = {
  '$rc_monthly': { name: 'Monthly', badge: undefined },
  '$rc_annual': { name: 'Yearly', badge: 'Save 50%' },
  '$rc_lifetime': { name: 'Lifetime', badge: 'Best Value' },
};

export function PaywallScreen({ userId, onClose, onSuccess }: PaywallScreenProps) {
  const { packages, isLoading, purchase, restore } = useSubscription(userId);

  const handlePurchase = useCallback(async (pkg: PurchasesPackage) => {
    const success = await purchase(pkg);
    if (success) onSuccess();
  }, [purchase, onSuccess]);

  const handleRestore = useCallback(async () => {
    const success = await restore();
    if (success) onSuccess();
  }, [restore, onSuccess]);

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
        <Text style={styles.title}>Unlock StoryPal Premium</Text>
        <Text style={styles.subtitle}>Create unlimited magical stories</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresCard}>
          {[
            { icon: '✨', text: 'Unlimited stories per day' },
            { icon: '🎨', text: 'All themes & characters' },
            { icon: '📖', text: 'HD illustrations' },
            { icon: '💾', text: 'Save & share stories' },
          ].map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <View style={styles.plans}>
            {packages.map((pkg) => {
              const planInfo = PLAN_LABELS[pkg.packageType] ?? {
                name: pkg.product.title,
              };
              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    styles.planCard,
                    planInfo.badge ? styles.planCardHighlighted : undefined,
                  ]}
                  onPress={() => handlePurchase(pkg)}
                  activeOpacity={0.8}
                >
                  {planInfo.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{planInfo.badge}</Text>
                    </View>
                  )}
                  <Text style={styles.planName}>{planInfo.name}</Text>
                  <Text style={styles.planPrice}>{pkg.product.priceString}</Text>
                  <Text style={styles.planPeriod}>
                    {pkg.packageType === '$rc_lifetime' ? 'one time' : `per ${pkg.packageType === '$rc_annual' ? 'year' : 'month'}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Payment will be charged to your App Store account. Subscriptions auto-renew unless cancelled 24 hours before the end of the current period.
        </Text>
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
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: SPACING.xs,
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
  loader: {
    marginTop: SPACING.xl,
  },
  plans: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
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
  },
  planCardHighlighted: {
    borderColor: COLORS.primary,
    transform: [{ scale: 1.02 }],
  },
  badge: {
    position: 'absolute',
    top: -10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  planName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  planPeriod: {
    fontSize: 12,
    color: COLORS.textMuted,
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
