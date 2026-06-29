-- ═══════════════════════════════════════════════════════════════
-- Seed: DA program_simulations
-- AI Data Analyst & Decision Intelligence Professional
-- 100 simulations — 10 modules × 10 sims each
--
-- PASTE-READY — apply in Supabase SQL Editor
-- Verify after: SELECT COUNT(*) FROM public.program_simulations WHERE course_id = (SELECT id FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional');
-- Expected: 100
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_course_id uuid;

  -- Sim module → chapter_id mapping (one representative chapter per sim module)
  v_chapters uuid[] := ARRAY[
    '112b2828-957f-4a05-bb92-fc1fe435cbe2'::uuid,  -- M1: Introduction to Data Analysis
    '9efe1bdb-dd9d-46c1-ad33-310b780ebf2c'::uuid,  -- M2: Data Structures & Schemas
    'd5e96737-cdf7-4f01-9049-61586b683092'::uuid,  -- M3: Descriptive Statistics
    'f432124d-4761-4093-a5bc-a1d114e28d5b'::uuid,  -- M4: Data Visualization Principles
    '1aa61d1e-9d8d-49fe-8ce4-b1a755a4580e'::uuid,  -- M5: Power BI & Dashboards
    '6ea595ab-1a81-434a-b4b1-d9c23a47d8ee'::uuid,  -- M6: Forecasting & Time Series
    'acea5f86-612d-444d-a231-c569c789cfcb'::uuid,  -- M7: Predictive Analytics
    'c12b1c97-3eb7-4f18-857c-0c37748f9807'::uuid,  -- M8: Machine Learning for Analysts
    'fd01cf30-9361-4fbd-a1b6-e277d2635e5c'::uuid,  -- M9: Data Storytelling
    'e5e034d9-4417-47d4-be24-adc345affda5'::uuid   -- M10: Data Governance & Capstone
  ];

  v_themes text[] := ARRAY[
    'Data Foundations & SQL Mastery',
    'Data Engineering & Schema Design',
    'Statistical Analysis & Probability',
    'Data Visualization & Storytelling',
    'Business Intelligence & Dashboards',
    'Forecasting & Time Series Analysis',
    'Predictive Analytics & Regression',
    'Machine Learning for Analysts',
    'Data Storytelling & Executive Communication',
    'Data Strategy, Governance & Capstone'
  ];

  v_industries text[] := ARRAY[
    'E-Commerce & Retail',
    'Financial Services',
    'Healthcare & Life Sciences',
    'Media & Entertainment',
    'SaaS & Technology',
    'Supply Chain & Logistics',
    'Insurance & Risk',
    'EdTech & Learning',
    'Consumer Goods',
    'Public Sector & Government'
  ];

  v_companies text[] := ARRAY[
    'ShopIQ Analytics',
    'FinSight Corp',
    'MediData Health',
    'StreamMetrics Inc',
    'CloudSaaS Analytics',
    'LogiFlow Intelligence',
    'RiskLens AI',
    'LearnIQ Data',
    'BrandPulse Analytics',
    'CivicData Solutions'
  ];

  v_roles text[] := ARRAY[
    'Junior Data Analyst',
    'Data Analyst',
    'Analytics Engineer',
    'Visualization Specialist',
    'BI Developer',
    'Business Analyst',
    'Predictive Analyst',
    'ML Analyst',
    'Senior Data Analyst',
    'Analytics Lead'
  ];

  v_sim_suffixes text[] := ARRAY[
    'Crisis Response',
    'System Design',
    'Data Audit',
    'Analysis Sprint',
    'Root Cause Investigation',
    'Executive Pitch',
    'Priority Triage',
    'Stakeholder Roleplay',
    'Performance Analysis',
    'Ethics Review'
  ];

  v_scenario_types text[] := ARRAY[
    'incident',
    'design',
    'audit',
    'analysis',
    'investigation',
    'pitch',
    'triage',
    'roleplay',
    'analysis',
    'ethics'
  ];

  v_difficulties text[] := ARRAY[
    'beginner',
    'beginner',
    'intermediate',
    'intermediate',
    'intermediate',
    'intermediate',
    'advanced',
    'intermediate',
    'beginner',
    'advanced'
  ];

  v_xp_base int[] := ARRAY[80, 90, 110, 120, 130, 140, 180, 150, 100, 200];

  i int;
  j int;
  v_theme    text;
  v_industry text;
  v_company  text;
  v_role     text;
  v_chapter  uuid;
  v_suffix   text;
  v_type     text;
  v_diff     text;
  v_dur      int;
  v_xp       int;
BEGIN
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE title = 'AI Data Analyst & Decision Intelligence Professional';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'DA course not found — ensure the course is seeded before running this migration.';
  END IF;

  FOR i IN 1..10 LOOP
    v_theme    := v_themes[i];
    v_industry := v_industries[i];
    v_company  := v_companies[i];
    v_chapter  := v_chapters[i];

    FOR j IN 1..10 LOOP
      v_role   := v_roles[j];
      v_suffix := v_sim_suffixes[j];
      v_type   := v_scenario_types[j];
      v_diff   := v_difficulties[j];
      v_dur    := 20 + (j - 1) * 3;
      v_xp     := v_xp_base[j];

      INSERT INTO public.program_simulations (
        id,
        course_id,
        chapter_id,
        title,
        order_index,
        status,
        is_published,
        version,
        completion_pct,
        ai_generated,
        ai_reviewed,
        human_reviewed,
        estimated_completion_minutes,
        difficulty_level,
        level,
        scenario_type,
        industry,
        complexity,
        role,
        competency_tags,
        learning_objectives,
        industry_alignment,
        expected_deliverables,
        scenario,
        grading_rubric,
        scoring,
        readiness_score,
        quality_score,
        created_at,
        updated_at,
        published_at
      ) VALUES (
        gen_random_uuid(),
        v_course_id,
        v_chapter,
        v_theme || ' — ' || v_suffix,
        j - 1,  -- order_index 0-9
        'published',
        true,
        1,
        0,
        true,
        false,
        false,
        v_dur,
        v_diff,
        v_diff,
        v_type,
        v_industry,
        v_diff,
        v_role,
        ARRAY['da:analytics', 'da:' || lower(regexp_replace(v_theme, '[^a-zA-Z0-9]+', '-', 'g'))],
        ARRAY[
          'Apply ' || v_theme || ' techniques to solve a real business problem',
          'Communicate data insights clearly to ' || v_industry || ' stakeholders',
          'Deliver a data-driven recommendation under realistic constraints'
        ],
        ARRAY[v_industry],
        ARRAY[
          'Written analysis or query deliverable',
          'Stakeholder-ready summary or presentation',
          'Actionable recommendation with supporting evidence'
        ],
        jsonb_build_object(
          'background', 'At ' || v_company || ', a real-world ' || v_theme || ' situation requires your expertise. You are a ' || v_role || ' being evaluated on analytical depth, communication quality, and decision-making under pressure.',
          'challenge', 'The scenario involves ' || lower(v_theme) || ' challenges that mirror actual production environments at leading ' || v_industry || ' companies.',
          'company', v_company,
          'industry', v_industry,
          'decisionPoints', jsonb_build_array(
            'Diagnose the core ' || lower(v_theme) || ' problem',
            'Apply the correct analytical approach and tools',
            'Deliver clear, actionable insights to stakeholders'
          )
        ),
        jsonb_build_object(
          'scoring', 'Scored on analytical rigor, decision quality, and stakeholder communication for ' || v_theme || ' in a ' || v_industry || ' context'
        ),
        '{}'::jsonb,
        90,
        90,
        now(),
        now(),
        now()
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'SUCCESS: Inserted 100 DA program_simulations for course %', v_course_id;
END $$;

-- ── Verification query (run separately after applying) ─────────
-- SELECT
--   ps.chapter_id,
--   ch.title as chapter_title,
--   COUNT(*) as sim_count
-- FROM public.program_simulations ps
-- JOIN public.chapters ch ON ps.chapter_id = ch.id
-- WHERE ps.course_id = (
--   SELECT id FROM public.courses
--   WHERE title = 'AI Data Analyst & Decision Intelligence Professional'
-- )
-- GROUP BY ps.chapter_id, ch.title
-- ORDER BY MIN(ps.order_index);
