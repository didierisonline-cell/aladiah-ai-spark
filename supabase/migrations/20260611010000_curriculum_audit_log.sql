-- =============================================================================
-- Curriculum Audit Log — immutable trail of every content change.
-- Companion to 20260611000000_curriculum_content_architecture.sql.
-- Apply BY HAND in the Supabase SQL editor.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.curriculum_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type text NOT NULL,                 -- simulations | portfolios | interview | mentor | capstones | certifications
  asset_id uuid,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  action text NOT NULL,                     -- create | update | status:<x> | delete | publish | generate
  actor text,                               -- founder email / agent slug
  detail jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.curriculum_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin read audit" ON public.curriculum_audit_log;
CREATE POLICY "admin read audit" ON public.curriculum_audit_log FOR SELECT USING (public.aos_is_admin());
DROP POLICY IF EXISTS "admin write audit" ON public.curriculum_audit_log;
CREATE POLICY "admin write audit" ON public.curriculum_audit_log FOR INSERT WITH CHECK (public.aos_is_admin());

CREATE INDEX IF NOT EXISTS idx_curriculum_audit_course ON public.curriculum_audit_log(course_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_audit_created ON public.curriculum_audit_log(created_at DESC);

-- VERIFICATION:
-- SELECT created_at, actor, action, asset_type FROM public.curriculum_audit_log ORDER BY created_at DESC LIMIT 20;
