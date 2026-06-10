// =============================================================================
// AI Scrum Master Professional Certification — COMPLETE curriculum (reference)
// Built to the Aladiah Program Standard v1.0. This is the full content (not a
// summary): 18 modules, each with learning objectives, competencies, lessons,
// readings, videos, AI mentor activities, a lab, three simulations (beginner /
// intermediate / advanced), a portfolio deliverable, interview prep, an
// assessment blueprint, and competency mapping. Program totals: 54 simulations,
// 18 labs, 18 portfolio deliverables. Reference implementation for all future
// Aladiah programs.
// =============================================================================

export interface CurriculumSimulation {
  title: string;
  company: string;
  stakeholders: string[];
  constraints: string;
  conflict: string;
  decisionPoints: string[];
  scoring: string;
}
export interface CurriculumModule {
  no: number;
  title: string;
  phase: string;
  learningObjectives: string[];
  competencies: string[];
  competencyMapping: { competency: string; weight: number }[];
  lessons: { title: string; summary: string }[];
  readings: string[];
  videos: string[];
  aiMentorActivities: string[];
  lab: { name: string; tool: string; task: string; deliverable: string };
  simulations: { beginner: CurriculumSimulation; intermediate: CurriculumSimulation; advanced: CurriculumSimulation };
  portfolioDeliverable: string;
  interviewPrep: { behavioral: string[]; scenario: string[]; leadership: string[]; star: string };
  assessmentBlueprint: { moduleQuiz: number; competencyQuiz: number; questionBank: number; difficulty: { easy: number; medium: number; hard: number }; adaptive: boolean; passing: number };
  alignment: string[];
}

const ASSESS = { moduleQuiz: 20, competencyQuiz: 20, questionBank: 60, difficulty: { easy: 0.3, medium: 0.5, hard: 0.2 }, adaptive: true, passing: 85 };
const ALIGN_CORE = ['Scrum Guide 2020', 'PSM I'];
const star = 'Coach each answer with Situation → Task → Action → Result, emphasizing measurable outcomes and Scrum values.';
const sim = (title: string, company: string, stakeholders: string[], constraints: string, conflict: string, decisionPoints: string[], scoring: string): CurriculumSimulation =>
  ({ title, company, stakeholders, constraints, conflict, decisionPoints, scoring });

export const AI_SCRUM_MASTER_CURRICULUM: CurriculumModule[] = [
  {
    no: 1, title: 'Agile & Scrum Foundations (AI-Augmented)', phase: 'Foundations',
    learningObjectives: ['Explain Scrum as a lightweight empirical framework', 'Contrast Scrum with predictive/waterfall delivery', 'Describe the three empirical pillars and five Scrum values', 'Use an AI co-pilot to accelerate learning and facilitation'],
    competencies: ['scrum:framework', 'scrum:empiricism'],
    competencyMapping: [{ competency: 'scrum:framework', weight: 70 }, { competency: 'scrum:empiricism', weight: 30 }],
    lessons: [
      { title: 'What Scrum is (and is not)', summary: 'The framework, its purpose, and when to use it.' },
      { title: 'Empiricism: transparency, inspection, adaptation', summary: 'How empirical process control replaces up-front prediction.' },
      { title: 'The Scrum values', summary: 'Commitment, focus, openness, respect, courage in practice.' },
      { title: 'Your AI co-pilot', summary: 'Setting up an AI mentor for explanations, practice, and feedback.' },
    ],
    readings: ['Scrum Guide 2020 — Purpose & Definition', 'Scrum Theory & Values sections', 'Agile Manifesto + 12 principles'],
    videos: ['Scrum in 10 minutes', 'Empiricism explained', 'Waterfall vs. Scrum'],
    aiMentorActivities: ['AI explains each pillar with examples from your background', 'AI quizzes you on Scrum vs. waterfall', 'AI drafts a one-paragraph "why Scrum" for a skeptical manager'],
    lab: { name: 'Sprint Planning Lab', tool: 'Confluence', task: 'Author a team charter and Agile primer', deliverable: 'Team Charter (Confluence page)' },
    simulations: {
      beginner: sim('Intro: a team tries Scrum', 'Global fintech', ['Manager', 'Developers'], 'New team, no Scrum experience', 'Manager wants status reports', ['Explain Scrum’s purpose', 'Set the first working agreement'], 'Scored on clarity + values alignment'),
      intermediate: sim('Piloting Scrum in a waterfall org', 'Global fintech', ['PMO', 'Developers', 'Sponsor'], 'PMO mandates phase gates', 'Phase gates vs. empiricism', ['Protect empiricism', 'Negotiate a pilot scope'], 'Scored on empiricism preserved'),
      advanced: sim('Rescuing a failed Agile adoption', 'Global fintech', ['Exec sponsor', 'PMO', 'Teams'], 'Adoption stalled; trust low', 'Cynicism about "Agile theatre"', ['Diagnose root cause', 'Reset on values + transparency'], 'Scored on systemic diagnosis'),
    },
    portfolioDeliverable: 'Team Charter + Working Agreement',
    interviewPrep: { behavioral: ['Tell me about a time you introduced a new way of working.'], scenario: ['A manager asks for daily status reports — what do you do?'], leadership: ['How do you build trust in a new team?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE],
  },
  {
    no: 2, title: 'The Scrum Master Role & Servant Leadership', phase: 'Foundations',
    learningObjectives: ['Define the Scrum Master accountability', 'Differentiate the Scrum Master from a project manager', 'Apply servant/facilitative leadership', 'Coach a team toward self-management'],
    competencies: ['scrum:roles', 'scrum:team-dynamics'],
    competencyMapping: [{ competency: 'scrum:roles', weight: 60 }, { competency: 'scrum:team-dynamics', weight: 40 }],
    lessons: [
      { title: 'The Scrum Master accountability', summary: 'True leadership that serves the team and organization.' },
      { title: 'Servant leadership', summary: 'Coaching, facilitating, and removing impediments — not assigning tasks.' },
      { title: 'Scrum Master vs. Project Manager', summary: 'Boundaries, mindset, and common confusions.' },
      { title: 'Building self-management', summary: 'Helping teams own their decisions.' },
    ],
    readings: ['Scrum Guide — The Scrum Master', 'Servant leadership primer', 'Coaching vs. mentoring'],
    videos: ['Servant leadership in Scrum', 'A day in the life of a Scrum Master', 'SM vs PM'],
    aiMentorActivities: ['AI role-plays a directive manager; you respond as a servant leader', 'AI critiques your facilitative language', 'AI builds a "stop doing / start doing" list for a new SM'],
    lab: { name: 'Backlog Refinement Lab', tool: 'Miro', task: 'Map the Scrum Master role canvas', deliverable: 'Scrum Master Role Canvas' },
    simulations: {
      beginner: sim('Week one as Scrum Master', 'Healthcare SaaS', ['Team', 'PO'], 'Team unsure of your role', 'Team expects you to assign work', ['Clarify your role', 'Establish facilitation'], 'Scored on role clarity'),
      intermediate: sim('Earning trust on a skeptical team', 'Healthcare SaaS', ['Senior devs', 'PO'], 'Senior devs resist coaching', 'Resistance to a "non-technical" SM', ['Demonstrate value', 'Coach without authority'], 'Scored on trust built'),
      advanced: sim('SM caught between PO and team', 'Healthcare SaaS', ['PO', 'Team', 'Stakeholder'], 'PO pushes scope; team overloaded', 'Loyalty conflict', ['Protect the team', 'Coach the PO'], 'Scored on servant balance'),
    },
    portfolioDeliverable: 'Scrum Master Role Canvas',
    interviewPrep: { behavioral: ['Describe a time you led without authority.'], scenario: ['Your team asks you to assign tasks — how do you respond?'], leadership: ['How do you grow a team’s self-management?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'Agile Coaching'],
  },
  {
    no: 3, title: 'Scrum Team Accountabilities', phase: 'Foundations',
    learningObjectives: ['Describe the three accountabilities', 'Clarify PO, SM, and Developer boundaries', 'Resolve accountability overlaps', 'Support a cross-functional, self-managing team'],
    competencies: ['scrum:roles'],
    competencyMapping: [{ competency: 'scrum:roles', weight: 100 }],
    lessons: [
      { title: 'Product Owner accountability', summary: 'Value, the Product Goal, and backlog ownership.' },
      { title: 'Developers', summary: 'Creating a usable Increment each Sprint.' },
      { title: 'Scrum Master', summary: 'Effectiveness of Scrum across the team and org.' },
      { title: 'Boundaries & overlaps', summary: 'Avoiding role confusion and anti-patterns.' },
    ],
    readings: ['Scrum Guide — The Scrum Team', 'Accountabilities vs. roles', 'Cross-functional teams'],
    videos: ['The three accountabilities', 'PO vs SM', 'Self-managing teams'],
    aiMentorActivities: ['AI quizzes you on accountability boundaries', 'AI generates a RACI for a tricky scenario', 'AI flags role anti-patterns in a transcript'],
    lab: { name: 'Velocity Lab', tool: 'Confluence', task: 'Build an accountabilities / RACI map', deliverable: 'Accountabilities Map' },
    simulations: {
      beginner: sim('Who owns the backlog?', 'E-commerce platform', ['PO', 'Devs'], 'Backlog ownership unclear', 'Devs and PO both reprioritize', ['Clarify ownership', 'Set refinement cadence'], 'Scored on boundary clarity'),
      intermediate: sim('A PM acts like a PO', 'E-commerce platform', ['PM', 'PO', 'Devs'], 'A PM bypasses the PO', 'Two voices of the customer', ['Coach the PM', 'Reinforce the PO'], 'Scored on accountability restored'),
      advanced: sim('Scaling roles across teams', 'E-commerce platform', ['POs', 'SMs', 'Devs'], 'Multiple teams, shared product', 'Conflicting priorities', ['Align POs', 'Clarify shared DoD'], 'Scored on multi-team clarity'),
    },
    portfolioDeliverable: 'Accountabilities Map',
    interviewPrep: { behavioral: ['Tell me about a role conflict you resolved.'], scenario: ['A stakeholder gives the team direct orders — what do you do?'], leadership: ['How do you keep accountabilities clear at scale?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE],
  },
  {
    no: 4, title: 'The Sprint & Sprint Planning', phase: 'Events & Execution',
    learningObjectives: ['Explain the Sprint as the heartbeat of Scrum', 'Facilitate effective Sprint Planning', 'Craft a strong Sprint Goal', 'Forecast realistically with AI assistance'],
    competencies: ['scrum:events'],
    competencyMapping: [{ competency: 'scrum:events', weight: 100 }],
    lessons: [
      { title: 'The Sprint', summary: 'Fixed length, consistency, and the container for all work.' },
      { title: 'Sprint Planning topics', summary: 'Why, what, and how.' },
      { title: 'The Sprint Goal', summary: 'A single objective that creates focus.' },
      { title: 'Capacity & forecasting', summary: 'Selecting a realistic forecast.' },
    ],
    readings: ['Scrum Guide — The Sprint, Sprint Planning', 'Sprint Goal patterns', 'Forecasting basics'],
    videos: ['Sprint Planning facilitation', 'Writing a Sprint Goal', 'Capacity planning'],
    aiMentorActivities: ['AI forecasts a realistic sprint from history and flags risks', 'AI critiques your Sprint Goal', 'AI generates planning facilitation prompts'],
    lab: { name: 'Release Planning Lab', tool: 'Jira', task: 'Set up a sprint and plan capacity', deliverable: 'Sprint Plan' },
    simulations: {
      beginner: sim('First Sprint Planning', 'Logistics enterprise', ['PO', 'Devs'], 'New team, vague backlog', 'No clear Sprint Goal', ['Facilitate why/what/how', 'Forge a Sprint Goal'], 'Scored on goal + plan quality'),
      intermediate: sim('Planning under deadline pressure', 'Logistics enterprise', ['PO', 'Devs', 'Sponsor'], 'Aggressive deadline', 'Over-commitment risk', ['Protect a realistic forecast', 'Negotiate scope'], 'Scored on sustainable plan'),
      advanced: sim('Dependency-heavy planning', 'Logistics enterprise', ['POs', 'Devs', 'Architects'], 'Cross-team dependencies', 'Blocking dependencies', ['Surface dependencies', 'Coordinate without command'], 'Scored on dependency handling'),
    },
    portfolioDeliverable: 'Sprint Dashboard (Sprint Plan)',
    interviewPrep: { behavioral: ['Describe a time you prevented over-commitment.'], scenario: ['Leadership demands more than the team can deliver — what do you do?'], leadership: ['How do you make Sprint Goals meaningful?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'PSM II'],
  },
  {
    no: 5, title: 'Daily Scrum & Sprint Execution', phase: 'Events & Execution',
    learningObjectives: ['Run an effective 15-minute Daily Scrum', 'Keep execution focused on the Sprint Goal', 'Make impediments visible and remove them', 'Use AI to summarize standups and surface blockers'],
    competencies: ['scrum:events', 'scrum:team-dynamics'],
    competencyMapping: [{ competency: 'scrum:events', weight: 60 }, { competency: 'scrum:team-dynamics', weight: 40 }],
    lessons: [
      { title: 'Purpose of the Daily Scrum', summary: 'Inspect progress and adapt the plan — for the Developers.' },
      { title: 'Anti-patterns', summary: 'Status meetings, manager check-ins, and how to coach past them.' },
      { title: 'Impediment management', summary: 'Identifying, prioritizing, and removing blockers.' },
      { title: 'Flow during the Sprint', summary: 'Visualizing and protecting flow.' },
    ],
    readings: ['Scrum Guide — Daily Scrum', 'Impediment removal patterns', 'Flow basics'],
    videos: ['Daily Scrum done right', 'Removing impediments', 'Visualizing flow'],
    aiMentorActivities: ['AI summarizes standup notes and surfaces blockers', 'AI classifies + prioritizes impediments', 'AI suggests removal strategies grounded in Scrum'],
    lab: { name: 'Daily Scrum Lab', tool: 'Jira', task: 'Run a sprint board and manage flow', deliverable: 'Impediment Log' },
    simulations: {
      beginner: sim('Standup becomes a status meeting', 'Telecom', ['Devs', 'Manager'], 'Manager attends and dominates', 'Status reporting creeps in', ['Reframe purpose', 'Coach the manager'], 'Scored on purpose restored'),
      intermediate: sim('Hidden impediments', 'Telecom', ['Devs', 'Ops'], 'Blockers not surfaced', 'Team works around blockers silently', ['Make impediments visible', 'Escalate appropriately'], 'Scored on impediment flow'),
      advanced: sim('Rescuing a failing Sprint mid-cycle', 'Telecom', ['Devs', 'PO', 'Sponsor'], 'Sprint Goal at risk', 'Pressure to add overtime', ['Re-plan toward the goal', 'Protect sustainability'], 'Scored on goal recovery'),
    },
    portfolioDeliverable: 'Impediment Log + Flow Board',
    interviewPrep: { behavioral: ['Tell me about a major impediment you removed.'], scenario: ['Your team hides blockers — how do you respond?'], leadership: ['How do you keep execution focused on the Sprint Goal?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE],
  },
  {
    no: 6, title: 'Sprint Review & Retrospective', phase: 'Events & Execution',
    learningObjectives: ['Facilitate a value-focused Sprint Review', 'Run an effective Retrospective', 'Drive continuous improvement empirically', 'Synthesize retro themes with AI'],
    competencies: ['scrum:events', 'scrum:empiricism'],
    competencyMapping: [{ competency: 'scrum:events', weight: 55 }, { competency: 'scrum:empiricism', weight: 45 }],
    lessons: [
      { title: 'Sprint Review', summary: 'Inspect the Increment and adapt the backlog with stakeholders.' },
      { title: 'Retrospective', summary: 'Inspect people, relationships, process, and tools.' },
      { title: 'Improvement experiments', summary: 'Turning insights into measurable change.' },
      { title: 'Facilitation techniques', summary: 'Formats that keep events energizing.' },
    ],
    readings: ['Scrum Guide — Review & Retrospective', 'Retro formats', 'Improvement kata'],
    videos: ['High-value Sprint Reviews', 'Retro facilitation', 'Improvement experiments'],
    aiMentorActivities: ['AI clusters retro inputs into themes and proposes experiments', 'AI drafts a Sprint Review narrative tied to value', 'AI suggests retro formats for your team mood'],
    lab: { name: 'Retrospective Lab', tool: 'Miro', task: 'Facilitate a retrospective board', deliverable: 'Retrospective + Action Items' },
    simulations: {
      beginner: sim('A demo with no feedback', 'Media company', ['Stakeholders', 'PO'], 'Stakeholders disengaged', 'One-way demo, no inspection', ['Make it interactive', 'Gather real feedback'], 'Scored on feedback gathered'),
      intermediate: sim('A blameful retrospective', 'Media company', ['Devs', 'PO'], 'Low psychological safety', 'Blame instead of learning', ['Establish safety', 'Refocus on the system'], 'Scored on safety + actions'),
      advanced: sim('Stagnant continuous improvement', 'Media company', ['Devs', 'Managers'], 'Actions never completed', 'Retro fatigue', ['Make experiments measurable', 'Close the loop'], 'Scored on improvement evidence'),
    },
    portfolioDeliverable: 'Retrospective + Action Items',
    interviewPrep: { behavioral: ['Describe a retrospective that changed your team.'], scenario: ['Your retros feel pointless — what do you do?'], leadership: ['How do you sustain continuous improvement?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'Agile Coaching'],
  },
  {
    no: 7, title: 'Scrum Artifacts & Commitments', phase: 'Artifacts & Delivery',
    learningObjectives: ['Explain Product Backlog, Sprint Backlog, Increment', 'Connect each artifact to its commitment', 'Maximize transparency', 'Structure backlogs with AI assistance'],
    competencies: ['scrum:artifacts'],
    competencyMapping: [{ competency: 'scrum:artifacts', weight: 100 }],
    lessons: [
      { title: 'Product Backlog & Product Goal', summary: 'The single source of work and the long-term objective.' },
      { title: 'Sprint Backlog & Sprint Goal', summary: 'The plan and objective for the Sprint.' },
      { title: 'Increment & Definition of Done', summary: 'A usable, valuable result that meets quality.' },
      { title: 'Transparency', summary: 'Making artifacts trustworthy.' },
    ],
    readings: ['Scrum Guide — Artifacts & Commitments', 'Product Goal patterns', 'Backlog structure'],
    videos: ['The three artifacts', 'Commitments explained', 'Transparency in Scrum'],
    aiMentorActivities: ['AI checks artifact transparency in a sample', 'AI drafts a Product Goal from a vision', 'AI structures a backlog from raw ideas'],
    lab: { name: 'Definition of Done Lab', tool: 'Jira', task: 'Structure Product & Sprint Backlogs', deliverable: 'Product + Sprint Backlog' },
    simulations: {
      beginner: sim('An opaque backlog', 'Bank', ['PO', 'Devs'], 'Backlog is a black box', 'Stakeholders can’t see priorities', ['Improve transparency', 'Order by value'], 'Scored on transparency'),
      intermediate: sim('Missing Product Goal', 'Bank', ['PO', 'Sponsor'], 'No long-term objective', 'Backlog drifts', ['Define a Product Goal', 'Align the backlog'], 'Scored on goal alignment'),
      advanced: sim('Distributed-team transparency', 'Bank', ['POs', 'Devs', 'Auditors'], 'Regulated, distributed teams', 'Audit + transparency tension', ['Create transparency radiators', 'Satisfy audit empirically'], 'Scored on systemic transparency'),
    },
    portfolioDeliverable: 'Product + Sprint Backlog',
    interviewPrep: { behavioral: ['Tell me about improving transparency.'], scenario: ['Stakeholders distrust the backlog — what do you do?'], leadership: ['How do commitments drive focus?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE],
  },
  {
    no: 8, title: 'Definition of Done & Quality', phase: 'Artifacts & Delivery',
    learningObjectives: ['Create a strong Definition of Done', 'Protect quality under pressure', 'Connect DoD to delivery pipelines', 'Use AI to review the DoD'],
    competencies: ['scrum:artifacts', 'scrum:delivery-metrics'],
    competencyMapping: [{ competency: 'scrum:artifacts', weight: 60 }, { competency: 'scrum:delivery-metrics', weight: 40 }],
    lessons: [
      { title: 'Definition of Done', summary: 'A shared understanding of complete.' },
      { title: 'Quality as non-negotiable', summary: 'Why DoD protects the product and team.' },
      { title: 'DoD and CI/CD', summary: 'Embedding quality in the pipeline.' },
      { title: 'Scope vs. DoD', summary: 'Holding the line under pressure.' },
    ],
    readings: ['Scrum Guide — Definition of Done', 'Quality gates', 'CI/CD for teams'],
    videos: ['Writing a strong DoD', 'Quality under pressure', 'DoD + pipelines'],
    aiMentorActivities: ['AI reviews your Definition of Done', 'AI suggests pipeline quality gates', 'AI role-plays a stakeholder pushing scope over DoD'],
    lab: { name: 'Metrics Dashboard Lab', tool: 'Azure DevOps', task: 'Define DoD with a CI/CD quality gate', deliverable: 'Definition of Done' },
    simulations: {
      beginner: sim('No shared Definition of Done', 'Insurtech', ['Devs', 'PO'], 'Each dev has their own bar', 'Inconsistent quality', ['Facilitate a shared DoD', 'Make it visible'], 'Scored on shared DoD'),
      intermediate: sim('Scope vs. Definition of Done', 'Insurtech', ['PO', 'Sponsor', 'Devs'], 'Deadline pressure', 'Pressure to skip DoD', ['Protect DoD', 'Negotiate scope not quality'], 'Scored on quality protected'),
      advanced: sim('Org-wide DoD for compliance', 'Insurtech', ['Compliance', 'Teams'], 'Regulatory quality bar', 'Compliance vs. speed', ['Raise DoD systemically', 'Automate gates'], 'Scored on systemic quality'),
    },
    portfolioDeliverable: 'Definition of Done + Quality Gates',
    interviewPrep: { behavioral: ['Describe protecting quality under pressure.'], scenario: ['A sponsor asks you to ship below the DoD — what do you do?'], leadership: ['How do you raise quality across teams?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'Enterprise Agile'],
  },
  {
    no: 9, title: 'Product Backlog Management & Refinement', phase: 'Artifacts & Delivery',
    learningObjectives: ['Facilitate effective backlog refinement', 'Split and order work by value', 'Support the PO without owning the backlog', 'Use AI to draft and split stories'],
    competencies: ['scrum:artifacts', 'scrum:stakeholders'],
    competencyMapping: [{ competency: 'scrum:artifacts', weight: 55 }, { competency: 'scrum:stakeholders', weight: 45 }],
    lessons: [
      { title: 'Refinement as a continuous activity', summary: 'Keeping the backlog ready.' },
      { title: 'Story splitting & acceptance criteria', summary: 'Small, valuable, testable items.' },
      { title: 'Ordering by value & risk', summary: 'Maximizing outcomes.' },
      { title: 'Supporting the PO', summary: 'Coaching without taking ownership.' },
    ],
    readings: ['Backlog refinement patterns', 'Story splitting techniques', 'Value-based ordering'],
    videos: ['Refinement facilitation', 'Story splitting', 'Story mapping'],
    aiMentorActivities: ['AI drafts and splits user stories', 'AI generates acceptance criteria', 'AI flags dependencies and risks'],
    lab: { name: 'Facilitation Lab', tool: 'Jira', task: 'Run backlog refinement + story mapping', deliverable: 'Refined Backlog + Story Map' },
    simulations: {
      beginner: sim('A messy backlog', 'Retail chain', ['PO', 'Devs'], 'Huge, unrefined backlog', 'No clear value order', ['Facilitate refinement', 'Split big items'], 'Scored on readiness'),
      intermediate: sim('A demanding Product Owner', 'Retail chain', ['PO', 'Devs'], 'PO over-specifies solutions', 'Solutioning vs. outcomes', ['Coach toward outcomes', 'Protect dev autonomy'], 'Scored on outcome focus'),
      advanced: sim('Multi-stakeholder prioritization', 'Retail chain', ['PO', 'Sales', 'Ops'], 'Competing stakeholder demands', 'Everyone’s item is #1', ['Facilitate trade-offs', 'Make value transparent'], 'Scored on prioritization quality'),
    },
    portfolioDeliverable: 'Refined Backlog + Story Map',
    interviewPrep: { behavioral: ['Tell me about facilitating tough prioritization.'], scenario: ['A PO dictates technical solutions — what do you do?'], leadership: ['How do you keep refinement valuable?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE],
  },
  {
    no: 10, title: 'Empiricism, Transparency & Scrum Values', phase: 'Empiricism & Facilitation',
    learningObjectives: ['Deepen empirical process control', 'Build radical transparency', 'Live the Scrum values', 'Surface transparency gaps with AI'],
    competencies: ['scrum:empiricism'],
    competencyMapping: [{ competency: 'scrum:empiricism', weight: 100 }],
    lessons: [
      { title: 'Empiricism in depth', summary: 'Inspect-and-adapt as a discipline.' },
      { title: 'Transparency radiators', summary: 'Information radiators and honest signals.' },
      { title: 'Values under pressure', summary: 'Courage and openness when it’s hard.' },
      { title: 'Trust & safety', summary: 'The foundation of empiricism.' },
    ],
    readings: ['Scrum Guide — Theory & Values', 'Information radiators', 'Psychological safety'],
    videos: ['Empiricism deep dive', 'Building transparency', 'Living the values'],
    aiMentorActivities: ['AI surfaces transparency gaps', 'AI generates a values self-assessment', 'AI coaches a values conflict role-play'],
    lab: { name: 'Coaching Lab', tool: 'Confluence', task: 'Build transparency radiators', deliverable: 'Team Working Agreement' },
    simulations: {
      beginner: sim('Hidden status', 'Gov digital service', ['Team', 'Manager'], 'Real status hidden', 'Green-shifting reports', ['Make status honest', 'Coach openness'], 'Scored on transparency'),
      intermediate: sim('A values conflict', 'Gov digital service', ['Team', 'PO'], 'Focus vs. respect clash', 'Conflicting values', ['Facilitate the conflict', 'Anchor on values'], 'Scored on values applied'),
      advanced: sim('Low-trust organization', 'Gov digital service', ['Execs', 'Teams'], 'Systemic distrust', 'Fear blocks empiricism', ['Build safety', 'Make inspection safe'], 'Scored on trust built'),
    },
    portfolioDeliverable: 'Team Working Agreement',
    interviewPrep: { behavioral: ['Describe showing courage as a Scrum Master.'], scenario: ['Reports are "green" but reality is "red" — what do you do?'], leadership: ['How do you build psychological safety?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'Agile Coaching'],
  },
  {
    no: 11, title: 'Facilitation Mastery', phase: 'Empiricism & Facilitation',
    learningObjectives: ['Master facilitation across all events', 'Design engaging sessions', 'Handle difficult dynamics', 'Critique facilitation with AI'],
    competencies: ['scrum:team-dynamics', 'scrum:events'],
    competencyMapping: [{ competency: 'scrum:team-dynamics', weight: 55 }, { competency: 'scrum:events', weight: 45 }],
    lessons: [
      { title: 'Facilitation fundamentals', summary: 'Neutrality, structure, participation.' },
      { title: 'Designing sessions', summary: 'Purpose, outcomes, formats.' },
      { title: 'Difficult dynamics', summary: 'Dominators, silence, conflict.' },
      { title: 'Facilitation toolkit', summary: 'Techniques for every event.' },
    ],
    readings: ['Facilitation techniques', 'Liberating Structures', 'Group dynamics'],
    videos: ['Facilitation fundamentals', 'Designing workshops', 'Handling dominators'],
    aiMentorActivities: ['AI critiques your facilitation language', 'AI designs a session plan', 'AI role-plays a difficult participant'],
    lab: { name: 'Impediment Removal Lab', tool: 'Miro', task: 'Design facilitation techniques per event', deliverable: 'Facilitation Playbook' },
    simulations: {
      beginner: sim('A dominated meeting', 'Consultancy', ['Team'], 'One person dominates', 'Unequal participation', ['Balance voices', 'Use a structure'], 'Scored on participation'),
      intermediate: sim('A silent team', 'Consultancy', ['Team', 'PO'], 'Disengaged participants', 'Silence + low energy', ['Re-energize', 'Draw out input'], 'Scored on engagement'),
      advanced: sim('A contentious cross-team session', 'Consultancy', ['Teams', 'Leads'], 'High conflict, high stakes', 'Cross-team conflict', ['Stay neutral', 'Move to a decision'], 'Scored on neutral resolution'),
    },
    portfolioDeliverable: 'Facilitation Playbook',
    interviewPrep: { behavioral: ['Tell me about facilitating a hard session.'], scenario: ['One stakeholder dominates every meeting — what do you do?'], leadership: ['How do you design for participation?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'Agile Coaching', 'PSM II'],
  },
  {
    no: 12, title: 'Coaching & Team Dynamics', phase: 'Empiricism & Facilitation',
    learningObjectives: ['Coach individuals and teams', 'Build high-performing dynamics', 'Resolve conflict constructively', 'Practice coaching with an AI role-player'],
    competencies: ['scrum:team-dynamics'],
    competencyMapping: [{ competency: 'scrum:team-dynamics', weight: 100 }],
    lessons: [
      { title: 'Coaching stance', summary: 'Powerful questions over answers.' },
      { title: 'Team development', summary: 'Forming to performing.' },
      { title: 'Conflict resolution', summary: 'Healthy conflict as fuel.' },
      { title: 'Emotional intelligence', summary: 'Self- and social awareness.' },
    ],
    readings: ['Coaching Agile Teams', 'Team development models', 'Conflict resolution'],
    videos: ['The coaching stance', 'Team dynamics', 'Resolving conflict'],
    aiMentorActivities: ['AI role-plays a difficult team member', 'AI gives feedback on your coaching questions', 'AI builds a coaching plan for a struggling team'],
    lab: { name: 'Scaling Lab', tool: 'AI tools', task: 'Practice coaching dialogues with an AI role-player', deliverable: 'Team Coaching Plan' },
    simulations: {
      beginner: sim('A struggling new team', 'Manufacturing', ['Team'], 'Forming stage, low trust', 'Friction and uncertainty', ['Coach norms', 'Build trust'], 'Scored on team progress'),
      intermediate: sim('Persistent conflict', 'Manufacturing', ['Two devs', 'PO'], 'Interpersonal conflict', 'Conflict harms delivery', ['Mediate', 'Refocus on goals'], 'Scored on conflict resolved'),
      advanced: sim('A low-trust, low-performing team', 'Manufacturing', ['Team', 'Manager'], 'Chronic underperformance', 'Manager wants to "fix" people', ['Coach the system', 'Shift the manager’s lens'], 'Scored on systemic coaching'),
    },
    portfolioDeliverable: 'Team Coaching Plan',
    interviewPrep: { behavioral: ['Describe coaching a struggling team.'], scenario: ['Two team members are in conflict — what do you do?'], leadership: ['How do you build a high-performing team?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'Agile Coaching', 'PSM II'],
  },
  {
    no: 13, title: 'Stakeholder Engagement & Communication', phase: 'Leadership & Scale',
    learningObjectives: ['Engage stakeholders effectively', 'Communicate with executives', 'Manage expectations', 'Draft stakeholder comms with AI'],
    competencies: ['scrum:stakeholders'],
    competencyMapping: [{ competency: 'scrum:stakeholders', weight: 100 }],
    lessons: [
      { title: 'Stakeholder mapping', summary: 'Who matters and how to engage.' },
      { title: 'Executive communication', summary: 'Speaking the language of leaders.' },
      { title: 'Expectation management', summary: 'Honesty over false certainty.' },
      { title: 'The right events for feedback', summary: 'Channeling engagement productively.' },
    ],
    readings: ['Stakeholder engagement', 'Executive communication', 'Managing expectations'],
    videos: ['Stakeholder mapping', 'Talking to executives', 'Managing expectations'],
    aiMentorActivities: ['AI drafts tailored stakeholder updates', 'AI builds a stakeholder map', 'AI role-plays a demanding executive'],
    lab: { name: 'Stakeholder Management Lab', tool: 'Confluence', task: 'Build a stakeholder communications plan', deliverable: 'Stakeholder Communication Plan' },
    simulations: {
      beginner: sim('An anxious stakeholder', 'Energy enterprise', ['Stakeholder', 'PO'], 'Stakeholder wants guarantees', 'Pressure for certainty', ['Set honest expectations', 'Channel to the Review'], 'Scored on expectation handling'),
      intermediate: sim('Conflicting senior stakeholders', 'Energy enterprise', ['Execs', 'PO'], 'Two execs, two priorities', 'Conflicting demands', ['Facilitate alignment', 'Make trade-offs visible'], 'Scored on alignment'),
      advanced: sim('Executive escalation', 'Energy enterprise', ['CxO', 'PO', 'Team'], 'Exec bypasses the process', 'Direct orders to the team', ['Protect the team', 'Re-route through the PO'], 'Scored on systemic protection'),
    },
    portfolioDeliverable: 'Stakeholder Communication Plan',
    interviewPrep: { behavioral: ['Tell me about managing a difficult stakeholder.'], scenario: ['An executive demands a fixed date for uncertain work — what do you do?'], leadership: ['How do you earn executive trust?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'Enterprise Agile', 'PSM II'],
  },
  {
    no: 14, title: 'Organizational Change & Removing Impediments', phase: 'Leadership & Scale',
    learningObjectives: ['Drive organizational change', 'Remove systemic impediments', 'Influence without authority', 'Map impediments with AI'],
    competencies: ['scrum:stakeholders', 'scrum:team-dynamics'],
    competencyMapping: [{ competency: 'scrum:stakeholders', weight: 55 }, { competency: 'scrum:team-dynamics', weight: 45 }],
    lessons: [
      { title: 'Change models', summary: 'How organizations change.' },
      { title: 'Systemic impediments', summary: 'Beyond the team boundary.' },
      { title: 'Influence without authority', summary: 'Leading change as a Scrum Master.' },
      { title: 'Agile transformation basics', summary: 'Patterns and pitfalls.' },
    ],
    readings: ['Change management primer', 'Systemic impediments', 'Influence without authority', 'SAFe transformation overview'],
    videos: ['Leading change', 'Removing systemic impediments', 'Transformation patterns'],
    aiMentorActivities: ['AI maps systemic impediments', 'AI drafts a change plan', 'AI role-plays organizational resistance'],
    lab: { name: 'Transformation Lab', tool: 'Miro', task: 'Map organizational impediments + change plan', deliverable: 'RAID Log + Change Plan' },
    simulations: {
      beginner: sim('A blocked team', 'Airline', ['Team', 'Manager'], 'External dependency blocks team', 'Blocker outside the team', ['Escalate effectively', 'Track the impediment'], 'Scored on impediment removed'),
      intermediate: sim('Departmental resistance', 'Airline', ['Dept heads', 'Teams'], 'A department resists change', 'Resistance + politics', ['Build coalitions', 'Show early wins'], 'Scored on change traction'),
      advanced: sim('Stalled transformation', 'Airline', ['Execs', 'PMO', 'Teams'], 'Transformation losing momentum', 'Cynicism + reversion', ['Diagnose systemically', 'Re-energize change'], 'Scored on transformation revival'),
    },
    portfolioDeliverable: 'RAID Log + Agile Transformation Plan',
    interviewPrep: { behavioral: ['Describe driving change against resistance.'], scenario: ['A department blocks the team’s progress — what do you do?'], leadership: ['How do you lead transformation without authority?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'SAFe', 'Enterprise Agile', 'PSM II'],
  },
  {
    no: 15, title: 'Agile Metrics, Flow & Forecasting', phase: 'Leadership & Scale',
    learningObjectives: ['Use flow metrics responsibly', 'Forecast delivery empirically', 'Avoid metric misuse', 'Analyze flow with AI'],
    competencies: ['scrum:delivery-metrics'],
    competencyMapping: [{ competency: 'scrum:delivery-metrics', weight: 100 }],
    lessons: [
      { title: 'Flow metrics', summary: 'Throughput, cycle time, WIP, aging.' },
      { title: 'Forecasting', summary: 'Probabilistic forecasting over commitments.' },
      { title: 'Velocity done right', summary: 'A team tool, not a target.' },
      { title: 'Avoiding metric misuse', summary: 'Goodhart’s law in practice.' },
    ],
    readings: ['Flow metrics', 'Probabilistic forecasting', 'Velocity misuse'],
    videos: ['Flow metrics', 'Forecasting', 'Metric anti-patterns'],
    aiMentorActivities: ['AI analyzes flow and forecasts delivery', 'AI flags metric misuse', 'AI builds a metrics narrative for leadership'],
    lab: { name: 'Flow Forecasting Lab', tool: 'Azure DevOps', task: 'Build flow metrics + forecast', deliverable: 'Agile Metrics Dashboard' },
    simulations: {
      beginner: sim('No visibility', 'SaaS unicorn', ['Team', 'PO'], 'No flow metrics', 'Flying blind', ['Introduce flow metrics', 'Visualize WIP'], 'Scored on visibility'),
      intermediate: sim('Velocity as a target', 'SaaS unicorn', ['Manager', 'Team'], 'Manager pushes velocity', 'Gaming the metric', ['Reframe velocity', 'Protect the team'], 'Scored on healthy metrics'),
      advanced: sim('Forecasting a release', 'SaaS unicorn', ['Execs', 'PO', 'Team'], 'Fixed-date release', 'Pressure for false certainty', ['Provide a probabilistic forecast', 'Communicate uncertainty'], 'Scored on forecast quality'),
    },
    portfolioDeliverable: 'Agile Metrics Dashboard + Executive Status Report',
    interviewPrep: { behavioral: ['Tell me about using metrics to drive improvement.'], scenario: ['A manager weaponizes velocity — what do you do?'], leadership: ['How do you forecast without false promises?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'Enterprise Agile', 'PSM II'],
  },
  {
    no: 16, title: 'Scaling Scrum & Enterprise Agility', phase: 'Leadership & Scale',
    learningObjectives: ['Coordinate multiple teams', 'Apply scaling patterns responsibly', 'Manage dependencies', 'Model dependencies with AI'],
    competencies: ['scrum:delivery-metrics', 'scrum:stakeholders'],
    competencyMapping: [{ competency: 'scrum:delivery-metrics', weight: 50 }, { competency: 'scrum:stakeholders', weight: 50 }],
    lessons: [
      { title: 'Scaling principles', summary: 'Descaling first; scaling patterns second.' },
      { title: 'Cross-team coordination', summary: 'Aligning many teams on one product.' },
      { title: 'Dependency management', summary: 'Reducing and managing dependencies.' },
      { title: 'Enterprise agility', summary: 'SAFe, LeSS, and pragmatic scaling.' },
    ],
    readings: ['Scaling Scrum', 'SAFe essentials', 'LeSS principles', 'Dependency management'],
    videos: ['Scaling principles', 'Cross-team coordination', 'Enterprise agility'],
    aiMentorActivities: ['AI models cross-team dependencies', 'AI drafts a scaling roadmap', 'AI role-plays a multi-team planning event'],
    lab: { name: 'AI Automation Lab', tool: 'Jira', task: 'Coordinate multi-team delivery', deliverable: 'Scaling Roadmap' },
    simulations: {
      beginner: sim('Two teams, one product', 'Global tech (squads)', ['POs', 'Devs'], 'Two teams, shared backlog', 'Misaligned priorities', ['Align POs', 'Coordinate cadences'], 'Scored on alignment'),
      intermediate: sim('Dependency gridlock', 'Global tech (squads)', ['Teams', 'Architects'], 'Heavy cross-team dependencies', 'Blocking dependencies', ['Surface + reduce dependencies', 'Coordinate delivery'], 'Scored on dependency reduction'),
      advanced: sim('Enterprise planning event', 'Global tech (squads)', ['Many teams', 'Execs'], 'Quarterly big-room planning', 'Conflicting commitments', ['Facilitate alignment', 'Make trade-offs transparent'], 'Scored on enterprise alignment'),
    },
    portfolioDeliverable: 'Scaling Roadmap + Jira Configuration',
    interviewPrep: { behavioral: ['Describe coordinating multiple teams.'], scenario: ['Cross-team dependencies block delivery — what do you do?'], leadership: ['How do you scale without bureaucracy?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'SAFe', 'Enterprise Agile', 'PSM II'],
  },
  {
    no: 17, title: 'AI for the Scrum Master', phase: 'AI & Capstone',
    learningObjectives: ['Master AI workflows across the role', 'Augment facilitation, analysis, and delivery with AI', 'Apply AI responsibly', 'Build an AI Scrum Master toolkit'],
    competencies: ['scrum:framework', 'scrum:delivery-metrics'],
    competencyMapping: [{ competency: 'scrum:framework', weight: 50 }, { competency: 'scrum:delivery-metrics', weight: 50 }],
    lessons: [
      { title: 'AI across the Scrum Master role', summary: 'Where AI helps — and where it doesn’t.' },
      { title: 'AI-augmented facilitation & analysis', summary: 'Standups, retros, refinement, metrics.' },
      { title: 'AI Scrum automations', summary: 'Workflows and prompts that save time.' },
      { title: 'Responsible AI', summary: 'Bias, privacy, and human judgment.' },
    ],
    readings: ['AI-enabled delivery', 'Responsible AI basics', 'Prompting for facilitation'],
    videos: ['AI for Scrum Masters', 'Building AI workflows', 'Responsible AI'],
    aiMentorActivities: ['Build an AI Scrum Master prompt library', 'Automate a retro synthesis workflow', 'Create an AI flow-metric analyzer'],
    lab: { name: 'AI Automation Lab', tool: 'GitHub', task: 'Assemble an AI Scrum Master toolkit (prompts + automations)', deliverable: 'AI Scrum Automation Workflow' },
    simulations: {
      beginner: sim('First AI workflow', 'AI-first startup', ['Team'], 'Team new to AI tools', 'Skepticism about AI', ['Introduce a safe AI workflow', 'Show value'], 'Scored on adoption'),
      intermediate: sim('AI-augmented delivery', 'AI-first startup', ['Team', 'PO'], 'AI in the delivery loop', 'Over-reliance risk', ['Augment, not replace', 'Keep human judgment'], 'Scored on responsible use'),
      advanced: sim('Scaling AI across teams', 'AI-first startup', ['Teams', 'Leaders'], 'AI adoption at scale', 'Governance + bias concerns', ['Set responsible-AI guardrails', 'Scale workflows'], 'Scored on responsible scaling'),
    },
    portfolioDeliverable: 'AI Scrum Automation Workflow',
    interviewPrep: { behavioral: ['Tell me about using AI to improve delivery.'], scenario: ['A team over-relies on AI outputs — what do you do?'], leadership: ['How do you adopt AI responsibly at scale?'], star },
    assessmentBlueprint: ASSESS, alignment: [...ALIGN_CORE, 'AI-enabled delivery', 'PSM II'],
  },
  {
    no: 18, title: 'Capstone: Career Transformation & Placement', phase: 'AI & Capstone',
    learningObjectives: ['Integrate all competencies in a capstone', 'Assemble the Aladiah Profile + portfolio', 'Complete full interview readiness', 'Demonstrate leadership readiness'],
    competencies: ['scrum:team-dynamics', 'scrum:stakeholders', 'scrum:delivery-metrics'],
    competencyMapping: [{ competency: 'scrum:team-dynamics', weight: 40 }, { competency: 'scrum:stakeholders', weight: 30 }, { competency: 'scrum:delivery-metrics', weight: 30 }],
    lessons: [
      { title: 'The capstone', summary: 'A 3-Sprint leadership turnaround case study.' },
      { title: 'Assembling your portfolio', summary: 'Curating evidence employers trust.' },
      { title: 'The Aladiah Profile', summary: 'Competency, simulation, and interview scores.' },
      { title: 'Interview & placement readiness', summary: 'From ready to hired.' },
    ],
    readings: ['Portfolio best practices', 'Interview frameworks', 'Career transformation'],
    videos: ['Building your capstone', 'Assembling your portfolio', 'Acing the interview'],
    aiMentorActivities: ['AI runs full mock interviews and scores them', 'AI reviews your portfolio for gaps', 'AI builds your Aladiah Profile narrative'],
    lab: { name: 'Capstone Portfolio Lab', tool: 'GitHub', task: 'Assemble the Aladiah Profile + portfolio', deliverable: 'Capstone Case Study + Aladiah Profile' },
    simulations: {
      beginner: sim('Capstone kickoff', 'Multi-stakeholder enterprise', ['Team', 'PO', 'Stakeholders'], 'Struggling team, 3 Sprints', 'Multiple problems at once', ['Diagnose the system', 'Plan the turnaround'], 'Scored on diagnosis + plan'),
      intermediate: sim('Capstone mid-point review', 'Multi-stakeholder enterprise', ['Execs', 'Team'], 'Mid-turnaround pressure', 'Stakeholders want faster results', ['Show empirical progress', 'Adapt the plan'], 'Scored on adaptation'),
      advanced: sim('Capstone leadership finale + mock interview', 'Multi-stakeholder enterprise', ['Execs', 'Hiring panel'], 'Final review + interview', 'High-stakes leadership + interview', ['Demonstrate transformation', 'Win the interview'], 'Scored on leadership + interview'),
    },
    portfolioDeliverable: 'Capstone Case Study + Aladiah Profile (full portfolio)',
    interviewPrep: { behavioral: ['Walk me through your biggest transformation.'], scenario: ['Lead a struggling team to delivery in three Sprints — how?'], leadership: ['Why should we hire you as our Scrum Master?'], star },
    assessmentBlueprint: { ...ASSESS, passing: 90 }, alignment: [...ALIGN_CORE, 'PSM II', 'SAFe', 'Agile Coaching', 'Enterprise Agile', 'AI-enabled delivery'],
  },
];

// ---------------------------------------------------------------------------
// Program-level metadata, totals, readiness tracks, and alignment.
// ---------------------------------------------------------------------------
export const AI_SCRUM_MASTER_PROGRAM_META = {
  name: 'AI Scrum Master Professional Certification',
  version: 'v1.0',
  standard: 'Aladiah Program Standard v1.0',
  githubPortfolioPath: 'github.com/{student}/aladiah-ai-scrum-master-portfolio (one folder per module → /module-XX/<deliverable>)',
  totals: {
    modules: 18,
    simulations: 54, // 18 × 3
    labs: 18,
    portfolioDeliverables: 18,
    moduleQuizzes: 18,
    competencyQuizzes: 18,
    finalCertification: 1,
    questionBank: 18 * 60, // 1080
  },
  readiness: {
    psm_i: { label: 'PSM I readiness', modules: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    psm_ii: { label: 'PSM II readiness', modules: [11, 12, 13, 14, 15, 16, 18] },
    ai_scrum_master: { label: 'AI Scrum Master readiness', modules: [1, 5, 6, 9, 15, 17] },
    agile_transformation: { label: 'Agile Transformation readiness', modules: [10, 13, 14, 16] },
    executive_scrum_master: { label: 'Executive Scrum Master readiness', modules: [13, 14, 15, 16, 18] },
  },
  alignment: ['Scrum Guide 2020', 'PSM I', 'PSM II', 'SAFe', 'Agile Coaching', 'Enterprise Agile', 'AI-enabled delivery'],
};
