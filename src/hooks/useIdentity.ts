import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { resolveName, displayNameFromEmail, firstNameFromEmail, initialsFromEmail } from '@/lib/avatar';

/**
 * Single source of truth for the signed-in user's display identity.
 *
 * Name priority (launch / Priority Zero rule):
 *   1. profiles.full_name  (for THIS user_id)
 *   2. auth user_metadata.full_name
 *   3. email prefix — ONLY when no real name exists
 *
 * The identity is always for the authenticated user's OWN user_id — the profile
 * is read by `user_id` (never by email), so it can never surface another account.
 *
 * `metaName` is available synchronously from the auth user, so the first render
 * already shows the real name (no flash of the email prefix while the profiles
 * row loads). The profiles read only refines the name if it differs.
 */
export function useIdentity() {
  const { user } = useAuth();
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) { setProfileName(null); return; }
    let cancelled = false;
    supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => { if (!cancelled) setProfileName((data as any)?.full_name ?? null); });
    return () => { cancelled = true; };
  }, [user?.id]);

  const metaName = (user?.user_metadata as any)?.full_name ?? null;
  const email = user?.email ?? null;
  const name = resolveName(profileName, metaName); // real name or null

  return {
    name,                                            // real name, or null when none exists
    displayName: displayNameFromEmail(email, name),  // full real name (email prefix only if no name)
    firstName: firstNameFromEmail(email, name),      // first name only — for greetings
    initials: initialsFromEmail(email, name),        // from the real name
    email,
  };
}
