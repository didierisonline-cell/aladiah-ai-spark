-- =============================================================================
-- Seed employer-validation checkpoints for Scrum v2 + AI BA courses
-- 3 checkpoints per course = 6 total rows in program_employer_validation
-- Readiness view formula: 0.03 * least(employer_validation / 3.0, 1)
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================

DO $$
DECLARE
  v_scrum_id UUID := 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';
  v_ba_id    UUID;
  v_ch       UUID;
  n          INT;
BEGIN

  -- Guard: abort if checkpoints already exist to prevent duplicates
  SELECT count(*) INTO n FROM public.program_employer_validation
  WHERE course_id = v_scrum_id;
  IF n > 0 THEN
    RAISE EXCEPTION 'Scrum v2 already has % employer checkpoint(s) — aborting to avoid duplicates', n;
  END IF;

  -- Get BA course ID
  SELECT id INTO v_ba_id
  FROM public.courses
  WHERE title = 'AI Business Analyst & Product Discovery Specialist'
    AND curriculum_version = 'ba-v1';
  IF v_ba_id IS NULL THEN
    RAISE EXCEPTION 'BA course not found';
  END IF;

  SELECT count(*) INTO n FROM public.program_employer_validation
  WHERE course_id = v_ba_id;
  IF n > 0 THEN
    RAISE EXCEPTION 'BA course already has % employer checkpoint(s) — aborting to avoid duplicates', n;
  END IF;

  -- ══════════════════════════════════════════════════════════════════════════
  -- SCRUM V2 CHECKPOINTS
  -- ══════════════════════════════════════════════════════════════════════════

  -- Checkpoint 1: Sprint Facilitation (after Module 6, OFFSET 5)
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_scrum_id ORDER BY order_index LIMIT 1 OFFSET 5;

  INSERT INTO public.program_employer_validation (
    course_id, chapter_id, title, order_index, status, is_published,
    readiness_score, quality_score, human_reviewed,
    estimated_completion_minutes, difficulty_level,
    competency_tags, learning_objectives,
    employer, checkpoint, validation_criteria
  ) VALUES (
    v_scrum_id, v_ch,
    'Sprint Facilitation Competency Review',
    0, 'published', true, 100, 90, true, 90, 'intermediate',
    ARRAY['scrum:events', 'scrum:team-dynamics'],
    ARRAY[
      'Design a complete Sprint cycle facilitation plan',
      'Demonstrate Daily Scrum time-boxing strategies',
      'Facilitate a Sprint Review that drives meaningful stakeholder feedback'
    ],
    'Aladiah Career Coach',
    'Demonstrate ability to facilitate the core Scrum events effectively and keep the team focused on the Sprint Goal',
    '{
      "format": "practical demonstration",
      "activities": [
        "Submit a Sprint Planning facilitation guide (agenda, techniques, timing for a 4-hour session)",
        "Describe your Daily Scrum facilitation approach and how you handle a 30-minute overrun",
        "Design a Sprint Review that drives meaningful stakeholder feedback — not a demo"
      ],
      "duration_minutes": 90,
      "passing_criteria": "All three activities submitted with clear rationale for facilitation choices",
      "evaluator_notes": "Look for servant-leadership stance, time-boxing discipline, and stakeholder engagement focus"
    }'::jsonb
  );

  -- Checkpoint 2: Coaching & Team Effectiveness (after Module 12, OFFSET 11)
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_scrum_id ORDER BY order_index LIMIT 1 OFFSET 11;

  INSERT INTO public.program_employer_validation (
    course_id, chapter_id, title, order_index, status, is_published,
    readiness_score, quality_score, human_reviewed,
    estimated_completion_minutes, difficulty_level,
    competency_tags, learning_objectives,
    employer, checkpoint, validation_criteria
  ) VALUES (
    v_scrum_id, v_ch,
    'Coaching & Team Effectiveness Validation',
    1, 'published', true, 100, 90, true, 90, 'advanced',
    ARRAY['scrum:team-dynamics', 'scrum:stakeholders'],
    ARRAY[
      'Coach a team through the storming stage using Tuckman''s model',
      'Apply Lencioni''s Five Dysfunctions model to a real team scenario',
      'Demonstrate servant leadership in a conflict situation'
    ],
    'Aladiah Career Coach',
    'Demonstrate coaching competency through a real or simulated team dynamics scenario',
    '{
      "format": "case study + coaching plan",
      "activities": [
        "Describe a team conflict scenario (real or simulated) and your coaching approach step by step",
        "Identify which Lencioni dysfunction is present and your SM intervention strategy",
        "Write 3 coaching questions you would use in a 1:1 with the most affected team member"
      ],
      "duration_minutes": 90,
      "passing_criteria": "Coaching approach demonstrates empathy, non-directiveness, and concrete follow-through",
      "evaluator_notes": "Look for the shift from telling to asking — coaching questions vs. giving advice"
    }'::jsonb
  );

  -- Checkpoint 3: Enterprise Agility & AI Readiness (after Module 17, OFFSET 16)
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_scrum_id ORDER BY order_index LIMIT 1 OFFSET 16;

  INSERT INTO public.program_employer_validation (
    course_id, chapter_id, title, order_index, status, is_published,
    readiness_score, quality_score, human_reviewed,
    estimated_completion_minutes, difficulty_level,
    competency_tags, learning_objectives,
    employer, checkpoint, validation_criteria
  ) VALUES (
    v_scrum_id, v_ch,
    'Enterprise Agility & AI Integration Validation',
    2, 'published', true, 100, 90, true, 120, 'advanced',
    ARRAY['scrum:stakeholders', 'scrum:delivery-metrics'],
    ARRAY[
      'Evaluate a scaling scenario and recommend SAFe vs. LeSS with justification',
      'Design an AI workflow that augments the Scrum Master role',
      'Craft an executive stakeholder communication for a scaling initiative'
    ],
    'Aladiah Career Coach',
    'Demonstrate readiness to operate as a Scrum Master at organizational scale with AI augmentation',
    '{
      "format": "strategic recommendation + workflow design",
      "activities": [
        "Given a 5-team, 50-person scaling scenario, recommend SAFe or LeSS and justify your choice with trade-offs",
        "Design one AI workflow that reduces SM administrative overhead (identify tool, trigger, AI step, output)",
        "Write an executive Sprint Review summary for a C-suite audience — no Scrum jargon, outcomes only"
      ],
      "duration_minutes": 120,
      "passing_criteria": "Recommendations are evidence-based with explicit trade-off awareness; AI workflow is practical and bounded",
      "evaluator_notes": "Penalize framework dogmatism. Reward pragmatism and AI use that enhances rather than replaces human judgment"
    }'::jsonb
  );

  -- ══════════════════════════════════════════════════════════════════════════
  -- AI BUSINESS ANALYST CHECKPOINTS
  -- ══════════════════════════════════════════════════════════════════════════

  -- BA Checkpoint 1: Stakeholder Elicitation & Facilitation (after Module 5, OFFSET 4)
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 4;

  INSERT INTO public.program_employer_validation (
    course_id, chapter_id, title, order_index, status, is_published,
    readiness_score, quality_score, human_reviewed,
    estimated_completion_minutes, difficulty_level,
    competency_tags, learning_objectives,
    employer, checkpoint, validation_criteria
  ) VALUES (
    v_ba_id, v_ch,
    'Stakeholder Elicitation & Facilitation Review',
    0, 'published', true, 100, 90, true, 90, 'intermediate',
    ARRAY['ba:facilitation', 'ba:elicitation', 'ba:stakeholders'],
    ARRAY[
      'Design a requirements elicitation workshop for a diverse stakeholder group',
      'Select and justify facilitation techniques for the workshop',
      'Describe a conflict management strategy for a dominant stakeholder'
    ],
    'Aladiah Career Coach',
    'Demonstrate ability to plan and facilitate a stakeholder requirements elicitation session',
    '{
      "format": "workshop design + facilitation plan",
      "activities": [
        "Design a 90-minute elicitation workshop agenda for 8 stakeholders (mix of executives and end users)",
        "Identify 3 facilitation techniques you will use and explain why each is appropriate for this group",
        "Describe how you will handle a dominant executive who derails the conversation"
      ],
      "duration_minutes": 90,
      "passing_criteria": "Workshop design shows stakeholder awareness, structured facilitation, and conflict management strategy",
      "evaluator_notes": "Look for technique diversity and stakeholder psychology awareness — not just a meeting agenda"
    }'::jsonb
  );

  -- BA Checkpoint 2: Product Discovery & Requirements (after Module 10, OFFSET 9)
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 9;

  INSERT INTO public.program_employer_validation (
    course_id, chapter_id, title, order_index, status, is_published,
    readiness_score, quality_score, human_reviewed,
    estimated_completion_minutes, difficulty_level,
    competency_tags, learning_objectives,
    employer, checkpoint, validation_criteria
  ) VALUES (
    v_ba_id, v_ch,
    'Product Discovery & Requirements Engineering Review',
    1, 'published', true, 100, 90, true, 120, 'advanced',
    ARRAY['ba:product-discovery', 'ba:requirements', 'ba:process-analysis'],
    ARRAY[
      'Frame a product opportunity using discovery techniques',
      'Write AI-ready acceptance criteria for a complex feature',
      'Model an as-is/to-be process using BPMN'
    ],
    'Aladiah Career Coach',
    'Demonstrate end-to-end discovery capability from opportunity identification to validated requirements',
    '{
      "format": "discovery artifact set",
      "activities": [
        "Given a business problem statement, produce an opportunity framing document (problem, who is affected, current vs. desired state, assumptions to test)",
        "Write 3 user stories with AI-specific acceptance criteria (include accuracy thresholds, edge cases, bias/fairness considerations)",
        "Create a BPMN as-is/to-be diagram for one process in the discovery scope (can be hand-drawn or digital)"
      ],
      "duration_minutes": 120,
      "passing_criteria": "Artifacts demonstrate analytical depth, AI-specific requirement awareness, and BPMN modeling clarity",
      "evaluator_notes": "Key signal: do acceptance criteria address non-functional AI requirements (accuracy, latency, fairness) — not just functional behavior"
    }'::jsonb
  );

  -- BA Checkpoint 3: AI Analysis & Governance Readiness (after Module 14, OFFSET 13)
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 13;

  INSERT INTO public.program_employer_validation (
    course_id, chapter_id, title, order_index, status, is_published,
    readiness_score, quality_score, human_reviewed,
    estimated_completion_minutes, difficulty_level,
    competency_tags, learning_objectives,
    employer, checkpoint, validation_criteria
  ) VALUES (
    v_ba_id, v_ch,
    'AI-Augmented Analysis & Governance Readiness Review',
    2, 'published', true, 100, 90, true, 120, 'advanced',
    ARRAY['ba:ai-analysis', 'ba:ai-prompting', 'ba:compliance'],
    ARRAY[
      'Use AI to complete a business analysis task, then audit the output critically',
      'Identify regulatory requirements for an AI deployment scenario',
      'Build a reusable prompt engineering template with a validation checklist'
    ],
    'Aladiah Career Coach',
    'Demonstrate AI-augmented analysis capability with appropriate governance and critical validation practices',
    '{
      "format": "AI-assisted analysis + governance review",
      "activities": [
        "Use an AI tool to generate stakeholder analysis for a given business scenario, then critically audit the output for gaps, inaccuracies, and bias",
        "Identify 3 regulatory requirements that apply to an AI customer service deployment (e.g., GDPR, algorithmic fairness, explainability)",
        "Write a reusable prompt template for requirements drafting, including a 5-item validation checklist to verify AI output quality"
      ],
      "duration_minutes": 120,
      "passing_criteria": "AI outputs are critically evaluated and not accepted at face value; governance gaps are clearly identified",
      "evaluator_notes": "Key signal: the BA who can USE AI AND validate it — not the one who trusts AI output uncritically"
    }'::jsonb
  );

END $$;

-- =============================================================================
-- VERIFY
-- =============================================================================
SELECT
  c.title AS course,
  ev.title AS checkpoint,
  ev.order_index,
  ev.status,
  ev.is_published,
  ev.difficulty_level,
  array_length(ev.competency_tags, 1) AS competency_count
FROM public.program_employer_validation ev
JOIN public.courses c ON c.id = ev.course_id
ORDER BY c.title, ev.order_index;
