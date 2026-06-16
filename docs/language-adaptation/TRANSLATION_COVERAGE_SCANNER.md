# Translation Coverage Scanner

> Status: **Infrastructure / measurement only.** Not launch-critical. The scanner
> reads source and produces reports; it performs no writes to the database and no
> production integration.

## Purpose

Convert the vague question "is the platform translated?" into a concrete,
per-language, per-dimension **number**, plus a worklist of exactly what is
missing. It is the measurement half of the
[Global Language Adaptation Agent](./LANGUAGE_ADAPTATION_ARCHITECTURE.md).

## Location

```
src/agents/global-language-adaptation/scanner/
├── types.ts          shared report types
├── coverage.ts       parses LanguageContext → per-language key coverage (pure)
├── scanHardcoded.ts  heuristic hunt for hardcoded English in src/ (pure I/O)
├── run.ts            CLI entry → writes JSON reports + console summary
└── README.md         quick-start
```

## How to run

```bash
npx tsx src/agents/global-language-adaptation/scanner/run.ts
```

Outputs to `./language-reports/` (gitignored):

| File | Contents |
|---|---|
| `coverage.json` | per-language i18n key coverage (present/total, missing, identical-to-English) |
| `missing-translations.json` | flat `(language, string_key, surface, reason)` rows — seed for `language_missing_translations` |
| `hardcoded.json` | heuristic worklist of hardcoded English in `src/pages` + `src/components` |

The scanner **does not** write to Supabase. Loading reports into
`language_quality_scores` / `language_missing_translations` is a separate,
reviewed, founder-run step (see the Migration Plan in the agent folder).

## How coverage is computed

`coverage.ts` parses `src/contexts/LanguageContext.tsx` — the authoritative i18n
key registry — text-first (one key per line is the established format, and the
file is a 633 KB React module that should not be imported into a Node script).

For each of the supported languages it compares against the canonical English
key set. A key is counted as **untranslated** when it is either:

1. **missing** for that language, or
2. **byte-identical to the English value** (a strong signal of an untranslated
   placeholder).

```
coveragePercent = (totalKeys - missing - identicalToEnglish) / totalKeys × 100
```

## What `scanHardcoded` detects

Two signals across `.tsx`/`.jsx` in `src/pages` + `src/components`:

1. JSX text nodes — `>Some English words<`
2. user-facing props — `title|label|placeholder|alt|aria-label="..."`

A line is skipped when it already calls `t(` (already internationalized). This
collector **over-reports on purpose**: it is triage producing a worklist, not a
build gate. The authoritative coverage number comes from `coverage.ts`.

## Baseline finding (first run, 2026-06-16)

| Observation | Implication |
|---|---|
| Supported UI languages score ≈46–97% on **keys alone** | Even "done" languages have gaps |
| ~1,180 hardcoded-English findings across ~258 files | Large surface bypasses `t()` |
| Lesson bodies, quizzes, diagrams are **not in the dictionary at all** | Biggest gaps are unmeasured by Phase 1 |

This empirically confirms the original problem: switching language only swaps a
subset of labels.

## Scope limits (read these)

The Phase-1 scanner measures **UI string keys** and **hardcoded UI text**. It
does **not yet** measure lesson titles/bodies, quiz questions/answers, or diagram
labels, because that content does not live in the i18n dictionary. Those
dimensions are modelled in `runtime/completeness.ts` and become measurable in
Phase 2 once content carries per-language metadata.

## Extending: one shape, many collectors

Every collector emits the same `LanguageCoverage` shape
(`{ dimension: { translated, total } }`, see `runtime/completeness.ts`). The
completeness evaluator combines them into one per-language verdict. Adding a
content source = adding a collector, never rewriting the scorer. Planned
collectors: `scanCourseContent`, `scanQuizzes` (reads `quiz_questions`,
read-only), `scanSimulations`, `scanDiagrams`, and a reviewed
`loadToSupabase` loader.

## Guardrails

- Read-only against the codebase; no DB writes.
- No production integration; runs on demand / on the agent's `daily` cadence.
- Heuristic output is advisory, never a CI hard-fail.
