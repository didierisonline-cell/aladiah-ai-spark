# Module 1 — Business Analysis in the AI Era (authored · gold-standard template)

> Status: **Authored lesson content — Module 1 only.** This is the quality bar every other module
> (M2–M15) is authored against, then wired into the real BA course. Built on the blueprint
> (`00_AUTHORING_BLUEPRINT.md`). Each lesson is unique and progressive, uses real case studies and AI
> examples, includes a practical exercise, produces a tangible artifact, and maps to the frozen
> competency model + tagged question bank. No placeholder text; nothing is reused between lessons.
>
> Module competencies: `ba:requirements`, `ba:ai-analysis`, `ba:product-thinking`.
> Module assessment: `chapter_end` quiz (20 Q drawn from the tagged bank — `ba:requirements` /
> `ba:ai-analysis` / `ba:product-thinking`). Pass 85%.

---

## Lesson 1 · The Evolution of the Business Analyst
**Competency:** `ba:requirements` · **Output:** Personal Career Transformation Plan

### Objectives
- Explain how the BA role evolved from documentation-writer to value-driver, and where it's going.
- Locate yourself honestly on the BA career ladder (Junior → Transformation Consultant).
- Produce a Personal Career Transformation Plan that guides your whole program.

### Lesson
For thirty years the job description for a Business Analyst barely changed: *gather requirements,
write them down, hand them to developers.* In a waterfall world that made sense — software was
expensive to change, so the value was in specifying everything up front. The BA was a **scribe**.

Two shifts broke that model. First, **Agile** moved value from documents to conversations and
working software; the BA became a **facilitator and product partner** who frames problems, not just
records answers. Second — and far bigger — **AI** turned the most time-consuming parts of the job
(drafting requirements, summarizing interviews, modeling processes) into things a machine can do in
seconds. When the *mechanical* parts of analysis get automated, the human value moves up the stack:
to judgment, to discovery, to stakeholder navigation, to deciding *what is worth building at all.*

Here's the uncomfortable truth this program is built around: **nobody gets hired because they can
define "Business Analyst."** They get hired because they can walk into ambiguity — *"our returns
process is a mess, fix it"* — and come out with an evidence-based recommendation an executive will
fund. That is a different, higher-paid job than the scribe ever had.

**The modern ladder** (Aladiah's Career Outcome Matrix):
- **Junior BA / Requirements Analyst** ($60–85k) — elicits and specifies under guidance.
- **Business Analyst / Product Analyst** ($90–115k) — owns discovery and solution definition.
- **Lead BA / Product Owner** ($115k+) — drives product and cross-functional outcomes.
- **Head of Product Ops / Transformation Consultant** ($130–250k) — redesigns how the business
  itself operates. This is McKinsey/Deloitte/Accenture territory, and it is reachable from here.

Real example: a BA at a logistics firm who spent two years writing JIRA tickets plateaued at $78k.
After learning to run discovery, model capabilities, and present transformation cases, the *same
person* moved into a transformation-consultant role at nearly double the compensation — not because
they learned a new tool, but because they moved up the value stack this ladder describes.

### Practical exercise
Audit your last 6 months of work. For each task, label it **mechanical** (could be automated) or
**judgment** (genuinely human). The ratio tells you how exposed — or how valuable — your current
role is, and where to aim.

### Artifact produced — **Personal Career Transformation Plan**
A one-page plan you will revisit every module:
1. **Current state** — title, comp, the competencies you can evidence today.
2. **Target role** — pick a rung on the ladder above.
3. **Salary goal** — the band for that target.
4. **Skill-gap analysis** — which of the 13 `ba:` competencies you're missing for the target.
5. **90-day plan** — the first three modules + first portfolio artifact you'll complete.

---

## Lesson 2 · Deterministic vs Probabilistic: Why AI Changes BA
**Competency:** `ba:ai-analysis` · **Output:** AI Impact Assessment

### Objectives
- Distinguish deterministic systems from probabilistic (AI) systems and why the difference matters.
- Identify where AI creates opportunity for a BA — and where it creates new risk.
- Produce an AI Impact Assessment for a real process.

### Lesson
Every system a BA has ever specified was, until recently, **deterministic**: the same input always
produces the same output. A loan-approval rules engine that says *"reject if credit score < 600"*
will reject the same applicant every single time. You can specify it completely, test it exhaustively,
and audit it perfectly. Requirements for deterministic systems are about **completeness and correctness.**

**Probabilistic systems** — the ones powered by machine learning and large language models — behave
differently. Ask an LLM the same question twice and you may get two different answers. The output is
a *likely* answer, not a *guaranteed* one. This single property changes everything about how a BA
specifies, validates, and governs a system:
- You can't enumerate every output, so requirements shift from *"the system shall…"* to *"the system
  shall be correct ≥ X% of the time, with this fallback when it isn't."*
- Testing becomes **evaluation** (measuring accuracy on a dataset), not pass/fail.
- New requirement types appear: **accuracy thresholds, bias constraints, explainability, fallback
  behavior, human-in-the-loop checkpoints.**

**Case study — the Amazon recruiting AI (a cautionary tale every BA should know).** Amazon built an
AI tool to screen résumés. Trained on a decade of past hires (mostly men), it taught itself that
male candidates were preferable and **penalized résumés containing the word "women's."** No
deterministic rule said "discriminate" — the bias emerged probabilistically from the data. The
project was scrapped. The failure wasn't bad code; it was the **absence of a BA discipline** for
probabilistic systems: no fairness requirement, no bias evaluation, no governance. That gap is
exactly the competency this program builds (`ba:compliance`, `ba:ai-prompting`).

**Where this creates opportunity:** AI can now draft requirements, summarize 20 interviews, and
extract a process from a transcript in seconds. The BA who knows how to *direct and validate* that
work does in a day what used to take a week — and is far more hireable than one who fears it.

### Practical exercise
Take one process from your organization. List which parts are deterministic (rules you could write
down) and which are becoming probabilistic (judgment, prediction, language). For each probabilistic
part, name one new risk it introduces.

### Artifact produced — **AI Impact Assessment**
For a chosen process: (1) where AI could help, (2) the value at stake, (3) the new risks
(bias/hallucination/compliance), (4) what would have to be true for it to be trustworthy.

---

## Lesson 3 · The AI-Native Operating Model
**Competency:** `ba:ai-analysis` · **Output:** AI BA Operating Model

### Objectives
- Design a human+AI workflow with explicit validation loops.
- Decide when to trust AI output and when a human must stay in the loop.
- Produce your AI BA Operating Model — how *you* will work with AI for the rest of the program.

### Lesson
Most people use AI like a vending machine: ask a question, take the answer, move on. A professional
analyst uses it like a **junior team member whose work always gets reviewed.** The difference is an
*operating model* — a repeatable workflow with checkpoints.

The AI-native BA loop has four steps:
1. **Frame** — give the AI role, context, the source material, and constraints (a vague prompt
   produces vague, hallucination-prone output).
2. **Generate** — let the AI draft (requirements, summaries, user stories, a process model).
3. **Validate** — the non-negotiable step. Trace each claim to a source; check for contradictions,
   omissions, and fabricated "facts." This is where the analyst's value lives.
4. **Decide** — the human owns the decision and is accountable for it. AI informs; it never signs off.

**Real example — GitHub Copilot.** Developers who accept Copilot's suggestions blindly ship bugs;
developers who treat each suggestion as a *draft to review* ship faster **and** safer. Same tool,
opposite outcomes — the difference is the operating model. The BA equivalent: using Claude to draft a
requirements set is a force-multiplier *if* you validate it, and a liability *if* you don't.

**When to keep a human firmly in the loop** scales with stakes. Drafting a meeting summary? Light
touch. Generating requirements that drive a safety, legal, financial, or regulatory decision?
**Mandatory human review and sign-off**, with the AI-assisted work flagged for auditability. A
mature analyst sets these thresholds *before* the work, not after an incident.

### Practical exercise
Take a task you'll do this week. Write the four-step loop for it: your framing prompt, what you'll
ask AI to generate, the specific checks you'll run to validate, and who owns the final decision.

### Artifact produced — **AI BA Operating Model**
A one-page personal standard: your prompt-framing checklist, your validation checklist (traceability,
contradiction, hallucination), and your human-in-the-loop thresholds by stakes level.

---

## Lesson 4 · Requirements in the Age of AI
**Competency:** `ba:requirements` · **Output:** AI Requirements primer

### Objectives
- Contrast traditional requirements with the new categories AI features demand.
- Write requirements for a probabilistic feature (accuracy, fallback, bias, evaluation).
- Produce an AI Requirements primer that feeds the Module 13 AI Requirements Package.

### Lesson
A traditional functional requirement is binary: *"The system shall send a confirmation email when an
order is placed."* It either does or it doesn't. AI features can't be specified that way, and BAs who
write them like deterministic features ship systems that fail in production.

Specifying an AI feature requires **four new requirement categories** on top of the functional ones:
- **Performance/accuracy requirements** — *"The classifier shall correctly categorize support
  tickets ≥ 92% of the time, measured on a held-out test set."* (A threshold, not a guarantee.)
- **Fallback requirements** — *"When confidence < 0.7, the ticket shall be routed to a human."* What
  happens when the model is unsure is often more important than the happy path.
- **Fairness/bias requirements** — *"Accuracy shall not vary by more than 3 points across protected
  groups."* (The requirement Amazon's recruiting tool lacked.)
- **Evaluation & monitoring requirements** — *how* the system's quality is measured before launch and
  *watched* after, because model performance drifts over time.

**Worked example.** Compare two requirements for an AI returns-triage feature:
- ❌ Traditional style: *"The system shall approve eligible returns automatically."* (What's
  "eligible"? What if it's wrong? What about fraud?)
- ✅ AI-native style: *"The system shall auto-approve returns it scores as low-risk with confidence
  ≥ 0.85; all others route to an agent; auto-approval accuracy shall be ≥ 95% on the validation set;
  false-approval rate by region shall not exceed 2%; a complete audit trail of every decision shall
  be retained per the privacy policy."* The second is fundable, testable, and compliant.

This is the skill that makes a BA indispensable on AI projects — and it's why "BA who understands AI
requirements" is one of the fastest-growing job descriptions on the market.

### Practical exercise
Take one AI feature idea. Write one requirement in each of the four new categories (accuracy,
fallback, fairness, evaluation). Notice how much risk each one removes.

### Artifact produced — **AI Requirements primer**
A short requirements set for one AI feature, including all four new categories — the seed of the
Module 13 AI Requirements Package (P3).

---

## Lesson 5 · Outcomes over Outputs: The Value Mindset
**Competency:** `ba:product-thinking` · **Output:** Value Framing one-pager

### Objectives
- Distinguish outputs (what's built) from outcomes (the change created) and why it matters for hiring.
- Reframe a feature request as the outcome it's meant to serve.
- Produce a Value Framing one-pager.

### Lesson
The single most expensive mistake in software is building the wrong thing efficiently. An **output**
is something you ship — a feature, a report, a portal. An **outcome** is a measurable change in
behavior or business result — *more customers activate, refund time drops, fraud falls.* Junior
analysts deliver outputs. Senior analysts, Product Owners, and Transformation Consultants are paid
to deliver **outcomes** — and to say *no* to outputs that won't move them.

The shift sounds simple and is genuinely hard, because stakeholders speak in outputs. *"Build me a
self-service returns portal."* That's a solution someone fell in love with before anyone validated
the problem. The value-minded BA gently moves the conversation up a level: *"What outcome would the
portal create? Faster refunds? Fewer support calls? Let's confirm those are the real problems before
we commit to that solution."*

**Case study — Amazon's Working Backwards.** Before building anything, Amazon teams write the press
release and FAQ for the finished product *as if it already shipped* — forcing them to articulate the
customer outcome first. Weak ideas die on paper, cheaply, instead of after months of engineering.
It's a discipline for keeping the team anchored to outcomes, not features — and it's a technique you'll
use directly in Module 10 (Product Discovery).

**Why this matters for your career:** in interviews and on the job, the analyst who reframes *"they
asked for X"* into *"the outcome they need is Y, and here's the evidence"* is visibly operating a
level above. It's the difference between order-taker and trusted advisor — and the compensation
follows that difference.

### Practical exercise
Take a recent feature request. Write the output it names, then the outcome it's really chasing, then
one metric that would prove the outcome was achieved. If you can't name the metric, the request isn't
ready to build.

### Artifact produced — **Value Framing one-pager**
For one initiative: the requested output, the underlying outcome, the success metric, and the
assumption that most needs validating — a habit you'll carry into every later module.

---

## Module 1 assessment & competency mapping
- **Assessment:** 20-question `chapter_end` quiz, drawn from the tagged bank across `ba:requirements`,
  `ba:ai-analysis`, `ba:product-thinking`. Pass 85% (competency captured at submit, never NULL).
- **Artifacts produced (5):** Personal Career Transformation Plan · AI Impact Assessment · AI BA
  Operating Model · AI Requirements primer · Value Framing one-pager — the first entries in the
  student's portfolio and the foundation the rest of the program builds on.

## What makes this the gold standard (the bar for M2–M15)
Unique body per lesson (zero reuse) · real named case studies (Amazon recruiting AI, GitHub Copilot,
Amazon Working Backwards) · concrete AI examples · a practical exercise per lesson · a tangible
artifact per lesson · employment-oriented framing tied to the salary ladder · assessment bound to the
competency model. Every subsequent module must clear this bar before it ships.
