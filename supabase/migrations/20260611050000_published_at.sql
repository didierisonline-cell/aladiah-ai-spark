-- =============================================================================
-- published_at — records when each curriculum asset went live. Set by the
-- single publish path and by the new bulk Publish action.
-- Apply BY HAND in the Supabase SQL editor.
-- =============================================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'program_simulations','program_portfolios','program_interview_prep',
    'program_ai_mentor_prompts','program_capstones','program_certifications'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS published_at timestamptz;', t);
  END LOOP;
END $$;

-- VERIFICATION:
-- SELECT count(*) FILTER (WHERE published_at IS NOT NULL) AS published
-- FROM public.program_simulations;
