# Governance & Architecture Diagrams

Status: **Reference (v0.1).** ASCII on purpose — diagrams that live in git diff
like everything else.

## 1. Authority chain

**The spine (Founder Constitutional Decision, 2026-07-02):**
Covenant → Constitution → Founder Standards → Organizational Charter →
Enterprise Architecture → Intelligence Architecture → AIOS →
Department Charters → Operational Policies → Implementation.

```
                    ┌─────────────────────────┐
                    │  THE COVENANT (root)     │
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │  CONSTITUTION (draft)    │
                    └────────────┬────────────┘
        composes, does not replace, the ratified canon
   ┌───────────────┬─────────────┼──────────────┬────────────────┐
   ▼               ▼             ▼              ▼                ▼
NORTH_STAR   LAUNCH_DECISION  ARCHITECTURE  COMPETENCY    AGENT_OPERATING
(ratified)   _PRINCIPLE       _PRINCIPLE    _TAXONOMY     _SYSTEM
             (ratified,root)  (ratified)    (ratified)    (ratified)
   │               │             │              │                │
   ▼               ▼             ▼              ▼                ▼
PROGRAM_      QA_STANDARD   enterprise-   quiz tagging   CONTINUOUS_
STANDARD_V1   + runbooks    architecture  + analytics    IMPROVEMENT (review)
EMPLOYMENT_                 (draft)                          │
VALUE_GATE                                                   ▼
                                                intelligence-architecture
                                                        (review)
```

## 2. The governance pipeline (every production change)

```
Research → Evidence → Work Order → QA gate → Security gate
   → Translation gate → UX gate → FOUNDER APPROVAL (evidence-required)
   → Deployment (founder-applied) → Impact Measurement → Company Brain
```

## 3. The operating loop (Continuous Intelligence)

```
 9 observers ──► findings (evidence + confidence gate)
      │                 │ conf ≥ 0.6 + valid
      │                 ▼
      │         recommendation work orders (deduped)
      │                 │
      ▼                 ▼
 agent memory    governance pipeline (above)
      │                 │ approved + shipped
      ▼                 ▼
 cockpit status   impact measurement ──► Company Brain ──► next cycle
```
