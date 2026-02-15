import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useReferralCode = (programType: 'student' | 'affiliate') => {
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrCreate = async () => {
      setLoading(true);

      // Check for existing code
      const { data: existing } = await supabase
        .from('referral_codes')
        .select('id, code')
        .eq('user_id', user.id)
        .eq('program_type', programType)
        .maybeSingle();

      if (existing) {
        setCode(existing.code);
        // Fetch tracking count
        const { count } = await supabase
          .from('referral_tracking')
          .select('*', { count: 'exact', head: true })
          .eq('referral_code_id', existing.id)
          .in('status', ['registered', 'qualified']);
        setReferralCount(count ?? 0);
      } else {
        // Generate new code
        const { data: genData } = await supabase.rpc('generate_referral_code');
        const newCode = (genData as string) || Math.random().toString(36).substring(2, 10).toUpperCase();

        const { data: inserted } = await supabase
          .from('referral_codes')
          .insert({ user_id: user.id, code: newCode, program_type: programType })
          .select('code')
          .single();

        if (inserted) setCode(inserted.code);
      }

      setLoading(false);
    };

    fetchOrCreate();
  }, [user, programType]);

  const referralLink = code
    ? `${window.location.origin}/refer/${code}`
    : null;

  return { code, referralLink, loading, referralCount, user };
};
