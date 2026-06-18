-- =============================================================================
-- SECURITY HARDENING — email abuse-protection rate-limit log
-- =============================================================================
-- Apply by hand in Supabase BEFORE deploying the updated send-email /
-- send-welcome-email functions (they read/write this table to throttle abuse).
--
-- Backs per-recipient rate limiting in the email edge functions so the
-- academy's Resend domain cannot be used to blast mail at arbitrary addresses.
-- Written/read only by the edge functions (service role); RLS on with no
-- policies => no anon/authenticated access.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.email_send_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_key text NOT NULL,   -- normalized identity the send is attributed to
  email_type    text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_send_log_key_time_idx
  ON public.email_send_log (recipient_key, created_at DESC);

ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;
-- No policies on purpose: only the service role (edge functions) touches this.

-- Optional housekeeping (safe to run periodically): keep ~30 days.
--   DELETE FROM public.email_send_log WHERE created_at < now() - interval '30 days';

-- VERIFICATION:
--   SELECT relrowsecurity FROM pg_class WHERE relname = 'email_send_log'; -- expect true
--   SELECT count(*) FROM pg_policies WHERE tablename = 'email_send_log';  -- expect 0
