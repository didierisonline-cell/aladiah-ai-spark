-- =============================================================================
-- Publish BA flagship STRUCTURE into the student learn-path.
-- Governed by docs/standards/PUBLISH_LAYER.md ; contract:
--   docs/curriculum/business-analyst-v1/PUBLISH_MANIFEST.md
-- Source content: docs/curriculum/business-analyst-v1/modules/*.md
--
-- Scope of THIS migration (structure only — "verify structure before content"):
--   course (is_flagship, is_published=FALSE) + 15 chapters + 75 lessons (videos)
--   + 15 chapter_end exam shells (no questions yet — that is the next migration).
--
-- Invariants (PUBLISH_LAYER §3): idempotent (re-run safe), is_published=FALSE,
--   translations := '{}'::jsonb on every learn-path row. Competency lives on
--   quiz_questions (next migration), not on chapters/videos.
--
-- REVIEWABLE SQL — apply by hand in Supabase, then run the verification block at
-- the foot of this file. Flip is_published=TRUE only after verify passes.
-- =============================================================================

-- 1) Course (idempotent on title + curriculum_version) ------------------------
DO $$
DECLARE cid uuid;
BEGIN
  SELECT id INTO cid FROM public.courses
    WHERE title = 'AI Business Analyst & Product Discovery Specialist'
      AND curriculum_version = 'ba-v1';
  IF cid IS NULL THEN
    INSERT INTO public.courses (title, description, is_published, is_flagship,
        flagship_version, curriculum_version, launch_status,
        target_market, target_salary_low, target_salary_high, translations)
    VALUES ('AI Business Analyst & Product Discovery Specialist',
        'Become an AI-augmented Business Analyst who can find and choose opportunities, model the enterprise, engineer and validate AI requirements, navigate compliance, and defend a transformation to a board. 15 modules, 75 lessons, capstone engagement + portfolio.',
        false, true, 'ba-v1', 'ba-v1', 'draft',
        'Career-changers and analysts moving into AI-era BA and product roles',
        90000, 230000, '{}'::jsonb);
  END IF;
END $$;

-- 2) Session-local helper: get-or-create a module by (course, order_index),
--    seed its lessons if empty, ensure a chapter_end exam shell. Idempotent.
CREATE OR REPLACE FUNCTION pg_temp.seed_ba_module(
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

-- 3) Modules (15) — titles/lessons mirror modules/*.md exactly ----------------
SELECT pg_temp.seed_ba_module(1, 'Business Analysis in the AI Era',
  'Where the BA role is going in the AI era: the value stack, probabilistic vs deterministic systems, and the AI-native operating model.', 85,
  ARRAY['The Evolution of the Business Analyst','Deterministic vs Probabilistic: Why AI Changes BA','The AI-Native Operating Model','Requirements in the Age of AI','Outcomes over Outputs: The Value Mindset'],
  ARRAY['How the BA evolved from scribe to value-driver, and where you sit on the ladder. Produces the Personal Career Transformation Plan.','Why probabilistic AI systems change how a BA specifies, validates and governs. Produces an AI Impact Assessment.','Designing a human+AI workflow with explicit validation loops. Produces your AI BA Operating Model.','The new requirement categories AI features demand (accuracy, fallback, fairness, evaluation). Produces an AI Requirements primer.','Outputs vs outcomes and saying no to work that will not move the metric. Produces a Value Framing one-pager.']);

SELECT pg_temp.seed_ba_module(2, 'BA Planning, Competencies & the AI Toolkit',
  'Plan the analysis approach, map your competencies, and assemble a responsible AI toolkit.', 85,
  ARRAY['The BA Competency Map','Planning the Analysis Approach','The Modern BA AI Toolkit','Working with AI Responsibly','Communication & Collaboration Foundations'],
  ARRAY['The 13-competency model and an honest self-assessment. Produces a Competency Self-Assessment.','Tailoring approach, deliverables and governance to the engagement. Produces a BA Plan.','Selecting AI tools across the analysis lifecycle. Produces a Tool Selection Matrix.','Guardrails for accuracy, bias, privacy and traceability. Produces AI Usage Guardrails.','Foundations of stakeholder communication and collaboration. Produces a Communication Charter.']);

SELECT pg_temp.seed_ba_module(3, 'Stakeholder Analysis & Management',
  'Map, engage, and navigate stakeholders — from sponsors to hostile executives.', 85,
  ARRAY['Stakeholder Mapping & Power Dynamics','Engagement Strategy & Sponsor Alignment','Executive Communication & Steering Committees','Political Navigation & Influence Without Authority','Conflict, Negotiation & Difficult-Stakeholder Recovery'],
  ARRAY['Mapping stakeholders by power and interest. Produces a Stakeholder Map & Power/Interest Grid.','Aligning sponsors and tailoring engagement. Produces a Stakeholder Engagement & Sponsor-Alignment Plan.','Communicating to executives and steering committees. Produces an Executive Briefing / Steering-Committee Pack.','Influence without authority and reading the politics. Produces a Political Landscape Map & Influence Strategy.','Conflict, negotiation and recovering difficult relationships. Produces the Stakeholder Management Plan + Conflict-Recovery Playbook.']);

SELECT pg_temp.seed_ba_module(4, 'Elicitation Techniques & Collaboration',
  'The full elicitation toolkit — interviews, observation, root-cause, and eliciting under pressure.', 85,
  ARRAY['The Elicitation Toolkit','Discovery & JTBD Interviewing','Contextual Inquiry & Observation','Root-Cause & Signal Detection','Eliciting from Difficult & Executive Stakeholders'],
  ARRAY['Choosing the right elicitation technique per situation. Produces an Elicitation Plan.','Jobs-to-be-Done and discovery interviewing. Produces an Interview Guide.','Observing real work in context. Produces Observation Findings.','Finding root causes and weak signals. Produces a Root-Cause Brief.','Eliciting from difficult and executive stakeholders. Produces an Elicitation Evidence Pack.']);

SELECT pg_temp.seed_ba_module(5, 'Facilitation & Workshop Leadership',
  'Lead workshops that produce decisions — from story mapping to executive decision forums.', 85,
  ARRAY['Facilitation Foundations & Safety','Discovery Workshops & Story Mapping','Event Storming for Process Discovery','Prioritization & Conflict Workshops','Executive Decision Forums & Multi-Team Facilitation'],
  ARRAY['Psychological safety and facilitation fundamentals. Produces a Facilitation Playbook.','Running discovery workshops and story mapping. Produces a Story Map.','Event storming to discover processes. Produces an Event-Storm Artifact.','Facilitating prioritization and resolving conflict. Produces a Workshop Outcomes Log.','Executive decision forums and multi-team facilitation. Produces a Decision Forum Pack.']);

SELECT pg_temp.seed_ba_module(6, 'Requirements Engineering',
  'Engineer requirements end to end: quality, specification, user stories, traceability, and conflict resolution.', 85,
  ARRAY['Requirements Types & Quality','Analysis & Specification','User Stories & Acceptance Criteria','Traceability & Lifecycle Management','Conflicting Requirements & Resolution'],
  ARRAY['Requirement types and what makes them high quality. Produces a Requirements Quality Checklist.','Analyzing and specifying requirements rigorously. Produces a Requirements Specification.','Writing user stories and acceptance criteria. Produces a Backlog + Acceptance Criteria.','Traceability and managing the requirements lifecycle. Produces a Requirements Traceability Matrix.','Resolving conflicting requirements. Produces a Requirements Package draft.']);

SELECT pg_temp.seed_ba_module(7, 'Process Analysis & Modeling (BPMN)',
  'Model and improve processes with BPMN — as-is, gap analysis, to-be design, and AI-assisted process mining.', 85,
  ARRAY['Process Thinking & Value Streams','As-Is Modeling with BPMN','Gap & Root-Cause Process Analysis','To-Be Design & Optimization','Process Mining & AI-Assisted Analysis'],
  ARRAY['Process thinking and value streams. Produces a Process Inventory.','Modeling the current state in BPMN. Produces an As-Is BPMN.','Gap and root-cause analysis of processes. Produces a Process Gap Analysis.','Designing and optimizing the future state. Produces a To-Be BPMN.','Process mining and AI-assisted analysis. Produces a BPMN Package.']);

SELECT pg_temp.seed_ba_module(8, 'Business Architecture',
  'Lift to the enterprise: capability maps, value streams, operating models, and target-state architecture.', 85,
  ARRAY['Capability Mapping','Value Streams & Operating Models','Capability Heatmaps & Investment','Target-State Architecture','Strategic Alignment & Transformation Framing'],
  ARRAY['Mapping enterprise capabilities. Produces a Capability Map.','Value streams and operating models. Produces an Operating Model Canvas.','Heatmapping capabilities to direct investment. Produces a Capability Heatmap.','Defining where the business must go. Produces a Target-State Architecture.','Aligning to strategy and framing transformation. Produces a Transformation Recommendation Deck.']);

SELECT pg_temp.seed_ba_module(9, 'Product Thinking & Strategy',
  'Choose the right opportunities: outcomes, north-star metrics, and prioritization.', 85,
  ARRAY['Outcomes, Vision & Value','Business-Model & North-Star Thinking','Strategy: Choosing Opportunities','Value vs Effort & Market Attractiveness','Assembling the Product Opportunity Assessment'],
  ARRAY['Outcomes, vision and value framing. Produces an Outcome Map.','Business-model and north-star thinking. Produces a North-Star Definition.','Choosing which opportunities to pursue. Produces an Opportunity Shortlist.','Weighing value, effort and market attractiveness. Produces a Prioritization Matrix.','Assembling the case for the chosen opportunities. Produces a Product Opportunity Assessment.']);

SELECT pg_temp.seed_ba_module(10, 'Product Discovery & Solution Definition',
  'Find opportunities through continuous discovery: opportunity solution trees, assumption testing, experiments.', 85,
  ARRAY['Continuous Discovery & Opportunity Solution Trees','Assumption Mapping & Hypotheses','Experiment Design & MVP','Discovery Research & Evidence','Working Backwards & the Executive Discovery Report'],
  ARRAY['Continuous discovery and opportunity solution trees. Produces an Opportunity Solution Tree.','Mapping and testing risky assumptions. Produces an Assumption Map.','Designing experiments and MVPs. Produces an Experiment Plan.','Discovery research and weighing evidence. Produces Discovery Findings.','Working Backwards into an executive report. Produces the Executive Discovery Report.']);

SELECT pg_temp.seed_ba_module(11, 'Data Analysis for BAs: Decision Intelligence',
  'From reporting to decision intelligence: metric trees, SQL for decisions, dashboards, and decision briefs.', 85,
  ARRAY['From Reporting to Decision Intelligence','Metrics, KPIs & Metric Trees','SQL & Analysis for Decisions','Visualization & Executive Dashboards','Root-Cause Analysis & the Decision Brief'],
  ARRAY['Moving from reporting to decision intelligence. Produces a KPI Health Assessment.','Metrics, KPIs and metric trees. Produces a Metric Tree.','SQL and analysis to drive decisions. Produces a SQL Decision Query Set.','Visualization and executive dashboards. Produces an Executive KPI Dashboard Spec.','Root-cause analysis and the decision brief. Produces a Root-Cause Analysis Report + Decision Brief.']);

SELECT pg_temp.seed_ba_module(12, 'Solution Evaluation, Validation & Acceptance',
  'Evaluate options, build the business case, validate, run UAT, and prove value realization.', 85,
  ARRAY['Solution Options & Trade-offs','Business Case & ROI — the Funding Decision','Solution Validation & Acceptance','UAT Design & Execution — the Rollout Decision','Value Realization & Post-Implementation Review'],
  ARRAY['Comparing solution options and trade-offs. Produces an Options Analysis.','Business case and ROI for the funding decision. Produces a Business Case.','Validating and accepting the solution. Produces a Validation Plan.','Designing and running UAT for the rollout decision. Produces a UAT Package.','Value realization and post-implementation review. Produces a Post-Implementation Review.']);

SELECT pg_temp.seed_ba_module(13, 'AI Business Analysis & Decision Intelligence',
  'The flagship differentiator: AI requirement ladders, human+AI decision systems, failure investigation, and governance.', 85,
  ARRAY['The AI Requirement Ladder 2.0','Human + AI Decision Systems','AI Failure Investigation','AI Governance & Monitoring','Executive AI Transformation Roadmap'],
  ARRAY['The five-layer AI Requirement Ladder applied. Produces an AI Requirements Package.','Designing human + AI decision systems. Produces a Decision Authority Matrix.','Investigating AI failures and bias. Produces an AI Failure Autopsy.','AI governance and monitoring. Produces an AI Governance Dashboard.','Executive AI transformation roadmap. Produces an AI Transformation Blueprint.']);

SELECT pg_temp.seed_ba_module(14, 'Regulatory, Risk & Compliance',
  'Governance with teeth: regulatory impact, risk quantification, controls, and AI governance in regulated industries.', 85,
  ARRAY['Regulatory Impact Assessment','Risk Quantification','Controls & Assurance','Executive Risk Decisions','AI Governance in Regulated Industries'],
  ARRAY['Assessing regulatory impact. Produces a Regulatory Impact Assessment.','Quantifying risk exposure. Produces a Risk Exposure Register.','Designing controls and assurance. Produces a Control Matrix.','Executive risk treatment decisions. Produces a Risk Treatment Plan.','AI governance in regulated industries. Produces an AI Governance Compliance Blueprint.']);

SELECT pg_temp.seed_ba_module(15, 'Capstone: Discovery-to-Transformation',
  'A full transformation engagement: discovery to board defense, integrating all 13 competencies. Pass 80, distinction 92.', 80,
  ARRAY['Phase 1 · Discovery','Phase 2 · Architecture & Strategy','Phase 3 · Requirements, Governance & Risk','Phase 4 · The Investment Case','Phase 5 · The Board Recommendation & Defense'],
  ARRAY['Separate loud requests from evidenced problems and frame the real one. Produces the Executive Discovery Report (P1).','Lift to the enterprise with capability maps and target-state. Produces Capability Map + Target-State Architecture + Product Opportunity Assessment (P4).','Make it real and safe with AI requirements, governance and risk. Produces AI Requirements Package (P3) + Governance Blueprint + Risk Treatment Plan.','Translate the transformation into money. Produces the Business Case (P5) + Cost of Delay + Benefits Realization Plan.','Synthesize and defend to an AI executive board (Sim 10). Produces the Board Recommendation Deck (P8) + the Aladiah Profile.']);

DROP FUNCTION pg_temp.seed_ba_module(int, text, text, int, text[], text[]);

-- =============================================================================
-- VERIFICATION (run after applying; PUBLISH_LAYER §6). Expected:
--   modules = 15, lessons = 75, exams = 15, is_published = false.
-- =============================================================================
-- SELECT c.title, c.is_published, c.launch_status,
--   (SELECT count(*) FROM public.chapters ch WHERE ch.course_id=c.id) AS modules,
--   (SELECT count(*) FROM public.videos v JOIN public.chapters ch ON ch.id=v.chapter_id
--      WHERE ch.course_id=c.id) AS lessons,
--   (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id=q.chapter_id
--      WHERE ch.course_id=c.id AND q.quiz_type='chapter_end') AS exams
-- FROM public.courses c
-- WHERE c.title='AI Business Analyst & Product Discovery Specialist' AND c.curriculum_version='ba-v1';
--
-- Per-module lesson counts (each MUST be 5):
-- SELECT ch.order_index, ch.title,
--   (SELECT count(*) FROM public.videos v WHERE v.chapter_id=ch.id) AS lessons,
--   (SELECT count(*) FROM public.quizzes q WHERE q.chapter_id=ch.id AND q.quiz_type='chapter_end') AS exams
-- FROM public.chapters ch JOIN public.courses c ON c.id=ch.course_id
-- WHERE c.title='AI Business Analyst & Product Discovery Specialist' AND c.curriculum_version='ba-v1'
-- ORDER BY ch.order_index;
--
-- After verify passes AND founder approves, publish:
-- UPDATE public.courses SET is_published=true, launch_status='live'
-- WHERE title='AI Business Analyst & Product Discovery Specialist' AND curriculum_version='ba-v1';
