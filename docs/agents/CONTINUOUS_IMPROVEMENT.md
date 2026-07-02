# Continuous Improvement Mode — Operating Doctrine

Status: **Operating doctrine for the AI Workforce.** Subordinate to the platform
canon (`/docs/standards`, especially `LAUNCH_DECISION_PRINCIPLE.md`) and the
AOS infrastructure canon (`AGENT_OPERATING_SYSTEM.md`).

## The doctrine

Every department operates as an always-observing intelligence unit:

```
Observe → Analyze → Validate → Score confidence → Recommend
   → GOVERNANCE (gates → founder approval) → Implement → Measure → Learn
```

No department makes production changes directly. The only path to change is:

```
Research → Evidence → Work Order → QA → Security → Founder Approval
   → Deployment → Measurement → Company Brain
```

## Implementation map

| Doctrine step | Code |
|---|---|
| Observe | `services/aos/observers.ts` — 9 built-in observers over live telemetry |
| Analyze / Validate / Score | `services/aos/intelligence.ts` — findings carry evidence + confidence(+basis) |
| Recommend | `openRecommendation()` — validated contract, opens `recommendation` work orders |
| Governance | `services/aos/orchestration.ts` — gates → evidence-gated founder approval |
| Measure | `recordImpactMeasurement()` — outcome vs. success metrics, on the order + Brain |
| Learn | Company Brain categories `impact-measurement`, `executive-report` |
| Report | `services/aos/briefings.ts` — daily/weekly/monthly/quarterly, staleness-tracked |

## The recommendation contract (mandatory)

Every recommendation must carry — enforced by `validateRecommendation`, which
throws on violation:

- **Evidence** (≥1 note; empty notes rejected)
- **Confidence** (0–1 **with a stated basis** — a score without a basis is a vibe)
- **Estimated impact** · **Estimated effort**
- **Risks** (≥1 — "none identified" must be said explicitly)
- **Dependencies**
- **Success metrics** (≥1 — how we will know it worked)

Findings below **0.6 confidence never auto-open work orders**. Sweeps are
idempotent — an open order with the same title is never duplicated.

## Honesty constraints (non-negotiable)

1. **Internal telemetry only.** Observers read live platform data with
   defensive queries. Where a source is missing, the observer reports the gap;
   it never invents a number.
2. **External research is NOT connected.** Employer demand, competitor
   benchmarks, and market intelligence require a server-side ingestion path
   (edge function + founder-approved sources). Until that ships, the
   analytics observer reports this as a standing finding with a
   recommendation to build it — no external claims are made.
3. **"Always-on" is bounded by Phase-1 reality.** There is no server
   scheduler. Cycles and briefings run when triggered (founder action,
   orchestrator tick, cockpit use). True autonomy requires the Phase-2 edge
   function + cron, which the founder applies by hand.

## Optimization targets

Student career transformation · educational quality · platform excellence ·
security · accessibility · performance · employer relevance · product
innovation · operational efficiency · long-term strategic advantage — in the
dependency order the ARCHITECTURE_PRINCIPLE defines (competency data is the
root; cosmetic work never outranks it).

## Cadences

| Report | Source | Staleness |
|---|---|---|
| Real-time department health | Cockpit agent grid + intelligence sweeps | live |
| Daily CEO Briefing | `generateExecutiveReport('daily')` (+ CEO agent's business report) | 24h |
| Weekly Executive Report | `generateExecutiveReport('weekly')` | 7d |
| Monthly Strategic Review | `generateExecutiveReport('monthly')` | 30d |
| Quarterly Roadmap | `generateExecutiveReport('quarterly')` | 90d |

All reports compile from the same live sources as the cockpit and are stored
in the Company Brain (`executive-report`) with generation stamps — a stale
cadence shows as **due**, never silently pretends to be current.
