# Global Language Adaptation Agent

> Status: **Foundation scaffold (Phase 1).** Infrastructure only — scanner,
> schemas, registry, dashboard, and the Basaa learning-memory workflow.
> **No bulk translation has been performed yet** (per build-order item 9).

## Mission

Ensure every supported language fully adapts the **entire** Aladiah experience —
UI, navigation, course content, lesson titles, lesson bodies, quizzes,
simulations, diagrams, buttons, student portal, founder-portal labels, alerts,
and transcripts. A Basaa student must experience the whole platform in Basaa;
the same holds for every language.

## The problem this agent exists to solve

Today, switching language only swaps a subset of UI labels (the keys in
`src/contexts/LanguageContext.tsx`). Lesson bodies, course content, diagram
labels, and many UI sections stay in English. There is no measurement of *how
much* of the product is actually translated, no registry of what is missing,
and no pipeline for capturing language knowledge from native speakers. This
agent supplies all three.

## Architecture-test result (canon gate)

Per `/docs/standards/ARCHITECTURE_PRINCIPLE.md`:

- **Serves ≥ 1 Core System** — **System 1 (Competency Measurement):** a learner
  cannot demonstrate competency on a quiz or lesson they cannot read; trustworthy
  competency data requires the assessment to be in the learner's language.
  Also serves **System 2 (Personalization)** — language is the most fundamental
  personalization axis.
- **Blocks 0 Core Systems** — additive tables, additive scanner, additive
  founder route. Nothing existing is renamed or removed.
- **North Star fit** — directly advances **Rule 7** (Africa + Caribbean first →
  *Cameroon* → Basaa) without derailing the Rule 1 foundation priorities.

→ **Approved to build.**

## What is in this folder

```
global-language-adaptation/
├── README.md                  ← you are here
├── manifest.ts                ← AOS agent descriptor (registry seed)
├── runtime/
│   ├── completeness.ts        ← Language Completeness Rules (the "active" gate)
│   └── fallback.ts            ← graceful fallback + auto-log missing translations
├── scanner/
│   ├── README.md
│   ├── types.ts
│   ├── coverage.ts            ← parses LanguageContext → per-language coverage
│   ├── scanHardcoded.ts       ← heuristic hunt for hardcoded English in src/
│   └── run.ts                 ← CLI entry → writes JSON reports
├── schemas/
│   └── 0001_language_adaptation.sql   ← source of the reviewable migration
└── docs/
    ├── MIGRATION_PLAN.md
    ├── SCANNER_PLAN.md
    ├── BASAA_LEARNING_MEMORY.md
    ├── DASHBOARD_PLAN.md
    ├── INTEGRATION_BASAA.md
    └── QA_CHECKLIST.md
```

The companion Basaa-specific agent lives at
[`src/agents/african-languages/basaa/`](../african-languages/basaa/README.md).

The founder dashboard ("Language Quality Command Center") is wired at
`/founder/language-quality` →
`src/pages/founder/LanguageCommandCenter.tsx` →
`src/components/founder/language/LanguageQualityDashboard.tsx`.

## Core responsibilities (and where each lives)

| # | Responsibility | Implementation |
|---|---|---|
| 1 | Full Translation Coverage Scanner | `scanner/` + `docs/SCANNER_PLAN.md` |
| 2 | Language Completeness Rules | `runtime/completeness.ts` |
| 3 | Basaa Learning Memory Engine | `docs/BASAA_LEARNING_MEMORY.md` + `../african-languages/basaa/` |
| 4 | Translation Memory tables | `schemas/0001_language_adaptation.sql` |
| 5 | Basaa-specific extension | `../african-languages/basaa/` + `docs/INTEGRATION_BASAA.md` |
| 6 | Founder dashboard | `docs/DASHBOARD_PLAN.md` + dashboard route |
| 7 | Student experience / fallback | `runtime/fallback.ts` |
| 8 | Translatable diagrams | `docs/MIGRATION_PLAN.md` §diagrams + schema `diagram_label` rows |
| 9 | Build order | this README (Phase 1 = infrastructure first) |
| 10 | Safety & governance | review-status state machine in schema + `BASAA_LEARNING_MEMORY.md` |

## Governance (non-negotiable)

Every student-sourced language entry carries a review status:

```
unreviewed → ai_reviewed → human_reviewed → approved
                                          ↘ rejected
```

**Only `approved` entries become official Aladiah vocabulary.** Student
submissions are **never** auto-published. This is enforced by the schema
(`CHECK` constraint + RLS: students insert, only founders approve) and described
in `docs/BASAA_LEARNING_MEMORY.md`.

## How to run the scanner

```bash
npx tsx src/agents/global-language-adaptation/scanner/run.ts
# writes ./language-reports/{coverage,missing-translations,hardcoded}.json
```

## Delivery rules followed (CLAUDE.md canon)

- SQL is delivered as a **reviewable migration file** the human applies by hand
  in Supabase (`supabase/migrations/20260616000000_language_adaptation.sql`).
  Claude Code did **not** auto-apply it.
- No `.env` or live-DB writes were made.
- This change is **additive and non-destructive** — it adds files and one
  founder route; it does not modify `LanguageContext.tsx` or any existing flow.
