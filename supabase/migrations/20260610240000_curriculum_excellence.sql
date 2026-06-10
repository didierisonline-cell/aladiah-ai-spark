-- =============================================================================
-- Aladiah Curriculum Excellence Initiative — schema
-- =============================================================================
-- Phase 2. NOT a generic content agent — the system that makes every Aladiah
-- program world-class (Course Completion → Career Transformation). Pilot:
-- AI Scrum Master Professional Certification, redesigned to 18 modules.
--
-- It AUDITS the current program against the Curriculum Excellence Framework,
-- produces a gap report, holds the new 18-module blueprint, and DELEGATES module
-- builds to the Product Builder (QA-gated → founder approval → Student Success /
-- Placement consume the outcomes). It does not modify production curriculum.
--
--   curriculum_audits — audit + gap reports per program
--
-- Admin-scoped via public.aos_is_admin(). Idempotent; apply by hand.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;

CREATE TABLE IF NOT EXISTS public.curriculum_audits (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program        TEXT NOT NULL DEFAULT 'ai-scrum-master',
  report_date    DATE NOT NULL DEFAULT current_date,
  target_modules INTEGER DEFAULT 18,
  excellence_score INTEGER DEFAULT 0,                    -- 0-100 vs the framework
  present_count  INTEGER DEFAULT 0,
  gap_count      INTEGER DEFAULT 0,
  gaps           JSONB NOT NULL DEFAULT '[]'::jsonb,      -- per-module gaps
  summary        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_curriculum_audits_key ON public.curriculum_audits (program, report_date);

ALTER TABLE public.curriculum_audits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read curriculum_audits" ON public.curriculum_audits;
CREATE POLICY "Admins read curriculum_audits" ON public.curriculum_audits FOR SELECT USING (public.aos_is_admin());
DROP POLICY IF EXISTS "Admins insert curriculum_audits" ON public.curriculum_audits;
CREATE POLICY "Admins insert curriculum_audits" ON public.curriculum_audits FOR INSERT WITH CHECK (public.aos_is_admin());
DROP POLICY IF EXISTS "Admins update curriculum_audits" ON public.curriculum_audits;
CREATE POLICY "Admins update curriculum_audits" ON public.curriculum_audits FOR UPDATE USING (public.aos_is_admin());

INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'curriculum-excellence',
  'Curriculum Excellence Authority',
  'Makes every Aladiah program world-class (course completion → career transformation)',
  'Owns the Curriculum Excellence Framework. Audits programs against world-class standards, produces gap reports, holds the redesigned 18-module blueprint, and delegates module builds to the Product Builder (QA-gated → founder approval → Student Success / Placement consume outcomes). Pilot: AI Scrum Master Professional Certification. Does not modify production curriculum.',
  'active',
  18,
  'weekly',
  '{"read":true,"write":false,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- VERIFY: SELECT slug FROM public.aos_agents WHERE slug='curriculum-excellence';
