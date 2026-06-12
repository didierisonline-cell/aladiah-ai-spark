-- =============================================================================
-- Readiness view v3 — adds labs, AI co-pilot challenges, executive simulations,
-- employer validation. Authored counts drive completion; published counts gate
-- launch. New launch rule requires: lessons, quizzes, simulations, labs,
-- portfolios, interview prep, AI co-pilot challenges, executive simulations,
-- capstone. Drops first (column-set change), then recreates.
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
    -- authored counts (all rows)
    (SELECT count(*) FROM public.program_simulations s WHERE s.course_id = c.id) AS simulations,
    (SELECT count(*) FROM public.program_labs l WHERE l.course_id = c.id) AS labs,
    (SELECT count(*) FROM public.program_portfolios p WHERE p.course_id = c.id) AS portfolios,
    (SELECT count(*) FROM public.program_interview_prep i WHERE i.course_id = c.id) AS interview_prep,
    (SELECT count(*) FROM public.program_ai_mentor_prompts m WHERE m.course_id = c.id) AS ai_mentor_prompts,
    (SELECT count(*) FROM public.program_ai_copilot_challenges cp WHERE cp.course_id = c.id) AS copilot_challenges,
    (SELECT count(*) FROM public.program_executive_simulations e WHERE e.course_id = c.id) AS executive_simulations,
    (SELECT count(*) FROM public.program_employer_validation ev WHERE ev.course_id = c.id) AS employer_validation,
    (SELECT count(*) FROM public.program_capstones cap WHERE cap.course_id = c.id) AS capstones,
    (SELECT count(*) FROM public.program_certifications cert WHERE cert.course_id = c.id) AS certifications,
    -- published counts (internal → launch gate)
    (SELECT count(*) FROM public.program_simulations s WHERE s.course_id = c.id AND s.is_published) AS sim_pub,
    (SELECT count(*) FROM public.program_labs l WHERE l.course_id = c.id AND l.is_published) AS labs_pub,
    (SELECT count(*) FROM public.program_portfolios p WHERE p.course_id = c.id AND p.is_published) AS port_pub,
    (SELECT count(*) FROM public.program_interview_prep i WHERE i.course_id = c.id AND i.is_published) AS iv_pub,
    (SELECT count(*) FROM public.program_ai_copilot_challenges cp WHERE cp.course_id = c.id AND cp.is_published) AS cop_pub,
    (SELECT count(*) FROM public.program_executive_simulations e WHERE e.course_id = c.id AND e.is_published) AS exec_pub,
    (SELECT count(*) FROM public.program_capstones cap WHERE cap.course_id = c.id AND cap.is_published) AS cap_pub
  FROM public.courses c
  WHERE c.is_published = true OR COALESCE(c.is_flagship, false) = true
),
scored AS (
  SELECT base.*,
    round(100 * (
      0.08 * least(modules / 18.0, 1) +
      0.14 * least(lessons / 162.0, 1) +
      0.08 * least(quizzes / 18.0, 1) +
      0.12 * least(simulations / 54.0, 1) +
      0.08 * least(labs / 18.0, 1) +
      0.08 * least(portfolios / 18.0, 1) +
      0.06 * least(interview_prep / 18.0, 1) +
      0.03 * least(ai_mentor_prompts / 18.0, 1) +
      0.10 * least(copilot_challenges / 18.0, 1) +
      0.08 * least(executive_simulations / 6.0, 1) +
      0.03 * least(employer_validation / 3.0, 1) +
      0.08 * least(capstones / 1.0, 1) +
      0.04 * least(certifications / 1.0, 1)
    ))::int AS readiness_score
  FROM base
)
SELECT
  course_id, program, modules, lessons, quizzes,
  simulations, labs, portfolios, interview_prep, ai_mentor_prompts,
  copilot_challenges, executive_simulations, employer_validation,
  capstones, certifications, readiness_score,
  (
    readiness_score >= 90
    AND lessons > 0 AND quizzes > 0
    AND sim_pub > 0 AND labs_pub > 0 AND port_pub > 0 AND iv_pub > 0
    AND cop_pub > 0 AND exec_pub > 0 AND cap_pub > 0
  ) AS launch_ready
FROM scored;

-- VERIFICATION:
-- SELECT program, simulations, labs, copilot_challenges, executive_simulations,
--        employer_validation, capstones, readiness_score, launch_ready
-- FROM public.program_content_readiness ORDER BY readiness_score DESC;
