// =============================================================================
// BA Simulation 1 — "Aurora Retail: The Returns Problem" — scenario data.
// Mirrors the Scrum "Project Nebula" SimulationTypes pattern (personas + phases +
// scoring + seeded inputs). Pure data/types — no DB or network dependency, so it
// builds clean and is reusable by the page, the (future) ba-simulation edge
// function, and scoring. Architecture: docs/curriculum/business-analyst-v1/
// simulations/01_DISCOVERY_ENGAGEMENT_BLUEPRINT.md.
//
// Design intent: there is NO single answer key. The learner discovers the real
// problem from ambiguous, conflicting inputs and is scored on evidence-based
// reasoning across 9 ba: competency slugs.
// =============================================================================

export interface Persona {
  name: string;
  role: string;
  avatar: string;
  statedGoal: string;
  hiddenAgenda: string;      // not shown to the learner up front; drives AI behavior + scoring
  stance: 'sponsor' | 'ally' | 'skeptic' | 'blocker' | 'solution-first';
}

export interface DiscoveryPhase {
  id: string;
  name: string;
  description: string;
  competencies: string[];    // ba: slugs exercised in this phase
}

export interface ScoringDimension {
  key: string;
  label: string;
  weight: number;            // sums to 100
  competencies: string[];
}

export interface InboxItem {
  id: string;
  from: string;
  subject: string;
  body: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SeedNote {
  id: string;
  source: string;            // who/where it came from
  text: string;
  reliability: 'firsthand' | 'secondhand' | 'contradictory';
}

export interface FloatingRequirement {
  id: string;
  text: string;
  raisedBy: string;
  tension: string;           // why it conflicts with another requirement
}

export interface EvidenceMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

// --- Scenario header -------------------------------------------------------
export const BA_SCENARIO = {
  id: 'aurora-returns',
  company: 'Aurora Retail Group',
  title: 'The Returns Problem',
  role: 'Business Analyst',
  sponsor: 'Diane Okafor (VP Operations)',
  brief:
    "Diane Okafor, VP Operations, has pulled you in: \"Our returns process is a mess — customers " +
    "are unhappy and costs keep climbing. Fix it. I need something I can take to the board next " +
    "quarter.\" There is no defined scope, no agreed problem statement, and several departments " +
    "have very different ideas about what \"fixing returns\" means. Your job is to run discovery, " +
    "find the real problem, and produce an evidence-based recommendation — not to build the first " +
    "solution someone suggests.",
};

// --- Stakeholders (AI-driven; hidden agendas drive behavior + scoring) -----
export const BA_PERSONAS: Persona[] = [
  { name: 'Diane Okafor', role: 'VP Operations (Sponsor)', avatar: '👔', stance: 'sponsor',
    statedGoal: 'Cut the cost of returns', hiddenAgenda: 'Wants a quick, visible win to present to the board this quarter' },
  { name: 'Marcus Bell', role: 'Head of Customer Service', avatar: '🎧', stance: 'ally',
    statedGoal: 'Make returns easier and faster for customers', hiddenAgenda: 'Fears any "efficiency" project means headcount cuts on his team' },
  { name: 'Priya Nair', role: 'Finance Controller', avatar: '📊', stance: 'skeptic',
    statedGoal: 'Control cost and keep a clean audit trail', hiddenAgenda: 'SOX/audit requirements are non-negotiable; distrusts "move fast" projects' },
  { name: 'Jonah Klein', role: 'Legal & Privacy Officer', avatar: '⚖️', stance: 'blocker',
    statedGoal: 'Keep us compliant', hiddenAgenda: 'Will veto anything that retains customer data beyond the privacy policy' },
  { name: 'Rosa Mendez', role: 'Store Operations Manager', avatar: '🏬', stance: 'skeptic',
    statedGoal: "Don't disrupt the stores", hiddenAgenda: 'Burned by two failed projects; resistant until she trusts you' },
  { name: 'Tunde Familusi', role: 'E-commerce Product Lead', avatar: '💻', stance: 'solution-first',
    statedGoal: 'Build a slick self-service returns portal', hiddenAgenda: 'Jumps straight to features; has not validated the underlying problem' },
];

// --- The 8-phase discovery flow --------------------------------------------
export const BA_PHASES: DiscoveryPhase[] = [
  { id: 'plan', name: 'Plan Discovery', description: 'Choose whom to interview and design your questions.', competencies: ['ba:elicitation', 'ba:stakeholders'] },
  { id: 'interview', name: 'Conduct Interviews', description: 'Interview stakeholders; uncover real needs, conflicts, and hidden agendas.', competencies: ['ba:elicitation', 'ba:stakeholders'] },
  { id: 'synthesize', name: 'Synthesize & Validate', description: 'Capture findings to the Evidence Board (each linked to a source); use AI to cluster, then validate for contradictions and hallucinated "facts".', competencies: ['ba:ai-analysis', 'ba:ai-prompting', 'ba:requirements'] },
  { id: 'model', name: 'Model Current State', description: 'Assemble an as-is BPMN of the returns process.', competencies: ['ba:process-analysis'] },
  { id: 'opportunities', name: 'Identify Opportunities', description: 'Turn validated findings into an opportunity set.', competencies: ['ba:product-discovery'] },
  { id: 'prioritize', name: 'Prioritize', description: 'Rank opportunities by value, effort, and evidence strength.', competencies: ['ba:product-thinking', 'ba:solution-eval'] },
  { id: 'compliance', name: 'Compliance Check', description: 'Confirm the recommendation respects data-retention/privacy and audit constraints.', competencies: ['ba:compliance'] },
  { id: 'recommendation', name: 'Recommendation', description: 'Assemble the Executive Discovery Report with an evidence-backed recommendation.', competencies: ['ba:solution-eval', 'ba:stakeholders'] },
];

// --- Scoring (weights sum to 100) → maps to the skills report --------------
export const BA_SCORING: ScoringDimension[] = [
  { key: 'elicitation', label: 'Elicitation quality', weight: 18, competencies: ['ba:elicitation'] },
  { key: 'stakeholders', label: 'Stakeholder navigation', weight: 15, competencies: ['ba:stakeholders'] },
  { key: 'synthesis', label: 'Synthesis & evidence rigor', weight: 18, competencies: ['ba:ai-analysis', 'ba:requirements'] },
  { key: 'current_state', label: 'Current-state accuracy', weight: 12, competencies: ['ba:process-analysis'] },
  { key: 'prioritization', label: 'Opportunity & prioritization', weight: 17, competencies: ['ba:product-discovery', 'ba:product-thinking'] },
  { key: 'compliance', label: 'Compliance awareness', weight: 8, competencies: ['ba:compliance'] },
  { key: 'recommendation', label: 'Recommendation & communication', weight: 12, competencies: ['ba:solution-eval'] },
];

export const BA_PASS_SCORE = 80;
export const BA_DISTINCTION_SCORE = 92;

// --- Seeded inputs the learner receives at start ---------------------------
export const BA_INBOX: InboxItem[] = [
  { id: 'm1', from: 'Diane Okafor', subject: 'Returns — need this fixed', priority: 'High',
    body: 'Costs are up 30% YoY and the board is asking questions. I need a recommendation in three weeks. Make it count.' },
  { id: 'm2', from: 'Marcus Bell', subject: 'Customers are furious', priority: 'High',
    body: "Refund times are all over the place — some get money back in 2 days, some wait 3 weeks. My team takes the heat. Please don't just automate us out of a job." },
  { id: 'm3', from: 'Priya Nair', subject: 'Whatever you propose…', priority: 'Medium',
    body: 'Any change has to preserve a complete audit trail of every refund. Finance will not sign off otherwise.' },
  { id: 'm4', from: 'Tunde Familusi', subject: 'I already have the answer', priority: 'Medium',
    body: 'We just need a self-service returns portal. I can have designs next week — can we skip the analysis and start building?' },
];

export const BA_NOTES: SeedNote[] = [
  { id: 'n1', source: 'Prior consultant deck (6 mo old)', text: 'Root cause is "the warehouse is slow."', reliability: 'secondhand' },
  { id: 'n2', source: 'Store manager hallway comment', text: 'Half the returns are items bought online and returned in-store; the systems don\'t talk to each other.', reliability: 'firsthand' },
  { id: 'n3', source: 'Customer service log summary', text: 'Most complaints are about refund *timing*, not the return itself.', reliability: 'firsthand' },
  { id: 'n4', source: 'Finance email', text: 'Returns cost is high because of restocking and fraud write-offs.', reliability: 'contradictory' },
];

export const BA_REQUIREMENTS: FloatingRequirement[] = [
  { id: 'r1', text: 'Build a self-service returns portal', raisedBy: 'Tunde Familusi', tension: 'Solution-first; no validated problem behind it' },
  { id: 'r2', text: 'Refunds must be instant', raisedBy: 'Marcus Bell', tension: 'Conflicts with Finance\'s fraud-control and audit needs' },
  { id: 'r3', text: 'Keep full customer purchase history indefinitely for fraud checks', raisedBy: 'Finance', tension: 'Conflicts with Legal\'s data-retention/privacy limits' },
  { id: 'r4', text: 'No new steps for store staff', raisedBy: 'Rosa Mendez', tension: 'May conflict with a unified online/in-store returns flow' },
];

export const BA_EVIDENCE: EvidenceMetric[] = [
  { id: 'e1', label: 'Returns cost YoY', value: '+30%', note: 'Driver not yet isolated' },
  { id: 'e2', label: 'Avg refund time', value: '2–21 days', note: 'High variance — a signal' },
  { id: 'e3', label: 'Online-bought / in-store returns', value: '~48%', note: 'Cross-channel friction' },
  { id: 'e4', label: 'Complaints about refund timing', value: '63%', note: 'Vs 18% about the return itself' },
];

export const BA_COMPLIANCE_CONSTRAINT =
  'Customer personal data may only be retained per the published privacy policy (GDPR-style); ' +
  'every refund must keep a complete, tamper-evident audit trail (SOX-style). Any recommendation ' +
  'that violates either will be vetoed.';
