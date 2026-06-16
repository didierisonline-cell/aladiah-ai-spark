-- =============================================================================
-- SEC-C1 — Stripe webhook idempotency store.
-- Records every Stripe event id the webhook has processed so retries/replays are
-- acknowledged without re-running side effects. The webhook inserts via the
-- service role (bypasses RLS); RLS is enabled with NO policies => deny-by-default
-- for anon/authenticated. Apply BY HAND in the Supabase SQL editor BEFORE
-- deploying the hardened handle-payment-webhook function.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.processed_stripe_events (
  event_id     text PRIMARY KEY,
  type         text,
  processed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.processed_stripe_events ENABLE ROW LEVEL SECURITY;
-- No policies on purpose: only the service role (the webhook) may read/write.

-- VERIFICATION:
-- SELECT count(*) FROM public.processed_stripe_events;            -- expect 0 initially
-- After a test event: a row appears; a replayed event id does NOT duplicate
-- (PRIMARY KEY conflict -> webhook returns {duplicate:true}).
