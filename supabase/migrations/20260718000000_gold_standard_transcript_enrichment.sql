-- =============================================================================
-- GOLD STANDARD transcript enrichment — the 2 thin lessons found by the
-- academy-wide sweep (docs/standards/GOLD_STANDARD.md).
--
--   1. Scrum M1 L3  "The Scrum Values"                 (was 749 chars)
--   2. Cyber M7 L4  "Security Policy Lifecycle"        (was 1,168 chars)
--
-- REVIEWABLE SQL — apply by hand in Supabase SQL Editor. Idempotent.
-- Verify after: the SELECT at the bottom must show both lengths >= 2000.
-- =============================================================================

DO $$
DECLARE
  v_course UUID; v_ch UUID;
BEGIN
  -- ── 1. Scrum: The Scrum Values ─────────────────────────────────────────────
  SELECT id INTO v_course FROM public.courses WHERE curriculum_version = 'v3.0';
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_course ORDER BY order_index LIMIT 1;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Scrum M1 not found'; END IF;

  UPDATE public.videos SET
    translations = jsonb_set(coalesce(translations, '{}'::jsonb), '{en,transcript}', to_jsonb(
'THE FIVE SCRUM VALUES

Scrum names five values: Commitment, Focus, Openness, Respect, and Courage. They are not a poster for the team room. The Scrum Guide is explicit: empiricism only works when these values are lived, because transparency, inspection, and adaptation each demand something human from the team.

COMMITMENT
The team commits to its goals and to supporting each other. Commitment in Scrum is not a promise to deliver a fixed scope by a fixed date — it is dedication to the Sprint Goal and to the team. A committed team says "we will give this goal everything we have," not "we guarantee these 14 tickets."

FOCUS
The Sprint exists to create focus: one goal, one timebox, one team. Focus means saying no — to mid-Sprint scope injection, to work outside the Sprint Goal, to the third "urgent" request this week. The Scrum Master protects focus; every context switch taxes the team roughly 20 percent of its capacity.

OPENNESS
The team and its stakeholders are open about the work and the challenges. Openness is what makes transparency possible: a burndown chart is only honest if the people updating it are. Bad news early is a gift; bad news late is a crisis.

RESPECT
Team members respect each other as capable, independent professionals. Respect shows up in how disagreement is handled: attack the problem, never the person. It is also the foundation of psychological safety — the single strongest predictor of team performance in Google''s Project Aristotle research.

COURAGE
The team has the courage to do the right thing and work on hard problems. Courage is telling a stakeholder the release will slip, questioning a Product Owner''s priority with evidence, or admitting in the Retrospective that your own process failed the team.

HOW THE VALUES POWER EMPIRICISM
Transparency requires openness and courage — you cannot inspect what people hide. Inspection requires respect — findings must be safe to surface. Adaptation requires commitment and focus — change costs energy, and only a committed team pays it willingly. Remove one value and the empirical loop quietly breaks.

AI APPLICATION: VALUES AS THE HUMAN LAYER
AI can surface risks, forecast delivery, and draft improvements — but every one of those signals lands in a room of humans. Courage decides whether the risk is spoken aloud. Openness decides whether the data was honest to begin with. As AI takes over the mechanical parts of Scrum, the values become the Scrum Master''s primary differentiator: they are the one part of the framework that cannot be automated.'
    ))
  WHERE chapter_id = v_ch
    AND (title ILIKE '%scrum values%' OR order_index = 2);

  -- ── 2. Cyber: Security Policy Lifecycle (M7 GRC, lesson 4) ────────────────
  SELECT id INTO v_course FROM public.courses WHERE curriculum_version = 'cyber-v1';
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_course AND order_index = 7;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Cyber M7 not found'; END IF;

  UPDATE public.videos SET
    translations = jsonb_set(coalesce(translations, '{}'::jsonb), '{en,transcript}', to_jsonb(
'SECURITY POLICY LIFECYCLE — CREATION, APPROVAL, TRAINING & ENFORCEMENT

A security policy is governance made binding: the bridge between what the board decided and what an employee does at 9 a.m. on a Tuesday. Policies that live in a forgotten drive protect nothing. The lifecycle is what keeps them alive.

THE POLICY HIERARCHY
Four layers, each more specific than the last. POLICIES state the rules and carry authority ("all production access requires MFA"). STANDARDS make them measurable ("MFA means FIDO2 or TOTP, never SMS"). PROCEDURES make them executable (the step-by-step enrollment guide). GUIDELINES advise where flexibility is acceptable. Auditors read down this chain; when a procedure contradicts its policy, the finding writes itself.

STAGE 1 — CREATION
Start from a real driver: a framework requirement (ISO 27001 Annex A, SOC 2 criteria), a regulation, an incident, or a risk-register entry. Draft with the people who must live under the policy — a rule written without operations in the room becomes shadow-IT fuel. Every policy needs an owner, a scope, definitions, the rules, exceptions handling, and consequences.

STAGE 2 — APPROVAL
Policies bind the organization, so authority must sign: typically the CISO recommends, an executive or the board ratifies. Record the approval — version, date, approver. Unapproved policies are opinions.

STAGE 3 — PUBLICATION & TRAINING
A policy nobody has read is legally and practically weak. Publish in one canonical location, announce the change, and train to the level of risk: annual all-hands awareness for the acceptable-use policy, role-specific training for privileged-access rules. Capture attestations — "I have read and understood" — because auditors and courts both ask for them.

STAGE 4 — ENFORCEMENT
Enforce technically where possible (the MFA policy is best enforced by the identity platform, not by memos) and administratively where not. Apply consequences consistently — selective enforcement is worse than none, and discrimination claims are built on it. Track exceptions formally: owner, reason, compensating control, expiry date.

STAGE 5 — REVIEW & RETIREMENT
Review on a clock (annually at minimum) and on triggers: incidents, new regulations, business change. Version every revision; retire what no longer applies. A policy library''s health metric is simple — what percentage was reviewed on schedule this year?

AI APPLICATION: THE POLICY COPILOT
AI now drafts policy from framework mappings, flags contradictions across the library, personalizes training by role, and monitors telemetry for violations of machine-readable rules. The GRC professional''s job shifts from writing prose to owning the lifecycle: deciding what the rules should be, and proving to auditors that the loop — create, approve, train, enforce, review — actually ran.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;
END $$;

-- ── Verification (run after) — both must be >= 2000 ───────────────────────────
SELECT co.curriculum_version, v.title,
       length(v.translations->'en'->>'transcript') AS transcript_len
FROM public.videos v
JOIN public.chapters c ON c.id = v.chapter_id
JOIN public.courses co ON co.id = c.course_id
WHERE (co.curriculum_version = 'v3.0'     AND c.order_index = 1 AND v.title ILIKE '%scrum values%')
   OR (co.curriculum_version = 'cyber-v1' AND c.order_index = 7 AND v.order_index = 4);
