> **Status: Canonical — The Root Operating Principle**
> Required reading for: all agents · all teams · all decision-makers.
> Non-negotiable. Do not fork. This principle supersedes opinion.

# LAUNCH_DECISION_PRINCIPLE — Aladiah's Root Operating System

**Hypothesis ≠ Fact**

**Evidence creates truth. Truth creates priorities. Priorities create work.**

---

## The Decision Flow

```
CLAIM
  ↓
EVIDENCE
  ↓
CLASSIFICATION
  ↓
PRIORITY
  ↓
WORK
```

No step can be skipped. No claim bypasses evidence. No hypothesis becomes fact.

---

## The Rules

1. **No blocker without evidence.**
   A blocker requires proof: screenshot, log, query result, error message, or video.
   
2. **No hypothesis treated as fact.**
   Conflicting reports or missing evidence = HYPOTHESIS, not BLOCKER.
   
3. **No estimate before validation.**
   Hypotheses don't get estimated. Only reproducible failures get time estimates.
   
4. **No work starts without ownership.**
   Every task has a named owner and target date, not a guess.
   
5. **No launch decision without proof.**
   Founder must walk the path and show it works. Assumption is not sufficient.

---

## Classification Model

Every claim falls into exactly one state:

### ✅ PROVEN
- Evidence exists
- Reproducible or observable
- Action: Assign owner, allocate resources, estimate fix

### ⚠️ HYPOTHESIS
- Conflicting evidence, or evidence missing
- Unproven claim
- Action: Run founder validation, gather proof, move to PROVEN or BROKEN

### ❌ BROKEN
- Reproducible failure with evidence attached
- Screenshot, log, error message, video
- Action: Same as PROVEN — assign owner and fix

---

## Evidence Requirements

Evidence must be **current**. Evidence expires.

```
A screenshot from 3 months ago does not prove today's behavior.
A log from last sprint does not confirm current state.
```

Stale evidence → not sufficient for blocker classification. Requires re-validation on live system.

---

## How This Resolves Conflicts

Before this principle:
- Brand blocker claimed without proof → opinion battle
- Security issue asserted → unclear if real
- Certificate "doesn't work" → guess if it's broken or just untested
- Marketing claim made → no evidence attached

After this principle:
- Brand claim: Show evidence. Screenshot? Query? Where is proof? → Truth emerges
- Security: Audit results + reproducible steps → Real or phantom clarified
- Certificate: Walk the path on live site → Works or fails, proven
- Marketing: What metric proves the claim? → Testable or rejected

**The winning question becomes: What is the evidence?** — not "Who has the strongest opinion?"

---

## When to Apply This Principle

- **Blocker proposal:** Require evidence before adding to registry
- **Hypothesis resolution:** Founder validation runbook or code/DB search required
- **Launch decision:** Runbook must pass end-to-end on live system
- **Program expansion:** Module N must be GREEN before Module N+1 starts
- **Security findings:** Audit results, reproducible exploit, or query proof required
- **Estimate requests:** No time estimate given until failure is reproduced

---

## Relationship to Other Canon Documents

- **QA_STANDARD.md** — defines DoR/DoD evidence gates; feeds into this framework
- **LAUNCH_COMMAND_CENTER.md** — operational registry; applies this principle daily
- **PROGRAM_VALIDATION_GATE.md** (future) — reuses this framework for curriculum gates

This document is the meta-principle underneath them all.

---

## Why This Matters

The organization's velocity is determined by **speed of truth discovery**, not speed of coding.

Companies that confuse hypothesis with fact waste weeks solving phantom problems and ship late.

Companies that require evidence before work starts ship fast and with confidence.

---

**Established:** 2026-06-21  
**Rationale:** Over weeks of Aladiah development, this principle resolved conflicts across brand, security, curriculum, and launch decisions. "What is the evidence?" became the universal tiebreaker. Before scaling to five programs, this principle must be canonical and non-negotiable.  
**Applies to:** All decision-making before launch. All QA classifications. All blocker proposals. All founder decisions.
