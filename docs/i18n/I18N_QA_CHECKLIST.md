# Rendered i18n QA Checklist (8 languages × 10 surfaces)

This is the **manual, rendered-proof** gate. The static gate (`npm run
audit:i18n-live`) and DB gate (`npm run audit:i18n-data`) do **not** replace it —
they catch code/data regressions, not what a student actually sees.

> Claude Code runs headless in this environment (no browser, prod returns 403 to
> it), so it cannot capture these screenshots. Run this on the deployed build and
> record results. Each cell: ✅ correct / ⚠️ partial / ❌ foreign-language leak.

## How to run each language
1. Set UI language to the target (selector persists to `localStorage['aladiah_lang']`).
2. Hard-refresh once, then **switch language live again** without refreshing to
   confirm reactivity (Prof. Didier card + Next Action must change instantly).
3. For Arabic, confirm `dir="rtl"` on `<html>` and that Latin tokens (Aladiah,
   Scrum, AI, AWS) stay LTR inside the RTL flow.

## Matrix

| # | Surface | EN | ES | FR | PT | DE | AR | ZH | HI |
|---|---|----|----|----|----|----|----|----|----|
| 1 | Dashboard / Overview chrome (nav, stat labels) | | | | | | | | |
| 2 | Prof. Didier card (greeting + body + recommendation) | | | | | | | | |
| 3 | Next Action card ("Continue: …" + course name) | | | | | | | | |
| 4 | AI Workforce Programs section (program card titles) | | | | | | | | |
| 5 | Course card grid (`/portal/courses`) titles + descriptions | | | | | | | | |
| 6 | Scrum course detail (hero title + module list) | | | | | | | | |
| 7 | Lesson page (title + **body**) | | | | | | | | |
| 8 | Transcript panel | | | | | | | | |
| 9 | Diagram / visual area (labels) | | | | | | | | |
| 10 | Quiz / certification entry | | | | | | | | |

## Expected source of truth per surface (what "correct" means)

| Surface | Localized by | If it shows English/wrong-lang, the gap is… |
|---|---|---|
| 1 chrome | `t()` / `overviewT()` dictionary | **code** — missing dict key (audit:i18n-live catches) |
| 2 Prof. Didier | `composeProfFirstMessage` (UI language) | **code** — fixed; rebuild/redeploy if stale |
| 3 Next Action | `programCatalog` + `getLocalizedField` | **code** — title; **data** if a non-catalog course |
| 4 program cards | `programCatalog` + `getLocalizedField` | **code** — fixed via catalog |
| 5 course grid | DB `courses.translations` → catalog (title) | title=**code**; **description=DATA** (populate) |
| 6 Scrum detail | title=catalog; modules=DB `chapters.translations` | title=**code**; module list=**DATA** |
| 7 lesson body | DB `videos.translations.description` | **DATA** — render code already correct |
| 8 transcript | DB `videos.translations.transcript` | **DATA** — render code already correct |
| 9 diagrams | `generate-visuals` (language-scoped cache) | **code** — fixed; re-gen per language |
| 10 quiz | DB `quiz_questions.translations` | **DATA** — needs population |

## Known data-dependent rows (expect English until populated)
Run `docs/i18n/translation_leakage_audit.sql` in Supabase to enumerate exactly
which `courses` / `chapters` / `videos` / `quiz_questions` rows still lack each
language. Lesson body (7), transcript (8), descriptions (5/6), and quiz (10) are
**data** surfaces: the render code is correct but has only English to show until
`translate-content` is run / the populate SQL is applied.
