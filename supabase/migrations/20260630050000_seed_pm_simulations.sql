-- ═══════════════════════════════════════════════════════════════
-- Seed: PM program_simulations
-- AI Project Manager & Delivery Leader
-- 100 simulations — 10 modules × 10 sims each
-- Chapters looked up dynamically — no hardcoded UUIDs.
--
-- PASTE-READY — apply in Supabase SQL Editor
-- Verify after: SELECT COUNT(*) FROM public.program_simulations
--   WHERE course_id = (SELECT id FROM public.courses
--   WHERE title = 'AI Project Manager & Delivery Leader'
--     AND curriculum_version = 'pm-v1');
-- Expected: 100
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_course_id uuid;

  -- 10 sim modules mapped to 18 PM chapters (order_index 1-based)
  -- Fundamentals→1, Initiation→2, Scope→3, Schedule→4, Risk→5,
  -- Finance→6, Stakeholders→7, Agile→11, Portfolio→13, Career→18
  v_chapter_order int[] := ARRAY[1, 2, 3, 4, 5, 6, 7, 11, 13, 18];

  v_themes text[] := ARRAY[
    'PM Fundamentals & AI-Powered Delivery',
    'Project Initiation & Business Case',
    'Scope Management & WBS',
    'Schedule & Critical Path Management',
    'Risk Intelligence & Contingency Planning',
    'Financial Management & Earned Value',
    'Stakeholder Engagement & Communication',
    'Agile & Hybrid Project Delivery',
    'Portfolio & Program Leadership',
    'PM Career Acceleration & PMP'
  ];

  v_industries text[] := ARRAY[
    'Financial Services',
    'Healthcare & Life Sciences',
    'Technology & SaaS',
    'Manufacturing & Operations',
    'Government & Public Sector',
    'Retail & E-Commerce',
    'Insurance & Risk Management',
    'Media & Publishing',
    'Energy & Utilities',
    'Supply Chain & Logistics'
  ];

  v_companies text[] := ARRAY[
    'FinServe Capital',
    'MedPath Health Systems',
    'CloudBuild Technologies',
    'OpsFlow Manufacturing',
    'CivicTech Agency',
    'ShopStream Retail',
    'CoverIQ Insurance',
    'MediaLogic Corp',
    'PowerGrid Energy',
    'FreightMind Logistics'
  ];

  v_roles text[] := ARRAY[
    'Junior Project Manager',
    'Project Manager',
    'Senior Project Manager',
    'Delivery Lead',
    'Program Manager',
    'Project Coordinator',
    'Agile PM',
    'Technical PM',
    'Portfolio Manager',
    'PMO Lead'
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

  v_competency_tags text[] := ARRAY[
    'pm:fundamentals',
    'pm:initiation',
    'pm:scope',
    'pm:schedule',
    'pm:risk',
    'pm:finance',
    'pm:stakeholders',
    'pm:agile',
    'pm:portfolio',
    'pm:career'
  ];

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
  v_comptag  text;
BEGIN
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE title = 'AI Project Manager & Delivery Leader'
    AND curriculum_version = 'pm-v1';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'PM course not found';
  END IF;

  FOR i IN 1..10 LOOP
    v_theme    := v_themes[i];
    v_industry := v_industries[i];
    v_company  := v_companies[i];
    v_comptag  := v_competency_tags[i];

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
        ARRAY[v_comptag],
        ARRAY[
          'Apply ' || v_theme || ' techniques to solve a real ' || v_industry || ' project management challenge',
          'Lead stakeholders and communicate project status clearly in a ' || v_industry || ' environment',
          'Deliver a PM-quality recommendation under realistic constraints'
        ],
        ARRAY[v_industry],
        ARRAY[
          'Written project plan or PM deliverable',
          'Stakeholder-ready presentation or recommendation',
          'Actionable PM artifact with supporting rationale'
        ],
        jsonb_build_object(
          'background', 'At ' || v_company || ', a real-world ' || v_theme || ' challenge requires your project management expertise. You are a ' || v_role || ' being evaluated on delivery leadership, stakeholder management, and PM judgment.',
          'challenge', 'The scenario tests ' || lower(v_theme) || ' skills in a ' || v_industry || ' environment where business and technical constraints intersect.',
          'company', v_company,
          'industry', v_industry,
          'decisionPoints', jsonb_build_array(
            'Diagnose the core ' || lower(v_theme) || ' challenge or risk',
            'Apply the appropriate PM technique or framework',
            'Deliver a clear, stakeholder-ready project recommendation or artifact'
          )
        ),
        jsonb_build_object(
          'scoring', 'Scored on delivery leadership, stakeholder communication, and sound PM judgment for ' || v_theme || ' in a ' || v_industry || ' context'
        ),
        '{}'::jsonb,
        90, 90, now(), now(), now()
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'SUCCESS: Inserted 100 PM program_simulations for course %', v_course_id;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- Verification
-- ═══════════════════════════════════════════════════════════════
SELECT COUNT(*) AS total_pm_sims FROM public.program_simulations
WHERE course_id = (SELECT id FROM public.courses
  WHERE title = 'AI Project Manager & Delivery Leader' AND curriculum_version = 'pm-v1');
-- Expected: 100
