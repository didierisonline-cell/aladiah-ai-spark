> **Status: Ratified architecture (v1) — Program #5 (parallel track).**
> Governed by the Aladiah canon (`/docs/standards`): NORTH_STAR (why) · ARCHITECTURE_PRINCIPLE (what qualifies) · COMPETENCY_TAXONOMY (how competency is named).
> Competency source of truth: the `cyber:` Axis-1 registry in COMPETENCY_TAXONOMY.md §2.1. This document maps modules → slugs → artifacts → simulations → career outcomes. It does not invent slugs.

# Cybersecurity Flagship — Curriculum Architecture (v1)

## 0. Positioning & governance

**This is Program #5, built in parallel — off the launch-four critical path.**
Per the ratified canon, the launch sequence is **Scrum → Business Analyst → Project
Manager → Data Analyst**. Cybersecurity does not displace Data Analyst. This document is
the "ratified competency taxonomy + curriculum architecture + canon footprint" that was
the stated prerequisite for Cyber to *eventually* enter the launch set. It exists so that
when Cyber is activated, it inherits a proven engine rather than a from-scratch build.

**Program key:** `cyber`. **Competency registry:** COMPETENCY_TAXONOMY.md §2.1 (13 slugs).

**The legacy `seed-cybersecurity-course` (Video → Quiz → Certificate) is superseded by
this architecture and must be rebuilt to the flagship model — it is not the canon.**

### The architecture this program inherits from the BA flagship

Every module is a transformation unit, not a lecture. The chain is:

```
Lesson → Artifact → Simulation → Defense → Portfolio → Interview Story → Certification → Placement
```

Non-negotiable design rules (carried over from the BA flagship, adapted to security):

1. **Employment Value Gate.** Every module must produce a portfolio artifact a hiring
   manager recognizes. The test for each lesson: *"Would a hiring manager care about
   this? Could it go on a LinkedIn profile? Could it be defended in an interview?"* If
   not, redesign the output.
2. **Decision-changing, not memorization.** Teach security as risk-based decision-making.
   The recurring spine for every lesson: **Observation → Insight → Recommendation →
   Business Impact.** The phrase that should echo across the program:
   *"A control without a decision is a checkbox. A control tied to a decision is risk
   management."*
3. **The permanent question on every artifact:**
   **"What is the consequence if this control fails?"**
   (And for Module 13: *"What happens if the AI is wrong — or is attacked?"*)
4. **Control-failure realism.** Risk and IR modules teach from real breaches
   (Equifax, SolarWinds, Log4Shell, Colonial Pipeline, MOVEit, Capital One) — what
   control failed, and what it cost — not abstract policy.
5. **Executive translation.** By the back third, students convert technical findings into
   board-level conviction: *Current State → Risk → Business Impact → Recommendation →
   Investment → Expected Outcome.*

### Five-pillar coverage (NORTH_STAR Rule 3)

- **Pillar 1 — Content:** the 15 modules below.
- **Pillar 2 — AI Tutor:** Prof Didier (security persona) per lesson.
- **Pillar 3 — Simulation Engine:** one *flagship* simulation per module (the seed),
  scaling toward 100+. Sim 1 (M11 IR War Room) is built to gold-standard first and
  becomes the template, mirroring how BA built Sim 1 before scaling.
- **Pillar 4 — Competency Engine:** every quiz question carries exactly one `cyber:` slug.
- **Pillar 5 — Career Transformation:** artifacts map to resume bullets, LinkedIn, STAR
  interview stories, and the Aladiah Profile.

---

## 1. Career-outcome ladder

The program is sequenced to move a learner along this ladder. Each module names which rung
it primarily serves.

```
SOC Analyst (Tier 1/2)
  → Security Engineer
    → Security Architect
      → GRC / Security Risk Lead
        → Security Leader / CISO-track
```

The capstone (M15) is what credibly positions a graduate above "analyst" — toward
Security Engineer / Architect / GRC Lead — and is the differentiator from CompTIA/CISSP
exam-prep and Coursera/Udemy security tracks: **a portfolio of defended deliverables, not
a certificate.**

---

## 2. The 15-module arc

Progression: **Understand → Protect → Detect → Respond → Govern → Secure-AI → Lead → Transform.**

| # | Module | Primary `cyber:` slugs | Portfolio artifact | Rung |
|---|---|---|---|---|
| 1 | Cybersecurity in the AI Era | `foundations` | Threat Landscape Brief | SOC Analyst |
| 2 | Security Frameworks & Risk Fundamentals | `governance-risk` | Risk Register + Risk Appetite Statement | SOC Analyst |
| 3 | Identity, Access & Zero Trust | `identity-access` | Zero-Trust Access Design | Security Engineer |
| 4 | Network & Infrastructure Security | `network-infrastructure` | Secure Network Architecture + Segmentation Plan | Security Engineer |
| 5 | Data Protection & Cryptography | `data-protection` | Data Classification & Encryption Policy | Security Engineer |
| 6 | Application Security & Secure SDLC (DevSecOps) | `appsec-cloud` | Application Threat Model + Secure SDLC Gate | Security Engineer |
| 7 | Cloud Security | `appsec-cloud` | Cloud Security Posture Assessment | Security Engineer |
| 8 | Threat Intelligence & Detection Engineering | `threat-detection` | Detection Engineering Pack (use cases + rules) | SOC Analyst → Engineer |
| 9 | Security Operations & Vulnerability Management | `roles-operations`, `governance-risk` | SOC Runbook + Vulnerability Prioritization Matrix | Security Engineer |
| 10 | Offensive Security: Ethical Hacking & Red Team | `offensive-security` | Penetration Test Report + Attack-Path Map | Security Engineer |
| 11 | Incident Response & Digital Forensics | `incident-response` | IR Playbook + Post-Incident Review | Security Engineer |
| 12 | Governance, Risk & Compliance (GRC) | `governance-risk`, `stakeholder-trust` | Control Matrix + Compliance Decision Memo | GRC / Risk Lead |
| 13 | Securing AI Systems (AI Security) | `ai-security` | AI Threat Model + AI Security Governance Blueprint | Architect / Differentiator |
| 14 | Security Leadership & Executive Risk Communication | `security-leadership`, `stakeholder-trust` | Board Cyber-Risk Deck + Security Strategy Roadmap | Security Leader / CISO-track |
| 15 | Capstone: Enterprise Security Transformation | *all (subset by scenario)* | Full portfolio + Boardroom Defense | Transformation / CISO-track |

---

## 3. Module specifications

Each module specifies: **objective · slugs exercised · lessons (spine) · portfolio
artifact · flagship simulation · the consequence question · interview story · career
outcome.**

### Module 1 — Cybersecurity in the AI Era
- **Objective:** Establish the risk-decision mindset. Security is not tools; it is
  protecting business value under adversarial pressure.
- **Slugs:** `cyber:foundations`.
- **Lessons:** CIA triad as decision lens · the modern threat landscape & attacker
  economics · defense-in-depth & control types · risk as the organizing principle · the
  AI-era threat shift (automated attacks, deepfakes, AI-augmented adversaries).
- **Artifact:** **Threat Landscape Brief** — for a named business, the top 5 threats,
  why they matter, and the business impact of each.
- **Simulation:** *First Day on the SOC* — triage a stream of alerts; separate signal
  from noise; justify what you escalate.
- **Consequence question:** "If we ignore this threat class, what does the business lose?"
- **Interview story:** "Walk me through how you assess an organization's threat exposure."
- **Outcome:** SOC Analyst readiness.

### Module 2 — Security Frameworks & Risk Fundamentals
- **Objective:** Move from "is it secure?" to "how much risk, and can we accept it?"
- **Slugs:** `cyber:governance-risk`.
- **Lessons:** NIST CSF & ISO 27001 as operating models (not memorization) · risk
  quantification (probability × impact × exposure; expected loss) · **risk appetite**
  (how much risk is the business willing to accept, by category) · risk treatment
  (accept / mitigate / transfer / avoid) · control types & defense layers.
- **Artifact:** **Risk Register + Risk Appetite Statement** — quantified risks with
  treatment decisions and an explicit appetite by category (financial, safety, cyber,
  innovation).
- **Simulation:** *The Risk Acceptance Meeting* — defend a risk-treatment recommendation
  to a budget-constrained executive.
- **Consequence question:** "What is the expected loss if this risk materializes
  untreated?"
- **Interview story:** "Tell me about a time you prioritized security risks with limited
  budget."
- **Outcome:** SOC Analyst → Risk-aware.

### Module 3 — Identity, Access & Zero Trust
- **Objective:** Identity is the new perimeter. Design access that assumes breach.
- **Slugs:** `cyber:identity-access`.
- **Lessons:** authN vs authZ · least privilege & privileged access management ·
  MFA / passwordless / phishing-resistant factors · **zero trust** (never trust, always
  verify; micro-segmentation of identity) · the **Human Override / break-glass** problem.
- **Artifact:** **Zero-Trust Access Design** — for a sample org, an access model with
  policy decision points, privileged-access controls, and break-glass procedure.
- **Simulation:** *The Over-Privileged Account* — investigate and remediate access sprawl
  after a near-miss.
- **Consequence question:** "If this identity is compromised, how far can the attacker
  move?"
- **Interview story:** "How would you design access control for a zero-trust environment?"
- **Outcome:** Security Engineer track.

### Module 4 — Network & Infrastructure Security
- **Objective:** Build secure-by-design infrastructure; contain blast radius.
- **Slugs:** `cyber:network-infrastructure`.
- **Lessons:** secure network architecture · **segmentation & micro-segmentation** (blast
  radius) · firewalls / IDS / IPS placement · endpoint & infrastructure hardening ·
  secure-by-design vs bolt-on.
- **Artifact:** **Secure Network Architecture + Segmentation Plan** — a diagram plus the
  rationale: what each boundary protects and what failure it contains.
- **Simulation:** *Contain the Spread* — an attacker has a foothold; redesign segmentation
  to limit lateral movement.
- **Consequence question:** "If this segment is breached, what else is exposed?"
- **Interview story:** "Describe how you'd segment a network to limit lateral movement."
- **Outcome:** Security Engineer.

### Module 5 — Data Protection & Cryptography
- **Objective:** Protect the asset attackers actually want: data.
- **Slugs:** `cyber:data-protection`.
- **Lessons:** symmetric/asymmetric crypto, hashing, PKI (applied, not mathematical) ·
  key management & rotation · data classification (what deserves what protection) ·
  encryption in transit / at rest / in use · DLP & privacy-by-design.
- **Artifact:** **Data Classification & Encryption Policy** — classify a company's data
  and map each tier to required controls.
- **Simulation:** *The Exposed Bucket* — a misconfigured store leaks classified data;
  classify, contain, and set policy to prevent recurrence.
- **Consequence question:** "If this data is exfiltrated, what is the regulatory and trust
  cost?"
- **Interview story:** "How do you decide what data to encrypt and how to manage keys?"
- **Outcome:** Security Engineer.

### Module 6 — Application Security & Secure SDLC (DevSecOps)
- **Objective:** Shift security left; make secure the default path.
- **Slugs:** `cyber:appsec-cloud`.
- **Lessons:** OWASP Top 10 as decisions · **threat modeling** (STRIDE) · secure SDLC
  gates · DevSecOps (SAST/DAST/SCA in pipeline) · software supply-chain security
  (Log4Shell, SolarWinds as cautionary cases).
- **Artifact:** **Application Threat Model + Secure SDLC Gate** — a STRIDE threat model
  for a sample app and the pipeline gate that enforces its mitigations.
- **Simulation:** *The Rushed Release* — balance a shipping deadline against an unmitigated
  vulnerability; define the kill/ship criteria.
- **Consequence question:** "If we ship with this flaw, what is the exploit cost vs the
  delay cost?"
- **Interview story:** "Walk me through how you threat-model an application."
- **Outcome:** Security Engineer.

### Module 7 — Cloud Security
- **Objective:** Apply security to the shared-responsibility, ephemeral cloud.
- **Slugs:** `cyber:appsec-cloud`.
- **Lessons:** shared-responsibility model · IAM in cloud (over-permissioned roles) ·
  cloud network & workload security · CSPM & misconfiguration (the #1 cloud breach cause;
  Capital One as case) · containers & serverless security basics.
- **Artifact:** **Cloud Security Posture Assessment** — findings + prioritized remediation
  for a sample cloud account.
- **Simulation:** *The Misconfiguration Hunt* — find and prioritize cloud misconfigs by
  business risk.
- **Consequence question:** "Which misconfiguration, if exploited, hurts the business most?"
- **Interview story:** "How do you assess and improve a cloud security posture?"
- **Outcome:** Security Engineer.

### Module 8 — Threat Intelligence & Detection Engineering
- **Objective:** Build the ability to *see* attacks — and to ignore noise.
- **Slugs:** `cyber:threat-detection`.
- **Lessons:** threat intelligence (strategic/operational/tactical) · the MITRE ATT&CK
  lens · **detection engineering** (turning TTPs into detections) · SIEM & log strategy ·
  **signal vs noise** and alert fatigue.
- **Artifact:** **Detection Engineering Pack** — 3–5 detection use cases mapped to ATT&CK,
  with logic, data sources, and false-positive handling.
- **Simulation:** *Tuning the SIEM* — reduce a flood of false positives without losing true
  detections; justify each tuning decision.
- **Consequence question:** "If this detection is missing, which attack goes unseen?"
- **Interview story:** "Tell me about a detection you built and how you reduced false
  positives."
- **Outcome:** SOC Analyst → Detection Engineer.

### Module 9 — Security Operations & Vulnerability Management
- **Objective:** Run security as an operation with owners, cadence, and prioritization.
- **Slugs:** `cyber:roles-operations`, `cyber:governance-risk`.
- **Lessons:** SOC structure & roles (RACI, escalation, decision rights) · operational vs
  management vs strategic metrics & review cadence · **risk-based vulnerability
  prioritization** (not "patch everything"; exploitability × exposure × business value) ·
  metric-failure thinking ("if this KPI improves, can security still get worse?").
- **Artifact:** **SOC Runbook + Vulnerability Prioritization Matrix** — who does what, and
  which vulns get fixed first and why.
- **Simulation:** *10,000 Vulnerabilities, One Team* — prioritize a vuln backlog under
  resource limits and defend the order.
- **Consequence question:** "If we defer this vulnerability, what is the exposure window
  cost?"
- **Interview story:** "How do you prioritize vulnerabilities when you can't fix them all?"
- **Outcome:** Security Engineer / SOC Lead.

### Module 10 — Offensive Security: Ethical Hacking & Red Team
- **Objective:** Think like an attacker to find what defenders miss.
- **Slugs:** `cyber:offensive-security`.
- **Lessons:** the pentest lifecycle (recon → exploit → post-exploit → report) · ethics,
  scope & rules of engagement · **attack-path analysis** (chaining low findings into high
  impact) · red vs purple teaming · reporting that drives remediation.
- **Artifact:** **Penetration Test Report + Attack-Path Map** — findings ranked by business
  impact with an exploit chain narrative and remediation.
- **Simulation:** *The Engagement* — run a scoped pentest scenario; chain findings; produce
  an executive-readable report.
- **Consequence question:** "What is the worst outcome an attacker reaches from this entry
  point?"
- **Interview story:** "Walk me through a finding where you chained low-severity issues
  into a critical one."
- **Outcome:** Security Engineer / Pentester.

### Module 11 — Incident Response & Digital Forensics  *(flagship Sim 1 — build first)*
- **Objective:** Respond under pressure; preserve evidence; learn without blame.
- **Slugs:** `cyber:incident-response`.
- **Lessons:** IR lifecycle (prepare, detect, contain, eradicate, recover, learn) ·
  containment trade-offs (speed vs evidence) · digital forensics & chain of custody ·
  **IR playbooks** · the **blameless post-incident review** · real cases (Colonial
  Pipeline, MOVEit) — what failed and what it cost.
- **Artifact:** **IR Playbook + Post-Incident Review** — a runnable playbook for one
  incident class plus a PIR with root cause and corrective actions.
- **Simulation (GOLD STANDARD — the reference template for all Cyber sims):**
  *The IR War Room* — a live breach unfolds; the student is IR lead. Dynamic AI personas
  (CISO, Legal, Comms, Engineering) with different incentives and hidden information. The
  student must detect, decide containment under uncertainty, communicate to executives,
  preserve evidence, and run the PIR. **Scored on a 7-dimension rubric** (detection
  quality, containment decision, evidence handling, stakeholder communication, recovery
  plan, root-cause depth, executive clarity). Auto-generates an Executive Incident Report
  and a STAR interview story.
- **Consequence question:** "If we contain the wrong way, what evidence or uptime do we
  lose?"
- **Interview story:** "Tell me about an incident you led and what you changed afterward."
- **Outcome:** Security Engineer / IR responder.

### Module 12 — Governance, Risk & Compliance (GRC)
- **Objective:** Make compliance change decisions — give governance teeth.
- **Slugs:** `cyber:governance-risk`, `cyber:stakeholder-trust`.
- **Lessons:** regulatory impact ("what decision must change because of GDPR/HIPAA/PCI?") ·
  **controls & assurance** (risk → control → test → evidence) · **control-failure
  autopsies** (Equifax: known-unpatched; Wells Fargo: no oversight) · audit & third-party
  risk · **executive risk appetite** applied to compliance.
- **Artifact:** **Control Matrix + Compliance Decision Memo** — controls mapped to risks
  and evidence, plus a one-page memo on what a regulation requires the business to *change*.
- **Simulation:** *The Audit Finding* — a control has failed an audit; decide treatment and
  defend it to a risk committee.
- **Consequence question:** "What is the consequence if this control fails — to the
  business, customers, and regulators?"
- **Interview story:** "Describe how you turned a compliance requirement into an
  operational control."
- **Outcome:** GRC / Security Risk Lead.

### Module 13 — Securing AI Systems  *(flagship differentiator)*
- **Objective:** The program's edge over every exam-prep competitor: securing AI itself.
- **Slugs:** `cyber:ai-security`.
- **Lessons:** the AI attack surface (data, model, prompt, supply chain) · **adversarial
  ML** (evasion, poisoning, model theft, prompt injection) · **AI threat modeling** ·
  AI **risk classification** (low → critical, by decision impact) · AI security governance,
  monitoring & **AI incident response** (drift, jailbreaks, hallucination harm) ·
  the **Human Override** principle for AI decisions.
- **Artifact:** **AI Threat Model + AI Security Governance Blueprint** — threats to a named
  AI system, controls, monitoring, and an override/escalation plan.
- **Simulation:** *The Jailbroken Assistant* — an AI system is being manipulated in
  production; detect, contain, and govern.
- **Consequence question:** "What happens if the AI is wrong — or is attacked?"
- **Interview story:** "How would you secure an AI system in production?"
- **Outcome:** Security Architect / AI Security — the resume differentiator.

### Module 14 — Security Leadership & Executive Risk Communication
- **Objective:** Translate security into executive conviction and strategy.
- **Slugs:** `cyber:security-leadership`, `cyber:stakeholder-trust`.
- **Lessons:** the CISO mindset · **board-level risk communication** (Current State → Risk
  → Business Impact → Recommendation → Investment → Outcome) · security strategy & roadmap ·
  building security culture · security budget & investment prioritization · vendor/customer
  trust narratives.
- **Artifact:** **Board Cyber-Risk Deck + Security Strategy Roadmap** — a board-ready deck
  and a phased strategy with investment rationale.
- **Simulation:** *Ten Minutes with the Board* — present cyber risk and a funding ask to a
  skeptical board (CFO challenges cost, CEO challenges priority).
- **Consequence question:** "If the board funds nothing, what is the most likely loss this
  year?"
- **Interview story:** "Tell me about a time you influenced leadership to invest in
  security."
- **Outcome:** Security Leader / CISO-track.

### Module 15 — Capstone: Enterprise Security Transformation Engagement
- **Objective:** Prove end-to-end capability under boardroom pressure. Not a paper — an
  engagement.
- **Slugs:** all (subset chosen by scenario).
- **Format:** the student receives an executive brief (company profile, architecture,
  threats, regulatory posture, budget, AI initiatives) and must produce, in sequence:
  Threat & Risk Assessment (M1–2) → Architecture & Control Design (M3–7) → Detection & IR
  Capability (M8, M11) → Offensive validation (M10) → GRC & Compliance plan (M12) → AI
  Security plan (M13) → Board Recommendation & Investment case (M14) — then **defend it in
  a boardroom simulation** (CISO, CFO, COO, Chief Risk Officer, Legal challenge it).
- **Artifact:** a complete, portfolio-ready **Security Transformation Package** + recorded
  **Boardroom Defense** score.
- **Certification gate question (must be answerable):** *"Why should the business spend
  money on this security transformation — and what does it lose if it doesn't?"* If the
  student can't answer it, no certification.
- **Outcome:** Transformation / CISO-track positioning.

---

## 4. Build sequence (cadence — do NOT batch all 15)

Honor the proven one-module-at-a-time cadence: **Author → Review → Refine → Freeze → Next.**
Do not author all modules at once; quality and founder review between modules is the
mechanism that made the BA flagship strong.

### Ratified doctrine — "Truth before scale" (founder-approved 2026-06-21)

**No program may author Module N+1 until Module N has passed all four gates:**

```
Content QA  →  Exam QA  →  Student-Flow QA  →  Founder Validation
```

- **GREEN** (all four pass, evidenced) → Module N+1 is authorized.
- **Any gate fails** → open a Blocker and STOP expansion until resolved.

This prevents authoring 15 broken modules / 300 broken questions / 50 broken simulations at
scale. It is the same discipline the QA workstream enforces platform-wide; recorded here so
it binds the Cyber track too. (Recommend the QA workstream also reflect it in QA_STANDARD.md
as a platform-level rule — proposed, not edited here, to avoid cross-workstream collision.)

**Module 1 is the proving ground.** It is not GREEN until the founder applies the seed, runs
verification (0 null competencies), and walks Enroll → Lesson → Quiz → Pass → Progress with
evidence captured. Module 2 is not authorized until then.

**Recommended order of work for this parallel track:**

1. **Phase 0 (done):** Competency taxonomy (§2.1) + this architecture. ✅
2. **Phase 1 — Module 1** authored to flagship quality (lessons, artifact spec, question
   bank tagged to `cyber:foundations`). Review → freeze.
3. **Phase 2 — Module 11 flagship simulation (IR War Room)** built to gold standard as the
   reference template *before* scaling other sims — exactly as BA proved Sim 1 first.
4. **Phase 3 — Modules 2–10, 12–14** on cadence, each with its artifact + tagged question
   bank + one flagship sim.
5. **Phase 4 — Module 15 capstone + boardroom-defense engine.**
6. **Phase 5 — CYBER_FLAGSHIP_AUDIT_v1.md**: map every module →
   artifact → simulation → portfolio piece → interview story → career outcome (the founder
   dashboard answer to "can I prove every module contributes to employment?").

**Activation rule:** Cyber does not enter the launch four until the launch four are proven
and this program has at least Modules 1–2 and the IR War Room simulation built to flagship
quality. This document satisfies the *taxonomy + architecture + canon* prerequisite; it
does not by itself authorize launch reprioritization.

---

## 4.1 Certification gate (ratified 2026-06-21)

**MVP certificate (launch with this):**

```
Pass module exams  +  Submit capstone artifact  +  Founder approval  =  Certificate
```

**Do NOT gate the MVP certificate on** board review, defense panels, or a working simulation
engine. Those raise the bar but delay launch by weeks (the BA lesson). They become:

**Certificate v2 (post-launch):** MVP gate **+** boardroom defense **+** simulation score.

The M15 capstone's boardroom defense (see §3) remains the *aspiration* and the v2 gate — it
is not required for the MVP certificate. Ship credible-and-fast; raise the bar weekly after.

## 5. Where this plugs into the codebase

- **Competency slugs:** `/docs/standards/COMPETENCY_TAXONOMY.md` §2.1 (`cyber:` registry). ✅
- **Seed function (to build):** a new `supabase/functions/seed-cybersecurity-flagship/`
  following the structure of `seed-ai-business-analyst`, with every quiz question tagged to
  exactly one `cyber:` slug at insert time (never null — per CLAUDE.md).
- **Legacy `seed-cybersecurity-course`:** superseded; retire or rebuild to this model. Do
  not extend the legacy Video→Quiz→Certificate structure.
- **Simulations:** reuse the BA simulation engine (dynamic AI personas, persistence,
  7-dimension rubric, Founder Review Mode, Readiness Score) — clone the proven engine, do
  not rebuild it.

---

*v1 — ratified architecture for the Cybersecurity flagship. Extends the canon; does not
fork it. Changes here are program-level decisions; changes to `cyber:` slugs are
platform-level (append-only).*
