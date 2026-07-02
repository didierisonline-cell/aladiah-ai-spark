# The Aladiah Intelligence Architecture — v1 (production-safe)

Status: **Canonical architecture for the intelligence layer.** Subordinate to
`/docs/standards` (especially `LAUNCH_DECISION_PRINCIPLE.md`), built on the AOS
(`AGENT_OPERATING_SYSTEM.md`) and operated per `CONTINUOUS_IMPROVEMENT.md`.

**Prime directive:** intelligence informs; it never executes. The only path to
production change remains
`Research → Evidence → Work Order → QA → Security → Founder Approval → Deployment → Measurement → Company Brain`.

---

## The ten components

| # | Component | Implementation | v1 status |
|---|---|---|---|
| 1 | **Intelligence sources** | `services/aos/observers.ts` — 9 observers over live internal telemetry (security & UX posture, ops findings, subscriptions, curriculum readiness, quiz attempts, pipeline tables). Each declares its `source`; unreadable sources are reported as findings, never guessed. | ✅ internal · ❌ external (see §External) |
| 2 | **Evidence validation** | Two gates: `validateFinding()` drops evidence-less findings at cycle time (counted as `invalidFindings`, never rendered); `validateRecommendation()` throws `InvalidRecommendationError` before any work order opens. | ✅ enforced + tested |
| 3 | **Confidence scoring** | `ConfidenceScore { value: 0–1, basis }` — the basis is mandatory. `RECOMMEND_CONFIDENCE_THRESHOLD = 0.6`; `shouldRecommend()` is pure and tested. | ✅ enforced + tested |
| 4 | **Department ownership** | Every finding/recommendation carries its owning agent slug; recommendations name collaborators; gate reviews route via `GATE_REVIEWERS`. | ✅ |
| 5 | **Work order creation** | `openRecommendation()` — validated contract → `recommendation` work order. Dedup via `findDuplicate()` (case/whitespace-normalized titles; completed/rejected orders never block re-raising). | ✅ enforced + tested |
| 6 | **Company Brain storage** | Cycles → agent memory (`intelligence-cycle` tag); briefings → `executive-report`; impact → `impact-measurement`; readiness → `readiness-history`. All on `aos_agent_memory` — zero new tables. | ✅ |
| 7 | **Founder approval** | Recommendation orders enter the Founder Approval Queue; approval is evidence-gated (`EvidenceRequiredError`) and records a decision — it never publishes or deploys. | ✅ |
| 8 | **Impact measurement** | `recordImpactMeasurement()` — measured outcome vs. the order's own success metrics, written to its evidence trail + the Brain + the Event Bus. Cockpit queues completed orders lacking measurement. | ✅ |
| 9 | **Reporting cadence** | `services/aos/briefings.ts` — daily/weekly/monthly/quarterly compiled from live state, staleness-tracked (`due`/`current`). | ✅ (on-demand; scheduler = Phase 2) |
| 10 | **Dashboard visibility** | `getIntelligenceStatus()` — at-rest, reload-surviving status: per-department last cycle, fresh/stale (24h), criticals flag, open recommendations, source list, external marker. Rendered on the cockpit IntelligencePanel before any sweep. | ✅ |

## External intelligence (the honest boundary)

`EXTERNAL_INTELLIGENCE_CONNECTED = false` (`services/aos/intelligence.ts`) is a
**structural fact**, surfaced permanently on the cockpit. Employer demand,
competitor benchmarks, and market research require a server-side ingestion
path (Supabase edge function + founder-approved source list + attribution and
freshness stamps). Until that ships:

- no external claims are made anywhere in the system;
- the analytics observer keeps a standing finding + recommendation to build
  the ingestion path;
- flipping the flag without shipping the integration is a canon violation.

## Safety invariants (enforced in code)

1. **No production publishing / deployment / content modification** — the
   intelligence layer only opens `recommendation` work orders; execution stays
   behind each agent's founder-gated surface.
2. **No fabricated data** — findings without evidence are dropped at the gate;
   confidence without a basis is invalid; missing sources are reported as
   missing.
3. **No duplication spam** — sweeps are idempotent (`findDuplicate`).
4. **No new tables** — everything layers on `aos_*` under existing admin RLS.
5. **Founder approval preserved** — unchanged evidence-gated pipeline.

## Test coverage

`src/services/aos/intelligence.test.ts` — recommendation contract (7),
finding evidence gate (5), confidence threshold (3), duplicate prevention (3);
plus governance invariants in `workOrders.test.ts` and posture honesty in
`uxPosture.test.ts`. 30 tests total.
