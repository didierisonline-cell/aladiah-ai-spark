> **Status: Canonical** — Required reading for: Claude Code · AI agents · QA agents · developers · product owners.
> Part of the Aladiah platform canon (`/docs/standards`): NORTH_STAR (why) · ARCHITECTURE_PRINCIPLE (what qualifies) · COMPETENCY_TAXONOMY (how competency is named) · QA_STANDARD (what "Ready"/"Done" mean) · PROGRAM_VALIDATION_GATE (how a module proves it works before the next is built).
> Append-only where noted; do not delete or fork. Changes to this document are platform-level decisions.

# PROGRAM_VALIDATION_GATE.md — The Reusable Module Validation Gate

**Truth before scale. Prove one module completely before multiplying it 15 times.**

This is the single, program-agnostic gate **every** flagship program runs on **every**
module before authoring the next one. **No custom rules per program.** BA, PM, Scrum, Data
Analyst, and Cybersecurity all use this exact gate. It operationalizes the founder-ratified
**"Truth before scale"** doctrine (no Module N+1 until Module N is GREEN) into ten concrete,
evidenced checks.

It does not replace QA_STANDARD.md — it is the runnable instance of it. QA_STANDARD defines
what "Done" *means*; this defines the *steps you walk* to prove a module is done, and what
evidence each step must leave behind.

**Two levels of GREEN (keep them distinct):**
- **Module GREEN** = the 10-point gate (Gates 1–4) passes for one module → the *next module*
  is authorized. This is the per-module loop.
- **Program GREEN** = every module is Module-GREEN **and** Gate 5 (Employment Readiness)
  passes → the program is *career-transformation ready* and launchable as a credential.

Employment Readiness is deliberately **program-level, not per-module**: resume, LinkedIn,
approved capstone, and mock interview are end-of-program outcomes (the capstone is the final
module). Forcing them onto Module 1 would deadlock the program — Module 1 can't have an
approved capstone. So Gate 5 runs **once, when the full program is assembled**, before the
program is declared GREEN.

---

## How it maps to the five gates

```
PER-MODULE  (run on every module; pass → authorize next module)
  Gate 1  Content QA          → checks 1–2
  Gate 2  Exam QA             → checks 3–4
  Gate 3  Student-Flow QA     → checks 5–7
  Gate 4  Founder Validation  → checks 8–10
            ↓
          MODULE GREEN  → Module N+1 authorized   (any fail → Blocker, STOP expansion)

PROGRAM-LEVEL  (run once, when all modules are Module-GREEN)
  Gate 5  Employment Readiness QA  → checks E1–E5
            ↓
          PROGRAM GREEN  → career-ready, launchable as a credential
```

Why Gate 5 exists: Aladiah's promise is **career transformation, not course completion**
(NORTH_STAR). A program where every module "works" but no graduate leaves with a resume,
portfolio, and interview readiness has not delivered the mission. Gate 5 makes the final
gate reflect the promise.

---

## The per-module gate — 10 checks (Gates 1–4)

A module is **Module-GREEN** only when all ten pass **with evidence attached**. A check
without its evidence is a claim, not a pass (QA_STANDARD: "a checkbox is a claim; evidence
is proof").

| # | Check | What it proves | Required evidence | Fail severity |
|---|---|---|---|---|
| 1 | **Content exists** | Lessons authored, no placeholders, no hallucinations, cases real | reviewer + date + lesson URLs + notes | Major |
| 2 | **Competencies mapped** | Every question carries a **non-null** registered slug (COMPETENCY_TAXONOMY) | verification query: `0` null competencies + slug distribution | **Blocker** |
| 3 | **Quiz loads** | The quiz renders for a student (options show, no crash) | screenshot / recording of the loaded quiz | **Blocker** |
| 4 | **Quiz grades correctly** | Right answer passes, wrong answer fails, score computed | test attempt: pass-path + fail-path result | **Blocker** |
| 5 | **Progress saved** | A `user_progress` row is written on completion | row screenshot / `select` showing the saved row | **Blocker** |
| 6 | **Module completion recorded** | Finishing all lessons + exam marks the module complete | completion state screenshot / query | **Blocker** |
| 7 | **Certificate eligibility updated** | Passing the module moves the student toward cert eligibility | eligibility flag / readiness delta evidence | Major |
| 8 | **Founder walkthrough completed** | The founder personally walked the full student path | founder sign-off + date | **Blocker** |
| 9 | **Evidence attached** | Every check above has its artifact, collected in one place | the module's readiness-evidence doc | Major |
| 10 | **QA signoff** | QA division approved against QA_STANDARD DoD | QA approval ID + date | **Blocker** (gating) |

**Pass rule:** all 10 pass + evidence attached → **Module-GREEN** → next module authorized.
**Fail rule:** any **Blocker**-severity check fails → open a `BLK-###` in the Launch Command
Center, **STOP module expansion** until resolved. Majors proceed with a named owner + due date
but the module is not Module-GREEN until they close.

---

## Gate 5 — Employment Readiness QA (program-level)

Runs **once**, when every module is Module-GREEN and the capstone exists. **A program is not
PROGRAM-GREEN — and may not launch as a credential — until all five pass.** This gate makes
the launch framework reflect the mission: career transformation, not course completion
(NORTH_STAR Pillar 5 — Career Transformation Engine).

| # | Check | What it proves | Required evidence | Fail severity |
|---|---|---|---|---|
| E1 | **Resume generated** | The program outputs a real, role-targeted resume from the student's artifacts | generated resume file/link | **Blocker** |
| E2 | **LinkedIn profile completed** | Profile reflects the competencies and portfolio earned | profile URL / completion evidence | **Blocker** |
| E3 | **Portfolio artifact exists** | At least one defensible, employer-recognizable artifact is produced | artifact file/link (e.g., Cyber Risk Register) | **Blocker** |
| E4 | **Mock interview passed** | Student can defend their work in interview conditions (AI mock-interview prep — distinct from the Cert-v2 board defense) | mock-interview score/transcript | **Blocker** |
| E5 | **Capstone approved** | Founder/QA-approved capstone demonstrates end-to-end capability | approved capstone ID + sign-off | **Blocker** |

**Relationship to the Certificate gate (no conflict):** the MVP certificate
(*pass exams + capstone + founder approval*) is the credential issued to a student. Gate 5 is
the *program-readiness* check that the program can reliably PRODUCE employable graduates
before it launches. E4's "mock interview" is AI interview prep (Pillar 5), **not** the
boardroom defense panel — that remains Certificate v2.

---

## Why each Blocker is a Blocker

Checks 2–6, 8, 10 sit on the **core learning / money / trust path**. If any fails, the
program cannot reliably take a student from signup to certificate — which is the entire MVP
definition (QA_STANDARD Launch Doctrine). A broken one of these, multiplied across 15
modules, is exactly the failure this gate exists to prevent: *15 broken modules / 300 broken
questions / 50 broken simulations.*

---

## How a program runs the gate (the loop)

```
Author Module N (to flagship quality)
   → Generate seed + verification (founder-applied, no auto-apply)
   → Founder applies seed, runs verification, walks the student flow
   → Collect evidence into MODULE_0N_READINESS_EVIDENCE.md
   → Run the 10-point gate (Gates 1–4)
        Module-GREEN  → authorize Module N+1
        not GREEN → open Blocker, fix Module N, re-run gate

   ... when ALL modules are Module-GREEN and the capstone exists ...
   → Run Gate 5 (Employment Readiness QA)
        all E1–E5 pass → PROGRAM-GREEN → launch as a credential
        any fail → Blocker, program not launchable
```

Module 1 of any program is the **proving ground**: it validates the engine. Once Module 1 is
Module-GREEN, Modules 2–N are *replication of the same shape*, each still passing Gates 1–4.
PROGRAM-GREEN comes last, only after Gate 5.

---

## Instance log (cross-program tracker)

One row per module that has entered or passed the gate. This is the single source of truth
for "what is actually proven," distinct from "what is authored." Update on each gate run.

| Program | Module | Authored | Gate status | Evidence doc | Notes |
|---|---|---|---|---|---|
| Cybersecurity | M1 — Foundations & Risk Thinking | ✅ | ⏳ Awaiting Founder Validation (checks 3–10) | `docs/programs/cyber/MODULE_01_READINESS_EVIDENCE.md` | Seed built; checks 1–2 ready to verify; not GREEN |
| Business Analyst | — | (15 authored) | not yet run through this gate | — | Retrofit recommended before scaling cert flow |
| Project Manager | — | — | — | — | — |
| Scrum Master | — | — | — | — | — |
| Data Analyst | — | — | — | — | — |

---

*Canonical reusable gate. Ratified 2026-06-21 alongside "Truth before scale" and the
Certificate MVP gate. v2 (2026-06-21) added Gate 5 — Employment Readiness QA (program-level),
so the launch framework reflects the mission: career transformation, not course completion.
Every program uses this gate unchanged — no per-program forks.*
