# Module 4 — Elicitation Techniques & Collaboration (authored)

> Status: **Authored — Module 4.** Gold-standard bar; passed the **Employment Value Gate** while
> authoring. Builds on Module 3 (you can now navigate stakeholders) and turns that access into
> *evidence*: this module is how a BA extracts the real need from people who can't fully articulate it.
> Competency: `ba:elicitation` · Lab: **Elicitation lab** · Simulation: **Sim 1 — Discovery
> Engagement** · feeds **Portfolio P1 (Executive Discovery Report)** · Assessment: 20-Q `chapter_end`
> (`ba:elicitation`, pass 85%, competency at submit).

---

## Lesson 1 · The Elicitation Toolkit
**Competency:** `ba:elicitation` · **Output:** Elicitation Plan

### Objectives
- Match the elicitation technique to the situation instead of defaulting to "a meeting."
- Sequence techniques so each one builds on the last.
- Produce an Elicitation Plan for a real initiative.

### Lesson
Elicitation is not "asking people what they want" — users routinely *can't* tell you what they want,
and what they say they do often differs from what they actually do. The professional skill is choosing
the **right technique for the situation**: interviews (depth, one voice), workshops (alignment, many
voices), observation (what people actually do), document analysis (the system of record), surveys
(breadth, weak signal), and prototyping (reactions to something concrete).

Each technique has a cost and a failure mode. Workshops align a room but amplify the loudest voice.
Surveys scale but capture stated intent, not behavior. Interviews go deep but only into one
perspective at a time. A senior BA *sequences* them: document analysis to learn the landscape →
interviews to go deep → observation to check what's said against what's done → a workshop to align and
prioritize. The sequence matters as much as the techniques.

Real example: a team "gathered requirements" with one big kickoff workshop, wrote everything down, and
built it — then discovered in production that the loudest stakeholder's pet feature wasn't what most
users needed. A short round of interviews and a half-day of observation *before* the workshop would
have surfaced the real need for a fraction of the cost. Choosing and sequencing techniques is the
difference between elicitation and order-taking.

### Practical exercise
For a real initiative, pick three techniques, justify each, and put them in order. Write one sentence
on what each will tell you that the others won't.

### Artifact produced — **Elicitation Plan** (showcaseable)
A one-page plan: techniques chosen, sequence, who/what each targets, and the risk each one mitigates —
a professional work product that shows you think before you "gather."

> **Gate:** capability = technique selection & sequencing · artifact = Elicitation Plan · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 2 · Discovery & JTBD Interviewing
**Competency:** `ba:elicitation` · **Output:** Interview Guide (Lab)

### Objectives
- Run interviews that surface real needs, not courtesy answers.
- Apply Jobs-to-be-Done / "switch" interviewing to uncover the underlying job.
- Produce a reusable, evidence-grade Interview Guide.

### Lesson
The fastest way to get useless requirements is to ask leading, hypothetical questions: *"Would you use
a feature that does X?"* People say yes to be polite, and you build the wrong thing. The fix is
**behavioral, past-tense questioning**: *"Tell me about the last time you faced this — walk me through
exactly what you did."* Stories about real past behavior are evidence; opinions about hypothetical
futures are noise.

**Jobs-to-be-Done (and Bob Moesta's "switch" interview)** sharpens this further: instead of asking
about features, you reconstruct the *timeline* of when someone "hired" a solution — the trigger, the
struggle, what they tried, what made them switch. That timeline reveals the real **job** the customer
is trying to get done, which is far more stable and valuable than any feature request. A returns
process isn't about "a portal"; the job is *"let me undo a purchase mistake without feeling punished."*
Design for the job and the right features follow.

Technique essentials: open-ended questions, comfortable silence (let them fill it), "tell me more,"
and chasing the *why* behind every *what*. Never lead. Real example: an analyst asked customers
"what features do you want in returns?" and got a wish-list nobody used; a second analyst asked "tell
me about your last return — what happened, what was frustrating?" and uncovered that the real problem
was refund *timing*, not the return mechanics. Same customers, opposite (and correct) conclusion.

### Practical exercise
Write 6 interview questions for a real topic. Now rewrite every leading or hypothetical one into a
past-behavior question. Add one JTBD timeline question (trigger → struggle → switch).

### Artifact produced — **Interview Guide** (Lab, showcaseable)
A reusable interview guide: opening, past-behavior and JTBD questions, probing follow-ups, and
anti-leading reminders. Produced in the **Elicitation lab** and reused throughout the program and the
capstone — a genuine BA deliverable hiring managers recognize.

> **Gate:** capability = evidence-grade interviewing · artifact = Interview Guide · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 3 · Contextual Inquiry & Observation
**Competency:** `ba:elicitation` · **Output:** Observation Findings

### Objectives
- Use observation to capture what people actually do (not what they say).
- Run a contextual inquiry in the real work environment.
- Produce Observation Findings that expose hidden needs and workarounds.

### Lesson
There is a gap between **stated behavior and actual behavior**, and it is where requirements go to die.
People forget steps, omit the workarounds they've normalized, and rationalize messy reality into tidy
descriptions. The cure is to **go and see** — the Toyota principle of *genchi genbutsu*, "go to the
actual place." Watching someone do the work for twenty minutes routinely reveals more than an hour of
them describing it.

**Contextual inquiry** (Beyer & Holtzblatt) formalizes this: observe and interview the user *in their
real environment while they do real work*, in a master–apprentice stance — they show you, you ask
about what you see. You discover the sticky notes on the monitor, the shadow spreadsheet that the
"system of record" doesn't know about, the keyboard shortcut that encodes a business rule no one
documented. Those workarounds are unmet requirements in disguise.

Real example: a bank wanted to "digitize" a loan process based on the documented workflow. An hour of
observation in a branch revealed that officers kept a private spreadsheet to track exceptions the
official system couldn't handle — the *real* process. Building from the documented workflow would have
shipped a system everyone immediately worked around (exactly the ERP failure pattern from Module 3);
building from the *observed* process shipped something they actually used.

### Practical exercise
Observe a real task for 15–20 minutes (or recall one closely). List three things the person *did* that
they would not have *said* if you'd only interviewed them. Each is a candidate requirement.

### Artifact produced — **Observation Findings** (showcaseable)
A structured write-up: observed steps, workarounds, the gap vs. the documented process, and the unmet
needs surfaced. Evidence a hiring manager reads as real fieldwork — most candidates have none.

> **Gate:** capability = contextual observation · artifact = Observation Findings · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 4 · Root-Cause & Signal Detection
**Competency:** `ba:elicitation` · **Output:** Root-Cause Brief

### Objectives
- Dig beneath stated requests to the underlying problem (root cause).
- Separate real signal from memorable noise across many inputs.
- Produce a Root-Cause Brief.

### Lesson
Stakeholders hand you **solutions disguised as requirements**: *"add more reports,"* *"build a
portal."* Build those literally and you've automated a guess. The elicitation skill is to ask *what
problem would this solve?* — repeatedly. **Toyota's "5 Whys"** is the simplest tool: *"add more
reports" → why? → "I can't see returns by region" → why does that matter? → "I can't tell where fraud
is rising" → so the real need is a fraud-by-region signal, not "more reports."* You've moved from a
feature to the actual decision the stakeholder is trying to make — and often found a better, cheaper
solution.

The second discipline is **signal vs. noise.** Across 15 interviews, one vivid, emotional story will
dominate your memory — and bias your conclusions — even if it's an outlier. Elite elicitation weighs
**recurring, evidenced patterns** (signal) against **isolated anecdotes** (noise). One loud customer
is not a roadmap; a need that shows up, in different words, across many independent sources is. The
analyst who can't tell them apart builds for the loudest voice in the room.

Real example: a product team nearly rebuilt their checkout because one influential customer complained
bitterly about it. Pattern analysis across all interviews showed checkout barely registered — the
recurring signal was *delivery* uncertainty. The vivid anecdote was noise; the quiet pattern was the
signal. Knowing the difference saved a quarter of misdirected work.

### Practical exercise
Take one stakeholder "requirement." Run 5 Whys until you reach the underlying problem. Then list your
sources for it and mark each as recurring signal or one-off anecdote.

### Artifact produced — **Root-Cause Brief** (showcaseable)
A crisp brief: the stated request, the 5-Whys chain to the real problem, the evidence (with
signal/noise marked), and the reframed need. Demonstrates analytical rigor employers prize.

> **Gate:** capability = root-cause analysis + signal detection · artifact = Root-Cause Brief · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 5 · Eliciting from Difficult & Executive Stakeholders
**Competency:** `ba:elicitation` · **Output:** Elicitation Evidence Pack · **links Sim 1**

### Objectives
- Elicit effectively from guarded, skeptical, or hostile stakeholders.
- Run high-leverage executive interviews under severe time constraints.
- Produce the Elicitation Evidence Pack you carry into Simulation 1.

### Lesson
The hardest elicitation isn't technique — it's people who won't open up. The **guarded or skeptical
stakeholder** (often burned by a past project, per Module 3) gives short, unhelpful answers. Pushing
harder shuts them down. What works: build rapport and psychological safety first, start from *their*
world and *their* pain, and use open, story-based questions — then let silence do the work. You're
lowering defenses, not interrogating.

**Executive interviews** are the opposite constraint: you have fifteen minutes and one shot. You can't
explore; you must be surgical — a few high-leverage questions on strategy, desired outcomes,
constraints, and decision criteria, prepared in advance. Waste an exec's time with detail questions
and you won't get a second meeting. Come in sharp and you walk out with the direction that anchors the
whole engagement.

**The Executive Interview Pyramid.** Executives rarely answer *"what are your requirements?"* — it
isn't how they think. But they will answer questions that climb this pyramid:
**Facts → Problems → Risks → Priorities → Success Metrics.**
- *Facts* — quick grounding: "how does this work today?"
- *Problems* — "what's not working / what frustrates you most?"
- *Risks* — "what worries you about this?"
- *Priorities* — "if we could fix only one thing, what would it be?"
- *Success metrics* — "what would make this initiative a clear win for *you*?"

Ask *"what worries you?"* and *"what would make this successful?"* and an executive hands you the real
requirements **indirectly** — framed as risks and outcomes, which is exactly how they should be
captured. Climbing this pyramid in fifteen minutes yields more than an hour of "requirements gathering."

And carry forward Module 3's nuance: the **difficult stakeholder may be difficult because they're
right.** Treat persistent resistance as information to elicit, not an obstacle to manage.

This lesson assembles everything — interview guide, observations, root-cause brief, and the evidence
from your interviews — into an **Elicitation Evidence Pack**, the input you bring into **Simulation 1
(Discovery Engagement)** and the foundation of the Executive Discovery Report (P1). Lesson → artifact →
simulation → defense.

### Practical exercise
Write your approach for two interviews: (1) a guarded stakeholder who distrusts the project — your
first three moves to build safety; (2) a CEO with 15 minutes — your five highest-leverage questions.

### Artifact produced — **Elicitation Evidence Pack** (showcaseable)
A consolidated, source-linked evidence pack (findings traced to who said/showed what) — the raw
material for discovery. Carried directly into **Simulation 1**; a portfolio piece that proves you can
gather defensible evidence, not just opinions.

> **Gate:** capability = difficult/executive elicitation · artifact = Elicitation Evidence Pack · recruiter ✅ · public ✅ · interview ✅.

---

## Module 4 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:elicitation`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Technique selection & sequencing | Elicitation Plan | ✅ | ✅ | ✅ |
| 2 | Evidence-grade JTBD interviewing | Interview Guide (Lab) | ✅ | ✅ | ✅ |
| 3 | Contextual observation | Observation Findings | ✅ | ✅ | ✅ |
| 4 | Root-cause analysis + signal detection | Root-Cause Brief | ✅ | ✅ | ✅ |
| 5 | Difficult/executive elicitation | **Elicitation Evidence Pack** (→ Sim 1) | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate.

## Meets the gold standard
Unique bodies · real frameworks & cases (technique sequencing, JTBD/Moesta switch interviews,
Beyer & Holtzblatt contextual inquiry, Toyota *genchi genbutsu* + 5 Whys, signal-vs-noise; the
bank-spreadsheet and checkout-vs-delivery cases) · exercise + portfolio-worthy artifact per lesson ·
builds on Module 3 · feeds Lab + Simulation 1 + Portfolio P1 · employment-graded throughout.
