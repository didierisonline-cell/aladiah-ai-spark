# BA Competency Package — `ba:ai-prompting` (question bank)

> Status: **Content — questions only.** First gap-fill from the coverage matrix
> (`01_QUESTION_TAGGING_AND_COVERAGE.md`). 20 questions, every one tagged
> `competency: ba:ai-prompting` (insert-time, never NULL — per CLAUDE.md). **No lessons,
> simulations, labs, portfolios, interviews, or certifications generated.**
> Format mirrors the existing BA bank `{ q, opts[4], a, exp }` + `difficulty`/`topic`.
> Option text carries **no** `A)/B)` prefixes — the quiz UI auto-prefixes via
> `String.fromCharCode(65+idx)`. Correct-answer positions are distributed (not always first).

## 1. Competency coverage map

Difficulty mix (target 30/50/20): **6 foundational · 10 practitioner · 4 senior** = 20.

| Topic (founder scope) | Foundational | Practitioner | Senior | Qs |
|---|---|---|---|---|
| Requirements generation | Q1 | Q2 | — | 2 |
| Stakeholder synthesis | — | Q3, Q4 | — | 2 |
| User story generation | Q5 | Q6 | — | 2 |
| Acceptance criteria generation | — | Q7, Q8 | — | 2 |
| BRD drafting | Q9 | Q10 | — | 2 |
| BPMN assistance | Q12 | Q11 | — | 2 |
| AI validation | — | Q13 | Q14 | 2 |
| Hallucination detection | Q15 | — | Q16 | 2 |
| Traceability verification | — | Q17 | Q18 | 2 |
| Governance & compliance of AI outputs | Q19 | — | Q20 | 2 |
| **Totals** | **6** | **10** | **4** | **20** |

All 10 in-scope topics covered; difficulty distribution on target.

## 2. Question bank

**Q1 · requirements generation · Foundational** — correct: index 2
A BA uses an LLM to draft functional requirements from a meeting transcript. What is the BA's correct relationship to that output?
1. Send the generated requirements straight to developers to save time
2. Assume the transcript was fully captured because the model processed all of it
3. Treat the output as a first draft to review, validate against stakeholder intent, and refine
4. Use it only if the grammar is perfect
**a: 2** — *AI accelerates drafting, but the BA stays accountable. Generated requirements are a starting draft to validate for accuracy/completeness and refine before use.*

**Q2 · requirements generation · Practitioner** — correct: index 0
Which prompt practice MOST improves generated requirements and reduces ambiguity?
1. Provide role, context, the source material, the target format/template, and explicit constraints ("atomic, testable, no solutioning")
2. Ask "write the requirements" with no other context
3. Request as many requirements as possible regardless of relevance
4. Use the highest creativity/temperature setting
**a: 0** — *Role + context + source + output format + constraints yields atomic, testable, scope-bounded requirements. Vague prompts and high temperature increase ambiguity and fabrication.*

**Q3 · stakeholder synthesis · Practitioner** — correct: index 1
A BA uses AI to synthesize themes and conflicts from 12 interview transcripts. The single most important validation step before sharing is:
1. Reword the synthesis to sound more executive
2. Trace each theme and conflict back to specific statements in the source transcripts
3. Run it through a second AI model
4. Drop minority viewpoints to simplify the summary
**a: 1** — *AI synthesis can omit, over-generalize, or invent. Tracing each theme/conflict to real statements keeps it trustworthy and prevents silent loss of dissenting input.*

**Q4 · stakeholder synthesis · Practitioner** — correct: index 3
An AI synthesis shows strong consensus, but the BA recalls two stakeholders strongly disagreeing. Most likely explanation?
1. The stakeholders changed their minds
2. The disagreement was unimportant
3. AI models cannot detect disagreement
4. The model smoothed real conflict into a plausible-sounding consensus (synthesis bias/omission)
**a: 3** — *LLMs tend to produce agreeable, coherent summaries and can flatten conflict. The BA must prompt for dissent/edge cases and verify against source — unsurfaced conflict is a major discovery risk.*

**Q5 · user story generation · Foundational** — correct: index 1
What is the best use of AI for user stories?
1. Auto-generate and commit them to the backlog without review
2. Generate candidate stories the team then refines and validates against real user value
3. Use it only when no stakeholders are available
4. Replace backlog refinement entirely
**a: 1** — *AI is a drafting accelerator. Generated stories are candidates; the team still validates value, splits, and refines. AI replaces neither refinement nor stakeholder validation.*

**Q6 · user story generation · Practitioner** — correct: index 2
An LLM returns stories all beginning "As a user…". The best prompt refinement is:
1. Ask for more stories
2. Tell it to be more creative
3. Supply specific personas, their goals, and INVEST criteria, and ask for persona-specific value
4. Accept them — "As a user" is always fine
**a: 2** — *Generic "as a user" stories lack real persona value. Personas + goals + INVEST force specific, independent, valuable, testable stories.*

**Q7 · acceptance criteria generation · Practitioner** — correct: index 0
Before AI-generated Gherkin acceptance criteria are "done," the BA must verify:
1. They are testable, cover edge/negative cases, and match the story's real intent and business rules
2. The Gherkin syntax is valid
3. There are at least five scenarios
4. They read confidently
**a: 0** — *Valid syntax and volume aren't quality. Criteria must be testable, reflect true business rules, and include the edge/negative paths AI commonly omits.*

**Q8 · acceptance criteria generation · Practitioner** — correct: index 3
AI-generated criteria look thorough but omit what a regulated system needs for a failed transaction. This illustrates:
1. Gherkin cannot express failure scenarios
2. The story was too detailed
3. Acceptance criteria don't cover failures
4. AI optimizes for the happy path and under-represents negative/compliance scenarios unless prompted
**a: 3** — *LLMs gravitate to common happy-path patterns. The BA must explicitly prompt for failure, exception, and regulatory scenarios — and validate them — especially in regulated domains.*

**Q9 · BRD drafting · Foundational** — correct: index 1
The appropriate way to use AI when producing a BRD is to:
1. Generate it and sign off without review
2. Draft and structure sections with AI, then validate content, fill gaps, and own the final document
3. Use AI only for spelling
4. Avoid AI entirely for formal documents
**a: 1** — *AI accelerates structure and drafting, but the BA owns accuracy, completeness, and sign-off. The BRD is an accountable artifact, not raw AI output.*

**Q10 · BRD drafting · Practitioner** — correct: index 2
To reduce hallucinated facts when an LLM drafts a BRD, the most effective technique is:
1. Ask it to "be accurate"
2. Increase the response length
3. Ground it with the actual source artifacts and instruct it to use only provided sources and flag unknowns
4. Add a longer system prompt about professionalism
**a: 2** — *Grounding (providing/retrieving sources) plus "use only supplied material and mark gaps" is the strongest practical defense against fabricated content.*

**Q11 · BPMN assistance · Practitioner** — correct: index 0
A BA asks an LLM to turn a process narrative into BPMN. The key validation is:
1. Confirm gateways, sequence flows, roles/swimlanes, and exception paths match the real process, with stakeholders
2. Confirm the diagram is colorful
3. Confirm it has at least 10 tasks
4. Confirm the XML is valid
**a: 0** — *AI can produce structurally valid but semantically wrong models (missing exceptions, wrong gateway logic, misassigned roles). Validation against the real process with stakeholders is essential.*

**Q12 · BPMN assistance · Foundational** — correct: index 1
Why should an AI-generated "to-be" process model never be final on its own?
1. AI cannot draw diagrams
2. It reflects the model's assumptions, not validated stakeholder agreement on the future state
3. BPMN is always manual
4. To-be models are unnecessary
**a: 1** — *A to-be process is an agreed design decision. AI can propose options, but the future state must be validated and agreed with stakeholders.*

**Q13 · AI validation · Practitioner** — correct: index 3
The best way to validate a set of AI-generated requirements for a high-stakes project is to:
1. Re-run the same prompt and compare
2. Trust it if the model expressed high confidence
3. Spell-check and ship
4. Cross-check against source evidence, review with SMEs/stakeholders, and test for completeness, consistency, and feasibility
**a: 3** — *Validation triangulates: trace to sources, human SME/stakeholder review, and structured quality checks. Model self-confidence is not evidence of correctness.*

**Q14 · AI validation · Senior** — correct: index 1
An enterprise wants AI-assisted requirements at scale. Which control gives the strongest quality assurance without killing velocity?
1. Ban AI use to avoid risk
2. A human-in-the-loop validation gate with defined acceptance criteria, source traceability, and audit sampling of AI-assisted artifacts
3. Let any analyst publish AI output freely
4. Rely on the vendor's model-accuracy claims
**a: 1** — *Scaled assurance = a defined human gate (acceptance criteria + traceability) plus audit sampling. Bans kill the benefit; free publishing removes accountability; vendor claims aren't project evidence.*

**Q15 · hallucination detection · Foundational** — correct: index 0
In AI-generated requirements, a "hallucination" is:
1. Plausible-sounding content the model fabricated that isn't supported by the source or reality
2. A grammar error
3. A requirement a stakeholder rejected
4. A formatting glitch
**a: 0** — *A hallucination is confident, fluent, but unsupported/fabricated content — especially dangerous in requirements because it looks credible and survives casual review.*

**Q16 · hallucination detection · Senior** — correct: index 2
AI-drafted requirements cite a specific regulation clause and a metric no one provided. The safest BA response is:
1. Keep them — specific citations are usually right
2. Keep the regulation but drop the metric
3. Flag both as unverified, trace to authoritative sources, and remove or correct them before the artifact proceeds
4. Ask the model if it is sure
**a: 2** — *Fabricated citations/figures are classic hallucinations with legal/compliance risk. Verify against authoritative sources and remove/correct; model self-assessment is unreliable.*

**Q17 · traceability verification · Practitioner** — correct: index 0
How does requirements traceability specifically mitigate AI-generation risk?
1. Every requirement links back to a validated source and forward to design/tests, so unsupported (hallucinated) items are exposed as having no origin
2. It makes the document longer
3. It improves prompt quality
4. It replaces stakeholder review
**a: 0** — *A traceability matrix forces each requirement to have a real source and downstream link. AI-fabricated items trace to nothing — making traceability a direct hallucination control.*

**Q18 · traceability verification · Senior** — correct: index 1
A program uses AI to generate requirements across 8 workstreams. The traceability practice that best protects auditability is:
1. Store all AI chats in a folder
2. Tag each requirement with its source evidence and an AI-assisted-origin flag, maintained in a reviewable/auditable traceability matrix
3. Trust the backlog tool's history
4. Only trace requirements that changed
**a: 1** — *Auditability needs per-requirement source linkage plus provenance (AI-assisted flag) in a reviewable matrix — enabling targeted audit of AI-origin items and defensible evidence trails.*

**Q19 · governance & compliance of AI outputs · Foundational** — correct: index 2
Before pasting confidential stakeholder data into a public AI tool to summarize it, the BA must first:
1. Proceed — summaries are low risk
2. Ask stakeholders to remove their names afterward
3. Confirm the data-handling/privacy policy and use an approved compliant tool, or de-identify the data
4. Use the most popular tool available
**a: 2** — *Feeding confidential/PII into unapproved tools can breach GDPR/HIPAA/contracts. Governance (approved tooling, data rules, de-identification) comes before convenience.*

**Q20 · governance & compliance of AI outputs · Senior** — correct: index 3
An organization is defining governance for AI-assisted analysis. The strongest baseline is:
1. A policy document no one enforces
2. Trusting analysts to "use AI responsibly"
3. Blocking all AI tools
4. Approved tooling + data-handling rules + human-in-the-loop validation + provenance/traceability + periodic audit
**a: 3** — *Effective governance layers controls: vetted tools, data rules, mandatory human validation, output provenance/traceability, and audit. Policy-only, trust-only, and ban-only all fail in practice.*

## 3. Gap report (after this package)

| `ba:` slug | Before | After | Status |
|---|---:|---:|---|
| `ba:ai-prompting` | 0 | **20** | 🟢 question target met (≈20/module Scrum parity) |

**`ba:ai-prompting` questions: gap closed.** Remaining for this competency to be fully "live"
(per the coverage matrix): Lab #13 (AI prompting + validation) and Portfolio #3 (AI Requirements
Package) are **designed but not built** — not part of this package.

**Still-open red gaps in the BA bank (next in the founder's order):**
1. `ba:compliance` — 0 questions (next package, ~20)
2. `ba:product-discovery` — 5 (author +15)
3. `ba:business-architecture` — ~10 (author +10)
4. Thin top-ups: stakeholders / elicitation / facilitation; deepen `ba:ai-analysis`.

**Frozen:** lessons, simulations, labs, portfolios, interviews, certifications — no generation
until competency question gaps are closed and approved.
