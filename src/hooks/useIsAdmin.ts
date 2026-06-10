import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// The founder always has access; data itself is additionally protected by RLS
// (aos_is_admin → user_roles), so this client gate is for UI/navigation only.
const FOUNDER_EMAIL = 'didierisonline@gmail.com';

/** Is the current user an admin/founder? (reads public.user_roles). */
export function useIsAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    if ((user.email || '').toLowerCase() === FOUNDER_EMAIL) {
      setIsAdmin(true);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .limit(1);
        if (active) setIsAdmin(Boolean(data && data.length));
      } catch {
        if (active) setIsAdmin(false);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
}
