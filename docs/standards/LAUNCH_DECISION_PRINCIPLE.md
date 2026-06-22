> **Status: Canonical** — Required reading for: all agents · all teams · all decision-makers.
> Governance document. Do not fork. Changes are platform-level decisions.

# LAUNCH_DECISION_PRINCIPLE.md — Aladiah Operating System Before Scale

**Principle:** Truth first. Scale second.

The organization operates in **Claim → Evidence → Classification → Priority → Work.**

No claim becomes work without evidence. No hypothesis becomes a blocker without proof. This is the discipline that separates launch-ready from building-forever.

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
