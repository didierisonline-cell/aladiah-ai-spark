# Research Institute Handbook — scaffold

**Status: DRAFT v0.1 scaffold.** Registry key: `research-institute-handbook`.
**Owner:** analytics-intelligence · **Parent:** Intelligence Architecture.

Governance for external research and market intelligence. Written BEFORE the
capability exists on purpose: per the Intelligence Architecture,
`EXTERNAL_INTELLIGENCE_CONNECTED = false` is a structural fact, and no
external claim may enter the system until an approved ingestion path ships.
This handbook is the precondition for flipping that flag.

## Reserved chapters (to be authored before ingestion ships)

1. **Approved sources** — the founder-ratified source list (job boards,
   salary data, competitor curricula); nothing outside it is ingested.
2. **Attribution & freshness** — every external datum carries source +
   retrieved-at; stale evidence expires (canon rule).
3. **Quality tiers** — how sources are scored and weighted.
4. **The ingestion pipeline** — edge function architecture, storage tables,
   review cadence.
5. **Research ethics** — what Aladiah will not collect.

## Current state (honest)

No external ingestion exists. The analytics observer maintains a standing
finding + recommendation to build it. Until this handbook is ratified and the
pipeline is founder-approved, all intelligence is internal telemetry only.
