import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdmin } from "../_shared/auth.ts";

const courseData = {
  title: "Project Management Professional Certification",
  description: "A comprehensive PM certification program covering PMP fundamentals, Agile methodologies, stakeholder management, risk, budget, and AI-powered tools. Aligned with PMI standards and real-world delivery.",
  modules: [
    {
      title: "Module 1: Foundations of Project Management",
      description: "Master the PM framework, project lifecycle, organizational structures, and the PMI talent triangle.",
      order_index: 0,
      lessons: [
        { title: "1.1 What is Project Management?", description: "Define projects vs operations, the PM role, value delivery, and why organizations invest in PM.", order_index: 0,
          mainPoints: ["A project is a temporary endeavor to create a unique product, service, or result.", "Operations are ongoing; projects have defined start and end dates.", "The PM role spans planning, execution, monitoring, and closing.", "PMI's Talent Triangle: Ways of Working, Power Skills, Business Acumen.", "Value delivery is the ultimate goal — not just on-time, on-budget delivery."],
          questions: [
            { q: "What distinguishes a project from an operation?", opts: ["Projects are larger", "Projects are temporary with unique outcomes; operations are ongoing", "Operations cost more", "Projects have more people"], a: 1, exp: "Projects have defined start/end dates and produce unique deliverables. Operations are repetitive ongoing activities." },
            { q: "What is the PMI Talent Triangle?", opts: ["Cost, Schedule, Scope", "Ways of Working, Power Skills, Business Acumen", "Risk, Quality, Resources", "Initiation, Planning, Execution"], a: 1, exp: "PMI's updated Talent Triangle emphasizes technical PM skills, leadership, and strategic/business acumen." },
            { q: "What is the primary goal of project management?", opts: ["Complete projects on time", "Deliver value to stakeholders and the organization", "Minimize cost", "Follow the project plan exactly"], a: 1, exp: "Value delivery is the ultimate objective — managing scope, time, and cost serves that larger purpose." },
            { q: "Which best describes a Project Manager's role?", opts: ["Only creates schedules", "Leads teams to deliver project objectives within constraints", "Reports to the team", "Only manages budget"], a: 1, exp: "PMs integrate all aspects: scope, schedule, cost, quality, risk, communication, and stakeholder management." },
            { q: "What are project constraints?", opts: ["Only time and money", "Scope, schedule, cost, quality, risk, and resources — the competing demands", "Only the client's requirements", "Government regulations"], a: 1, exp: "The constraint model includes scope, time, cost, quality, risk, and resources — all must be balanced." }
          ]
        },
        { title: "1.2 Project Lifecycle & Process Groups", description: "Navigate the 5 process groups: Initiating, Planning, Executing, Monitoring & Controlling, and Closing.", order_index: 1,
          mainPoints: ["The 5 Process Groups are not phases — they overlap throughout the project.", "Initiating: authorize the project and identify stakeholders.", "Planning: define scope, schedule, cost, quality, risk, and communication plans.", "Executing: coordinate people and resources to implement the plan.", "Monitoring & Controlling: track performance and implement changes."],
          questions: [
            { q: "How many PMI Process Groups are there?", opts: ["3", "4", "5", "6"], a: 2, exp: "The 5 Process Groups are: Initiating, Planning, Executing, Monitoring & Controlling, and Closing." },
            { q: "When does Monitoring & Controlling occur?", opts: ["Only at project end", "Only during execution", "Throughout the entire project lifecycle", "Only during planning"], a: 2, exp: "M&C is continuous — the PM tracks performance against the plan from initiation through closing." },
            { q: "What is the main output of the Initiating process group?", opts: ["Project schedule", "Project Charter and stakeholder register", "Risk register", "Budget baseline"], a: 1, exp: "Initiating produces the Project Charter (authorizing the project) and identifies key stakeholders." },
            { q: "Which process group consumes the most resources?", opts: ["Initiating", "Planning", "Executing", "Closing"], a: 2, exp: "Executing is where the actual work happens — team members, vendors, and resources are fully engaged." },
            { q: "What happens during project Closing?", opts: ["Nothing — the project just ends", "Formal acceptance, lessons learned, archive documents, release resources", "Start the next project", "Final risk assessment only"], a: 1, exp: "Closing includes formal acceptance from the client, documenting lessons learned, and administrative closure." }
          ]
        },
        { title: "1.3 Organizational Structures & PM Authority", description: "Functional, matrix, and projectized organizations and how structure affects PM authority.", order_index: 2,
          mainPoints: ["Functional organizations: PM has little authority; resources report to functional managers.", "Projectized organizations: PM has high authority; team is dedicated to the project.", "Matrix organizations: shared authority between PM and functional managers.", "Weak matrix favors functional managers; strong matrix favors PMs.", "Understanding your org structure determines your influencing strategy."],
          questions: [
            { q: "In a functional organization, who controls project resources?", opts: ["The Project Manager", "Functional managers control resources, PM has limited authority", "The PMO", "The client"], a: 1, exp: "In functional orgs, team members report to their functional managers. The PM must negotiate for resources." },
            { q: "Where does a PM have the MOST authority?", opts: ["Functional organization", "Weak matrix", "Projectized organization", "Program office"], a: 2, exp: "In projectized orgs, team members are dedicated to the project and the PM has full authority." },
            { q: "What defines a balanced matrix organization?", opts: ["PM and functional manager share authority roughly equally", "Only the PM has authority", "The client controls resources", "No defined authority"], a: 0, exp: "In a balanced matrix, authority is shared between the PM and functional managers — creating both collaboration and conflict." },
            { q: "Why does organizational structure matter to a PM?", opts: ["It determines salary", "It defines PM authority, resource access, and influencing strategy", "It only affects large projects", "It doesn't matter if you have a good plan"], a: 1, exp: "Org structure directly impacts how much authority a PM has and how they must navigate to get resources and decisions." },
            { q: "What is a PMO?", opts: ["Project Money Office", "A department that standardizes PM practices and supports project governance", "A type of project", "A risk management tool"], a: 1, exp: "A PMO (Project Management Office) governs PM standards, provides templates, coaches PMs, and may control project portfolios." }
          ]
        },
        { title: "1.4 The Project Charter & Business Case", description: "Create a project charter, understand business cases, and formally authorize projects.", order_index: 3,
          mainPoints: ["The Project Charter formally authorizes the project and the PM.", "It includes: purpose, objectives, high-level scope, milestones, budget, and sponsor.", "The Business Case justifies the investment — ROI, payback period, NPV.", "No charter = no authorization. Never start work without one.", "The sponsor signs the charter — not the PM."],
          questions: [
            { q: "Who authorizes the Project Charter?", opts: ["The Project Manager", "The project team", "The project sponsor or senior management", "The client only"], a: 2, exp: "The project sponsor or a senior manager signs the charter, formally authorizing the project and the PM's role." },
            { q: "What is the primary purpose of a Project Charter?", opts: ["Detail every task", "Formally authorize the project and give the PM authority to use resources", "Replace the project plan", "Describe technical architecture"], a: 1, exp: "The charter is the PM's authorization document. Without it, the PM has no formal authority." },
            { q: "What does a Business Case evaluate?", opts: ["Team skills only", "The financial and strategic justification for the project investment", "Technical requirements", "Project schedule only"], a: 1, exp: "A business case includes ROI, NPV, payback period, and strategic alignment to justify the investment." },
            { q: "When should a Project Charter be created?", opts: ["After planning is complete", "During the Initiating process group, before planning begins", "During execution", "After the first milestone"], a: 1, exp: "The charter is the first formal document. Planning cannot begin until the project is authorized." },
            { q: "What is NOT typically in a Project Charter?", opts: ["Project objectives", "Detailed work breakdown structure", "High-level budget", "Project sponsor name"], a: 1, exp: "The WBS is a planning document. The charter contains high-level information — detailed planning comes after authorization." }
          ]
        },
        { title: "1.5 Stakeholder Identification & Register", description: "Identify all stakeholders, assess their influence and interest, and build your stakeholder register.", order_index: 4,
          mainPoints: ["Stakeholders are anyone affected by or who can affect the project.", "Identify stakeholders early — missed stakeholders create late requirements.", "The Stakeholder Register captures: name, role, interest, influence, expectations.", "Use a Power/Interest grid to prioritize engagement strategies.", "Negative stakeholders can derail projects — identify and manage them proactively."],
          questions: [
            { q: "Who is a stakeholder?", opts: ["Only the client", "Anyone affected by or who can affect the project outcomes", "Only internal team members", "Only people who fund the project"], a: 1, exp: "Stakeholders include clients, sponsors, team members, regulators, competitors — anyone with a stake in the outcome." },
            { q: "What tool helps prioritize stakeholder engagement?", opts: ["Gantt chart", "Power/Interest grid — mapping influence vs. level of interest", "Risk matrix", "Cost baseline"], a: 1, exp: "The Power/Interest grid categorizes stakeholders: high power/high interest (manage closely), low power/low interest (monitor)." },
            { q: "When should stakeholder identification occur?", opts: ["After planning", "As early as possible — during Initiating", "Only at project kickoff meeting", "When issues arise"], a: 1, exp: "Early identification prevents late scope changes. Missed stakeholders discovered late are expensive to accommodate." },
            { q: "What does the Stakeholder Register contain?", opts: ["Only names and emails", "Name, role, interest level, influence level, expectations, and engagement strategy", "Budget allocations", "Risk ratings only"], a: 1, exp: "The register is a living document capturing everything you need to manage each stakeholder effectively." },
            { q: "How should you handle a high-power stakeholder who opposes your project?", opts: ["Ignore them", "Engage them directly to understand concerns and find common ground", "Escalate immediately to sponsor", "Remove them from communications"], a: 1, exp: "High-power opponents can kill projects. Proactive engagement to understand and address their concerns is essential." }
          ]
        }
      ]
    },
    {
      title: "Module 2: Scope Management",
      description: "Define, document, and control project scope. Prevent scope creep and manage change requests effectively.",
      order_index: 1,
      lessons: [
        { title: "2.1 Collecting Requirements", description: "Techniques for gathering, documenting, and prioritizing stakeholder requirements.", order_index: 0,
          mainPoints: ["Requirements define what the project must deliver to satisfy stakeholders.", "Techniques: interviews, focus groups, surveys, prototyping, benchmarking.", "Requirements must be documented, traceable, and testable.", "A Requirements Traceability Matrix links requirements to deliverables.", "Poor requirements are the #1 cause of project failure."],
          questions: [
            { q: "What is the #1 cause of project failure?", opts: ["Budget overruns", "Poor or incomplete requirements", "Team conflicts", "Technology failures"], a: 1, exp: "Studies consistently show that unclear, incomplete, or misunderstood requirements are the leading cause of project failure." },
            { q: "What is a Requirements Traceability Matrix?", opts: ["A project schedule", "A document linking each requirement to its source and deliverable", "A risk log", "A budget tracker"], a: 1, exp: "The RTM ensures every requirement is addressed and can be traced from origin through testing and delivery." },
            { q: "Which requirements collection technique is best for complex systems?", opts: ["Survey only", "Prototyping — showing stakeholders working models to elicit feedback", "Asking the sponsor", "Reading last year's project"], a: 1, exp: "Prototyping helps stakeholders articulate requirements they couldn't describe in the abstract." },
            { q: "Requirements must be:", opts: ["Vague and flexible", "Documented, traceable, unambiguous, and testable", "Only verbal agreements", "Set by the PM alone"], a: 1, exp: "Good requirements are SMART: Specific, Measurable, Achievable, Relevant, and Testable." },
            { q: "Who is responsible for approving requirements?", opts: ["The PM alone", "Key stakeholders and the project sponsor", "The development team", "External auditors"], a: 1, exp: "Requirements must be formally approved by stakeholders who will accept the final deliverable." }
          ]
        },
        { title: "2.2 Defining Scope & Work Breakdown Structure", description: "Write a scope statement and decompose deliverables into a WBS.", order_index: 1,
          mainPoints: ["The Scope Statement defines what IS and IS NOT included in the project.", "The WBS decomposes the project into manageable work packages.", "100% Rule: the WBS must capture 100% of the work — nothing more, nothing less.", "WBS Dictionary defines each work package in detail.", "The lowest level of the WBS is the work package — assignable and estimable."],
          questions: [
            { q: "What is the 100% Rule of the WBS?", opts: ["Work must take 100 hours", "The WBS must capture 100% of project scope — no more, no less", "All tasks must be 100% complete before moving on", "The PM must approve 100% of work"], a: 1, exp: "The 100% Rule ensures the WBS is complete — every deliverable is included and nothing outside scope is added." },
            { q: "What is the lowest level of the WBS?", opts: ["Project", "Phase", "Work package", "Activity"], a: 2, exp: "Work packages are the lowest WBS level — small enough to assign, estimate, and track." },
            { q: "What should a Scope Statement include?", opts: ["Team bios", "Product scope, project deliverables, acceptance criteria, and exclusions", "Detailed task list", "Risk register"], a: 1, exp: "A good scope statement defines what's in scope, what's out, key deliverables, and how acceptance will be determined." },
            { q: "What is scope creep?", opts: ["Finishing early", "Unauthorized additions to project scope without corresponding changes to time/cost", "Reducing project scope", "Changing the project sponsor"], a: 1, exp: "Scope creep erodes budget and schedule. All scope changes must go through formal change control." },
            { q: "What document defines each WBS work package in detail?", opts: ["Project Charter", "WBS Dictionary", "Risk Register", "RACI Matrix"], a: 1, exp: "The WBS Dictionary provides details for each work package: description, owner, duration, cost, and acceptance criteria." }
          ]
        },
        { title: "2.3 Scope Validation & Control", description: "Obtain formal acceptance of deliverables and manage scope change requests.", order_index: 2,
          mainPoints: ["Scope Validation = formal acceptance of completed deliverables by the client.", "Scope Control = managing changes to the approved scope baseline.", "Change requests must be evaluated for impact on time, cost, quality, and risk.", "The Change Control Board (CCB) reviews and approves/rejects changes.", "Approved changes update the scope baseline — not verbal agreements."],
          questions: [
            { q: "What is the difference between scope validation and quality control?", opts: ["No difference", "Quality control checks correctness; scope validation confirms client acceptance of deliverables", "Scope validation is done first", "Quality control is done by clients"], a: 1, exp: "QC verifies the deliverable meets quality standards. Scope validation is the client formally accepting the deliverable." },
            { q: "A stakeholder requests a new feature mid-project. What should you do?", opts: ["Add it immediately", "Submit a change request and evaluate impact on scope, schedule, cost, and risk", "Refuse all changes", "Add it to the next project"], a: 1, exp: "All scope changes go through formal change control — assess impact, get approval, update baselines." },
            { q: "Who approves significant scope changes?", opts: ["The PM alone", "The Change Control Board (CCB)", "The development team", "Any senior manager"], a: 1, exp: "The CCB (which may include the PM, sponsor, and other stakeholders) evaluates and approves changes." },
            { q: "What happens after a change request is approved?", opts: ["Nothing changes formally", "Project baselines (scope, schedule, cost) are updated to reflect the approved change", "The original plan stays unchanged", "The PM informs the team verbally"], a: 1, exp: "Approved changes must be reflected in updated baselines. This maintains integrity of project tracking." },
            { q: "Scope creep is best prevented by:", opts: ["Refusing all stakeholder requests", "A robust change control process and clear scope statement from the start", "Frequent team meetings", "Detailed technical specifications only"], a: 1, exp: "Clear scope definition up front + rigorous change control = the most effective defense against scope creep." }
          ]
        },
        { title: "2.4 Agile Scope Management & Product Backlog", description: "Manage evolving scope in Agile projects through backlog refinement and sprint planning.", order_index: 3,
          mainPoints: ["Agile embraces changing requirements — scope evolves through iteration.", "The Product Backlog is the single source of truth for all work.", "User stories capture requirements from the user's perspective.", "Backlog refinement keeps the backlog prioritized and ready for sprints.", "In Agile, the scope baseline is the sprint — fixed for the sprint duration."],
          questions: [
            { q: "How does Agile handle changing requirements?", opts: ["Rejects all changes after kickoff", "Embraces change — the backlog is continuously refined and reprioritized", "Uses formal CCB for every change", "Freezes scope after sprint 1"], a: 1, exp: "Agile's core principle is responding to change over following a plan. The backlog evolves throughout the project." },
            { q: "Who owns the Product Backlog?", opts: ["Scrum Master", "Product Owner", "Development Team", "Project Sponsor"], a: 1, exp: "The Product Owner owns and prioritizes the backlog, ensuring it reflects stakeholder value." },
            { q: "What is a user story?", opts: ["A technical specification", "A requirement written as: As a [user], I want [goal], so that [benefit]", "A project status report", "A test case"], a: 1, exp: "User stories keep focus on user value: As a [role], I want [feature], so that [benefit]." },
            { q: "What is backlog refinement?", opts: ["Deleting old stories", "Ongoing process of reviewing, estimating, and prioritizing backlog items", "Sprint review meeting", "Final project review"], a: 1, exp: "Refinement keeps the backlog healthy — stories are detailed, estimated, and prioritized before sprint planning." },
            { q: "What is fixed during a sprint in Scrum?", opts: ["The entire project scope", "The sprint scope — selected backlog items committed for that sprint", "The budget", "The team composition"], a: 1, exp: "Sprint scope is fixed for the sprint duration. Changes wait for the next sprint (with exceptions for critical issues)." }
          ]
        },
        { title: "2.5 AI Tools for Scope Management", description: "Use AI to write requirements, build WBS structures, and detect scope creep signals.", order_index: 4,
          mainPoints: ["AI can generate first-draft requirements from high-level descriptions.", "ChatGPT and Claude excel at structuring WBS from project briefs.", "AI can analyze change request logs to identify scope creep patterns.", "Use AI to check requirements for ambiguity and testability.", "AI-assisted scope analysis saves 40-60% of documentation time."],
          questions: [
            { q: "How can AI help with requirements gathering?", opts: ["AI replaces stakeholder interviews", "AI generates first-draft requirements from descriptions, which PMs refine with stakeholders", "AI approves requirements automatically", "AI only formats documents"], a: 1, exp: "AI accelerates requirements drafting. The PM still validates with stakeholders — AI provides the starting structure." },
            { q: "What AI tool best helps structure a WBS?", opts: ["Image generators", "ChatGPT or Claude — describe the project and ask for a hierarchical WBS", "Spreadsheet macros", "Grammar checkers"], a: 1, exp: "LLMs are excellent at decomposing projects hierarchically. Give them the project description and ask for a WBS." },
            { q: "How can AI detect scope creep?", opts: ["It can't", "Analyze change request logs and meeting notes to identify unauthorized additions", "By monitoring social media", "By reading the WBS only"], a: 1, exp: "AI can analyze patterns in change logs, emails, and meeting notes to flag potential scope creep before it escalates." },
            { q: "What should a PM do with AI-generated requirements?", opts: ["Use them without review", "Review and validate with stakeholders before incorporating", "Delete them", "Submit directly to development"], a: 1, exp: "AI provides a starting point. PM must validate requirements with actual stakeholders who will accept the deliverable." },
            { q: "What is the time savings potential of AI-assisted scope documentation?", opts: ["5-10%", "15-20%", "40-60%", "No savings — AI creates more work"], a: 2, exp: "Studies show AI-assisted documentation reduces drafting time by 40-60%, freeing PMs for higher-value activities." }
          ]
        }
      ]
    },
    {
      title: "Module 3: Schedule Management",
      description: "Build realistic project schedules using critical path, agile planning, and AI-powered estimation.",
      order_index: 2,
      lessons: [
        { title: "3.1 Activity Definition & Sequencing", description: "Decompose work packages into activities, identify dependencies, and sequence work.", order_index: 0,
          mainPoints: ["Activities are the lowest level of schedule planning — derived from work packages.", "Dependency types: Finish-to-Start (FS), Start-to-Start (SS), Finish-to-Finish (FF), Start-to-Finish (SF).", "FS is most common: Task B cannot start until Task A finishes.", "Leads and lags modify dependencies: lead = overlap, lag = delay.", "The network diagram shows all activities and their dependencies."],
          questions: [
            { q: "What is the most common dependency type?", opts: ["Start-to-Finish", "Finish-to-Start — B cannot start until A finishes", "Start-to-Start", "Finish-to-Finish"], a: 1, exp: "FS is the most common: you must finish one task before starting the next (e.g., design before development)." },
            { q: "What is a 'lag' in scheduling?", opts: ["A delay between activities — waiting period before successor can start", "Starting two tasks simultaneously", "A task that runs over budget", "A missing dependency"], a: 0, exp: "A lag adds waiting time between activities (e.g., waiting 3 days after pouring concrete before adding framing)." },
            { q: "What is a 'lead' in scheduling?", opts: ["An overlap — successor starts before predecessor finishes", "A task delay", "The first activity in a project", "The critical path task"], a: 0, exp: "A lead allows overlap — the successor starts before the predecessor is fully complete, compressing the schedule." },
            { q: "What does a network diagram show?", opts: ["Budget breakdown", "All project activities, their sequence, and dependencies", "Team org chart", "Risk probability"], a: 1, exp: "The network diagram (Activity-on-Node) maps all activities and their logical relationships." },
            { q: "Activities are derived from:", opts: ["The project charter", "Work packages in the WBS", "The risk register", "Stakeholder interviews"], a: 1, exp: "WBS decomposition produces work packages; further decomposition produces activities — the schedulable units." }
          ]
        },
        { title: "3.2 Critical Path Method (CPM)", description: "Calculate the critical path, float, and schedule compression techniques.", order_index: 1,
          mainPoints: ["The Critical Path is the longest path through the network — it determines project duration.", "Float (slack) is the amount of delay a task can absorb without delaying the project.", "Critical path tasks have ZERO float — any delay extends the project end date.", "Schedule compression: Crashing (add resources) or Fast-tracking (overlap tasks).", "Near-critical paths are almost as risky as the critical path."],
          questions: [
            { q: "What is the critical path?", opts: ["The most expensive sequence of tasks", "The longest path through the network that determines total project duration", "The path with the most risks", "The PM's favorite sequence"], a: 1, exp: "The critical path is the longest duration path. Any delay on a critical path task directly extends the project end date." },
            { q: "What is float (slack)?", opts: ["Extra budget", "The amount of time a task can be delayed without delaying the project finish", "A schedule buffer at project end", "Time added for risk"], a: 1, exp: "Float is scheduling flexibility. Tasks on the critical path have zero float — they cannot be delayed without consequence." },
            { q: "What is 'crashing' a schedule?", opts: ["Removing tasks from scope", "Adding resources to critical path tasks to shorten duration (increases cost)", "Overlapping tasks", "Cancelling the project"], a: 1, exp: "Crashing adds resources (people, equipment) to shorten task duration. It compresses the schedule but increases cost." },
            { q: "What is 'fast tracking'?", opts: ["Working faster", "Performing tasks in parallel that were originally sequential (increases risk)", "Hiring faster workers", "Removing milestones"], a: 1, exp: "Fast tracking overlaps activities. It compresses schedule without adding cost but increases risk of rework." },
            { q: "A critical path task is delayed by 3 days. What happens?", opts: ["Nothing — it has float", "The project end date moves out by 3 days", "The PM absorbs it with contingency", "Float is used"], a: 1, exp: "Critical path tasks have zero float. A 3-day delay on any critical path task adds 3 days to the project end date." }
          ]
        },
        { title: "3.3 Resource Estimation & Schedule Baseline", description: "Estimate activity durations, assign resources, and establish the schedule baseline.", order_index: 2,
          mainPoints: ["Estimation techniques: Expert Judgment, Analogous, Parametric, Three-Point (PERT).", "PERT formula: (O + 4M + P) / 6 — weighted average favoring most likely.", "Resource leveling smooths resource peaks but may extend the schedule.", "The schedule baseline is the approved schedule — actual performance is measured against it.", "Rolling wave planning: detail near-term work, plan future work at high level."],
          questions: [
            { q: "What is the PERT estimation formula?", opts: ["(O + M + P) / 3", "(O + 4M + P) / 6 — weighted average", "Best case + worst case / 2", "(O + P) / 2"], a: 1, exp: "PERT uses Optimistic (O), Most Likely (M), and Pessimistic (P) estimates. The formula gives a weighted average." },
            { q: "What is resource leveling?", opts: ["Paying everyone equally", "Adjusting the schedule to resolve resource conflicts — may extend duration", "Adding more team members", "Reducing project scope"], a: 1, exp: "Resource leveling eliminates over-allocation by delaying tasks. It creates a realistic schedule but may extend the end date." },
            { q: "What is the schedule baseline?", opts: ["The initial rough estimate", "The approved schedule — the standard against which actual performance is measured", "The best-case schedule", "The team's preferred schedule"], a: 1, exp: "The baseline is frozen after approval. Variances are measured against it to assess schedule performance." },
            { q: "What is analogous estimating?", opts: ["Using expert opinion", "Using actual data from similar past projects as a basis for estimation", "Mathematical formulas only", "Team consensus"], a: 1, exp: "Analogous estimating uses historical data from similar projects. It's quick but less accurate than parametric or bottom-up." },
            { q: "What is rolling wave planning?", opts: ["Planning everything upfront in detail", "Detailed planning for near-term work, high-level for future work — refined as the project progresses", "Replanning every sprint", "A risk planning technique"], a: 1, exp: "Rolling wave acknowledges uncertainty about the future. Detail emerges over time as the project progresses." }
          ]
        },
        { title: "3.4 Schedule Monitoring & Earned Value", description: "Track schedule performance using Earned Value Management (EVM) metrics.", order_index: 3,
          mainPoints: ["EVM integrates scope, schedule, and cost to measure project performance.", "Key metrics: PV (Planned Value), EV (Earned Value), AC (Actual Cost).", "Schedule Variance (SV) = EV - PV. Negative = behind schedule.", "Schedule Performance Index (SPI) = EV / PV. Below 1.0 = behind schedule.", "EAC (Estimate at Completion) forecasts final project cost based on current performance."],
          questions: [
            { q: "What does SPI < 1.0 mean?", opts: ["Ahead of schedule", "Behind schedule — earning less value than planned", "On budget", "Project is cancelled"], a: 1, exp: "SPI = EV/PV. Less than 1.0 means you're earning less value than planned — the project is behind schedule." },
            { q: "What is Earned Value (EV)?", opts: ["Money spent so far", "The budgeted value of work actually completed", "The planned budget at this point", "The forecasted final cost"], a: 1, exp: "EV is the budget for the work you've actually completed — what you've 'earned' based on work done." },
            { q: "Schedule Variance (SV) formula is:", opts: ["PV - EV", "EV - PV (positive = ahead, negative = behind)", "AC - PV", "EV - AC"], a: 1, exp: "SV = EV - PV. Positive means ahead of schedule; negative means behind schedule." },
            { q: "What is the benefit of EVM over traditional reporting?", opts: ["It's simpler", "It integrates scope, schedule, and cost into objective performance metrics", "It's required by PMI only", "It replaces the schedule"], a: 1, exp: "Traditional reporting tells you money spent. EVM tells you what you got for that money relative to plan." },
            { q: "Planned Value (PV) represents:", opts: ["Actual spending to date", "The budgeted value of work scheduled to be completed by a point in time", "Final project budget", "Team capacity"], a: 1, exp: "PV is the baseline — what work was supposed to be done and what it was budgeted to cost by now." }
          ]
        },
        { title: "3.5 AI-Powered Scheduling & Forecasting", description: "Use AI tools to build schedules, detect delays, and forecast project completion.", order_index: 4,
          mainPoints: ["AI can generate initial schedule drafts from project scope documents.", "Tools like Microsoft Project Copilot suggest task sequences and resource assignments.", "AI can analyze historical velocity to forecast completion dates.", "Natural language scheduling: describe your project and get a structured timeline.", "AI anomaly detection flags tasks at risk of delay before they become issues."],
          questions: [
            { q: "How can AI assist in schedule creation?", opts: ["AI creates perfect schedules with no PM input", "AI generates draft schedules from scope documents that PMs refine", "AI only tracks schedules, not creates them", "AI replaces the critical path method"], a: 1, exp: "AI dramatically accelerates schedule drafting. The PM still validates, refines, and takes ownership of the schedule." },
            { q: "What is 'natural language scheduling'?", opts: ["Scheduling meetings verbally", "Describing your project in plain language to an AI tool that generates a structured timeline", "Using simple Gantt charts", "Informal scheduling without tools"], a: 1, exp: "Modern AI tools accept plain language descriptions and produce structured schedules with tasks, dependencies, and durations." },
            { q: "How can AI improve schedule forecasting?", opts: ["It can't improve traditional methods", "Analyzing historical velocity and task patterns to predict completion dates with higher accuracy", "By adding buffer time automatically", "By removing critical path tasks"], a: 1, exp: "AI learns from historical project data to improve forecasting accuracy beyond simple extrapolation." },
            { q: "What is AI anomaly detection in scheduling?", opts: ["Detecting software bugs", "Flagging tasks at risk of delay based on current performance patterns before they become issues", "Checking grammar in reports", "Finding duplicate tasks"], a: 1, exp: "AI can identify early warning signs — unusual patterns in task completion rates that signal upcoming delays." },
            { q: "What should a PM do with AI-generated schedule forecasts?", opts: ["Accept them as final", "Use as input for decision-making, validate assumptions, and apply professional judgment", "Share directly with clients", "Override them always"], a: 1, exp: "AI forecasts are decision-support tools. PMs apply context, stakeholder knowledge, and judgment before acting." }
          ]
        }
      ]
    },
    {
      title: "Module 4: Cost Management & Financial Planning",
      description: "Estimate costs, build budgets, control spending, and demonstrate financial value to stakeholders.",
      order_index: 3,
      lessons: [
        { title: "4.1 Cost Estimation Techniques", description: "Apply expert judgment, analogous, parametric, and bottom-up estimation methods.", order_index: 0,
          mainPoints: ["Bottom-up estimating: most accurate — estimate each work package individually.", "Parametric estimating: use statistical models (cost per unit × quantity).", "Analogous estimating: use historical data from similar projects.", "Three-point (PERT): (O + 4M + P) / 6 for cost uncertainty.", "Contingency reserve covers known-unknowns; management reserve covers unknown-unknowns."],
          questions: [
            { q: "Which estimation technique is most accurate?", opts: ["Analogous", "Expert judgment only", "Bottom-up — estimating each work package individually", "Rough order of magnitude"], a: 2, exp: "Bottom-up builds cost from detailed work packages. More time-consuming but most accurate." },
            { q: "What is contingency reserve for?", opts: ["Unknown-unknowns", "Known risks — identifiable uncertainties that may occur", "Team bonuses", "Scope changes"], a: 1, exp: "Contingency reserve covers known-unknowns (identified risks). Management reserve covers unknown-unknowns." },
            { q: "What is parametric estimating?", opts: ["Asking the team", "Using statistical relationships (cost per unit) to calculate estimates", "Copying last year's budget", "Expert opinion only"], a: 1, exp: "Parametric uses measured relationships: if one unit costs $50 and you need 100 units, cost = $5,000." },
            { q: "What is Rough Order of Magnitude (ROM)?", opts: ["A very accurate estimate", "A high-level estimate (-25% to +75%) used early when little information is available", "The final approved budget", "A risk estimate"], a: 1, exp: "ROM is used in early project stages. As more information becomes available, estimates become more accurate." },
            { q: "Management reserve covers:", opts: ["Known risks", "Unknown-unknowns — unforeseeable events", "Team overtime", "Vendor price increases"], a: 1, exp: "Management reserve is held by senior management for truly unforeseen events. The PM cannot access it without approval." }
          ]
        },
        { title: "4.2 Budget Development & Cost Baseline", description: "Aggregate estimates into a project budget and establish the cost baseline.", order_index: 1,
          mainPoints: ["The cost baseline = sum of all work package estimates + contingency reserves.", "Cost baseline is an S-curve showing planned expenditure over time.", "Budget at Completion (BAC) = the total approved budget for the project.", "The project budget = cost baseline + management reserve.", "Cost baseline changes only through approved change requests."],
          questions: [
            { q: "What is the Budget at Completion (BAC)?", opts: ["Final actual cost", "Total approved budget for the entire project", "Budget minus contingency", "Monthly spend rate"], a: 1, exp: "BAC is the total planned budget. It's the baseline against which EVM compares actual performance." },
            { q: "What shape does the cost baseline typically form?", opts: ["A flat line", "An S-curve — slow start, steep middle, tapering at the end", "A bell curve", "A straight diagonal line"], a: 1, exp: "The S-curve reflects slow initial spending, peak during execution, and tapering as the project closes." },
            { q: "What is the difference between cost baseline and project budget?", opts: ["They're the same", "Project budget = cost baseline + management reserve", "Cost baseline includes profit", "Budget is set by the sponsor only"], a: 1, exp: "The cost baseline includes contingency reserves. Add management reserve and you have the full project budget." },
            { q: "How can the cost baseline be changed?", opts: ["The PM can change it anytime", "Only through approved change requests going through change control", "At any monthly review", "The sponsor changes it verbally"], a: 1, exp: "The baseline is the measurement standard. Unauthorized changes destroy the ability to measure performance." },
            { q: "Contingency reserve is:", opts: ["Added to management reserve", "Part of the cost baseline, controlled by the PM for known risks", "Not included in any budget", "Added only at project end"], a: 1, exp: "Contingency reserve is part of the cost baseline and is managed by the PM to address identified risks." }
          ]
        },
        { title: "4.3 Cost Control & Earned Value Management", description: "Monitor spending, calculate CPI and CV, and forecast final project costs.", order_index: 2,
          mainPoints: ["Cost Variance (CV) = EV - AC. Negative = over budget.", "Cost Performance Index (CPI) = EV / AC. Below 1.0 = over budget.", "EAC (Estimate at Completion) = BAC / CPI — forecast if current efficiency continues.", "ETC (Estimate to Complete) = EAC - AC — how much more will it cost?", "TCPI (To Complete Performance Index) = efficiency needed to finish within BAC."],
          questions: [
            { q: "What does CPI < 1.0 indicate?", opts: ["Ahead of budget", "Over budget — spending more than the value earned", "Behind schedule", "Project is on track"], a: 1, exp: "CPI = EV/AC. Less than 1.0 means you're spending more than you're earning — over budget." },
            { q: "Cost Variance (CV) formula is:", opts: ["AC - EV", "EV - AC (positive = under budget, negative = over budget)", "PV - EV", "BAC - AC"], a: 1, exp: "CV = EV - AC. Positive means under budget; negative means over budget." },
            { q: "What is EAC?", opts: ["Estimated actual cost at the start", "Estimate at Completion — forecasted total cost based on current performance", "Earned actual cost", "Exact actual cost"], a: 1, exp: "EAC = BAC/CPI forecasts the final project cost if current spending efficiency continues." },
            { q: "TCPI measures:", opts: ["Time to complete", "The cost efficiency needed to complete remaining work within the approved budget", "Team productivity", "Technical complexity"], a: 1, exp: "TCPI > 1.0 means you need to be more efficient than you've been. TCPI < 1.0 means you have room to spend more." },
            { q: "A project has CPI = 0.8 and SPI = 0.9. What does this mean?", opts: ["On time and on budget", "Over budget AND behind schedule — requiring immediate management attention", "Under budget and ahead of schedule", "Normal variation — no action needed"], a: 1, exp: "CPI < 1 = over budget. SPI < 1 = behind schedule. Both together signals a project in trouble." }
          ]
        },
        { title: "4.4 Financial Justification & ROI", description: "Calculate NPV, ROI, payback period, and IRR to justify project investments.", order_index: 3,
          mainPoints: ["ROI = (Net Benefits / Cost) × 100. Shows return as a percentage.", "NPV (Net Present Value) discounts future cash flows to today's value.", "Payback Period = time to recover the initial investment.", "IRR (Internal Rate of Return) = discount rate that makes NPV = 0.", "Higher NPV = more valuable. Choose projects with positive NPV."],
          questions: [
            { q: "What does positive NPV indicate?", opts: ["The project will lose money", "The project generates more value than it costs, in today's dollars", "The project breaks even", "The project has no risk"], a: 1, exp: "Positive NPV means the present value of benefits exceeds costs. Organizations should pursue positive NPV projects." },
            { q: "ROI formula is:", opts: ["Cost / Revenue", "(Net Benefits / Total Cost) × 100", "Profit + Cost", "Revenue - Expenses"], a: 1, exp: "ROI measures return as a percentage of investment. 20% ROI means every $1 invested returns $1.20." },
            { q: "What is the Payback Period?", opts: ["Project duration", "Time required to recover the initial project investment from net benefits", "Budget period", "Time between milestones"], a: 1, exp: "Shorter payback period = faster return on investment. Organizations often set maximum acceptable payback thresholds." },
            { q: "When comparing two projects, which should you prefer (all else equal)?", opts: ["Lower NPV", "Higher NPV — more value delivered per dollar invested", "Longer payback period", "Higher cost"], a: 1, exp: "Higher NPV means greater value creation. Portfolio managers prioritize high-NPV projects within budget constraints." },
            { q: "What does IRR represent?", opts: ["The actual project return", "The discount rate at which NPV equals zero — project break-even rate", "Interest rate on loans", "Inflation rate"], a: 1, exp: "IRR is the rate at which a project breaks even. If IRR > cost of capital, the project creates value." }
          ]
        },
        { title: "4.5 AI for Cost Management & Budget Forecasting", description: "Leverage AI tools for cost estimation, variance analysis, and budget forecasting.", order_index: 4,
          mainPoints: ["AI can analyze historical project data to generate cost estimates.", "Predictive analytics flags cost overruns weeks before they appear in reports.", "AI dashboards automate EVM calculations and visualize SPI/CPI trends.", "ChatGPT can generate budget justification narratives from raw numbers.", "AI-powered vendor comparison tools optimize procurement decisions."],
          questions: [
            { q: "How can AI improve cost estimation accuracy?", opts: ["By guessing", "Analyzing patterns in historical project data to generate more accurate estimates", "Replacing human estimators entirely", "Only for large projects"], a: 1, exp: "AI learns from historical data across hundreds of projects to identify patterns humans miss in estimation." },
            { q: "What is predictive analytics in cost management?", opts: ["Reporting what already happened", "Using AI to identify leading indicators of cost overruns before they appear in actuals", "Making up forecasts", "Monthly budget reviews"], a: 1, exp: "Predictive analytics analyzes patterns to forecast cost issues weeks before they show in financial reports." },
            { q: "How can AI help with budget justification?", opts: ["AI replaces the PM in finance meetings", "Generate compelling narratives from EVM data using ChatGPT or Claude", "Automatically approve budget requests", "Only for executive presentations"], a: 1, exp: "LLMs excel at translating numbers into compelling narrative. Give AI your EVM data and get stakeholder-ready summaries." },
            { q: "What should a PM verify when using AI cost forecasts?", opts: ["Nothing — AI is always accurate", "Assumptions used, data quality, and whether the model accounts for project-specific context", "Only the final number", "The AI tool's brand"], a: 1, exp: "AI forecasts are based on patterns and assumptions. PMs must validate assumptions and apply project-specific knowledge." },
            { q: "AI-powered dashboards can automate:", opts: ["Project decisions", "EVM calculations, variance reporting, and trend visualization", "Team performance reviews", "Contract negotiations"], a: 1, exp: "Modern PM AI dashboards automatically calculate SPI, CPI, EAC, and visualize trends — saving hours of manual work." }
          ]
        }
      ]
    },
    {
      title: "Module 5: Risk Management",
      description: "Identify, analyze, and respond to project risks using qualitative and quantitative techniques.",
      order_index: 4,
      lessons: [
        { title: "5.1 Risk Identification & Risk Register", description: "Identify project risks systematically and document them in a risk register.", order_index: 0,
          mainPoints: ["Risk = an uncertain event that, if it occurs, has a positive or negative effect.", "Positive risks are opportunities; negative risks are threats.", "Identification techniques: Brainstorming, Delphi, SWOT, Checklist, Interviews.", "The Risk Register captures: description, category, probability, impact, owner, response.", "Risk identification is continuous — new risks emerge throughout the project."],
          questions: [
            { q: "What is a project risk?", opts: ["A problem that has already occurred", "An uncertain future event that may positively or negatively affect project objectives", "Any task that could be late", "A stakeholder concern"], a: 1, exp: "Risk is uncertainty with potential impact. Issues are risks that have already occurred. Issues are managed differently." },
            { q: "Can risks be positive?", opts: ["No — risks are always bad", "Yes — opportunities are positive risks that should be exploited", "Only in Agile projects", "Only financial risks are positive"], a: 1, exp: "PMI defines risk as either threat (negative) or opportunity (positive). PMs should exploit positive risks." },
            { q: "What does a Risk Register capture?", opts: ["Only risk descriptions", "Risk description, probability, impact, owner, response strategy, and status", "Budget information", "Team assignments"], a: 1, exp: "The Risk Register is the comprehensive risk database. Each risk has an owner and a planned response." },
            { q: "The Delphi technique for risk identification involves:", opts: ["Group brainstorming in a room", "Anonymous expert consensus — rounds of questionnaires until agreement emerges", "One expert making all decisions", "Computer simulation"], a: 1, exp: "Delphi uses anonymous rounds of expert input, preventing groupthink and generating unbiased risk identification." },
            { q: "When should risk identification stop?", opts: ["After planning", "Never — risk identification is continuous throughout the project", "After the first sprint", "When the risk register is full"], a: 1, exp: "New risks emerge as projects evolve. Risk identification must continue through project closure." }
          ]
        },
        { title: "5.2 Qualitative & Quantitative Risk Analysis", description: "Prioritize risks using probability-impact matrices and Monte Carlo simulation.", order_index: 1,
          mainPoints: ["Qualitative analysis: assess probability and impact (High/Medium/Low) to prioritize risks.", "Probability-Impact matrix produces a risk score for each risk.", "Quantitative analysis: assign numerical values — Monte Carlo simulation, decision trees.", "Monte Carlo runs thousands of simulations to produce a probability distribution of outcomes.", "Focus qualitative efforts on high-probability, high-impact risks."],
          questions: [
            { q: "What is qualitative risk analysis?", opts: ["Using numbers and formulas", "Assessing probability and impact using scales (High/Medium/Low) to prioritize risks", "Running computer simulations", "Interviewing only experts"], a: 1, exp: "Qualitative analysis is fast and practical — it prioritizes risks without requiring precise numerical data." },
            { q: "What does Monte Carlo simulation do?", opts: ["Predicts stock prices", "Runs thousands of project simulations using probability distributions to forecast outcomes", "Creates Gantt charts", "Estimates team productivity"], a: 1, exp: "Monte Carlo creates a distribution of possible outcomes by randomly sampling from risk probability distributions thousands of times." },
            { q: "Risk Score in a P-I matrix = ", opts: ["Probability + Impact", "Probability × Impact", "Impact - Probability", "Impact / Probability"], a: 1, exp: "Risk Score = Probability × Impact. A 40% probability with High impact scores higher than 80% probability with Low impact." },
            { q: "Which risks require immediate response planning?", opts: ["All risks equally", "High probability, high impact risks — they threaten project objectives most", "Low probability risks only", "Only risks identified by the sponsor"], a: 1, exp: "Focus resources on risks with the highest combined probability and impact — they represent the greatest threat." },
            { q: "What is a decision tree used for in risk management?", opts: ["Organizing the team hierarchy", "Analyzing decisions under uncertainty by calculating expected monetary value of options", "Creating the WBS", "Scheduling dependencies"], a: 1, exp: "Decision trees calculate Expected Monetary Value (EMV) for different choices, helping PMs select the best response." }
          ]
        },
        { title: "5.3 Risk Response Strategies", description: "Apply Avoid, Transfer, Mitigate, Accept, Exploit, Share, and Enhance strategies.", order_index: 2,
          mainPoints: ["For threats: Avoid, Transfer, Mitigate, Accept.", "For opportunities: Exploit, Share, Enhance, Accept.", "Avoid: eliminate the risk by changing the plan.", "Transfer: shift risk impact to a third party (insurance, contracts).", "Mitigate: reduce probability or impact to acceptable levels."],
          questions: [
            { q: "What is risk mitigation?", opts: ["Ignoring the risk", "Reducing the probability or impact of a threat to acceptable levels", "Transferring risk to a vendor", "Eliminating the risk entirely"], a: 1, exp: "Mitigation takes action to reduce likelihood or impact — adding testing to reduce defect risk, for example." },
            { q: "What is risk transference?", opts: ["Moving a risk to the risk register", "Shifting the financial impact of a risk to a third party through insurance or contracts", "The PM taking personal responsibility", "Transferring work to another team"], a: 1, exp: "Insurance, fixed-price contracts, and warranties are all risk transference tools — the third party absorbs the loss if the risk occurs." },
            { q: "What is 'Exploit' as a risk response?", opts: ["A threat response", "A positive risk response — ensuring the opportunity definitely occurs", "Accepting the risk passively", "Transferring an opportunity"], a: 1, exp: "Exploit is for opportunities: take action to ensure the positive risk definitely occurs (e.g., assign your best person to capture the opportunity)." },
            { q: "When should a PM accept a risk?", opts: ["Never — all risks need a response", "When the cost of response exceeds the risk impact, or when it cannot be addressed otherwise", "Only for low-budget projects", "When the risk register is full"], a: 1, exp: "Active acceptance sets a contingency reserve. Passive acceptance simply acknowledges the risk and monitors it." },
            { q: "What is a residual risk?", opts: ["A risk that has occurred", "The remaining risk after a response strategy has been implemented", "A new risk identified late", "An opportunity risk"], a: 1, exp: "No response eliminates all risk. Residual risks are what remains after mitigation — they still need monitoring." }
          ]
        },
        { title: "5.4 Risk Monitoring & Control", description: "Track risks throughout the project, implement responses, and identify new risks.", order_index: 3,
          mainPoints: ["Risk reviews should be scheduled regularly — weekly or at major milestones.", "Risk triggers are early warning signs that a risk is about to occur.", "Workarounds are unplanned responses to risks that were not identified or accepted.", "Risk reassessment updates probability and impact as the project progresses.", "Lessons learned capture effective risk responses for future projects."],
          questions: [
            { q: "What is a risk trigger?", opts: ["A task that starts a risk response", "An early warning sign indicating a risk is about to occur", "The risk occurring", "A risk response plan"], a: 1, exp: "Triggers allow proactive response. If trigger X appears, implement response Y before the risk fully materializes." },
            { q: "What is a workaround?", opts: ["A planned risk response", "An unplanned response to a risk that has occurred — improvised problem solving", "A schedule shortcut", "A change request"], a: 1, exp: "Workarounds are reactive — the risk occurred without a planned response. Document them as lessons learned." },
            { q: "How often should risk reviews occur?", opts: ["Only at project start", "Regularly throughout the project — weekly or at milestones", "Only when problems occur", "Once per quarter"], a: 1, exp: "Regular risk reviews catch changes in probability/impact and identify new risks before they become issues." },
            { q: "What should a PM do when a risk's probability increases significantly?", opts: ["Update the risk register and escalate if needed — may trigger response plan changes", "Ignore minor changes", "Close the risk", "Add it to lessons learned"], a: 0, exp: "Significant changes in risk profile may require response strategy changes, budget adjustments, or escalation to the sponsor." },
            { q: "Risk lessons learned should be captured:", opts: ["Only for failed projects", "Throughout the project and formally during closing — to improve future risk management", "Only by the PMO", "Only for risks that occurred"], a: 1, exp: "Lessons learned improve organizational risk management capability. Both threats and opportunities provide valuable insights." }
          ]
        },
        { title: "5.5 AI for Risk Management", description: "Use AI to identify risks from project data, predict issues, and automate risk reporting.", order_index: 4,
          mainPoints: ["AI can scan project documents, emails, and meeting notes to identify risk signals.", "Predictive analytics identifies patterns that precede common project risks.", "NLP tools analyze stakeholder communications for sentiment and concern signals.", "AI risk scoring models provide more objective probability/impact assessments.", "Automated risk reporting saves 3-5 hours per week on risk documentation."],
          questions: [
            { q: "How can AI improve risk identification?", opts: ["By replacing the PM", "Scanning communications, documents, and historical data to surface risk signals humans miss", "By creating risks automatically", "Only through surveys"], a: 1, exp: "AI processes large volumes of unstructured data (emails, meeting notes) to identify risk patterns at scale." },
            { q: "What is NLP in risk management?", opts: ["New Project Launch", "Natural Language Processing — analyzing text communications for risk signals and stakeholder sentiment", "Network Level Protocol", "Non-Linear Planning"], a: 1, exp: "NLP can analyze emails and messages to detect early warning signs: stakeholder frustration, scope uncertainty, technical concerns." },
            { q: "AI predictive analytics in risk management:", opts: ["Replaces qualitative analysis", "Identifies leading indicators of common project risks before they fully materialize", "Only works for IT projects", "Requires massive data sets"], a: 1, exp: "AI learns from thousands of project patterns to identify the early signals of budget overruns, schedule slips, and quality issues." },
            { q: "What is the time savings from AI-automated risk reporting?", opts: ["30 minutes per week", "3-5 hours per week — a significant reduction in documentation burden", "No time savings", "10+ hours per week"], a: 1, exp: "Manual risk reporting is time-consuming. AI automation of status updates, register maintenance, and report generation saves 3-5 hours weekly." },
            { q: "How should AI risk scores be used?", opts: ["Accepted as final without review", "As input for human judgment — AI scores inform but don't replace PM risk assessment", "Shared directly with stakeholders", "Overridden always"], a: 1, exp: "AI provides data-driven risk scoring. PMs apply context, political awareness, and stakeholder knowledge to finalize risk prioritization." }
          ]
        }
      ]
    },
    {
      title: "Module 6: Stakeholder & Communication Management",
      description: "Build stakeholder engagement plans, manage expectations, and communicate effectively across all levels.",
      order_index: 5,
      lessons: [
        { title: "6.1 Stakeholder Engagement Strategies", description: "Assess stakeholder engagement levels and develop targeted engagement plans.", order_index: 0,
          mainPoints: ["Engagement levels: Unaware, Resistant, Neutral, Supportive, Leading.", "Gap analysis: compare current vs. desired engagement level for each stakeholder.", "Engagement plan defines communication approach, frequency, and channels per stakeholder.", "Resistant stakeholders need direct, personal engagement — not mass communications.", "Sponsor engagement is critical for resolving escalations and removing blockers."],
          questions: [
            { q: "What are the 5 stakeholder engagement levels?", opts: ["Low, Medium, High, Very High, Extreme", "Unaware, Resistant, Neutral, Supportive, Leading", "Bronze, Silver, Gold, Platinum, Diamond", "Observer, Participant, Advocate, Champion, Owner"], a: 1, exp: "PMI's 5 engagement levels help PMs assess current state and target desired state for each stakeholder." },
            { q: "A key stakeholder is 'Resistant'. What should you do?", opts: ["Exclude them from communications", "Engage directly — understand their concerns and find common ground", "Report to sponsor immediately", "Reduce their involvement"], a: 1, exp: "Resistant stakeholders can derail projects. Direct engagement to understand and address concerns is essential." },
            { q: "What is a stakeholder engagement gap?", opts: ["Missing stakeholders", "The difference between current and desired engagement levels requiring targeted action", "Communication delays", "Budget gaps caused by stakeholders"], a: 1, exp: "Closing the gap requires deliberate engagement activities targeted at moving the stakeholder to the desired level." },
            { q: "Why is sponsor engagement critical?", opts: ["Sponsors approve invoices", "Sponsors resolve escalations, provide air cover, and champion the project at executive level", "Sponsors write status reports", "Sponsors manage the team daily"], a: 1, exp: "An engaged sponsor is your most powerful asset for removing organizational blockers and securing resources." },
            { q: "What should drive your communication approach for each stakeholder?", opts: ["The same standard approach for everyone", "Their preferred communication style, information needs, and engagement level", "The PM's preference", "What's easiest to prepare"], a: 1, exp: "Tailored communication is more effective. Executives want summaries; technical teams want details; resistant stakeholders need dialogue." }
          ]
        },
        { title: "6.2 Communication Planning & Management", description: "Build a communication management plan and manage information distribution effectively.", order_index: 1,
          mainPoints: ["Communication Management Plan defines: who needs what information, when, in what format, through which channel.", "Push communication: email, reports — sent to recipients without request.", "Pull communication: portals, repositories — recipients access when needed.", "Interactive communication: meetings, calls — real-time two-way exchange.", "Effective communication = 55% body language, 38% tone, 7% words (Mehrabian)."],
          questions: [
            { q: "What does a Communication Management Plan define?", opts: ["Meeting agendas only", "Who needs what information, when, in what format, and through which channel", "Only status report templates", "Budget communication costs"], a: 1, exp: "The CMP ensures the right people get the right information at the right time — preventing both information overload and gaps." },
            { q: "What is 'push' communication?", opts: ["Forcing stakeholders to attend meetings", "Proactively sending information to recipients — emails, reports, memos", "Emergency escalations", "Social media updates"], a: 1, exp: "Push communication distributes information without the recipient requesting it. Best for scheduled status updates." },
            { q: "What is interactive communication?", opts: ["Email threads", "Real-time two-way exchange — meetings, calls, video conferences", "Project portals", "One-way announcements"], a: 1, exp: "Interactive communication enables immediate feedback and dialogue. Best for complex issues requiring discussion." },
            { q: "According to communication research, words account for what percentage of message impact?", opts: ["55%", "38%", "7% — tone and body language carry far more weight", "50%"], a: 2, exp: "Mehrabian's research: 7% words, 38% tone/voice, 55% body language. PMs must manage all three dimensions." },
            { q: "When is a project status report insufficient?", opts: ["Never — written reports always work", "For complex issues, conflicts, or sensitive topics — these require interactive communication", "For simple updates", "For technical teams"], a: 1, exp: "Written reports work for routine updates. Complex issues, conflicts, and sensitive topics require face-to-face or voice dialogue." }
          ]
        },
        { title: "6.3 Conflict Management & Negotiation", description: "Resolve conflicts constructively and negotiate effectively with stakeholders and vendors.", order_index: 2,
          mainPoints: ["Conflict is inevitable in projects — the PM's job is to resolve it constructively.", "Thomas-Kilmann conflict modes: Competing, Collaborating, Compromising, Avoiding, Accommodating.", "Collaborating (Win-Win) is the preferred approach for most project conflicts.", "Negotiations: understand interests (not just positions) to find mutually beneficial solutions.", "Principled negotiation: separate people from the problem, focus on interests."],
          questions: [
            { q: "What is the preferred conflict resolution approach for project conflicts?", opts: ["Avoiding — let conflicts resolve themselves", "Competing — the PM always wins", "Collaborating (Win-Win) — address underlying interests of all parties", "Accommodating — always give in"], a: 2, exp: "Collaborating produces sustainable resolutions by addressing everyone's interests. Forcing creates resentment; avoiding creates escalation." },
            { q: "What is the difference between positions and interests in negotiation?", opts: ["No difference", "Position is what someone says they want; interests are the underlying needs driving that position", "Interests are financial; positions are personal", "Positions change; interests are fixed"], a: 1, exp: "Focusing on interests (why they want something) opens more solutions than arguing over positions (what they say they want)." },
            { q: "When is 'Avoiding' an appropriate conflict strategy?", opts: ["Always", "For trivial issues or when emotions are too high — buy time to cool down", "Never", "Only with vendors"], a: 1, exp: "Avoiding can be appropriate for low-stakes issues or to allow tempers to cool before engaging substantively." },
            { q: "What is BATNA in negotiation?", opts: ["Budget And Time Negotiation Approach", "Best Alternative To a Negotiated Agreement — your fallback if negotiations fail", "A vendor contract type", "A risk response"], a: 1, exp: "Knowing your BATNA gives negotiating power. If the deal is worse than your best alternative, walk away." },
            { q: "How should a PM handle a conflict between two team members?", opts: ["Ignore it and hope it resolves", "Address it directly and promptly, facilitating a collaborative resolution", "Take sides with the more experienced member", "Escalate to HR immediately"], a: 1, exp: "Unresolved team conflicts reduce productivity and morale. Early, direct intervention prevents escalation." }
          ]
        },
        { title: "6.4 Virtual Team Management", description: "Lead geographically distributed teams across time zones, cultures, and communication platforms.", order_index: 3,
          mainPoints: ["Virtual teams require more structured communication than co-located teams.", "Establish team norms: response times, meeting etiquette, communication channels.", "Cultural intelligence (CQ) is essential for global teams.", "Asynchronous collaboration tools: Confluence, Notion, Loom, shared dashboards.", "Trust-building is harder virtually — intentional team-building activities are essential."],
          questions: [
            { q: "What is the biggest challenge in managing virtual teams?", opts: ["Time zones only", "Building trust and maintaining alignment without face-to-face interaction", "Too many communication tools", "Language barriers only"], a: 1, exp: "Trust is harder to build virtually. PMs must be intentional about relationship-building, not just task management." },
            { q: "What are team norms in a virtual context?", opts: ["Office dress codes", "Agreed-upon rules for communication: response times, meeting behavior, tool usage", "Technical standards only", "Hiring criteria"], a: 1, exp: "Team norms prevent misunderstandings caused by different expectations. Establish them at project kickoff." },
            { q: "What is asynchronous collaboration?", opts: ["Real-time video calls", "Work and communication that doesn't require everyone online simultaneously — docs, recorded videos, shared tools", "Same time zone requirements", "Traditional email only"], a: 1, exp: "Async tools (Confluence, Loom, Notion) enable global teams to contribute on their schedule while maintaining alignment." },
            { q: "What is Cultural Intelligence (CQ)?", opts: ["Speaking multiple languages", "The ability to function effectively across different cultural contexts — critical for global PMs", "Knowledge of international laws", "Cultural sensitivity training completion"], a: 1, exp: "High-CQ PMs adapt their communication and management style to cultural contexts, reducing friction in global teams." },
            { q: "How can a PM build trust in a virtual team?", opts: ["Mandatory overtime", "Regular check-ins, celebrating wins, informal virtual gatherings, and keeping commitments", "Tracking hours closely", "Avoiding personal conversations"], a: 1, exp: "Trust is built through reliability, transparency, recognition, and genuine human connection — all possible virtually with intention." }
          ]
        },
        { title: "6.5 AI for Stakeholder & Communication Management", description: "Use AI to personalize communications, analyze stakeholder sentiment, and automate reporting.", order_index: 4,
          mainPoints: ["AI can draft personalized stakeholder communications based on their profile and preferences.", "Sentiment analysis tools monitor stakeholder communications for early warning signals.", "AI meeting assistants transcribe, summarize, and extract action items automatically.", "ChatGPT/Claude can transform raw data into executive-ready narratives in minutes.", "AI translation enables seamless communication with global stakeholders."],
          questions: [
            { q: "How can AI personalize stakeholder communications?", opts: ["It can't personalize", "Generate tailored messages based on stakeholder profile, role, interests, and engagement level", "Send the same message to everyone automatically", "Replace the PM in all communications"], a: 1, exp: "LLMs can generate stakeholder-specific communication considering their technical level, concerns, and preferred format." },
            { q: "What is sentiment analysis in stakeholder management?", opts: ["Analyzing financial sentiment", "AI analyzing text communications to detect emotions, concerns, and engagement shifts", "A survey technique", "A conflict resolution method"], a: 1, exp: "Sentiment analysis monitors emails and messages to detect early signs of stakeholder dissatisfaction or disengagement." },
            { q: "How do AI meeting assistants help PMs?", opts: ["They run the meetings", "Automatically transcribe meetings, summarize key points, and extract action items", "They schedule meetings only", "They replace status reports"], a: 1, exp: "Tools like Otter.ai, Fireflies, and Microsoft Copilot capture everything said and produce structured summaries with action items." },
            { q: "How can AI help with executive reporting?", opts: ["AI writes the entire report without PM input", "Transform raw EVM data and project metrics into clear executive narratives using ChatGPT/Claude", "AI cannot assist with executive communications", "Only for formal reports"], a: 1, exp: "Executives need clear narratives, not data dumps. AI can translate complex project data into concise, compelling stories." },
            { q: "AI translation tools enable:", opts: ["Perfect translation in all contexts", "Near-real-time communication with global stakeholders in their native language, reducing misunderstandings", "Eliminating the need for cultural awareness", "Legal contracts in any language"], a: 1, exp: "AI translation dramatically reduces language barriers in global projects — though cultural context still requires human awareness." }
          ]
        }
      ]
    },
    {
      title: "Module 7: Quality Management",
      description: "Plan, assure, and control quality throughout the project lifecycle using modern quality frameworks.",
      order_index: 6,
      lessons: [
        { title: "7.1 Quality Planning & Standards", description: "Define quality standards, metrics, and the quality management plan.", order_index: 0,
          mainPoints: ["Quality must be planned in, not inspected in after the fact.", "Quality standards define what 'good' looks like for each deliverable.", "Key quality gurus: Deming (continuous improvement), Juran (fitness for use), Crosby (zero defects).", "Cost of Quality: Prevention + Appraisal + Failure (internal + external).", "Quality Management Plan defines: standards, responsibilities, tools, and verification methods."],
          questions: [
            { q: "What does 'quality must be planned in' mean?", opts: ["Quality inspections at the end are sufficient", "Quality activities must be built into the project plan from the start, not added after problems emerge", "Only developers manage quality", "Quality is automatic"], a: 1, exp: "Inspecting quality after the fact is expensive and late. Building quality into processes from the start prevents defects." },
            { q: "What is Deming's key contribution to quality management?", opts: ["Zero defects policy", "PDCA (Plan-Do-Check-Act) cycle and continuous improvement", "Statistical sampling", "Customer satisfaction surveys"], a: 1, exp: "Deming's PDCA cycle is foundational: Plan improvements, Do them, Check results, Act to standardize or adjust." },
            { q: "What is the Cost of Quality (CoQ)?", opts: ["The cost of the quality team", "Total cost of all quality activities: Prevention + Appraisal + Internal Failure + External Failure", "Cost of quality software tools", "Cost of customer complaints"], a: 1, exp: "CoQ framework shows that investing in prevention and appraisal reduces the much higher costs of failure." },
            { q: "Which is most expensive in the Cost of Quality model?", opts: ["Prevention costs", "Appraisal costs", "External failure costs (defects reaching the customer)", "Training costs"], a: 2, exp: "External failures (customer complaints, returns, reputation damage) are far more expensive than prevention investments." },
            { q: "What does 'fitness for use' mean (Juran)?", opts: ["The product is technically correct", "The product meets the customer's actual needs and can be used as intended", "The product passes all tests", "The product is within budget"], a: 1, exp: "Juran's definition focuses on customer value: a product can be technically perfect but still not fit for its intended use." }
          ]
        },
        { title: "7.2 Quality Assurance & Process Improvement", description: "Audit processes, identify root causes of defects, and implement continuous improvement.", order_index: 1,
          mainPoints: ["Quality Assurance (QA) = auditing processes to ensure they're being followed correctly.", "Quality Control (QC) = inspecting deliverables to find and fix defects.", "Root cause analysis tools: Fishbone diagram (Ishikawa), 5 Whys, Pareto chart.", "Pareto Principle: 80% of problems come from 20% of causes.", "Continuous improvement frameworks: Kaizen, Six Sigma, TQM."],
          questions: [
            { q: "What is the difference between QA and QC?", opts: ["Same thing", "QA audits processes; QC inspects deliverables for defects", "QC is proactive; QA is reactive", "QA is for software only"], a: 1, exp: "QA is process-oriented (are we doing things right?). QC is product-oriented (did we produce the right thing?)." },
            { q: "What is a Fishbone (Ishikawa) diagram used for?", opts: ["Project scheduling", "Root cause analysis — visually mapping causes of a problem across categories", "Budget tracking", "Risk assessment"], a: 1, exp: "Fishbone diagrams map potential causes across categories (Methods, Materials, Machines, People, Environment, Measurement)." },
            { q: "What does the Pareto Principle state?", opts: ["All causes are equally important", "80% of problems stem from 20% of causes — focus on the vital few", "Problems should be fixed in order of discovery", "Equal resources to all problems"], a: 1, exp: "Focus on the 20% of causes producing 80% of problems. Pareto charts visualize this for data-driven prioritization." },
            { q: "What is the 5 Whys technique?", opts: ["Five quality standards", "Iteratively asking 'Why?' five times to drill down to the root cause of a problem", "A risk assessment framework", "Five steps to quality improvement"], a: 1, exp: "5 Whys moves from symptom to root cause. 'Why did the server fail?' → 'Why was the patch missed?' → etc." },
            { q: "What is Kaizen?", opts: ["Japanese word for quality control", "A philosophy of continuous, incremental improvement involving all team members", "A certification program", "A quality inspection method"], a: 1, exp: "Kaizen (Japanese for 'improvement') drives ongoing small improvements by everyone, every day — foundational to Toyota's success." }
          ]
        },
        { title: "7.3 Quality Control Tools & Metrics", description: "Apply control charts, acceptance sampling, and quality metrics to monitor deliverable quality.", order_index: 2,
          mainPoints: ["Control charts monitor process stability — UCL, LCL, and mean.", "Rule of Seven: 7 consecutive points on one side of the mean signal a process out of control.", "Acceptance sampling: inspect a sample to decide whether to accept/reject a batch.", "Defect density, defect escape rate, and first-time quality are key quality metrics.", "Quality metrics must be defined in the Quality Management Plan before measuring."],
          questions: [
            { q: "What does a control chart monitor?", opts: ["Budget spending", "Process stability over time — detecting when a process goes out of statistical control", "Team velocity", "Risk probability"], a: 1, exp: "Control charts show whether variation is natural (within control limits) or special cause (requiring investigation)." },
            { q: "What is the 'Rule of Seven' in control charts?", opts: ["7 defects are acceptable", "7 consecutive data points on one side of the mean signal a non-random pattern requiring investigation", "Inspect 7 samples minimum", "7-step quality process"], a: 1, exp: "Even if all points are within control limits, 7 in a row on one side suggests a systematic shift requiring investigation." },
            { q: "What is acceptance sampling?", opts: ["Inspecting 100% of items", "Inspecting a statistical sample to determine whether to accept or reject a batch", "Customer acceptance of deliverables", "Sponsor sign-off process"], a: 1, exp: "When 100% inspection is impractical, acceptance sampling uses statistics to make accept/reject decisions based on sample data." },
            { q: "What is defect escape rate?", opts: ["How fast defects are found", "Percentage of defects that reach the customer without being caught internally", "The rate at which defects are created", "Time to fix defects"], a: 1, exp: "Defect escape rate measures how effective internal quality controls are. Lower escape rate = better QA processes." },
            { q: "When should quality metrics be defined?", opts: ["After defects are found", "During quality planning — before work begins", "During project closing", "When the sponsor asks"], a: 1, exp: "Metrics defined after the fact are useless. Define what 'good' looks like before starting work so you can measure against it." }
          ]
        },
        { title: "7.4 Agile Quality Practices", description: "Apply TDD, Definition of Done, continuous integration, and retrospective-driven quality improvement.", order_index: 3,
          mainPoints: ["Definition of Done (DoD): team agreement on what 'complete' means for every deliverable.", "Test-Driven Development (TDD): write tests before code — ensures testability.", "Continuous Integration (CI): automated testing with every code commit.", "Sprint retrospectives are the primary quality improvement mechanism in Scrum.", "Technical debt: shortcuts taken now that cost more to fix later."],
          questions: [
            { q: "What is the Definition of Done (DoD)?", opts: ["The project end date", "Team agreement on all criteria that must be met for a deliverable to be considered complete", "The client's acceptance criteria only", "A done checklist for the PM"], a: 1, exp: "The DoD prevents 'almost done' syndrome. Work is either done (meets all criteria) or not done — no in-between." },
            { q: "What is Test-Driven Development (TDD)?", opts: ["Testing after development", "Writing tests before writing code — code must pass tests before it's considered done", "Manual testing only", "Testing done by QA team only"], a: 1, exp: "TDD ensures code is testable by design and prevents regression. Tests define expected behavior before implementation." },
            { q: "What is technical debt?", opts: ["Money spent on technology", "Shortcuts or poor-quality code taken now that create rework and maintenance costs later", "Technical training budget", "Server infrastructure costs"], a: 1, exp: "Technical debt is like financial debt — it accumulates interest. Unaddressed, it slows future development significantly." },
            { q: "How do sprint retrospectives improve quality?", opts: ["They don't affect quality", "Teams identify quality issues from the sprint and implement process improvements for the next sprint", "They review only schedule and cost", "Quality is addressed in sprint reviews only"], a: 1, exp: "Retrospectives are the Agile quality improvement engine — every sprint produces process improvements that reduce defects." },
            { q: "What is Continuous Integration (CI)?", opts: ["Daily team meetings", "Automated testing and building triggered by every code commit — immediately flagging quality issues", "Integration testing at project end", "Weekly code reviews"], a: 1, exp: "CI catches quality issues within minutes of code changes, preventing the accumulation of integration problems." }
          ]
        },
        { title: "7.5 AI for Quality Management", description: "Leverage AI for automated testing, defect prediction, and quality dashboard creation.", order_index: 4,
          mainPoints: ["AI-powered testing tools (Testim, Mabl) generate and maintain test cases automatically.", "Defect prediction models identify high-risk code areas before testing begins.", "AI code review tools (GitHub Copilot, CodeRabbit) flag quality issues in pull requests.", "NLP can analyze user feedback at scale to identify quality themes.", "AI quality dashboards aggregate metrics and surface trends automatically."],
          questions: [
            { q: "How can AI improve software testing?", opts: ["AI replaces all human testers", "AI tools generate, execute, and maintain test cases automatically, increasing coverage", "AI only creates test reports", "AI testing works only for simple applications"], a: 1, exp: "AI testing tools dramatically increase test coverage and reduce maintenance burden as the application evolves." },
            { q: "What is defect prediction in AI quality management?", opts: ["Predicting how many bugs users will report", "AI models identifying code areas most likely to contain defects before testing begins", "Automatic defect fixing", "AI writing bug reports"], a: 1, exp: "Defect prediction uses code metrics and historical data to identify high-risk areas, focusing testing resources where they're needed most." },
            { q: "How can AI analyze user feedback for quality insights?", opts: ["By asking users directly", "NLP processing of app reviews, support tickets, and feedback at scale to identify quality themes", "Counting complaint emails", "Social media monitoring only"], a: 1, exp: "AI can process thousands of user feedback items to identify recurring quality issues that individual review would miss." },
            { q: "What are AI code review tools?", opts: ["Tools that write code", "Automated analysis tools that identify bugs, security issues, and quality problems in pull requests", "Tools that approve code changes", "Grammar checkers for code comments"], a: 1, exp: "Tools like GitHub Copilot and CodeRabbit provide instant code review feedback, catching issues before human reviewers even look." },
            { q: "AI quality dashboards provide:", opts: ["Just charts", "Automated aggregation of quality metrics, trend analysis, and early warning of quality degradation", "Manual data entry interfaces", "Only historical reports"], a: 1, exp: "AI dashboards go beyond static reporting — they identify trends, surface anomalies, and predict future quality issues." }
          ]
        }
      ]
    },
    {
      title: "Module 8: Procurement & Contract Management",
      description: "Plan and manage vendor procurement, contracts, and vendor performance throughout the project.",
      order_index: 7,
      lessons: [
        { title: "8.1 Procurement Planning", description: "Make-or-buy decisions, procurement strategy, and statement of work development.", order_index: 0,
          mainPoints: ["Make-or-buy analysis: compare total cost and strategic fit of building vs. buying.", "Procurement Management Plan defines approach, contract types, and evaluation criteria.", "Statement of Work (SOW) defines what the vendor must deliver in precise detail.", "Evaluation criteria for vendor selection: technical capability, price, experience, references.", "Independent cost estimates validate vendor proposals."],
          questions: [
            { q: "What is a make-or-buy analysis?", opts: ["Deciding whether to buy software", "Comparing total cost and strategic implications of building something internally vs. purchasing externally", "A budget decision only", "A risk assessment"], a: 1, exp: "Make-or-buy considers direct costs, hidden costs (management overhead), strategic capability, and risk." },
            { q: "What is a Statement of Work (SOW)?", opts: ["A vendor's proposal", "A document defining exactly what the vendor must deliver, including scope, timeline, and quality standards", "A contract only", "A project charter for vendors"], a: 1, exp: "The SOW is the foundation of the procurement contract. Vague SOWs lead to disputes and cost overruns." },
            { q: "What should evaluation criteria for vendor selection include?", opts: ["Price only", "Technical capability, price, experience, financial stability, and references", "Lowest bid wins always", "Only company size"], a: 1, exp: "Multi-criteria evaluation prevents selecting vendors based solely on price — which often results in quality and delivery issues." },
            { q: "What is an independent cost estimate?", opts: ["The PM's guess", "An internally developed cost estimate to validate vendor proposal prices are reasonable", "The sponsor's budget", "A vendor's self-assessment"], a: 1, exp: "Independent estimates catch proposals that are too high (overpriced) or too low (indicating unrealistic scope understanding)." },
            { q: "When is outsourcing preferred over internal delivery?", opts: ["Always outsource everything", "When the vendor has specialized expertise, capacity, or cost advantages the org cannot match", "Only for large projects", "When the team is unavailable"], a: 1, exp: "Outsource what vendors do better, faster, or cheaper. Keep core competencies and strategic capabilities internal." }
          ]
        },
        { title: "8.2 Contract Types & Risk Allocation", description: "Understand Fixed Price, Cost Reimbursable, and Time & Materials contracts and when to use each.", order_index: 1,
          mainPoints: ["Fixed Price (FP): vendor bears cost risk. Best when scope is well-defined.", "Cost Reimbursable (CR): buyer bears cost risk. Best for unclear or evolving scope.", "Time & Materials (T&M): shared risk. Best for staff augmentation or unclear duration.", "FPIF (Fixed Price Incentive Fee): adds performance incentives to fixed price.", "CPFF (Cost Plus Fixed Fee): buyer pays costs + fixed fee regardless of outcome."],
          questions: [
            { q: "When is a Fixed Price contract most appropriate?", opts: ["When scope is completely unknown", "When scope is well-defined and stable — vendor can accurately price the work", "For all government contracts", "When timeline is flexible"], a: 1, exp: "Fixed Price works when scope is clear. Unclear scope in FP contracts leads to vendor claims and disputes." },
            { q: "Who bears the cost risk in a Cost Reimbursable contract?", opts: ["The vendor bears all risk", "The buyer pays all costs — buyer bears the risk of cost overruns", "Risk is equally shared", "The PM bears personal risk"], a: 1, exp: "In CR contracts, the buyer pays whatever it costs. The vendor has little incentive for cost efficiency." },
            { q: "When is Time & Materials most appropriate?", opts: ["For all procurement", "For staff augmentation or work with unclear scope and duration", "Only for IT projects", "When Fixed Price isn't possible"], a: 1, exp: "T&M pays for actual time and materials. Appropriate when you don't know exactly what you need or how long it will take." },
            { q: "What is an FPIF contract?", opts: ["Fixed Price Initial Fee", "Fixed Price Incentive Fee — base fixed price plus performance incentives if targets are met", "A type of insurance", "Foreign Project Investment Fund"], a: 1, exp: "FPIF motivates vendor performance by rewarding target achievement. Both parties share cost savings above target." },
            { q: "What is the highest risk contract type for the buyer?", opts: ["Fixed Price", "Cost Plus Percentage of Cost (CPPC) — buyer pays all costs plus a % of costs as fee", "Time and Materials", "Fixed Price with incentives"], a: 1, exp: "CPPC is the riskiest for buyers — the vendor actually profits more when costs increase, eliminating cost control incentive." }
          ]
        },
        { title: "8.3 Vendor Selection & Negotiation", description: "Conduct bid evaluation, shortlisting, and contract negotiations with vendors.", order_index: 2,
          mainPoints: ["RFP (Request for Proposal): request for complete solutions including technical approach and price.", "RFQ (Request for Quotation): request for price on defined specifications.", "RFI (Request for Information): market research to understand what's available.", "Source selection criteria and weighting must be defined before evaluating proposals.", "Negotiation goal: fair, mutually beneficial contract — not the lowest price."],
          questions: [
            { q: "What is the difference between RFP and RFQ?", opts: ["Same document, different names", "RFP requests complete solutions with technical approach; RFQ requests price for defined specs", "RFQ is for larger projects", "RFP is only for IT"], a: 1, exp: "RFP seeks creative solutions from vendors. RFQ is used when specs are defined and you just need competitive pricing." },
            { q: "When should selection criteria be defined?", opts: ["After receiving proposals", "Before issuing the solicitation — prevents bias in evaluation", "During contract negotiation", "After selecting the preferred vendor"], a: 1, exp: "Pre-defined criteria ensure objective evaluation. Changing criteria after seeing proposals creates conflict of interest." },
            { q: "What is the goal of contract negotiation?", opts: ["Get the lowest price at any cost", "A fair, mutually beneficial agreement that motivates vendor performance", "Win against the vendor", "Finish negotiations quickly"], a: 1, exp: "Win-lose negotiations create resentful vendors who deliver minimum compliance. Fair agreements create partnership motivation." },
            { q: "What is an RFI used for?", opts: ["Requesting final prices", "Market research — gathering information about what vendors offer before creating formal requirements", "A contract type", "A change request process"], a: 1, exp: "RFIs help buyers understand the market before writing requirements, preventing specs that are impossible or unnecessarily expensive." },
            { q: "What is a weighted scoring model in vendor evaluation?", opts: ["Selecting the cheapest vendor", "Assigning weights to evaluation criteria and scoring each vendor to produce an objective total score", "A contract pricing model", "A quality standard"], a: 1, exp: "Weighted scoring ensures criteria are applied consistently and prevents any single factor (like price) from dominating selection." }
          ]
        },
        { title: "8.4 Vendor Performance Management", description: "Monitor vendor delivery, manage contract changes, and close procurement contracts.", order_index: 3,
          mainPoints: ["Vendor scorecards track: delivery, quality, cost, responsiveness, and compliance.", "Contract administration manages changes, invoices, and disputes throughout the contract.", "Claims administration: formal process for handling vendor disputes and claims.", "Early termination clauses protect the buyer if vendor performance is unacceptable.", "Procurement closure: formal acceptance, final payment, and lessons learned."],
          questions: [
            { q: "What does a vendor scorecard measure?", opts: ["Vendor company size", "Delivery performance, quality, cost adherence, responsiveness, and compliance", "Price comparison with competitors", "Contract value only"], a: 1, exp: "Scorecards provide objective performance data for vendor reviews, renewal decisions, and performance improvement discussions." },
            { q: "What is contract administration?", opts: ["Signing contracts", "Ongoing management of the contract relationship: changes, invoices, compliance, and disputes", "Filing contract documents", "Initial vendor selection"], a: 1, exp: "Contract administration is active management throughout the relationship — ensuring both parties fulfill their obligations." },
            { q: "What is a claims administration process?", opts: ["Processing invoices", "Formal process for managing vendor disputes about contract interpretation or performance", "A type of insurance claim", "Quality control process"], a: 1, exp: "Claims arise when parties disagree about what the contract requires. Formal processes protect both parties' interests." },
            { q: "When can a buyer terminate a contract for convenience?", opts: ["Never — contracts are binding", "When the contract includes a termination for convenience clause — with appropriate compensation to the vendor", "Only if the vendor is in breach", "Only with court approval"], a: 1, exp: "Termination for convenience clauses allow buyers to end contracts when project needs change, with fair compensation for work completed." },
            { q: "What happens during procurement closure?", opts: ["Nothing formal", "Formal deliverable acceptance, final payment, performance documentation, and lessons learned", "Only final invoice payment", "Start of warranty period only"], a: 1, exp: "Proper closure protects both parties legally and captures lessons that improve future procurement processes." }
          ]
        },
        { title: "8.5 AI for Procurement Management", description: "Use AI for contract analysis, vendor evaluation, and spend analytics.", order_index: 4,
          mainPoints: ["AI contract analysis tools (Ironclad, Kira) extract key terms, risks, and obligations.", "Spend analytics AI identifies patterns, anomalies, and savings opportunities.", "AI vendor evaluation tools score proposals against criteria automatically.", "Predictive AI forecasts vendor delivery risk based on historical performance data.", "AI chatbots handle routine procurement inquiries, freeing procurement teams for strategic work."],
          questions: [
            { q: "How can AI assist with contract analysis?", opts: ["AI writes all contracts", "AI tools extract key terms, identify risks, and flag unusual clauses across large contract volumes", "AI only formats contracts", "AI approves contracts automatically"], a: 1, exp: "Contract AI dramatically reduces review time, catching risks and non-standard terms humans might miss in large document volumes." },
            { q: "What is spend analytics AI?", opts: ["Tracking team expenses", "AI analysis of procurement spend data to identify patterns, anomalies, and cost reduction opportunities", "Vendor invoicing software", "Budget forecasting only"], a: 1, exp: "Spend analytics uncovers maverick spending, consolidation opportunities, and vendor rationalization that reduces total procurement cost." },
            { q: "How can AI improve vendor evaluation?", opts: ["Replace human judgment", "Automatically score proposals against pre-defined criteria, reducing bias and evaluation time", "Select vendors automatically", "Only assess price"], a: 1, exp: "AI evaluation tools apply criteria consistently, reduce bias, and dramatically speed up proposal evaluation for large procurements." },
            { q: "What is predictive AI in vendor management?", opts: ["Predicting vendor bankruptcy", "Forecasting delivery risk based on vendor's historical performance patterns", "Selecting future vendors", "Predicting vendor pricing"], a: 1, exp: "AI learns from vendor performance history to predict delivery risk on current contracts, enabling proactive intervention." },
            { q: "AI procurement chatbots are most useful for:", opts: ["Negotiating contracts", "Handling routine inquiries (order status, policy questions) freeing procurement staff for complex work", "Approving purchase orders", "Writing SOWs"], a: 1, exp: "Chatbots handle high-volume routine interactions, enabling procurement professionals to focus on strategic supplier relationships." }
          ]
        }
      ]
    },
    {
      title: "Module 9: Agile & Hybrid Project Management",
      description: "Apply Agile frameworks, hybrid delivery models, and scaled Agile in complex organizational environments.",
      order_index: 8,
      lessons: [
        { title: "9.1 Agile Manifesto & Principles for PMs", description: "Understand the 12 Agile principles and how they change PM decision-making.", order_index: 0,
          mainPoints: ["4 Agile Values: Individuals over processes, Working software over documentation, Customer collaboration over negotiation, Responding to change over following a plan.", "The 12 principles guide how teams work — daily, not just philosophically.", "Agile shifts the PM role from command-and-control to servant leadership.", "Empirical process control: Transparency, Inspection, Adaptation.", "Agile is not chaos — it's disciplined flexibility guided by customer value."],
          questions: [
            { q: "What are the 4 Agile Manifesto values?", opts: ["Speed, Quality, Cost, Scope", "Individuals & interactions, Working software, Customer collaboration, Responding to change — over their counterparts", "Planning, Executing, Monitoring, Closing", "Sprints, Backlogs, Reviews, Retrospectives"], a: 1, exp: "The Manifesto doesn't dismiss processes, documentation, contracts, or plans — it values the left side MORE than the right." },
            { q: "How does Agile change the PM role?", opts: ["PM has more control in Agile", "PM shifts from command-and-control to servant leadership — enabling the team rather than directing", "PM is eliminated in Agile", "PM only manages budget in Agile"], a: 1, exp: "Agile PMs remove obstacles, protect the team, and enable collaboration — rather than assigning tasks and monitoring compliance." },
            { q: "What is empirical process control?", opts: ["Using historical data only", "Making decisions based on Transparency, Inspection, and Adaptation from actual experience", "A statistical quality method", "A type of contract"], a: 1, exp: "Scrum is built on empiricism: make what's happening visible, regularly inspect it, and adapt based on what you learn." },
            { q: "Which Agile principle addresses customer satisfaction?", opts: ["Working software is progress", "Early and continuous delivery of valuable software is the highest priority", "Sustainable pace matters most", "Technical excellence is critical"], a: 1, exp: "The first Agile principle: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.'" },
            { q: "Agile is best suited for projects with:", opts: ["Completely stable, well-defined requirements", "High uncertainty, evolving requirements, and need for rapid feedback and adaptation", "Fixed regulatory requirements", "Simple, repetitive deliverables"], a: 1, exp: "Agile thrives in complexity and uncertainty. Waterfall is better for stable, well-understood requirements." }
          ]
        },
        { title: "9.2 Scrum for Project Managers", description: "Master Scrum roles, events, and artifacts from the PM perspective.", order_index: 1,
          mainPoints: ["Scrum roles: Product Owner (what to build), Scrum Master (how to work), Developers (the building).", "Scrum events: Sprint, Sprint Planning, Daily Scrum, Sprint Review, Retrospective.", "Scrum artifacts: Product Backlog, Sprint Backlog, Increment.", "The PM in Scrum often fulfills aspects of multiple roles or transitions to Scrum Master.", "Velocity: average story points completed per sprint — used for forecasting."],
          questions: [
            { q: "What is the Product Owner responsible for?", opts: ["Team management", "Maximizing product value — owning and prioritizing the Product Backlog", "Facilitating ceremonies", "Writing code"], a: 1, exp: "The PO is the voice of the customer, responsible for ROI and backlog prioritization to maximize value delivery." },
            { q: "What is the purpose of the Sprint Review?", opts: ["Team performance evaluation", "Inspect the increment and gather stakeholder feedback to adapt the backlog", "Planning the next sprint", "Quality inspection"], a: 1, exp: "Sprint Review is a collaborative working session where stakeholders inspect the increment and the team updates the backlog accordingly." },
            { q: "What is velocity used for?", opts: ["Measuring developer productivity individually", "Forecasting how much work a team can complete in future sprints based on historical average", "Setting team goals", "Performance reviews"], a: 1, exp: "Velocity is a planning tool, not a performance metric. It helps forecast delivery dates and detect capacity changes." },
            { q: "How does a traditional PM transition into Scrum?", opts: ["Becomes redundant", "Often transitions to Scrum Master or Product Owner role, or manages multiple Scrum teams", "Takes on more control", "Only manages budget"], a: 1, exp: "Many organizations place PMs in SM or PO roles. Others have PMs oversee multiple Scrum teams from a program perspective." },
            { q: "What is the Sprint Backlog?", opts: ["All project requirements", "The set of Product Backlog items selected for the sprint plus the plan for delivering them", "The team's task list for the month", "The Product Owner's wish list"], a: 1, exp: "The Sprint Backlog belongs to the development team. It represents their commitment and plan for the sprint." }
          ]
        },
        { title: "9.3 Kanban & Lean for PMs", description: "Apply Kanban flow management and Lean waste elimination principles to project delivery.", order_index: 2,
          mainPoints: ["Kanban: visualize work, limit WIP, manage flow, make policies explicit.", "WIP limits prevent multitasking and reveal bottlenecks — the most powerful Kanban practice.", "Lead time: total time from request to delivery. Cycle time: time actively worked.", "Lean principles: eliminate waste, deliver fast, empower teams, optimize the whole.", "7 Lean wastes (TIMWOOD): Transportation, Inventory, Motion, Waiting, Overproduction, Over-processing, Defects."],
          questions: [
            { q: "What is the primary purpose of WIP limits in Kanban?", opts: ["Reduce team size", "Prevent multitasking, reveal bottlenecks, and improve flow efficiency", "Limit project scope", "Control budget"], a: 1, exp: "WIP limits are Kanban's most powerful feature. When WIP is limited, bottlenecks become visible and must be resolved." },
            { q: "What is the difference between lead time and cycle time?", opts: ["Same thing", "Lead time = request to delivery (includes waiting); cycle time = time actively worked on", "Lead time is longer always", "Cycle time includes customer wait"], a: 1, exp: "Lead time measures customer experience (how long they wait). Cycle time measures process efficiency (how long work takes once started)." },
            { q: "What does TIMWOOD stand for in Lean?", opts: ["7 Lean wastes: Transportation, Inventory, Motion, Waiting, Overproduction, Over-processing, Defects", "7 types of risk", "7 Scrum principles", "7 PM competencies"], a: 0, exp: "TIMWOOD gives PMs a lens to identify and eliminate waste in any process — manufacturing or knowledge work." },
            { q: "When is Kanban better than Scrum?", opts: ["Never", "For continuous flow work without defined sprints — support, maintenance, ongoing services", "Only for software projects", "When teams are large"], a: 1, exp: "Kanban suits continuous-flow environments where work arrives unpredictably. Scrum suits iterative product development." },
            { q: "What is 'optimizing the whole' in Lean?", opts: ["Improving each team member individually", "Optimizing the entire value stream, not just local team efficiency", "Reducing total headcount", "Maximizing individual output"], a: 1, exp: "Local optimization often hurts overall flow. Lean looks at end-to-end value delivery to find and fix the real bottlenecks." }
          ]
        },
        { title: "9.4 Hybrid Project Management", description: "Combine predictive and Agile approaches for projects that need both stability and flexibility.", order_index: 3,
          mainPoints: ["Hybrid combines Waterfall's structure with Agile's flexibility.", "Fixed scope/variable schedule (Agile) vs. Fixed schedule/variable scope (both apply in hybrid).", "Common hybrid: Waterfall phases with Agile iterations within each phase.", "PMI's PMBOK 7th edition explicitly supports hybrid approaches.", "Tailoring: adapt methodology to project context, not one-size-fits-all."],
          questions: [
            { q: "What is a hybrid project management approach?", opts: ["Using two project managers", "Combining predictive (Waterfall) and Agile methods based on project needs", "Running two projects simultaneously", "A compromised approach with no benefits"], a: 1, exp: "Hybrid uses the best of both: Waterfall for regulatory compliance and stable requirements; Agile for uncertain, evolving scope." },
            { q: "What is 'tailoring' in project management?", opts: ["Customizing team uniforms", "Adapting methodology, tools, and processes to fit the specific project context", "Modifying the project scope", "Adjusting team size"], a: 1, exp: "PMI's 7th edition emphasizes tailoring: no single method works for all projects. PMs adapt their approach to context." },
            { q: "In what situation is hybrid most valuable?", opts: ["When the team can't decide on a methodology", "Projects with regulatory/compliance requirements AND uncertain/evolving product features", "Simple projects", "When the sponsor demands Waterfall"], a: 1, exp: "Hybrid excels when you must meet contractual/regulatory milestones while delivering product features iteratively." },
            { q: "How does PMI's 7th edition differ from the 6th regarding hybrid?", opts: ["No difference", "7th edition explicitly supports hybrid, outcome-based thinking, and methodology tailoring", "7th edition mandates Waterfall only", "7th edition eliminates process groups"], a: 1, exp: "PMBOK 7th shifted from process-based to principles-based, explicitly validating hybrid and adaptive approaches." },
            { q: "What is a 'wagile' approach?", opts: ["A failed hybrid", "Waterfall phases with Agile sprints within each phase — common in enterprise environments", "A type of meeting", "An Agile certification"], a: 1, exp: "Wagile (Waterfall + Agile) uses phase-gate governance for compliance and oversight while using sprints for development flexibility." }
          ]
        },
        { title: "9.5 Scaled Agile for Large Programs", description: "Apply SAFe, LeSS, and Nexus frameworks to coordinate multiple Agile teams.", order_index: 4,
          mainPoints: ["SAFe (Scaled Agile Framework) coordinates multiple Agile teams through Agile Release Trains.", "PI Planning: Big Room Planning event aligning all teams for a Program Increment (8-12 weeks).", "LeSS (Large-Scale Scrum) scales Scrum to multiple teams with minimal additional roles.", "Nexus adds a Nexus Integration Team to coordinate 3-9 Scrum teams.", "The Program Manager / RTE (Release Train Engineer) role emerges in scaled environments."],
          questions: [
            { q: "What is an Agile Release Train (ART) in SAFe?", opts: ["A deployment pipeline", "A long-lived team of Agile teams aligned to a common mission and cadence", "A software release process", "A type of Kanban board"], a: 1, exp: "ARTs are the primary SAFe value delivery mechanism — 50-125 people organized into multiple Agile teams." },
            { q: "What is PI Planning?", opts: ["Project Initiation Planning", "SAFe's Big Room Planning event aligning all teams for the next Program Increment (8-12 weeks)", "Personal improvement planning", "Product increment planning for one team"], a: 1, exp: "PI Planning is SAFe's most important event: all ART members collaborate face-to-face to align on objectives and dependencies." },
            { q: "How does LeSS differ from SAFe?", opts: ["LeSS is more complex", "LeSS scales Scrum with minimal additional roles; SAFe adds more structure and roles", "SAFe is simpler than LeSS", "They're identical frameworks"], a: 1, exp: "LeSS keeps it simple — one Product Owner, one Product Backlog, multiple Scrum teams. SAFe adds more governance structure." },
            { q: "What is the Release Train Engineer (RTE) in SAFe?", opts: ["A software deployment role", "A servant leader who facilitates ART events, resolves impediments, and drives continuous improvement", "The ART's Product Owner", "A technical architect"], a: 1, exp: "The RTE is SAFe's Scrum Master for the ART — facilitating PI Planning, ART Sync, and System Demos." },
            { q: "When should an organization adopt a scaled Agile framework?", opts: ["For all projects", "When multiple Agile teams must coordinate to deliver a single product or program", "Only for software development", "When one Scrum team isn't enough people"], a: 1, exp: "Scaling frameworks add overhead. Apply them only when coordination between teams is genuinely complex and necessary." }
          ]
        }
      ]
    },
    {
      title: "Module 10: Leadership, Career Advancement & PM Certification",
      description: "Develop PM leadership skills, build your career strategy, and prepare for PMP and PMI-ACP certifications.",
      order_index: 9,
      lessons: [
        { title: "10.1 PM Leadership & Emotional Intelligence", description: "Apply situational leadership, emotional intelligence, and servant leadership in PM contexts.", order_index: 0,
          mainPoints: ["Emotional Intelligence (EQ): Self-awareness, Self-regulation, Empathy, Social skills, Motivation.", "Situational Leadership: adapt your style to team member development level.", "Servant leadership: the PM serves the team — removing obstacles and enabling success.", "Power types: Expert, Referent, Reward, Coercive, Formal/Legitimate.", "High EQ PMs build stronger teams, navigate conflict better, and deliver more consistently."],
          questions: [
            { q: "What are the 5 components of Emotional Intelligence?", opts: ["IQ, EQ, AQ, SQ, CQ", "Self-awareness, Self-regulation, Motivation, Empathy, Social skills", "Leadership, Communication, Planning, Risk, Quality", "Vision, Strategy, Execution, Review, Closure"], a: 1, exp: "Goleman's EQ model: Self-awareness (know yourself), Self-regulation (control yourself), Motivation (drive yourself), Empathy (understand others), Social skills (work with others)." },
            { q: "What is situational leadership?", opts: ["Leadership in emergency situations", "Adapting your leadership style to the development level and commitment of each team member", "One consistent leadership style for all", "A military leadership model"], a: 1, exp: "Hersey & Blanchard's model: Direct low-skill/high-motivation people. Coach medium-skill/low-motivation. Support high-skill/variable motivation. Delegate high-skill/high-motivation." },
            { q: "What is the most powerful type of PM power?", opts: ["Coercive", "Expert power — based on knowledge and experience, not organizational position", "Formal authority", "Reward power"], a: 1, exp: "Expert power is sustainable and respected. Coercive and formal power work short-term but damage relationships and trust." },
            { q: "What does servant leadership mean for a PM?", opts: ["Doing all the work yourself", "Prioritizing the team's needs, removing obstacles, and enabling their success over exercising authority", "Following all team decisions", "Being submissive to stakeholders"], a: 1, exp: "Servant leaders ask 'How can I serve my team?' rather than 'How do I direct my team?' — producing higher engagement and results." },
            { q: "How does high EQ improve PM performance?", opts: ["It doesn't affect performance", "Better conflict navigation, stronger relationships, improved team motivation, and more resilient stakeholder management", "Only matters for HR issues", "Only relevant in large teams"], a: 1, exp: "EQ is the foundation of PM effectiveness — technical skills get you hired, but EQ determines how far you go." }
          ]
        },
        { title: "10.2 Strategic PM & Business Acumen", description: "Connect project decisions to business strategy, organizational value, and portfolio management.", order_index: 1,
          mainPoints: ["Strategic PMs understand how their project contributes to organizational goals.", "Portfolio management: selecting and prioritizing projects that maximize organizational value.", "Benefits realization: ensuring projects deliver the expected business outcomes.", "OKRs (Objectives and Key Results) connect projects to strategic objectives.", "Business acumen separates good PMs from great PMs — understand the P&L."],
          questions: [
            { q: "What is portfolio management?", opts: ["Managing the PM's career portfolio", "Selecting, prioritizing, and governing projects to maximize organizational strategic value", "Managing a project's documents", "A financial investment strategy only"], a: 1, exp: "Portfolio management ensures organizations invest in the right projects — aligned to strategy and maximizing overall value." },
            { q: "What is benefits realization in project management?", opts: ["Tracking project costs", "Ensuring projects deliver the expected business benefits after completion, not just deliver on time/budget", "Employee benefit programs", "Financial returns on investment only"], a: 1, exp: "Many projects meet scope/schedule/cost but fail to deliver business value. Benefits realization bridges this gap." },
            { q: "What are OKRs?", opts: ["Old Knowledge Records", "Objectives and Key Results — a goal-setting framework connecting team work to strategic outcomes", "Operational Quality Requirements", "Organizational Knowledge Resources"], a: 1, exp: "OKRs ensure projects drive measurable strategic outcomes. Objectives are inspiring; Key Results are measurable proof." },
            { q: "What does business acumen mean for a PM?", opts: ["Having an MBA", "Understanding how the business makes money, its competitive position, and how PM decisions affect the P&L", "Reading financial reports", "Only relevant for PMs in finance"], a: 1, exp: "PMs with business acumen make better trade-off decisions because they understand the business impact of project choices." },
            { q: "How should a PM justify a project to executive leadership?", opts: ["Show the detailed project plan", "Speak the language of business: ROI, strategic alignment, risk, and competitive advantage", "Demonstrate technical expertise", "Show how big the team is"], a: 1, exp: "Executives care about value, risk, and strategic fit — not Gantt charts. Business-savvy PMs speak executive language." }
          ]
        },
        { title: "10.3 PMP Certification Preparation", description: "Understand PMP exam structure, experience requirements, and high-yield exam strategies.", order_index: 2,
          mainPoints: ["PMP requires: 36 months PM experience (degree) or 60 months (no degree) + 35 contact hours.", "Exam: 180 questions, 230 minutes, ~50% Agile/hybrid content.", "Exam domains: People (42%), Process (50%), Business Environment (8%).", "PMI's Code of Ethics applies to all PMP holders.", "Study strategy: PMBOK 7th + Agile Practice Guide + question bank (1000+ questions minimum)."],
          questions: [
            { q: "What are the PMP experience requirements with a 4-year degree?", opts: ["12 months PM experience", "36 months of project management experience + 35 contact hours of PM education", "5 years of any experience", "PMP has no experience requirements"], a: 1, exp: "PMP requires proven experience leading projects. 36 months (with degree) or 60 months (without) + 35 education hours." },
            { q: "What percentage of PMP exam content is Agile/hybrid?", opts: ["10%", "25%", "Approximately 50% — the exam reflects modern project delivery reality", "75%"], a: 2, exp: "PMI updated the PMP to reflect that most projects use Agile or hybrid approaches — roughly half the exam reflects this." },
            { q: "What are the three PMP exam domains?", opts: ["Initiating, Planning, Executing", "People (42%), Process (50%), Business Environment (8%)", "Cost, Schedule, Scope", "Waterfall, Agile, Hybrid"], a: 1, exp: "The 3 domains reflect PMI's talent triangle: Process (technical PM), People (leadership), Business Environment (strategic acumen)." },
            { q: "Minimum recommended practice questions for PMP preparation:", opts: ["100 questions", "250 questions", "1,000+ questions — pattern recognition is critical for exam success", "500 questions"], a: 2, exp: "PMP exam questions are situational — practice develops pattern recognition. Most successful candidates complete 1,000+ practice questions." },
            { q: "PMI's Code of Ethics covers:", opts: ["Only financial conduct", "Responsibility, Respect, Fairness, and Honesty — applying to all PMI credential holders", "Technical PM skills only", "Management of vendors"], a: 1, exp: "PMI's Code of Ethics appears on the PMP exam. Know the four values and their application in project scenarios." }
          ]
        },
        { title: "10.4 Building Your PM Career", description: "Create a career roadmap, build your PM brand, and position for senior PM and director roles.", order_index: 3,
          mainPoints: ["PM career path: Junior PM → PM → Senior PM → Program Manager → Director/VP → CPO.", "Specialization paths: IT/Tech PM, Construction PM, Healthcare PM, PMO leadership.", "Build your brand: LinkedIn presence, case studies, speaking, writing, community leadership.", "Network intentionally: PMI chapters, Agile communities, industry events.", "Salary benchmarks: US Senior PM = $130-175K+; Program Manager = $150-200K+."],
          questions: [
            { q: "What is the typical PM career progression?", opts: ["PM stays at the same level", "Junior PM → PM → Senior PM → Program Manager → Director/VP of PM", "Only vertical growth exists", "PMs transition to non-PM roles only"], a: 1, exp: "PM career ladders exist in most organizations. Each level adds strategic scope, team size, and budget responsibility." },
            { q: "What is the most impactful career-building activity for a PM?", opts: ["Collecting certifications only", "Combining certifications, demonstrated results, portfolio of case studies, and community visibility", "Staying at one company long-term", "Avoiding specialization"], a: 1, exp: "Employers hire proven performance, not credentials alone. Case studies of real results, combined with credentials and network, differentiate top candidates." },
            { q: "What salary range can a Senior PM in the US expect?", opts: ["$60,000 - $80,000", "$90,000 - $110,000", "$130,000 - $175,000+", "Above $300,000 always"], a: 2, exp: "Senior PMs in tech and financial services typically earn $130-175K+ in the US. Remote roles and AI skills command premium." },
            { q: "What differentiates a Program Manager from a Project Manager?", opts: ["Program Managers earn more", "Program Managers oversee multiple related projects, managing interdependencies and strategic alignment", "Program Managers have less responsibility", "Only the title is different"], a: 1, exp: "Program Managers manage portfolios of related projects, ensuring they deliver strategic outcomes greater than each project individually." },
            { q: "How does AI proficiency affect PM career prospects?", opts: ["No effect", "Significant premium — AI-proficient PMs command 20-30% higher compensation and access more roles", "Only relevant for tech PMs", "Negative effect — AI replaces PMs"], a: 1, exp: "AI is reshaping PM. PMs who can leverage AI tools to deliver faster and better outcomes are in high demand across all industries." }
          ]
        },
        { title: "10.5 Capstone: Your AI-Powered PM Operating System", description: "Build your complete AI-powered PM toolkit and personal operating system for career success.", order_index: 4,
          mainPoints: ["Your PM OS: integrated set of AI tools covering all PM domains.", "Tier 1 tools: ChatGPT/Claude (thinking), Jira/Linear (execution), Notion (documentation).", "Tier 2 tools: Otter.ai (meetings), Gamma (presentations), Miro (collaboration), Power BI (analytics).", "Automate the routine: status reports, meeting summaries, risk updates, stakeholder briefs.", "The best PMs are systems thinkers — they build processes, not just complete tasks."],
          questions: [
            { q: "What is a PM Operating System?", opts: ["Computer software for PMs", "An integrated set of AI tools, workflows, and processes that amplify PM effectiveness across all domains", "A project management methodology", "A time management system"], a: 1, exp: "Your PM OS is how you work: the tools, workflows, and habits that consistently produce great outcomes regardless of project type." },
            { q: "Which AI tool category has the highest ROI for most PMs?", opts: ["Image generation", "Meeting intelligence tools (Otter.ai, Fireflies) — capturing and structuring every conversation automatically", "Social media AI", "Code generation tools"], a: 1, exp: "PMs spend 80% of their time communicating. AI meeting tools capture, summarize, and distribute outcomes automatically." },
            { q: "What does 'automate the routine' mean for a PM?", opts: ["Automate project decisions", "Use AI to handle repetitive tasks (status reports, summaries, updates) so you focus on judgment and leadership", "Remove the team's responsibilities", "Use robots for PM work"], a: 1, exp: "Routine reporting and documentation are PM time thieves. AI automation reclaims 5-10 hours weekly for strategic work." },
            { q: "What makes a PM a 'systems thinker'?", opts: ["Using complex tools", "Building reusable processes and frameworks that create consistent outcomes, not just solving problems ad hoc", "Managing large systems projects", "Having technical background"], a: 1, exp: "Systems thinkers build leverage: instead of solving the same problem repeatedly, they create processes that prevent it." },
            { q: "What is the most important PM skill for 2025-2030?", opts: ["Traditional scheduling", "Human judgment applied to AI-augmented data and workflows — knowing when to trust AI and when to override it", "Cost accounting", "Risk matrices"], a: 1, exp: "AI handles data and routine tasks. The irreplaceable PM value is judgment: stakeholder trust, ethical decisions, creative problem-solving, and leadership." }
          ]
        }
      ]
    }
  ]
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  try {
    // SECURITY: founder/admin only — this seeder writes content with the service role.
    const __adminCheck = await requireAdmin(req);
    if (__adminCheck instanceof Response) return __adminCheck;
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const courseId = "eeeeeeee-ffff-1111-2222-333333333333";

    const { data: existing } = await supabase.from("chapters").select("id").eq("course_id", courseId);
    if (existing && existing.length > 0) {
      await supabase.from("chapters").delete().eq("course_id", courseId);
    }
    await supabase.from("courses").delete().eq("id", courseId);

    const { data: course, error: courseError } = await supabase.from("courses").insert({
      id: courseId,
      title: courseData.title,
      description: courseData.description,
      is_published: true
    }).select().single();

    if (courseError) throw courseError;

    for (const mod of courseData.modules) {
      const { data: chapter, error: chErr } = await supabase.from("chapters").insert({
        course_id: course.id,
        title: mod.title,
        description: mod.description,
        order_index: mod.order_index
      }).select().single();
      if (chErr) throw chErr;

      for (const lesson of mod.lessons) {
        const { data: video, error: vErr } = await supabase.from("videos").insert({
          chapter_id: chapter.id,
          title: lesson.title,
          description: lesson.description,
          order_index: lesson.order_index
        }).select().single();
        if (vErr) throw vErr;

        const { data: quiz, error: qErr } = await supabase.from("quizzes").insert({
          video_id: video.id,
          chapter_id: chapter.id,
          quiz_type: "mini_video",
          passing_score: 80
        }).select().single();
        if (qErr) throw qErr;

        for (let i = 0; i < lesson.questions.length; i++) {
          const q = lesson.questions[i];
          await supabase.from("quiz_questions").insert({
            quiz_id: quiz.id,
            question_text: q.q,
            options: q.opts,
            correct_answer_index: q.a,
            explanation: q.exp,
            order_index: i
          });
        }

        const { data: chapterQuiz, error: cqErr } = await supabase.from("quizzes").insert({
          chapter_id: chapter.id,
          quiz_type: "chapter_end",
          passing_score: 80
        }).select().single();
        if (cqErr) throw cqErr;

        for (let i = 0; i < lesson.questions.length; i++) {
          const q = lesson.questions[i];
          await supabase.from("quiz_questions").insert({
            quiz_id: chapterQuiz.id,
            question_text: q.q,
            options: q.opts,
            correct_answer_index: q.a,
            explanation: q.exp,
            order_index: i
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: "PM Professional course seeded successfully", courseId }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
});
