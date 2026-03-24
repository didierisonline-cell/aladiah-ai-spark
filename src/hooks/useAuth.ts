import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes (magic link detection, sign in/out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check for existing session — but if the URL contains a hash fragment
    // (magic link redirect), give the Supabase client time to process it
    // before concluding there's no session.
    const hasAuthFragment = window.location.hash.includes('access_token') ||
                            window.location.hash.includes('type=magiclink') ||
                            window.location.hash.includes('type=signup');

    if (hasAuthFragment) {
      // Let onAuthStateChange handle it — don't call getSession immediately
      // as the hash is still being processed. Set a timeout fallback.
      const timeout = setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });
      }, 2000);
      return () => { timeout && clearTimeout(timeout); subscription.unsubscribe(); };
    } else {
      // No hash fragment — safe to check session immediately
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
