// =============================================================================
// Product Builder Agent — artifact generators (deterministic, canon-compliant v1)
// Pure functions: inputs -> a draft artifact. No I/O, no AOS.
// Phase 2 swaps these for Claude (server-side edge function) behind the same
// artifact contract. Canon rules enforced here:
//   * every quiz question carries exactly ONE Axis-1 competency slug
//   * option text NEVER includes A)/B)/C)/D) prefixes (the quiz UI adds them)
// =============================================================================
import {
  ArtifactType,
  GenerateLabInput,
  GenerateLearningPathInput,
  GenerateModuleInput,
  GenerateProjectInput,
  GenerateQuizInput,
  GenerateSimulationInput,
  LabPayload,
  LearningPathPayload,
  ModulePayload,
  ProjectPayload,
  QuizPayload,
  QuizQuestion,
  SimulationPayload,
} from '@/types/product';
import { competenciesFor, isApprovedSlug, labelFor } from './taxonomy';

export interface DraftArtifact {
  artifact_type: ArtifactType;
  title: string;
  summary: string;
  program: string;
  competencies: string[];
  payload: Record<string, unknown>;
  quality_score: number;
}

// --- Question seed bank per Scrum competency (correct + 3 distractors) -------
const QUESTION_SEEDS: Record<string, { topic: string; correct: string; distractors: string[] }[]> = {
  'scrum:framework': [
    {
      topic: 'Scrum definition',
      correct: 'Scrum is a lightweight framework for delivering value through adaptive solutions to complex problems',
      distractors: [
        'Scrum is a rigid, phase-gated methodology that forbids changing requirements',
        'Scrum is a project plan that fixes scope, time, and cost up front',
        'Scrum is a documentation standard for software requirements',
      ],
    },
  ],
  'scrum:roles': [
    {
      topic: 'Scrum Master accountability',
      correct: 'The Scrum Master serves the team as a coach and removes impediments rather than assigning tasks',
      distractors: [
        'The Scrum Master assigns work to developers and tracks their utilization',
        'The Scrum Master owns the Product Backlog and prioritizes it',
        'The Scrum Master signs off on every code change before release',
      ],
    },
  ],
  'scrum:events': [
    {
      topic: 'Daily Scrum purpose',
      correct: 'The Daily Scrum is a 15-minute event for Developers to inspect progress toward the Sprint Goal and adapt the plan',
      distractors: [
        'The Daily Scrum is a status meeting where each person reports to the manager',
        'The Daily Scrum is where the Product Owner reprioritizes the entire backlog',
        'The Daily Scrum is an hour-long design review for stakeholders',
      ],
    },
  ],
  'scrum:artifacts': [
    {
      topic: 'Definition of Done',
      correct: 'The Definition of Done creates a shared understanding of what it means for the Increment to be complete',
      distractors: [
        'The Definition of Done is the Sprint deadline set by management',
        'The Definition of Done is the list of features promised to the customer',
        'The Definition of Done is a per-developer personal checklist that can differ each Sprint',
      ],
    },
  ],
  'scrum:empiricism': [
    {
      topic: 'Empirical pillars',
      correct: 'Scrum is founded on empiricism through transparency, inspection, and adaptation',
      distractors: [
        'Scrum is founded on detailed up-front prediction and fixed plans',
        'Scrum relies on command-and-control to guarantee outcomes',
        'Scrum avoids inspection to keep the team moving quickly',
      ],
    },
  ],
  'scrum:team-dynamics': [
    {
      topic: 'Servant leadership',
      correct: 'A Scrum Master fosters self-management by coaching the team rather than directing it',
      distractors: [
        'A Scrum Master maximizes control by approving every decision the team makes',
        'A Scrum Master improves performance by ranking developers against each other',
        'A Scrum Master resolves all conflicts by escalating them to management',
      ],
    },
  ],
  'scrum:stakeholders': [
    {
      topic: 'Stakeholder engagement',
      correct: 'The Scrum Master helps stakeholders engage through the right events, like the Sprint Review, to gather feedback',
      distractors: [
        'The Scrum Master shields the team by blocking all stakeholder contact permanently',
        'The Scrum Master lets stakeholders assign tasks directly to developers mid-Sprint',
        'The Scrum Master replaces the Product Owner in all stakeholder conversations',
      ],
    },
  ],
  'scrum:delivery-metrics': [
    {
      topic: 'Using metrics',
      correct: 'Flow metrics like velocity support forecasting and improvement, not individual performance targets',
      distractors: [
        'Velocity should be used to compare and rank teams against one another',
        'Velocity is a contractual commitment the team must hit every Sprint',
        'Burndown charts are used by managers to assign blame for missed work',
      ],
    },
  ],
};

function rotate<T>(arr: T[], by: number): T[] {
  const n = arr.length;
  const k = ((by % n) + n) % n;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

function buildQuestion(competency: string, seedIndex: number): QuizQuestion {
  const seeds = QUESTION_SEEDS[competency] ?? [];
  const label = labelFor(competency);
  const seed =
    seeds[seedIndex % Math.max(seeds.length, 1)] ?? {
      topic: label,
      correct: `Apply ${label} correctly in line with the Scrum Guide`,
      distractors: [
        `Ignore ${label} and rely on traditional command-and-control`,
        `Treat ${label} as optional documentation`,
        `Defer ${label} to management decisions`,
      ],
    };
  // Options without letter prefixes; rotate so the correct index varies.
  const ordered = [seed.correct, ...seed.distractors];
  const options = rotate(ordered, seedIndex + 1);
  const correct_index = options.indexOf(seed.correct);
  return {
    question: `Regarding ${label}: ${seed.topic} — which statement is most accurate?`,
    options,
    correct_index,
    competency, // exactly one approved slug, never null
    topic: seed.topic,
    explanation: `Correct per the Scrum Guide. This question assesses the "${label}" competency (${competency}).`,
  };
}

// --- Generators -------------------------------------------------------------

export function generateQuiz(input: GenerateQuizInput): DraftArtifact {
  const competency = isApprovedSlug(input.competency) ? input.competency : competenciesFor(input.program)[0]?.slug;
  const count = Math.max(1, input.questionCount ?? 4);
  const questions: QuizQuestion[] = Array.from({ length: count }, (_, i) => buildQuestion(competency, i));
  const payload: QuizPayload = { questions, pass_threshold: 70 };
  return {
    artifact_type: 'quiz',
    title: `Quiz: ${labelFor(competency)}`,
    summary: `${count}-question assessment for ${labelFor(competency)}.`,
    program: input.program,
    competencies: [competency],
    payload: payload as unknown as Record<string, unknown>,
    quality_score: 80,
  };
}

export function generateModule(input: GenerateModuleInput): DraftArtifact {
  const competency = isApprovedSlug(input.competency) ? input.competency : competenciesFor(input.program)[0]?.slug;
  const label = labelFor(competency);
  const payload: ModulePayload = {
    objectives: [
      `Explain the core ideas of ${label}`,
      `Apply ${label} in realistic Scrum situations`,
      `Recognize anti-patterns related to ${label}`,
    ],
    lessons: [
      { title: `Introduction to ${label}`, summary: `What ${label} means and why it matters.`, competency },
      { title: `${label} in practice`, summary: `Worked examples and facilitation tips.`, competency },
      { title: `Common pitfalls`, summary: `Anti-patterns and how to coach past them.`, competency },
    ],
    estimated_minutes: 35,
  };
  return {
    artifact_type: 'module',
    title: `Module: ${label}`,
    summary: `A competency-based module covering ${label}.`,
    program: input.program,
    competencies: [competency],
    payload: payload as unknown as Record<string, unknown>,
    quality_score: 78,
  };
}

export function generateSimulation(input: GenerateSimulationInput): DraftArtifact {
  const comps = competenciesFor(input.program);
  const scenario_type = input.scenarioType ?? 'stakeholder';
  const decisionComps = [
    comps.find((c) => c.slug === 'scrum:stakeholders')?.slug,
    comps.find((c) => c.slug === 'scrum:team-dynamics')?.slug,
    comps.find((c) => c.slug === 'scrum:events')?.slug,
  ].filter(Boolean) as string[];
  const payload: SimulationPayload = {
    scenario_type,
    scenario:
      'A key stakeholder pushes the team to add scope mid-Sprint and bypass the Product Owner. The team is anxious about the Sprint Goal.',
    roles: ['Scrum Master (you)', 'Product Owner', 'Senior Stakeholder', 'Developers'],
    decision_points: [
      {
        prompt: 'The stakeholder asks you to add work directly to the Sprint. What do you do?',
        options: [
          'Coach the stakeholder to work with the Product Owner and protect the Sprint Goal',
          'Add the work immediately to keep the stakeholder happy',
          'Tell the stakeholder Scrum forbids any conversation during the Sprint',
        ],
        competency: decisionComps[0] ?? comps[0]?.slug,
      },
      {
        prompt: 'Developers are stressed about the Sprint Goal. How do you respond?',
        options: [
          'Facilitate a focused conversation to re-plan toward the Sprint Goal',
          'Assign overtime to guarantee the original scope',
          'Escalate the team to management for underperformance',
        ],
        competency: decisionComps[1] ?? comps[0]?.slug,
      },
    ],
    scoring_rubric: decisionComps.map((slug) => ({ competency: slug, criteria: `Demonstrates sound judgment in ${labelFor(slug)}.` })),
  };
  return {
    artifact_type: 'simulation',
    title: `Simulation: Mid-Sprint stakeholder pressure`,
    summary: `A ${scenario_type} simulation assessing facilitation and stakeholder engagement.`,
    program: input.program,
    competencies: decisionComps,
    payload: payload as unknown as Record<string, unknown>,
    quality_score: 82,
  };
}

export function generateLab(input: GenerateLabInput): DraftArtifact {
  const comps = competenciesFor(input.program);
  const competency = comps.find((c) => c.slug === 'scrum:events')?.slug ?? comps[0]?.slug;
  const payload: LabPayload = {
    objective: `Facilitate a ${input.topic} effectively as a Scrum Master.`,
    steps: [
      `Prepare the ${input.topic}: purpose, timebox, participants`,
      `Run the event using a facilitation technique`,
      `Capture outcomes and action items`,
      `Reflect on what to improve next time`,
    ],
    deliverable: `A short facilitation plan and retrospective notes for the ${input.topic}.`,
    tools: ['Whiteboard/Miro', 'Timer', 'Team agreement'],
  };
  return {
    artifact_type: 'lab',
    title: `Lab: Facilitating the ${input.topic}`,
    summary: `Hands-on facilitation practice for the ${input.topic}.`,
    program: input.program,
    competencies: [competency],
    payload: payload as unknown as Record<string, unknown>,
    quality_score: 75,
  };
}

export function generateProject(input: GenerateProjectInput): DraftArtifact {
  const comps = competenciesFor(input.program);
  const payload: ProjectPayload = {
    brief:
      'Act as the Scrum Master for a struggling team for three Sprints. Diagnose impediments, coach the team, and improve flow.',
    requirements: [
      'Document the initial state and impediments',
      'Apply at least three coaching/facilitation interventions',
      'Show measurable improvement in flow metrics',
      'Reflect on outcomes against the Scrum values',
    ],
    rubric: comps.slice(0, 4).map((c) => ({ competency: c.slug, criteria: `Evidence of capability in ${c.label}.` })),
  };
  return {
    artifact_type: 'project',
    title: `Capstone: Coach a struggling Scrum team`,
    summary: `A capstone project demonstrating end-to-end Scrum Master capability.`,
    program: input.program,
    competencies: comps.slice(0, 4).map((c) => c.slug),
    payload: payload as unknown as Record<string, unknown>,
    quality_score: 80,
  };
}

// --- Career Transformation engine generators -------------------------------

export function generateAssessment(program: string): DraftArtifact {
  const comps = competenciesFor(program);
  const questions = comps.map((c, i) => buildQuestion(c.slug, i));
  return {
    artifact_type: 'assessment',
    title: `Diagnostic Assessment: ${program} competency baseline`,
    summary: `A competency-spanning diagnostic that measures mastery across all ${comps.length} ${program} competencies to personalize the career path.`,
    program,
    competencies: comps.map((c) => c.slug),
    payload: { questions, pass_threshold: 70, kind: 'diagnostic' } as unknown as Record<string, unknown>,
    quality_score: 82,
  };
}

export function generateInterviewPrep(program: string): DraftArtifact {
  const comps = competenciesFor(program);
  const focus = ['scrum:roles', 'scrum:team-dynamics', 'scrum:stakeholders', 'scrum:events'].filter((s) =>
    comps.some((c) => c.slug === s),
  );
  const questions = [
    { question: 'Tell me about a time you removed a major impediment for your team.', star_guidance: 'Situation, Task, Action (your facilitation), Result (flow improvement).', competency: 'scrum:team-dynamics' },
    { question: 'How do you handle a stakeholder who bypasses the Product Owner?', star_guidance: 'Show coaching + protecting the Sprint Goal.', competency: 'scrum:stakeholders' },
    { question: 'How do you coach a team toward self-management?', star_guidance: 'Servant leadership, not directing.', competency: 'scrum:roles' },
  ];
  return {
    artifact_type: 'interview_prep',
    title: `Interview Prep: ${program} role readiness`,
    summary: `Role-specific interview pack — competency-aligned questions, STAR guidance, and a scored mock-interview rubric to maximize offers.`,
    program,
    competencies: focus.length ? focus : comps.slice(0, 3).map((c) => c.slug),
    payload: {
      role: 'Scrum Master',
      questions,
      mock_rubric: questions.map((q) => ({ competency: q.competency, criteria: `Strong, structured answer demonstrating ${q.competency}.` })),
    } as unknown as Record<string, unknown>,
    quality_score: 84,
  };
}

export function generateCareerPlan(program: string, outcome = 'Land a Scrum Master role and grow into Agile leadership'): DraftArtifact {
  const comps = competenciesFor(program);
  return {
    artifact_type: 'career_plan',
    title: `Career Transformation Plan: ${program} → employment & growth`,
    summary: `An outcome-driven plan (Learn → Practice → Simulate → Validate → Interview → Place → Grow) targeting employment, salary growth, and promotion — career transformation, not course completion.`,
    program,
    competencies: comps.map((c) => c.slug),
    payload: {
      goal: outcome,
      target_role: 'Scrum Master',
      milestones: [
        { phase: 'Learn', activities: ['Complete competency modules'], outcome: 'competency_mastery' },
        { phase: 'Practice', activities: ['Labs + assessments'], outcome: 'competency_mastery' },
        { phase: 'Simulate', activities: ['Stakeholder + leadership simulations'], outcome: 'leadership_readiness' },
        { phase: 'Validate', activities: ['Capstone project + Aladiah Profile'], outcome: 'employment' },
        { phase: 'Interview', activities: ['Interview prep + mocks'], outcome: 'employment' },
        { phase: 'Place', activities: ['Employer alignment + matching'], outcome: 'employment' },
        { phase: 'Grow', activities: ['Leadership track'], outcome: 'promotion' },
      ],
    } as unknown as Record<string, unknown>,
    quality_score: 86,
  };
}

export function generateEmployerAlignment(program: string): DraftArtifact {
  const comps = competenciesFor(program);
  return {
    artifact_type: 'employer_alignment',
    title: `Employer Alignment: ${program} role requirements map`,
    summary: `Maps real Scrum Master job requirements to Aladiah competencies and an employer-readiness rubric, so capability is visible and trusted by employers.`,
    program,
    competencies: comps.map((c) => c.slug),
    payload: {
      role: 'Scrum Master',
      requirements: [
        { requirement: 'Facilitates all Scrum events effectively', competency: 'scrum:events' },
        { requirement: 'Coaches the team toward self-management', competency: 'scrum:team-dynamics' },
        { requirement: 'Manages stakeholders and removes impediments', competency: 'scrum:stakeholders' },
        { requirement: 'Uses flow metrics for improvement', competency: 'scrum:delivery-metrics' },
      ],
      readiness_rubric: comps.map((c) => ({ competency: c.slug, criteria: `Employer-ready evidence of ${c.label}.` })),
    } as unknown as Record<string, unknown>,
    quality_score: 83,
  };
}

export function generateAIReadiness(program: string): DraftArtifact {
  const comps = competenciesFor(program);
  return {
    artifact_type: 'ai_readiness',
    title: `AI Readiness: AI-augmented ${program} practitioner`,
    summary: `Builds AI-readiness atop ${program} competency — using AI tools to facilitate, analyze flow, and accelerate delivery, with measurable AI-fluency outcomes.`,
    program,
    competencies: comps.slice(0, 4).map((c) => c.slug),
    payload: {
      ai_skills: ['Prompting for facilitation', 'AI-assisted backlog refinement', 'AI flow-metric analysis', 'AI retrospective synthesis'],
      practices: ['Use an AI coach during simulations', 'AI feedback on interview answers'],
      assessment: 'Scored AI-readiness checkpoint mapped to competency application.',
    } as unknown as Record<string, unknown>,
    quality_score: 81,
  };
}

export function generateOutcomePlan(program: string): DraftArtifact {
  const comps = competenciesFor(program);
  return {
    artifact_type: 'outcome_plan',
    title: `Outcome Improvement Plan: ${program}`,
    summary: `Targets the six transformation outcomes (employment, promotion, salary growth, leadership readiness, AI readiness, competency mastery) and prioritizes the work that moves them.`,
    program,
    competencies: comps.map((c) => c.slug),
    payload: {
      outcomes: [
        { metric: 'employment', actions: ['Ship interview-prep + employer-alignment artifacts'] },
        { metric: 'leadership_readiness', actions: ['Add leadership simulations'] },
        { metric: 'ai_readiness', actions: ['Embed AI-readiness module'] },
        { metric: 'competency_mastery', actions: ['Close weak competency coverage'] },
      ],
    } as unknown as Record<string, unknown>,
    quality_score: 80,
  };
}

export function generateLearningPath(input: GenerateLearningPathInput): DraftArtifact {
  const comps = competenciesFor(input.program);
  const steps: LearningPathPayload['steps'] = comps.map((c, i) => ({
    order: i + 1,
    type: (i % 2 === 0 ? 'module' : 'quiz') as ArtifactType,
    title: `${i % 2 === 0 ? 'Learn' : 'Assess'}: ${c.label}`,
    competency: c.slug,
  }));
  steps.push({ order: steps.length + 1, type: 'simulation', title: 'Simulate: stakeholder pressure', competency: 'scrum:stakeholders' });
  steps.push({ order: steps.length + 1, type: 'project', title: 'Capstone project', competency: 'scrum:team-dynamics' });
  const payload: LearningPathPayload = {
    outcome: input.outcome ?? 'Become an employable, job-ready Scrum Master',
    steps,
  };
  return {
    artifact_type: 'learning_path',
    title: `Learning Path: ${input.program} → ${payload.outcome}`,
    summary: `An outcome-driven path across all ${comps.length} competencies, ending in simulation + capstone.`,
    program: input.program,
    competencies: comps.map((c) => c.slug),
    payload: payload as unknown as Record<string, unknown>,
    quality_score: 85,
  };
}
