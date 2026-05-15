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
  const storedUser = getUserFromStorage();
  const [user, setUser] = useState<User | null>(storedUser);
  const [loading, setLoading] = useState(!storedUser); // skip loading if we already have user

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
