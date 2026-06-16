# Dashboard Route Plan — Language Quality Command Center

> Founder-only dashboard (responsibility #6). This is the **route + data plan**; the page is
> built in a later step (build order keeps structure-first). It plugs into the existing
> founder portal, not a new auth system.

## Route

| Item | Value |
|---|---|
| Path | `/founder/language-quality` |
| Page component | `src/pages/founder/FounderLanguageQuality.tsx` (to create) |
| Access gate | Wrap in existing `<FounderRoute>` (see `src/components/FounderRoute.tsx`) |
| Role check | `useRole().isFounder` (email-based, `src/lib/roles.ts`) — same as other founder pages |
| Registration | Add a `<Route>` in `src/App.tsx` beside `/founder/control-center`, `/founder/curriculum`, `/founder/readiness` |
| Nav entry | Add a launchpad tile in `FounderPortal.tsx` |

> Mirrors the existing founder pages exactly (`FounderControlCenter`, `FounderCurriculum`,
> `FounderReadiness`) so it inherits the founder gate, layout, and preview-mode behavior.

## Data sources

- **`language_quality_scores`** — latest scan per (language, surface) → coverage %, missing
  counts, last scan date.
- **`language_missing_translations`** — grouped counts by language × surface (lesson/quiz/
  diagram breakdowns).
- **`language_student_submissions`** — counts by `review_state` (pending/approved/rejected).
- **`language_vocabulary_entries`** — approved vocabulary counts per language.
- Until tables are live, the page can read `scanner/reports/baseline-coverage.json` as a
  static fallback so the dashboard renders before the DB phase ships.

## Layout

### 1. Language overview table (one row per language)

| Column | Source |
|---|---|
| Language | config `UI_LANGUAGES` + `languageNames` |
| Translation coverage % | `language_quality_scores` (surface='overall') |
| Missing strings count | `language_missing_translations` count |
| Missing **lesson** translations | missing where surface in (lesson-titles, lesson-body) |
| Missing **quiz** translations | missing where surface in (quiz-questions, quiz-answers, quiz-feedback) |
| Missing **diagram** translations | missing where surface='diagrams' |
| Vocabulary pending review | submissions where review_state in (unreviewed, ai-reviewed, human-reviewed) |
| Approved vocabulary | vocabulary_entries where review_state='approved' |
| Rejected vocabulary | submissions where review_state='rejected' |
| Active? | all activation-blocking surfaces == 100% (config `ACTIVATION_RULES`) |
| Last scan date | max(`language_quality_scores.scanned_at`) |

Visual: per-row coverage bar; red badge when below 100% on any blocking surface; "Active"
pill only at full completeness.

### 2. Language detail drawer (on row click)

- Surface-by-surface coverage breakdown (from `surface-registry.ts` order).
- Top missing items (deep links to the content: lesson/quiz/diagram id).
- "Rescan" action (founder-triggered; calls scanner Phase-4 + refreshes scores).

### 3. Submission review panel

- Queue of `language_student_submissions` by `review_state`, filterable by language.
- Approve / reject actions (writes go through governance pipeline, not direct publish).
- Highlights Basaa submissions and their enrichment status (see integration doc).

## States to handle

- **No scan yet** → empty state + "Run first scan" guidance.
- **Basaa pending** → show `bas` as a target at 0% with a "not yet wired into i18n" note.
- **Fallback active** → surface count of runtime `language_missing_translations`
  (`source='runtime-fallback'`) so the founder sees what students actually hit.

## Out of scope for the route plan

Actual page implementation, charts, and the rescan endpoint are later build steps; this
document fixes the route, gate, data contract, and columns so the build is unambiguous.
