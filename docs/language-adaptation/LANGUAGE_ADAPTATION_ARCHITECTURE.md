# Language Adaptation Architecture

> Status: **Approved strategic parallel initiative — NOT launch-critical.**
> Phase 1 (infrastructure) is complete. No production integration until launch
> blockers are closed (Security Hardening Mode).

## Mission

Ensure every supported language adapts the **entire** Aladiah experience — UI,
navigation, course content, lesson titles and bodies, quizzes, simulations,
diagrams, buttons, student portal, founder-portal labels, alerts, and
transcripts — not just a subset of UI labels. A Basaa student must experience
the whole platform in Basaa; the same holds for every language.

## Architecture-test result (canon gate)

Per `/docs/standards/ARCHITECTURE_PRINCIPLE.md`:

- **Serves ≥ 1 Core System** — **System 1 (Competency Measurement)**: a learner
  cannot demonstrate competency on a quiz or lesson they cannot read, so
  trustworthy competency data requires assessments in the learner's language.
  Also serves **System 2 (Personalization)** — language is the most fundamental
  personalization axis.
- **Blocks 0 Core Systems** — additive tables, additive scanner, one additive
  founder route. Nothing existing is renamed or removed.
- **North Star fit** — advances **Rule 7** (Africa + Caribbean first → Cameroon →
  Basaa) without derailing Rule 1 foundation priorities.

→ **Approved to build.** Prioritization (North Star's job): a *parallel*
initiative, deliberately behind security/payments/launch readiness.

## Layered design

```
┌──────────────────────────────────────────────────────────────────────┐
│ MEASUREMENT          Translation Coverage Scanner (read-only)          │
│  coverage.ts · scanHardcoded.ts · run.ts → language-reports/*.json      │
└───────────────────────────────┬──────────────────────────────────────┘
                                 ▼ (reviewed, founder-run load — Phase 3)
┌──────────────────────────────────────────────────────────────────────┐
│ DATA (Supabase, RLS)                                                    │
│  Shared:  language_translation_memory · language_vocabulary_entries     │
│           language_student_submissions · language_review_queue          │
│           language_quality_scores · language_missing_translations       │
│  Basaa:   basaa_dictionary_entries · basaa_sentence_pairs               │
│           basaa_tech_terms · basaa_translation_memory                   │
│           basaa_quality_reviews                                         │
│  RPC:     log_missing_translation()  (SECURITY DEFINER)                 │
└───────────────────────────────┬──────────────────────────────────────┘
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│ RUNTIME (pure, not yet wired to production UI — Phase 2)                │
│  completeness.ts  (the "active unless 100%" gate)                       │
│  fallback.ts      (FR→EN graceful fallback + auto-log missing)          │
└───────────────────────────────┬──────────────────────────────────────┘
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│ SURFACE (founder-only)                                                  │
│  /founder/language-quality → Language Quality Command Center            │
└──────────────────────────────────────────────────────────────────────┘
```

## Components

| Component | Path | Role |
|---|---|---|
| Agent manifest | `src/agents/global-language-adaptation/manifest.ts` | AOS registry descriptor; `publish:false`, `human_approval_required:true` |
| Scanner | `src/agents/global-language-adaptation/scanner/` | per-language coverage + hardcoded-English worklist |
| Completeness rules | `…/runtime/completeness.ts` | 9-dimension "active" gate |
| Fallback | `…/runtime/fallback.ts` | FR→EN fallback + `log_missing_translation` |
| Schema | `supabase/migrations/20260616000000_language_adaptation.sql` | 11 tables + RPC (apply by hand) |
| Basaa extension | `src/agents/african-languages/basaa/` | see [BASAA_EXTENSION.md](./BASAA_EXTENSION.md) |
| Dashboard | `/founder/language-quality` | see [LANGUAGE_QUALITY_COMMAND_CENTER.md](./LANGUAGE_QUALITY_COMMAND_CENTER.md) |

## Language Completeness Rules

A language is **not "active"** unless every dimension is 100%: navigation,
buttons, course titles, lesson titles, lesson body, quiz questions, quiz answers,
feedback messages, and diagrams (translated OR replaced with a translated
SVG/image asset). Encoded in `runtime/completeness.ts → evaluateCompleteness()`,
which returns `isActive` only when no dimension is below 100%.

## Governance (enforced by schema, not convention)

Every student-sourced entry carries a review status:

```
unreviewed → ai_reviewed → human_reviewed → approved
                                          ↘ rejected
```

- **Never auto-publish.** Submissions land `unreviewed`.
- **Only `approved` entries become official Aladiah vocabulary** and are exposed
  to students (RLS `USING (status = 'approved')`).
- AI review may advance to `ai_reviewed` but **cannot** set `approved`; only
  founders/admins (`aos_is_admin()`) approve.
- Tables are append-only (no DELETE policy) — the language record is preserved.

## Canon compliance

- SQL delivered as a **reviewable, apply-by-hand** migration; nothing
  auto-applied. No `.env` / live-DB writes.
- Additive and non-destructive; `vite build` passes.
- Translated quizzes must preserve each question's single Axis-1 competency slug
  (`/docs/standards/COMPETENCY_TAXONOMY.md`) — translation changes wording, never
  the competency tag.

## Build phases

| Phase | Scope | State |
|---|---|---|
| 1 | Scanner, schemas, registry, runtime, dashboard, Basaa workflow, docs | **Complete (this initiative)** |
| 2 | Content collectors; wire fallback/capture into live UI | **Deferred** — blocked behind launch-readiness |
| 3 | Reviewed loader: reports → `language_quality_scores` / `language_missing_translations` | Deferred |

**No production integration until launch blockers are closed.**
