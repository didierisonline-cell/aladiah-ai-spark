-- =============================================================================
-- Global Language Adaptation Agent — translation memory, language quality, and
-- the student-sourced language-memory pipeline (Basaa first).
-- =============================================================================
-- Eleven tables + one SECURITY DEFINER logging RPC. Six "language_*" tables are
-- the shared, language-agnostic layer; five "basaa_*" tables are the Basaa
-- extension enriched by src/agents/african-languages/basaa/.
--
-- GOVERNANCE (canon): every student-sourced entry carries a review status
--   unreviewed -> ai_reviewed -> human_reviewed -> approved | rejected.
-- Only 'approved' rows become official vocabulary. Students may INSERT their own
-- submissions and SELECT *approved* vocabulary; ONLY founders/admins approve.
-- Students never write directly to the registry — missing translations are
-- logged through the SECURITY DEFINER RPC public.log_missing_translation().
--
-- AUTH: admin-scoped via public.aos_is_admin() (20260610110000). Founders get
-- SELECT/INSERT/UPDATE (never DELETE — the language record is append-only).
--
-- DELIVERY: reviewable file. Apply BY HAND in the Supabase SQL editor, then run
-- the verification SELECTs at the bottom. Written idempotently — safe to re-run.
-- Additive, NON-DESTRUCTIVE: no existing table/column is altered or dropped.
-- =============================================================================

-- Shared review-status guard (one definition, reused by every CHECK below).
-- unreviewed | ai_reviewed | human_reviewed | approved | rejected

-- -----------------------------------------------------------------------------
-- 1) language_translation_memory — the shared translation memory (TM).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.language_translation_memory (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_lang  TEXT NOT NULL DEFAULT 'en',
  target_lang  TEXT NOT NULL,
  string_key   TEXT,                       -- i18n key when it maps to one
  surface      TEXT NOT NULL DEFAULT 'other',
  source_text  TEXT NOT NULL,
  target_text  TEXT NOT NULL,
  context      JSONB NOT NULL DEFAULT '{}'::jsonb,
  quality      NUMERIC(4,3) DEFAULT 0.000, -- 0..1 confidence/quality
  origin       TEXT NOT NULL DEFAULT 'human', -- human | ai | student_approved | import
  created_by   UUID,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ltm_target_lang_idx ON public.language_translation_memory (target_lang);
CREATE UNIQUE INDEX IF NOT EXISTS ltm_key_unique
  ON public.language_translation_memory (target_lang, string_key, surface)
  WHERE string_key IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 2) language_vocabulary_entries — official, per-language vocabulary.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.language_vocabulary_entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language      TEXT NOT NULL,
  term          TEXT NOT NULL,
  translation   TEXT,
  part_of_speech TEXT,
  definition    TEXT,
  example       TEXT,
  pronunciation TEXT,
  english_equiv TEXT,
  french_equiv  TEXT,
  domain        TEXT,                       -- e.g. 'scrum', 'tech', 'ui'
  status        TEXT NOT NULL DEFAULT 'unreviewed'
                CHECK (status IN ('unreviewed','ai_reviewed','human_reviewed','approved','rejected')),
  source_submission_id UUID,               -- promoted from a student submission
  approved_by   TEXT,
  approved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lve_lang_status_idx ON public.language_vocabulary_entries (language, status);

-- -----------------------------------------------------------------------------
-- 3) language_student_submissions — raw student-sourced language input.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.language_student_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL DEFAULT auth.uid(),
  language        TEXT NOT NULL,
  submission_type TEXT NOT NULL DEFAULT 'new_word'
                  CHECK (submission_type IN ('new_word','phrase','correction','pronunciation','sentence_pair')),
  term            TEXT NOT NULL,
  suggested_translation TEXT,
  english_equiv   TEXT,
  french_equiv    TEXT,
  pronunciation_notes TEXT,
  context         JSONB NOT NULL DEFAULT '{}'::jsonb, -- {course, lesson, concept, user_intent}
  confidence      NUMERIC(4,3) DEFAULT 0.000,
  status          TEXT NOT NULL DEFAULT 'unreviewed'
                  CHECK (status IN ('unreviewed','ai_reviewed','human_reviewed','approved','rejected')),
  review_notes    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lss_user_idx   ON public.language_student_submissions (user_id);
CREATE INDEX IF NOT EXISTS lss_status_idx ON public.language_student_submissions (language, status);

-- -----------------------------------------------------------------------------
-- 4) language_review_queue — items awaiting review (polymorphic reference).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.language_review_queue (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL                -- student_submission | vocabulary | translation | missing
              CHECK (entity_type IN ('student_submission','vocabulary','translation','missing')),
  entity_id   UUID NOT NULL,
  language    TEXT NOT NULL,
  priority    INTEGER NOT NULL DEFAULT 100, -- lower = sooner
  status      TEXT NOT NULL DEFAULT 'unreviewed'
              CHECK (status IN ('unreviewed','ai_reviewed','human_reviewed','approved','rejected')),
  assigned_to TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS lrq_status_idx ON public.language_review_queue (status, language, priority);

-- -----------------------------------------------------------------------------
-- 5) language_quality_scores — per-language coverage snapshots over time.
--    One row per (language, scan_date) — written by the scanner load step.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.language_quality_scores (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language           TEXT NOT NULL,
  scan_date          DATE NOT NULL DEFAULT current_date,
  coverage_percent   NUMERIC(5,2) NOT NULL DEFAULT 0,
  navigation_pct     NUMERIC(5,2),
  buttons_pct        NUMERIC(5,2),
  course_titles_pct  NUMERIC(5,2),
  lesson_titles_pct  NUMERIC(5,2),
  lesson_body_pct    NUMERIC(5,2),
  quiz_questions_pct NUMERIC(5,2),
  quiz_answers_pct   NUMERIC(5,2),
  feedback_pct       NUMERIC(5,2),
  diagrams_pct       NUMERIC(5,2),
  missing_strings    INTEGER NOT NULL DEFAULT 0,
  missing_lessons    INTEGER NOT NULL DEFAULT 0,
  missing_quizzes    INTEGER NOT NULL DEFAULT 0,
  missing_diagrams   INTEGER NOT NULL DEFAULT 0,
  is_active          BOOLEAN NOT NULL DEFAULT false, -- 100% across all dimensions?
  raw                JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS lqs_lang_date_unique ON public.language_quality_scores (language, scan_date);

-- -----------------------------------------------------------------------------
-- 6) language_missing_translations — the live missing-translation registry.
--    Auto-populated from student sessions via log_missing_translation().
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.language_missing_translations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language      TEXT NOT NULL,
  string_key    TEXT NOT NULL,
  surface       TEXT NOT NULL DEFAULT 'other',
  source_text   TEXT,
  context       JSONB NOT NULL DEFAULT '{}'::jsonb,
  miss_count    INTEGER NOT NULL DEFAULT 1,
  resolved      BOOLEAN NOT NULL DEFAULT false,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at   TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS lmt_unique ON public.language_missing_translations (language, string_key, surface);
CREATE INDEX IF NOT EXISTS lmt_lang_resolved_idx ON public.language_missing_translations (language, resolved);

-- =============================================================================
-- Basaa extension (enriched by src/agents/african-languages/basaa/)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.basaa_dictionary_entries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headword       TEXT NOT NULL,
  translation_en TEXT,
  translation_fr TEXT,
  part_of_speech TEXT,
  pronunciation  TEXT,           -- IPA / phonetic notes
  examples       JSONB NOT NULL DEFAULT '[]'::jsonb,
  status         TEXT NOT NULL DEFAULT 'unreviewed'
                 CHECK (status IN ('unreviewed','ai_reviewed','human_reviewed','approved','rejected')),
  source         TEXT NOT NULL DEFAULT 'student', -- student | curator | import
  source_submission_id UUID,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bde_status_idx ON public.basaa_dictionary_entries (status);

CREATE TABLE IF NOT EXISTS public.basaa_sentence_pairs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  basaa_text   TEXT NOT NULL,
  english_text TEXT,
  french_text  TEXT,
  domain       TEXT,
  context      JSONB NOT NULL DEFAULT '{}'::jsonb,
  status       TEXT NOT NULL DEFAULT 'unreviewed'
               CHECK (status IN ('unreviewed','ai_reviewed','human_reviewed','approved','rejected')),
  source       TEXT NOT NULL DEFAULT 'student',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bsp_status_idx ON public.basaa_sentence_pairs (status);

CREATE TABLE IF NOT EXISTS public.basaa_tech_terms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_en     TEXT NOT NULL,
  term_basaa  TEXT,
  definition  TEXT,
  domain      TEXT NOT NULL DEFAULT 'scrum',
  status      TEXT NOT NULL DEFAULT 'unreviewed'
              CHECK (status IN ('unreviewed','ai_reviewed','human_reviewed','approved','rejected')),
  source      TEXT NOT NULL DEFAULT 'student',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS btt_status_idx ON public.basaa_tech_terms (status);

CREATE TABLE IF NOT EXISTS public.basaa_translation_memory (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_lang TEXT NOT NULL DEFAULT 'en',
  target_lang TEXT NOT NULL DEFAULT 'bas',
  source_text TEXT NOT NULL,
  target_text TEXT NOT NULL,
  surface     TEXT NOT NULL DEFAULT 'other',
  quality     NUMERIC(4,3) DEFAULT 0.000,
  status      TEXT NOT NULL DEFAULT 'unreviewed'
              CHECK (status IN ('unreviewed','ai_reviewed','human_reviewed','approved','rejected')),
  source      TEXT NOT NULL DEFAULT 'student',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS btm_status_idx ON public.basaa_translation_memory (status);

CREATE TABLE IF NOT EXISTS public.basaa_quality_reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,   -- dictionary | sentence_pair | tech_term | translation
  entity_id   UUID NOT NULL,
  reviewer    TEXT,            -- email or 'ai'
  review_stage TEXT NOT NULL DEFAULT 'ai_reviewed'
               CHECK (review_stage IN ('ai_reviewed','human_reviewed')),
  verdict     TEXT NOT NULL DEFAULT 'pending'
               CHECK (verdict IN ('pending','approved','rejected')),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bqr_entity_idx ON public.basaa_quality_reviews (entity_type, entity_id);

-- =============================================================================
-- Row Level Security
-- =============================================================================
ALTER TABLE public.language_translation_memory  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_vocabulary_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_review_queue        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_quality_scores      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_missing_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.basaa_dictionary_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.basaa_sentence_pairs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.basaa_tech_terms             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.basaa_translation_memory     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.basaa_quality_reviews        ENABLE ROW LEVEL SECURITY;

-- Founders/admins: full read/write (no DELETE policy ⇒ append-only) on EVERY table.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'language_translation_memory','language_vocabulary_entries','language_student_submissions',
    'language_review_queue','language_quality_scores','language_missing_translations',
    'basaa_dictionary_entries','basaa_sentence_pairs','basaa_tech_terms',
    'basaa_translation_memory','basaa_quality_reviews'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin read %1$s" ON public.%1$s', t);
    EXECUTE format('CREATE POLICY "admin read %1$s" ON public.%1$s FOR SELECT USING (public.aos_is_admin())', t);
    EXECUTE format('DROP POLICY IF EXISTS "admin write %1$s" ON public.%1$s', t);
    EXECUTE format('CREATE POLICY "admin write %1$s" ON public.%1$s FOR INSERT WITH CHECK (public.aos_is_admin())', t);
    EXECUTE format('DROP POLICY IF EXISTS "admin update %1$s" ON public.%1$s', t);
    EXECUTE format('CREATE POLICY "admin update %1$s" ON public.%1$s FOR UPDATE USING (public.aos_is_admin()) WITH CHECK (public.aos_is_admin())', t);
  END LOOP;
END $$;

-- Students: INSERT their own submissions, and SELECT their own back.
DROP POLICY IF EXISTS "student insert own submission" ON public.language_student_submissions;
CREATE POLICY "student insert own submission" ON public.language_student_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "student read own submission" ON public.language_student_submissions;
CREATE POLICY "student read own submission" ON public.language_student_submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Students: SELECT *approved* official vocabulary (so the app can render it).
DROP POLICY IF EXISTS "read approved vocabulary" ON public.language_vocabulary_entries;
CREATE POLICY "read approved vocabulary" ON public.language_vocabulary_entries
  FOR SELECT USING (status = 'approved');

-- Students: SELECT *approved* Basaa knowledge (dictionary / tech terms / sentences / TM).
DROP POLICY IF EXISTS "read approved basaa dict" ON public.basaa_dictionary_entries;
CREATE POLICY "read approved basaa dict" ON public.basaa_dictionary_entries
  FOR SELECT USING (status = 'approved');
DROP POLICY IF EXISTS "read approved basaa terms" ON public.basaa_tech_terms;
CREATE POLICY "read approved basaa terms" ON public.basaa_tech_terms
  FOR SELECT USING (status = 'approved');
DROP POLICY IF EXISTS "read approved basaa sentences" ON public.basaa_sentence_pairs;
CREATE POLICY "read approved basaa sentences" ON public.basaa_sentence_pairs
  FOR SELECT USING (status = 'approved');
DROP POLICY IF EXISTS "read approved basaa tm" ON public.basaa_translation_memory;
CREATE POLICY "read approved basaa tm" ON public.basaa_translation_memory
  FOR SELECT USING (status = 'approved');

-- Students: SELECT approved translation memory (so the app can render content).
DROP POLICY IF EXISTS "read approved tm" ON public.language_translation_memory;
CREATE POLICY "read approved tm" ON public.language_translation_memory
  FOR SELECT USING (origin IN ('human','student_approved','import'));

-- =============================================================================
-- log_missing_translation — SECURITY DEFINER so students can record a gap
-- WITHOUT any direct table write privilege. Dedupes on (language,string_key,
-- surface): bumps miss_count + last_seen_at instead of inserting duplicates.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.log_missing_translation(
  p_language    text,
  p_string_key  text,
  p_surface     text DEFAULT 'other',
  p_source_text text DEFAULT NULL,
  p_context     jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF p_language IS NULL OR p_string_key IS NULL THEN
    RETURN;
  END IF;
  INSERT INTO public.language_missing_translations
    (language, string_key, surface, source_text, context)
  VALUES (p_language, p_string_key, coalesce(p_surface,'other'), p_source_text, coalesce(p_context,'{}'::jsonb))
  ON CONFLICT (language, string_key, surface) DO UPDATE
    SET miss_count   = public.language_missing_translations.miss_count + 1,
        last_seen_at = now(),
        source_text  = coalesce(EXCLUDED.source_text, public.language_missing_translations.source_text);
END $$;

GRANT EXECUTE ON FUNCTION
  public.log_missing_translation(text, text, text, text, jsonb) TO authenticated;

-- =============================================================================
-- VERIFICATION (run after applying — "success" means it RAN, not that it's right)
-- =============================================================================
-- 1) All 11 tables exist:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema='public'
--   AND (table_name LIKE 'language\_%' OR table_name LIKE 'basaa\_%')
-- ORDER BY table_name;  -- expect 11 rows
--
-- 2) RLS enabled everywhere:
-- SELECT relname, relrowsecurity FROM pg_class
-- WHERE relname LIKE 'language\_%' OR relname LIKE 'basaa\_%';  -- all true
--
-- 3) The logging RPC works and dedupes:
-- SELECT public.log_missing_translation('bas','nav.home','navigation','Home');
-- SELECT public.log_missing_translation('bas','nav.home','navigation','Home');
-- SELECT language, string_key, miss_count FROM public.language_missing_translations
-- WHERE language='bas' AND string_key='nav.home';  -- expect miss_count = 2
--
-- 4) Governance: only 'approved' vocabulary is student-readable (run as a
--    non-admin session) — an 'unreviewed' row must NOT appear.
