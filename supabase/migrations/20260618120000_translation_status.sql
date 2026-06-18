-- ============================================================================
-- Aladiah — Localization OS: translation_status infrastructure
-- ============================================================================
-- Canon: reviewable file + paste-ready block. A human applies this in Supabase.
-- Claude Code does NOT auto-apply SQL. "Success / no rows" means it RAN, not that
-- it was correct — the verification SELECT at the bottom must be run after.
--
-- WHY: turns translation from a one-off feature into an infrastructure layer.
-- Every translatable content object gains a per-language status map so the
-- Localization Director (scripts/localization-director.mjs) can continuously
-- populate, audit, and verify — and so new content/languages slot in without
-- manual bookkeeping. Render code is unaffected (it reads translations[lang]
-- with English fallback); status drives the PIPELINE, not the UI.
--
--   translation_status shape:  { "en":"complete", "fr":"complete", "de":"pending",
--                                "zh":"pending", "ar":"needs_review", ... }
--   values: complete | pending | needs_review
--
-- Additive and idempotent (IF NOT EXISTS). Safe to run on a DB that may or may
-- not already have the `translations` column from earlier flagship migrations.
-- ============================================================================

-- ── COURSES ──────────────────────────────────────────────────────────────────
ALTER TABLE courses ADD COLUMN IF NOT EXISTS translations        JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS translation_status  JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS base_language       TEXT  NOT NULL DEFAULT 'en';

-- ── CHAPTERS (modules) ───────────────────────────────────────────────────────
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS translations       JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS translation_status JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS base_language      TEXT  NOT NULL DEFAULT 'en';

-- ── VIDEOS (lessons: title, body, transcript) ────────────────────────────────
ALTER TABLE videos ADD COLUMN IF NOT EXISTS translations         JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS translation_status   JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS base_language        TEXT  NOT NULL DEFAULT 'en';

-- ── QUIZ QUESTIONS (question_text, options, explanation) ─────────────────────
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS translations       JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS translation_status JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS base_language      TEXT  NOT NULL DEFAULT 'en';

-- Seed base_language status = complete for English source rows (idempotent):
-- marks EN authoritative so the Director never tries to "translate" the source.
UPDATE courses        SET translation_status = jsonb_set(translation_status, '{en}', '"complete"', true) WHERE NOT (translation_status ? 'en');
UPDATE chapters       SET translation_status = jsonb_set(translation_status, '{en}', '"complete"', true) WHERE NOT (translation_status ? 'en');
UPDATE videos         SET translation_status = jsonb_set(translation_status, '{en}', '"complete"', true) WHERE NOT (translation_status ? 'en');
UPDATE quiz_questions SET translation_status = jsonb_set(translation_status, '{en}', '"complete"', true) WHERE NOT (translation_status ? 'en');

-- ── VERIFICATION (run after; confirms structure, not just "no error") ────────
-- Expect: every table lists translations / translation_status / base_language.
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('courses','chapters','videos','quiz_questions')
  AND column_name IN ('translations','translation_status','base_language')
ORDER BY table_name, column_name;

-- Per-language completion snapshot for published courses (sanity check):
WITH langs(l) AS (VALUES ('en'),('es'),('fr'),('pt'),('de'),('ar'),('zh'),('hi'))
SELECT l.l AS lang,
       count(*) FILTER (WHERE c.translation_status ->> l.l = 'complete')     AS complete,
       count(*) FILTER (WHERE c.translation_status ->> l.l = 'pending')      AS pending,
       count(*) FILTER (WHERE c.translation_status ->> l.l = 'needs_review') AS needs_review,
       count(*)                                                              AS total
FROM courses c CROSS JOIN langs l
WHERE c.is_published
GROUP BY l.l ORDER BY l.l;
