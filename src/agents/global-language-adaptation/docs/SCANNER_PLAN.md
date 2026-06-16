# Translation Coverage Scanner Plan

## Goal

Make "how much of Aladiah is actually in language X?" a **number**, per language,
per dimension — and produce a worklist of exactly what is missing.

## What ships now (Phase 1)

`scanner/` — runnable today:

```bash
npx tsx src/agents/global-language-adaptation/scanner/run.ts
```

- **`coverage.ts`** parses `src/contexts/LanguageContext.tsx` and, for each of
  the 21 languages, computes present/total i18n keys, **missing** keys, and keys
  whose value is **byte-identical to English** (an untranslated placeholder).
- **`scanHardcoded.ts`** flags hardcoded English in `src/pages` + `src/components`
  (JSX text + `title|label|placeholder|alt|aria-label` props not routed through
  `t()`).
- **`run.ts`** writes `language-reports/{coverage,missing-translations,hardcoded}.json`
  and prints a summary table.

### Baseline finding (first run, 2026-06-16)

Even "supported" UI languages are far from complete on keys alone (≈46–97%), and
there are ~1,200 hardcoded-English findings. Lesson bodies, quizzes, and diagrams
are **not in the dictionary at all** — confirming the reported problem and
proving why a coverage score is needed.

## Detection responsibilities (spec mapping)

| Spec requirement | Collector | Status |
|---|---|---|
| Scan every visible string | `coverage` + `scanHardcoded` | Phase 1 (UI) |
| Detect hardcoded English text | `scanHardcoded` | Phase 1 |
| Untranslated course content / lesson titles | `scanCourseContent` | Phase 2 |
| Untranslated quiz text | `scanQuizzes` (reads `quiz_questions`, read-only) | Phase 2 |
| Untranslated simulation content | `scanSimulations` | Phase 2 |
| Untranslated diagram labels | `scanDiagrams` | Phase 2 |
| Untranslated sidebar/nav labels | `coverage` (`nav.*` keys) | Phase 1 |
| Untranslated dashboard cards | `scanHardcoded` + `coverage` | Phase 1 |
| Coverage score per language | `coverage` → `language_quality_scores` | Phase 1 score / Phase 3 load |

## Architecture: one shape, many collectors

Every collector emits the same `LanguageCoverage` shape (see
`runtime/completeness.ts`): `{ dimension: { translated, total } }`. The
completeness evaluator combines them into one per-language verdict. Adding a
content source = adding a collector, never rewriting the scorer.

## Heuristic honesty

`scanHardcoded` is triage, not a compiler: it over-reports (e.g. enum-ish props)
on purpose so nothing slips through. Its output is a worklist, **not** a build
gate. The authoritative coverage number comes from `coverage.ts` (UI) and, in
Phase 2, from the content collectors.

## Cadence

The agent runs `daily` (see `manifest.ts`). Each run writes a dated row into
`language_quality_scores` so the dashboard can show trend + "last scan date".
