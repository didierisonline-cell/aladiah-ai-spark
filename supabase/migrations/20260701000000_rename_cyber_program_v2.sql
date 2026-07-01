-- =============================================================
-- Rename: AI Cybersecurity → AI Enterprise Cybersecurity,
--         Governance & Digital Trust
--
-- The program's story shifts from "become a cybersecurity pro"
-- to "build, secure, govern, and lead trustworthy AI-powered
-- enterprises." All 18 module titles updated to reflect the
-- five Schools of Thought framework.
--
-- curriculum_version stays 'cyber-v1' (no data migration needed).
-- The sim key 'ai-cybersecurity-governance' stays (URL-safe).
-- =============================================================

DO $body$
DECLARE
  v_cid UUID;
BEGIN
  SELECT id INTO v_cid FROM public.courses
    WHERE curriculum_version = 'cyber-v1';
  IF v_cid IS NULL THEN
    RAISE EXCEPTION 'cyber-v1 course not found';
  END IF;

  -- ── Rename the course ──────────────────────────────────────
  UPDATE public.courses
  SET
    title       = 'AI Enterprise Cybersecurity, Governance & Digital Trust',
    description = 'The world''s first AI-native cybersecurity program built around '
               || 'the future of AI-powered enterprises. Learn to build, secure, '
               || 'govern, and lead trustworthy digital organizations — from '
               || 'technical security and GRC to AI governance and enterprise '
               || 'leadership. Five Schools of Thought. 18 modules. One mission: '
               || 'Digital Trust.'
  WHERE id = v_cid;

  -- ── Rename all 18 modules (by order_index) ────────────────

  -- School 1: Understanding the Modern Enterprise
  UPDATE public.chapters SET title = 'Foundations of Enterprise Cybersecurity'
    WHERE course_id = v_cid AND order_index = 1;

  UPDATE public.chapters SET title = 'Enterprise Security Operations & Resilience'
    WHERE course_id = v_cid AND order_index = 2;

  UPDATE public.chapters SET title = 'Cloud & Distributed Infrastructure Security'
    WHERE course_id = v_cid AND order_index = 3;

  -- School 2: Engineering Secure Technology
  UPDATE public.chapters SET title = 'Network Defense & Modern Connectivity'
    WHERE course_id = v_cid AND order_index = 4;

  UPDATE public.chapters SET title = 'Secure Software Engineering & DevSecOps'
    WHERE course_id = v_cid AND order_index = 5;

  UPDATE public.chapters SET title = 'Digital Forensics, Incident Response & Crisis Management'
    WHERE course_id = v_cid AND order_index = 6;

  -- School 3: Building Digital Trust
  UPDATE public.chapters SET title = 'Enterprise Governance, Risk & Compliance'
    WHERE course_id = v_cid AND order_index = 7;

  UPDATE public.chapters SET title = 'Enterprise Trust Standards: SOC 2 & ISO 27001'
    WHERE course_id = v_cid AND order_index = 8;

  UPDATE public.chapters SET title = 'Privacy, Data Protection & Digital Rights'
    WHERE course_id = v_cid AND order_index = 9;

  UPDATE public.chapters SET title = 'Third-Party Risk, Vendor Trust & Supply Chain Security'
    WHERE course_id = v_cid AND order_index = 10;

  UPDATE public.chapters SET title = 'AI Security, Governance & Autonomous Systems'
    WHERE course_id = v_cid AND order_index = 11;

  UPDATE public.chapters SET title = 'Identity, Access & Digital Trust'
    WHERE course_id = v_cid AND order_index = 12;

  -- School 4: AI Enterprise Security
  UPDATE public.chapters SET title = 'Cyber Threat Intelligence & Global Risk'
    WHERE course_id = v_cid AND order_index = 13;

  UPDATE public.chapters SET title = 'Security Automation, SOAR & AI Operations'
    WHERE course_id = v_cid AND order_index = 14;

  UPDATE public.chapters SET title = 'Security Assurance, Audit & Executive Readiness'
    WHERE course_id = v_cid AND order_index = 15;

  -- School 5: Future Enterprise Leadership
  UPDATE public.chapters SET title = 'Enterprise Cybersecurity Leadership & Strategy'
    WHERE course_id = v_cid AND order_index = 16;

  UPDATE public.chapters SET title = 'Enterprise Security Architecture & Digital Transformation'
    WHERE course_id = v_cid AND order_index = 17;

  UPDATE public.chapters SET title = 'AI Enterprise Digital Twin Capstone'
    WHERE course_id = v_cid AND order_index = 18;

  RAISE NOTICE 'Renamed cyber-v1 program and all 18 modules.';
END $body$;

-- VERIFICATION:
-- SELECT title, curriculum_version FROM public.courses WHERE curriculum_version = 'cyber-v1';
-- SELECT order_index, title FROM public.chapters
--   WHERE course_id = (SELECT id FROM public.courses WHERE curriculum_version = 'cyber-v1')
--   ORDER BY order_index;
