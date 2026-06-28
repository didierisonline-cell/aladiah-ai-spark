> **Status: Gold-standard simulation spec — Cybersecurity flagship signature sim.**
> Cyber's equivalent of the BA Discovery Engagement. Built to gold standard FIRST, then
> becomes the reference template every other Cyber simulation is cloned from.
> Engine: reuse the BA simulation engine (dynamic AI personas · persistence · 7-dimension
> rubric · Founder Review Mode · Readiness Score). Do not rebuild the engine — clone it.
> Primary competency: `cyber:incident-response` (curriculum home: Module 11).

# Signature Simulation — The IR War Room

## 0. Why this is the signature sim

One exceptional simulation beats ten average ones (the lesson from BA's Sim 1). The IR War
Room is built to gold standard before any other Cyber sim, because once it works —
dynamic personas, scoring, persistence, artifact + STAR generation — every other Cyber
simulation is a re-skin of the same engine with a different scenario. It is also the most
*employable* moment in the program: "tell me about an incident you led" is the question
every security hire faces.

**One scenario, five career paths.** The same incident, viewed through a different lens and
difficulty, powers the SOC Analyst, Security Engineer, Security Architect, GRC, and CISO
tracks (§6).

---

## 1. The scenario

```
MONDAY 7:00 AM

Ransomware detected on the file servers.
Production systems are going dark, one by one.
Customers are starting to call — they can't log in.
The CEO is calling YOU.
A journalist has emailed asking about "an outage."
Legal wants to know if customer data was taken.

You are the Incident Response lead. The clock is running.
```

The student is dropped into a live, escalating incident and must lead it under pressure,
with incomplete information and stakeholders pulling in different directions.

---

## 2. What the student must do (the six phases)

Each phase is a scored decision surface, not a quiz. The AI personas react to the student's
choices, and new information (injects, §4) arrives as time advances.

| Phase | Student must… | Failure mode it tests |
|---|---|---|
| 1. **Investigate** | Determine scope: which systems, what variant, entry point, is data exfiltrated? | Acting before understanding |
| 2. **Prioritize** | Decide what matters most: stop spread vs. preserve evidence vs. restore revenue systems | Treating everything as equally urgent |
| 3. **Contain** | Choose containment (isolate/segment/shutdown) — trading speed against evidence and uptime | Containing in a way that destroys forensic evidence |
| 4. **Communicate** | Brief CEO, Legal, Comms, customers — right message, right audience, no premature/over-promising statements | Saying too much, too little, or too early |
| 5. **Recover** | Sequence restoration safely (clean backups, verify, no re-infection) | Restoring from infected backups; re-infection |
| 6. **Present** | Run the executive briefing + blameless post-incident review with root cause and corrective actions | Blame, no root cause, no prevention |

---

## 3. Dynamic AI personas (different incentives + hidden information)

The engine drives each persona with goals, incentives, hidden facts, and a
willingness-to-cooperate score that shifts based on how the student treats them.

| Persona | Surface goal | Hidden information / tension |
|---|---|---|
| **CEO** | "Make it stop, protect the brand" | Hidden: board meeting in 48h; will over-promise to customers unless managed |
| **CISO / your boss** | Supportive but watching | Hidden: knows a risk-acceptance was signed last quarter that allowed this gap |
| **Legal Counsel** | Limit liability; breach-notification clock | Hidden: regulatory notification deadline starts the moment exfiltration is *confirmed* |
| **Comms / PR** | Control the narrative | Hidden: wants to issue a statement NOW that may be factually wrong |
| **Head of Engineering** | Restore uptime fast | Hidden: wants to restore from backups that may be infected |
| **Affected Customer (key account)** | "Is my data safe?" | Hidden: contractually entitled to notification within X hours |

The student's score depends partly on **uncovering hidden information** and **managing the
tension** (e.g., stopping Comms from issuing a premature statement; not letting Engineering
restore from unverified backups).

---

## 4. Injects (escalating timeline)

Time advances as the student acts. Sample injects (engine fires them based on elapsed time
or student choices):

- **T+15 min:** A second system encrypts — containment is now urgent.
- **T+30 min:** Forensics finds signs of data **exfiltration** before encryption (this
  starts Legal's notification clock — does the student notice?).
- **T+45 min:** The journalist publishes "Company X hit by cyberattack." Comms panics.
- **T+60 min:** Engineering reports backups are available — but were they isolated from the
  ransomware? (Trap: restoring blindly = re-infection.)
- **T+90 min:** The attacker emails a ransom demand with a countdown.

Each inject is a decision point with consequences that carry forward (persistence).

---

## 5. Scoring — 7-dimension rubric (0–4 each)

Mirrors the BA rubric shape so the engine is shared. **Pass = ≥ 70% AND no zero on
Containment or Executive Communication.**

| # | Dimension | What "4 — Strong" looks like |
|---|---|---|
| 1 | **Detection & scoping** | Establishes scope, variant, entry point, and exfiltration status before acting |
| 2 | **Containment decision** | Isolates to stop spread while preserving forensic evidence; justifies the trade-off |
| 3 | **Evidence handling** | Maintains chain of custody; doesn't destroy evidence in the rush |
| 4 | **Stakeholder communication** | Right message to CEO/Legal/Comms/customer; stops premature/false statements |
| 5 | **Recovery plan** | Restores from verified-clean backups in safe sequence; prevents re-infection |
| 6 | **Root-cause depth** | Finds the true cause (the accepted-risk gap), not a surface symptom |
| 7 | **Executive clarity** | Briefs leadership in business terms: impact, status, decision needed, next step |

---

## 6. One simulation → five career paths

The same scenario is re-instanced with a different **lens + difficulty + scored emphasis**:

| Path | Lens / role in the war room | Emphasis dimensions |
|---|---|---|
| **SOC Analyst** | First responder: triage, scope, escalate | 1 Detection, 3 Evidence |
| **Security Engineer** | Containment & recovery execution | 2 Containment, 5 Recovery |
| **Security Architect** | Why the architecture allowed this; redesign to prevent recurrence | 6 Root-cause, 2 Containment |
| **GRC / Risk** | Notification obligations, the signed risk-acceptance, post-incident controls | 4 Communication, 6 Root-cause |
| **CISO** | Lead the whole room; board briefing; the funding/strategy aftermath | 4 Communication, 7 Executive clarity |

This is the placement-intelligence payoff: one well-built sim generates differentiated
signal across five hiring targets.

---

## 7. Auto-generated outputs (portfolio + interview)

On completion the engine generates, from the student's actual decisions:

1. **Executive Incident Report** — timeline, impact, containment & recovery actions,
   decisions made, outcome. (Portfolio artifact.)
2. **Post-Incident Review (blameless)** — root cause, what worked, corrective actions,
   prevention. (Portfolio artifact.)
3. **STAR interview story** — "Tell me about an incident you led." Situation → Task →
   Action → Result → Lesson, populated from the transcript.
4. **Readiness score** — feeds the Aladiah Profile and certification eligibility.

**The permanent question, scored throughout:** *"If we contain/communicate/recover the
wrong way, what do we lose — evidence, uptime, trust, or legal standing?"*

---

## 8. Build sequence (gold standard first — do not scale yet)

1. **Build the IR War Room to gold standard** on the cloned BA engine: dynamic personas,
   injects, persistence, 7-dimension rubric, the four auto-generated outputs, Founder
   Review replay.
2. **Founder-test it** against the success criteria below.
3. **Only then** re-instance it for the five paths (§6) and clone the engine to other Cyber
   sims (Module 1 ransomware-risk sim, IAM unauthorized-access sim, etc.).

**Success criteria (engine validated when all true):**
- A student can complete the war room end-to-end and receive a 7-dimension score.
- The session persists and is replayable in Founder Review Mode.
- The Executive Incident Report, PIR, and STAR story generate automatically and are
  portfolio-quality.
- A hiring manager reviewing the outputs would say "this person can lead an incident."

---

*Gold-standard signature simulation. Validated here = template for every Cyber simulation.
One exceptional simulation is worth more than ten average ones.*
