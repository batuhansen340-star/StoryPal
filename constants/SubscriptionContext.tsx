import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionContextType {
  isPremium: boolean;
  currentTier: 'free' | 'starter' | 'hero' | 'family';
  isTrialing: boolean;
  purchasePackage: (tierId: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  currentTier: 'free',
  isTrialing: false,
  purchasePackage: async () => false,
  restorePurchases: async () => false,
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [currentTier, setCurrentTier] = useState<'free' | 'starter' | 'hero' | 'family'>('free');
  const [isTrialing, setIsTrialing] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('storypal_subscription').then(val => {
      if (val) {
        try {
          const data = JSON.parse(val);
          setIsPremium(data.isPremium ?? false);
          setCurrentTier(data.currentTier ?? 'free');
          setIsTrialing(data.isTrialing ?? false);
        } catch {
          // Invalid JSON
        }
      }
    });
  }, []);

  const purchasePackage = useCallback(async (tierId: string): Promise<boolean> => {
    try {
      const tierMap: Record<string, 'starter' | 'hero' | 'family'> = {
        starter: 'starter',
        hero: 'hero',
        family: 'family',
      };
      const tier = tierMap[tierId] ?? 'hero';
      const data = { isPremium: true, currentTier: tier, isTrialing: true };
      await AsyncStorage.setItem('storypal_subscription', JSON.stringify(data));
      setIsPremium(true);
      setCurrentTier(tier);
      setIsTrialing(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    return false;
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isPremium, currentTier, isTrialing, purchasePackage, restorePurchases }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscriptionContext = () => useContext(SubscriptionContext);
