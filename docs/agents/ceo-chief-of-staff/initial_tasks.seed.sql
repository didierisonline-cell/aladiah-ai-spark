-- =============================================================================
-- Initial CEO tasks — seeded from the 2026-06-23 Evidence Audit (Top-10 actions)
-- Target table: public.aos_tasks  (Agent Operating System — single source of truth)
-- =============================================================================
-- CANON: Claude Code does NOT auto-apply SQL. Review this file, then paste the
--        block below into the Supabase SQL editor and run it BY HAND.
-- PREREQ: migration 20260610130000_agent_operating_system.sql must be applied
--        (i.e. public.aos_tasks must exist). Run section 0 to confirm.
-- After running, execute the VERIFICATION SELECT at the bottom (success = rows,
-- not just "no error").
-- owner/evidence/risk/approval are carried in payload (jsonb); assigned_agent is a
-- cell slug, or NULL when the owner is the Founder (human).
-- =============================================================================

-- 0) PREREQUISITE CHECK (run first; expect a row back) --------------------------
-- SELECT to_regclass('public.aos_tasks') AS aos_tasks_exists;   -- NULL = apply AOS migration first

-- 1) PASTE-READY SEED -----------------------------------------------------------
INSERT INTO public.aos_tasks
  (title, description, created_by_agent, assigned_agent, status, priority, payload)
VALUES
  ('Deploy create-checkout + handle-payment-webhook',
   'Edge fns are merged (#81) but not live; deploy the two payment functions to project vgujnkxylipfwmkpwzvb. No migration.',
   'ceo-chief-of-staff', NULL, 'ready', 'critical',
   '{"owner":"founder","evidence_required":"functions list version bump; forged webhook->400; unknown price->500","risk":"medium","founder_approval":true,"source":"audit Top-10 #1"}'::jsonb),

  ('Walk Founder Validation Runbook (signup->certificate)',
   'End-to-end proof walk on deployed infra; capture pass/fail + screenshots. Converts payment/completion/certificate from HYPOTHESIS to fact.',
   'ceo-chief-of-staff', NULL, 'pending', 'critical',
   '{"owner":"founder","evidence_required":"results table + screenshots per step","risk":"low","founder_approval":true,"after":"task #1","source":"audit Top-10 #2"}'::jsonb),

  ('Fix client-side Anthropic key path (route via ai-proxy)',
   'HomepageBot.tsx leaks VITE_ANTHROPIC_API_KEY; InteractiveLessonEngine + ResumeStudio call Anthropic keyless (broken). Route all 7 sites through the existing ai-proxy edge fn.',
   'ceo-chief-of-staff', 'product-builder', 'pending', 'high',
   '{"owner":"claude","evidence_required":"grep api.anthropic.com src/ = 0; build green","risk":"low","founder_approval":true,"source":"audit Top-10 #3"}'::jsonb),

  ('Localize 6 AI tutor system prompts (EN/FR/ES min.)',
   'student-assistant, lesson-qa, interview-simulator, enrollment-chat, ai-grading, scrum-simulation ship English-only prompts. Add user-language adaptation.',
   'ceo-chief-of-staff', 'product-builder', 'pending', 'high',
   '{"owner":"claude","evidence_required":"each fn emits FR/ES output for FR/ES users","risk":"medium","founder_approval":true,"source":"audit Top-10 #4"}'::jsonb),

  ('Resolve PR surface: close #80, revise #83, disposition #79',
   '#80 superseded by #81; #83 must become docs-only; #79 bundle fate undecided.',
   'ceo-chief-of-staff', NULL, 'pending', 'medium',
   '{"owner":"founder","evidence_required":"#80 closed; #83 docs-only; #79 dispositioned","risk":"low","founder_approval":true,"source":"audit Top-10 #5"}'::jsonb),

  ('Apply certificates migration (#49) + verify',
   'Issuance/verification schema sits in unmerged #49; apply migration by hand, run its verification block.',
   'ceo-chief-of-staff', NULL, 'pending', 'high',
   '{"owner":"founder","evidence_required":"migration applied; verify_certificate returns valid","risk":"medium","founder_approval":true,"source":"audit Top-10 #6"}'::jsonb),

  ('Repoint 3 legacy logo refs to official vault',
   'CTA.tsx:6, CreedAcknowledgmentGate.tsx:160, FounderWelcome.tsx:74 reference /brand/aladiah-mark.svg; repoint to /brand/official/official-mark.svg.',
   'ceo-chief-of-staff', 'product-builder', 'pending', 'low',
   '{"owner":"claude","evidence_required":"0 refs to /brand/aladiah-mark.svg; build green","risk":"low","founder_approval":false,"source":"audit Top-10 #7"}'::jsonb),

  ('Verify mobile on device; refresh/merge #16',
   'Header/HomepageBot have 0 responsive prefixes; mobile-fix #16 unmerged. Verify at 375px.',
   'ceo-chief-of-staff', 'product-builder', 'pending', 'low',
   '{"owner":"founder+claude","evidence_required":"375px screenshots; #16 merged","risk":"low","founder_approval":true,"source":"audit Top-10 #8"}'::jsonb),

  ('Stand up minimal CI (lint+build) + Playwright smoke',
   '.github/workflows is empty and there is no test runner. Add CI + 1 smoke test on payment/auth.',
   'ceo-chief-of-staff', 'qa-authority', 'pending', 'medium',
   '{"owner":"claude","evidence_required":"workflow runs; 1 green smoke test","risk":"medium","founder_approval":true,"source":"audit Top-10 #9"}'::jsonb),

  ('Install founder analytics RPCs (revenue/admissions/marketing)',
   'Truth dashboards render honest not-installed states; apply the founder_*_stats RPC migrations so they measure.',
   'ceo-chief-of-staff', 'analytics-intelligence', 'pending', 'medium',
   '{"owner":"founder","evidence_required":"RPCs exist; dashboards show real counts","risk":"low","founder_approval":true,"source":"audit Top-10 #10"}'::jsonb);

-- 2) VERIFICATION (run after the INSERT; success = these rows come back) ---------
-- SELECT priority, status, assigned_agent, title
-- FROM public.aos_tasks
-- WHERE payload->>'source' LIKE 'audit Top-10%'
-- ORDER BY array_position(ARRAY['critical','high','medium','low'], priority), title;


-- =============================================================================
-- Execution Script #1 — Payments deploy + runbook tasks (Section E, rev. 2)
-- =============================================================================
-- Decomposes the audit Top-10 #1 (deploy payment fns) into the assigned execution
-- tasks for the payments + Founder Validation Runbook phase. Same canon as above:
-- Claude Code does NOT auto-apply SQL; paste into the Supabase SQL editor by hand.
-- Columns verified against migration 20260610130000_agent_operating_system.sql
-- :119-136 — none invented. Ordering is expressed via payload.after (not UUIDs).
-- =============================================================================

-- 3) PASTE-READY SEED (exec-01) -------------------------------------------------
INSERT INTO public.aos_tasks
  (title, description, created_by_agent, assigned_agent, status, priority, payload)
VALUES
  ('Set STRIPE_* secrets, deploy payment fns, register Stripe webhook',
   'supabase secrets set STRIPE_SECRET_KEY/STRIPE_PRICE_ACCELERATOR/STRIPE_WEBHOOK_SECRET; supabase secrets list; supabase functions list; deploy create-checkout + handle-payment-webhook; register Stripe endpoint .../functions/v1/handle-payment-webhook; verify versions bumped.',
   'ceo-chief-of-staff', 'operations-platform', 'ready', 'critical',
   '{"owner":"founder","evidence_required":"terminal capture of supabase secrets list showing STRIPE_SECRET_KEY, STRIPE_PRICE_ACCELERATOR, STRIPE_WEBHOOK_SECRET present; supabase functions list showing higher versions than baseline; Stripe test webhook delivery shows 2xx","risk":"medium","founder_approval":true,"source":"exec-01 #1"}'::jsonb),

  ('Validate Accelerator price alignment (frontend == STRIPE_PRICE_ACCELERATOR)',
   'Confirm the price the frontend sends (VITE_STRIPE_PRICE_ACCELERATOR, else hardcoded fallback price_1TW7U21wgazWak4Atj7TblB3) equals the server STRIPE_PRICE_ACCELERATOR and both resolve to the live $99.99 Stripe price. See Price Alignment Check (exec-01).',
   'ceo-chief-of-staff', 'operations-platform', 'ready', 'critical',
   '{"owner":"founder+claude","evidence_required":"a real checkout returns a session url (HTTP 200), NOT 500 Unknown priceId","risk":"high","founder_approval":true,"source":"exec-01 #2"}'::jsonb),

  ('Apply founder_revenue_stats RPC + verify RevenueTruth installed',
   'Apply supabase/migrations/20260619070000_founder_revenue_stats.sql by hand; run its verification; reload /founder/revenue.',
   'ceo-chief-of-staff', 'operations-platform', 'pending', 'high',
   '{"owner":"founder","evidence_required":"RPC resolves; RevenueTruth shows live subscription counts (no not-installed banner)","risk":"low","founder_approval":true,"note":"migration is independent of function deploy — apply in parallel; meaningful active>0 proof only after Scenario A (exec-01 #4)","source":"exec-01 #3"}'::jsonb),

  ('Scenario A: verify t2 grant after successful test payment',
   'Walk happy path; confirm subscriptions row {tier:t2,status:active} + profiles.tier=t2 + paid modules unlock.',
   'ceo-chief-of-staff', 'product-builder', 'pending', 'high',
   '{"owner":"founder+claude","evidence_required":"subscriptions+profiles rows queried; unlocked-content screenshot","risk":"low","founder_approval":true,"after":"exec-01 #1,#2","source":"exec-01 #4"}'::jsonb),

  ('Walk Founder Validation Runbook Scenarios A/B/C; record pass/fail',
   'QA gate: execute happy path, declined/canceled, and forged-webhook scenarios; produce a pass/fail table with evidence.',
   'ceo-chief-of-staff', 'qa-authority', 'pending', 'high',
   '{"owner":"founder+claude","evidence_required":"completed 3-scenario results table + screenshots/log excerpts","risk":"low","founder_approval":true,"after":"exec-01 #1,#2","source":"exec-01 #5"}'::jsonb),

  ('Security: invalid/forged/missing-sig webhook returns 400, zero writes',
   'POST to handle-payment-webhook with (a) no stripe-signature, (b) bad signature, (c) forged metadata.tier; confirm HTTP 400 and no subscriptions row created.',
   'ceo-chief-of-staff', 'qa-authority', 'pending', 'high',
   '{"owner":"founder+claude","evidence_required":"curl -i shows 400 for all 3; subscriptions row count unchanged before/after","risk":"low","founder_approval":true,"after":"exec-01 #1","source":"exec-01 #6"}'::jsonb);

-- 4) VERIFICATION (exec-01; run after the INSERT; success = these 6 rows return) -
-- SELECT array_position(ARRAY['critical','high','medium','low'], priority) AS rank,
--        priority, status, assigned_agent, title
-- FROM public.aos_tasks
-- WHERE payload->>'source' LIKE 'exec-01%'
-- ORDER BY rank, title;
