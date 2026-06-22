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

---

## The Decision Model

Before this principle:

```
Agent reports issue
→ Assume issue is real
→ Create blocker
→ Allocate people
→ Spend weeks fixing
→ Discover: issue doesn't exist
    or was already fixed
    or only exists in documentation
```

After this principle:

```
Claim made
  ↓
Evidence gathered (screenshot, log, query, video, error)
  ↓
Classification:
  - No evidence → not a blocker
  - Conflicting evidence → HYPOTHESIS
  - Reproducible failure → BLOCKER
  ↓
Priority assigned
  ↓
Work allocated (only for BLOCKER + PROVEN)
```

**The rule:** Hypotheses don't get estimated. Only evidence gets assigned.

---

## Classification System

Every claim falls into one of three states:

### State: NO EVIDENCE
- Claim: "Certificates don't issue"
- Investigation: Code scan found no issuance trigger
- Evidence: None (no screenshot, no log, no error)
- Status: **Not a blocker**
- Action: Add to SUSPECTED section. Move to blocker only when evidence exists.

### State: CONFLICTING EVIDENCE
- Claim: "Capstone form is missing"
- Investigation: Earlier reports say "capstone submission built and verified." Code scan shows "Coming Soon" placeholder.
- Evidence: Two contradictory sources
- Status: **HYPOTHESIS**
- Action: Run Founder Validation Runbook. Resolve conflict with proof.

### State: REPRODUCIBLE FAILURE
- Claim: "RLS policy allows unrestricted access"
- Investigation: Supabase security audit ran
- Evidence: Query shows `WITH CHECK (true)` in policies; policy allows INSERT without user_id check
- Status: **BLOCKER**
- Action: Assign owner, allocate resources.

---

## The Single Most Important Metric

Before launch, the metric that matters is:

```
Founder Validation Runbook
Status: [ ] Not Started
        [ ] In Progress
        [ ] Passed
        [ ] Failed
```

Not:
- Courses authored
- Modules created
- Marketing assets produced
- QA checkboxes ticked
- Security advisor lints cleared

Why? Because the runbook answers the fundamental question: **Does the student journey actually work end-to-end?**

When the runbook runs:

#### Scenario A: Runbook Passes (All 7 stages work)
```
BLK-001 (Certificate issuance) → PHANTOM, disappears
BLK-002 (Capstone form) → PHANTOM, disappears
BLK-003 (Completion gate) → PHANTOM, disappears

Launch readiness: Jumps from ~15% to ~80% (if security blockers resolve)
Action: Launch candidate (pending security closure)
```

#### Scenario B: Runbook Fails at Stage X
```
Exact failure point: e.g., "Stage 6 — no certificate appears"
Exact evidence: Screenshot of PortalCertifications empty state
Exact owner: Backend Lead
Exact fix scope: Known (either 2 hours or 2 days, proven by reproduction)

Launch readiness: Lower, but uncertainty disappears
Action: Fix the failure, rerun runbook
```

**In both scenarios, the organization gains.** The runbook is the lever that converts hypothesis into truth.

---

## Applying This to Aladiah's Programs

When scaling from BA to PM, Scrum, Data, Cybersecurity:

**Do not allocate curriculum teams until:**
1. The launch runbook passes for the prior program
2. The platform security blockers are closed
3. The completion/certificate/capstone flows are proven to work

**Do not estimate fixes until:**
1. The failure is reproducible
2. The failure is logged (screenshot, error, query result)
3. The failure is owned (named person, target date)

**Do not launch a program until:**
1. The Founder Validation Runbook completes end-to-end
2. All BLOCKER-tier findings are closed with evidence
3. The student journey can be walked by a real founder on the live site without human intervention

---

## Why This Matters

The organization's velocity multiplier is not "how many agents can we spin up" or "how fast can we write code."

It's "how quickly can we tell the difference between a real problem and a phantom one."

Companies that waste weeks on phantom problems ship late. Companies that require evidence ship fast.

---

## The 72-Hour Test

Apply this principle to the next 72 hours:

| Priority | Item | Evidence Status | Action |
|----------|------|-----------------|--------|
| P0 | SEC-002 Tier spoofing | BLOCKER (proven) | Fix (24h) |
| P0 | Founder Validation Runbook | HYPOTHESIS (pending) | Run (4h) |
| P1 | Complete gates / certificate flows | CONFLICTING (hypotheses HYP-001/002/003) | Resolve via runbook |
| P2 | Free-tier onboarding | BLOCKER (proven) | Fix (1 day, after P0/P1) |
| P3 | Marketing rollout | No blockers | Can proceed in parallel |
| P4 | Curriculum expansion | Blocked until runbook passes | Do not start yet |

**Result after 72 hours:** Either (a) runbook passed and MVP is ready, or (b) runbook failed and you have evidence of the next 3 fixes. No wasted motion. No phantom blockers consuming resources.

---

## For Future Reference

When an agent (human or AI) proposes a blocker:

**Ask:**
1. Show me the evidence
2. Is it a screenshot, log, query, or error message?
3. Can you reproduce it?
4. What is the exact failure point?

**If they answer:**
- "I read it in the code" → Classify as HYPOTHESIS, add to SUSPECTED
- "Earlier reports said so" → Conflicting evidence, run founder test
- "I got this error when I tried it" → BLOCKER, assign owner

**If they cannot answer:**
- "I think it might be broken" → Not a blocker, return to author
- "Nobody has tested this end-to-end" → Run the runbook
- "I estimated 3 days to fix" → Before estimating, reproduce the failure

---

## Escalation Path

If uncertainty persists:

```
Claim → Investigate → Evidence insufficient → Escalate to Founder
Founder runs task → Reproduces or doesn't → Uncertainty resolved
```

The founder is the final arbiter of "is this real or phantom" because they interact with the live product and can answer in 4 hours what might take weeks to guess about.

---

**Established:** 2026-06-21  
**Rationale:** Aladiah moved from assumption-driven QA to evidence-driven QA. This decision model ensures the organization scales without creating phantom blockers that waste time. Before launch, truth matters more than speed. After launch, this discipline prevents technical debt.  
**Applies to:** All QA decisions, all security findings, all curriculum gates, all launch decisions.
