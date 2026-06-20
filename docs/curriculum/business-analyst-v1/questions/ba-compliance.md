# BA Competency Package — `ba:compliance` (question bank)

> Status: **Content — questions only.** Second gap-fill from the coverage matrix (closing the
> `ba:compliance` zero). 20 questions, every one tagged `competency: ba:compliance` (insert-time,
> never NULL). **No lessons, simulations, labs, portfolios, interviews, or certifications generated.**
> Format mirrors the BA bank `{ q, opts[4], a, exp }` + `difficulty`/`topic`. No `A)/B)` prefixes in
> option text (UI auto-prefixes). Correct-answer positions distributed. Framed for the **BA role**
> (requirements, controls, elicitation, validation) — not legal practice.

## 1. Competency coverage map

Difficulty mix (target 30/50/20): **6 foundational · 10 practitioner · 4 senior** = 20.

| Topic (founder scope) | Foundational | Practitioner | Senior | Qs |
|---|---|---|---|---|
| GDPR | Q1 | Q2 | — | 2 |
| HIPAA | Q3 | Q4 | — | 2 |
| PCI-DSS | Q5 | Q6 | — | 2 |
| SOX | — | Q7 | Q8 | 2 |
| Audit trails | Q9 | Q10 | — | 2 |
| Controls | — | Q11 | Q12 | 2 |
| Data retention | Q13 | Q14 | — | 2 |
| Privacy requirements | — | Q15 | Q16 | 2 |
| Regulatory requirement elicitation | Q17 | Q18 | — | 2 |
| Traceability & compliance validation | — | Q19 | Q20 | 2 |
| **Totals** | **6** | **10** | **4** | **20** |

## 2. Question bank

**Q1 · GDPR · Foundational** — correct: index 1
Under GDPR, "data minimization" requires a BA to write requirements that:
1. Collect as much personal data as possible for future use
2. Collect only the personal data necessary for the stated purpose
3. Store all collected data indefinitely
4. Encrypt every field regardless of need
**a: 1** — *Data minimization (Art. 5) limits collection to what's necessary for a specified, legitimate purpose. BAs scope requirements accordingly.*

**Q2 · GDPR · Practitioner** — correct: index 0
A feature lets users export and delete their account data. Which GDPR rights is the BA capturing?
1. Right to data portability (export) and right to erasure (delete)
2. Right to profit-sharing and anonymity
3. Right to unlimited storage
4. Right to anonymous payment
**a: 0** — *Export = data portability (Art. 20); delete = erasure / "right to be forgotten" (Art. 17). BAs turn data-subject rights into functional requirements.*

**Q3 · HIPAA · Foundational** — correct: index 2
In a US healthcare system, which data category triggers HIPAA requirements?
1. Publicly available marketing data
2. Aggregated anonymous statistics only
3. Protected Health Information (PHI)
4. Employee parking records
**a: 2** — *HIPAA governs PHI — individually identifiable health data. BAs flag PHI flows and apply HIPAA privacy/security requirements.*

**Q4 · HIPAA · Practitioner** — correct: index 3
A vendor will process PHI on the organization's behalf. The requirements must account for:
1. A standard NDA only
2. A marketing consent form
3. No special agreement
4. A Business Associate Agreement (BAA) governing the vendor's PHI handling
**a: 3** — *Any vendor handling PHI is a Business Associate requiring a BAA. Integration requirements must include the contractual/control obligations.*

**Q5 · PCI-DSS · Foundational** — correct: index 0
PCI-DSS applies to systems that handle:
1. Cardholder / payment card data
2. Only employee HR data
3. Only health data
4. Public website content
**a: 0** — *PCI-DSS governs storage, processing, and transmission of cardholder data. Payment features must be scoped to PCI controls.*

**Q6 · PCI-DSS · Practitioner** — correct: index 1
To reduce PCI-DSS scope for checkout, the strongest requirement a BA can specify is:
1. Store full card numbers in the app database for convenience
2. Use tokenization / a compliant third-party processor so raw card data never touches our systems
3. Email card numbers to support for refunds
4. Log card numbers for debugging
**a: 1** — *Outsourcing card capture/tokenization keeps raw PAN out of your environment, shrinking PCI scope. Storing/logging/emailing card data expands scope and risk.*

**Q7 · SOX · Practitioner** — correct: index 3
SOX primarily drives requirements around:
1. Marketing campaign performance
2. UI color accessibility
3. Social media engagement
4. Integrity and auditability of financial reporting and the controls over it
**a: 3** — *Sarbanes-Oxley targets accuracy/integrity of financial reporting and internal controls. BAs capture control, segregation-of-duties, and audit requirements.*

**Q8 · SOX · Senior** — correct: index 2
For a SOX-relevant financial system, the most essential control requirement is:
1. Faster page load times
2. A dark-mode theme
3. Segregation of duties plus an immutable audit trail of changes to financial data
4. More email notifications
**a: 2** — *SOX hinges on preventing/detecting improper changes to financial data: segregation of duties + tamper-evident audit trails are core control requirements.*

**Q9 · audit trails · Foundational** — correct: index 1
The purpose of an audit-trail requirement is to:
1. Speed up the database
2. Record who did what, when, and to which data, in a tamper-evident way
3. Reduce storage costs
4. Improve the UI
**a: 1** — *Audit trails provide accountability and traceability (who/what/when/which-record), tamper-evident, to satisfy regulators and investigations.*

**Q10 · audit trails · Practitioner** — correct: index 0
A stakeholder asks to let admins edit audit logs to "fix mistakes." The BA should:
1. Reject editable logs; specify append-only, immutable logging with corrections as new attributed entries
2. Allow edits to keep logs clean
3. Allow deletion of old entries
4. Make logging optional
**a: 0** — *Editable logs defeat their purpose and violate most regimes. Logs must be append-only/immutable; corrections are new entries, never overwrites.*

**Q11 · controls · Practitioner** — correct: index 2
In compliance terms, a "control" is:
1. A UI button
2. A project milestone
3. A safeguard or procedure that reduces a specific risk to an acceptable level
4. A type of stakeholder
**a: 2** — *A control is a preventive/detective/corrective safeguard mitigating a defined risk. BAs map requirements to the controls addressing regulatory risk.*

**Q12 · controls · Senior** — correct: index 3
To demonstrate a system meets a regulation, the most defensible BA approach is to:
1. Assert compliance in a summary email
2. Rely on the vendor's brochure
3. Wait for an audit to find gaps
4. Map each obligation to a specific control and to the requirement/test that evidences it
**a: 3** — *Defensible compliance traces obligation → control → requirement → evidence. This mapping is auditable and surfaces gaps proactively.*

**Q13 · data retention · Foundational** — correct: index 0
A data-retention requirement specifies:
1. How long data is kept and when/how it is securely deleted
2. How fast data loads
3. The database vendor
4. The dashboard color scheme
**a: 0** — *Retention requirements define retention periods and secure disposal, balancing legal minimums against storage-limitation principles.*

**Q14 · data retention · Practitioner** — correct: index 1
GDPR storage limitation and a 7-year financial-record law seem to conflict for one dataset. The BA should:
1. Keep everything for 7 years to be safe
2. Separate data by purpose and apply the specific lawful retention to each
3. Delete everything after 30 days
4. Ignore one regulation
**a: 1** — *Different data has different lawful bases. Scope retention per category/purpose — financial records per statute, other personal data per its basis — not a blanket rule.*

**Q15 · privacy requirements · Practitioner** — correct: index 3
"Privacy by design" means the BA should:
1. Add a privacy-policy page at the end
2. Collect data first and restrict it later
3. Leave privacy to the legal team only
4. Build privacy controls into requirements from the start, not bolt them on later
**a: 3** — *Privacy by design (GDPR Art. 25) embeds privacy into requirements/architecture from inception — minimal-default data, purpose limitation, designed-in controls.*

**Q16 · privacy requirements · Senior** — correct: index 2
When is a Data Protection Impact Assessment (DPIA) most clearly required, and the BA's role?
1. Only after a breach; the BA has no role
2. Never — it's purely legal
3. For high-risk processing (large-scale sensitive data/profiling); the BA maps processing, risks, and mitigations into requirements
4. Only for marketing emails
**a: 2** — *A DPIA is required for high-risk processing (GDPR Art. 35). BAs map the processing, surface risks, and translate mitigations into requirements/controls.*

**Q17 · regulatory requirement elicitation · Foundational** — correct: index 0
When eliciting compliance requirements, the BA's best primary sources are:
1. The applicable regulations/standards plus compliance, legal, and audit stakeholders
2. Developer preferences
3. Competitor websites
4. Social-media trends
**a: 0** — *Compliance requirements come from the regulations themselves and the accountable people (compliance/legal/audit/DPO), not informal sources.*

**Q18 · regulatory requirement elicitation · Practitioner** — correct: index 1
A stakeholder says "just make it compliant." The BA's most effective next step is to:
1. Add a "compliance" checkbox to the UI
2. Identify which regulations apply, then elicit concrete obligations and controls with compliance/legal SMEs
3. Assume GDPR covers everything
4. Defer until testing
**a: 1** — *"Compliant" is not a requirement. Determine applicable regimes (by data/geography/industry) and translate each into specific, testable obligations with accountable SMEs.*

**Q19 · traceability & compliance validation · Practitioner** — correct: index 2
A compliance traceability matrix helps at audit time because it:
1. Lists all developers
2. Tracks sprint velocity
3. Links each obligation to the requirement, control, and test evidence that satisfies it
4. Stores user passwords
**a: 2** — *It maps obligation → requirement → control → evidence, giving auditors a defensible, complete line of sight and exposing unmet obligations.*

**Q20 · traceability & compliance validation · Senior** — correct: index 3
During validation, a BA finds an obligation with a requirement but no implemented control and no test evidence. The correct conclusion is:
1. It's fine because a requirement was written
2. It's the auditor's problem
3. Mark it compliant and move on
4. The obligation is unverified / non-compliant — flag it as a gap until a control and passing evidence exist
**a: 3** — *A written requirement without an effective, evidenced control is an open compliance gap. Validation requires evidence of an effective control, not just documentation.*

## 3. Before/after gap report

| `ba:` slug | Before | After | Status |
|---|---:|---:|---|
| `ba:compliance` | 0 | **20** | 🟢 question target met (≈20/module Scrum parity) |

**`ba:compliance` questions: gap closed.** (Live-readiness still needs Lab #14 compliance-matrix +
a compliance portfolio artifact — designed, not built; out of scope here.)

**Remaining BA bank gaps (founder build order):**
1. ~~AI Prompting~~ ✅ closed (20)
2. ~~Compliance~~ ✅ closed (20)
3. `ba:product-discovery` — 5 → author +15
4. `ba:business-architecture` — ~10 → author +10
5. Deepen `ba:ai-analysis`; strengthen `ba:stakeholders` / `ba:elicitation` / `ba:facilitation`.

**Frozen:** lessons, simulations, labs, portfolios, interviews, certifications.
