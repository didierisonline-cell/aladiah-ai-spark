-- =============================================================================
-- Seed BA lesson content (description + EN transcript) — Modules 7–9
--
--   M7: Process Analysis & Modeling (BPMN)   (order_index 7, OFFSET 6)
--   M8: Business Architecture               (order_index 8, OFFSET 7)
--   M9: Product Thinking & Strategy         (order_index 9, OFFSET 8)
--
-- Apply: paste into Supabase SQL Editor → Run
-- Verify: SELECT c.order_index, COUNT(*) FILTER (WHERE translations->'en'->>'transcript' IS NOT NULL) AS filled
--         FROM videos v JOIN chapters c ON c.id=v.chapter_id
--         JOIN courses co ON co.id=c.course_id WHERE co.curriculum_version='ba-v1'
--         AND c.order_index IN (7,8,9) GROUP BY c.order_index ORDER BY c.order_index;
-- Expected: modules 7, 8, 9 → filled=5 each
-- =============================================================================

DO $$
DECLARE
  v_ba_id UUID;
  v_ch    UUID;
BEGIN

  SELECT id INTO v_ba_id FROM public.courses
  WHERE title = 'AI Business Analyst & Product Discovery Specialist'
    AND curriculum_version = 'ba-v1';

  IF v_ba_id IS NULL THEN
    RAISE EXCEPTION 'BA course not found';
  END IF;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 7 — Process Analysis & Modeling (BPMN)  (OFFSET 6, order_index = 7)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 6;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M7 chapter not found'; END IF;

  -- Lesson 1: Process Thinking & Value Streams
  UPDATE public.videos SET
    description = 'Before you can improve a process, you must understand what it exists to do and how it fits into the value stream it serves. Most analysts jump straight to mapping individual tasks — and miss the systemic picture that explains why those tasks exist in the first place. This lesson teaches process thinking: how to identify, categorise, and inventory processes at the right level of abstraction before picking up a modelling tool.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Process Thinking & Value Streams',
      'description', 'Before modelling a process you must understand what it exists to do within the value stream it serves. This lesson teaches process thinking: how to identify, categorise, and inventory processes at the right level before picking up a modelling tool.',
      'transcript', 'PROCESS THINKING & VALUE STREAMS

WHY PROCESS THINKING COMES BEFORE PROCESS MAPPING

Every organisation is a collection of processes. The ones that matter — the ones worth analysing and improving — are the ones that directly create or destroy value for a customer. The ones that do not appear to matter are usually support processes for the processes that do.

If you skip process thinking and jump to mapping, you end up with a beautifully detailed model of the wrong thing.

WHAT IS A PROCESS?

A process is a repeatable sequence of activities that transforms inputs into outputs for a defined recipient. The key word is "repeatable." A one-time event is not a process. A process has:
- A defined trigger (what starts it?)
- A defined end state (what does "done" look like?)
- A defined recipient (who receives the output?)
- A set of activities that transform inputs into outputs
- Performance characteristics (how long, how often, how costly, how error-prone?)

PORTER''S VALUE CHAIN: THE STRATEGIC CONTEXT

Before mapping any process, understand where it sits in the value chain (Porter, 1985).

Primary activities — directly create value for the customer:
- Inbound logistics
- Operations / production
- Outbound logistics
- Marketing and sales
- Service

Support activities — enable the primary activities:
- Firm infrastructure
- Human resource management
- Technology development
- Procurement

A process analysis that focuses only on a support process while the primary activities are broken is misaligned with business value. Always locate your target process in the value chain first.

LEAN VALUE STREAM THINKING

Lean distinguishes three types of activity in any process:

1. VALUE-ADDING: activities the customer would pay for if they knew the work was being done
2. NON-VALUE-ADDING BUT NECESSARY: activities required for legal, compliance, or operational reasons that do not directly add customer value (necessary waste)
3. NON-VALUE-ADDING AND UNNECESSARY: pure waste — waiting, duplication, rework, over-processing

In a typical white-collar process, 60–70% of elapsed time is non-value-adding. The value stream map reveals this ratio at a glance.

BUILDING THE PROCESS INVENTORY

A Process Inventory is a catalogue of all processes within a defined scope, organised by:
- Process name and ID
- Owner (who is accountable for performance?)
- Trigger and end state
- Volume (how many times per period?)
- Known pain points (what is broken?)
- Priority for analysis (high / medium / low)

THE THREE-TIER PROCESS HIERARCHY

Level 1 — PROCESS GROUPS: the major end-to-end flows (e.g. "Order to Cash," "Hire to Retire," "Procure to Pay")
Level 2 — PROCESSES: the discrete processes within each group (e.g. "Order Entry," "Credit Check," "Order Fulfilment")
Level 3 — ACTIVITIES / TASKS: the individual steps within each process

Your Process Inventory should capture Level 2 processes. BPMN models Level 2–3.

USING AI TO ACCELERATE PROCESS DISCOVERY

Prompt: "Given that we are analysing the [Order to Cash] process for a [mid-size manufacturing company], generate a process inventory of Level 2 processes with typical triggers, end states, and common pain points."

Treat AI output as a starting hypothesis — validate every item against actual stakeholder input.

DELIVERABLE: Process Inventory
Produce a Process Inventory for the scope of your current engagement. Include: process name, owner, trigger, end state, volume estimate, top pain point, and analysis priority. Aim for 8–15 Level 2 processes.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: As-Is Modeling with BPMN
  UPDATE public.videos SET
    description = 'BPMN 2.0 is the international standard for process modelling and the most widely used notation in business analysis. A well-drawn BPMN model communicates process logic unambiguously to stakeholders, developers, and automation tools — but most BAs use only a fraction of the notation and produce diagrams that are incomplete or misleading. This lesson teaches the full BPMN 2.0 core element set and how to produce an accurate As-Is model that reveals where value is lost.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'As-Is Modeling with BPMN',
      'description', 'BPMN 2.0 is the international standard for process modelling. Most BAs use a fraction of the notation. This lesson covers the full BPMN 2.0 core element set and how to produce an accurate As-Is model that reveals where value is lost.',
      'transcript', 'AS-IS MODELING WITH BPMN

WHAT IS BPMN 2.0?

Business Process Model and Notation 2.0 (BPMN 2.0) is a formal graphical notation standardised by the Object Management Group (OMG). It is:
- Executable: BPMN diagrams can be loaded directly into process automation engines (Camunda, Activiti, jBPM)
- Unambiguous: every shape has a precise semantic meaning, unlike informal flowcharts
- Universally understood: any qualified BA, architect, or developer worldwide reads the same diagram the same way

THE CORE BPMN ELEMENTS

FLOW OBJECTS — the building blocks of process logic:

EVENTS mark where something happens:
- Start Event (thin circle): the trigger that begins the process
- End Event (thick circle): the state reached when the process is complete
- Intermediate Event (double circle): something that happens during the process (timer, message, error)
- Event types: Message (envelope icon), Timer (clock), Error (lightning bolt), Signal, Escalation, Compensation

ACTIVITIES represent work performed:
- Task (rounded rectangle): a single unit of work
  - Task types: User Task (person), Service Task (gear), Script Task (scroll), Manual Task, Business Rule Task
- Sub-Process (rounded rectangle with + marker): a process collapsed into a single shape; can be expanded
- Call Activity: reusable process called from multiple places

GATEWAYS control flow branching and merging:
- Exclusive Gateway (X diamond): only one outgoing path is taken based on a condition
- Parallel Gateway (+ diamond): all outgoing paths are taken simultaneously
- Inclusive Gateway (O diamond): one or more paths taken based on conditions
- Event-Based Gateway: the next path is determined by which event occurs first
- Complex Gateway: for complex routing logic not covered by the above types

CONNECTING OBJECTS — show how elements relate:
- Sequence Flow (solid arrow): the order of activities within a pool
- Message Flow (dashed arrow): communication between separate pools
- Association (dotted line): links artefacts to flow objects

SWIMLANES — show who does what:
- Pool: represents a participant (organisation, role, system) — a top-level boundary
- Lane: a subdivision of a pool (department, role) — shows responsibility within the participant

ARTEFACTS — provide additional information:
- Data Object: data produced or consumed by a task
- Data Store: persistent data (a database or file)
- Annotation: explanatory text attached to any element
- Group: visual grouping without semantic meaning

MODELLING THE AS-IS PROCESS: STEP BY STEP

Step 1 — IDENTIFY THE SCOPE
Define the Start Event (trigger) and End Event (outcome). Draw the outer pool boundary. Add lanes for each participant role.

Step 2 — MAP THE HAPPY PATH
Map the main sequence of tasks from start to end. Resist adding exceptions until the happy path is complete.

Step 3 — ADD GATEWAYS AND DECISION POINTS
Identify every point where the flow could go in different directions. Use the correct gateway type:
- "Either/or" decision → Exclusive Gateway
- "Do both simultaneously" → Parallel Gateway
- "One or more of these" → Inclusive Gateway

Step 4 — ADD EXCEPTIONS AND ERROR FLOWS
Add Boundary Events to tasks that can fail (Error Events, Timer Events). Show what happens when they trigger.

Step 5 — ADD MESSAGE FLOWS
If external parties (customers, suppliers, regulators) send or receive information, use Message Flows between pools.

Step 6 — VALIDATE WITH STAKEHOLDERS
Walk through the model step-by-step with the process owner. The goal: "Does this accurately represent what actually happens — including the workarounds?"

COMMON AS-IS MODELLING MISTAKES

- Mixing the As-Is (what is) with the To-Be (what should be) — model only what actually happens
- Using flowchart boxes instead of proper BPMN task types — lose executability
- Missing exception flows — the model represents the happy path only (typically < 30% of actual cases)
- Using the wrong gateway type — Exclusive and Inclusive are often confused
- No swimlanes — impossible to see who does what

DELIVERABLE: As-Is BPMN
Model one Level 2 process from your Process Inventory using correct BPMN 2.0 notation. Include: at minimum one pool with two lanes, one Exclusive Gateway, one Parallel or Inclusive Gateway, one Intermediate Event, and at least one exception flow. Use Lucidchart, draw.io, or Camunda Modeler.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Gap & Root-Cause Process Analysis
  UPDATE public.videos SET
    description = 'An As-Is BPMN model is a diagnostic tool, not an endpoint. The value it creates comes from the analysis that follows: identifying where time, cost, and quality are lost, tracing those losses to root causes, and quantifying the improvement opportunity. This lesson teaches the structured gap analysis framework that turns a process model into a business case.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Gap & Root-Cause Process Analysis',
      'description', 'An As-Is BPMN model is a diagnostic tool, not an endpoint. This lesson teaches the structured gap analysis framework that turns a process model into a quantified improvement opportunity and a business case.',
      'transcript', 'GAP & ROOT-CAUSE PROCESS ANALYSIS

FROM MODEL TO INSIGHT

A BPMN As-Is model is a hypothesis: "This is how the process works." Gap analysis tests that hypothesis against performance data, stakeholder pain, and desired outcomes — and produces a prioritised list of problems to solve.

Without gap analysis, you have a diagram. With it, you have a business case.

THE GAP ANALYSIS FRAMEWORK

STEP 1 — ESTABLISH THE PERFORMANCE BASELINE

For each process, measure:
- Cycle time: how long does the end-to-end process take? (from trigger to end state)
- Throughput: how many instances are processed per period?
- Error rate: what percentage of instances require rework or exception handling?
- Cost per instance: fully loaded cost (people, systems, overhead) per process execution
- Customer satisfaction: what do recipients of the process output actually think of it?

Without a baseline, you cannot prove that any improvement delivered value.

STEP 2 — IDENTIFY THE CURRENT-STATE GAPS

For each step in the As-Is model, ask:
- TIME GAP: is there waiting, queuing, or handoff delay here? How long?
- QUALITY GAP: how often does this step produce incorrect, incomplete, or reworked output?
- RESOURCE GAP: is this step over- or under-resourced relative to its volume?
- TECHNOLOGY GAP: is this step manual when it could be automated? Is the system inadequate?
- INFORMATION GAP: does the person performing this step have the information they need, when they need it?

THE VALUE-ADDED ANALYSIS

Apply lean analysis to each step in the model. Classify as:
- Value-Adding (VA): the customer would pay for this
- Business Value-Adding (BVA): necessary for the business but not directly valuable to the customer (compliance, audit, governance)
- Non-Value-Adding (NVA): waste — eliminate or reduce

Calculate: VA% = (VA time) / (total elapsed time) × 100
A VA% below 30% is typical; a VA% below 10% is a transformation opportunity.

STEP 3 — ROOT-CAUSE ANALYSIS AT THE PROCESS LEVEL

For each significant gap, apply the process-level root cause framework:

CAUSE CATEGORIES (adapted for process analysis):
- People: insufficient skills, unclear accountability, inadequate training
- Process: missing steps, unclear decision criteria, inconsistent execution, inadequate controls
- Technology: system limitations, integration gaps, inadequate automation, poor UX
- Data: inaccurate master data, missing information at decision points, latency
- Governance: unclear ownership, inadequate measurement, perverse incentives

Apply the 5 Whys for each gap to reach the systemic root cause.

QUANTIFYING THE IMPROVEMENT OPPORTUNITY

For each root cause identified, estimate:
- Current cost (time × volume × fully loaded rate per hour)
- Potential saving if root cause is eliminated (% improvement × current cost)
- Confidence in estimate (high / medium / low, with basis)

This builds the financial justification for the To-Be design.

STEP 4 — PRIORITISE GAPS

Not all gaps are worth fixing. Prioritise by:
- Impact × Feasibility matrix: high impact + high feasibility = fix now
- Strategic alignment: does fixing this gap support a strategic priority?
- Risk: what is the risk of not fixing this gap?

PRESENTING GAP ANALYSIS TO STAKEHOLDERS

Structure: SITUATION → EVIDENCE → GAP → ROOT CAUSE → OPPORTUNITY
Example: "The credit approval process currently takes 5 days on average. Our baseline data shows 3.5 of those days are queue time between the analyst and the credit committee. The root cause is that the credit committee meets only twice per week. If we move to daily asynchronous approvals, we estimate a 70% reduction in cycle time, saving approximately $240K per year in customer churn from slow approvals."

DELIVERABLE: Process Gap Analysis
For the As-Is BPMN you modelled in Lesson 2, produce a Process Gap Analysis. Include: performance baseline (even if estimated), VA/NVA classification for each step, top 3 gaps with root causes, quantified improvement opportunity for each gap, and a prioritised list of gaps to address in the To-Be design.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: To-Be Design & Optimization
  UPDATE public.videos SET
    description = 'The To-Be BPMN model is your vision of how the process should work after the problems identified in gap analysis are resolved. It is not a wish list — it is a feasible design that stakeholders have validated, that improves measurable performance, and that can be implemented within the constraints of the organisation. This lesson teaches the To-Be design process: from design principles through optimisation patterns to stakeholder validation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'To-Be Design & Optimization',
      'description', 'The To-Be BPMN model is a feasible, validated design that resolves the gaps identified in analysis. This lesson teaches the To-Be design process from design principles through optimisation patterns to stakeholder validation.',
      'transcript', 'TO-BE DESIGN & OPTIMIZATION

THE TO-BE DESIGN MANDATE

The To-Be model answers the question: "If we fixed the root causes identified in our gap analysis, what would the process look like?"

Three constraints bound the design:
1. FEASIBILITY: what is technically and organisationally achievable within the implementation window?
2. MEASURABILITY: how will we know the To-Be design achieved the improvement target?
3. TRACEABILITY: every change from As-Is to To-Be must trace to a root cause identified in gap analysis

The To-Be model is not a blank slate redesign — it is a targeted response to specific, evidenced problems.

PROCESS DESIGN PRINCIPLES

Before designing, agree with stakeholders on the principles that govern the To-Be model:

LEAN PRINCIPLES (Toyota Production System):
- Eliminate waste: remove all NVA activities that can be eliminated without business risk
- Flow: design so work moves continuously without queuing or handoff delay
- Pull: work is triggered by demand, not pushed through batches
- Perfection: design for continuous improvement, not a one-time fix

DIGITAL PROCESS DESIGN PRINCIPLES:
- Automate the routine, humanise the exception: people handle what requires judgment; systems handle the rest
- Data at the point of need: eliminate information-gathering delays by making data available where the decision is made
- Parallel over sequential: activities that do not depend on each other should happen simultaneously
- Fail fast: detect errors as early in the process as possible, not at the end

THE SEVEN OPTIMISATION PATTERNS

1. ELIMINATION: remove activities that add no value (approvals that rubber-stamp, reports no one reads, data that is captured but never used)

2. SIMPLIFICATION: reduce the number of steps, decision criteria, or handoffs — without removing necessary control

3. AUTOMATION: replace human execution of rule-based tasks with system execution (Robotic Process Automation, workflow engines, AI decisioning)

4. PARALLELISATION: convert sequential activities that do not depend on each other into parallel flows using a Parallel Gateway

5. INTEGRATION: eliminate manual rekeying by creating direct data flows between systems (via API, event streaming, or ETL)

6. RESEQUENCING: move high-frequency exception-triggers earlier in the process to reduce rework (e.g. validate data before processing, not after)

7. SPECIALISATION: route different case types to different process paths based on complexity or risk, rather than processing all cases the same way (intelligent triage)

MODELLING THE TO-BE IN BPMN

Mark the changes explicitly:
- Use colour or annotation to show: ELIMINATED (red), AUTOMATED (blue), SIMPLIFIED (yellow), NEW (green)
- Show the expected impact of each change in an annotation: "Eliminates 2.5-day queue time"
- Maintain pools and lanes consistent with the As-Is so comparison is easy

TRANSITION REQUIREMENTS

The gap between As-Is and To-Be generates transition requirements:
- Technology changes: what systems need to be built, configured, or integrated?
- Process changes: what procedures, controls, and decision criteria change?
- People changes: what training, role changes, or headcount adjustments are needed?
- Data changes: what data quality improvements or new data sources are needed?

These become the input to your requirements specification.

VALIDATING THE TO-BE WITH STAKEHOLDERS

A To-Be model that stakeholders have not validated is a theory, not a design. Run a validation session:
1. Walk through the As-Is model and confirm the gaps
2. Present the To-Be model change by change, explaining the root cause each change addresses
3. For each change, ask: "Does this design make sense? Is it feasible? Is there anything we''ve missed?"
4. Quantify the expected performance improvement: "This design should reduce cycle time from 5 days to 1.5 days. Do you believe that is achievable?"

DELIVERABLE: To-Be BPMN
Produce a To-Be BPMN model for the process you analysed in Lesson 3. Mark all changes from the As-Is model with the optimisation pattern applied. Include a transition requirements list (at least 5 items). Document the expected performance improvement for each major change.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Process Mining & AI-Assisted Analysis
  UPDATE public.videos SET
    description = 'Process mining transforms event log data from ERP, CRM, and workflow systems into automatically generated process models — revealing what actually happens in a process at a level of detail and accuracy that manual observation cannot match. Combined with AI-assisted analysis, it compresses weeks of process discovery into hours and identifies improvement opportunities invisible to the human eye. This lesson teaches process mining concepts, tooling, and how to integrate AI into every stage of the analysis cycle.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Process Mining & AI-Assisted Analysis',
      'description', 'Process mining generates accurate process models from event log data, revealing what actually happens at a level of detail manual observation cannot match. This lesson covers process mining concepts, tooling, and integrating AI into every stage of analysis.',
      'transcript', 'PROCESS MINING & AI-ASSISTED ANALYSIS

WHAT IS PROCESS MINING?

Process mining (developed by Wil van der Aalst, TU/e) is a family of techniques that extracts process knowledge from event logs in information systems. Every time a task is completed in an ERP, CRM, BPM, or workflow system, it leaves a timestamped record. Process mining algorithms read those records and:

1. DISCOVER: automatically generate a BPMN-style process model from the data (no manual modelling)
2. CONFORM: compare the actual process against the intended process model and identify deviations
3. ENHANCE: enrich an existing process model with performance data (time, cost, frequency per path)

The result: a data-driven, accurate picture of the process as it actually executes — across thousands of cases, not the 10 you observed in the field.

THE EVENT LOG

Process mining requires an event log with three minimum fields:
- CASE ID: a unique identifier for each process instance (order number, customer ID, claim ID)
- ACTIVITY: the name of the activity that was completed
- TIMESTAMP: when the activity was completed

Optional but valuable:
- RESOURCE: who or which system performed the activity
- COST: the cost of the activity
- OUTCOME: whether the case ended in a desired or undesired state

THE THREE PROCESS MINING USE CASES FOR THE BA

USE CASE 1 — REPLACE MANUAL AS-IS MODELLING
Instead of interviewing stakeholders about how the process works (and getting the espoused theory), extract the event log from the system and discover the actual process. The discovered model will show:
- How many process variants actually exist (often 10–50× more than stakeholders describe)
- Which variants are most frequent (the happy path)
- Which variants are anomalies (exceptions, errors, workarounds)

USE CASE 2 — IDENTIFY BOTTLENECKS AND REWORK
The performance enhancement view shows:
- Average, median, and 95th-percentile case duration by path
- Activities where cases queue (high waiting time relative to processing time)
- Rework loops (activities that appear more than once in a case)
- Resources with the highest throughput time

USE CASE 3 — CONFORMANCE CHECKING
Upload the To-Be BPMN model (or the target process) and run conformance checking:
- Which cases deviate from the target process?
- What are the most common deviations?
- What is the performance impact of conformance vs. non-conformance?

PROCESS MINING TOOLS

Enterprise: Celonis, SAP Signavio Process Intelligence, IBM Process Mining, Minit
Mid-market: Fluxicon Disco, UiPath Process Mining
Open-source: PM4Py (Python), bupaR (R)

For BAs without enterprise tooling, PM4Py and a basic event log from any ticketing or workflow system is enough to demonstrate the technique.

AI-ASSISTED PROCESS ANALYSIS

Beyond process mining, AI accelerates every stage of the analysis cycle:

ELICITATION:
- Prompt: "Generate a list of questions a BA should ask during a process discovery session for an [insurance claims] process"
- Prompt: "Given this process description [paste text], identify the steps, decision points, and likely exception paths"

MODELLING:
- Prompt: "Convert the following process description into BPMN XML format: [paste process description]"
- Some tools (Camunda, Signavio) accept natural language and generate BPMN draft models

ANALYSIS:
- Prompt: "Given this process data [paste performance metrics], identify the top 3 bottlenecks and suggest root causes"
- Prompt: "Apply lean waste categories (TIMWOOD) to this process step list [paste steps] and identify the highest-priority waste"

TO-BE DESIGN:
- Prompt: "For a process with [specific gaps], generate 3 To-Be design options using optimisation patterns, with trade-offs for each"

VALIDATION:
- AI can flag logical inconsistencies in a BPMN model (e.g. gateways with no merge, deadlocks, unreachable paths)

BUILDING YOUR BPMN PACKAGE

A complete process analysis deliverable for a professional engagement contains:
1. Process Inventory (Module 7, Lesson 1)
2. As-Is BPMN model(s) for priority processes
3. Process Gap Analysis with root causes and quantified opportunities
4. To-Be BPMN model(s) with marked changes
5. Transition Requirements List
6. Process Mining findings (if event log data is available)
7. Expected performance improvement dashboard (before / after KPIs)

DELIVERABLE: BPMN Package
Assemble the complete BPMN Package for one process in your engagement scope. Combine your Process Inventory, As-Is BPMN, Gap Analysis, To-Be BPMN, and Transition Requirements into a single deliverable. Add a one-page Executive Summary: current state performance, root causes addressed, expected future-state performance, and implementation path.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 8 — Business Architecture  (OFFSET 7, order_index = 8)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 7;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M8 chapter not found'; END IF;

  -- Lesson 1: Capability Mapping
  UPDATE public.videos SET
    description = 'Business capabilities are the foundation of enterprise architecture. A capability is what an organisation must be able to do — independent of how it currently does it. Capability mapping creates a stable, strategy-neutral language for describing the business that survives technology changes, reorganisations, and market pivots. This lesson teaches how to build a Business Capability Map from scratch and use it to drive investment decisions.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Capability Mapping',
      'description', 'Business capabilities define what an organisation must be able to do, independent of how it currently does it. This lesson teaches how to build a Business Capability Map and use it to drive investment decisions.',
      'transcript', 'CAPABILITY MAPPING

WHAT IS A BUSINESS CAPABILITY?

A business capability is the ability to perform a specific type of work that creates business value. It answers the question "WHAT does the business need to be able to do?" — not "HOW does it do it?" or "WHO does it?"

Examples:
- "Customer Onboarding" (not "the onboarding team" or "the CRM system")
- "Fraud Detection" (not "the fraud rules engine" or "the fraud analyst team")
- "Contract Management" (not "the contract management system" or "the legal team")

This distinction is critical. Capabilities are stable — they persist even when the technology, team, or process that delivers them changes. A Capability Map from 2010 is largely still valid in 2025 (the capabilities are the same; the delivery mechanisms have changed).

WHY CAPABILITY MAPS MATTER

1. STRATEGY LANGUAGE: executives can articulate strategy in capability terms ("We will differentiate on Customer Analytics; we will standardise our Supply Chain Management capabilities")
2. INVESTMENT ALIGNMENT: every technology or change investment can be mapped to the capability it strengthens or enables
3. OVERLAP DETECTION: duplicate capabilities across business units (often 30–40% of capabilities) become visible, enabling rationalisation
4. SOURCING DECISIONS: capabilities can be classified as build / buy / partner / outsource based on strategic importance and current maturity

THE CAPABILITY MAP STRUCTURE

A Capability Map is organised in three levels:

LEVEL 1 — CAPABILITY DOMAINS: the highest-level groupings (typically 5–12 for a mid-size organisation)
Common domains: Customer Management, Product & Service Management, Sales & Distribution, Operations & Fulfilment, Finance & Control, Technology & Data, Human Capital, Risk & Compliance

LEVEL 2 — CAPABILITIES: the specific capabilities within each domain (typically 3–8 per domain)
Example under "Customer Management": Customer Acquisition, Customer Onboarding, Customer Service, Customer Retention, Customer Insight

LEVEL 3 — SUB-CAPABILITIES: the granular capabilities within each capability (used for detailed analysis)
Example under "Customer Onboarding": Identity Verification, Account Setup, Welcome Communication, Product Activation, Initial Education

THE TOGAF AND ARCHIMATE CONNECTION

The Open Group Architecture Framework (TOGAF) treats the Business Architecture layer as the foundation for all other architecture layers. Capabilities live in the Business Architecture layer.

ArchiMate 3.x (the visual modelling language for enterprise architecture) has a dedicated "Capability" element that can be linked to:
- Business Processes (HOW the capability is performed)
- Business Roles (WHO performs it)
- Application Components (WHAT systems support it)
- Goals and Outcomes (WHY it exists)

Even if you are not a formal enterprise architect, using the capability → process → application linkage structure from ArchiMate gives your analysis a rigorous foundation.

BUILDING THE CAPABILITY MAP: STEP BY STEP

Step 1 — IDENTIFY CAPABILITY DOMAINS
Interview senior leaders: "What are the major things this business needs to be able to do to achieve its strategy?" Group into 6–10 domains.

Step 2 — DECOMPOSE TO LEVEL 2
For each domain, identify 4–7 specific capabilities. Use a noun-phrase format: "X Management," "X Processing," "X Analysis."

Step 3 — VALIDATE WITH STAKEHOLDERS
Present the draft map. Ask: "Is there anything this business needs to be able to do that is not on this map?" and "Is there anything on this map that does not apply to us?"

Step 4 — ASSIGN OWNERSHIP
Each Level 2 capability needs a single accountable owner (a business role, not a person). Unowned capabilities have no one to improve them.

Step 5 — ASSESS CURRENT MATURITY
For each capability, rate the current maturity on a 1–5 scale:
1 = Ad hoc (no consistent approach)
2 = Defined (documented process exists)
3 = Managed (measured and controlled)
4 = Optimised (continuously improved)
5 = Leading (industry-leading performance)

DELIVERABLE: Capability Map
Produce a Business Capability Map for an organisation you are analysing (or a realistic case study). Include Level 1 domains and Level 2 capabilities. Assign an owner role and a current maturity rating (1–5) to each Level 2 capability. Present as a structured grid or hierarchical diagram.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Value Streams & Operating Models
  UPDATE public.videos SET
    description = 'A value stream is the end-to-end sequence of activities that delivers a specific outcome to a specific customer — cutting across organisational silos, technology boundaries, and process layers. Understanding value streams reveals how capabilities combine to create (or destroy) customer value, and shows where the operating model must change to support the strategy. This lesson teaches value stream analysis and the Operating Model Canvas.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Value Streams & Operating Models',
      'description', 'A value stream is the end-to-end sequence that delivers a specific outcome to a customer, cutting across silos and systems. This lesson teaches value stream analysis and the Operating Model Canvas that connects strategy to delivery.',
      'transcript', 'VALUE STREAMS & OPERATING MODELS

WHAT IS A VALUE STREAM?

A value stream is the complete sequence of activities required to deliver a specific product or service to a customer — from the initial trigger to the realised outcome. Unlike a process (which lives within a single organisational unit), a value stream crosses functions, systems, and teams.

Examples:
- "Loan Application to Funded": the end-to-end journey from a customer submitting a loan application to receiving funds
- "New Hire to Productive": the journey from a job offer acceptance to a new employee delivering their first independent output
- "Incident Raised to Resolved": the journey from a customer raising a service issue to their problem being solved

VALUE STREAM MAPPING (VSM) — THE LEAN ORIGIN

Value Stream Mapping originated in Toyota''s production system. For the BA, a VSM shows:
- Every step in the end-to-end flow (processes, queues, decision points)
- The information flows that trigger and support each step
- Time data: process time (how long the step takes), lead time (how long the case waits before the step begins)
- Identifying the biggest time traps (where value is waiting, not being created)

VSM ELEMENTS:
- Process boxes: steps where work is performed
- Push arrows: work pushed to the next step (batch-based)
- Pull arrows: work triggered by downstream demand
- Data boxes: performance metrics for each step (cycle time, error rate, staff FTE)
- Timeline bar: cumulative process time vs. total elapsed time — reveals the VA% gap

THE OPERATING MODEL

An operating model defines how an organisation delivers value — the structure of people, processes, technology, and governance that executes the strategy.

THE OPERATING MODEL CANVAS (Marc Lankhorst / Andrew Campbell)

The Operating Model Canvas has eight components:
1. VALUE PROPOSITIONS: what value does the organisation deliver, to which customers?
2. CUSTOMERS & CHANNELS: who are the customers and how do they receive value?
3. CAPABILITIES: what must the organisation be able to do to deliver the value propositions?
4. PROCESSES: what processes operationalise the capabilities?
5. ORGANISATION: what structure (teams, roles, governance) runs the processes?
6. INFORMATION: what data and information flows support decision-making and process execution?
7. TECHNOLOGY: what systems and platforms enable the processes and information flows?
8. SUPPLIERS & PARTNERS: what does the organisation source externally?

CONNECTING VALUE STREAMS TO THE OPERATING MODEL

Value streams reveal which capabilities and processes must work together to deliver customer value. The Operating Model Canvas shows how the organisation is currently structured to (or failing to) support those value streams.

Common misalignments:
- Value stream crosses 5 organisational silos, creating 4 handoff delays → misaligned organisation design
- Value stream requires real-time data from 3 systems that do not integrate → misaligned technology
- Value stream requires capabilities that the organisation does not currently have → capability gap

These misalignments become the priority items in the Target-State Architecture (Lesson 4).

THE BA''S ROLE IN OPERATING MODEL DESIGN

BAs are not typically responsible for full operating model redesign — that is the domain of management consultants and enterprise architects. However, the BA''s process and capability analysis is the primary input to operating model redesign work. A BA who can:
- Map the current operating model accurately
- Identify the misalignments with the target value stream
- Articulate the design options and their trade-offs

...is operating at the level of a senior business architect, which commands a significant salary premium.

DELIVERABLE: Operating Model Canvas
Complete an Operating Model Canvas for the organisation or business unit you are analysing. For the two most important value streams, identify the top misalignment between current operating model and target value stream performance. Document the options for resolving each misalignment.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Capability Heatmaps & Investment
  UPDATE public.videos SET
    description = 'A Capability Map tells you what an organisation can do. A Capability Heatmap tells you how well each capability is performing, how strategically important each capability is, and — by overlaying these dimensions — where investment should flow. Heatmap analysis is one of the most powerful tools a BA can bring to an executive conversation because it makes investment trade-offs visible, defensible, and data-driven.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Capability Heatmaps & Investment',
      'description', 'A Capability Heatmap overlays performance and strategic importance to show where investment should flow. This lesson teaches how to build and present a Heatmap that makes investment trade-offs visible and defensible.',
      'transcript', 'CAPABILITY HEATMAPS & INVESTMENT

WHAT IS A CAPABILITY HEATMAP?

A Capability Heatmap is a Business Capability Map colour-coded to show one or more performance or investment dimensions at a glance. It transforms the capability inventory from a catalogue into a decision-support tool.

Common heatmap dimensions:
- PERFORMANCE HEAT: current capability maturity / performance (Red = poor, Amber = adequate, Green = strong)
- STRATEGIC IMPORTANCE: how critical is this capability to the organisation''s strategy? (rated 1–5)
- INVESTMENT PRIORITY: where should the next investment dollar go?
- PAIN LEVEL: how much friction, cost, or risk does the current capability state create?
- TECHNOLOGY HEALTH: how well do the systems supporting this capability perform?
- AI AUTOMATION POTENTIAL: what percentage of this capability''s activities could be automated with AI?

THE THREE HEATMAP ANALYSES

1. PERFORMANCE VS. STRATEGIC IMPORTANCE (the investment decision matrix)

Plot each capability on a 2×2:
- HIGH importance / LOW performance → INVEST: these capabilities are strategically critical and underperforming; they are the top investment priority
- HIGH importance / HIGH performance → PROTECT: these capabilities are differentiated; protect investment levels to maintain the advantage
- LOW importance / LOW performance → TOLERATE: underperforming but not strategically critical; accept current state or consider outsourcing
- LOW importance / HIGH performance → RATIONALISE: performing well but not strategic; may be over-invested relative to value; consider reducing investment

2. PAIN-WEIGHTED INVESTMENT ANALYSIS

For each capability, score:
- Pain score: severity × frequency of capability failures (1–25 scale)
- Fix cost: estimated investment required to address root causes (Low / Medium / High)

Priority = Pain score / Fix cost → High pain, low cost = do first; High pain, high cost = strategic programme

3. AI AUTOMATION POTENTIAL HEATMAP

For each capability, estimate:
- Current automation level: % of activities currently automated
- Potential automation level: % achievable with current AI/automation technology
- Automation gap: the delta = investment opportunity

Capabilities with large automation gaps and high strategic importance are the strongest candidates for AI-driven transformation.

BUILDING THE HEATMAP: STEP BY STEP

Step 1 — GATHER RATINGS
Collect performance and strategic importance ratings through a structured stakeholder survey. Use a consistent 1–5 scale. Aggregate ratings from multiple stakeholders (average or consensus session).

Step 2 — APPLY COLOUR CODING
Use a consistent colour scheme:
- Red: 1–2 (poor / low)
- Amber: 3 (adequate)
- Green: 4–5 (strong / high)

Step 3 — OVERLAY THE CAPABILITY MAP
Apply ratings to the capability grid. The resulting coloured map makes pattern-recognition immediate.

Step 4 — IDENTIFY PATTERNS
Look for:
- "Red clusters": groups of underperforming capabilities that suggest a systemic problem
- "Mismatched cells": high strategic importance + low performance = the burning platform
- "Green over-investment": high performance in low-importance areas = possible reallocation opportunity

PRESENTING THE HEATMAP TO EXECUTIVES

Structure:
1. Show the blank Capability Map: "This is what your organisation needs to be able to do"
2. Apply the performance heat: "This is how well you currently do each of these things"
3. Apply the strategic importance overlay: "This is what matters most to your strategy"
4. Highlight the mismatches: "These are the gaps that will prevent your strategy from succeeding"
5. Present the investment recommendation: "This is where we recommend investing, in this sequence, for these reasons"

DELIVERABLE: Capability Heatmap
Take the Capability Map from Lesson 1. Rate each Level 2 capability on: performance (1–5) and strategic importance (1–5). Create a colour-coded Capability Heatmap. Identify the top 3 investment priorities (high importance, low performance) and draft a one-paragraph investment rationale for each.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Target-State Architecture
  UPDATE public.videos SET
    description = 'The Target-State Architecture defines what the organisation must look like — in terms of capabilities, processes, organisation design, information, and technology — to execute its strategy. It is the north star that aligns every project, programme, and investment decision. This lesson teaches how to define a Target-State Architecture using ArchiMate-inspired layering and how to bridge from current state to target state with a sequenced transition roadmap.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Target-State Architecture',
      'description', 'The Target-State Architecture defines what the organisation must look like to execute its strategy — across capabilities, processes, organisation, information, and technology. This lesson teaches how to define it and bridge to it with a sequenced transition roadmap.',
      'transcript', 'TARGET-STATE ARCHITECTURE

WHAT IS TARGET-STATE ARCHITECTURE?

The Target-State Architecture (TSA) is a structured description of the future state the organisation must reach to deliver its strategic objectives. It is not a utopian aspiration — it is a bounded, achievable design that is grounded in the strategic constraints of the organisation.

The TSA operates across four layers (consistent with TOGAF''s Architecture Development Method, ADM):

LAYER 1 — BUSINESS ARCHITECTURE
Target capabilities: which capabilities will be enhanced, created, or retired?
Target processes: what do the key value-stream processes look like in the target state?
Target organisation: what changes to roles, teams, and governance are required?
Target performance: what KPIs define success, and what are the target values?

LAYER 2 — INFORMATION ARCHITECTURE
What data does the organisation need, and where does it need it?
What is the target data quality standard for each critical data domain?
What information flows link processes and decisions?

LAYER 3 — APPLICATION ARCHITECTURE
Which applications support which capabilities and processes?
What is the target application landscape (which systems stay, which are replaced, which are new)?
What are the integration patterns between applications?

LAYER 4 — TECHNOLOGY ARCHITECTURE
What infrastructure, cloud platform, and security architecture supports the application layer?

THE BA''S SCOPE: LAYERS 1 AND 2

BAs typically own Layers 1 and 2. Enterprise Architects own Layers 3 and 4. The BA who can define Layers 1 and 2 with rigour is the bridge between business strategy and technical architecture.

DEFINING THE TARGET-STATE BUSINESS ARCHITECTURE

Step 1 — CAPABILITY TARGET STATE
For each capability on your heatmap:
- Current maturity: 1–5
- Target maturity: what level is required to support the strategy?
- Gap: target minus current
- Initiative required: what programme of work closes the gap?

Step 2 — PROCESS TARGET STATE
For each value stream process in scope:
- Current state: As-Is BPMN (from Module 7)
- Target state: To-Be BPMN (from Module 7)
- Performance target: what does the KPI look like in the target state?
- Transition requirements: what must change to get there?

Step 3 — ORGANISATION TARGET STATE
- What roles change (new, modified, eliminated)?
- What governance mechanisms change (committees, decision rights, escalation paths)?
- What skills and training investments are required?

THE ARCHIMATE-INSPIRED LAYERING

ArchiMate 3.x models the relationship between:
- Motivation layer: goals, principles, requirements, drivers
- Strategy layer: capabilities, resources, value streams
- Business layer: processes, functions, roles, events
- Application layer: applications, services, data
- Technology layer: infrastructure, networks, devices

Even in a non-ArchiMate engagement, using this mental model ensures you have connected strategy (why) to capability (what) to process (how) to application (with what).

BUILDING THE TRANSITION ROADMAP

The transition from current to target state must be sequenced. Not everything can change simultaneously. Sequence based on:
1. DEPENDENCY: capabilities and processes that others depend on must change first
2. RISK: high-risk changes need stabilisation periods before dependent changes proceed
3. BUSINESS CONTINUITY: critical operational processes must maintain service levels through transition
4. QUICK WINS: early, visible improvements build organisational momentum and stakeholder trust

A typical transition roadmap has 3–5 phases across 18–36 months. Each phase delivers a stable intermediate state — not just a milestone in a continuous change programme.

DELIVERABLE: Target-State Architecture
For the organisation you are analysing, define the Target-State Business Architecture. Include: (1) capability target-state table (current maturity, target maturity, gap, initiative required), (2) one-page target operating model description, (3) a transition roadmap with 3 phases, each describing which capabilities and processes change and what the measurable outcome of that phase is.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Strategic Alignment & Transformation Framing
  UPDATE public.videos SET
    description = 'Business architecture analysis is only valuable if it influences decisions. The final skill in the architecture toolkit is strategic framing: connecting your capability findings, value-stream analysis, and target-state design to the language of the C-suite — strategy, risk, competitive advantage, and return on investment. This lesson teaches how to package architecture insights into a Transformation Recommendation Deck that executives will act on.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Strategic Alignment & Transformation Framing',
      'description', 'Business architecture analysis only creates value if it influences decisions. This lesson teaches how to package capability findings and target-state design into a Transformation Recommendation Deck that executives will act on.',
      'transcript', 'STRATEGIC ALIGNMENT & TRANSFORMATION FRAMING

THE ARCHITECTURE-STRATEGY CONNECTION

Business architecture analysis begins with strategy and must return to strategy. Every capability gap, every misaligned operating model, every underperforming value stream must ultimately be framed in terms of its impact on strategic objectives.

The question is not "our Customer Onboarding capability is at maturity 2." The question is "our Customer Onboarding capability is at maturity 2, which is causing us to lose 12% of new customers in the first 30 days, which represents $4.2M in annual revenue foregone, which is directly undermining our growth strategy."

Strategy-connected analysis gets investment. Architecture analysis that stays in the architecture layer does not.

THE STRATEGIC ALIGNMENT TEST

For every architecture finding, apply the alignment test:
1. Which strategic objective does this finding affect?
2. What is the measurable impact on that objective?
3. What happens if we do nothing (the "burning platform" case)?
4. What is the recommended response?
5. What is the ROI of the recommended response?

Only findings that pass all five questions belong in an executive presentation.

TRANSFORMATION FRAMING: THE THREE NARRATIVES

NARRATIVE 1 — THE BURNING PLATFORM
"If we do not act, here is what happens."
Used when: the organisation is resistant to change; inertia is the default.
Frame: quantify the cost of the current state — revenue at risk, regulatory exposure, competitive disadvantage — over a 3-year horizon.

NARRATIVE 2 — THE OPPORTUNITY
"If we act now, here is the value we capture."
Used when: the organisation is growth-minded and open to investment.
Frame: quantify the upside — revenue unlocked, cost reduction, market share gained, risk eliminated — and the timeline to capture it.

NARRATIVE 3 — THE BURNING PLATFORM + OPPORTUNITY
"We must act because of [risk], and when we do, we also unlock [opportunity]."
Used when: the audience is mixed (some risk-averse, some growth-focused).
Frame: lead with the risk (gets attention), follow with the opportunity (gets excitement), close with the recommendation (gets a decision).

THE TRANSFORMATION RECOMMENDATION DECK STRUCTURE

SLIDE 1 — EXECUTIVE SUMMARY
Three bullets: the key finding, the recommended action, and the expected return.
One sentence framing: "This analysis shows that our [capability area] is the single largest constraint on [strategic objective]."

SLIDE 2 — THE CURRENT STATE: WHAT THE DATA SHOWS
Capability heatmap with performance and strategic importance dimensions highlighted.
Top 3 capability gaps with quantified business impact.

SLIDE 3 — WHY THIS IS URGENT
The cost of delay: what does each quarter of inaction cost?
The competitive context: are competitors pulling ahead on these capabilities?
Regulatory or risk drivers (if applicable).

SLIDE 4 — THE TARGET STATE
One-page vision of the target operating model.
Key capability improvements (maturity 2 → 4 for Priority 1 capabilities).
Target performance KPIs (before and after).

SLIDE 5 — THE ROADMAP
Three-phase transition plan.
Phase 1: quick wins (3–6 months) — build momentum
Phase 2: core transformation (6–18 months) — capability step-changes
Phase 3: optimisation (18–36 months) — continuous improvement and AI integration

SLIDE 6 — INVESTMENT AND RETURN
Investment required per phase.
Expected return per phase (cost reduction, revenue impact, risk reduction value).
Payback period and NPV (if the data supports it).

SLIDE 7 — THE DECISION
The specific decision(s) being requested from this group.
Next steps if approved.
Who is accountable for what.

THE BA AS TRUSTED ADVISOR

The BA who can produce this deck — grounded in rigorous process and capability analysis, connected to strategy, framed in financial terms — is operating as a trusted advisor to the C-suite. This is the profile that commands $150K–$230K roles in transformation, strategy, and enterprise architecture.

DELIVERABLE: Transformation Recommendation Deck
Assemble a Transformation Recommendation Deck for the organisation you have been analysing across Module 8. Include: executive summary, capability heatmap findings, target-state summary, three-phase roadmap, and investment/return summary. Present it as if to a CTO or COO who has 30 minutes and no prior context.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 9 — Product Thinking & Strategy  (OFFSET 8, order_index = 9)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 8;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M9 chapter not found'; END IF;

  -- Lesson 1: Outcomes, Vision & Value
  UPDATE public.videos SET
    description = 'The shift from output thinking to outcome thinking is the most important mindset shift in modern product and BA practice. Outputs are things you build; outcomes are changes in behaviour or situation that create business value. BAs and product analysts who frame their work in outcomes — not features — command the highest salaries because they are solving the right problem, not just building the requested solution. This lesson teaches the Outcome Map: the tool that connects vision to value.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Outcomes, Vision & Value',
      'description', 'The shift from output thinking to outcome thinking is the most important mindset shift in modern product practice. This lesson teaches how to frame work in outcomes, connect vision to value, and build an Outcome Map.',
      'transcript', 'OUTCOMES, VISION & VALUE

THE OUTPUT VS. OUTCOME DISTINCTION

OUTPUT: something you build or deliver (a feature, a report, a system, a process)
OUTCOME: a change in behaviour or situation that creates value (a customer buys more, an employee processes claims faster, a regulator is satisfied)

The critical insight: outputs do not automatically produce outcomes.

Classic failure case: A development team delivers every feature on the roadmap on time and on budget. Customer churn increases. The business blames the product team for not delivering value. The product team says they delivered everything asked of them. Both are right — because the features were outputs, and no one verified whether they would produce the desired outcomes.

When you work in outcomes, you ask before building: "If we build this, what behaviour change do we expect to see, and how will we measure it?" If you cannot answer that question, you should not build the thing.

THE OUTCOME HIERARCHY

1. BUSINESS OUTCOMES: the metrics the organisation is trying to move (revenue, cost, risk, retention, NPS)
2. PRODUCT OUTCOMES: changes in user behaviour that drive the business outcomes (feature adoption, session depth, task completion rate, time-on-task)
3. LEADING INDICATORS: early signals that a product outcome is on track (day-1 activation rate, first-value moment completion)

The connection: business outcome ← product outcome ← leading indicator ← feature

If you cannot trace a feature to this chain, the feature is not justified.

PRODUCT VISION: THE NORTH STAR

A product vision describes the future state the product is working toward — not the features it will build, but the world it will help create.

A strong product vision:
- Is customer-outcome oriented, not feature-oriented
- Is ambitious enough to provide direction for 3–5 years
- Is narrow enough to exclude things you will NOT do
- Can be understood by a new team member in 30 seconds

EXAMPLES:
Weak: "Build the best CRM for small businesses" (what does "best" mean? Best at what?)
Strong: "Make every small business owner feel like they have a full-time sales operations team working for them — for $50 a month."

The strong version describes the customer''s desired situation (outcomes), not the product''s features.

THE OPPORTUNITY SOLUTION TREE (Teresa Torres)

The Opportunity Solution Tree (OST) is a visual framework that connects:
- DESIRED OUTCOME (top): the product outcome you are trying to achieve
- OPPORTUNITIES (middle): the customer problems, needs, or desires that, if addressed, would move the outcome
- SOLUTIONS (below opportunities): the specific things you could build or change to address each opportunity
- EXPERIMENTS (bottom): the tests you run to validate that a solution will work

The OST prevents "solution shopping" (jumping to solutions before understanding the opportunity landscape). It makes explicit which solutions are addressing which opportunities — and which opportunities are most worth pursuing.

THE OUTCOME MAP

An Outcome Map connects:
- Business Vision → Strategic Objectives → Business Outcomes → Product Outcomes → Leading Indicators → Features

It answers the question: "Why are we building this, and how will we know if it worked?"

A complete Outcome Map includes:
- The business objective being served
- The user behaviour change required
- The metric that measures that behaviour change
- The current baseline value of that metric
- The target value of that metric (and the timeline)
- The specific features or initiatives hypothesised to drive the behaviour change

DELIVERABLE: Outcome Map
Choose one product or initiative you are working on (or a realistic case study). Build an Outcome Map: identify the business objective, the required user behaviour change, the product outcome metric (with baseline and target), and the top 3 features or initiatives hypothesised to drive the outcome. For each feature, write the hypothesis in the format: "We believe [feature] will cause [behaviour change] because [reason], which we will measure by [metric]."'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Business-Model & North-Star Thinking
  UPDATE public.videos SET
    description = 'The North Star Metric is the single metric that best captures the value your product delivers to customers — and that, if it grows, will predictably drive sustainable business growth. Identifying the right North Star metric requires understanding the business model at its core: how the product creates value, captures value, and sustains value over time. This lesson teaches North Star thinking and how to use the Business Model Canvas as the analytical foundation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Business-Model & North-Star Thinking',
      'description', 'The North Star Metric captures the value your product delivers and predicts sustainable growth. This lesson teaches North Star thinking and how to use the Business Model Canvas as the analytical foundation for finding it.',
      'transcript', 'BUSINESS-MODEL & NORTH-STAR THINKING

WHAT IS THE NORTH STAR METRIC?

The North Star Metric (NSM) is the single metric that:
1. Captures the core value the product delivers to customers
2. Predicts long-term sustainable revenue growth
3. Aligns the entire product team around a common definition of success

The concept was popularised by the growth teams at Amplitude and adopted widely in product-led growth companies.

NORTH STAR METRIC EXAMPLES BY BUSINESS MODEL:

- Airbnb: "Nights booked" (captures value delivered to both hosts and guests)
- Slack: "Messages sent" (captures organisational adoption and engagement)
- Spotify: "Time spent listening" (captures value to users; predicts subscription retention)
- Duolingo: "Daily Active Users" (captures habit formation; predicts long-term retention)
- Salesforce: "CRM records created" (captures customer adoption depth; predicts expansion revenue)

Note what each metric has in common: it measures a customer behaviour, not a financial outcome. Revenue is the consequence of the NSM growing — not the NSM itself. (Revenue is a lagging indicator; the NSM is a leading indicator.)

WHY THE NSM MUST CONNECT TO THE BUSINESS MODEL

The wrong NSM can optimise a product into a death spiral.

Classic failure: A social platform chose "Daily Active Users" as its NSM. The growth team discovered that outrage-inducing content drove DAU. They optimised for outrage. DAU grew. Engagement quality fell. Advertisers left. Revenue declined.

The NSM must be chosen to reflect genuine value delivery — which requires understanding the business model.

THE BUSINESS MODEL CANVAS (Osterwalder & Pigneur)

The Business Model Canvas has nine components:
1. CUSTOMER SEGMENTS: who are you creating value for?
2. VALUE PROPOSITIONS: what value do you deliver to each segment?
3. CHANNELS: how do you reach and deliver to customers?
4. CUSTOMER RELATIONSHIPS: what type of relationship does each segment expect?
5. REVENUE STREAMS: how does the business generate revenue from each segment?
6. KEY RESOURCES: what assets are required to deliver the value proposition?
7. KEY ACTIVITIES: what activities are critical to the business model?
8. KEY PARTNERSHIPS: who are the key suppliers and partners?
9. COST STRUCTURE: what are the most significant costs in the business model?

FOR THE BA / PRODUCT ANALYST:

Using the Business Model Canvas before defining the NSM ensures the metric reflects:
- The value proposition (what the product does for customers)
- The revenue model (how the product generates sustainable income)
- The customer relationship (what drives retention and expansion)

SELECTING THE NORTH STAR METRIC

Step 1: Articulate the value proposition in one sentence: "Our product helps [customer segment] [achieve outcome] by [mechanism]."

Step 2: Identify the key customer behaviour that proves value is being delivered. (This is the candidate NSM.)

Step 3: Validate against three tests:
- CUSTOMER VALUE TEST: does this metric go up when customers get more value?
- REVENUE PREDICTION TEST: does this metric reliably predict revenue growth?
- TEAM ALIGNMENT TEST: can every team trace their work to this metric?

Step 4: Define the NSM precisely: name, definition, measurement method, current baseline, target.

SUPPORTING METRICS: THE NSM TREE

The NSM is supported by 3–5 input metrics (or "drivers") that the product team can directly influence:
- NSM: "Weekly active customers placing at least one order"
  - Driver 1: New customer activation rate (first order within 7 days)
  - Driver 2: Purchase frequency (repeat orders per customer per month)
  - Driver 3: Breadth of engagement (number of categories browsed per session)

Each driver is the NSM for a specific squad or product area.

DELIVERABLE: North-Star Definition
For a product you are analysing (or a realistic case study), complete a Business Model Canvas. Identify the candidate North Star Metric. Validate it against the three tests. Define 3 input metrics that drive it. Write the NSM definition card: metric name, definition, measurement method, current baseline, 12-month target, and which team owns it.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Strategy: Choosing Opportunities
  UPDATE public.videos SET
    description = 'Opportunity identification is the highest-leverage activity in product strategy: choosing which problems to solve determines 80% of the value a product creates. Most teams solve the loudest, most-requested problems rather than the highest-value, most-underserved ones. This lesson teaches the opportunity landscape frameworks — Jobs-to-be-Done, Opportunity Scoring, and the Opportunity Solution Tree — that lead to the right opportunity before investing in any solution.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Strategy: Choosing Opportunities',
      'description', 'Choosing which problems to solve determines 80% of the value a product creates. This lesson teaches JTBD, Opportunity Scoring, and the Opportunity Solution Tree to identify the right opportunities before investing in solutions.',
      'transcript', 'STRATEGY: CHOOSING OPPORTUNITIES

THE OPPORTUNITY IDENTIFICATION PROBLEM

Most product teams and BAs respond to the loudest, most frequently requested problem. This sounds rational — volume of requests signals importance. But it produces a systematic bias toward:
- Problems that are easy to articulate (vs. problems that are felt but hard to name)
- Problems that vocal stakeholders experience (vs. problems that affect the most valuable customers)
- Problems that have obvious solutions (vs. high-value problems that are hard to solve)

The result: a product roadmap full of features that satisfy the most vocal customers but do not move the strategic needle.

JOBS-TO-BE-DONE (JTBD): THE OPPORTUNITY LENS

JTBD (Christensen, Moesta, Ulwick) reframes the question from "what features do customers want?" to "what progress are customers trying to make?"

A Job is: a problem or aspiration that a customer is trying to resolve in a specific context.

Jobs have three dimensions:
1. FUNCTIONAL: the practical task the customer is trying to accomplish ("process a claim in under 10 minutes")
2. EMOTIONAL: how the customer wants to feel while doing it ("confident I haven''t made an error")
3. SOCIAL: how the customer wants to be perceived ("seen as competent by my manager")

THE JTBD OPPORTUNITY IDENTIFICATION METHOD (Tony Ulwick — Outcome-Driven Innovation)

Step 1 — LIST THE JOBS
Interview customers about what they are trying to accomplish (not what features they want). Extract the jobs — both the main job and the related jobs (preparing to do the job, monitoring progress, resolving exceptions).

Step 2 — LIST THE DESIRED OUTCOMES FOR EACH JOB
For each job, identify the outcomes the customer uses to measure success. Outcomes are always: a direction of change + a metric + the thing being optimised.
Example: "Minimise the time it takes to identify the correct claim code."

Step 3 — SCORE OPPORTUNITIES
For each desired outcome, ask customers two questions:
- "How important is it that you can [desired outcome]?" (1–10)
- "How satisfied are you with your current ability to [desired outcome]?" (1–10)

Calculate: Opportunity Score = Importance + MAX(Importance – Satisfaction, 0)

Interpretation:
- Score ≥ 15: OVER-SERVED (over-investing here adds little value)
- Score 10–15: RIPE OPPORTUNITY (important and underserved — high value to address)
- Score < 10: UNDERSERVED BUT LOW IMPORTANCE (not worth pursuing now)

THE OPPORTUNITY SOLUTION TREE (Teresa Torres)

The OST organises the opportunity space visually:

ROOT: Desired Outcome (the NSM or product outcome you are pursuing)
LEVEL 1: Opportunity clusters (themes of related customer problems/desires)
LEVEL 2: Specific opportunities (individual customer problems or unmet needs)
LEVEL 3: Solution concepts (ideas for how to address each opportunity)
LEVEL 4: Experiments (tests to validate each solution concept)

The OST prevents the most common product strategy error: jumping from "we want to improve retention" to "let''s build a loyalty programme" without mapping the opportunity space in between.

CREATING THE OPPORTUNITY SHORTLIST

From the full opportunity landscape, create a shortlist using three filters:
1. OPPORTUNITY SCORE ≥ 10 (important and underserved)
2. STRATEGIC ALIGNMENT (addresses a capability gap or strategic objective from your architecture work)
3. FEASIBILITY (addressable within the current product, team, and technology context)

The shortlist becomes the input to the prioritisation process in Lesson 4.

HOW TO USE AI IN OPPORTUNITY IDENTIFICATION

Prompt: "Given the following customer interview transcripts [paste transcripts], identify the top 5 Jobs-to-be-Done, list the desired outcomes for each job, and suggest which outcomes are likely most underserved based on the language and frustration signals in the transcripts."

AI output: a first-pass JTBD map that dramatically accelerates manual analysis. Validate every output against raw customer data — AI can miss nuance, domain-specific context, and emotional signals.

DELIVERABLE: Opportunity Shortlist
For a product or initiative you are working on, conduct (or simulate) JTBD opportunity scoring. List 10–15 desired outcomes. Score each on importance and satisfaction. Calculate opportunity scores. Build a mini Opportunity Solution Tree with your top 3 opportunities and 2–3 solution concepts per opportunity. Produce a 3-item Opportunity Shortlist with rationale for each selection.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Value vs Effort & Market Attractiveness
  UPDATE public.videos SET
    description = 'Having identified a shortlist of opportunities, the next challenge is prioritisation: which opportunity to pursue first, second, and not at all. The answer requires evaluating opportunities across two independent dimensions — the value they create (for customers and the business) and the effort required to capture it. This lesson teaches the Prioritization Matrix and market attractiveness analysis: the tools that make trade-off conversations data-driven.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Value vs Effort & Market Attractiveness',
      'description', 'Prioritising opportunities requires evaluating value created and effort required across independent dimensions. This lesson teaches the Prioritization Matrix and market attractiveness analysis to make trade-off conversations data-driven.',
      'transcript', 'VALUE VS. EFFORT & MARKET ATTRACTIVENESS

THE PRIORITISATION CHALLENGE

You have a shortlist of opportunities. Each one is genuinely valuable. The question is: in what sequence should you pursue them, given finite team capacity and business resources?

Prioritisation done badly is: "The CEO likes this one" or "We''ve always done it this way." These are the most common approaches, and they reliably produce the wrong sequence.

Prioritisation done well is: a systematic evaluation of each opportunity across value and effort dimensions, with explicit trade-offs documented and rationale recorded.

DIMENSION 1: VALUE

Value has multiple components. Score each opportunity on:

CUSTOMER VALUE: how much progress does this opportunity enable for the customer?
- High: addresses a high-importance, high-opportunity-score need (from JTBD analysis)
- Medium: addresses a meaningful but not critical need
- Low: nice-to-have

BUSINESS VALUE: what is the impact on the North Star Metric and business outcomes?
- Revenue impact (new customers, expansion revenue, churn reduction)
- Cost impact (operational efficiency, support reduction)
- Risk impact (regulatory compliance, security, data quality)
- Strategic positioning (competitive differentiation, market positioning)

TIME SENSITIVITY: is there a cost of delay?
- High: regulatory deadline, competitive window closing, customer contract at risk
- Medium: meaningful cost of delay but manageable
- Low: no particular urgency

Aggregate into a composite VALUE SCORE (1–5 per component, summed or weighted).

DIMENSION 2: EFFORT

Effort is not just development time. Score each opportunity on:

DEVELOPMENT EFFORT: engineering time to build (T-shirt size: S/M/L/XL → 1/2/3/4)
COMPLEXITY: technical risk, integration requirements, performance constraints (1–4)
ORGANISATIONAL CHANGE: process, training, and change management required (1–4)
DEPENDENCIES: what else must be done first? (1–4)

Aggregate into a composite EFFORT SCORE.

THE PRIORITISATION MATRIX

Plot opportunities on a 2×2:
- HIGH value / LOW effort → QUICK WINS: do these immediately; they build momentum and deliver early ROI
- HIGH value / HIGH effort → STRATEGIC BETS: plan these carefully; they require sustained investment but deliver transformative value
- LOW value / LOW effort → FILL-INS: complete only if capacity allows; do not prioritise over Strategic Bets
- LOW value / HIGH effort → MONEY PITS: avoid; they consume resources with minimal return

MARKET ATTRACTIVENESS ANALYSIS

For external product opportunities (new products, new markets, feature areas competing for market share), add a market attractiveness dimension:

THE 5 MARKET ATTRACTIVENESS FACTORS:

1. MARKET SIZE: how large is the total addressable market (TAM)?
   Calculate: TAM = number of potential customers × average annual value per customer

2. MARKET GROWTH RATE: is the market expanding or contracting?
   High-growth markets reward first-movers; contracting markets require defensibility

3. COMPETITIVE INTENSITY: how many competitors, and how well-entrenched?
   Use Porter''s Five Forces for a structured analysis: competitive rivalry, threat of new entrants, buyer power, supplier power, threat of substitutes

4. DIFFERENTIATION POTENTIAL: can you win on a dimension that matters to customers and that competitors cannot easily copy?
   High differentiation potential = defensible position; low = commodity competition

5. STRATEGIC FIT: does this market align with the organisation''s capabilities and strategic direction?

COMBINING VALUE, EFFORT, AND MARKET ATTRACTIVENESS

A complete prioritisation framework for each shortlisted opportunity:
| Opportunity | Customer Value | Business Value | Time Sensitivity | Effort | Market Attractiveness | Priority |
|---|---|---|---|---|---|---|
| Opp A | 4 | 5 | 3 | 2 | 4 | 1 |
| Opp B | 3 | 3 | 1 | 4 | 3 | 3 |
| Opp C | 5 | 4 | 4 | 3 | 5 | 2 |

Use the table to have a data-grounded conversation with stakeholders about sequence — not an opinion battle.

DELIVERABLE: Prioritization Matrix
Take your Opportunity Shortlist from Lesson 3. Score each opportunity on: customer value (1–5), business value (1–5), time sensitivity (1–5), effort (1–5), and market attractiveness (1–5). Create a Prioritization Matrix. Rank the opportunities and write a 2-sentence rationale for each ranking position. Identify which quadrant of the 2×2 each opportunity falls into.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Assembling the Product Opportunity Assessment
  UPDATE public.videos SET
    description = 'The Product Opportunity Assessment (POA) is the definitive document for making the case to invest in a product opportunity — or to walk away from one. Originally described by Marty Cagan, the POA answers ten questions that every executive and product leader needs answered before committing resources to a new product direction. This lesson teaches how to write a POA that integrates all the analytical work from Module 9 into a single, actionable investment brief.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Assembling the Product Opportunity Assessment',
      'description', 'The Product Opportunity Assessment (POA) answers the ten questions every leader needs answered before committing resources to a new product direction. This lesson teaches how to write a POA that integrates all of Module 9''s analysis into one actionable investment brief.',
      'transcript', 'ASSEMBLING THE PRODUCT OPPORTUNITY ASSESSMENT

WHAT IS A PRODUCT OPPORTUNITY ASSESSMENT?

The Product Opportunity Assessment (POA), described by Marty Cagan in Inspired, is a structured brief for evaluating whether a product opportunity is worth pursuing. It is designed to:
- Force rigorous thinking before committing to a solution
- Surface assumptions that need validation before investment
- Create a clear, shared understanding of the opportunity across business and product stakeholders
- Provide a decision-quality brief for executives who must allocate resources

The POA is NOT a business case (which typically argues for a pre-determined solution). The POA is an opportunity framing — it describes the problem space and makes the case that this problem space is worth entering.

THE TEN QUESTIONS (Cagan''s POA Framework)

1. EXACTLY WHAT PROBLEM WILL THIS SOLVE? (VALUE PROPOSITION)
Be specific. Vague problem statements lead to vague solutions. State the customer job, the current friction or unmet outcome, and the cost of the problem (in time, money, or frustration) to the customer.

2. FOR WHOM DO WE SOLVE THE PROBLEM?
Define the target customer segment with precision. Not "small businesses" but "B2B SaaS companies with 10–50 employees, a part-time finance function, and monthly revenue of $50K–$500K." The more specific, the more useful. Include the JTBD from Lesson 3.

3. HOW BIG IS THE OPPORTUNITY?
Estimate the TAM, SAM (serviceable addressable market), and SOM (serviceable obtainable market). Quantify the opportunity in terms of potential customers, ARR impact, or cost reduction. Use the market attractiveness analysis from Lesson 4.

4. WHAT ALTERNATIVES ARE OUT THERE NOW?
Describe how the target customer currently solves the problem. What are the substitutes? Why are they inadequate? This reveals the differentiation opportunity.

5. WHY ARE WE BEST POSITIONED TO SOLVE THIS PROBLEM?
What capabilities, assets, data, distribution, or relationships give the organisation an advantage in addressing this opportunity? If the answer is "nothing in particular," that is a significant risk.

6. WHY NOW?
What has changed in the market, technology, regulatory environment, or customer behaviour that makes this the right time to address this opportunity? (The "why now" also addresses competitive urgency.)

7. HOW WILL WE GET THIS PRODUCT TO MARKET?
What is the go-to-market approach? Who owns sales and distribution? What channels reach the target customer? How long to first revenue or first outcome?

8. HOW WILL WE MEASURE SUCCESS? (NORTH STAR + SUCCESS METRICS)
Define the North Star Metric for this opportunity. Define the 3–5 input metrics that indicate progress. State the 30-day, 90-day, and 12-month targets.

9. WHAT FACTORS ARE CRITICAL TO SUCCESS?
List the 3–5 assumptions that, if wrong, would cause this opportunity to fail. These become the first experiments to run before committing to full development.

10. GIVEN THE ABOVE, WHAT IS OUR RECOMMENDATION?
Based on everything: is this opportunity worth pursuing? With what level of investment? In what timeframe? Or: should we pass, and why?

INTEGRATING MODULE 9''S ANALYSIS INTO THE POA

The POA is the synthesis document for everything you have built in Module 9:

- Outcome Map (Lesson 1) → feeds questions 1 and 8
- Business Model Canvas & NSM (Lesson 2) → feeds questions 3, 5, and 8
- JTBD & Opportunity Shortlist (Lesson 3) → feeds questions 1, 2, and 4
- Prioritization Matrix (Lesson 4) → feeds questions 3, 6, and 10

THE POA AS A CAREER ARTEFACT

The POA is one of the most distinctive artefacts a BA or product analyst can include in a portfolio. It demonstrates:
- Strategic thinking (not just execution)
- Customer-centricity (JTBD, outcome focus)
- Commercial acumen (market sizing, financial framing)
- Synthesis skill (connecting analysis to recommendation)

A well-written POA for a realistic scenario — even a case study — will differentiate a candidate in interviews for senior BA, product analyst, and product manager roles at $90K–$230K.

COMMON POA MISTAKES

1. Answering "what are we building?" instead of "what problem are we solving?" — the POA is about the opportunity, not the solution
2. Over-sizing the market (bottoms-up data beats top-down slides)
3. No crisp "why now?" — without it, the urgency is unclear
4. Success metrics that are output metrics (features shipped) rather than outcome metrics (customer behaviour changed)
5. No explicit recommendation — a POA that ends with "there are pros and cons" has not done its job

DELIVERABLE: Product Opportunity Assessment
Write a complete Product Opportunity Assessment for the opportunity you selected and prioritised in Lessons 3 and 4. Answer all ten questions with specificity and evidence. Draw on your Outcome Map, Business Model Canvas, Opportunity Shortlist, and Prioritization Matrix. The POA should be 2–4 pages and ready to present to a CTO, CPO, or investment committee. This is your Module 9 capstone deliverable.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- =============================================================================
-- VERIFY (run immediately after applying)
-- Expected: modules 7, 8, 9 each show filled=5
-- =============================================================================
SELECT
  c.order_index AS module,
  c.title       AS chapter,
  COUNT(*) FILTER (
    WHERE v.translations->'en'->>'transcript' IS NOT NULL
      AND v.translations->'en'->>'transcript' <> ''
  )             AS filled
FROM public.videos v
JOIN public.chapters c ON c.id = v.chapter_id
JOIN public.courses  co ON co.id = c.course_id
WHERE co.curriculum_version = 'ba-v1'
  AND c.order_index IN (7, 8, 9)
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
