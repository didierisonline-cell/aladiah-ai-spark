# Institutional Registry — KPI Dictionary

**Status: DESIGN — awaiting founder approval. These are the Registry
capability's OWN KPIs (per FD-001, every capability carries its own KPI
dictionary). The institution-wide KPI Dictionary is a separate capability,
sequenced after the Registry.**

| KPI | Formula | Target | Owner | Cadence | Source |
|---|---|---|---|---|---|
| **Registry Coverage** | discovered capabilities with records ÷ discovered capabilities | 100% (CI-enforced) | operations-platform | every CI run | scanner |
| **Classification Coverage** | records with classification ≠ unknown ÷ all records | ≥ 95% steady-state | founder | weekly brief | registry |
| **Unknown Queue Age** | max days any record has been `unknown` | ≤ 14 days | founder | daily brief | registry |
| **Mean Engineering Maturity** | mean(maturity 0–5) across non-archived records | ≥ 3.0 within two quarters | operations-platform | monthly report | registry |
| **Review Currency** | records past nextReview ÷ all active records | ≤ 5% | owning departments | weekly | registry |
| **Drift MTTR** | time from scanner/registry discrepancy to green CI | ≤ 2 days | operations-platform | per incident | CI + events |
| **Brain Mirror Freshness** | records mirrored at current version ÷ all records | 100% after each founder session | analytics-intelligence | per session | brain sync |

Honesty rules apply: each KPI reports its coverage; none is fabricated when a
source is empty (a registry of zero records has undefined maturity, shown —).
