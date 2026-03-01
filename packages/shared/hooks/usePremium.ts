import { useState, useEffect, useCallback } from 'react';
import { canCreateStory, getTodayStoryCount } from '../services/usage-limiter';
import { checkSubscriptionStatus, configureRevenueCat } from '../services/revenue-cat';
import { supabase } from '../services/supabase';

interface PremiumState {
  isPremium: boolean;
  plan: string | null;
  dailyRemaining: number;
  todayCount: number;
  canCreate: boolean;
  loading: boolean;
}

export function usePremium() {
  const [state, setState] = useState<PremiumState>({
    isPremium: false,
    plan: null,
    dailyRemaining: 2,
    todayCount: 0,
    canCreate: true,
    loading: true,
  });

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      let isPremium = false;
      let plan: string | null = null;

      try {
        await configureRevenueCat(userId);
        const status = await checkSubscriptionStatus();
        isPremium = status.isPremium;
        plan = status.plan;
      } catch {
        // RevenueCat may not be configured in dev/web
      }

      const todayCount = await getTodayStoryCount();
      const { allowed, remaining } = await canCreateStory(isPremium);

      setState({
        isPremium,
        plan,
        dailyRemaining: remaining,
        todayCount,
        canCreate: allowed,
        loading: false,
      });
    } catch {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
