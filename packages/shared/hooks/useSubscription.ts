import { useState, useEffect, useCallback } from 'react';
import type { PurchasesPackage } from 'react-native-purchases';
import {
  configureRevenueCat,
  checkSubscriptionStatus,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from '../services/revenue-cat';

interface SubscriptionState {
  isPremium: boolean;
  plan: string | null;
  packages: PurchasesPackage[];
  isLoading: boolean;
  error: string | null;
}

export function useSubscription(userId?: string) {
  const [state, setState] = useState<SubscriptionState>({
    isPremium: false,
    plan: null,
    packages: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await configureRevenueCat(userId);
        const [status, packages] = await Promise.all([
          checkSubscriptionStatus(),
          getOfferings(),
        ]);
        if (mounted) {
          setState({
            isPremium: status.isPremium,
            plan: status.plan,
            packages,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to load subscription',
          }));
        }
      }
    }

    init();
    return () => { mounted = false; };
  }, [userId]);

  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await purchasePackage(pkg);
      setState(prev => ({
        ...prev,
        isPremium: result.isPremium,
        plan: result.plan,
        isLoading: false,
      }));
      return result.isPremium;
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Purchase failed',
      }));
      return false;
    }
  }, []);

  const restore = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await restorePurchases();
      setState(prev => ({
        ...prev,
        isPremium: result.isPremium,
        plan: result.plan,
        isLoading: false,
      }));
      return result.isPremium;
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Restore failed',
      }));
      return false;
    }
  }, []);

  return { ...state, purchase, restore };
}
