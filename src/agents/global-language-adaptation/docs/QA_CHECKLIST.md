# QA Checklist — Global Language Adaptation Agent

Run before considering any language "active" and before each release that
touches localization.

## A. Scanner

- [ ] `npx tsx src/agents/global-language-adaptation/scanner/run.ts` runs clean.
- [ ] `language-reports/coverage.json` has one entry per supported language.
- [ ] English shows 100% coverage (sanity: canonical = itself).
- [ ] `missing-translations.json` is non-empty where coverage < 100%.
- [ ] `hardcoded.json` findings reviewed; true positives ticketed.

## B. Database migration (applied BY HAND in Supabase)

- [ ] All 11 tables exist (verification SELECT #1).
- [ ] RLS enabled on all 11 (verification SELECT #2).
- [ ] `log_missing_translation` dedupes — `miss_count` increments (SELECT #3).
- [ ] Non-admin session sees only `approved` vocabulary (SELECT #4).
- [ ] Non-admin session **cannot** UPDATE any `status` column.
- [ ] Non-admin session can INSERT its own `language_student_submissions` row,
      and **cannot** insert one with another user's `user_id`.

## C. Completeness rules (per language)

A language is "active" ONLY when each is 100%:

- [ ] navigation
- [ ] buttons
- [ ] course titles
- [ ] lesson titles
- [ ] lesson body
- [ ] quiz questions
- [ ] quiz answers
- [ ] feedback messages
- [ ] diagrams (translated OR replaced with translated SVG/image asset)

`runtime/completeness.ts → evaluateCompleteness()` must return `isActive:true`.

## D. Student experience / fallback

- [ ] Selecting a language with gaps shows the fallback notice, not blank UI.
- [ ] Fallback order is active → French → English → key.
- [ ] Each fallback fires `log_missing_translation` exactly once per unique
      (language, key, surface); repeats only bump `miss_count`.
- [ ] No console errors when the language tables are absent (pre-migration).

## E. Basaa learning memory

- [ ] `captureBasaaInput` writes `status='unreviewed'`, `language='bas'`.
- [ ] Submission is NOT visible to students as official vocabulary until
      `approved`.
- [ ] AI review can reach `ai_reviewed` but cannot set `approved`.
- [ ] Only `aos_is_admin()` can set `approved` / `rejected`.
- [ ] Approving a submission promotes it into the correct `basaa_*` table and
      records a `basaa_quality_reviews` row.

## F. Founder dashboard (`/founder/language-quality`)

- [ ] Route is founder-gated (non-founder is redirected/blocked).
- [ ] Shows all required columns (coverage %, missing strings/lessons/quizzes/
      diagrams, pending/approved/rejected vocab, last scan date, active badge).
- [ ] Renders a calm empty-state before the migration is applied (no crash).
- [ ] Appears in the shared founder nav.

## G. Canon compliance

- [ ] No SQL auto-applied; migration delivered as a reviewable file.
- [ ] No `.env` / live-DB writes performed by Claude Code.
- [ ] Translated quizzes preserve each question's single Axis-1 competency slug
      (COMPETENCY_TAXONOMY.md) — wording changes, competency tag does not.
- [ ] Change is additive/non-destructive; `vite build` passes.
