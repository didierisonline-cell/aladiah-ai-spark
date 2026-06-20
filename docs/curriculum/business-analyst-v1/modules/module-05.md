# Module 5 — Facilitation & Workshop Leadership (authored)

> Status: **Authored — Module 5.** Gold-standard bar; **Employment Value Gate** applied while writing.
> Sequence so far: M1 why the role is changing · M2 your operating system · M3 navigate people & power ·
> M4 extract truth from reality · **M5 lead collaborative decisions.** Facilitation is the skill that
> turns a roomful of conflicting stakeholders into an aligned decision — and it's badly under-taught
> across the industry, which makes it a differentiator. Competency: `ba:facilitation` · Simulations:
> **Sim 2 / Sim 3** · Assessment: 20-Q `chapter_end` (`ba:facilitation`, pass 85%, competency at submit).

---

## Lesson 1 · Facilitation Foundations & Safety
**Competency:** `ba:facilitation` · **Output:** Facilitation Playbook

### Objectives
- Distinguish facilitating (owning the process) from contributing (owning the content).
- Create the psychological safety that lets a group do real work.
- Produce a reusable Facilitation Playbook.

### Lesson
A facilitator's job is to own the **process** so the group can own the **content**. The moment you
start pushing your own answer, you've stopped facilitating and started dominating — and the group
disengages. Your tools are structure (a clear goal, agenda, and timeboxes), neutrality (you guide
*how* the conversation runs, not *what* it concludes), and **psychological safety** — the single
biggest determinant of whether a group surfaces the truth or performs politeness.

Google's **Project Aristotle** studied what made teams effective and found psychological safety — the
shared belief that you won't be punished for speaking up — was the #1 factor, above talent or
resources. In a workshop that means: make it safe to disagree, draw out the quiet voices, stop the
loud ones from steamrolling, and never let anyone be punished for raising a problem. A facilitator who
creates safety gets the real risks and the real disagreements on the table *early*, where they're
cheap to resolve — instead of in production, where they're not.

Real example: two teams ran the same requirements workshop. In the first, the senior architect
dominated and juniors stayed silent; the "agreement" reached was the architect's opinion, and it was
wrong about a downstream constraint a junior knew. In the second, the facilitator used round-robin
input and silent written brainstorming first — the constraint surfaced, the design changed, and a
costly rework was avoided. Same people, different facilitation, opposite outcome.

### Practical exercise
Take a meeting you'll run. Write its goal, agenda with timeboxes, and two specific moves you'll use to
draw out quiet voices and contain dominant ones.

### Artifact produced — **Facilitation Playbook** (showcaseable)
Your personal playbook: structure template, neutrality rules, safety techniques (round-robin, silent
brainstorming, "yes-and"), and dominance/disengagement countermeasures. A work product that signals
you can run a room.

> **Gate:** capability = neutral facilitation + safety · artifact = Facilitation Playbook · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 2 · Discovery Workshops & Story Mapping
**Competency:** `ba:facilitation` · **Output:** Story Map

### Objectives
- Design and run a discovery workshop that produces shared understanding.
- Facilitate a user **story map** to reveal scope, gaps, and releases.
- Produce a Story Map.

### Lesson
A discovery workshop turns many heads into one shared picture — fast. The highest-value format for a
BA is **user story mapping (Jeff Patton):** you lay the user's journey left-to-right across the top
(the "backbone" of activities), then build prioritized detail downward beneath each step. In an hour a
mixed group of business, product, and engineering can *see* the whole experience, spot the gaps
("nobody owns the refund-status step"), and slice coherent releases (a horizontal line through the map
is a release that delivers a complete journey, not a pile of disconnected features).

Why this beats a flat backlog: a backlog is a list with no shape; a story map has a narrative. It
keeps the team anchored to the *user's journey* and exposes what a list hides — missing steps,
over-built corners, and the smallest slice that still delivers value end-to-end. As a facilitator you
keep the group at the right altitude (journey first, detail later) and force prioritization by making
trade-offs visible on the wall.

Real example: a team's flat backlog had 140 tickets and no one could tell what "done enough to ship"
meant. A two-hour story-mapping workshop revealed the journey had only seven real steps, two of which
were entirely unaddressed, and that a thin slice across all seven was a shippable MVP. The map made
the invisible visible — and replaced months of debate with a decision.

### Practical exercise
For a real product or process, lay out the user-journey backbone (5–9 steps) and place 2–3 details
under each. Draw one horizontal line marking a coherent first release.

### Artifact produced — **Story Map** (showcaseable)
A user story map: journey backbone, prioritized detail, gaps flagged, and a release slice marked — a
recognizable, portfolio-grade product/BA artifact.

> **Gate:** capability = workshop facilitation + story mapping · artifact = Story Map · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 3 · Event Storming for Process Discovery
**Competency:** `ba:facilitation` · **Output:** Event-Storm Artifact

### Objectives
- Facilitate Event Storming to map a complex business process with stakeholders.
- Surface bottlenecks, handoffs, and ownership gaps collaboratively.
- Produce an Event-Storm Artifact.

### Lesson
When a process is complex and nobody holds the whole picture, **Event Storming (Alberto Brandolini)**
is the fastest way to build shared understanding. The group maps the process as a timeline of
**domain events** ("Return Requested," "Refund Approved," "Item Restocked") on a long wall, then layers
in the commands, actors, and systems behind each. Because everyone builds it together, the *gaps* and
*conflicts* surface in the room: two people place the same event differently, or no one can name who
owns a step — and that disagreement *is* the discovery.

The facilitation skill is keeping a large, opinionated group productive: start with events only (no
solutioning), let the timeline grow chaotically, then converge — clustering, resolving conflicts,
marking the **hotspots** (bottlenecks, painful handoffs, unclear ownership). Those hotspots are your
process-improvement opportunities, identified by the people who live the process rather than guessed at
by an analyst alone.

Real example: a returns process spanned five teams and no single person understood the end-to-end
flow. A half-day Event Storming session put all five in a room; the wall revealed two events everyone
assumed "someone else" handled (so neither did) and a three-day queue hidden between two systems. The
bottleneck that drove the cost problem became visible in two hours — and undeniable, because the people
who owned each step had built the map themselves.

### Practical exercise
Map a real process as a timeline of 8–12 domain events. Mark two "hotspots" — a bottleneck and an
ownership gap.

### Artifact produced — **Event-Storm Artifact** (showcaseable)
A captured event-storm: the event timeline, actors/systems, and marked hotspots — a sophisticated
process-discovery deliverable that very few BAs can produce and feeds directly into BPMN (Module 7).

> **Gate:** capability = collaborative process discovery · artifact = Event-Storm Artifact · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 4 · Prioritization & Conflict Workshops
**Competency:** `ba:facilitation` · **Output:** Workshop Outcomes Log

### Objectives
- Facilitate transparent prioritization decisions a group will actually commit to.
- Move a conflicted room from positions to a decision without picking sides by seniority.
- Produce a Workshop Outcomes Log.

### Lesson
Two of the hardest things a BA facilitates are **prioritization** (deciding what *not* to do) and
**conflict** (when stakeholders genuinely disagree). Both fail the same way — the loudest or most
senior voice wins, and quiet commitment evaporates. The fix is to give the group a **transparent
method** so the decision is the group's, not yours.

For prioritization: a shared, visible technique — **dot voting** for quick group sense, value/effort
mapping for trade-offs, or **WSJF** (Weighted Shortest Job First) when economics matter. The method
makes the trade-offs explicit and the outcome defensible. For conflict: borrow Module 3's Fisher & Ury
move *inside the room* — surface the interests behind the positions, find options that serve both, and
when a real trade-off remains, route it to the right deciding authority with the trade-off made plain.

And when a group spins — circling with no convergence — the facilitator applies a **convergence
technique**: timebox the discussion, dot-vote, or invoke an agreed decision rule. Knowing how to move a
room from divergence to a decision, on purpose, is a senior skill most people never learn.

Real example: a prioritization meeting had run twice with no decision because two directors kept
relitigating. The third time, the facilitator put every item on a value/effort grid, gave each person
five dots, and timeboxed it to 30 minutes. The group reached a ranked list it owned — because the
*method*, not a person, made the call.

### Practical exercise
Facilitate (or plan) a prioritization for a real backlog using one explicit method (dot voting or
value/effort). Then take one likely conflict and write how you'd surface interests and converge.

### Artifact produced — **Workshop Outcomes Log** (showcaseable)
A clean record: decisions made, the method used, trade-offs accepted, dissent noted, and owners/next
steps — proof you can drive a group to committed decisions, not just discussion.

> **Gate:** capability = prioritization + conflict facilitation · artifact = Workshop Outcomes Log · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 5 · Executive Decision Forums & Multi-Team Facilitation
**Competency:** `ba:facilitation` · **Output:** Decision Forum Pack · **links Sim 2**

### Objectives
- Facilitate an executive decision forum to a clear, owned decision.
- Coordinate facilitation across multiple teams with dependencies.
- Produce a Decision Forum Pack you'll use in Simulation 2.

### Lesson
Facilitating **executives** is its own discipline. They have little time and big consequences, so an
open-ended discussion is a failure. You **frame the decision**: a tight pre-read, a small number of
options with a clear recommendation (use Module 3's Executive Narrative Framework), the trade-offs, and
a drive to a *decision with an owner and a next step.* A forum that ends without a decision wasted the
most expensive calendars in the company — and that's on the facilitator.

**Multi-team facilitation** scales the challenge. Aligning six teams in a program isn't six times one
team — it's a different problem: cross-team dependencies, shared decisions, and divergent context. The
facilitation must make dependencies visible, create shared decision points (so teams don't optimize
locally and break globally), and keep a consistent picture across groups that each see only their
slice. This is the facilitation a Lead BA or program-level analyst is paid for.

This lesson produces the **Decision Forum Pack** — pre-read, framed decisions, and a facilitation plan —
the artifact you carry into **Simulation 2 (Executive Steering Committee)**, where you'll facilitate a
skeptical executive group to a funded decision. Lesson → artifact → simulation → defense, again.

### Practical exercise
Design an executive decision forum for a real decision: the pre-read (half a page), the framed options
+ recommendation, and how you'll drive to an owned decision in 30 minutes.

### Artifact produced — **Decision Forum Pack** (showcaseable)
A pre-read, framed-decision agenda, and facilitation plan for an executive forum — carried into
**Simulation 2**. A portfolio piece that proves you can run the room where the money decisions happen.

> **Gate:** capability = executive + multi-team facilitation · artifact = Decision Forum Pack (→ Sim 2) · recruiter ✅ · public ✅ · interview ✅.

---

## Module 5 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:facilitation`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Neutral facilitation + psychological safety | Facilitation Playbook | ✅ | ✅ | ✅ |
| 2 | Discovery workshop + story mapping | Story Map | ✅ | ✅ | ✅ |
| 3 | Collaborative process discovery | Event-Storm Artifact | ✅ | ✅ | ✅ |
| 4 | Prioritization + conflict facilitation | Workshop Outcomes Log | ✅ | ✅ | ✅ |
| 5 | Executive + multi-team facilitation | **Decision Forum Pack** (→ Sim 2) | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate.

## Meets the gold standard
Unique bodies · real frameworks & cases (Google Project Aristotle / psychological safety, Jeff Patton
story mapping, Brandolini Event Storming, dot-voting / value-effort / WSJF, Fisher & Ury in-room,
convergence techniques) · exercise + portfolio-worthy artifact per lesson · builds on M3 (Executive
Narrative Framework, interests-vs-positions) and feeds M7 (BPMN) + Simulation 2 · employment-graded.
