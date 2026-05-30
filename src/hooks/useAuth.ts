import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

function getUserFromStorage(): User | null {
  try {
    const key = Object.keys(localStorage).find(
      k => k.startsWith('sb-') && k.endsWith('-auth-token')
    );
    if (!key) return null;
    const stored = JSON.parse(localStorage.getItem(key) || '');
    return stored?.user ?? null;
  } catch {
    return null;
  }
}

export const useAuth = () => {
  // Lazy initial state: getUserFromStorage runs ONCE on mount, not every render.
  // (Passing a function to useState defers it to first render only.)
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());
  const [loading, setLoading] = useState<boolean>(() => !getUserFromStorage());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = session?.user ?? null;
      // Only update state if the user id actually changed — avoids handing out
      // a new object reference (and re-render storms) on every auth event.
      setUser(prev => (prev?.id === next?.id ? prev : next));
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const next = session?.user ?? null;
      setUser(prev => (prev?.id === next?.id ? prev : next));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
