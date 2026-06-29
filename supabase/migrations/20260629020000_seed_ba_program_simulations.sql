-- ═══════════════════════════════════════════════════════════════
-- Seed: BA program_simulations
-- AI Business Analyst & Product Discovery Specialist
-- 100 simulations — 10 modules × 10 sims each
-- Chapters looked up dynamically — no hardcoded UUIDs.
--
-- PASTE-READY — apply in Supabase SQL Editor
-- Verify after: SELECT COUNT(*) FROM public.program_simulations
--   WHERE course_id = (SELECT id FROM public.courses
--   WHERE title = 'AI Business Analyst & Product Discovery Specialist');
-- Expected: 100
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_course_id uuid;

  -- 10 sim modules mapped to 18 BA chapters (order_index 1-based)
  v_chapter_order int[] := ARRAY[1, 3, 6, 7, 9, 11, 12, 16, 17, 18];

  v_themes text[] := ARRAY[
    'Business Analysis Fundamentals & AI Toolkit',
    'Stakeholder Analysis & Engagement',
    'Requirements Engineering & Specification',
    'Process Analysis & Business Architecture',
    'Product Thinking & Discovery',
    'Data Analysis & Decision Intelligence',
    'Solution Evaluation & Acceptance',
    'Agile BA & Product Ownership',
    'Enterprise Architecture & Digital Transformation',
    'BA Career Acceleration & Portfolio'
  ];

  v_industries text[] := ARRAY[
    'Financial Services',
    'Healthcare & Life Sciences',
    'Retail & E-Commerce',
    'Insurance & Risk',
    'SaaS & Technology',
    'Manufacturing & Operations',
    'Government & Public Sector',
    'Media & Publishing',
    'Supply Chain & Logistics',
    'Energy & Utilities'
  ];

  v_companies text[] := ARRAY[
    'FinCore Solutions',
    'MedPath Analytics',
    'ShopStream Corp',
    'CoverIQ Insurance',
    'CloudBuild SaaS',
    'OpsFlow Manufacturing',
    'CivicTech Agency',
    'MediaLogic Corp',
    'FreightMind Logistics',
    'PowerGrid Utilities'
  ];

  v_roles text[] := ARRAY[
    'Junior Business Analyst',
    'Business Analyst',
    'Senior Business Analyst',
    'Requirements Lead',
    'BA Consultant',
    'Process Analyst',
    'Product BA',
    'Data Analyst BA',
    'Solution Analyst',
    'BA Practice Lead'
  ];

  v_sim_suffixes text[] := ARRAY[
    'Crisis Response',
    'Requirements Sprint',
    'Stakeholder Audit',
    'Discovery Workshop',
    'Root Cause Investigation',
    'Executive Pitch',
    'Priority Triage',
    'Stakeholder Negotiation',
    'Solution Review',
    'Ethics & Governance Review'
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
    'review',
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
  WHERE title = 'AI Business Analyst & Product Discovery Specialist'
    AND curriculum_version = 'ba-v1';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'BA course not found';
  END IF;

  FOR i IN 1..10 LOOP
    v_theme    := v_themes[i];
    v_industry := v_industries[i];
    v_company  := v_companies[i];

    -- Look up chapter by order_index (1-based, matching course structure)
    SELECT id INTO v_chapter
    FROM public.chapters
    WHERE course_id = v_course_id AND order_index = v_chapter_order[i];

    IF v_chapter IS NULL THEN
      RAISE EXCEPTION 'Chapter not found for sim module % (order_index %)', i, v_chapter_order[i];
    END IF;

    FOR j IN 1..10 LOOP
      v_role   := v_roles[j];
      v_suffix := v_sim_suffixes[j];
      v_type   := v_scenario_types[j];
      v_diff   := v_difficulties[j];
      v_dur    := 20 + (j - 1) * 3;
      v_xp     := v_xp_base[j];

      INSERT INTO public.program_simulations (
        id, course_id, chapter_id, title, order_index,
        status, is_published, version, completion_pct,
        ai_generated, ai_reviewed, human_reviewed,
        estimated_completion_minutes, difficulty_level, level,
        scenario_type, industry, complexity, role,
        competency_tags, learning_objectives, industry_alignment,
        expected_deliverables, scenario, grading_rubric, scoring,
        readiness_score, quality_score, created_at, updated_at, published_at
      ) VALUES (
        gen_random_uuid(), v_course_id, v_chapter,
        v_theme || ' — ' || v_suffix,
        j - 1,
        'published', true, 1, 0,
        true, false, false,
        v_dur, v_diff, v_diff, v_type, v_industry, v_diff, v_role,
        ARRAY['ba:requirements', 'ba:' || lower(regexp_replace(v_theme, '[^a-zA-Z0-9]+', '-', 'g'))],
        ARRAY[
          'Apply ' || v_theme || ' techniques to solve a real ' || v_industry || ' business problem',
          'Communicate requirements and insights clearly to ' || v_industry || ' stakeholders',
          'Deliver a BA-quality recommendation under realistic constraints'
        ],
        ARRAY[v_industry],
        ARRAY[
          'Written requirements or analysis deliverable',
          'Stakeholder-ready presentation or recommendation',
          'Actionable BA artifact with supporting rationale'
        ],
        jsonb_build_object(
          'background', 'At ' || v_company || ', a real-world ' || v_theme || ' challenge requires your expertise. You are a ' || v_role || ' being evaluated on requirements quality, stakeholder communication, and analytical judgment.',
          'challenge', 'The scenario tests ' || lower(v_theme) || ' skills in a ' || v_industry || ' environment where business and technical constraints intersect.',
          'company', v_company,
          'industry', v_industry,
          'decisionPoints', jsonb_build_array(
            'Diagnose the core ' || lower(v_theme) || ' problem or need',
            'Apply the appropriate BA technique or framework',
            'Deliver a clear, stakeholder-ready recommendation or artifact'
          )
        ),
        jsonb_build_object(
          'scoring', 'Scored on requirements quality, stakeholder communication, and sound BA judgment for ' || v_theme || ' in a ' || v_industry || ' context'
        ),
        '{}'::jsonb,
        90, 90, now(), now(), now()
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'SUCCESS: Inserted 100 BA program_simulations for course %', v_course_id;
END $$;
