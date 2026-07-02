# Institutional Registry — Dashboard Specification

**Status: DESIGN — awaiting founder approval. Extends the cockpit; no UI
redesign. Conforms to the AIOS 60-Second Rule (below-the-fold section).**

## Registry panel (cockpit, below the fold)

- **Headline strip**: total records · by classification (7 chips, counts) ·
  **Unknown queue size in amber when > 0** · mean maturity · reviews due.
- **The Unknown queue** (highest-value element): risk-ordered list
  (publish-direct+destructive first), each row → evidence + the founder-walk
  step that resolves it. Empty state: "No unknown capabilities — the
  institution is fully classified."
- **Class browser**: filter by class/department/classification; row =
  name · owner · maturity 0–5 dots · readiness (or —) · next review.
- **Drift banner**: scanner/registry discrepancies (should be impossible if
  CI is green — shown red if runtime scan disagrees).

## Data model (already designed, partly existing)

`getInstitutionalRegistry()` (new, mirrors `getGovernanceHealth` shape) +
`getPendingFounderActions()` extended with the Unknown queue. All pure
functions over the records; zero new DB tables.

## Access

Founder-only (`FounderRoute`), like every governance surface.
