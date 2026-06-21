# BA Competency Package — `ba:ai-analysis` (deepening: awareness → applied)

> Status: **Content — questions only.** Depth-builder #1. **10 new** questions
> (`competency: ba:ai-analysis`) added to the 20 awareness-level → **30 total**, now applied-depth.
> **Boundary:** `ba:ai-prompting` = *how to instruct/validate AI*; `ba:ai-analysis` = *using AI as a
> professional analyst* (the analytical workflows/judgment). No `A)/B)` prefixes; distributed
> answers. **No lessons, simulations, labs, portfolios, interviews, or certifications generated.**

## 1. Coverage map (10 new) — 3F / 5P / 2S
AI Requirements Engineering (Q1–Q2) · AI Story Engineering (Q3–Q4) · AI Validation as analysis (Q5–Q6) · AI Decision Support (Q7–Q8) · Human-in-the-loop Governance (Q9–Q10).

## 2. Question bank (10 new)

**Q1 · AI requirements engineering — normalization · Foundational** — correct: index 1
A BA uses AI to extract requirements from 200 legacy pages. "Normalization" means:
1. Making the document shorter
2. Rewriting them into a consistent, atomic, deduplicated form so they can be compared and traced
3. Translating them to another language
4. Deleting the non-functional ones
**a: 1** — *Normalization standardizes extracted requirements into a consistent, comparable form — a core AI-assisted analysis step beyond raw extraction.*

**Q2 · AI requirements engineering — clustering / gap detection · Practitioner** — correct: index 3
AI clusters 300 requirements and flags a capability with almost none. The analyst reads this as:
1. Proof the capability is unimportant
2. A reason to delete that capability
3. An AI error to ignore
4. A possible coverage gap to investigate — a signal, not a conclusion
**a: 3** — *AI clustering surfaces candidate gaps; the analyst investigates with sources/stakeholders. AI flags, the analyst concludes.*

**Q3 · AI story engineering — stories/AC · Foundational** — correct: index 0
Using AI to generate user stories and acceptance criteria, the analyst's core value-add is:
1. Judging fit to real user needs, business rules, and edge cases, then refining
2. Typing speed
3. Accepting whatever is generated
4. Generating the largest possible volume
**a: 0** — *AI drafts; the analyst curates — validating fit, covering edge cases, refining. The professional skill is judgment, not volume.*

**Q4 · AI story engineering — test scenarios / NFR · Practitioner** — correct: index 2
AI generates functional acceptance criteria but no performance, security, or accessibility criteria. This reflects:
1. That NFRs don't matter
2. A formatting issue
3. That AI under-generates non-functional requirements unless explicitly directed and reviewed
4. That the story is complete
**a: 2** — *AI tends to produce happy-path functional criteria and under-represent NFRs. The analyst deliberately elicits and adds them.*

**Q5 · AI validation as analysis — contradiction analysis · Practitioner** — correct: index 1
The strongest analytical use of AI across a 150-requirement set is to:
1. Make the font consistent
2. Detect contradictions, overlaps, and dependencies for the analyst to resolve
3. Approve the set automatically
4. Estimate delivery dates
**a: 1** — *AI excels at surfacing contradictions/overlaps/dependencies across large sets — high-value leverage the analyst then resolves with stakeholders.*

**Q6 · AI validation as analysis — source verification · Senior** — correct: index 3
AI asserts a requirement is "mandated by regulation X." The professional posture is:
1. Accept it — AI cited a regulation
2. Remove all regulatory requirements
3. Ask AI to be more confident
4. Verify the claim against the authoritative source before relying on it, and record the source
**a: 3** — *Analyst rigor verifies AI claims against authoritative sources and records provenance — especially regulatory assertions. AI accelerates; the analyst is accountable.*

**Q7 · AI decision support — trade-off / impact · Practitioner** — correct: index 0
An analyst uses AI for trade-off analysis between two options. AI's appropriate role is to:
1. Structure the criteria and surface pros/cons and impacts for human judgment
2. Make the final decision
3. Hide the weaker option
4. Replace stakeholder input
**a: 0** — *AI structures the decision to support human judgment; it informs the trade-off, it doesn't own the decision, which needs stakeholder context and accountability.*

**Q8 · AI decision support — dependency mapping · Foundational** — correct: index 2
AI-generated dependency maps between requirements are most useful when the analyst:
1. Treats them as final truth
2. Ignores them
3. Uses them as a draft to validate with the team, catching missed or invented links
4. Publishes them unchecked
**a: 2** — *AI dependency maps are a fast first draft that can miss or invent links; the analyst validates before they drive planning.*

**Q9 · Human-in-the-loop — when NOT to trust · Senior** — correct: index 1
Which output most warrants mandatory human review/sign-off?
1. A brainstormed list of names
2. High-stakes outputs affecting safety, legal, financial, or regulatory decisions
3. A meeting summary
4. A reformatted backlog
**a: 1** — *Human-in-the-loop intensity scales with stakes; safety/legal/financial/regulatory outputs demand mandatory review and sign-off.*

**Q10 · Human-in-the-loop — auditability · Practitioner** — correct: index 3
To keep AI-assisted analysis auditable, the analyst should:
1. Delete prompts after use
2. Avoid documentation to save time
3. Trust the tool's logs only
4. Record what was AI-assisted, the sources used, and who reviewed/approved each output
**a: 3** — *Auditability requires recording AI-assisted provenance (what/sources/reviewer/approval) so outputs are traceable and defensible.*

## 3. Gap report
| `ba:ai-analysis` | 20 (awareness) → **30 (applied depth)** | 🟢 deepened |
|---|---|---|
