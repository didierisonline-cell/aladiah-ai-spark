# Translation Coverage Scanner — Plan

> The scanner is **read-only**. It never writes to the app, translation files, or the DB.
> v0.1 is implemented and runnable (`coverage-scanner.mjs`); later phases are specified here.

## Goal

Scan every visible string in the app, detect untranslated and hardcoded content per
surface, and produce a **translation coverage score per language** that the founder
dashboard and the Language Completeness Rules consume.

## What it detects (by surface)

Per `surface-registry.ts`: navigation, buttons, ui-labels, alerts/feedback, course titles,
lesson titles, lesson body, quiz questions, quiz answers, quiz feedback, simulations,
diagram labels, transcripts, AI tutor.

## Phased implementation

### Phase 1 — Static source (✅ implemented, v0.1)
Runs with plain Node, no app/DB access:
1. **Key coverage** — parse `LanguageContext.tsx` translation blocks; for each declared
   language compute `coveredBaselineKeys / baselineKeys(en)`.
2. **Dangling refs** — collect `t('…')` / `T('…')` usages; flag keys referenced in code but
   absent from the `en` baseline (these render raw/fallback).
3. **Hardcoded-English heuristic** — flag JSX text nodes not wrapped in `t()` as candidates
   for triage (intentionally conservative; produces candidates, not verdicts).

Output: console summary + `--json` + `--md` reports (committed under `reports/`).

**First-run baseline (committed):** 571 `en` keys; only `es`/`fr` at 100%; a cluster at
~65%; `yo` at 47.5%; 83 dangling refs; ~1,013 hardcoded candidates. Basaa absent (0%).

### Phase 2 — DB content (✅ implemented, v0.2-db → `db-coverage-scanner.mjs`)
Read-only Supabase mode (anon/publishable key from `client.ts`, SELECT-only via PostgREST):
- `courses.translations`, `chapters.translations`, `videos.translations` — % of rows with a
  non-empty entry for each language (title vs body sub-fields scored separately). Handles
  both `{lang:{title,…}}` and `{title:{lang}}` JSON shapes. Denominator = rows whose
  baseline (`en`) field is non-empty.
- `quiz_questions` — probes for a `translations` column. It does **not** exist yet, so when
  reachable the scanner marks quiz surfaces **schema-pending → 0%** for non-baseline
  languages until the additive migration (`database/database-migration-plan.md`) is applied.
- Languages are measured **English/French first** (primary), then secondary, then **Basaa**
  (add-on), mirroring `PRIORITY_ORDER` in `global-language-config.ts`.

> **Network requirement:** this scanner needs outbound access to `*.supabase.co`. In the
> remote web environment the host must be on the **egress allowlist**; otherwise the scanner
> reports `reachable: false` and measures nothing (it never fabricates coverage). It also
> degrades gracefully (exit 0) so it is CI-safe without creds. Run:
> ```bash
> node src/agents/global-language-adaptation/scanner/db-coverage-scanner.mjs \
>   --json .../reports/db-coverage.json --md .../reports/db-coverage.md
> ```

### Phase 3 — Static data & diagrams (planned)
- `src/data/simulations.ts` — detect language fields (none today → 0% non-en) and size the
  backlog (~2,800 simulations).
- SVG diagrams — extract `<text>` nodes from diagram components; cross-check against
  `diagram_label_set` metadata; report labels lacking translations.

### Phase 4 — Persist & trend (planned)
Write each scan's per-(language, surface) result to `language_quality_scores`, and
static-detected gaps to `language_missing_translations` (`source: 'scanner'`). Enables the
dashboard's coverage %, missing counts, and last-scan date, plus trend over time.

## Coverage scoring model

```
surface_coverage(lang, surface) = translated_strings / total_strings(baseline)
overall(lang) = weighted mean across activation-blocking surfaces
active(lang)  = ALL activation-blocking surfaces == 100%
```

Activation-blocking surfaces are defined in `ACTIVATION_RULES` (config). Non-blocking
surfaces (simulations, transcripts, ai-tutor) are reported but don't gate activation in v1.

## How to run

```bash
node src/agents/global-language-adaptation/scanner/coverage-scanner.mjs \
  --json src/agents/global-language-adaptation/scanner/reports/baseline-coverage.json \
  --md   src/agents/global-language-adaptation/scanner/reports/baseline-coverage.md
```

Intended later as a CI check (fail if a "active"-marked language drops below 100%) and a
manual founder-triggered rescan that updates `language_quality_scores`.

## Known limitations (v0.1)

- Hardcoded detection is heuristic — expect false positives (code-like text) and false
  negatives (strings in attributes like `placeholder`/`aria-label`, template literals).
  Phase 2+ will add attribute scanning and an ignore-list.
- Key-block parser assumes the current `LanguageContext.tsx` object shape; if that file is
  restructured, re-validate the parser.
- DB, simulation, and diagram surfaces are **not** scored until their phases land — so a
  language at 100% UI-key coverage is **not** yet "active".
