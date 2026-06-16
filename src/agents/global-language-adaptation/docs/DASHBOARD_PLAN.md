# Language Quality Command Center — Dashboard Plan

Founder-only surface that turns the scanner + registry into a decision tool.

## Route

| Item | Value |
|---|---|
| Path | `/founder/language-quality` |
| Guard | `<FounderRoute>` (same as every other founder/admin page) |
| Page | `src/pages/founder/LanguageCommandCenter.tsx` |
| Body | `src/components/founder/language/LanguageQualityDashboard.tsx` |
| Nav | added to `src/lib/founderNav.ts` (`FOUNDER_NAV_ITEMS`) so it appears in the shared founder/admin nav everywhere |

Mirrors the existing founder page shell (`Header` + `FounderNav` + body), so it
is visually and structurally consistent with `FounderControlCenter` etc.

## Per-language table (the required columns)

For every language the dashboard shows:

- Language (name + code)
- Translation coverage %
- Missing strings count
- Missing lesson translations
- Missing quiz translations
- Missing diagram translations
- Student-submitted vocabulary **pending** review
- **Approved** vocabulary
- **Rejected** vocabulary
- Last scan date
- "Active?" badge (green only when all completeness dimensions are 100%)

## Data sources

| Column | Source |
|---|---|
| coverage %, missing\_\* , last scan, active | latest row per language in `language_quality_scores` |
| missing strings (live) | `language_missing_translations` (unresolved) grouped by language |
| pending / approved / rejected vocab | `language_vocabulary_entries` + `language_student_submissions` grouped by `status` |

## Resilience (important)

The Phase-1 migration is applied **by hand**, so the tables may not exist yet
when the page first loads. The dashboard therefore:

- queries defensively (`try/catch`, `as any` casts — generated `Database` types
  don't include the new tables until regenerated),
- on a missing-table / permission error shows a calm "Run the language
  migration to activate this dashboard" empty-state instead of crashing,
- shows a per-card loading state while fetching.

This keeps the build green and the route safe to ship before the SQL is applied.

## Future panels (Phase 2+)

- Basaa review queue inline (approve/reject from the dashboard via the same
  founder RLS used by the question review queue).
- Coverage trend sparkline per language (from dated `language_quality_scores`).
- "Top missing keys" drill-down per language from `language_missing_translations`
  ordered by `miss_count`.
