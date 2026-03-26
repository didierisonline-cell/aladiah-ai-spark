import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type Tier = 't1' | 't2' | 't3';

interface Subscription {
  tier: Tier;
  status: string;
  isActive: boolean;
}

// Features available per tier
const TIER_FEATURES: Record<Tier, string[]> = {
  t1: [
    'courses', 'ai_lessons', 'progress_tracker', 'community', 'store', 'multilingual',
  ],
  t2: [
    'courses', 'ai_lessons', 'progress_tracker', 'community', 'store', 'multilingual',
    'interview_coach', 'resume_builder', 'career_advisor', 'simulations', 'advanced_strategies',
  ],
  t3: [
    'courses', 'ai_lessons', 'progress_tracker', 'community', 'store', 'multilingual',
    'interview_coach', 'resume_builder', 'career_advisor', 'simulations', 'advanced_strategies',
    'mentorship', 'personalized_strategy', 'direct_feedback', 'vip_community', 'early_access',
    'certification_prep', 'placement_support',
  ],
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('tier, status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Subscription fetch error:', error);
        // Default to t1 if table doesn't exist yet or other error
        setSubscription({ tier: 't1', status: 'active', isActive: true });
      } else if (data) {
        setSubscription({
          tier: data.tier as Tier,
          status: data.status,
          isActive: data.status === 'active' || data.status === 'trialing',
        });
      } else {
        // No subscription found — check user metadata for tier (set during registration)
        const userTier = user.user_metadata?.tier;
        const tier = userTier === 'accelerator' ? 't2' : userTier === 'elite' ? 't3' : 't1';
        setSubscription({ tier: tier as Tier, status: 'active', isActive: true });
      }
      setLoading(false);
    };

    fetchSubscription();
  }, [user]);

  const hasFeature = (feature: string): boolean => {
    if (!subscription) return false;
    if (!subscription.isActive) return false;
    return TIER_FEATURES[subscription.tier]?.includes(feature) ?? false;
  };

  const tierName = subscription?.tier === 't3' ? 'Elite' :
                   subscription?.tier === 't2' ? 'Accelerator' : 'Foundation';

  return {
    subscription,
    loading,
    tier: subscription?.tier || 't1',
    tierName,
    isActive: subscription?.isActive ?? false,
    hasFeature,
  };
};
