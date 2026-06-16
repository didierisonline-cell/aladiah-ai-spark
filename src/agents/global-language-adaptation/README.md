# Global Language Adaptation Agent

> Module: `/src/agents/global-language-adaptation/`. Owns **full-platform language
> adaptation** and the **Language Quality Command Center** (founder-only).

## Mission

Ensure every supported language fully adapts the **entire** Aladiah experience — UI, course
content, lessons, quizzes, simulations, diagrams, buttons, navigation, student portal,
founder portal labels, alerts, and transcripts. A Basaa student must experience the whole
website in Basaa; the same holds for every language.

## The problem this fixes (measured, not assumed)

Today, switching language translates *some* labels while lesson bodies, diagrams, quizzes,
and many UI sections stay in English. The v0.1 scanner quantifies it against the real
`src/contexts/LanguageContext.tsx` (baseline `en` = **571 keys**):

| Finding | Value |
|---|---|
| Languages declared | 21 |
| UI-string coverage at 100% | only `es`, `fr` (and `en`) |
| Large group stuck at ~65% | `hi, ko, nl, pl, tr, sw, ha, ig, vi, th` |
| Worst | `yo` at **47.5%** |
| Keys referenced in code but missing from `en` baseline | **83** |
| Hardcoded-English JSX candidates (heuristic) | **~1,013** |
| **Basaa** | not a declared language → **0%** |

> Numbers above are the committed baseline in `scanner/reports/baseline-coverage.md`.
> And crucially: this only measures **UI strings**. DB lesson bodies, quizzes, simulations,
> and diagrams are additional, larger gaps measured in later scanner phases.

## How the platform works today (what we build on)

- **i18n:** custom React context — `src/contexts/LanguageContext.tsx` exposes `t(key)`,
  `language`, `setLanguage`. Language persists to `localStorage('aladiah_lang')` +
  `profiles.preferred_language`. Switcher: `src/components/portal/PortalLangWidget.tsx`.
- **Content:** Supabase `courses`/`chapters`/`videos` have a `translations` JSON column;
  `quiz_questions` and simulations do **not** (monolingual today).
- **Diagrams:** hardcoded English `<text>` in SVG (e.g. `ArchitectureDiagramViewer.tsx`).
- **Founder gate:** `FounderRoute` + `useRole` (email-based, `src/lib/roles.ts`); founder
  pages in `src/pages/founder/`.

## What's in this module

```
global-language-adaptation/
  README.md
  global-language-config.ts        ← typed contract: languages, completeness rules, fallback
  scanner/
    coverage-scanner.mjs           ← RUNNABLE read-only scanner (v0.1)
    surface-registry.ts            ← catalog of translatable surfaces + scan method per surface
    scanner-plan.md                ← full scanner design + phased roadmap
    reports/baseline-coverage.{md,json}  ← committed baseline from the first run
  schemas/                         ← JSON Schemas for the 6 language tables + diagram labels
  database/database-migration-plan.md    ← reviewable SQL plan (human-applied)
  workflows/
    basaa-learning-memory-workflow.md
    student-submission-governance.md
  dashboard/dashboard-route-plan.md       ← Language Quality Command Center route
  integration/basaa-agent-integration.md  ← link to the Basaa Agent module
  QA-CHECKLIST.md
```

## Language Completeness Rules

A language is **not "active"** unless every activation-blocking surface is **100%**:
navigation, buttons, course titles, lesson titles, lesson body, quiz questions, quiz
answers, feedback messages, and diagrams (translated labels/assets or captions). See
`ACTIVATION_RULES` in `global-language-config.ts`.

## Student experience rule (fallback)

When a student picks Basaa, the system attempts Basaa everywhere (menus, lessons, quizzes,
feedback, AI tutor, diagrams). If a Basaa string is missing, it shows a graceful notice —
**"Basaa translation pending. Showing French/English version temporarily."** — and
**logs the gap** to `language_missing_translations` (Basaa falls back FR → EN). See
`FALLBACK_POLICY`.

## Governance (non-negotiable)

Student submissions are **never auto-published**. Lifecycle:
`unreviewed → ai-reviewed → human-reviewed → approved | rejected`. Only `approved` entries
become official Aladiah vocabulary. Details in `workflows/student-submission-governance.md`.

## Build order (per request — structure first, not mass translation)

1. ✅ Scanner (runnable v0.1) + committed baseline.
2. ✅ Database plan + schemas + missing-translation registry.
3. ✅ Dashboard route plan (Language Quality Command Center).
4. ✅ Basaa learning-memory workflow + Basaa Agent integration points.
5. ⏭ Later: DB/diagram scanner phases, runtime fallback logger, then actual translation.

## Canon alignment

Serves NORTH_STAR Rule 7 (Africa/Caribbean-first → learners in their own language).
Data-foundation + quality-gate layer; blocks no Core System. Does **not** extend the
competency taxonomy. Per repo canon: **no live-DB writes / no auto-applied SQL** — the
migration plan is delivered for human application in Supabase, then verified with `SELECT`.
