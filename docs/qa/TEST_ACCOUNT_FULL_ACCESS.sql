-- =============================================================================
-- TEST ACCOUNT — full-access grant for founder-authorized platform tester
--   Account: tommy.tabala@gmail.com  (friend of the Founder, QA testing)
--
-- PREREQUISITE (done in Supabase Dashboard, not SQL):
--   Authentication → Users → Add user → email tommy.tabala@gmail.com,
--   set the agreed password, and check "Auto Confirm Email".
--   The on_auth_user_created trigger then creates the starter profile row.
--
-- REVIEWABLE SQL — apply by hand in Supabase SQL Editor. Idempotent.
-- Grants tier t3 (Elite: all programs, all modules, all features).
-- =============================================================================

DO $$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = 'tommy.tabala@gmail.com';
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'tommy.tabala@gmail.com not found in auth.users — create the account first (Dashboard → Authentication → Add user)';
  END IF;

  -- Unlock every program/module: anything other than 'starter' passes the
  -- paid-tier checks; t3 also enables the full Elite feature set.
  UPDATE public.profiles
     SET tier = 't3', updated_at = now()
   WHERE user_id = v_uid;
  IF NOT FOUND THEN
    INSERT INTO public.profiles (user_id, full_name, tier)
    VALUES (v_uid, 'Tommy Tabala (QA Tester)', 't3');
  END IF;

  -- Feature-flag source for useSubscription; guard against duplicate rows
  -- (the hook reads with maybeSingle).
  IF NOT EXISTS (SELECT 1 FROM public.subscriptions WHERE user_id = v_uid) THEN
    INSERT INTO public.subscriptions (user_id, tier, status, current_period_end)
    VALUES (v_uid, 't3', 'active', now() + interval '1 year');
  ELSE
    UPDATE public.subscriptions
       SET tier = 't3', status = 'active',
           current_period_end = now() + interval '1 year', updated_at = now()
     WHERE user_id = v_uid;
  END IF;
END $$;

-- ── Verification (run after) — must return exactly 1 row:
--    email confirmed, profile_tier = t3, sub_tier = t3, sub_status = active ──
SELECT u.email,
       (u.email_confirmed_at IS NOT NULL) AS email_confirmed,
       p.tier   AS profile_tier,
       s.tier   AS sub_tier,
       s.status AS sub_status,
       s.current_period_end
FROM auth.users u
LEFT JOIN public.profiles      p ON p.user_id = u.id
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE u.email = 'tommy.tabala@gmail.com';
