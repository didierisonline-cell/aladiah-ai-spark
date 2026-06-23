> **Status: Prototype build (proof-of-engine) — Cybersecurity flagship, Module 1.**
> Governed by the Aladiah canon (`/docs/standards`). Competency source of truth: `cyber:`
> registry in COMPETENCY_TAXONOMY.md §2.1. Architecture: CYBERSECURITY_FLAGSHIP_ARCHITECTURE.md.
> Purpose: prove ONE module produces all four student outputs before authoring Modules 2–15.

# Cyber Module 1 — Foundations & Risk Thinking (Flagship Package)

## 0. Why this module exists (the proof-of-engine test)

This is not "lesson 1." It is the **proof that the Cyber flagship engine works**. Per the
founder directive: *do not author all 15 modules — prove one module can create the
outcome.* If a student can complete this module and walk away with a portfolio artifact, a
simulation outcome, an interview story, and certification evidence, then Modules 2–15 are
**replication, not invention.**

**Success criteria (all four must be true at completion):**

| Output | Produced by | Artifact a hiring manager sees |
|---|---|---|
| Portfolio artifact | §4 Artifact | **Cyber Risk Register + Executive Summary** |
| Simulation outcome | §5 Simulation | Scored ransomware risk-treatment decision + transcript |
| Interview story | §7 STAR generator | Auto-generated STAR story tied to the artifact |
| Certification evidence | §6 Defense rubric | Board-style defense score (7-dimension) |

**Reconciliation with the frozen v1 architecture:** the v1 map split Foundations (M1) and
Risk (M2). This proof module deliberately **merges foundations + risk thinking** so the
prototype already produces a portfolio-grade artifact (the Risk Register) and exercises the
full chain. This is a prototype scoping choice, not a change to the frozen 15-module map.
When replicated, the shipped M1/M2 split can stand or this merge can be ratified — that is a
post-validation decision, not now.

**Slugs exercised (a legal subset, per §1 rule 4):** `cyber:foundations`,
`cyber:governance-risk`.

**The permanent question, asked on every artifact and decision in this module:**
**"What is the consequence if this control fails?"**

**The teaching spine of every lesson:** Observation → Insight → Recommendation → Business
Impact. (Security is risk-based decision-making, not tool memorization.)

---

## 1. Lesson map

| # | Lesson | Primary slug | Core decision the student can now make |
|---|---|---|---|
| 1.1 | The CIA Triad & Security Fundamentals | `cyber:foundations` | Frame any incident as a C/I/A loss and reason about impact |
| 1.2 | Threat Modeling | `cyber:foundations` | Identify what can go wrong before it does (STRIDE, attack thinking) |
| 1.3 | Risk Assessment | `cyber:governance-risk` | Quantify risk (likelihood × impact) and rank it |
| 1.4 | Security Controls | `cyber:governance-risk` | Choose controls that change the risk, and prove they work |
| 1.5 | Security Governance | `cyber:governance-risk` | Set risk appetite and decide accept/mitigate/transfer/avoid |

---

## 2. Lesson content

> Each lesson carries: **Objective · Main points (with the O→I→R→BI spine) · Key terms ·
> Consequence question · Real case.** Content is written to be lecture-script ready for
> Prof Didier (security persona) and to feed the question bank in §3.

### Lesson 1.1 — The CIA Triad & Security Fundamentals  · `cyber:foundations`
- **Objective:** Use Confidentiality / Integrity / Availability as the lens for every
  security decision.
- **Main points:**
  - **Confidentiality** — only authorized parties access data. *Observation:* a leaked
    customer DB. *Insight:* it's a confidentiality failure. *Recommendation:* encrypt +
    access-control. *Business impact:* regulatory fines + lost trust.
  - **Integrity** — data is accurate and unaltered. A tampered invoice or poisoned dataset
    is an integrity failure; the business acts on false information.
  - **Availability** — systems are usable when needed. Ransomware is primarily an
    availability attack; downtime = lost revenue and SLA breach.
  - **Every control trades against the triad.** Locking a system down hard (confidentiality)
    can hurt availability. Security is a balance, decided by business risk.
  - **Defense-in-depth & control types** (preventive / detective / corrective) introduced
    as the vocabulary for §1.4.
- **Key terms:** CIA triad, defense-in-depth, preventive/detective/corrective controls,
  threat vs vulnerability vs risk.
- **Consequence question:** "If this control fails, which of C, I, or A do we lose first —
  and what does that cost the business?"
- **Real case:** Colonial Pipeline (2021) — an availability failure (fuel delivery halted)
  triggered by a single compromised credential.

### Lesson 1.2 — Threat Modeling  · `cyber:foundations`
- **Objective:** Think like an attacker; enumerate what can go wrong before it does.
- **Main points:**
  - **Threat modeling = structured pessimism.** Ask: what are we building, what can go
    wrong, what do we do about it, did we do a good job?
  - **STRIDE** (Spoofing, Tampering, Repudiation, Information disclosure, Denial of
    service, Elevation of privilege) as a checklist mapped back to CIA.
  - **Attack surface & attack paths** — attackers chain small weaknesses into large impact;
    you defend the *path*, not just the asset.
  - O→I→R→BI: *Observation:* an unauthenticated admin endpoint. *Insight:* elevation-of-
    privilege threat. *Recommendation:* authn + network restriction. *Business impact:*
    prevents full-system takeover.
- **Key terms:** STRIDE, attack surface, attack path, threat actor, TTP.
- **Consequence question:** "What is the worst outcome an attacker reaches from this entry
  point if our control fails?"
- **Real case:** Capital One (2019) — a single SSRF + over-permissioned role chained into
  100M+ records exposed.

### Lesson 1.3 — Risk Assessment  · `cyber:governance-risk`
- **Objective:** Move from "is it a threat?" to "how much risk, and is it worth treating?"
- **Main points:**
  - **Risk = Likelihood × Impact.** Make it concrete: rate each 1–5, multiply, rank.
  - **Quantify where possible:** expected loss = probability × $ impact. "Likely, $2M" beats
    "high."
  - **Inherent vs residual risk** — risk before controls vs after. You manage residual risk
    down to appetite (§1.5).
  - **Prioritization:** you can never fix everything; rank by exposure × business value.
  - O→I→R→BI runs straight into the **Risk Register artifact** (§4): each row IS an O→I→R→BI.
- **Key terms:** likelihood, impact, inherent/residual risk, expected loss, risk ranking.
- **Consequence question:** "If we leave this risk untreated, what is the expected loss?"
- **Real case:** Equifax (2017) — a *known, unpatched* vulnerability (risk identified, not
  treated) → 147M records, ~$1.4B+ cost.

### Lesson 1.4 — Security Controls  · `cyber:governance-risk`
- **Objective:** Choose controls that actually change the risk — and prove they work.
- **Main points:**
  - **Control types:** preventive (stop it), detective (see it), corrective (recover),
    plus administrative / technical / physical families.
  - **Control assurance chain: Risk → Control → Test → Evidence.** A control you can't
    evidence is a checkbox, not a control. (This is the bridge to the QA evidence standard.)
  - **Controls map to risk treatment** — a control is how you *mitigate* (§1.5).
  - O→I→R→BI: *Observation:* no MFA on admin accounts. *Insight:* preventable account
    takeover. *Recommendation:* phishing-resistant MFA. *Business impact:* removes the
    #1 breach vector; evidenced by an access-log test.
- **Key terms:** preventive/detective/corrective, administrative/technical/physical,
  control assurance, evidence.
- **Consequence question:** "If this control fails silently, how would we even know — and
  what's exposed in the meantime?"
- **Real case:** Target (2013) — detection alerts *fired* but no corrective action was
  taken; a control without an owner/response is not a control.

### Lesson 1.5 — Security Governance  · `cyber:governance-risk`
- **Objective:** Decide, at the business level, how much risk is acceptable and what to do
  with each risk.
- **Main points:**
  - **Frameworks as operating models:** NIST CSF (Identify, Protect, Detect, Respond,
    Recover) and ISO 27001 — used to organize decisions, not memorized.
  - **Risk appetite:** how much risk the business will accept, by category (financial,
    safety, cyber, innovation). Without it, every risk looks equally urgent.
  - **Risk treatment decision:** **Accept / Mitigate / Transfer / Avoid** — each risk gets
    one, with an owner and a date.
  - **Governance gives controls teeth:** policy → ownership → review cadence → accountability.
  - O→I→R→BI: *Observation:* unlimited risk acceptance by individual managers. *Insight:*
    no appetite = uncontrolled exposure. *Recommendation:* board-set appetite + treatment
    sign-off. *Business impact:* risk decisions become defensible and consistent.
- **Key terms:** NIST CSF, ISO 27001, risk appetite, risk treatment (accept/mitigate/
  transfer/avoid), accountability.
- **Consequence question:** "Who owns this risk decision, and what happens if no one does?"
- **Real case:** Wells Fargo — incentives without oversight; a governance failure, not a
  technical one.

---

## 3. Competency-tagged question bank

> **Every question carries exactly one `cyber:` slug** (CLAUDE.md: competency never null;
> COMPETENCY_TAXONOMY.md §1 rule 3: one primary slug per question). Options are written
> WITHOUT `A)/B)/C)/D)` prefixes — the quiz UI adds them (CLAUDE.md). `a` = correct index.

```jsonc
[
  // ---- Lesson 1.1 : cyber:foundations ----
  { "slug": "cyber:foundations",
    "q": "A ransomware attack encrypts a hospital's patient records so staff cannot open them. Which part of the CIA triad is primarily violated?",
    "opts": ["Confidentiality — outsiders can read the records","Integrity — the records were altered","Availability — authorized staff cannot access the records when needed","None — encryption improves security"],
    "a": 2,
    "exp": "Ransomware is primarily an availability attack: the data still exists and may be unread by attackers, but authorized users cannot access it, halting operations." },
  { "slug": "cyber:foundations",
    "q": "An attacker silently changes the bank-account number on a supplier's invoice in your system. Which CIA component failed?",
    "opts": ["Confidentiality","Integrity — the data was altered without authorization","Availability","Accountability"],
    "a": 1,
    "exp": "Integrity is about data being accurate and unaltered. The business now acts on false information — paying the wrong account." },
  { "slug": "cyber:foundations",
    "q": "Why is 'defense-in-depth' preferred over a single strong control?",
    "opts": ["It is cheaper than one control","If one layer fails, others still reduce the impact","It guarantees no breach can occur","It removes the need for monitoring"],
    "a": 1,
    "exp": "No single control is perfect. Layered controls mean a single failure does not equal a full compromise — it contains blast radius." },

  // ---- Lesson 1.2 : cyber:foundations ----
  { "slug": "cyber:foundations",
    "q": "In STRIDE, an attacker gaining admin rights from a normal user account is an example of:",
    "opts": ["Spoofing","Repudiation","Elevation of privilege","Denial of service"],
    "a": 2,
    "exp": "Elevation of privilege = gaining capabilities beyond what was authorized. It often turns a minor foothold into full compromise." },
  { "slug": "cyber:foundations",
    "q": "Why do security teams analyze 'attack paths' rather than only individual vulnerabilities?",
    "opts": ["Single low-severity issues are always harmless","Attackers chain small weaknesses into high-impact outcomes","It is required by law","Attack paths replace the need for patching"],
    "a": 1,
    "exp": "A chain of low findings (e.g., SSRF + over-permissioned role) can produce a critical breach. You defend the path, not just isolated assets." },

  // ---- Lesson 1.3 : cyber:governance-risk ----
  { "slug": "cyber:governance-risk",
    "q": "A risk has likelihood 4/5 and impact 5/5. Another has likelihood 2/5 and impact 3/5. Which should generally be treated first?",
    "opts": ["The second — lower impact is safer to start with","The first — higher likelihood × impact = higher risk score","They are equal","Neither, without a compliance mandate"],
    "a": 1,
    "exp": "Risk = likelihood × impact. 4×5=20 outranks 2×3=6. Ranking by the product focuses limited resources on the largest exposure." },
  { "slug": "cyber:governance-risk",
    "q": "What is 'residual risk'?",
    "opts": ["Risk before any controls are applied","The risk remaining after controls are applied","Risk that cannot be measured","Risk transferred to insurance"],
    "a": 1,
    "exp": "Inherent risk is before controls; residual risk is what remains after. You manage residual risk down to the organization's risk appetite." },
  { "slug": "cyber:governance-risk",
    "q": "The Equifax breach involved a vulnerability that was known but not patched. In risk terms, the failure was primarily:",
    "opts": ["Risk identification","Risk treatment — an identified risk was not acted on","Lack of any framework","An unforeseeable zero-day"],
    "a": 1,
    "exp": "The risk was identified; it was not treated. Identifying risk without treating it provides no protection — and is indefensible to a board." },

  // ---- Lesson 1.4 : cyber:governance-risk ----
  { "slug": "cyber:governance-risk",
    "q": "A SIEM detects an intrusion and alerts, but no one investigates and the breach proceeds. This is best described as:",
    "opts": ["A successful detective control","A control with no corrective response — effectively not a control","A preventive control failure","An acceptable outcome"],
    "a": 1,
    "exp": "Detection without response (the Target 2013 lesson) provides no protection. Control assurance requires the response and the evidence, not just the alert." },
  { "slug": "cyber:governance-risk",
    "q": "In the assurance chain 'Risk → Control → Test → Evidence', what is the purpose of Evidence?",
    "opts": ["To satisfy auditors with paperwork only","To prove the control actually works and is operating","To replace the need for testing","To document the risk owner's name"],
    "a": 1,
    "exp": "Evidence demonstrates the control is real and operating. A control you cannot evidence is a checkbox — this is also the QA standard's definition of 'done'." },

  // ---- Lesson 1.5 : cyber:governance-risk ----
  { "slug": "cyber:governance-risk",
    "q": "An organization decides to buy cyber-insurance to cover a residual risk it cannot cost-effectively reduce. Which treatment is this?",
    "opts": ["Avoid","Mitigate","Transfer","Accept"],
    "a": 2,
    "exp": "Transferring risk (to an insurer or third party) is one of the four treatments: Accept, Mitigate, Transfer, Avoid." },
  { "slug": "cyber:governance-risk",
    "q": "Why does a board set a 'risk appetite'?",
    "opts": ["To eliminate all risk","To define how much risk is acceptable so decisions are consistent and defensible","Because regulations forbid risk acceptance","To remove the need for controls"],
    "a": 1,
    "exp": "Risk appetite tells the organization how much risk it will accept by category, so individual risk decisions are consistent, prioritized, and defensible." }
]
```

*12 questions · 5 on `cyber:foundations`, 7 on `cyber:governance-risk` — a representative
subset for a foundations module (§1 rule 4: a module exercises a subset).*

---

## 4. Portfolio artifact — Cyber Risk Register + Executive Summary

The student produces this for an assigned (or their own) small company. **Each row is an
O→I→R→BI in table form.** This is the resume/LinkedIn/portfolio piece.

### 4a. Risk Register template

| # | Asset | Threat | Vulnerability | Likelihood (1-5) | Impact (1-5) | Inherent Risk | Recommended Control | Treatment (A/M/T/Av) | Owner | Residual Risk | Consequence if control fails |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1 | Customer database | Ransomware | No offline backups | 4 | 5 | 20 | Immutable offline backups + tested restore | Mitigate | IT Lead | 6 | Multi-day outage; possible permanent data loss |
| R2 | Admin accounts | Account takeover | No MFA | 4 | 5 | 20 | Phishing-resistant MFA | Mitigate | Security | 4 | Full-system compromise via one stolen password |
| R3 | Email | Phishing | Untrained staff | 5 | 3 | 15 | Security-awareness training + reporting | Mitigate | HR/Security | 6 | Initial foothold for ransomware/BEC |
| … | | | | | | | | | | | |

### 4b. Executive Summary template (one page — board language)

```
SECURITY RISK — EXECUTIVE SUMMARY
Company: <name>          Prepared by: <student>          Date: <date>

CURRENT STATE: <2-3 lines on posture and the top exposures>
TOP 3 RISKS (ranked by expected loss):
  1. <risk> — Expected loss ~$<X>. Recommendation: <treatment>. Owner: <>. 
  2. ...
  3. ...
RISK APPETITE: <what the business will/won't accept>
INVESTMENT ASK: <$ and what it buys>
EXPECTED OUTCOME: <residual risk after treatment>
THE ONE QUESTION: "If we fund nothing, the most likely loss this year is <$X> from <risk>."
```

**Employment value:** this is exactly what a junior GRC analyst / SOC analyst is asked to
produce in week one. It is defensible in an interview and showable on a profile.

---

## 5. Simulation — "Small-Company Ransomware" (Module 1 scoped)

> Module 1's sim is **risk-treatment focused** (prevention/decision), a lighter cousin of
> the signature IR War Room (full response — see SIM_IR_WAR_ROOM.md). It reuses the BA
> simulation engine: dynamic AI personas, persistence, 7-dimension rubric, founder review.

- **Setup:** *Northwind Supplies*, a 40-person distributor. The student is the newly hired
  security lead. A near-miss phishing incident just occurred; the CEO wants to know "are we
  going to get ransomware'd, and what do we do about it?"
- **Dynamic AI personas (different incentives + hidden info):**
  - **CEO** — wants growth, hates spend; hidden: a big client just asked for a security
    attestation.
  - **IT Manager** — defensive; hidden: backups have never been test-restored.
  - **CFO** — wants the cheapest option; hidden: no cyber-insurance.
- **Student must:** interview the personas, identify the top risks, build the Risk Register
  (§4), and **present a risk-treatment recommendation** with an investment ask.
- **Decision points (scored):** Do they uncover the untested backups? Do they prioritize by
  expected loss (not by what's loudest)? Do they pick defensible treatments with owners? Do
  they answer the CEO's "what's the most likely loss this year?" question?
- **7-dimension rubric (0–4 each):**
  1. Threat identification (did they find the real risks, incl. hidden ones)
  2. Risk quantification (likelihood × impact, expected loss)
  3. Control/treatment quality (controls that actually change the risk)
  4. Prioritization (ranked by exposure, not noise)
  5. Stakeholder handling (uncovered hidden info; managed CEO/CFO tension)
  6. Executive communication (clear, board-level recommendation)
  7. Consequence reasoning ("if this control fails…" answered for top risks)
- **Auto-generated outputs:** the completed Risk Register, an Executive Incident-Readiness
  brief, and the STAR story (§7).

---

## 6. Certification gate — Board-style defense rubric

The student defends their recommendation to a simulated board (CEO, CFO, Risk Officer).
**Pass = ≥ 70% (≥ 2.8/4 average) AND no zero on dimensions 6 or 7.**

| Dimension | 0 — Fail | 2 — Adequate | 4 — Strong |
|---|---|---|---|
| Risk understanding | Lists controls, no risk logic | Identifies & ranks risks | Quantifies expected loss, ties to business |
| Treatment defensibility | "Buy more tools" | Names A/M/T/Av with owners | Justifies each treatment vs appetite & cost |
| Prioritization | Random / everything-urgent | Ranks by score | Defends order under budget challenge |
| Evidence thinking | No way to verify | Names a test | Risk→Control→Test→Evidence for top risks |
| Executive communication | Jargon, no ask | Clear recommendation | Board-ready: state→risk→impact→ask→outcome |
| Consequence reasoning (gate) | Cannot answer "if it fails?" | Answers for some | Answers crisply for every top risk |
| Certification question (gate) | Cannot answer | Vague | "If we fund nothing, likely loss is $X from <risk>" |

**Certification evidence produced:** the rubric scorecard + the defense transcript +
the artifact ID → all attach to the Aladiah Profile.

---

## 7. Interview story — auto-generated STAR

Generated from the student's actual simulation actions and artifact. Template:

```
SITUATION: At <company>, a 40-person distributor, a phishing near-miss raised fears of
           ransomware with no clear picture of exposure.
TASK:      As security lead, I had to assess risk and recommend a treatment plan the
           board would fund.
ACTION:    I interviewed leadership, built a quantified risk register, and uncovered that
           backups had never been test-restored — the single biggest hidden risk. I ranked
           risks by expected loss and recommended immutable offline backups + MFA first.
RESULT:    I reduced the top residual risk from 20 to 6 and secured a $<X> investment by
           showing the board the most likely annual loss if we did nothing.
LESSON:    Security is a risk decision, not a tool purchase — quantify, prioritize, and
           speak in business impact.
```

**Employment value:** the student leaves with a ready answer to "Tell me about a time you
assessed and prioritized security risk."

---

## 8. Employment Value Gate (the test every module must pass)

> "Why would a hiring manager pay someone for this?"

| Component | Hiring-manager value |
|---|---|
| Risk Register artifact | Day-one deliverable for SOC/GRC analyst roles |
| Quantification skill | Separates "knows terms" from "can prioritize spend" |
| Executive Summary | Proves business-communication, not just technical knowledge |
| Ransomware sim outcome | Evidence of decision-making under stakeholder pressure |
| STAR story | Interview-ready; maps to a real, defensible result |
| Board defense score | Objective signal for the Aladiah Profile / employer match |

**Resume bullet the student earns:** *"Built a quantified cyber risk register and secured
executive funding for the top-priority controls, reducing the highest residual risk by 70%."*

---

## 9. Definition of Done (module-level) & how it seeds

**This module is "done" only when (evidence-based, per the QA workstream):**
- [ ] 5 lessons authored with O→I→R→BI spine + consequence question + real case ✅ (this doc)
- [ ] Question bank: every question tagged to exactly one `cyber:` slug ✅ (§3)
- [ ] Risk Register + Executive Summary templates exist ✅ (§4)
- [ ] Ransomware simulation spec with 7-dimension rubric ✅ (§5)
- [ ] Board-style defense rubric with pass gate ✅ (§6)
- [ ] STAR generator template ✅ (§7)
- [ ] Employment-value mapping ✅ (§8)
- [ ] Seeded into Supabase with competency populated at insert (NOT null) — **pending, needs
      approval** (CLAUDE.md: no DB writes / SQL auto-apply without explicit approval).

**Seeding path (next discrete step, on approval):** generate
`supabase/functions/seed-cybersecurity-flagship/` from this doc, mirroring
`seed-ai-business-analyst` structure BUT fixing its gap — insert `competency: "<slug>"` on
every `quiz_questions` row from §3. Deliver as a reviewable file + paste-ready block; the
human applies it (per CLAUDE.md). Do not extend the legacy `seed-cybersecurity-course`.

---

*Prototype build. Once a student completes this end-to-end and produces all four outputs,
the engine is validated and Modules 2–15 become replication of this exact package shape.*
