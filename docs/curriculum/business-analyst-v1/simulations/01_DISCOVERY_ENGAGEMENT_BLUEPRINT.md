# BA Simulation 1 — "Discovery Engagement" (architecture blueprint)

> Status: **Simulation architecture — design only.** No app code, no content generation, no DB
> writes, no new competencies/slugs. Mirrors the Scrum flagship's interactive sim ("Project Nebula":
> `ScrumSimulation.tsx` + `SimulationTypes.ts` + the `scrum-simulation` edge function +
> `scrum_simulations`/`simulation_messages`/`simulation_scores`). This is the **primary** interactive
> BA simulation; the other 9 (Steering Committee … Enterprise Discovery Program) reuse this engine.
> Employers hire evidence — this sim produces a real artifact (the Executive Discovery Report).

## 1. Purpose & competency coverage

The learner runs a full discovery engagement on an ambiguous, conflicted initiative and produces a
prioritized recommendation. Exercises **9 of 13 `ba:` slugs** (scored):

| Phase output | Primary slug(s) scored |
|---|---|
| Interview plan + interviews | `ba:elicitation`, `ba:stakeholders` |
| Findings synthesis (AI-assisted, evidence-traced) | `ba:ai-analysis`, `ba:requirements` |
| Current-state model | `ba:process-analysis` |
| Opportunity identification & clustering | `ba:product-discovery` |
| Prioritization | `ba:product-thinking`, `ba:solution-eval` |
| Compliance constraints respected | `ba:compliance` |
| Executive Discovery Report + recommendation | `ba:solution-eval`, `ba:stakeholders` |

## 2. Scenario design — "Aurora Retail Group: the Returns Problem"

Mid-size omnichannel retailer. Sponsor brief is deliberately vague: *"Fix our returns process —
customers are unhappy and costs are climbing."* The real problem is unknown; the learner must
discover it. **Inputs the learner receives at start:**
- **Sponsor brief** (ambiguous goal, no defined scope).
- **6 stakeholder personas** with conflicting goals + hidden agendas (see §3).
- **Interview notes** — partial, contradictory, secondhand.
- **A pile of incomplete/contradictory "requirements"** already floating around.
- **Evidence pack** — returns metrics, complaint logs, a process snippet.
- **A compliance constraint** — customer data retention/privacy (GDPR-style) + finance audit (SOX-style).

The "right" answer is not pre-written: multiple defensible recommendations exist; scoring rewards
evidence-based reasoning, not a single key.

## 3. Stakeholder personas (AI-driven, in-character)

| Persona | Stated goal | Hidden agenda / tension |
|---|---|---|
| VP Operations (sponsor) | "Cut returns cost" | Wants a quick win to look good this quarter |
| Head of Customer Service | "Make returns easier for customers" | Fears headcount cuts |
| Finance Controller | "Control cost + audit trail" | SOX/audit non-negotiables; distrusts "agile" |
| Legal/Privacy Officer | "Stay compliant" | Will veto data-retention violations |
| Store Operations Manager | "Don't disrupt stores" | Resistant; been burned by past projects |
| E-commerce Product Lead | "Build a slick returns portal" | Solution-first; jumps to features |

Each persona has: goals, knowledge it holds, willingness to share (rapport-gated), and **the ability
to mislead** (so the learner must separate signal from noise). Information is revealed based on
question quality (open/story-based vs leading) — directly exercising `ba:elicitation`.

## 4. Flow (8 phases)

1. **Plan discovery** — pick whom to interview and draft questions. *(elicitation, stakeholders)*
2. **Conduct interviews** — AI chat with personas; uncover real needs, conflicts, hidden agendas. *(elicitation, stakeholders)*
3. **Synthesize findings** — capture insights to the Evidence Board, each linked to its source; use AI to cluster/summarize, then validate (catch contradictions, omitted dissent, hallucinated "facts"). *(ai-analysis, requirements)*
4. **Model current state** — assemble a simple BPMN of the as-is returns process. *(process-analysis)*
5. **Identify opportunities** — build an opportunity set (OST-style) from validated findings. *(product-discovery)*
6. **Prioritize** — value/effort + evidence-strength on the opportunity board. *(product-thinking, solution-eval)*
7. **Compliance check** — confirm the recommendation respects retention/privacy + audit constraints. *(compliance)*
8. **Recommendation** — assemble the **Executive Discovery Report** with a clear, evidence-backed recommendation. *(solution-eval, stakeholders)*

## 5. Screens (reuse the existing simulation engine where possible)

| Screen | Purpose | Reuses |
|---|---|---|
| Brief & Inbox | Sponsor brief, incoming complaints/messages | `EmailInbox` pattern |
| Interview Room | AI persona chat / interviews | `MeetingRoom` pattern |
| Evidence Board | Capture findings; **link each to its source** (traceability) | new (RiskBoard-style cards) |
| Process Modeler | As-is BPMN canvas | `JiraBoard`-style board |
| Opportunity Board | OST + value/effort prioritization | `RiskBoard` pattern |
| Report Builder | Assemble the Executive Discovery Report | `ReportGenerator`/`ReportsDashboard` |
| Methods Glossary | BA techniques reference | `SimulationGlossary` |

## 6. Scoring model (mirrors Scrum `DayScore` → grade + skills report)

Per-dimension 0–100, weighted, with feedback; total → letter grade (A ≥90 … F) and a competency
skills report:

| Dimension | Weight | Competency |
|---|---:|---|
| Elicitation quality (right people, open questions, depth) | 18 | `ba:elicitation` |
| Stakeholder navigation (conflict, sponsor, hidden agendas) | 15 | `ba:stakeholders` |
| Synthesis & evidence rigor (traceability, caught contradictions, validated AI) | 18 | `ba:ai-analysis` + `ba:requirements` |
| Current-state accuracy | 12 | `ba:process-analysis` |
| Opportunity quality & prioritization | 17 | `ba:product-discovery` + `ba:product-thinking` |
| Compliance awareness | 8 | `ba:compliance` |
| Recommendation & communication | 12 | `ba:solution-eval` |

Scoring = deterministic checks (e.g., did findings link to sources? was the privacy constraint
respected?) **+** AI rubric grading of qualitative work. Pass ≥ 80 (distinction ≥ 92), matching the
Scrum sim's bar.

## 7. Data model (design — mirrors `scrum_simulations` family; not created yet)

| Table | Purpose |
|---|---|
| `ba_simulations` | session: user_id, scenario_id, status, started_at, score, grade |
| `ba_simulation_messages` | interview/chat turns (persona, role, content) |
| `ba_simulation_findings` | captured findings + source link + opportunity/priority |
| `ba_simulation_scores` | per-dimension scores + feedback (skills report) |

RLS: owner-scoped read (`auth.uid() = user_id`) + admin, identical to existing sim tables.

## 8. Edge function (`ba-simulation`) — actions (design)

`start` · `interview_message` (AI persona response, rapport/quality-gated) · `submit_finding` ·
`submit_model` · `submit_opportunities` · `submit_prioritization` · `compliance_check` ·
`generate_report` · `end` (final scoring rubric). AI returns in-character persona replies, evidence
hints, and the final rubric — same contract shape as `scrum-simulation`.

## 9. Output → portfolio (the evidence employers hire on)

On completion the sim emits a **draft Executive Discovery Report** (problem framing, evidence,
current-state model, prioritized opportunities, recommendation, compliance note) → becomes
**Portfolio Artifact #1** (`00_ARCHITECTURE.md` §5). The learner refines and commits it to their
GitHub BA portfolio. Simulation 2 ("Executive Steering Committee") then makes them **defend** it.

## 10. Acceptance criteria
- All 8 phases playable; scores map to the 9 competencies above; pass gate enforced.
- Findings require source links (traceability) and the AI-synthesis step requires a validation pass.
- Produces a portfolio-ready Executive Discovery Report.
- Persisted + honest states (resume in progress, no fabricated scores).

## 11. Out of scope (explicitly)
No app code, no edge-function implementation, no migrations, no lessons, no certifications, no other
simulations — this is the **architecture** for Simulation 1 only. Build order for the suite stays:
design each blueprint → then implement, one at a time, against the shared engine.
