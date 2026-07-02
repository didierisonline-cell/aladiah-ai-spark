# Agent Spec — Curriculum Excellence Authority

Status: **Canonical spec for Agent #11 of the Aladiah AI Workforce.**
(Backfilled from the operating implementation — this agent ran before its spec
was written; the spec documents what the code verifiably does.)

## 1. Identity & mission
- **Slug:** `curriculum-excellence` · **Cadence:** weekly · **Priority:** 18.
- **Mission:** Make every Aladiah program world-class — transform Course
  Completion into Career Transformation. NOT a generic content agent: it is
  the standard-holder that audits programs and delegates builds.

## 2. What it owns
- The **Curriculum Excellence Framework** (`docs/curriculum/CURRICULUM_EXCELLENCE_FRAMEWORK.md`):
  curriculum, assessment, simulation, lab, portfolio, employability, and
  AI-integration standards (`src/services/agents/curriculum/standards.ts`).
- The **18-module redesign blueprint** (`blueprint18.ts`) — each module:
  lesson content, AI mentor, tool-based lab, enterprise-realistic simulation,
  portfolio artifact, three quiz tiers, competency assessment. AI integrated
  throughout, never as a final chapter.
- Program scoring via `scoreBlueprint` (`src/services/standards/programStandard.ts`).

## 3. What the audit does (v1, read-only)
`curriculumRunner` → audit cycle (`src/services/agents/curriculumExcellenceAgent.ts`):
- Audits the pilot program (AI Scrum Master) against `MODULE_REQUIRED_ELEMENTS`,
  mapping each required element to the artifact type that satisfies it.
- Produces a **gap report** (`curriculum_audits` domain table) with per-module
  missing elements.
- **Delegates module builds to the Product Builder** (`enqueueProductTask`) —
  builds are QA-gated, founder-approved, and consumed by Student Success and
  Placement.
- Reports to the CEO agent; stores audit memory; logs every action.

## 4. Role in orchestration
Owner of `curriculum`-type work orders and named collaborator on
curriculum-gap recommendations from Continuous Intelligence (readiness
observer). Its outputs flow: Curriculum Excellence → Product Builder → QA →
Founder Approval — never directly to production.

## 5. Approval rules
**Read-only on production curriculum.** Permissions: `read:true, write:false,
publish:false, human_approval_required:true`. It delegates and audits; it does
not modify live content.

## 6. AOS + Control Center
Auto-registers via `bootstrap.ts`; surfaces at `/admin/curriculum-excellence`;
health/tasks/memory roll up through the AOS; appears on the cockpit Agent
Operating Grid.
