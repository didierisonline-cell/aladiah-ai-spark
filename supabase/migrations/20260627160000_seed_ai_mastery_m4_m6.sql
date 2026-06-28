-- ============================================================
-- AI Mastery for Scrum Masters & Project Managers
-- Modules 4–6 content seed  (description + EN transcript)
-- Apply by hand in Supabase SQL Editor AFTER M1-M3 file
-- ============================================================
DO $$
DECLARE
  v_course_id uuid;
  v_ch        uuid;
BEGIN
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE title = 'AI Mastery for Scrum Masters & Project Managers';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course not found: AI Mastery for Scrum Masters & Project Managers';
  END IF;

  -- ══════════════════════════════════════════════════════════════
  -- MODULE 4 — AI for Development & Delivery Acceleration
  -- ══════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 3;

  -- 4.1 GitHub Copilot and Cursor: What PMs Need to Know
  UPDATE public.videos SET
    description = 'GitHub Copilot and Cursor are transforming how software gets written — and PMs who understand how they work become dramatically better partners to their engineering teams. This lesson explains what AI coding assistants do, how they change the economics of software delivery, what new risks they introduce, and what PMs should be asking their teams about AI-assisted development.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '4.1 GitHub Copilot and Cursor: What PMs Need to Know',
      'description', 'GitHub Copilot and Cursor are transforming how software gets written. This lesson explains what AI coding assistants do, how they change the economics of software delivery, what new risks they introduce, and what PMs should be asking their engineering teams.',
      'transcript', $t$GITHUB COPILOT AND CURSOR: WHAT PMs NEED TO KNOW

You do not need to write code to understand AI-assisted development. But you do need to understand it well enough to have productive conversations with your engineering team, set realistic expectations with stakeholders, manage the new risks it introduces, and leverage the delivery acceleration it enables.

This lesson is specifically for PMs and Scrum Masters — not a developer tutorial, but a strategic briefing on what is happening in your engineers' IDEs and what it means for your projects.

WHAT AI CODING ASSISTANTS DO

GitHub Copilot (built on OpenAI's Codex, now GPT-4) and Cursor (an AI-native code editor) work as autocomplete systems for code — but at a far higher level than traditional autocomplete. They:

- Suggest entire functions based on a comment describing what the function should do
- Complete boilerplate code (configuration, error handling, test cases) automatically
- Translate natural language requirements into code
- Explain existing code in plain English
- Identify and fix bugs when given an error message
- Generate unit tests for existing functions
- Refactor code for readability or performance

For experienced developers, these tools eliminate the "blank page problem" for familiar patterns — the first draft appears instantly, and the developer's job becomes reviewing, editing, and extending rather than typing from scratch.

THE DELIVERY ECONOMICS IMPACT

GitHub's own research found that developers using Copilot complete tasks 55% faster. Independent research from MIT found productivity gains of 26–37% on a range of coding tasks. These are averages — gains vary by:

- Task type: Boilerplate and repetitive tasks see the highest gains (80%+). Novel algorithm design sees the lowest (5–10%)
- Developer experience: Junior developers see larger gains on tasks where Copilot fills knowledge gaps. Senior developers see gains on productivity, not knowledge
- Language and framework: Better represented in training data (Python, JavaScript, TypeScript) → higher quality suggestions

What this means for PM planning: If your team adopts AI coding tools well, expect delivery velocity to increase by 20–40% over 3–6 months of adoption. Set stakeholder expectations with this range — not "AI makes everything instantly faster" but "with proper adoption, we expect meaningful velocity improvement over the next two quarters."

WHAT PMs SHOULD KNOW ABOUT AI CODE QUALITY

AI-generated code is not always correct, and it is not always secure. This does not mean you should fear AI coding tools — it means your engineering team needs the right code review discipline.

Common AI code issues to be aware of:

Security vulnerabilities: Copilot can generate code that compiles and runs but contains SQL injection vulnerabilities, insecure API key handling, or authentication bypasses if the developer does not critically review the output.

Outdated patterns: Copilot's training has a cutoff date. It may suggest patterns from deprecated library versions or older API contracts.

Hallucinated APIs: Copilot sometimes "invents" API functions that do not exist in the referenced library. The code looks plausible but will fail at runtime.

The mitigation is not to avoid AI coding tools — it is to ensure code review processes are maintained or strengthened, not weakened, when AI assists with code generation. PMs should confirm with their tech lead that AI code review policies are in place.

CURSOR: THE AI-NATIVE IDE

Cursor goes further than Copilot by embedding an AI pair-programmer directly into the code editor. Key capabilities:

- Full codebase context: Cursor can read and reason about the entire codebase, not just the open file
- Natural language refactoring: "Refactor this function to eliminate the nested ternary operators" → Cursor makes the change
- Bug explanation: Paste an error message and the stack trace; Cursor identifies the root cause and suggests a fix
- Multi-file editing: Cursor can make coordinated changes across multiple files simultaneously

For PMs, Cursor is significant because it enables developers to work on complex cross-cutting concerns much faster — changes that previously required senior developer time because of codebase complexity can be made more quickly with Cursor's guidance.

QUESTIONS PMs SHOULD ASK THEIR ENGINEERING TEAMS

- Which AI coding tools are the team using, and what is the adoption rate?
- Have we established AI code review policies? Who owns enforcing them?
- Which story types benefit most from AI assistance on our specific codebase?
- Are there areas where AI-generated code is not appropriate (security-critical paths, performance-critical algorithms)?
- How are we measuring the velocity impact of AI tools?

These questions establish you as a credible AI-aware partner, not just a feature tracker.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 0;

  -- 4.2 AI-Powered Code Review and Pull Request Management
  UPDATE public.videos SET
    description = 'Code review is a quality gate, a knowledge-sharing mechanism, and a significant time sink. AI is now embedded in the code review process through tools like GitHub Copilot for PRs, CodeRabbit, and Sourcegraph Cody — reducing review overhead, catching issues before human review, and surfacing patterns that inform planning and retrospective conversations.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '4.2 AI-Powered Code Review and Pull Request Management',
      'description', 'Code review is a quality gate, a knowledge-sharing mechanism, and a significant time sink. AI-powered review tools reduce overhead, catch issues before human review, and surface patterns that inform PM planning and retrospective conversations.',
      'transcript', $t$AI-POWERED CODE REVIEW AND PULL REQUEST MANAGEMENT

Code review is one of the most important quality practices in software development — and one of the most significant sources of cycle time delay. When PRs sit waiting for review for 24–48 hours, sprint velocity suffers, context switches accumulate, and developer motivation declines. When reviews are rushed because of review backlog, quality issues get through that should have been caught.

AI-assisted code review addresses both sides of this problem: it makes reviews faster by pre-screening obvious issues, and it makes reviews more thorough by consistently applying patterns that human reviewers sometimes miss under time pressure.

THE AI CODE REVIEW ECOSYSTEM

GitHub Copilot for Pull Requests: GitHub's native AI review tool generates a pull request description automatically from the changes in the PR, and can be configured to provide an AI code review that runs before human review. The AI review catches: potential bugs, security vulnerabilities, missing error handling, and adherence to the PR author's stated intent.

CodeRabbit: A dedicated AI code review tool that integrates with GitHub and GitLab. It performs a full AI review on every PR, provides inline comments on specific lines of code, and learns from the team's review patterns over time. For teams with high PR volume, CodeRabbit significantly reduces the backlog of unreviewed PRs.

Sourcegraph Cody: Useful for PMs who need to understand code changes in context — Cody can explain what a PR does in plain English, summarise the scope of changes, and flag areas that might affect functionality the PM cares about.

HOW AI CODE REVIEW CHANGES THE PM'S WORLD

From a PM perspective, AI code review creates three significant changes:

1 — Faster cycle time: PRs that were sitting for 24–48 hours waiting for a reviewer get an immediate AI pre-review. Developers can address the AI's comments while waiting for human review. Human reviewers can focus on higher-level architectural and design concerns rather than syntax and obvious issues.

2 — Better PR quality: The AI review creates a quality bar that PRs must clear before human review. Over time this trains developers to write code that passes AI review, which means it also passes the checks AI is trained on (security patterns, error handling, documentation).

3 — PM-accessible PR summaries: AI tools that generate natural language PR descriptions mean PMs can now read a PR summary and understand what changed and why — without reading code. This enables more informed sprint reviews, better stakeholder communication about what was completed, and more accurate feature acceptance.

THE PM'S ROLE IN HEALTHY CODE REVIEW CULTURE

Code review is a team norm, and PMs and Scrum Masters are in the right position to protect it.

Review these metrics monthly:
- Average time from PR opened to first review: Should be under 4 hours for active teams
- Average time from first review to merge: Should be under 24 hours
- PR rejection rate: A very low rejection rate may indicate reviews are too lenient; a very high rate may indicate stories are not well-defined
- Review distribution: Are the same two developers reviewing everything? That creates a bottleneck and knowledge silo risk

If any of these metrics are out of range, raise them in retrospective as a process issue, not a performance issue.

BEST PRACTICES FOR AI-HUMAN CODE REVIEW INTEGRATION

The pattern that works best:
1. Developer opens a PR. AI tool performs immediate automated review.
2. Developer addresses AI feedback before requesting human review.
3. Human reviewer focuses on: architectural decisions, business logic correctness, test coverage quality, and knowledge transfer.
4. AI review is treated as a "first pass" filter, not the final word — human review always happens for code going to production.

What to avoid: Using AI review to reduce human review time to zero. AI code review is not yet reliable enough to be the only quality gate. The combination of AI + human review is significantly better than either alone.

SETTING UP AI CODE REVIEW FOR YOUR TEAM

Work with your tech lead to:
1. Enable GitHub Copilot for PRs (requires GitHub Advanced Security licence or Copilot Enterprise)
2. Or trial CodeRabbit (free tier available for open source, paid tier for private repos)
3. Establish the policy: AI review is a required step before human review assignment
4. Set a review SLA: PRs must receive first human comment within 4 business hours
5. Track cycle time metrics in your sprint retrospective data

This is a one-time investment in infrastructure that pays back every sprint.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- 4.3 AI for Test Automation and Quality Assurance
  UPDATE public.videos SET
    description = 'Quality assurance is the gatekeeper between development and delivery — and it is increasingly AI-augmented. This lesson covers the AI tools transforming testing: automated test generation, intelligent test selection, visual regression detection, and AI-driven bug triage. PMs who understand these tools set more accurate quality timelines and have more credible conversations about release readiness.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '4.3 AI for Test Automation and Quality Assurance',
      'description', 'Quality assurance is increasingly AI-augmented. This lesson covers AI tools transforming testing: automated test generation, intelligent test selection, visual regression detection, and AI-driven bug triage — helping PMs set accurate quality timelines and have credible release readiness conversations.',
      'transcript', $t$AI FOR TEST AUTOMATION AND QUALITY ASSURANCE

Testing is the part of the software delivery pipeline where AI is having some of the most dramatic and immediate impacts — and where PMs often have the least visibility. If your team is not using AI testing tools, you are likely shipping slower and with more quality issues than you need to be. If your team is using them well, your cycle time and defect rates should be improving measurably.

This lesson gives you the PM-level understanding of AI testing you need to have credible conversations with your QA team and make better-informed release decisions.

THE TESTING BOTTLENECK

In most Agile teams, testing is the constraint in the delivery pipeline. Features are developed faster than they are tested, creating a queue that grows as sprints progress. The result: developers are idle or context-switching while QA catches up, last-minute testing reveals bugs that push release dates, and the sprint review shows "done" features that have not actually been validated.

AI testing tools address the testing bottleneck from multiple angles simultaneously.

AI-GENERATED TEST CASES

Traditional test case writing is a manual, time-consuming process: the QA engineer reads the acceptance criteria, designs test cases, writes them up, and then executes them. AI can generate first-draft test cases from acceptance criteria in seconds.

The prompt:
"Here is a user story: [paste story with acceptance criteria]. Generate a comprehensive test case suite. Include: happy path tests, edge cases, boundary conditions, error/exception cases, and negative tests. Format as a test case table with columns: Test ID, Description, Preconditions, Steps, Expected Result."

What to verify: Coverage gaps (AI may miss domain-specific edge cases), assumptions about system state (AI may not know your specific data model), and test cases that are too granular or too coarse.

AI CODE-GENERATED UNIT TESTS

GitHub Copilot and Cursor are excellent at generating unit tests from existing production code. The workflow:
1. Developer writes (or AI writes) a function
2. Developer asks Copilot or Cursor: "Generate a comprehensive unit test suite for this function using [Jest/pytest/JUnit]"
3. AI generates tests covering the main paths, edge cases, and error handling
4. Developer reviews, adjusts, and runs the tests

This is one of the highest-ROI uses of AI coding tools. Unit test coverage is chronically low in most codebases because writing tests is perceived as less interesting than writing features. AI removes the tedium, increasing test coverage with minimal developer resistance.

INTELLIGENT TEST SELECTION

Running the full test suite on every code change is slow and expensive. AI-powered test selection tools (including features in GitHub Actions and specialised tools like Launchable) analyse which tests are most likely to fail based on the specific code changes in a commit. They run this targeted subset first, giving developers fast failure feedback without running thousands of tests unnecessarily.

For PMs, this matters because it directly affects CI/CD pipeline speed and the feedback loop developers get on their work. Faster test pipelines → faster iteration → higher velocity.

VISUAL REGRESSION TESTING

AI visual testing tools (Percy, Applitools) take screenshots of the application at each deployment and use AI to detect visual differences that might indicate regressions. This is particularly valuable for:

- UI-heavy applications where visual integrity is a key quality dimension
- Multi-browser and multi-device testing where manual visual verification is impractical
- Accessibility testing where AI can flag contrast, sizing, or structure issues

For PMs, visual regression tools reduce the risk of "the feature works but it looks broken" bugs reaching stakeholders.

AI-DRIVEN BUG TRIAGE

As bug volumes grow, triaging them becomes a bottleneck in itself — determining severity, assigning to the right developer, identifying duplicates, and estimating fix complexity. AI can assist with all of these:

"Here are the 23 new bugs logged this sprint: [paste list with descriptions]. For each, provide: suggested severity (Critical/High/Medium/Low), suggested team assignment (frontend/backend/infrastructure/QA), and whether it appears to be a duplicate of any other bug in this list."

This reduces triage from a 2-hour weekly session to a 20-minute review.

THE PM'S QUALITY CONVERSATION FRAMEWORK

Use these questions in sprint planning and retrospective to maintain quality visibility:

- What is our current automated test coverage percentage? Is it trending up?
- How long does our full test suite take to run? Is CI/CD a bottleneck?
- What was our defect escape rate this sprint (bugs found in production vs QA)?
- Are there story types or team members with consistently higher defect rates?

AI testing metrics make these conversations data-driven rather than anecdotal.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- 4.4 CI/CD Pipeline Optimization with AI
  UPDATE public.videos SET
    description = 'A slow or fragile CI/CD pipeline is a hidden tax on every sprint. AI is now embedded in pipeline optimisation: intelligent caching, predictive test selection, automated failure diagnosis, and deployment risk scoring. This lesson explains what modern AI-enhanced pipelines look like and how PMs can measure and advocate for pipeline health as a delivery performance indicator.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '4.4 CI/CD Pipeline Optimization with AI',
      'description', 'A slow or fragile CI/CD pipeline is a hidden tax on every sprint. AI is now embedded in pipeline optimisation: intelligent caching, predictive test selection, automated failure diagnosis, and deployment risk scoring. PMs can measure and advocate for pipeline health as a key delivery metric.',
      'transcript', $t$CI/CD PIPELINE OPTIMIZATION WITH AI

Continuous Integration and Continuous Delivery (CI/CD) is the infrastructure that makes Agile delivery possible at speed. Every time a developer commits code, the pipeline builds the application, runs tests, checks quality, and — if everything passes — deploys to a staging or production environment. This cycle should be fast, reliable, and invisible.

When it is slow or unreliable, it is one of the most significant hidden costs in software delivery. Developers wait. Context switches accumulate. Release confidence drops. Sprint velocity suffers. And PMs often do not notice because pipeline problems are invisible in the backlog — they appear as "developers were slower this sprint" rather than "our pipeline took 45 minutes per build and failed intermittently."

WHAT AI ADDS TO CI/CD

AI enhancements to CI/CD pipelines are available through platforms like GitHub Actions, GitLab CI, CircleCI, and dedicated tools. The key capabilities:

Intelligent test selection: Rather than running all tests on every commit, AI predicts which tests are likely to fail based on the specific files changed. This reduces pipeline execution time without sacrificing coverage quality. Tools: Launchable, GitHub Actions ML-powered test prioritisation.

Automated failure diagnosis: When a pipeline fails, AI analyses the logs to identify the likely root cause and suggest a fix. Instead of a developer spending 20 minutes reading 500 lines of CI output, they get a two-sentence diagnosis. Tools: CircleCI AI, various GitHub Actions integrations.

Cache optimisation: AI analyses build patterns to identify what can be cached without risking stale cache bugs. Effective caching is one of the highest-impact pipeline speed improvements available.

Deployment risk scoring: Before a deployment proceeds, AI analyses the scope of changes, historical patterns for the changed components, and current system health to produce a deployment risk score. High-risk deployments can be flagged for additional review or deployment to a staging environment first.

Anomaly detection in deployment: AI monitors application behaviour immediately after deployment and alerts on anomalies in error rates, latency, or user behaviour that might indicate a deployment-related issue.

HOW TO MEASURE PIPELINE HEALTH AS A PM

Work with your tech lead to track these metrics monthly:

- Mean pipeline execution time: If this is over 15 minutes for a typical commit, it is worth optimising
- Pipeline failure rate: Percentage of runs that fail due to the pipeline itself rather than test failures. Should be under 5%
- Flaky test rate: Tests that sometimes pass and sometimes fail on the same code. Flaky tests erode trust in the entire test suite. Should trend toward zero
- Deployment frequency: How often code is deployed to production. In high-performing teams, this is multiple times per day; in most Agile teams, it is once per sprint or once per week
- Lead time from commit to production: The total time from code committed to code in production. This is the definitive measure of CI/CD effectiveness

ADVOCATING FOR PIPELINE INVESTMENT

Pipeline improvements are often deprioritised because they are not user-facing features. PMs are in the right position to reframe this.

The business case: "Our pipeline currently takes 40 minutes per build, and we have ten developers committing an average of three times per day. That is two hours of developer waiting time per day, or ten hours per week. At an average fully-loaded developer cost of £75/hour, that is £750 per week in pure waiting cost — before we account for the context switching and motivation impact. Reducing pipeline time to 15 minutes saves £470 per week and pays back a two-sprint optimisation investment in under four weeks."

This framing converts an engineering concern into a business case that stakeholders and leadership can evaluate.

THE PM'S CI/CD CONVERSATION

Questions to ask your tech lead quarterly:
- What is our deployment frequency and has it changed since last quarter?
- Are there pipeline bottlenecks you want to address that we could prioritise?
- What is our rollback capability — how quickly can we revert a bad deployment?
- Are we using AI-assisted tools anywhere in the pipeline? Are there opportunities we are missing?

PMs who ask these questions become partners in delivery infrastructure rather than spectators of it.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- 4.5 AI Monitoring and Incident Response with Datadog
  UPDATE public.videos SET
    description = 'Production incidents are inevitable. How quickly they are detected, diagnosed, and resolved determines whether they are minor blips or major crises. This lesson covers AI-powered observability with Datadog: anomaly detection, intelligent alerting, root cause analysis, and incident response workflows — and what PMs need to know to manage stakeholders and teams effectively when things go wrong.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '4.5 AI Monitoring and Incident Response with Datadog',
      'description', 'Production incidents are inevitable. How quickly they are detected, diagnosed, and resolved determines whether they are minor blips or major crises. This lesson covers AI-powered observability with Datadog and what PMs need to know to manage stakeholders and teams effectively when incidents occur.',
      'transcript', $t$AI MONITORING AND INCIDENT RESPONSE WITH DATADOG

Every production system eventually has incidents. The question is not whether you will have an outage or a performance degradation — it is how quickly you detect it, how fast you diagnose the root cause, how effectively you communicate with stakeholders while it is happening, and how thoroughly you learn from it afterward.

AI-powered monitoring has fundamentally changed the detection and diagnosis phases of incident response. PMs who understand these tools can set realistic reliability expectations with stakeholders and manage incident communication with confidence.

DATADOG AI: KEY CAPABILITIES

Datadog is the dominant observability platform for modern software teams, and its AI capabilities (branded as "Watchdog" for anomaly detection and "Bits AI" for natural language querying) are mature and widely deployed.

Watchdog — AI Anomaly Detection: Datadog's Watchdog continuously monitors application metrics (error rates, latency, throughput, resource utilisation) and automatically detects anomalies — deviations from baseline that are statistically significant. Watchdog fires alerts before a problem becomes user-visible in many cases.

Key PM relevance: Watchdog alerts typically fire 2–10 minutes before users start reporting issues. This advance warning window allows the team to begin investigation while the incident is still minor.

Bits AI — Natural Language Querying: Datadog's AI assistant allows engineers (and PMs) to query monitoring data in natural language: "What changed in the last two hours that correlates with the latency increase on the payments service?" Bits AI searches across logs, metrics, traces, and events to identify the correlated changes.

Key PM relevance: Diagnosis that previously required a senior engineer to spend 30–60 minutes searching through logs can now take 5–10 minutes with AI-assisted querying.

Root Cause Analysis (RCA): Datadog AI can generate a preliminary root cause analysis by identifying which service, deployment, or configuration change correlates with the observed anomaly.

Key PM relevance: Preliminary RCA means the first 10 minutes of an incident call are spent validating and extending an analysis, not starting from zero.

THE PM'S ROLE IN INCIDENT RESPONSE

PMs and Scrum Masters are not typically in the technical diagnosis chain during an incident — that is for engineers. But PMs have three critical roles:

Role 1 — Stakeholder communication: As soon as a significant incident is confirmed, the PM takes ownership of stakeholder communication. The communication cadence:
- T+0: Internal Slack message acknowledging the incident and confirming investigation
- T+15: External status page update and/or customer-facing message acknowledging impact
- T+30: Update with preliminary scope and estimated resolution time
- T+resolution: All-clear communication with brief summary of what happened and when resolution was applied
- T+24 hours: Post-incident report distributed

Role 2 — Decision facilitation: Some incidents require business decisions that engineers should not make alone — whether to roll back a recently shipped feature, whether to take the system offline temporarily, whether to notify regulators. PMs facilitate these decisions quickly by knowing who to call and what information they need.

Role 3 — Post-incident process: After the incident is resolved, PMs drive the post-incident review process. This is where the most valuable learning happens. AI can assist: "Here is our incident timeline and the diagnostic notes from the incident: [paste]. Generate a post-incident report structure with sections for: incident summary, timeline, root cause, contributing factors, impact assessment, and action items to prevent recurrence."

SETTING UP DATADOG AI MONITORING

Work with your infrastructure or platform engineer to:
1. Enable Watchdog in your Datadog account (Settings → Watchdog)
2. Configure alert routing: Watchdog alerts → PagerDuty or OpsGenie → On-call engineer + PM notification
3. Set up a status page (Statuspage.io integrates with Datadog) for external customer communication
4. Establish your incident severity matrix: P0 (total outage), P1 (major degradation), P2 (minor degradation), P3 (informational)
5. Document your incident response runbook and share it with the team

RELIABILITY AS A PM METRIC

Track these reliability metrics monthly and review them with stakeholders quarterly:
- MTTR (Mean Time to Resolution): How long incidents take to resolve on average
- MTTD (Mean Time to Detection): How quickly incidents are detected — AI monitoring directly improves this
- Incident frequency by severity: Is P0 frequency trending up or down?
- Customer impact per incident: How many users were affected and for how long?

Teams with AI monitoring in place consistently show lower MTTD and MTTR than those relying on manual monitoring and customer-reported issues. This is a direct, measurable ROI of observability investment that PMs can communicate to leadership.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- 4.6 Vercel AI and Deployment Intelligence
  UPDATE public.videos SET
    description = 'Vercel has become the deployment platform of choice for modern frontend and full-stack applications — and its AI capabilities are transforming how teams understand deployment health. This lesson covers Vercel''s AI-powered deployment insights, preview deployments for stakeholder feedback, and how PMs can use Vercel''s analytics to connect deployment activity to business outcomes.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '4.6 Vercel AI and Deployment Intelligence',
      'description', 'Vercel has become the deployment platform of choice for modern frontend and full-stack applications. This lesson covers Vercel''s AI-powered deployment insights, preview deployments for stakeholder feedback, and how PMs can connect deployment activity to business outcomes.',
      'transcript', $t$VERCEL AI AND DEPLOYMENT INTELLIGENCE

If your team deploys frontend applications, Next.js, or full-stack applications to the web, Vercel is likely either your current deployment platform or a platform you should be evaluating. Its combination of developer experience, performance features, and AI-powered deployment intelligence makes it one of the most PM-friendly deployment platforms available.

This lesson focuses on the Vercel capabilities most relevant to PMs and Scrum Masters — not the infrastructure configuration, but the deployment visibility, stakeholder collaboration, and business intelligence features.

VERCEL'S AI-POWERED DEPLOYMENT SYSTEM

Vercel builds and deploys automatically on every git push. Its AI capabilities include:

Deployment Health Analysis: Vercel's AI monitors Web Vitals (Core Web Vitals: LCP, INP, CLS) across all deployments and automatically surfaces regressions — situations where a new deployment has degraded performance metrics. This runs automatically without configuration.

For PMs, this means you get an automatic quality check on every deployment: did this release make the user experience faster or slower?

Build and Runtime Error Detection: Vercel's AI analyses build logs and runtime errors to identify patterns — catching errors that are new in this deployment, correlating errors with specific user segments or geographies, and flagging error spikes that suggest a deployment problem.

Spend Intelligence: Vercel AI provides spend forecasting — predicting your monthly hosting cost based on current usage patterns and projected growth. This prevents billing surprises and helps PMs budget accurately for scaling.

PREVIEW DEPLOYMENTS: THE MOST UNDERUSED PM TOOL

Every pull request on Vercel automatically generates a unique preview URL — a fully functional deployment of the application with that PR's changes. This is one of the highest-value features in modern deployment platforms, and most teams use it only a fraction of its potential.

PM use cases for preview deployments:

Stakeholder review before merge: Share the preview URL with product stakeholders, UX designers, or clients to review a feature before it goes to main. Feedback can be gathered and incorporated without any deployment to production.

User acceptance testing: Send preview URLs to selected users or internal beta testers. Collect feedback while development is still active rather than after release.

A/B decision support: Show stakeholders two different preview deployments with different design approaches and collect preference data before committing to one.

Sprint review demos: Instead of demoing from a developer's local machine (which breaks), demo directly from the PR preview URL. This is more reliable, faster to set up, and gives stakeholders a URL they can reference after the review.

Prompt: "Our sprint review is in two days. Here are the PRs we want to demo: [list]. Each has a Vercel preview URL. Create a sprint review demo plan that walks through each feature via its preview URL, with talking points for each."

VERCEL ANALYTICS: CONNECTING DEPLOYMENT TO BUSINESS OUTCOMES

Vercel Analytics provides real-user performance data: how fast pages load for actual users, broken down by geography, device type, and connection quality. AI surfaces anomalies and trends automatically.

The PM value: You can now connect delivery decisions to user experience outcomes. "The performance optimisation we shipped in Sprint 14 reduced our LCP (Largest Contentful Paint) from 4.2s to 1.8s for mobile users, which correlates with our 12% improvement in conversion rate on mobile."

This narrative connects engineering work to business metrics — the kind of storytelling that builds stakeholder confidence and justifies continued investment in technical quality.

THE PM'S VERCEL DASHBOARD ROUTINE

Monthly review (15 minutes):
- Check Core Web Vitals trend: Is performance improving, degrading, or stable?
- Review error rate trend: Is the error rate associated with recent deployments higher than baseline?
- Check spend forecast: Is hosting cost on track with budget?
- Note any AI-flagged anomalies that need follow-up

The goal is not to become a deployment infrastructure expert. It is to have enough visibility to ask the right questions and to connect technical metrics to the business outcomes your stakeholders care about.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- 4.7 Lab: Measuring and Reporting AI Impact on Delivery Velocity
  UPDATE public.videos SET
    description = 'You have now implemented AI tools across development, testing, CI/CD, monitoring, and deployment. This lab shows you how to measure what is actually changing — and how to tell that story to leadership and stakeholders in a way that justifies continued AI investment and positions your team as a high-performing, forward-thinking engineering organisation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '4.7 Lab: Measuring and Reporting AI Impact on Delivery Velocity',
      'description', 'You have implemented AI tools across development, testing, CI/CD, monitoring, and deployment. This lab shows you how to measure what is actually changing and tell that story to leadership in a way that justifies continued AI investment and positions your team as high-performing.',
      'transcript', $t$LAB: MEASURING AND REPORTING AI IMPACT ON DELIVERY VELOCITY

The tools are in place. Now measure what is changing and communicate it. This lab is about turning delivery data into a compelling narrative about AI's impact on your team's performance.

SETTING UP YOUR AI IMPACT MEASUREMENT FRAMEWORK

Six weeks before reporting (start immediately after AI tool adoption):

Step 1 — Baseline capture: Before AI tools are fully adopted, capture these baseline metrics for the previous three sprints:
- Average sprint velocity (story points completed / sprint)
- Average cycle time (time from story started to story done)
- Defect escape rate (bugs found in QA + production / stories delivered)
- Pipeline execution time (average CI/CD run duration)
- MTTR (average incident resolution time)
- Time in administrative tasks (estimated by team survey: hours/week spent on docs, reports, notes)

Step 2 — AI adoption logging: For each AI tool adopted, note the date of adoption. Your before/after comparison will use this date as the dividing line.

Step 3 — Post-adoption metric tracking: After six to eight weeks of AI tool use, capture the same metrics again.

CALCULATING AI IMPACT

Create a simple impact table:

| Metric | Pre-AI Baseline | Post-AI | Change |
|---|---|---|---|
| Sprint velocity | [N] pts | [N+X] pts | +X% |
| Cycle time | [N] days | [N-Y] days | -Y% |
| Defect escape rate | [N]% | [N-Z]% | -Z% |
| Pipeline run time | [N] min | [N-W] min | -W% |
| Admin hours/week | [N] hrs | [N-V] hrs | -V hrs |

Ask AI to interpret this table: "Here are our delivery metrics before and after AI tool adoption [paste table]. Write a three-paragraph analysis that: 1) Summarises the overall impact, 2) Highlights the most significant improvements and what drove them, 3) Identifies any areas where impact has been limited and suggests potential causes."

THE ROI CALCULATION

For leadership presentation, translate impact into financial terms:

Developer productivity gain: Velocity increase of X% × average developer cost per sprint = value of additional output per sprint
Administrative time saved: V hours/week × fully-loaded PM/SM hourly rate × 52 weeks = annual administrative saving
Defect reduction: Z% defect reduction × average cost per escaped defect (typically 5-10× cost of finding in QA) = quality cost saving
MTTR improvement: Reduced incident time × average incident cost (revenue at risk + staff time) = reliability saving

Total annual AI tool ROI = sum of all above − annual tool licence cost

For most teams, this calculation shows 5–20× ROI on AI tool investment. Present this with the caveat that benefits continue to grow as teams become more proficient.

THE LEADERSHIP PRESENTATION

Structure your AI impact report as a one-page executive brief plus an appendix of supporting data:

Page 1 — Executive brief:
- Headline: "AI augmentation delivered [X]% velocity improvement and [Y] hours/week of administrative savings in [N] months"
- Key metrics summary (use visuals: trend charts are more compelling than tables)
- Projected annual value
- Investment to date
- Recommendation: continue, expand, adjust

Appendix — Supporting data:
- Full metric table before and after
- Tool-by-tool breakdown
- Team feedback survey results (qualitative impact)

AI-assisted writing prompt: "Using this impact data [paste data], write a one-page executive brief summarising our AI augmentation results. Tone: confident, data-driven. Audience: VP Engineering and CPO. Include a recommendation for the next six months of AI investment."

BUILDING THE ONGOING MEASUREMENT HABIT

Measuring AI impact is not a one-time exercise. Build it into your quarterly planning:

Each quarter:
- Update the baseline metrics with the most recent three sprints
- Review the AI tool landscape: are there new capabilities worth adopting?
- Identify the next highest-impact AI use case to implement
- Run a team survey on AI tool satisfaction and suggestions

After two to three quarters of data, you will have a compelling multi-quarter trend story to tell — not just "we adopted AI tools" but "here is the measurable, compounding improvement in our delivery performance since we committed to AI augmentation." This is the career-defining narrative of the AI-era PM.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- ══════════════════════════════════════════════════════════════
  -- MODULE 5 — AI for Risk Management & Decision Making
  -- ══════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 4;

  -- 5.1 Predictive Analytics for Sprint and Project Forecasting
  UPDATE public.videos SET
    description = 'Forecasting is one of the most consequential and least reliable PM activities. AI-powered predictive analytics transforms sprint and project forecasting from educated guessing into data-driven probability modelling — using historical velocity patterns, scope trends, and risk factors to produce forecasts that are honest about uncertainty rather than falsely precise.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '5.1 Predictive Analytics for Sprint and Project Forecasting',
      'description', 'Forecasting is one of the most consequential and least reliable PM activities. AI-powered predictive analytics transforms it from educated guessing into data-driven probability modelling — producing forecasts that are honest about uncertainty rather than falsely precise.',
      'transcript', $t$PREDICTIVE ANALYTICS FOR SPRINT AND PROJECT FORECASTING

"When will this be done?" is the most frequently asked question in project management and the most frequently answered incorrectly. Traditional forecasting methods — gut feeling, optimistic estimation, commitment under pressure — produce point estimates that are almost always wrong and damage PM credibility when reality diverges.

AI-powered predictive analytics offers a better approach: probabilistic forecasting that models uncertainty rather than hiding it, producing a range of outcomes with associated probabilities that are honest, defensible, and more useful to decision-makers.

THE PROBLEM WITH POINT ESTIMATES

When a PM says "we will deliver this feature on 14 March," they create several problems:

- The estimate is almost certainly wrong, because complexity and uncertainty produce distributions, not points
- Stakeholders anchor on the date and treat it as a commitment
- When the date changes, trust is damaged even if the PM was appropriately uncertain when they gave the estimate
- The PM is incentivised to be optimistic to avoid difficult conversations, creating systematic underestimation bias

Probabilistic forecasting replaces "done by 14 March" with "85% probability of completion by 21 March, 50% probability by 7 March." This is not weakness — it is honesty about uncertainty that actually helps stakeholders make better decisions.

MONTE CARLO SIMULATION FOR PROJECT FORECASTING

Monte Carlo simulation is the gold standard for probabilistic project forecasting. It works by:
1. Running thousands of simulated sprints using historical velocity distributions
2. Accumulating scope completion across sprints
3. Producing a probability distribution of completion dates

Tools that implement this include ActionableAgile Analytics, Forecast Pro within Jira, and LinearB. Most display the results as a chart showing: "there is a 50% chance of delivery by X, 85% chance by Y, 95% chance by Z."

Using AI to interpret Monte Carlo results:
"Here is our Monte Carlo simulation output [paste probability table]. Write a stakeholder communication that explains what these numbers mean in plain language, what assumptions they are based on, what would make the outcome better (early dates), and what would make it worse (late dates)."

SPRINT VELOCITY TREND ANALYSIS

AI can identify trends in sprint velocity that predict future performance more accurately than simple averaging.

Prompt: "Here are our last 12 sprints of velocity data: [paste table with sprint number, committed points, completed points, team size, and any notable events]. Analyse the trend. Is our velocity improving, declining, or stable? Are there patterns that suggest the velocity will change in coming sprints? What is your probability-weighted forecast for the next three sprint's velocities?"

What to look for in the AI analysis:
- Seasonal patterns (velocity drops in holiday-heavy months, around performance review cycles)
- Team size changes correlating with velocity shifts
- Story size calibration drift (the same "5 point" story taking more or less time over time)
- Technical debt accumulation (velocity declining as technical debt grows)

SCOPE CREEP FORECASTING

One of the most common causes of late delivery is scope growth: the amount of work keeps increasing faster than it is completed. AI can detect this trend early.

Prompt: "Here is our project backlog data across the last six months: [paste table with date, total backlog points, completed points]. Calculate our scope growth rate and delivery rate. At these rates, are we converging on completion or diverging? When does the current trend predict completion, if scope continues to grow at the current rate?"

If scope is growing faster than delivery, that is the critical insight for stakeholder communication — not "we're behind schedule" but "the scope is growing faster than we can deliver it, and we need to make a prioritisation decision."

COMMUNICATING PROBABILISTIC FORECASTS TO STAKEHOLDERS

Some stakeholders resist probabilistic forecasts: "Just tell me when it will be done." The response:

"A single date is statistically almost certainly wrong — and you won't know until it's too late to act. A probability range tells you: if you want to make a safe commitment to your customer, use the 85% date. If you want to plan your own work around the most likely date, use the 50% date. If you're willing to take a bet on an optimistic outcome, here's the 35% date. You now have the information to make the decision that is right for your situation."

Most stakeholders, when they understand the framing, prefer the probability range because it gives them agency rather than false certainty.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 0;

  -- 5.2 AI Risk Scoring and Early Warning Systems
  UPDATE public.videos SET
    description = 'Risk management in most projects is a compliance activity — a register that is filled in during planning and rarely updated. AI transforms risk management into a continuous, data-driven practice: automatically scoring risks, detecting early warning signals in project data, and surfacing the issues most likely to become problems before they become crises.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '5.2 AI Risk Scoring and Early Warning Systems',
      'description', 'Risk management in most projects is a compliance activity — a register rarely updated after planning. AI transforms it into a continuous practice: automatically scoring risks, detecting early warning signals in project data, and surfacing issues before they become crises.',
      'transcript', $t$AI RISK SCORING AND EARLY WARNING SYSTEMS

The traditional risk register is a well-intentioned artefact that rarely fulfils its purpose. It is created at project initiation, reviewed quarterly if at all, and grows stale as the project evolves. By the time a risk materialises into an issue, it has often been on the register for weeks — unactioned because no one was watching.

AI makes risk management continuous rather than periodic. Instead of a document that is reviewed, AI analyses project signals in real time and surfaces the risks that are most likely to materialise in the next sprint.

THE RISK SIGNAL DETECTION APPROACH

AI risk scoring works by analysing multiple data streams for patterns that historically precede problems:

Sprint data signals:
- Velocity declining for two or more consecutive sprints
- Stories carrying over from sprint to sprint (never-completing stories)
- Acceptance criteria being modified after sprint start
- Multiple stories in the same sprint touching the same component

Team health signals:
- Meeting attendance declining
- Retrospective action items not being completed
- Blocked items sitting for more than 24 hours without a plan
- Unplanned work exceeding 20% of sprint capacity consistently

Stakeholder signals:
- Stakeholder response time to decisions increasing
- Scope questions being deferred rather than answered
- Stakeholder availability for sprint reviews declining

Ask AI to score risks weekly using this prompt: "Here is our project data from the past sprint [paste velocity, blocked items, team attendance, retrospective completion rate, stakeholder responsiveness]. Analyse this data for early warning signals of project risk. Score overall project health as Green/Amber/Red with justification. Identify the top two risks I should focus on this week and suggest one action for each."

BUILDING A CONTINUOUS RISK REGISTER

Transform the static risk register into a living document by reviewing it with AI at each sprint retrospective.

The weekly risk update prompt: "Here is our current risk register: [paste risk table with columns: Risk ID, Description, Likelihood, Impact, Mitigation, Last Updated, Owner]. Based on this sprint's events [paste summary], which risks should change status? Are there new risks to add based on what happened? Have any risks been resolved? Update the register and explain your changes."

Over a three to six month project, this produces a risk register that genuinely reflects project reality rather than initial assumptions.

THE RISK HEAT MAP

Visualising risks by likelihood and impact helps prioritise attention. Ask AI to generate the heat map data:

"For each risk in our register [paste], plot it on a 3×3 heat map (Low/Medium/High likelihood vs Low/Medium/High impact). Which quadrant contains the most risks? Which single risk in the high likelihood / high impact quadrant requires the most urgent attention?"

Share the heat map with stakeholders in status reports as a visual indicator of risk posture.

AI-GENERATED RISK MITIGATION PLANS

For each high-priority risk, AI can generate a structured mitigation plan:

"Here is our highest-priority risk: [describe risk]. Generate a mitigation plan with: 1) Preventative actions (things we can do now to reduce likelihood), 2) Contingency plans (if the risk materialises, what is our response), 3) Early warning indicators (what specific signals would tell us this risk is beginning to materialise), 4) Owner and timeline for each action."

This turns a risk register entry into an actionable playbook rather than a passive observation.

ESCALATION PROTOCOLS

Define clear escalation thresholds so risk management does not depend on the PM remembering to check:

- Any Amber risk that has not had its mitigation plan updated in two sprints → automatic escalation to tech lead review
- Any Red risk identified → immediate notification to sponsor and stakeholder group
- Project overall status changes to Red → immediate escalation meeting within 24 hours

Automate these notifications where possible using your project tool's alert configurations.

THE RISK-AWARE PLANNING MEETING

End every sprint planning session with a five-minute risk review: "Given our sprint commitment, what risks does this create? Which existing risks are most likely to impact this sprint's delivery?"

This takes five minutes and can prevent a sprint failure that would cost five days. Highest-leverage five minutes in the sprint calendar.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- 5.3 Resource Optimization and Capacity Planning with AI
  UPDATE public.videos SET
    description = 'Getting the right people on the right work at the right time is simultaneously one of the most important and most difficult PM responsibilities. This lesson shows how AI transforms capacity planning from spreadsheet guesswork into dynamic optimisation: modelling team availability, skill coverage, bottleneck detection, and scenario planning across multiple sprints and projects.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '5.3 Resource Optimization and Capacity Planning with AI',
      'description', 'Getting the right people on the right work at the right time is one of the most difficult PM responsibilities. This lesson shows how AI transforms capacity planning from spreadsheet guesswork into dynamic optimisation: modelling availability, skill coverage, bottleneck detection, and scenario planning.',
      'transcript', $t$RESOURCE OPTIMIZATION AND CAPACITY PLANNING WITH AI

Capacity planning is the discipline of matching work to available people. In theory it is straightforward. In practice it is complicated by: leave and holidays, part-time commitments and multiple team assignments, skill specialisation (not everyone can do every story), learning curves for new team members, meetings consuming planned development time, and unplanned work arriving from operations or support.

AI does not solve these complexities. But it processes them simultaneously and consistently, producing capacity models that account for factors that manual spreadsheet approaches routinely miss.

THE CAPACITY MODEL: WHAT TO INPUT

For AI-assisted capacity planning, provide:
- Team roster: each person's name, role, and any specialisations or constraints
- Sprint dates: start and end dates for the next one to three sprints
- Known absences: planned leave, conferences, training days for each team member
- Meeting overhead: average hours per person per sprint committed to recurring meetings
- Sprint commitment: story points or hours committed per person per sprint historically

Template input for AI: "Here is my team capacity for Sprint [N] [dates]: [list each person with: name, role, planned leave days, estimated meeting hours]. Our average velocity is [N] points over the last three sprints. Sprint capacity adjustment factor (to account for unplanned work): [typically 20%]. Calculate effective sprint capacity in story points and recommend a sprint commitment range."

SKILL COVERAGE ANALYSIS

Capacity is not just about hours — it is about the right skills being available for the planned work. AI can model this if you provide skill mapping:

"Here is our team skill matrix [paste table: team member vs skills with proficiency level]. Here are the stories planned for our next sprint [paste list with skill requirements per story]. Identify: 1) Any stories where we have insufficient skill coverage, 2) Any single points of failure where one person is the only one who can do a critical story, 3) Stories where we have over-capacity (multiple people capable) — candidates for knowledge transfer."

This surfaces both over-allocation risk (the specialist everyone depends on) and cross-training opportunities.

MULTI-PROJECT CAPACITY MODELLING

For PMs managing multiple projects with shared team members, capacity planning becomes dramatically more complex. AI can model this:

"I have three projects sharing a team of eight engineers. Here is the team roster and each person's project assignment percentages [paste]. Here are the upcoming milestones across all three projects [paste]. Identify: 1) Where individual contributors are over-committed (total allocation exceeds 100%), 2) Which projects are most at risk from shared resource constraints, 3) Any milestone conflicts where two projects need the same person at full capacity simultaneously."

This conversation is difficult to have in a spreadsheet. With AI, it becomes a 10-minute analysis.

SCENARIO PLANNING

Before committing to a delivery date or sprint plan, model scenarios:

"Scenario A — as planned: Sprint capacity [N] points, team fully available. Estimated completion of epic: [date]. Scenario B — key developer sick for one week: capacity drops to [N-X] points. Revised completion estimate: [later date]. Scenario C — unplanned production incident consuming two developer days: capacity [N-Y] points. Revised estimate: [later date]. What mitigation options do we have for each scenario?"

Sharing this scenario analysis with sponsors and stakeholders produces the conversation: "Our baseline is [date]. Here are the two most likely risk scenarios and what we would do about each." This is not pessimism — it is transparency that builds trust.

THE CAPACITY DASHBOARD

Work with your tooling (or set up a simple Notion or Airtable database) to maintain a live capacity view across the next two to three sprints. Update it every Monday with:
- Confirmed leave for the coming sprint
- Percentage committed to project work vs meetings vs support
- Effective capacity in story points

Share it in your sprint planning prep. When the team sees actual available capacity before planning rather than discovering constraints during planning, commitments become more realistic and fewer sprints are derailed by avoidable over-commitment.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- 5.4 AI-Enhanced Burndown and Burnup Analysis
  UPDATE public.videos SET
    description = 'Burndown and burnup charts are the PM''s real-time health monitor for a sprint or release. But reading them accurately — distinguishing noise from signal, identifying trend inflections, and knowing when to intervene — requires analytical skill that AI now provides automatically. This lesson teaches you to use AI to interpret burndown and burnup data and translate it into precise, timely management actions.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '5.4 AI-Enhanced Burndown and Burnup Analysis',
      'description', 'Burndown and burnup charts are the PM''s real-time health monitor. Reading them accurately — distinguishing noise from signal, identifying trend inflections, and knowing when to intervene — requires analytical skill that AI now provides automatically.',
      'transcript', $t$AI-ENHANCED BURNDOWN AND BURNUP ANALYSIS

The burndown chart shows remaining work over time. The burnup chart shows completed work over time, with total scope visible. Both are essential for sprint and release health monitoring — but both are routinely misread, misused, or ignored until it is too late to act.

AI-enhanced analysis turns these charts from reports about the past into early warning systems for the future.

BURNDOWN VS BURNUP: WHEN TO USE EACH

Burndown: Best for sprint monitoring where scope is fixed at sprint start. Shows clearly whether the team is on track to complete the committed scope. Warning sign: the line is above the ideal line (not enough completed relative to days elapsed).

Burnup: Best for release planning and multi-sprint tracking where scope changes over time. The burnup chart shows both scope growth (the ceiling) and completion progress (the floor). The gap between them is remaining work. Advantage over burndown: scope changes are visible rather than hidden.

THE FLAT LINE PROBLEM

The most common burndown pattern that PMs misread is the "flat line" — a burndown that does not move for two to three days. Possible interpretations:
1. Stories are in progress but none have been completed yet (normal in sprint days 1-3)
2. The team is blocked and no stories can be completed (abnormal at any time)
3. Stories are completed but the board has not been updated (process problem)
4. Stories are much larger than estimated and will complete in a burst at the end of the sprint (scope risk)

AI can help you distinguish between these: "Here is our sprint burndown data for days 1-4 of a ten-day sprint: [paste daily remaining points and completed stories]. The burndown is flat. What are the most likely explanations, and what questions should I ask the team at today's standup to determine which applies?"

USING AI TO ANALYSE BURNDOWN PATTERNS

Collect daily snapshot data for the sprint (remaining points at end of each day) and ask:

"Here is our sprint burndown data: [paste table with date, remaining points, completed stories, and any notable events]. Analyse the pattern. Is the team on track to complete the sprint? What does the trend suggest about the likely outcome? What is the most significant risk I should address today?"

What good AI burndown analysis surfaces:
- "You need to complete an average of X points per day for the next N days to finish on time. Your last three days averaged Y points per day. At current pace, you will finish with Z points remaining."
- "Three stories have been in 'In Progress' for more than three days without moving to 'Done' — these are likely larger than estimated or blocked. Investigate these first."
- "Your completion rate accelerated on days 6 and 7, which suggests the team is in a delivery sprint at the end. This is a common pattern but creates quality risk if testing is compressed."

THE SCOPE CREEP DETECTION PROMPT

"Here is our release burnup data over the last eight sprints: [paste table with sprint, completed points, total scope points]. Calculate the scope growth rate (how many new points are added per sprint on average). Is scope growing faster than delivery rate? When would we expect to converge to completion at current rates? What scope reduction would be needed to hit our target release date?"

This is the analysis that makes scope conversations with stakeholders objective rather than political. When the data shows scope is growing at 15 points per sprint and delivery rate is 25 points per sprint, the conversation is about data, not opinions.

THE WEEKLY BURNDOWN REVIEW RITUAL

Build a five-minute AI-assisted burndown review into your weekly PM routine:

Monday: "Here is our sprint burndown data from last week [paste]. Sprint ends on [date]. Are we on track? What is the most likely sprint outcome if current trends continue? What is my most important action to improve the probability of a successful sprint completion?"

This question, answered weekly with data, transforms sprint management from reactive to proactive. The intervention happens when it can still matter — not at sprint review when it is too late.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- 5.5 Data-Driven Decision Making with AI Analysis
  UPDATE public.videos SET
    description = 'Good decisions require good data, good analysis, and clear thinking under uncertainty. This lesson shows you how to structure complex PM decisions using AI as an analytical partner: framing the decision correctly, identifying the key data needed, running AI-powered scenario analysis, and communicating recommendations to leadership in a way that is clear, honest, and actionable.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '5.5 Data-Driven Decision Making with AI Analysis',
      'description', 'Good decisions require good data, good analysis, and clear thinking under uncertainty. This lesson shows you how to structure complex PM decisions with AI as an analytical partner: framing decisions correctly, identifying key data, running scenario analysis, and communicating recommendations clearly.',
      'transcript', $t$DATA-DRIVEN DECISION MAKING WITH AI ANALYSIS

Project managers make dozens of decisions per sprint. Most are small and tactical — which story to start next, whether to bring a risk to the sponsor now or wait, how to respond to a stakeholder question. A few are significant — whether to defer a release, whether to cut scope to hit a deadline, whether to escalate a team performance issue.

The significant decisions deserve more than intuition. They deserve a structured analytical process. AI can be the analytical partner that makes this process fast enough to be practical rather than theoretical.

THE DECISION FRAMING FRAMEWORK

Before reaching for data or analysis, frame the decision correctly. Poor decision framing is the most common reason good analysis produces bad decisions.

The three questions of decision framing:
1. What is the actual decision? (Not the presenting question, but the decision that needs to be made.) "Should we release on Friday?" is not the decision. "Should we release the current build to users knowing there are three known medium-severity bugs?" is the decision.
2. Who is accountable for this decision? (Often not the PM — know your decision rights.) Is this the PM's call, the Product Owner's, the sponsor's, or a consensus decision?
3. What information would change this decision? (Identify the key uncertainty.) If you are 95% confident of the answer without more information, you probably do not need AI analysis — you need the courage to act on what you already know.

THE AI DECISION ANALYSIS PROMPT

Once a decision is properly framed, AI can assist with structured analysis:

"I need to make this decision: [state the decision clearly]. The options are: [list two to four options]. Here is the relevant data: [paste project metrics, risk register, stakeholder context, constraints]. Analyse each option across these dimensions: 1) Impact on delivery date, 2) Impact on quality, 3) Impact on team, 4) Stakeholder reaction, 5) Reversibility. Recommend an option and explain your reasoning. Also tell me what information, if available, would change your recommendation."

What to do with the AI recommendation: Treat it as a well-informed first opinion, not a final verdict. Check it against your own judgment, your domain knowledge, and the stakeholder context the AI does not have. In nine cases out of ten, AI will either confirm your instinct (building confidence) or surface a dimension you had not considered (improving the decision). Rarely will it contradict your judgment in ways that should be dismissed — but when it does, examine why before proceeding.

TRADE-OFF ANALYSIS: SCOPE VS SCHEDULE VS QUALITY

The classic PM trade-off triangle — scope, schedule, quality — is where AI analysis adds the most value. When facing a "we can't deliver everything" moment:

"Here is our sprint commitment and current status [paste]. We are at risk of not completing X stories by the sprint end. We have three options: 1) Reduce scope — defer stories Y and Z to next sprint, 2) Extend the sprint by two days, 3) Accept reduced quality — ship stories Y and Z with known defects. Analyse each option. What are the stakeholder impacts? What are the quality risks? Which option preserves the most business value? Which creates the most technical debt?"

This analysis, available in under five minutes, enables a decision meeting that is focused on validating and choosing rather than analysing from scratch.

USING AI FOR POST-DECISION REVIEW

After a significant decision is implemented, AI can help you review whether it was correct:

"We made this decision three sprints ago: [describe decision]. Here is what we expected would happen [paste assumptions]. Here is what actually happened [paste outcomes]. Analyse whether the decision was good given what we knew at the time, what we would do differently with hindsight, and what this tells us about our decision-making process."

This is not retrospective blame — it is calibration. Teams that review their decisions improve their decision-making over time. AI makes this review fast enough to do regularly.

THE DECISION LOG AS A LEARNING SYSTEM

Every significant decision should be logged with: the decision made, the options considered, the key data used, the expected outcomes, the owner, and the date. After six to twelve months, review the decision log with AI:

"Here are the significant decisions from our project over the last year [paste log]. Which categories of decisions have we been most accurate about? Where have we been systematically wrong? What patterns do you see in our decision-making?"

This meta-analysis of your own decision patterns is one of the highest-leverage PM development activities available. AI makes it practical to do.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- 5.6 Lab: Build Your AI-Powered Project Health Dashboard
  UPDATE public.videos SET
    description = 'This lab brings together all of Module 5''s risk, forecasting, and decision-making capabilities into a single integrated project health dashboard. You will build a live dashboard that consolidates sprint velocity, risk indicators, capacity, burndown trend, and stakeholder health into a single weekly view — and use AI to interpret what it means and what to do about it.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '5.6 Lab: Build Your AI-Powered Project Health Dashboard',
      'description', 'This lab brings together all of Module 5''s risk, forecasting, and decision-making capabilities into a single integrated project health dashboard — a live weekly view that AI interprets and translates into precise actions.',
      'transcript', $t$LAB: BUILD YOUR AI-POWERED PROJECT HEALTH DASHBOARD

A project health dashboard is the single most important monitoring artefact you can maintain. It answers the question "how is my project actually doing?" in one view — for you, for your team, for your sponsors.

This lab builds a dashboard that aggregates five dimensions of project health and uses AI to interpret what the combined picture means each week.

THE FIVE HEALTH DIMENSIONS

Dimension 1 — Delivery Health
Data: Velocity trend (last 3 sprints), sprint completion rate (stories completed / committed), carry-over rate (stories carried from previous sprint)
AI interpretation: "Is our delivery pace improving, stable, or declining?"

Dimension 2 — Risk Health
Data: Number of active risks by severity (Red/Amber/Green), risks added this sprint, risks resolved this sprint, overdue risk actions
AI interpretation: "Is our risk profile improving or worsening?"

Dimension 3 — Scope Health
Data: Total backlog points, points completed to date, scope added this sprint (new stories added), projected completion date at current pace
AI interpretation: "Are we converging on delivery or diverging?"

Dimension 4 — Capacity Health
Data: Team availability percentage (planned vs actual hours), blocked stories count and duration, unplanned work percentage
AI interpretation: "Are we operating at sustainable capacity or are we stretched?"

Dimension 5 — Stakeholder Health
Data: Decision response time (how long since last pending decision was raised), sprint review attendance rate, open questions older than one sprint
AI interpretation: "Is stakeholder engagement healthy or is there disengagement risk?"

BUILDING THE DASHBOARD: STEP BY STEP

Step 1 — Choose your platform: Notion database, Airtable, Google Sheets, or a dedicated PM tool. Notion is recommended because of Notion AI integration for weekly interpretation.

Step 2 — Create the data entry template: One page per sprint. Five sections, one per health dimension. Each section has three to five specific metric fields.

Step 3 — Connect data sources where possible:
- Velocity data: Pull from Jira/Linear sprint history
- Risk data: Manual update from risk register
- Scope data: Pull from Jira backlog total
- Capacity data: Manual update from team calendar
- Stakeholder data: Manual update from your decision log

Step 4 — Set up the weekly AI interpretation prompt (save this as a Notion template):

"Here is my project health data for Sprint [N]:

Delivery: Velocity [N] pts (prev: [N-1], [N-2]). Sprint completion rate: [X]%. Carry-over stories: [N].

Risk: Active risks — Red: [N], Amber: [N], Green: [N]. New this sprint: [N]. Resolved: [N].

Scope: Backlog [N] pts remaining. Completed to date: [N] pts. Scope added this sprint: [N] pts. Projected completion at current pace: [date].

Capacity: Team availability [X]%. Blocked items: [N] (avg [N] days blocked). Unplanned work: [X]% of sprint.

Stakeholder: Pending decisions waiting [N] days. Sprint review attendance: [X]%. Open questions >1 sprint old: [N].

Overall RAG status and one-sentence justification. Top three things requiring my attention this week. One action I should take today."

Step 5 — Run this every Monday morning. Block 15 minutes in your calendar: 10 minutes to enter last week's data, 5 minutes to review AI interpretation and plan the week's priorities.

THE MONTHLY HEALTH TREND REVIEW

At the end of each month, ask AI to review the past four sprint health reports:

"Here are the last four sprint health summaries [paste]. Identify: 1) Which dimensions have been consistently strong, 2) Which dimensions have been consistently weak, 3) What trends are visible across the month, 4) What the most important priority is for improving project health next month."

This monthly trend analysis is your continuous improvement input for the PM role itself — not just the project.

SHARING THE DASHBOARD WITH STAKEHOLDERS

Create a simplified stakeholder view of the dashboard — one RAG traffic light per dimension with a one-sentence explanation:
- Delivery: [Green] Velocity stable at 45 pts/sprint. On track.
- Risk: [Amber] Third-party API dependency risk escalated this sprint. Mitigation in progress.
- Scope: [Green] Scope stable. Converging on target date.
- Capacity: [Amber] One developer at 60% due to support rotation. Impact absorbed.
- Stakeholder: [Green] All decisions within 48 hours. High engagement.

Five lines. Complete picture. This is the PM reporting artefact that builds stakeholder confidence most efficiently.

Congratulations on completing Module 5. You now have the risk management, forecasting, and decision infrastructure of a high-performing AI-era PM.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- ══════════════════════════════════════════════════════════════
  -- MODULE 6 — Building Your AI-Powered PM Toolkit
  -- ══════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 5;

  -- 6.1 Creating Custom GPTs for Your PM Workflow
  UPDATE public.videos SET
    description = 'Custom GPTs let you build personalised AI assistants pre-loaded with your project context, terminology, templates, and constraints — so every prompt starts from a position of deep familiarity with your specific work rather than general AI knowledge. This lesson walks you through designing, building, and deploying Custom GPTs for the PM use cases that will save you the most time.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '6.1 Creating Custom GPTs for Your PM Workflow',
      'description', 'Custom GPTs let you build personalised AI assistants pre-loaded with your project context, terminology, templates, and constraints. This lesson walks you through designing, building, and deploying Custom GPTs for the PM use cases that save the most time.',
      'transcript', $t$CREATING CUSTOM GPTs FOR YOUR PM WORKFLOW

Every time you open ChatGPT and start typing "I am a project manager working on a SaaS product and my team uses Jira..." you are wasting time. You are re-establishing context that a custom GPT could carry permanently.

Custom GPTs — available on ChatGPT Plus and Team plans — let you build personalised AI assistants pre-loaded with everything about your context, your constraints, your templates, and your preferences. The first interaction is as informed as the twentieth. Every output is calibrated to your specific work rather than to a generic user.

WHAT A CUSTOM GPT IS

A Custom GPT is a version of ChatGPT configured with:
- System instructions: What this GPT is for, how it should behave, what expertise it should embody
- Knowledge files: Documents the GPT can reference when answering questions (your PM templates, risk frameworks, style guides, project glossary)
- Capabilities: Web browsing, code execution, image generation (select what is relevant)

Once built, a Custom GPT appears in your ChatGPT sidebar and can be shared with your team.

THE FOUR CUSTOM GPTs EVERY PM SHOULD BUILD

Custom GPT 1 — The Status Report Writer:
System instruction: "You are a senior project manager's writing assistant, specialising in executive status reports. Always use RAG (Red/Amber/Green) status. Write concisely — maximum 200 words per report unless told otherwise. Always include: RAG status with one-sentence justification, key achievements (max 3 bullets), risks and mitigations (max 3 bullets), next steps (max 3 bullets), and any decisions required from the reader. Use [client/organisation name]'s terminology. Tone: direct, professional, confident."
Knowledge files: Upload your status report templates, your project glossary, previous status reports (redacted of sensitive data) to establish style.

Custom GPT 2 — The User Story Generator:
System instruction: "You are an expert Agile product manager specialising in writing INVEST-compliant user stories. Always write in 'As a [user], I want [capability], so that [benefit]' format. Always include five acceptance criteria in Given/When/Then format. Always check stories against INVEST criteria and flag any concerns. Our product is [brief product description]. Our users are [user types]. Our tech stack is [tech context]."
Knowledge files: Your product's user personas, your definition of done, example high-quality stories from your backlog.

Custom GPT 3 — The Risk Advisor:
System instruction: "You are a project risk management expert. When given project information, identify risks proactively. Score all risks as High/Medium/Low for both likelihood and impact. Always suggest a mitigation for each risk. Always identify the risk owner. Format risk output as a table with columns: Risk, Likelihood, Impact, Priority Score, Mitigation, Owner. Our industry is [industry] and our regulatory context includes [any relevant regulations]."
Knowledge files: Your current risk register, your risk management policy, industry-specific risk frameworks.

Custom GPT 4 — The Retrospective Facilitator:
System instruction: "You are an expert Agile retrospective facilitator. When given sprint data and team input, synthesise themes objectively without judgement. Produce SMART action items: specific, measurable, achievable, relevant, time-bound. Assign each action to a named owner. For recurring themes (appearing in more than one retrospective), flag them explicitly. Never attribute negative feedback to specific individuals."
Knowledge files: Previous retrospective summaries, your team's working agreements, your definition of 'good retrospective action'.

BUILDING YOUR FIRST CUSTOM GPT: STEP BY STEP

1. In ChatGPT, click "Explore GPTs" → "Create"
2. Use the GPT Builder conversation to describe what you want
3. Switch to the "Configure" tab to fine-tune the system instructions manually
4. Upload knowledge files (PDF, Word, or text files work best)
5. Test with real use cases before sharing with your team
6. Click "Create" and set sharing to "Anyone with the link" for team access

MAINTAINING YOUR CUSTOM GPTs

Custom GPTs require maintenance as your context evolves:
- Update knowledge files each quarter with new templates and examples
- Refine system instructions based on outputs that missed the mark
- Add new project-specific terminology to the glossary as it emerges
- Archive GPTs for completed projects and create new ones for new projects

Share your Custom GPTs with your team through the ChatGPT sharing link. Building a team library of Custom GPTs is one of the highest-leverage AI investments a PM team can make — each GPT saves everyone on the team re-establishing context on every interaction.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 0;

  -- 6.2 AI-Powered Meeting Intelligence and Action Tracking
  UPDATE public.videos SET
    description = 'Meetings are the circulatory system of project work — and meeting intelligence tools have matured into sophisticated platforms that do far more than transcription. This lesson shows how advanced meeting intelligence features (sentiment tracking, speaker analytics, commitment extraction, and integration with project management tools) transform how teams capture, act on, and learn from every conversation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '6.2 AI-Powered Meeting Intelligence and Action Tracking',
      'description', 'Meeting intelligence tools have matured far beyond transcription. This lesson covers advanced features — sentiment tracking, speaker analytics, commitment extraction, and deep PM tool integration — that transform how teams capture, act on, and learn from every conversation.',
      'transcript', $t$AI-POWERED MEETING INTELLIGENCE AND ACTION TRACKING

Meeting intelligence has evolved rapidly. Where early tools simply transcribed and summarised, the current generation captures the texture of conversations: who speaks most, who raises risks, who makes commitments and who follows through, and whether the tone of team discussions is shifting in ways that signal morale or relationship problems.

This lesson covers the advanced meeting intelligence capabilities that create institutional knowledge and accountability at the team level.

BEYOND BASIC TRANSCRIPTION: ADVANCED FEATURES

Sentiment analysis: Tools including Fireflies and the enterprise versions of Otter.ai can analyse the emotional tone of meeting participants. For PMs, the most valuable signal is trend analysis: is the team's collective sentiment during sprint planning getting more positive or more negative over time? Declining sentiment in sprint ceremonies often precedes retention or performance issues.

Speaker analytics: Meeting intelligence tools track speaking time distribution. In healthy Agile teams, facilitated meetings show broad participation — not one or two people dominating. Analytics showing consistent dominance by one speaker (including the PM or Scrum Master) signal a facilitation problem.

Commitment extraction: Advanced tools identify sentences that represent commitments — "I will do X by Y" — and distinguish them from general discussion. These extracted commitments can be automatically posted to Slack or created as tasks in Jira/Linear, closing the loop between what is said in meetings and what appears in the action tracking system.

Topic tracking across meetings: Enterprise meeting intelligence tools can track how frequently specific topics come up across meetings over time. "How often has the API integration risk been raised in the last month?" is a question a good tool can answer from your meeting archive.

ACTION ITEM LIFECYCLE MANAGEMENT

The biggest failure mode in meeting intelligence is not capture — it is follow-through. Most teams have good discipline on capturing actions but weak discipline on tracking them to completion.

The closed-loop action system:

Step 1 — Capture: Meeting intelligence tool extracts action items with named owners automatically.

Step 2 — Create: Actions automatically become tasks in Jira/Linear (via Zapier or direct integration), so they are in the team's daily workflow, not buried in a meeting summary email.

Step 3 — Track: The daily standup includes a 30-second sweep of open actions from meetings. The blockers are surfaced here, not discovered at the next meeting.

Step 4 — Close: When an action is completed in Jira/Linear, the meeting intelligence tool is updated (via automation) so the action shows as resolved in the meeting archive.

Step 5 — Review: At each retrospective, AI generates a report: "Here are all action items from meetings this sprint. Completion rate: [X]%. Items not completed: [list]. Pattern: [AI observation about which kinds of actions get completed vs dropped]."

MEETING HEALTH METRICS

Track these monthly with AI assistance:

Meeting load per person: "Here is our team's meeting schedule for the past month [paste calendar data or estimates]. Calculate the average meeting hours per week per role. Flag anyone above 25 hours per week of meetings — this indicates meeting load is crowding out focus time."

Decision velocity: "Here is our meeting archive summary for the past month [paste]. How many decisions were made in meetings? How many were deferred or required follow-up? What is our average decision-to-implementation time?"

Recurring meeting ROI: "Here are our recurring meetings [list with cadence, duration, and participant count]. For each, estimate whether the value delivered justifies the collective time cost. Flag any that appear to be low-value based on the typical agenda."

The last analysis often surfaces recurring meetings that have outlived their purpose — a 60-minute weekly cross-team sync that could be a five-minute async update, for example.

BUILDING A MEETING INTELLIGENCE ARCHIVE

After six months of consistent meeting recording and summarisation, you will have a searchable archive of every significant project conversation. This becomes increasingly valuable:

- A new stakeholder can review meeting summaries to understand project history without interviewing team members
- A disputed decision can be traced back to the exact meeting where it was made
- Recurring problems can be surfaced by searching for keywords across the archive
- Team communication patterns can be analysed longitudinally

Protect this archive: ensure data retention policies are clear, personally identifiable information is handled per your privacy policy, and sensitive meetings (performance, compensation, HR) are excluded from automatic recording.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- 6.3 Building Your Personal AI Stack and Workflow
  UPDATE public.videos SET
    description = 'An AI stack is not a collection of tools — it is an integrated system where each component does a specific job and the outputs flow automatically to the next stage. This lesson guides you through designing your personal PM AI stack: selecting the right tools, connecting them into a coherent workflow, eliminating redundancy, and building the habits that make the whole system run on autopilot.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '6.3 Building Your Personal AI Stack and Workflow',
      'description', 'An AI stack is not a collection of tools — it is an integrated system where each component does a specific job and outputs flow automatically to the next stage. This lesson guides you through designing your personal PM AI stack: selecting the right tools, connecting them, and building habits that make the system run on autopilot.',
      'transcript', $t$BUILDING YOUR PERSONAL AI STACK AND WORKFLOW

Most PMs end up with an accidental collection of AI tools — one added for meeting notes, one for writing, one recommended by a team member, one from a conference talk. These tools overlap in some areas and leave gaps in others. They require manual effort to move information between them. And they compete for attention rather than complementing each other.

The goal of this lesson is to help you design an intentional AI stack — a coherent, integrated system where each tool has a clear job, they connect to each other, and the whole runs with minimal manual effort.

THE AI STACK ARCHITECTURE

A complete PM AI stack has six layers:

Layer 1 — Intelligence: The core AI reasoning engine. ChatGPT (with Custom GPTs), Claude, or Gemini. This is where complex reasoning, writing, and analysis happen. Most PMs should choose one primary engine and use it consistently to build prompting fluency.

Layer 2 — Meeting intelligence: Captures and structures all spoken knowledge. Otter.ai, Fireflies, or platform-native (Teams Copilot). Feeds summaries and actions to layers 3 and 5.

Layer 3 — Project management: Where work is tracked and managed. Jira, Linear, Asana. Receives action items from Layer 2, generates velocity and health data for Layer 6.

Layer 4 — Documentation: Where knowledge is stored and shared. Notion, Confluence. Receives meeting notes from Layer 2, project docs from Layer 1, status reports for stakeholders.

Layer 5 — Communication: Where the team connects. Slack, Teams, Email. Receives automated posts from Layers 2, 3, and 4. The PM manages stakeholder relationships here.

Layer 6 — Analytics and reporting: Where patterns are surfaced. Datadog for engineering health, Looker/Tableau for business metrics, or custom dashboards built in Notion. AI interprets data for weekly health reviews.

DESIGNING YOUR PERSONAL STACK

Step 1 — Audit what you have: List every tool you currently use, which layer it occupies, and how it connects (or fails to connect) to adjacent layers.

Step 2 — Identify the gaps: Where are you doing manual work that should be automated? Where is information dying in one tool and not flowing to the next?

Step 3 — Identify the overlaps: Are you using two tools that do the same job? Consolidate.

Step 4 — Design the connections: For each pair of adjacent layers, define how information flows. Is it automated (Zapier trigger) or manual (copy-paste)? Manual connections are friction — automate them wherever the time investment justifies it.

Step 5 — Document your stack: Create a one-page diagram showing your six layers, the tools in each, and the connections between them. Share it with your team so they understand the system.

THE WEEKLY PM WORKFLOW MAP

Map your AI-assisted workflow for a typical week. For each major PM activity, specify: what data goes in, which AI tool processes it, what output comes out, where that output goes.

Example weekly workflow:

Monday:
- Input: Calendar data, last sprint's velocity, team availability
- Tool: ChatGPT (Sprint Planning Custom GPT)
- Output: Sprint capacity analysis, planning prep brief
- Destination: Notion project wiki, shared with team

Monday afternoon:
- Input: Sprint planning session (recorded by Otter.ai)
- Tool: Otter.ai → ChatGPT
- Output: Sprint brief, stakeholder summary, Jira sprint items
- Destination: Notion, Slack, Jira

Wednesday:
- Input: Jira burndown data, team standup notes
- Tool: ChatGPT (Risk Advisor Custom GPT)
- Output: Mid-sprint health check, risk update
- Destination: Personal Notion dashboard, sponsor if Amber/Red

Friday:
- Input: Week's meeting summaries, sprint velocity snapshot
- Tool: ChatGPT (Status Report Custom GPT)
- Output: Weekly stakeholder status update
- Destination: Email distribution, Notion archive

ELIMINATING TOOL SPRAWL

Every tool in your stack has a cost: licence cost, learning curve, maintenance overhead, and cognitive switching cost. The minimum viable PM AI stack that covers all six layers:

- Intelligence: ChatGPT Plus (one tool, all reasoning and writing)
- Meeting intelligence: Otter.ai Business
- Project management: Jira (or Linear for product teams)
- Documentation: Notion
- Communication: Slack
- Analytics: Jira Analytics + custom Notion dashboard

Six tools. Fully integrated. Covering every PM need. Total cost: approximately £80–120 per month — less than two hours of PM time.

Your stack may differ based on your organisation's existing tools. The principle remains: fewer, better-connected tools outperform many loosely-connected ones.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- 6.4 Measuring AI Impact: Metrics, ROI, and Stakeholder Buy-In
  UPDATE public.videos SET
    description = 'Every AI investment needs to justify itself in measurable terms — and as the PM who championed AI adoption, you are responsible for making that case. This lesson gives you the measurement framework, the financial ROI calculation, the stakeholder presentation structure, and the continuous improvement metrics that turn AI adoption from a cost centre into a demonstrable competitive advantage.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '6.4 Measuring AI Impact: Metrics, ROI, and Stakeholder Buy-In',
      'description', 'Every AI investment needs to justify itself in measurable terms. This lesson gives you the measurement framework, the financial ROI calculation, the stakeholder presentation structure, and the continuous improvement metrics that turn AI adoption from a cost into a demonstrable competitive advantage.',
      'transcript', $t$MEASURING AI IMPACT: METRICS, ROI, AND STAKEHOLDER BUY-IN

Adopting AI tools without measuring their impact is like shipping features without measuring user adoption — you hope it is working, but you do not know. Measurement serves three purposes: it tells you which AI investments are actually creating value, it provides the evidence to sustain and expand AI investment, and it creates accountability that drives proper adoption rather than tool hoarding.

This lesson gives you the complete measurement framework.

THE PM AI IMPACT MEASUREMENT FRAMEWORK

Measure in four categories:

Category 1 — Productivity Metrics (what AI saves)
- Administrative time saved per week per PM/SM
- Status report drafting time: before vs after AI
- Meeting note processing time: before vs after
- User story writing time: before vs after
- Estimation session duration: before vs after

Category 2 — Quality Metrics (what AI improves)
- Stakeholder satisfaction with communication quality (survey: rate 1-5)
- Story defect rate (bugs found after story accepted)
- Sprint commitment accuracy (stories committed vs completed)
- Risk register completeness score (percentage of risks with mitigation plans)

Category 3 — Speed Metrics (what AI accelerates)
- Time from requirement to refined story (ready for sprint)
- Cycle time: story started to story done
- Time from incident to stakeholder communication
- Decision response time (time from decision raised to decision made)

Category 4 — Team Metrics (what AI enables)
- PM capacity available for strategic work (hours freed from admin)
- Team AI adoption rate (percentage of team using AI tools weekly)
- Team satisfaction with PM communication and support (survey)
- Onboarding time for new team members

THE ROI CALCULATION

Financial ROI requires translating productivity gains into currency:

Step 1 — Calculate fully-loaded hourly cost:
Average PM/SM annual salary + benefits + overhead (typically 1.3–1.5× salary) ÷ 2,080 hours = fully-loaded hourly cost.

Step 2 — Quantify time savings:
Administrative time saved per week × 52 weeks = annual hours saved.
Annual hours saved × fully-loaded hourly cost = annual productivity value.

Step 3 — Quantify quality improvements:
Sprint defect rate reduction × average cost per escaped defect × defects per year = quality cost saving.

Step 4 — Quantify speed improvements:
Cycle time reduction × number of stories per year × average story value (revenue or cost-per-story metric) = speed-to-value gain.

Step 5 — Total value vs total cost:
Sum categories 1-4 minus annual AI tool licence cost = net annual ROI.

For most teams this calculation produces 5–20× ROI, with the largest gains typically in administrative time and quality improvement.

THE STAKEHOLDER BUY-IN PRESENTATION

Present AI impact to leadership quarterly. Structure:

Slide 1 — The headline: "AI augmentation has delivered [X]% productivity improvement, [Y] hours/week saved, and [£Z] estimated annual value"

Slide 2 — The evidence: Before/after metric table. Visual charts preferred over data tables for executive audiences.

Slide 3 — The stories: Two or three specific examples of AI-enabled outcomes. "We were able to turn around the executive status report in 15 minutes because AI drafted it from the sprint data — previously this took 90 minutes."

Slide 4 — The investment case: "Our AI tool investment of £[annual cost] is generating estimated annual value of £[N]. That is a [X]× return in Year 1, expected to grow as adoption deepens."

Slide 5 — The ask: "To maintain this advantage, we recommend [specific investment — new tool, expanded licences, PM training, etc.]. Here is the projected ROI."

SUSTAINING LEADERSHIP SUPPORT

The measurement framework serves a political as well as an analytical purpose. Stakeholders who approved AI investment need to know it was worth it. Stakeholders who were sceptical need to see the evidence that they should reconsider.

Report AI impact at the same frequency and in the same format as your project status reports. Make it routine, data-driven, and honest. If a tool is not delivering the expected value, say so — and propose either a different tool or a different adoption approach.

The PM who delivers credible, data-backed AI impact reporting builds a reputation as a trustworthy steward of technology investment. This is a career asset, not just a reporting obligation.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- 6.5 Future-Proofing Your PM Career in the Age of AI
  UPDATE public.videos SET
    description = 'The AI tools of 2025 will look primitive compared to those of 2028. The PMs who thrive are not those who master today''s tools — they are those who develop the durable capabilities to master whatever tools come next. This lesson gives you the career development framework for continuous AI literacy: what to learn, how to stay current, and how to position yourself as the PM who leads AI adoption rather than follows it.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '6.5 Future-Proofing Your PM Career in the Age of AI',
      'description', 'The PMs who thrive are not those who master today''s AI tools — they are those who develop the durable capabilities to master whatever tools come next. This lesson gives you the career development framework for continuous AI literacy: what to learn, how to stay current, and how to position yourself as the PM who leads AI adoption.',
      'transcript', $t$FUTURE-PROOFING YOUR PM CAREER IN THE AGE OF AI

The specific AI tools you have learned in this course — ChatGPT, Copilot, Otter.ai, Datadog AI — will evolve beyond recognition in three to five years. Some will be dominant; others will be surpassed; new ones will emerge that do not exist yet. The PM who tries to future-proof by mastering today's specific tools will need to re-learn constantly.

The PM who future-proofs by developing durable capabilities — the ability to evaluate, adopt, and integrate new AI tools quickly — will thrive regardless of what the technology looks like.

THE FOUR DURABLE AI COMPETENCIES

Competency 1 — Rapid AI Tool Evaluation:
The ability to assess a new AI tool against your workflow needs, integration requirements, and cost-benefit profile in under two hours. You have developed this competency in Module 1. Maintain it by evaluating one new PM-relevant AI tool per quarter, even if you do not adopt it.

Competency 2 — Prompt Engineering Mastery:
The ability to craft prompts that produce reliable, high-quality outputs across any LLM-based system. Prompt engineering principles transfer across tools because the underlying models share similar characteristics. Maintain this by deliberately experimenting with prompting techniques: chain-of-thought, role assignment, output format specification, iterative refinement.

Competency 3 — AI Integration Design:
The ability to design workflows where AI tools connect to each other and to human processes in ways that are efficient, reliable, and maintainable. This is the most transferable of the four competencies — the same principles that connect Otter.ai to ChatGPT to Jira apply to any future toolchain.

Competency 4 — AI Change Leadership:
The ability to introduce AI to teams in ways that achieve genuine adoption rather than compliance theatre. This competency is entirely human — it requires interpersonal intelligence, patience, and the ability to address fear and scepticism credibly. No AI tool replaces it.

STAYING CURRENT: THE PM AI LEARNING SYSTEM

The AI landscape changes faster than any single PM can track. Build a system rather than trying to follow everything:

Weekly (15 minutes):
- Subscribe to one AI newsletter: The Rundown AI or TLDR AI are excellent for weekly headlines
- Follow three to five credible AI practitioners on LinkedIn whose PM-adjacent commentary you trust

Monthly (60 minutes):
- Evaluate one new AI tool that has appeared in your feed
- Update your personal AI stack assessment: any tools to add, any to retire?
- Read one deep-dive article on an AI topic relevant to your domain

Quarterly (half-day):
- Attend one AI-focused webinar, conference session, or workshop
- Complete one short online course or tutorial on a new AI capability
- Review and update your prompt library with new techniques

Annually:
- Complete a structured AI learning program (like this one) to ensure your knowledge has no significant gaps
- Benchmark your AI competency against industry standards

POSITIONING YOURSELF AS AN AI LEADER

The PM role is evolving, and AI leadership is becoming a distinct career differentiator. Here is how to position for it:

Internal visibility: Volunteer to lead your organisation's PM AI adoption initiative. Present at team meetings and leadership forums on AI impact. Become the person others come to with AI questions.

External visibility: Write about your AI PM experiences on LinkedIn. Speak at local Agile meetups or product management events. Contribute to PM community forums. Teaching others is the most effective way to deepen your own understanding.

Credentials: While formal AI credentials are not yet as established as PMP or CSM, completing recognised AI literacy programs and contributing to industry conversation builds credibility. Consider certifications from Coursera, MIT, or Aladiah as they become available.

Network: Connect deliberately with other AI-forward PMs. The people who are doing this work in other organisations are your most valuable learning resource — they are running experiments you have not run and learning lessons you have not yet encountered.

THE PM OF 2030

The PM role in 2030 will look very different from 2024. The administrative coordination work will be nearly fully automated. The strategic, relational, and ethical dimensions will be elevated. The PM who is most valued will be the one who:

- Directs AI at scale across complex, multi-team programs
- Translates AI capabilities into business outcomes for executive audiences
- Builds and maintains the trust-based relationships that no technology can replace
- Makes the ethical judgments that AI systems are not equipped to make

This course has given you the foundation. The future belongs to the PMs who build on it continuously, with curiosity and discipline, as the technology evolves.

You are ready.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- 6.6 Capstone Lab: Your AI-First PM Operating Model
  UPDATE public.videos SET
    description = 'This capstone lab integrates everything from the course into your personal AI-First PM Operating Model — a documented, practised, and shareable system for how you run projects, communicate with stakeholders, manage risk, make decisions, and develop your team. You will build the model, test it against a real project scenario, and leave with an artefact that represents the full scope of your AI PM capability.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '6.6 Capstone Lab: Your AI-First PM Operating Model',
      'description', 'This capstone integrates everything from the course into your personal AI-First PM Operating Model — a documented, practised, and shareable system for how you run projects. You will build the model, test it against a real scenario, and leave with an artefact representing the full scope of your AI PM capability.',
      'transcript', $t$CAPSTONE LAB: YOUR AI-FIRST PM OPERATING MODEL

Six modules. Thirty-nine lessons. Dozens of tools, frameworks, prompts, and workflows. The measure of this course is not what you have learned — it is what you will do differently starting Monday.

This capstone lab exists to close that gap. You will document your AI-First PM Operating Model: the specific, personalised, practised system by which you will run projects, communicate with stakeholders, manage risk, develop your team, and measure outcomes. Not theory — your actual system, built from the tools and workflows that fit your context.

WHAT AN OPERATING MODEL IS

An operating model is not a vision statement. It is a description of how you actually operate: the specific tools, routines, prompts, and decisions that constitute your PM practice. When documented, it becomes:
- Shareable: You can show it to a new team and they understand immediately how you work
- Improvable: You can identify gaps and iterate deliberately rather than by accident
- Transferable: When you move to a new role or organisation, you bring the model with you and adapt it to new context

THE SIX SECTIONS OF YOUR OPERATING MODEL

Section 1 — My AI Stack
List every tool in your AI stack across the six layers defined in Lesson 6.3. For each tool: name, layer, primary use case, connection to adjacent tools.

Includes a diagram (draw it in Notion, Miro, or on paper and photograph it).

Section 2 — My Weekly Rhythm
Map Monday through Friday. For each working day: morning AI routine (15 minutes), in-meeting AI use, post-meeting AI processing, end-of-day AI review. Total: approximately 1 hour per day of intentional AI use that replaces 3-4 hours of manual work.

Section 3 — My Prompt Library
Compile every prompt template you have saved during this course. Organise by use case: status reports, user stories, risk analysis, retrospectives, planning, stakeholder communication. Minimum 20 prompts. Goal: 50 by end of first year.

Section 4 — My Measurement System
Define the five metrics you will track every sprint. Commit to a quarterly ROI review. Define what "success" looks like for your AI adoption at 3 months, 6 months, and 12 months.

Section 5 — My Team Adoption Plan
How will you introduce AI to your current team? Define: the first use case you will introduce, the communication message, the pilot timeline, the success metric, and how you will celebrate early wins.

Section 6 — My Learning Commitment
Define your monthly, quarterly, and annual AI learning commitments. Name one specific next course, one community to join, and one person in your network to connect with about AI PM practice.

THE CAPSTONE CHALLENGE

Apply your operating model to this real scenario:

You are joining a new project on Monday. It is a twelve-month programme to migrate a legacy CRM system to a cloud-native platform, with a cross-functional team of fifteen people across engineering, sales operations, and IT. Stakeholders include the VP of Sales, the CTO, and two enterprise clients who depend on the current system.

Your challenge: Using your AI-First PM Operating Model, describe specifically what you would do in your first two weeks. Include:
- Your week-one AI setup actions
- Your first three Custom GPT configurations
- Your stakeholder communication approach using AI
- Your initial risk assessment process using AI
- The first two metrics you would establish for measuring delivery health

Write this as a professional document — as if you were briefing a colleague who would cover for you if needed. Use your prompt templates to generate first drafts where appropriate.

SHARING YOUR OPERATING MODEL

The final step: share your operating model with at least two people — a colleague, a peer in this course community, or a mentor. Sharing creates accountability and generates feedback that makes your model better.

Post your model (or a summary) to the course community channel with the tag #MyAIPMModel. Review two other participants' models and leave one piece of constructive feedback on each.

WHAT YOU HAVE BUILT

Over six modules you have:
- Built an AI-first PM mindset and ethics foundation (Module 1)
- Mastered AI-assisted backlog management and sprint planning (Module 2)
- Automated your communication and documentation workflows (Module 3)
- Developed PM-level fluency in AI development and delivery tools (Module 4)
- Built a comprehensive risk, forecasting, and decision-making system (Module 5)
- Designed and documented your personal AI-First PM Operating Model (Module 6)

This is not a theoretical education. It is a practical transformation. The PM who completes this course and implements this operating model is not the same PM who started it. They are measurably more effective, more credible, and more future-ready.

The work continues. The tools will evolve. The discipline you have built will not.

Solo Excelencia.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- ── VERIFY ──────────────────────────────────────────────────────────────
-- Run this after applying. Expect filled=7 for M4, filled=6 for M5, filled=6 for M6.
SELECT c.order_index AS module, c.title,
  COUNT(v.id) AS lessons,
  COUNT(v.id) FILTER (WHERE v.translations->'en'->>'transcript' IS NOT NULL
    AND v.translations->'en'->>'transcript' <> '') AS filled
FROM public.chapters c
JOIN public.videos v ON v.chapter_id = c.id
WHERE c.course_id = (
  SELECT id FROM public.courses WHERE title = 'AI Mastery for Scrum Masters & Project Managers'
)
AND c.order_index IN (3, 4, 5)
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
