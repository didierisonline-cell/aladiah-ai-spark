> **Status: Readiness evidence — Cyber flagship Module 1 publish package.**
> Scored against QA_STANDARD.md (Launch Readiness Formula · Evidence Schema · Severity Tiers).
> Honest state, not a claim. A checkbox is a claim; this lists the evidence behind each.

# Cyber Module 1 — Readiness Evidence

## Scope of this package

The **reviewable, founder-applied publish package for Module 1 only** (no Modules 2–15).
No DB writes were made; no SQL was auto-applied. Deliverables:

| File | Purpose |
|---|---|
| `supabase/seeds/cyber/module_01_seed.sql` | Idempotent seed (founder pastes into Supabase SQL editor) |
| `supabase/seeds/cyber/module_01_verify.sql` | Read-only verification + Quiz-QA evidence queries |
| `docs/programs/cyber/MODULE_01_FLAGSHIP_PACKAGE.md` | Content source of truth |
| this file | Readiness evidence |

Placed **outside `supabase/migrations/`** so `supabase db push` cannot auto-apply it.

## What the seed creates (verified against live schema 2026-06-21)

- 1 course `Cybersecurity Professional (Flagship)` — `is_flagship=true`,
  `launch_status='internal'`, **`is_published=false`** (not student-facing; publishing is a
  separate QA-gated decision), distinct from the legacy course (untouched).
- 1 module (chapter) → 5 lessons (videos) → 5 `mini_video` quizzes + 1 `chapter_end` exam.
- 24 quiz questions, **every one carrying a non-null `cyber:` competency slug** (the gap the
  legacy/BA seeds left open). Questions `status='draft'` — authored, not yet QA-approved.

## Launch Readiness Formula — scored honestly

Two framings (the formula is program-level; this is a one-module proof):

| Dimension (weight) | Module-1 proof | Program (1 of 15 modules) | Evidence |
|---|---|---|---|
| Content (25%) | ~90% | ~7% | 5 lessons authored w/ cases & spine — MODULE_01_FLAGSHIP_PACKAGE.md §2 |
| Assessment (20%) | ~75% | ~5% | 24 tagged Qs seeded; **pool <20 unique → Major** |
| Simulation (20%) | ~25% | ~2% | Ransomware + IR War Room **specs authored, not wired** |
| Portfolio (10%) | ~30% | ~2% | Risk Register template defined; generation not wired |
| Certification (10%) | ~30% | ~2% | Board-defense rubric defined; not wired |
| Translation (5%) | 0% | 0% | Not started — Major (not a launch blocker for internal proof) |
| Security (5%, gating) | pending | pending | `is_published=false`; quiz RLS exists; needs Security QA signoff before any publish |
| QA Signoff (5%, gating) | pending | pending | Awaiting QA division review of this package |

**Module-1 engine-proof readiness ≈ 55%** (content/assessment strong; simulation, portfolio,
certification are authored specs not yet wired into the platform).
**Program readiness ≈ 4%** — by design. Cyber stays Program #5; this does not change launch order.

## Blockers (Severity: BLOCKER — would stop a launch)

- **None introduced by this package.** It writes nothing and exposes nothing
  (`is_published=false`). The *prerequisite* to the live student-flow test below is simply
  that the founder applies the seed — that is a pending action, not a defect.

## Majors (proceed with owner + due date)

| ID (proposed) | Major | Why | Owner |
|---|---|---|---|
| MAJ-C01 | Question pool <20 unique (have 12) | QA DoD: "20+ question pool, rotating" | Cyber |
| MAJ-C02 | Simulation not wired | Ransomware + IR War Room are specs, not running on the sim engine | Cyber + Sim engine |
| MAJ-C03 | Portfolio/certification generation not wired | Risk Register + defense score not auto-produced yet | Cyber |
| MAJ-C04 | Translation not started | EN only; multilingual per voice/translation standard | Translation |
| MAJ-C05 | Questions `status='draft'` | Not yet founder/QA approved | QA |

## Student-flow verification — the founder-run gate

The directive's check (`Enroll → Open lesson → Complete → Quiz → Pass → Progress saved`)
**cannot be run by me** (no DB writes, and `is_published=false`). It runs after the founder:

1. Applies `module_01_seed.sql` in the Supabase SQL editor.
2. Runs `module_01_verify.sql` — **query (4) must return 0 null competencies** (else BLOCKER).
3. In an internal/test context, temporarily flips `is_published=true` (or uses an admin view)
   and walks the path: enroll → open a lesson → mark complete → take the mini quiz → pass
   (≥70) → confirm a `user_progress` row is written.

Report back only: **readiness %, blockers, evidence** — and whether progress saved.

## Decision needed from founder (per QA reporting)

- **Apply the Module 1 seed?** (Yes → run seed + verify → walk the student flow.)
- **Certificate gate (MVP):** lock to *Pass module exams + submit capstone artifact* now;
  defer *defense + board review* to Certificate v2 (matches Launch Doctrine).

---

*No Modules 2–15 authored. Engine not declared proven until the student flow above passes
live and produces the four outputs. Then 2–15 become replication.*
