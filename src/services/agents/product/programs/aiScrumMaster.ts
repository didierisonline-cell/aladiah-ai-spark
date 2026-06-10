// =============================================================================
// AI-Powered Scrum Master — Career Transformation Program (blueprint)
// =============================================================================
// Redesign of the current 4-module Scrum Master course into a world-class AI
// Scrum Master Career Transformation Program, expressed using Aladiah's Career
// Transformation Architecture. This is DATA ONLY — the builder in
// productBuilderAgent.ts turns it into Product Builder artifacts (quality-gated,
// engine-tagged) that land in the Founder Approval Queue. It NEVER overwrites the
// live curriculum.
//
// Competency slugs are the canonical Axis-1 slugs (COMPETENCY_TAXONOMY.md),
// distributed so all 8 are covered across the 4 modules. AI is woven from start
// to finish, and every module supports all six transformation outcomes.
// =============================================================================

export interface TalentScoreImpact {
  dimension: string;
  points: number;
}
export interface AIWorkflow {
  name: string;
  description: string;
}
export interface ProgramLesson {
  title: string;
  summary: string;
  competency: string;
}
export interface ProgramModule {
  no: number;
  title: string;
  missionBriefing: string;
  competencies: string[];
  objectives: string[];
  lessons: ProgramLesson[];
  aiWorkflows: AIWorkflow[];
  labTopic: string;
  simulationTitle: string;
  portfolioTitle: string;
  portfolioBrief: string;
  interviewTitle: string;
  interviewFocus: string;
  employerTitle: string;
  employerNote: string;
  careerReadiness: string;
  talentScoreImpact: TalentScoreImpact[];
}
export interface ProgramBlueprint {
  program: string;
  key: string;
  title: string;
  outcome: string;
  modules: ProgramModule[];
}

export const AI_SCRUM_MASTER_PROGRAM: ProgramBlueprint = {
  program: 'scrum',
  key: 'ai-scrum-master',
  title: 'AI-Powered Scrum Master Professional Certification',
  outcome: 'Become an employable, AI-augmented Scrum Master and grow into Agile leadership.',
  modules: [
    {
      no: 1,
      title: 'The AI-Augmented Scrum Master — Role & Foundations',
      missionBriefing:
        'Your mission: step into the Scrum Master accountability with confidence and an AI co-pilot. By the end of this module you can explain what Scrum is, distinguish the Scrum Master from a project manager, and coach a team toward self-management — augmented by AI from day one. This is the foundation of your career transformation, not a video to finish.',
      competencies: ['scrum:framework', 'scrum:roles', 'scrum:team-dynamics', 'scrum:empiricism'],
      objectives: [
        'Explain Scrum as a lightweight framework for complex work',
        'Differentiate the Scrum Master accountability from traditional project management',
        'Apply servant-leadership to coach a team toward self-management',
        'Use AI tools to accelerate facilitation and impediment handling',
      ],
      lessons: [
        { title: 'What Scrum really is (and is not)', summary: 'Scrum as an empirical framework; Scrum vs. waterfall; when to use it.', competency: 'scrum:framework' },
        { title: 'The Scrum Master accountability', summary: 'Servant leader, coach, impediment-remover — not a task assigner.', competency: 'scrum:roles' },
        { title: 'Servant leadership & team dynamics', summary: 'Coaching vs. mentoring, psychological safety, self-management.', competency: 'scrum:team-dynamics' },
        { title: 'Empiricism: transparency, inspection, adaptation', summary: 'The pillars and Scrum values that underpin everything.', competency: 'scrum:empiricism' },
      ],
      aiWorkflows: [
        { name: 'AI Daily Scrum Assistant', description: 'Summarize standup notes, surface blockers, and draft a focused plan toward the Sprint Goal.' },
        { name: 'AI Impediment Triage', description: 'Classify and prioritize impediments, and suggest removal strategies grounded in Scrum.' },
        { name: 'AI Coaching Companion', description: 'Rehearse coaching conversations with an AI role-player and get feedback on facilitative language.' },
      ],
      labTopic: 'Daily Scrum',
      simulationTitle: 'New Scrum Master: earning the team\'s trust in week one',
      portfolioTitle: 'Portfolio: Scrum Master Charter & Team Working Agreement',
      portfolioBrief: 'Produce a Scrum Master charter and a team working agreement that demonstrate your facilitation philosophy and AI-augmented practices — an employer-ready artifact.',
      interviewTitle: 'Interview Prep: Role & Foundations',
      interviewFocus: 'Behavioral questions on the Scrum Master role, servant leadership, and Scrum vs. traditional PM.',
      employerTitle: 'Employer Alignment: Associate/Junior Scrum Master',
      employerNote: 'Maps Module 1 capability to entry-level Scrum Master job requirements and the Aladiah Profile.',
      careerReadiness: 'Career outcome: ready to step into an associate/junior Scrum Master role with AI-augmented facilitation skills.',
      talentScoreImpact: [
        { dimension: 'competency_mastery', points: 20 },
        { dimension: 'ai_readiness', points: 15 },
        { dimension: 'leadership_readiness', points: 10 },
        { dimension: 'employment', points: 10 },
      ],
    },
    {
      no: 2,
      title: 'Scrum Events & Empirical Execution (AI-Facilitated)',
      missionBriefing:
        'Your mission: facilitate a full Sprint independently, using AI to plan, run, and improve every event. You will master the Sprint and the four events and learn to inspect-and-adapt with AI assistance — turning ceremonies into outcomes.',
      competencies: ['scrum:events', 'scrum:empiricism'],
      objectives: [
        'Facilitate the Sprint and all four events with clear purpose and timeboxes',
        'Run empirical inspect-and-adapt cycles',
        'Use AI to forecast, synthesize retrospectives, and prep reviews',
        'Recognize and coach past common event anti-patterns',
      ],
      lessons: [
        { title: 'The Sprint & Sprint Planning', summary: 'Purpose, the Sprint Goal, capacity, and a strong plan.', competency: 'scrum:events' },
        { title: 'Daily Scrum done right', summary: 'A 15-minute inspect-and-adapt for the Developers — not a status meeting.', competency: 'scrum:events' },
        { title: 'Sprint Review & Retrospective', summary: 'Gather feedback, then improve the system empirically.', competency: 'scrum:empiricism' },
      ],
      aiWorkflows: [
        { name: 'AI Sprint Planning Forecaster', description: 'Analyze historical flow to suggest a realistic Sprint forecast and risks.' },
        { name: 'AI Retrospective Synthesizer', description: 'Cluster retro inputs into themes and propose high-leverage experiments.' },
        { name: 'AI Review Prep', description: 'Draft a crisp Sprint Review narrative tied to the Sprint Goal and stakeholder value.' },
      ],
      labTopic: 'Sprint Retrospective',
      simulationTitle: 'Rescuing a failing Sprint mid-cycle',
      portfolioTitle: 'Portfolio: Five-Event Facilitation Playbook',
      portfolioBrief: 'Create a facilitation playbook for all five events (purpose, timebox, agenda, AI assist) — proof you can run Scrum end to end.',
      interviewTitle: 'Interview Prep: Events & Facilitation',
      interviewFocus: 'Scenario questions on facilitating events, handling anti-patterns, and empiricism.',
      employerTitle: 'Employer Alignment: Mid-level Scrum Master (Facilitation)',
      employerNote: 'Maps Module 2 capability to facilitation-heavy Scrum Master job requirements.',
      careerReadiness: 'Career outcome: ready to facilitate a full Sprint independently and run effective events.',
      talentScoreImpact: [
        { dimension: 'competency_mastery', points: 20 },
        { dimension: 'ai_readiness', points: 15 },
        { dimension: 'leadership_readiness', points: 12 },
        { dimension: 'employment', points: 12 },
      ],
    },
    {
      no: 3,
      title: 'Artifacts, Commitments & Delivery Metrics (AI-Driven)',
      missionBriefing:
        'Your mission: own the Scrum artifacts and use flow metrics — with AI — to drive continuous improvement. You will master the Product Backlog, Sprint Backlog, Increment, their commitments, and the metrics that forecast delivery (never as performance targets).',
      competencies: ['scrum:artifacts', 'scrum:delivery-metrics'],
      objectives: [
        'Steward the Product Backlog, Sprint Backlog, and Increment',
        'Apply the Definition of Done and the commitments',
        'Use velocity, burndown/burnup, and flow metrics for forecasting and improvement',
        'Use AI to refine the backlog and analyze flow',
      ],
      lessons: [
        { title: 'Artifacts & their commitments', summary: 'Product/Sprint Backlog, Increment, Product Goal, Sprint Goal, Definition of Done.', competency: 'scrum:artifacts' },
        { title: 'A strong Definition of Done', summary: 'Shared understanding of complete; transparency and quality.', competency: 'scrum:artifacts' },
        { title: 'Flow & delivery metrics', summary: 'Velocity, burndown/burnup, forecasting — for improvement, not targets.', competency: 'scrum:delivery-metrics' },
      ],
      aiWorkflows: [
        { name: 'AI Backlog Refinement', description: 'Draft and split user stories, generate acceptance criteria, and flag dependencies.' },
        { name: 'AI Flow-Metric Analyst', description: 'Compute and interpret flow metrics, highlighting bottlenecks and trends.' },
        { name: 'AI Forecasting', description: 'Produce probabilistic delivery forecasts from historical data.' },
      ],
      labTopic: 'Definition of Done & Backlog Refinement',
      simulationTitle: 'Stakeholder pressure: scope vs. the Definition of Done',
      portfolioTitle: 'Portfolio: Delivery Metrics Dashboard + Definition of Done',
      portfolioBrief: 'Build a metrics dashboard and a Definition of Done artifact that prove you can manage artifacts and use data to improve flow.',
      interviewTitle: 'Interview Prep: Artifacts & Metrics',
      interviewFocus: 'Questions on artifacts, the Definition of Done, and using metrics responsibly.',
      employerTitle: 'Employer Alignment: Delivery-focused Scrum Master',
      employerNote: 'Maps Module 3 capability to delivery- and metrics-focused Scrum Master roles.',
      careerReadiness: 'Career outcome: ready to own artifacts and use metrics to drive measurable improvement.',
      talentScoreImpact: [
        { dimension: 'competency_mastery', points: 22 },
        { dimension: 'ai_readiness', points: 16 },
        { dimension: 'leadership_readiness', points: 12 },
        { dimension: 'salary_growth', points: 10 },
      ],
    },
    {
      no: 4,
      title: 'Stakeholders, Leadership & Career Launch (AI Agile Leader)',
      missionBriefing:
        'Your mission: lead beyond the team — engage stakeholders, drive organizational change, and launch your career. You will integrate everything into a capstone, build your Aladiah Profile, and complete full interview readiness to get hired and grow into Agile leadership.',
      competencies: ['scrum:stakeholders', 'scrum:team-dynamics'],
      objectives: [
        'Engage stakeholders and the Product Owner effectively',
        'Drive organizational change and remove systemic impediments',
        'Demonstrate leadership readiness through a capstone',
        'Use AI to draft stakeholder communications and map organizational impediments',
      ],
      lessons: [
        { title: 'Stakeholder & organizational engagement', summary: 'Working with stakeholders and the PO; the right events for feedback.', competency: 'scrum:stakeholders' },
        { title: 'Organizational change & impediments', summary: 'Removing impediments beyond the team; influencing without authority.', competency: 'scrum:stakeholders' },
        { title: 'Leadership, conflict & scaling', summary: 'Emotional intelligence, conflict resolution, and scaling healthy teams.', competency: 'scrum:team-dynamics' },
      ],
      aiWorkflows: [
        { name: 'AI Stakeholder Communications', description: 'Draft tailored, professional stakeholder updates and manage expectations.' },
        { name: 'AI Org-Impediment Mapping', description: 'Map systemic impediments and propose change strategies.' },
        { name: 'AI Leadership Coach', description: 'Rehearse difficult leadership conversations and get feedback.' },
      ],
      labTopic: 'Stakeholder Engagement Plan',
      simulationTitle: 'Leading through organizational change with conflicting stakeholders',
      portfolioTitle: 'Capstone Portfolio: 3-Sprint Transformation Case Study + Aladiah Profile',
      portfolioBrief: 'Capstone: document a 3-Sprint turnaround as a Scrum Master and assemble your Aladiah Profile — the employer-trusted proof of capability.',
      interviewTitle: 'Interview Prep: Senior/Leadership + Full Mock',
      interviewFocus: 'Full mock interview: stakeholder leadership, change, and senior Scrum Master scenarios.',
      employerTitle: 'Employer Alignment: Senior Scrum Master / Agile Lead',
      employerNote: 'Maps the full program to senior Scrum Master / Agile lead requirements and the Aladiah Profile.',
      careerReadiness: 'Career outcome: ready for employment as a Scrum Master and positioned for promotion into Agile leadership.',
      talentScoreImpact: [
        { dimension: 'competency_mastery', points: 22 },
        { dimension: 'leadership_readiness', points: 20 },
        { dimension: 'employment', points: 20 },
        { dimension: 'promotion', points: 12 },
        { dimension: 'ai_readiness', points: 14 },
      ],
    },
  ],
};
