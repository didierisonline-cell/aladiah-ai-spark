# Capability Genome — Validation Rules (design)

**Status: DESIGN.** Pure-function rules; every violation reported at once
(pattern proven by `validateRecommendation`/`validateFinding`). CI-enforced.

| # | Rule | Amendment |
|---|---|---|
| V1 | All 35 loci present; absent locus = invalid (missing/unknown/n·a are values, not absences) | VI |
| V2 | `id` matches `<type>:<kebab>`; immutable across history | V |
| V3 | Computed loci (accessibility, translation, qaStatus, maturity, readiness) reject manual assertion: validator recomputes from evidence and fails on mismatch | III |
| V4 | `classification: unknown` ⇒ maturity = 0, lifecycle ∈ {proposed, draft}, no readiness | III |
| V5 | Every output with `writesProduction: true` names a non-null `approvalGate` | — (F-1 rule) |
| V6 | `dependencies`, descent refs (derivedFrom/supersedes/replacedBy/parent/children) resolve; graph acyclic | I |
| V7 | `evolution` ≥ 1 event; first event kind `created` with authority evidence | I |
| V8 | `standards` includes `capability-genome-standard`; non-archived genomes reference ≥ 1 constitution volume or governing canon key | II |
| V9 | Lifecycle transitions follow the Amendment IV order; `deprecated→retired` requires a founder-approved work-order reference; retired genomes are never removed | IV |
| V10 | `ratifiedOn` non-null ⇔ a `ratified`-equivalent evolution event with founder authority exists | I |
| V11 | Every date parses; `nextReview` > `lastReview`; retired genomes exempt from review currency | — |
| V12 | Honesty rendering: unmeasured/unknown must serialize as `—`, never 0 or 100 | III |
