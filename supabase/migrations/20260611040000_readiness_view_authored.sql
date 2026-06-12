-- =============================================================================
-- Readiness view (SAFE rebuild) — authored counts for completion; published
-- counts used INTERNALLY only for launch_ready. Drops first to allow the
-- column-set change, then recreates with the original column order.
-- Fixes: "cannot change name of view column" on CREATE OR REPLACE.
-- Apply BY HAND in the Supabase SQL editor.
-- =============================================================================
DROP VIEW IF EXISTS public.program_content_readiness CASCADE;

CREATE VIEW public.program_content_readiness
WITH (security_invoker = true) AS
WITH base AS (
  SELECT
    c.id AS course_id,
    c.title AS program,
    (SELECT count(*) FROM public.chapters ch WHERE ch.course_id = c.id) AS modules,
    (SELECT count(*) FROM public.videos v JOIN public.chapters ch ON ch.id = v.chapter_id WHERE ch.course_id = c.id) AS lessons,
    (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id = q.chapter_id WHERE ch.course_id = c.id AND q.quiz_type = 'chapter_end') AS quizzes,
    -- AUTHORED counts (all rows) → drive completion / readiness
    (SELECT count(*) FROM public.program_simulations s WHERE s.course_id = c.id) AS simulations,
    (SELECT count(*) FROM public.program_portfolios p WHERE p.course_id = c.id) AS portfolios,
    (SELECT count(*) FROM public.program_interview_prep i WHERE i.course_id = c.id) AS interview_prep,
    (SELECT count(*) FROM public.program_ai_mentor_prompts m WHERE m.course_id = c.id) AS ai_mentor_prompts,
    (SELECT count(*) FROM public.program_capstones cap WHERE cap.course_id = c.id) AS capstones,
    (SELECT count(*) FROM public.program_certifications cert WHERE cert.course_id = c.id) AS certifications,
    -- PUBLISHED counts (internal only) → drive launch_ready
    (SELECT count(*) FROM public.program_simulations s WHERE s.course_id = c.id AND s.is_published) AS sim_pub,
    (SELECT count(*) FROM public.program_portfolios p WHERE p.course_id = c.id AND p.is_published) AS port_pub,
    (SELECT count(*) FROM public.program_interview_prep i WHERE i.course_id = c.id AND i.is_published) AS iv_pub,
    (SELECT count(*) FROM public.program_ai_mentor_prompts m WHERE m.course_id = c.id AND m.is_published) AS men_pub,
    (SELECT count(*) FROM public.program_capstones cap WHERE cap.course_id = c.id AND cap.is_published) AS cap_pub,
    (SELECT count(*) FROM public.program_certifications cert WHERE cert.course_id = c.id AND cert.is_published) AS cert_pub
  FROM public.courses c
  WHERE c.is_published = true OR COALESCE(c.is_flagship, false) = true
),
scored AS (
  SELECT base.*,
    round(100 * (
      0.12 * least(modules / 18.0, 1) +
      0.18 * least(lessons / 162.0, 1) +
      0.12 * least(quizzes / 18.0, 1) +
      0.18 * least(simulations / 54.0, 1) +
      0.12 * least(portfolios / 18.0, 1) +
      0.08 * least(interview_prep / 18.0, 1) +
      0.05 * least(ai_mentor_prompts / 18.0, 1) +
      0.08 * least(capstones / 1.0, 1) +
      0.07 * least(certifications / 1.0, 1)
    ))::int AS readiness_score
  FROM base
)
SELECT
  course_id,
  program,
  modules,
  lessons,
  quizzes,
  simulations,
  portfolios,
  interview_prep,
  ai_mentor_prompts,
  capstones,
  certifications,
  readiness_score,
  (
    readiness_score >= 90
    AND lessons > 0 AND quizzes > 0
    AND sim_pub > 0 AND port_pub > 0 AND iv_pub > 0
    AND men_pub > 0 AND cap_pub > 0 AND cert_pub > 0
  ) AS launch_ready
FROM scored;

-- VERIFICATION:
-- SELECT program, modules, lessons, quizzes, simulations, portfolios, interview_prep,
--        ai_mentor_prompts, capstones, certifications, readiness_score, launch_ready
-- FROM public.program_content_readiness ORDER BY readiness_score DESC;
