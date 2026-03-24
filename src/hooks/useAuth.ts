import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes (magic link, sign in/out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check if the URL contains auth callback params (magic link redirect).
    // Supabase PKCE flow uses ?code= in query string.
    // Implicit flow uses #access_token= in hash.
    const url = window.location.href;
    const hasAuthCallback = url.includes('code=') ||
                            url.includes('access_token') ||
                            url.includes('type=magiclink') ||
                            url.includes('type=signup');

    if (hasAuthCallback) {
      // Let onAuthStateChange handle the token exchange.
      // Fallback: check session after 3s if onAuthStateChange hasn't fired.
      const timeout = setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setUser(session.user);
          }
          setLoading(false);
        });
      }, 3000);
      return () => { clearTimeout(timeout); subscription.unsubscribe(); };
    } else {
      // No auth callback — safe to check session immediately
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
