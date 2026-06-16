# Translation Coverage Scanner

The measurement half of the Global Language Adaptation Agent. It answers
"how much of Aladiah is *actually* in language X?" and "where is English still
hardcoded?".

## Run

```bash
npx tsx src/agents/global-language-adaptation/scanner/run.ts
```

Writes to `./language-reports/` (gitignored):

| File | Contents |
|---|---|
| `coverage.json` | per-language i18n key coverage (present/total, missing, identical-to-English) |
| `missing-translations.json` | flat `(language, string_key, surface, reason)` rows — seed for `language_missing_translations` |
| `hardcoded.json` | heuristic worklist of hardcoded English in `src/pages` + `src/components` |

## What each module does

- **`coverage.ts`** — parses `src/contexts/LanguageContext.tsx` (the i18n key
  registry) and compares every language against the canonical English key set.
  A key counts as *untranslated* if it is **missing** OR its value is
  **byte-identical to English** (a placeholder). Pure function — unit-testable.
- **`scanHardcoded.ts`** — walks `.tsx`/`.jsx` for JSX text nodes and
  user-facing props (`title`, `label`, `placeholder`, `alt`, `aria-label`) that
  do not flow through `t()`. Heuristic: over-reports on purpose.
- **`run.ts`** — orchestrates both and writes the reports + a console summary.

## Important scope limits (read these)

The current scanner measures **UI string keys** and **hardcoded UI text**.
It does **not yet** measure the three biggest gaps, because that content does
not live in the i18n dictionary at all:

- **Lesson titles & bodies** — stored in course data / DB, not `t()` keys.
- **Quiz questions & answers** — stored in `quiz_questions`.
- **Diagram labels** — currently baked into components/SVG as English.

Those dimensions are modelled in
[`runtime/completeness.ts`](../runtime/completeness.ts) and become measurable
once the content tables carry per-language columns/rows (see
[`docs/MIGRATION_PLAN.md`](../docs/MIGRATION_PLAN.md)). The scanner is structured
so each new content source is a new collector feeding the same
`CompletenessDimension` shape — extend, don't rewrite.

## Roadmap (collectors to add)

1. `scanCourseContent.ts` → reads course/lesson sources → lessonTitles, lessonBody.
2. `scanQuizzes.ts` → reads `quiz_questions` (read-only) → quizQuestions, quizAnswers.
3. `scanDiagrams.ts` → reads diagram registry → diagrams dimension.
4. `loadToSupabase.ts` → upserts `coverage.json` into `language_quality_scores`
   and `missing-translations.json` into `language_missing_translations`
   (reviewed, founder-run — never automatic).
