-- =============================================================================
-- Seed BA M16-M18 structure — chapters + lesson shells + quiz shells
-- AI Business Analyst & Product Discovery Specialist (ba-v1)
--
--   M16: Agile BA & Product Ownership           (order_index 16)
--   M17: Enterprise Architecture & Digital Transformation (order_index 17)
--   M18: BA Career Acceleration & Portfolio     (order_index 18)
--
-- Idempotent: uses same seed_ba_module pattern as publish_ba_structure.sql
-- Apply BEFORE content and quiz migrations.
-- =============================================================================

CREATE OR REPLACE FUNCTION pg_temp.seed_ba_module_ext(
  p_idx int, p_title text, p_desc text, p_pass int, p_l text[], p_ld text[]
) RETURNS void LANGUAGE plpgsql AS $fn$
DECLARE cid uuid; m_ch uuid; i int;
BEGIN
  SELECT id INTO cid FROM public.courses
    WHERE title = 'AI Business Analyst & Product Discovery Specialist'
      AND curriculum_version = 'ba-v1';

  SELECT id INTO m_ch FROM public.chapters WHERE course_id = cid AND order_index = p_idx;
  IF m_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (cid, p_title, p_desc, p_idx, '{}'::jsonb) RETURNING id INTO m_ch;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = m_ch) THEN
    FOR i IN 1 .. array_length(p_l, 1) LOOP
      INSERT INTO public.videos (chapter_id, title, description, order_index, translations)
      VALUES (m_ch, p_l[i], p_ld[i], i, '{}'::jsonb);
    END LOOP;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = m_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (m_ch, 'chapter_end', p_pass);
  END IF;
END;
$fn$;

-- M16: Agile BA & Product Ownership
SELECT pg_temp.seed_ba_module_ext(16, 'Agile BA & Product Ownership',
  'Master Agile business analysis: user stories, backlog refinement, sprint ceremonies, product ownership, and scaled Agile frameworks (SAFe, LeSS).', 85,
  ARRAY[
    'Agile Fundamentals for Business Analysts',
    'User Story Mastery — Writing Stories That Ship',
    'Backlog Refinement & Sprint Ceremonies for BAs',
    'Product Ownership & Release Planning',
    'Scaling Agile: SAFe BA, LeSS & Enterprise Agile'
  ],
  ARRAY[
    'How Agile changes the BA role — from requirements document author to continuous collaborator. Produces an Agile BA Operating Charter.',
    'Writing user stories that capture real value: the three Cs, INVEST criteria, acceptance criteria, and story splitting techniques. Produces a User Story Library.',
    'The BA''s role in sprint ceremonies: refinement facilitation, sprint review, retrospective facilitation. Produces a Sprint Ceremony Guide.',
    'Product ownership fundamentals: backlog management, release planning, stakeholder alignment, and roadmap communication. Produces a Release Roadmap.',
    'Operating as a BA in SAFe (Agile Release Train), LeSS, and enterprise Agile contexts. Produces a Scaled Agile BA Playbook.'
  ]);

-- M17: Enterprise Architecture & Digital Transformation
SELECT pg_temp.seed_ba_module_ext(17, 'Enterprise Architecture & Digital Transformation',
  'Operate at enterprise scale: capability mapping, TOGAF frameworks, transformation roadmaps, technology portfolio analysis, and leading change at scale.', 85,
  ARRAY[
    'Enterprise Architecture Fundamentals for BAs',
    'Business Capability Mapping & Gap Analysis',
    'Digital Transformation Roadmaps & Business Cases',
    'Technology Portfolio Assessment & Rationalization',
    'Leading Transformation at Enterprise Scale'
  ],
  ARRAY[
    'EA concepts every BA must know: architecture domains, capability models, and where BA work fits in enterprise planning. Produces an EA Orientation Map.',
    'Building and reading capability maps to identify gaps, redundancies, and transformation priorities. Produces a Business Capability Heat Map.',
    'Constructing a credible digital transformation roadmap with business case, sequencing logic, and risk assessment. Produces a Transformation Roadmap.',
    'Assessing technology portfolios for rationalization opportunities — cost, risk, and fit analysis. Produces a Technology Portfolio Assessment.',
    'Change management at enterprise scale: communication, resistance patterns, sponsor alignment, and sustaining momentum. Produces an Enterprise Change Playbook.'
  ]);

-- M18: BA Career Acceleration & Portfolio
SELECT pg_temp.seed_ba_module_ext(18, 'BA Career Acceleration & Portfolio',
  'Accelerate your BA career: CBAP and PMI-PBA certification, portfolio building, personal brand, salary negotiation, and future-proofing in the AI era.', 80,
  ARRAY[
    'CBAP & PMI-PBA Certification Roadmap',
    'Building a BA Portfolio That Wins Interviews',
    'LinkedIn Optimization & Personal Brand for BAs',
    'Salary Negotiation & Career Paths',
    'The AI-Era BA — Future-Proofing Your Career'
  ],
  ARRAY[
    'Complete certification planning: CBAP vs PMI-PBA comparison, experience requirements, study strategies, and exam approach. Produces a Certification Action Plan.',
    'What to include in a BA portfolio, how to structure case studies, and how to present BA impact quantitatively. Produces a Portfolio Framework.',
    'LinkedIn headline, summary, and experience optimization for BA roles. Building thought leadership. Produces a LinkedIn Optimization Checklist.',
    'Salary benchmarks by role, region, and seniority. Negotiation scripts, offer evaluation, and career path decisions (in-house vs consulting vs freelance). Produces a Negotiation Playbook.',
    'AI tools every BA must master, emerging BA specializations, and a 12-month career acceleration plan. Produces a Future-Ready BA Plan.'
  ]);

-- Verification
SELECT ch.order_index, ch.title,
       COUNT(DISTINCT v.id) AS lessons,
       COUNT(DISTINCT qz.id) AS quiz_shells
FROM public.chapters ch
JOIN public.courses co ON ch.course_id = co.id
LEFT JOIN public.videos v ON v.chapter_id = ch.id
LEFT JOIN public.quizzes qz ON qz.chapter_id = ch.id AND qz.quiz_type = 'chapter_end'
WHERE co.title = 'AI Business Analyst & Product Discovery Specialist'
  AND ch.order_index IN (16, 17, 18)
GROUP BY ch.order_index, ch.title
ORDER BY ch.order_index;
-- Expected: 3 rows, each with lessons=5, quiz_shells=1
