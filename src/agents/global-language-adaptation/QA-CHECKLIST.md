# QA Checklist — Global Language Adaptation

Acceptance gates for this agent. Grouped by phase. ☐ = not started, ✅ = done this delivery.

## Phase 0 — Foundation (this delivery)
- ✅ Agent folder created under `/src/agents/global-language-adaptation/`.
- ✅ README documents mission, real i18n architecture, and measured problem baseline.
- ✅ Typed config (`global-language-config.ts`): languages, completeness rules, fallback, governance states.
- ✅ Surface registry catalogs every translatable surface + scan method.
- ✅ Scanner v0.1 is **runnable** (`node …/coverage-scanner.mjs`) and read-only.
- ✅ Baseline report committed (`scanner/reports/baseline-coverage.{md,json}`).
- ✅ Six table schemas + diagram-label schema authored.
- ✅ Database migration plan with reviewable, paste-ready SQL (human-applied).
- ✅ Basaa learning-memory workflow + governance state machine.
- ✅ Dashboard route plan (`/founder/language-quality`, founder-gated).
- ✅ Basaa Agent integration points documented.

## Phase 1 — Scanner correctness
- ☐ Re-run scanner; key counts match a manual spot-check of `LanguageContext.tsx`.
- ☐ Dangling-ref list (keys referenced but missing from `en`) triaged — each is a real gap or a false positive logged.
- ☐ Hardcoded-candidate list sampled; false-positive rate acceptable; ignore-list added.
- ☐ Scanner runs in CI without network access; exits non-zero if an "active" language regresses below 100%.

## Phase 1b — DB content scanner (this delivery)
- ✅ `db-coverage-scanner.mjs` runnable; scores courses/chapters/videos `translations`.
- ✅ Probes `quiz_questions` for a `translations` column (schema-pending handling).
- ✅ Measures English/French first, Basaa last (priority order).
- ✅ Reports `reachable:false` and fabricates no coverage when egress is blocked.
- ☐ Re-run where `*.supabase.co` egress is allowed; confirm real per-surface coverage.

## Phase 2 — Database
- ☐ Migration SQL reviewed by founder; no destructive changes.
- ☐ Tables created in Supabase; `select` confirms all 6 `language_*` tables exist.
- ☐ RLS verified: student cannot read others' submissions; only `approved` vocabulary is world-readable.
- ☐ `quiz_questions.translations` column added; `diagram_label_sets` table created.
- ☐ `src/integrations/supabase/types.ts` regenerated; app compiles.

## Phase 3 — Governance (safety-critical)
- ☐ Capture always writes `review_state='unreviewed'` — verified by test.
- ☐ No serving path returns a submission below `approved` — verified by test.
- ☐ AI review cannot self-approve (human required); AI may auto-reject spam/abuse.
- ☐ Rejected rows retained with notes (audit), never served.
- ☐ Approved Basaa entries normalized to AGLC orthography before promotion.

## Phase 4 — Student experience (fallback)
- ☐ Selecting Basaa attempts Basaa on menus, lessons, quizzes, feedback, tutor, diagrams.
- ☐ Missing Basaa string shows the graceful notice (FR → EN fallback chain).
- ☐ Every fallback logs/increments `language_missing_translations` (`source='runtime-fallback'`).
- ☐ No raw translation keys or blank UI ever shown to a student.

## Phase 5 — Diagrams
- ☐ Diagram labels externalized to `diagram_label_sets` (no hardcoded `<text>` for covered diagrams).
- ☐ Diagrams render in the active language or show translated captions.
- ☐ Scanner Phase-3 reports diagram label coverage per language.

## Phase 6 — Dashboard
- ☐ `/founder/language-quality` reachable only by founders; students redirected.
- ☐ All required columns render (coverage %, missing strings/lessons/quizzes/diagrams, pending/approved/rejected vocab, last scan).
- ☐ Submission review actions go through the governance pipeline (no direct publish).
- ☐ "Active" pill appears only when all activation-blocking surfaces are 100%.

## Definition of done for a language being marked "Active"
- ☐ navigation, buttons, course titles, lesson titles, lesson body, quiz questions, quiz
   answers, feedback = **100%**.
- ☐ diagrams = 100% (translated labels/assets or captions).
- ☐ scanner confirms 0 open `language_missing_translations` on blocking surfaces.
- ☐ Founder sign-off recorded.
