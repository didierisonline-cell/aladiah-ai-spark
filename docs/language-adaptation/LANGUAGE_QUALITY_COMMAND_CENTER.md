# Language Quality Command Center

> Status: **Founder-only dashboard, live in the build.** Read-only surface. It
> renders a calm empty-state until the Phase-1 migration is applied by hand, so
> it is safe to ship ahead of the SQL.

## What it is

The founder's single view of localization health: per-language coverage, the
missing-content registry, and the student-sourced vocabulary review funnel. It is
the reporting surface of the
[Global Language Adaptation Agent](./LANGUAGE_ADAPTATION_ARCHITECTURE.md).

## Access

| Item | Value |
|---|---|
| Route | `/founder/language-quality` |
| Guard | `<FounderRoute>` (same as every founder/admin page) |
| Page | `src/pages/founder/LanguageCommandCenter.tsx` |
| Body | `src/components/founder/language/LanguageQualityDashboard.tsx` |
| Nav | entry in `src/lib/founderNav.ts` (`FOUNDER_NAV_ITEMS`), icon `Globe` |

It reuses the standard founder shell (`Header` + `FounderNav` + body), matching
`FounderControlCenter` and the other founder pages.

## Columns (per language)

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
- **Active?** badge — green only when every completeness dimension is 100%

Rows are sorted by coverage ascending, so the worst-covered languages surface
first.

## Data sources

| Column(s) | Source |
|---|---|
| coverage %, missing\_\*, last scan, active | latest row per language in `language_quality_scores` |
| missing strings (live) | unresolved rows in `language_missing_translations`, summed per language |
| pending / approved / rejected vocab | `language_vocabulary_entries` grouped by `status` |

The dashboard aggregates client-side (fetch all → group), keeping it simple and
resilient.

## Resilience (important)

The Phase-1 migration is applied **by hand**, so the tables may not exist when
the page first loads. The dashboard therefore:

- queries defensively (`try/catch`; casts through `any` because the generated
  `Database` types don't include the new tables until regenerated),
- on a missing-table / permission error shows a calm
  *"Language tables not found — apply the migration to activate this dashboard"*
  state instead of crashing,
- shows skeleton loaders while fetching.

This keeps `vite build` green and the route safe to ship before the SQL is
applied.

## Not included yet (Phase 2+, deferred)

- Inline Basaa review queue (approve/reject from the dashboard).
- Per-language coverage trend sparkline (from dated `language_quality_scores`).
- "Top missing keys" drill-down ordered by `miss_count`.

These are deferred while the project is in Security Hardening Mode; the language
adaptation system is an approved parallel initiative, not a launch-critical path.
