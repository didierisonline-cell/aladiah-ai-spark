// =============================================================================
// The Institutional Registry — the constitutional catalog of the Institution.
// (Founder authorization 2026-07-02, under the ratified Capability Genome
// Standard v2.0.) Not an inventory: a collection of governed Capability
// Genomes. No capability enters without a complete genome (Amendment VI);
// every genome validates against V1–V12 in CI; the whole catalog mirrors to
// the Company Brain and surfaces on the Founder Cockpit.
//
// First generation (per the ratification package): the Shadow Curriculum
// Factory first — 44 seeder genomes with evidence-derived flags (37 unknown,
// whose maturity is LOCKED at 0 by V4 until the founder walk) — then the 25
// operational edge functions, the flagship program (the worked example made
// real), and the Registry itself (self-cataloged, as the standard requires).
// =============================================================================
import {
  CapabilityGenome,
  GenomeLifecycle,
  computeMaturity,
  validateGenome,
  MISSING,
} from './genome';
import { SHADOW_SEEDERS, OPERATIONAL_EDGE_FUNCTIONS } from './edgeFunctionManifest';
import { DASHBOARD_PAGES } from './pageManifest';
import { GOVERNING_DOCUMENTS, GoverningDocument } from './governance';
import { recordDecision, listBrain, BrainEntry } from './brain';
import { db, safe } from './_internal';

const D = '2026-07-02';

// ---- Factories (DRY, honest defaults) ---------------------------------------
function baseGenome(partial: Partial<CapabilityGenome> & Pick<CapabilityGenome, 'id' | 'mission' | 'purpose' | 'type' | 'classification' | 'owner' | 'department' | 'authority' | 'constitutionalAuthority'>): CapabilityGenome {
  const g: CapabilityGenome = {
    institute: null,
    constitutionVolumes: ['02'],
    founderStandards: { na: 'Volume II reserved; LAUNCH_DECISION_PRINCIPLE governs directly' },
    referenceModel: MISSING,
    playbook: MISSING,
    standards: ['capability-genome-standard'],
    dashboardSpec: MISSING,
    workforceSpec: MISSING,
    kpiDictionary: MISSING,
    dependencies: [],
    inputs: [],
    outputs: [],
    security: { level: 'founder', posture: 'unreviewed', gateChain: null },
    accessibility: 'n/a',
    translation: 'n/a',
    qaStatus: 'untested',
    workforce: [],
    kpis: MISSING,
    maturity: 0,
    lifecycle: 'draft',
    lastReview: D,
    nextReview: '2026-07-16',
    parentCapability: null,
    childCapabilities: [],
    derivedFrom: 'none',
    supersedes: 'none',
    replacedBy: null,
    founderDirectives: [],
    engineeringDecisions: [],
    architectureDecisions: [],
    createdOn: D,
    ratifiedOn: null,
    retiredOn: null,
    evolution: [{ on: D, kind: 'created', by: 'operations-platform', evidence: 'First-generation genome from the FD-2026-003 inventory + Phase-0 classification.' }],
    improvementHistory: [],
    ...partial,
    brainLink: `genome:${partial.id}:v1`,
  };
  g.maturity = computeMaturity(g);
  return g;
}

/** Shadow Curriculum Factory — genome per seeder, flags from filesystem evidence. */
function seederGenome(s: (typeof SHADOW_SEEDERS)[number]): CapabilityGenome {
  const unknown = s.classification === 'unknown';
  return baseGenome({
    id: `edge-function:${s.slug}`,
    mission: 'Undetermined — capability discovered outside the constitutional pipeline (F-1).',
    purpose: unknown
      ? 'Unknown course seeder awaiting founder-walk determination (deployment status + invocation logs).'
      : 'Legacy course seeder superseded by the founder-applied migration publish flow.',
    type: 'edge-function',
    classification: s.classification,
    owner: 'founder', // unresolved capabilities answer to the founder until assigned
    department: 'founder',
    authority: 'informational',
    constitutionalAuthority: 'launch-decision-principle',
    lifecycle: unknown ? 'draft' : 'deprecated',
    security: {
      level: 'secret', // conservatively: can write production content
      posture: `${s.publishes ? 'PUBLISH-DIRECT (is_published:true)' : 'writes drafts'}${s.destructive ? ' · DESTRUCTIVE (deletes existing course before re-insert)' : ''}`,
      gateChain: null, // truthful: no gate exists — which is precisely the finding
    },
    outputs: [{
      name: 'course + chapters + lessons + quizzes',
      kind: 'artifact',
      // Truth, not aspiration: these DO write production without a gate.
      // V5 would reject this genome as a NEW capability; as a discovered one
      // it enters with writesProduction acknowledged and gate 'quarantine':
      // the founder walk is the gate until each is retired or governed.
      writesProduction: true,
      approvalGate: 'QUARANTINE — founder walk required before any invocation (Phase-0 standing risk statement)',
    }],
    founderDirectives: ['FD-2026-003 (inventory)', 'Phase-0 classification'],
    evolution: [
      { on: '2026-05-15', kind: 'created', by: 'unknown', evidence: 'Pre-governance era; exact origin in git history of supabase/functions.' },
      { on: D, kind: 'migrated', by: 'operations-platform', evidence: `Cataloged by FD-2026-003 inventory; flags from reproducible grep (publishes=${s.publishes}, destructive=${s.destructive}).` },
    ],
  });
}

/** Operational edge functions — honest minimal genomes; specs are F-5 work. */
function operationalFnGenome(slug: string): CapabilityGenome {
  return baseGenome({
    id: `edge-function:${slug}`,
    mission: 'Serves the live platform (student, revenue, or operations path).',
    purpose: `Operational edge function '${slug}' — per-function spec pending (finding F-5).`,
    type: 'edge-function',
    classification: 'operational',
    owner: 'operations-platform',
    department: 'operations-platform',
    authority: 'operational',
    constitutionalAuthority: 'agent-operating-system',
    lifecycle: 'implemented',
    security: { level: 'student', posture: 'JWT/webhook-secured per SEC-001/2 hardening where applicable; per-function review pending', gateChain: 'deployed by founder via Supabase CLI' },
    workforce: [{ agent: 'operations-platform', role: 'stewards' }],
    evolution: [
      { on: '2026-06-01', kind: 'created', by: 'unknown', evidence: 'Pre-registry era; origin in git history.' },
      { on: D, kind: 'migrated', by: 'operations-platform', evidence: 'Cataloged by FD-2026-003 inventory.' },
    ],
  });
}

// ---- Named first-generation genomes ------------------------------------------
const flagshipProgram = baseGenome({
  id: 'program:ai-scrum-master-v3',
  mission: 'Transform learners into employable AI-era Scrum Masters (Covenant Art. V, XIII).',
  purpose: 'The flagship certification program proving the Aladiah career-transformation model.',
  type: 'program',
  classification: 'strategic',
  owner: 'curriculum-excellence',
  department: 'curriculum-excellence',
  authority: 'canonical',
  constitutionalAuthority: 'academic-canon',
  constitutionVolumes: ['02', '10'],
  referenceModel: 'docs/curriculum/PROGRAM_ARCHITECTURE.md',
  playbook: 'docs/governance/manuals/validation-walks/ba-flagship-walk.md',
  standards: ['capability-genome-standard', 'competency-taxonomy', 'qa-standard'],
  dashboardSpec: 'src/pages/founder/FounderReadiness.tsx',
  workforceSpec: 'docs/agents/curriculum-excellence/AGENT_SPEC.md',
  dependencies: ['standard:competency-taxonomy'],
  inputs: [
    { name: 'authored curriculum (docs/curriculum/scrum-master-v3)', kind: 'document' },
    { name: 'founder-applied publish migrations', kind: 'human-action' },
  ],
  outputs: [
    { name: 'published course + 18 modules + tagged questions', kind: 'artifact', writesProduction: true, approvalGate: 'QA review → founder-applied SQL → founder walk' },
    { name: 'competency-tagged attempt data', kind: 'data', writesProduction: true, approvalGate: 'student-driven via governed quiz engine (RLS)' },
  ],
  security: { level: 'student', posture: 'RLS per-user; founder-gated authoring', gateChain: 'QA→Security→Founder' },
  accessibility: 'posture',
  translation: 'partial',
  qaStatus: 'passing',
  workforce: [
    { agent: 'curriculum-excellence', role: 'stewards' },
    { agent: 'product-builder', role: 'operates' },
    { agent: 'qa-authority', role: 'reviews' },
  ],
  lifecycle: 'measured',
  lastReview: '2026-06-19',
  nextReview: '2026-09-19',
  parentCapability: 'department:curriculum-excellence',
  derivedFrom: ['edge-function:seed-scrum-course'],
  supersedes: ['edge-function:seed-scrum-course'],
  engineeringDecisions: ['publish-by-founder-applied-migration (canon)', '18-module blueprint'],
  architectureDecisions: ['competency snapshot at submit (append-only taxonomy)'],
  createdOn: '2026-06-19',
  evolution: [
    { on: '2026-05-01', kind: 'created', by: 'founder', evidence: 'seed-scrum-course era (git history)' },
    { on: '2026-06-19', kind: 'superseded', by: 'founder', evidence: 'flagship_scrum_18_modules migrations replace seeder output' },
    { on: '2026-06-19', kind: 'measured', by: 'qa-authority', evidence: 'FLAGSHIP_SCRUM_READINESS_AUDIT.md' },
  ],
  improvementHistory: [
    { on: '2026-06-19', kind: 'lesson-learned', by: 'curriculum-excellence', evidence: 'Seeder-era content lacked competency tags; v3 tags at insert (canon rule born here).' },
  ],
});

const curriculumDepartment = baseGenome({
  id: 'department:curriculum-excellence',
  mission: 'Make every Aladiah program world-class (Covenant Art. I, III).',
  purpose: 'The department that holds curriculum standards and delegates builds.',
  type: 'department',
  classification: 'operational',
  owner: 'curriculum-excellence',
  department: 'curriculum-excellence',
  authority: 'operational',
  constitutionalAuthority: 'department-charters',
  referenceModel: 'docs/agents/AGENT_OPERATING_SYSTEM.md',
  playbook: 'docs/agents/CONTINUOUS_IMPROVEMENT.md',
  workforceSpec: 'docs/agents/curriculum-excellence/AGENT_SPEC.md',
  standards: ['capability-genome-standard', 'qa-standard'],
  lifecycle: 'implemented',
  workforce: [{ agent: 'curriculum-excellence', role: 'operates' }],
});

const taxonomyStandard = baseGenome({
  id: 'standard:competency-taxonomy',
  mission: 'Trustworthy competency data — the root Core System (Architecture Principle).',
  purpose: 'The only approved source of competency slugs.',
  type: 'standard',
  classification: 'constitutional',
  owner: 'curriculum-excellence',
  department: 'curriculum-excellence',
  authority: 'constitutional',
  constitutionalAuthority: 'constitution',
  referenceModel: 'docs/standards/COMPETENCY_TAXONOMY.md',
  standards: ['capability-genome-standard'],
  lifecycle: 'institutionalized',
  ratifiedOn: '2026-06-21',
  evolution: [
    { on: '2026-06-14', kind: 'created', by: 'founder', evidence: 'Canonical taxonomy established.' },
    { on: '2026-06-21', kind: 'ratified', by: 'founder', evidence: 'Canon ratification era; V2 merged 2026-06-20 (#55).' },
  ],
});

const registrySelf = baseGenome({
  id: 'service:institutional-registry',
  mission: 'The Institution knows what it owns, who answers for it, and how mature it is (FD-002).',
  purpose: 'The constitutional catalog of governed Capability Genomes.',
  type: 'service',
  classification: 'constitutional',
  owner: 'operations-platform',
  department: 'operations-platform',
  authority: 'constitutional',
  constitutionalAuthority: 'aladiah-operating-system',
  referenceModel: 'docs/engineering/registry/01-reference-model.md',
  playbook: 'docs/engineering/registry/02-playbook.md',
  standards: ['capability-genome-standard'],
  dashboardSpec: 'docs/engineering/registry/04-dashboard-spec.md',
  workforceSpec: 'docs/engineering/registry/05-ai-workforce-spec.md',
  kpiDictionary: 'docs/engineering/registry/06-kpi-dictionary.md',
  outputs: [{ name: 'catalog + unknown queue + health', kind: 'data', writesProduction: false, approvalGate: null }],
  workforce: [
    { agent: 'operations-platform', role: 'operates' },
    { agent: 'analytics-intelligence', role: 'reviews' },
  ],
  kpis: [
    { key: 'registry-coverage', formula: 'discovered capabilities with genomes ÷ discovered', target: '100% (CI-enforced per class as classes onboard)', owner: 'operations-platform', cadence: 'every CI run', source: 'scanner tests' },
    { key: 'classification-coverage', formula: 'genomes ≠ unknown ÷ all genomes', target: '≥95% steady-state', owner: 'founder', cadence: 'weekly brief', source: 'registry' },
    { key: 'unknown-queue-age', formula: 'max days a genome stays unknown', target: '≤14 days', owner: 'founder', cadence: 'daily brief', source: 'registry' },
  ],
  founderDirectives: ['FD-002 (registry)', 'FD-2026-004 (genome ratification + authorization)'],
  lifecycle: 'implemented',
});

// ---- P1 migration factories (FD-2026-006) --------------------------------------
/** Governance documents ARE capabilities — bridged from the governance registry
 *  (one fact, one home: governance.ts stays the source; this adapts, never copies edits). */
function governanceDocGenome(d: GoverningDocument): CapabilityGenome {
  const lifecycle: GenomeLifecycle =
    d.status === 'ratified' ? 'institutionalized' : d.status === 'deprecated' ? 'deprecated' : 'governed';
  return baseGenome({
    id: `policy:${d.key}`,
    mission: 'Govern the Institution (constitutional framework).',
    purpose: d.purpose,
    type: 'policy',
    classification: d.authority === 'foundational' || d.authority === 'constitutional' ? 'constitutional' : 'strategic',
    owner: d.owner,
    department: d.owner === 'founder' ? 'founder' : d.owner,
    authority: d.authority,
    constitutionalAuthority: d.parent ?? 'covenant',
    referenceModel: d.path,
    lifecycle,
    ratifiedOn: d.ratified?.on ?? null,
    lastReview: d.lastReview,
    nextReview: d.nextReview,
    evolution: [
      { on: d.history[0]?.on ?? '2026-07-01', kind: 'created', by: d.history[0]?.by ?? d.owner, evidence: d.history[0]?.note ?? 'Governance registry record.' },
      ...(d.ratified ? [{ on: d.ratified.on, kind: 'ratified' as const, by: d.ratified.by, evidence: 'Governance registry ratification record.' }] : []),
    ],
  });
}

/** The 12 AI departments + 2 personas — the workforce as governed capabilities. */
const AI_ROLES: { slug: string; persona?: boolean }[] = [
  { slug: 'ceo-chief-of-staff' }, { slug: 'marketing-content' }, { slug: 'seo-strategy' },
  { slug: 'product-builder' }, { slug: 'qa-authority' }, { slug: 'admissions-authority' },
  { slug: 'student-success' }, { slug: 'placement-authority' }, { slug: 'analytics-intelligence' },
  { slug: 'operations-platform' }, { slug: 'curriculum-excellence' }, { slug: 'interface-experience' },
  { slug: 'prof-didier', persona: true }, { slug: 'career-simulation-engine', persona: true },
];

/**
 * Departmental KPI dictionaries — drawn STRICTLY from canon-stated primary
 * KPIs in each department's charter/system prompt (evidence cited). Where a
 * charter names no primary KPI, the dictionary stays honestly 'missing'.
 * Targets marked founder-set-pending are not invented.
 */
const CANON_KPIS: Record<string, { key: string; formula: string; target: string; owner: string; cadence: string; source: string }[]> = {
  'analytics-intelligence': [{
    key: 'ctis', formula: 'Career Transformation Impact Score — composite of student success, placement success, salary growth, certification success, competency growth, employer satisfaction (charter: PRIMARY KPI, master company KPI)',
    target: 'founder-set pending', owner: 'analytics-intelligence', cadence: 'daily CEO brief', source: 'analytics_reports.ctis',
  }],
  'placement-authority': [{
    key: 'student-placement-rate', formula: 'placed students ÷ placement-ready students (charter: PRIMARY KPI)',
    target: 'founder-set pending', owner: 'placement-authority', cadence: 'weekly', source: 'placements + placement_candidates',
  }],
  'student-success': [{
    key: 'career-transformation-score', formula: 'per-student CTS across competency mastery, readiness, employability (charter: PRIMARY KPI)',
    target: 'founder-set pending', owner: 'student-success', cadence: 'weekly', source: 'success_students + quiz_attempts',
  }],
  'product-builder': [{
    key: 'outcome-optimization', formula: 'six outcomes: employment, promotion, salary growth, leadership readiness, AI readiness, competency mastery — never course completion (charter)',
    target: 'founder-set pending', owner: 'product-builder', cadence: 'per artifact cycle', source: 'product_artifacts + QA verdicts',
  }],
  'admissions-authority': [{
    key: 'enrollment-quality', formula: 'program fit × completion probability × certification success × employment outcome — NOT volume (charter)',
    target: 'founder-set pending', owner: 'admissions-authority', cadence: 'weekly', source: 'admissions_prospects + enrollments',
  }],
  'marketing-content': [{
    key: 'qualified-enrollment-pipeline', formula: 'awareness → authority → leads → student enrollments (charter goal chain)',
    target: 'founder-set pending', owner: 'marketing-content', cadence: 'weekly', source: 'marketing_content.performance + admissions_leads',
  }],
  'qa-authority': [{
    key: 'gate-integrity', formula: 'artifacts passing QA ÷ reviewed; zero artifacts reaching founder queue un-reviewed (charter: final gate)',
    target: '100% gate coverage', owner: 'qa-authority', cadence: 'per review cycle', source: 'qa_reviews',
  }],
  'operations-platform': [{
    key: 'platform-integrity', formula: 'operational components ÷ monitored; open criticals (charter: guardian of reliability)',
    target: '0 criticals', owner: 'operations-platform', cadence: 'daily audit', source: 'ops_status + ops_findings',
  }],
  'interface-experience': [{
    key: 'ux-posture', formula: 'weighted structural posture: consistency, navigation, responsive, accessibility, hierarchy (charter)',
    target: '≥90 with live audits replacing posture', owner: 'interface-experience', cadence: 'weekly audit', source: 'uxPosture',
  }],
};

function aiRoleGenome(r: (typeof AI_ROLES)[number]): CapabilityGenome {
  return baseGenome({
    id: `ai-role:${r.slug}`,
    mission: 'Operate the Institution as a chartered department of the AI Workforce (Covenant Art. VI).',
    purpose: r.persona
      ? `Student-facing persona '${r.slug}' — product surface, not an AOS agent (by design).`
      : `Chartered AOS department '${r.slug}' per its AGENT_SPEC.`,
    type: 'ai-role',
    classification: 'operational',
    owner: r.persona ? 'founder' : r.slug,
    department: r.persona ? 'founder' : r.slug,
    authority: 'operational',
    constitutionalAuthority: 'department-charters',
    referenceModel: 'docs/agents/AGENT_OPERATING_SYSTEM.md',
    playbook: 'docs/agents/CONTINUOUS_IMPROVEMENT.md',
    workforceSpec: r.persona ? MISSING : `docs/agents/${r.slug}/AGENT_SPEC.md`,
    standards: ['capability-genome-standard', 'qa-standard'],
    security: { level: r.persona ? 'student' : 'founder', posture: r.persona ? 'RLS + ai-proxy' : 'admin session; publish:false; human_approval_required', gateChain: 'work-order gates → founder approval' },
    workforce: r.persona ? [] : [{ agent: r.slug, role: 'operates' }],
    kpis: CANON_KPIS[r.slug] ?? MISSING,
    lifecycle: 'implemented',
  });
}

/** Founder dashboards + product surfaces (dashboard class, from the page manifest). */
function dashboardGenome(p: (typeof DASHBOARD_PAGES)[number]): CapabilityGenome {
  return baseGenome({
    id: `dashboard:${p.slug}`,
    mission: p.audience === 'founder' ? 'Founder observability and governance surfaces.' : 'Serve learners through the product experience (Covenant Art. I, V).',
    purpose: `Surface '${p.slug}' (${p.audience}).`,
    type: 'dashboard',
    classification: 'operational',
    owner: 'interface-experience',
    department: 'interface-experience',
    authority: 'operational',
    constitutionalAuthority: 'aladiah-operating-system',
    referenceModel: p.path,
    standards: ['capability-genome-standard'],
    security: { level: p.audience, posture: p.audience === 'founder' ? 'FounderRoute + RLS backstop' : p.audience === 'student' ? 'ProtectedRoute + RLS' : 'public route', gateChain: 'UI changes via UX gate → founder approval' },
    accessibility: 'posture',
    workforce: [{ agent: 'interface-experience', role: 'stewards' }],
    lifecycle: 'implemented',
  });
}

/** The documented programs beyond the flagship. */
const baProgram = baseGenome({
  id: 'program:ai-business-analyst-v1',
  mission: 'Transform learners into employable AI-era Business Analysts (Covenant Art. V, XIII).',
  purpose: 'The second flagship: 15 modules, 295 tagged questions, capstone-gated certification.',
  type: 'program', classification: 'strategic', owner: 'curriculum-excellence', department: 'curriculum-excellence',
  authority: 'canonical', constitutionalAuthority: 'academic-canon',
  constitutionVolumes: ['02', '10'],
  referenceModel: 'docs/curriculum/business-analyst-v1/00_ARCHITECTURE.md',
  playbook: 'docs/governance/manuals/validation-walks/ba-flagship-walk.md',
  standards: ['capability-genome-standard', 'competency-taxonomy', 'qa-standard'],
  dependencies: ['standard:competency-taxonomy'],
  outputs: [{ name: 'published BA course + capstone + certificates', kind: 'artifact', writesProduction: true, approvalGate: 'QA → founder-applied SQL → founder walk (BLK registry)' }],
  security: { level: 'student', posture: 'RLS; founder-gated publish', gateChain: 'QA→Security→Founder' },
  translation: 'partial', qaStatus: 'passing', accessibility: 'posture',
  workforce: [{ agent: 'curriculum-excellence', role: 'stewards' }, { agent: 'qa-authority', role: 'reviews' }],
  lifecycle: 'measured', lastReview: '2026-06-21', nextReview: '2026-09-21',
  parentCapability: 'department:curriculum-excellence',
  evolution: [
    { on: '2026-06-21', kind: 'created', by: 'founder', evidence: 'BA publish migrations 2026062*.' },
    { on: '2026-06-24', kind: 'measured', by: 'qa-authority', evidence: 'BA_FLAGSHIP_AUDIT_v1.md' },
  ],
});

const cyberProgram = baseGenome({
  id: 'program:ai-cybersecurity-v1',
  mission: 'Transform learners into employable AI-era cybersecurity professionals.',
  purpose: 'Third flagship: 18 modules, 270 questions, published to production.',
  type: 'program', classification: 'strategic', owner: 'curriculum-excellence', department: 'curriculum-excellence',
  authority: 'canonical', constitutionalAuthority: 'academic-canon',
  constitutionVolumes: ['02', '10'],
  referenceModel: 'docs/programs/CYBERSECURITY_FLAGSHIP_ARCHITECTURE.md',
  standards: ['capability-genome-standard', 'competency-taxonomy', 'qa-standard'],
  dependencies: ['standard:competency-taxonomy'],
  outputs: [{ name: 'published Cyber course', kind: 'artifact', writesProduction: true, approvalGate: 'QA → founder-applied publish' }],
  security: { level: 'student', posture: 'RLS; founder-gated publish', gateChain: 'QA→Security→Founder' },
  qaStatus: 'passing',
  workforce: [{ agent: 'curriculum-excellence', role: 'stewards' }],
  lifecycle: 'implemented', lastReview: '2026-06-30', nextReview: '2026-09-30',
  parentCapability: 'department:curriculum-excellence',
  evolution: [{ on: '2026-06-30', kind: 'created', by: 'founder', evidence: 'cyber-v1 published (main history: 55ecd6c, e4d14bb).' }],
});

/** The 16 AOS facade subsystems — the operating system as governed services. */
const AOS_SUBSYSTEMS = [
  'registry', 'memory', 'tasks', 'orchestrator', 'logs', 'permissions', 'health', 'communication',
  'work-orders', 'orchestration', 'brain', 'events', 'intelligence', 'governance', 'genome', 'institutional-registry',
];
function aosSubsystemGenome(name: string): CapabilityGenome {
  if (name === 'institutional-registry') return registrySelf; // already self-cataloged
  return baseGenome({
    id: `service:aos-${name}`,
    mission: 'Run the Institution (the AOS is how the workforce is operated and observed).',
    purpose: `AOS subsystem '${name}' per the infrastructure canon.`,
    type: 'service', classification: 'operational', owner: 'operations-platform', department: 'operations-platform',
    authority: 'operational', constitutionalAuthority: 'agent-operating-system',
    referenceModel: 'docs/agents/AGENT_OPERATING_SYSTEM.md',
    standards: ['capability-genome-standard'],
    security: { level: 'founder', posture: 'admin-session; aos_* RLS; no DELETE', gateChain: 'reviewed commits' },
    qaStatus: ['work-orders', 'intelligence', 'governance', 'genome'].includes(name) ? 'passing' : 'untested',
    workforce: [{ agent: 'operations-platform', role: 'stewards' }],
    lifecycle: 'implemented',
  });
}

/** Founder directives of this epoch — accessioned as capabilities of record. */
const FOUNDER_DIRECTIVES = [
  { slug: 'fd-2026-001-institutional-engineering', note: 'Enter Institutional Engineering Mode; 8 mandatory artifacts; quality gate.' },
  { slug: 'fd-002-institutional-registry', note: 'Build the Institutional Registry; the master inventory record schema.' },
  { slug: 'fd-2026-003-inventory-first', note: 'Audit the codebase; inventory before engineering; Founder Engineering Report.' },
  { slug: 'fd-2026-004-genome-ratification', note: 'Six constitutional amendments; Capability Genome Standard v2.0 ratified.' },
  { slug: 'fd-2026-006-institutional-construction', note: 'Constitutional era complete; five priorities; implement rather than invent.' },
  { slug: 'fd-2026-007-operational-excellence', note: 'The Institution is the product. Five permanent loops; every AI a governed employee; every human a leader; knowledge compounds and is never lost.' },
  { slug: 'fd-2026-009-management-system', note: 'Design the Aladiah Management System: framework + twenty permanent manuals; the operating system for decades of management.' },
  { slug: 'fd-2026-010-m01-ratification', note: 'M01 adopted as AMS v1.0; the Permanent Management Rule (8-step manual lifecycle); WO-0002 issued.' },
  { slug: 'fd-2026-011-book-of-knowledge', note: 'M02 ratified. The Aladiah Book of Knowledge established: Books → Manuals → Standards → Procedures → Work Orders → Evidence → Brain → improved Standards — the permanent institutional learning loop. WO-0003 issued.' },
  { slug: 'fd-2026-012-constitutional-clarification', note: 'M03 ratified. Constitutional clarification: the spine is NOT amended; the Covenant remains supreme governing doctrine; permanent definitions — Covenant WHY · Constitution WHAT · Book of Knowledge WHAT IS KNOWN · Management System HOW · Company Brain HOW TO IMPROVE; the four shall never be merged. WO-0004 issued.' },
  { slug: 'fd-2026-013-phase-i-complete', note: 'M04 ratified; PHASE I DECLARED COMPLETE (Covenant, Constitution, Book of Knowledge, Management System, Registry, Brain). Founder Doctrine: implementation over expansion — improve, amend, strengthen; never parallel, duplicate, replace; simplicity is a constitutional value. Engineering Law: the Five Questions every work order must answer. WO-0005 issued. (Number assigned by sequence; directive arrived unnumbered.)' },
  { slug: 'fd-2026-014-employee-equality-autonomy', note: 'M05 ratified (v1.1 with doctrine verbatim). The Employee Principle (same framework for human and AI; capability never changes accountability). The Institutional Equality Principle (evaluate work, not origin). The Founder Reserved Powers (nine, never delegated to AI, never inferred, never assumed). The Autonomy Doctrine (a privilege earned by evidence; safety prevails over automation). PHASE II opened: execution. WO-0006 issued.' },
  { slug: 'master-operating-order-phase-ii', note: 'M06 ratified. Phase II Execution Campaign: Priorities A (resolve founder blockers incl. MERGE constitutional PRs, walk Unknowns, Brain sync, CI) · B (remaining manuals through the lifecycle) · C (AVIS — visual intelligence as constitutional capability; Visual First Principle) · D (Founder Command Center, computed-only) · E (complete workforce onboarding) · F (scale: nothing exists in isolation). Constitution/AMS/BoK/Genome/Brain declared STABLE — controlled amendments only.' },
];
function directiveGenome(d: (typeof FOUNDER_DIRECTIVES)[number]): CapabilityGenome {
  return baseGenome({
    id: `founder-directive:${d.slug}`,
    mission: 'Direct the Institution (founder authority of record).',
    purpose: d.note,
    type: 'founder-directive', classification: 'constitutional', owner: 'founder', department: 'founder',
    authority: 'constitutional', constitutionalAuthority: 'covenant',
    referenceModel: 'docs/audits/FOUNDER_ENGINEERING_REPORT_FD2026.md',
    standards: ['capability-genome-standard'],
    lifecycle: 'institutionalized',
    ratifiedOn: D,
    evolution: [
      { on: D, kind: 'created', by: 'founder', evidence: 'Issued in the founder session of record (git history of this epoch).' },
      { on: D, kind: 'ratified', by: 'founder', evidence: 'Founder-issued directives carry authority on issuance.' },
    ],
  });
}

/** M01 — the first Management Manual (WO-0001), genome-first per the ratified standard. */
const m01Manual = baseGenome({
  id: 'playbook:m01-executive-office',
  mission: 'Every institutional decision honors the Covenant — recorded, evidenced, and remembered (Art. II, IV, IX, XIII).',
  purpose: 'The Executive Office operational blueprint and the Gold Standard structure for all Management Manuals (M01–M20).',
  type: 'playbook',
  classification: 'operational',
  owner: 'founder',
  department: 'founder',
  authority: 'operational',
  constitutionalAuthority: 'ams-framework',
  constitutionVolumes: ['02'],
  referenceModel: 'docs/governance/management-system/FRAMEWORK.md',
  playbook: 'docs/governance/management-system/manuals/M01-executive-office.md',
  standards: ['capability-genome-standard', 'permanent-engineering-mission', 'ratification-process'],
  dashboardSpec: 'src/pages/founder/FounderPortal.tsx',
  workforceSpec: 'docs/agents/ceo-chief-of-staff/AGENT_SPEC.md',
  kpis: [
    { key: 'decision-latency', formula: 'median age of Founder Approval Queue items at decision time', target: 'founder-set pending', owner: 'founder', cadence: 'daily brief', source: 'approvals queue timestamps' },
    { key: 'escalation-latency', formula: 'escalation event → founder decision recorded', target: 'founder-set pending', owner: 'founder', cadence: 'per incident', source: 'event bus' },
    { key: 'briefing-currency', formula: 'cadences current ÷ 5', target: '100%', owner: 'ceo-chief-of-staff', cadence: 'daily', source: 'briefing staleness engine' },
    { key: 'evidence-integrity', formula: 'approvals carrying evidence ÷ all approvals', target: '100% (by construction)', owner: 'qa-authority', cadence: 'continuous', source: 'EvidenceRequiredError telemetry' },
  ],
  inputs: [
    { name: 'founder directives (verbatim)', kind: 'human-action' },
    { name: 'approval queue + escalations + briefings', kind: 'data' },
  ],
  outputs: [
    { name: 'founder decisions + ratifications (records)', kind: 'decision', writesProduction: false, approvalGate: null },
    { name: 'executive briefings (Brain-stored)', kind: 'artifact', writesProduction: false, approvalGate: null },
  ],
  security: { level: 'founder', posture: 'FounderRoute surfaces; evidence-gated decisions; registry as record', gateChain: 'AMS approval workflow (QA → Founder)' },
  workforce: [
    { agent: 'ceo-chief-of-staff', role: 'operates' },
    { agent: 'qa-authority', role: 'reviews' },
  ],
  lifecycle: 'implemented', // FD-2026-010: ratified and in force
  parentCapability: 'ai-role:ceo-chief-of-staff',
  founderDirectives: ['WO-0001', 'FD-2026-009 (AMS)', 'FD-2026-007', 'FD-2026-010 (ratification)'],
  ratifiedOn: D,
  evolution: [
    { on: D, kind: 'created', by: 'founder', evidence: 'WO-0001 — first Management Manual, authored per the AMS Framework Universal Template.' },
    { on: D, kind: 'ratified', by: 'founder', evidence: 'FD-2026-010: adopted as AMS v1.0; structure is the standard template for M02–M20.' },
  ],
});

/** M02 — Governance Operations Manual (WO-0002), genome-first. */
const m02Manual = baseGenome({
  id: 'playbook:m02-governance-operations',
  mission: 'Governance executed the same way everywhere, forever — truth pursued, decisions recorded, authority never silent (Covenant Art. II, IV, IX).',
  purpose: 'How governance is executed throughout the Institution: document/policy/standard lifecycles, directives, work orders, engineering decisions, amendments, audits.',
  type: 'playbook',
  classification: 'operational',
  owner: 'founder',
  department: 'founder',
  authority: 'operational',
  constitutionalAuthority: 'ams-framework',
  constitutionVolumes: ['02'],
  referenceModel: 'docs/governance/management-system/FRAMEWORK.md',
  playbook: 'docs/governance/management-system/manuals/M02-governance-operations.md',
  standards: ['capability-genome-standard', 'permanent-engineering-mission', 'ratification-process'],
  dashboardSpec: 'src/components/founder/cockpit/GovernancePanel.tsx',
  workforceSpec: 'docs/agents/operations-platform/AGENT_SPEC.md',
  kpis: [
    { key: 'governance-health', formula: 'slot coverage (40) × document health (40) × ratified share (20) — getGovernanceHealth()', target: '≥90 steady-state', owner: 'operations-platform', cadence: 'continuous (computed)', source: 'governance registry' },
    { key: 'review-currency', formula: 'governance reviews on time ÷ due', target: '≥95%', owner: 'founder', cadence: 'weekly', source: 'registry review dates' },
    { key: 'drift-mttr', formula: 'drift-check red → green', target: '≤2 days', owner: 'operations-platform', cadence: 'per incident', source: 'CI + event bus' },
    { key: 'ratification-latency', formula: 'review-entry → founder decision', target: 'founder-set pending', owner: 'founder', cadence: 'weekly', source: 'registry history events' },
    { key: 'directive-accession', formula: 'directives accessioned as genomes ÷ issued', target: '100%', owner: 'ceo-chief-of-staff', cadence: 'per directive', source: 'founder-directive genomes' },
  ],
  inputs: [
    { name: 'founder directives + decisions', kind: 'human-action' },
    { name: 'registry state + drift-check results + brain precedent', kind: 'data' },
  ],
  outputs: [
    { name: 'lifecycle transitions (registry commits)', kind: 'decision', writesProduction: false, approvalGate: null },
    { name: 'governance audits + findings', kind: 'artifact', writesProduction: false, approvalGate: null },
  ],
  security: { level: 'founder', posture: 'registry-as-record; reviewed commits; founder-only ratification', gateChain: 'Permanent Management Rule (8-step)' },
  workforce: [
    { agent: 'operations-platform', role: 'operates' },
    { agent: 'analytics-intelligence', role: 'stewards' },
    { agent: 'qa-authority', role: 'reviews' },
  ],
  lifecycle: 'implemented', // FD-2026-011: ratified; binding institutional practice
  parentCapability: 'playbook:m01-executive-office',
  founderDirectives: ['WO-0002', 'FD-2026-010', 'FD-2026-011 (ratification)'],
  ratifiedOn: D,
  evolution: [
    { on: D, kind: 'created', by: 'founder', evidence: 'WO-0002 — authored to the M01 gold-standard template; steps 1–4 of the Permanent Rule recorded in §1.' },
    { on: D, kind: 'ratified', by: 'founder', evidence: 'FD-2026-011: adopted; governance principles binding.' },
  ],
});

/** M03 — Registry & Genome Operations (WO-0003), genome-first. */
const m03Manual = baseGenome({
  id: 'playbook:m03-registry-genome-operations',
  mission: 'Every steward knows what was received and leaves it stronger — nothing improves untracked (Covenant Art. IX, XI).',
  purpose: 'Operating procedures of the constitutional catalog: register, version, classify, trace, onboard parity classes, retire.',
  type: 'playbook',
  classification: 'operational',
  owner: 'operations-platform',
  department: 'operations-platform',
  authority: 'operational',
  constitutionalAuthority: 'ams-framework',
  constitutionVolumes: ['02'],
  referenceModel: 'docs/engineering/registry/01-reference-model.md',
  playbook: 'docs/governance/management-system/manuals/M03-registry-genome-operations.md',
  standards: ['capability-genome-standard', 'permanent-engineering-mission'],
  dashboardSpec: 'src/components/founder/cockpit/InstitutionalRegistryPanel.tsx',
  workforceSpec: 'docs/engineering/registry/05-ai-workforce-spec.md',
  kpiDictionary: 'docs/engineering/registry/06-kpi-dictionary.md',
  kpis: [
    { key: 'registry-coverage', formula: 'discovered with genomes ÷ discovered (per enforced class)', target: '100% (CI)', owner: 'operations-platform', cadence: 'every CI run', source: 'parity tests' },
    { key: 'unknown-queue-age', formula: 'max days a genome stays unknown', target: '≤14 days', owner: 'founder', cadence: 'daily brief', source: 'registry' },
    { key: 'mean-maturity', formula: 'mean(maturity) across non-archived genomes', target: '≥3.0 within two quarters', owner: 'operations-platform', cadence: 'monthly', source: 'computed' },
  ],
  inputs: [
    { name: 'discovered capabilities (manifests/scanner)', kind: 'data' },
    { name: 'founder-walk evidence (Unknown resolutions)', kind: 'human-action' },
  ],
  outputs: [
    { name: 'registered genomes (reviewed commits)', kind: 'artifact', writesProduction: false, approvalGate: null },
    { name: 'classification + retirement records', kind: 'decision', writesProduction: false, approvalGate: null },
  ],
  security: { level: 'founder', posture: 'registry-as-code; reviewed commits; quarantine gates on Unknown production-writers', gateChain: 'Permanent Management Rule (8-step)' },
  workforce: [
    { agent: 'operations-platform', role: 'operates' },
    { agent: 'analytics-intelligence', role: 'stewards' },
    { agent: 'qa-authority', role: 'reviews' },
  ],
  lifecycle: 'implemented', // FD-2026-012: ratified; binding
  parentCapability: 'playbook:m02-governance-operations',
  founderDirectives: ['WO-0003', 'FD-2026-011', 'FD-2026-012 (ratification)'],
  ratifiedOn: D,
  evolution: [
    { on: D, kind: 'created', by: 'operations-platform', evidence: 'WO-0003 — authored to the M01 gold-standard template; every procedure maps to running code.' },
    { on: D, kind: 'ratified', by: 'founder', evidence: 'FD-2026-012: adopted; binding institutional practice.' },
  ],
});

/** M04 — Company Brain & Knowledge Management (WO-0004), genome-first. */
const m04Manual = baseGenome({
  id: 'playbook:m04-company-brain',
  mission: 'Knowledge preserved, corrections remembered, learning compounding forever (Covenant Art. II, VII, XI, XII).',
  purpose: 'How the Institution remembers, validates, retrieves, and learns — the Brain governs improvement (Permanent Definitions: HOW TO IMPROVE).',
  type: 'playbook',
  classification: 'operational',
  owner: 'analytics-intelligence',
  department: 'analytics-intelligence',
  authority: 'operational',
  constitutionalAuthority: 'ams-framework',
  constitutionVolumes: ['02'],
  referenceModel: 'docs/agents/AGENT_OPERATING_SYSTEM.md',
  playbook: 'docs/governance/management-system/manuals/M04-company-brain.md',
  standards: ['capability-genome-standard', 'launch-decision-principle', 'permanent-engineering-mission'],
  dashboardSpec: 'src/components/founder/cockpit/CompanyBrainPanel.tsx',
  workforceSpec: 'docs/agents/analytics-intelligence/AGENT_SPEC.md',
  kpis: [
    { key: 'mirror-freshness', formula: 'current-version mirrors ÷ (genomes + governance docs)', target: '100% post-session', owner: 'analytics-intelligence', cadence: 'per founder session', source: 'sync markers' },
    { key: 'precedent-citation', formula: 'decisions citing recalled precedent ÷ decisions on previously-decided subjects', target: '100% (M01 §12)', owner: 'founder', cadence: 'per decision seat', source: 'decision evidence' },
    { key: 'consolidation-health', formula: 'promotable memories consolidated ÷ eligible', target: '≥95%', owner: 'operations-platform', cadence: 'weekly', source: 'consolidate() outcomes' },
    { key: 'review-ingestion', formula: '90-day manual reviews citing lessons ÷ reviews', target: '100%', owner: 'analytics-intelligence', cadence: 'per review', source: 'Improvement Logs' },
  ],
  inputs: [
    { name: 'decisions, ratifications, lessons, impact measures, walk evidence', kind: 'event' },
    { name: 'genome + governance registries (mirrors)', kind: 'data' },
  ],
  outputs: [
    { name: 'institutional memory (categorized, marked, provenanced)', kind: 'data', writesProduction: false, approvalGate: null },
    { name: 'precedent + lesson retrieval for every decision and review', kind: 'data', writesProduction: false, approvalGate: null },
  ],
  security: { level: 'founder', posture: 'aos_agent_memory under admin RLS; append-organized; no hard deletes', gateChain: 'Permanent Management Rule (8-step)' },
  workforce: [
    { agent: 'analytics-intelligence', role: 'operates' },
    { agent: 'operations-platform', role: 'stewards' },
    { agent: 'qa-authority', role: 'reviews' },
  ],
  lifecycle: 'implemented', // ratified; Phase I complete
  parentCapability: 'playbook:m03-registry-genome-operations',
  founderDirectives: ['WO-0004', 'FD-2026-012', 'FD-2026-013 (ratification; Phase I complete)'],
  ratifiedOn: D,
  evolution: [
    { on: D, kind: 'created', by: 'analytics-intelligence', evidence: 'WO-0004 — the Brain reviewed its own manual (step 4); retention finding carried forward, not hidden.' },
    { on: D, kind: 'ratified', by: 'founder', evidence: 'Adopted; Phase I constitutional foundation declared complete.' },
  ],
});

/** M05 — AI Workforce Management (WO-0005), genome-first; Five Questions answered in §0. */
const m05Manual = baseGenome({
  id: 'playbook:m05-ai-workforce-management',
  mission: 'AI strengthens human judgment; humans remain responsible — no anonymous intelligence, no ungoverned authority (Covenant Art. VI).',
  purpose: 'Employment law for the AI workforce: hire, charter, operate, review, develop, discipline, retire — and the earned preconditions for any future autonomy.',
  type: 'playbook',
  classification: 'operational',
  owner: 'operations-platform',
  department: 'operations-platform',
  authority: 'operational',
  constitutionalAuthority: 'ams-framework',
  constitutionVolumes: ['02'],
  referenceModel: 'docs/agents/AGENT_OPERATING_SYSTEM.md',
  playbook: 'docs/governance/management-system/manuals/M05-ai-workforce-management.md',
  standards: ['capability-genome-standard', 'permanent-engineering-mission'],
  dashboardSpec: 'src/components/founder/cockpit/AgentOperatingGrid.tsx',
  workforceSpec: 'docs/agents/operations-platform/AGENT_SPEC.md',
  kpis: [
    { key: 'identity-coverage', formula: 'employees with charter+genome+registry ÷ employees', target: '100% (CI)', owner: 'operations-platform', cadence: 'every CI run', source: 'drift check' },
    { key: 'fleet-health', formula: 'mean performance score across active agents', target: '≥85', owner: 'operations-platform', cadence: 'daily', source: 'health rollups' },
    { key: 'charter-compliance', formula: 'charter breaches (P7 entries)', target: '0', owner: 'founder', cadence: 'per incident', source: 'brain + events' },
    { key: 'learning-activity', formula: 'departments with ≥1 lesson per review cycle ÷ 12', target: '100%', owner: 'analytics-intelligence', cadence: 'quarterly', source: 'lesson records' },
  ],
  inputs: [
    { name: 'founder work orders (hire/amend/discipline/retire)', kind: 'human-action' },
    { name: 'health rollups + run logs + learning records', kind: 'data' },
  ],
  outputs: [
    { name: 'employment records (hires, reviews, discipline, retirements)', kind: 'decision', writesProduction: false, approvalGate: null },
    { name: 'quarterly workforce review (compiled)', kind: 'artifact', writesProduction: false, approvalGate: null },
  ],
  security: { level: 'founder', posture: 'publish:false fleet-wide; identity logged per run; pause/disable controls; no self-investigation', gateChain: 'Permanent Management Rule (8-step)' },
  workforce: [
    { agent: 'operations-platform', role: 'operates' },
    { agent: 'ceo-chief-of-staff', role: 'stewards' },
    { agent: 'qa-authority', role: 'reviews' },
  ],
  lifecycle: 'implemented', // FD-2026-014: ratified as binding doctrine; v1.1 founder amendment
  parentCapability: 'playbook:m04-company-brain',
  founderDirectives: ['WO-0005', 'FD-2026-013', 'FD-2026-014 (ratification + doctrine)'],
  ratifiedOn: D,
  evolution: [
    { on: D, kind: 'created', by: 'operations-platform', evidence: 'WO-0005 — first work order under the Five Questions law.' },
    { on: D, kind: 'ratified', by: 'founder', evidence: 'FD-2026-014: binding institutional doctrine.' },
    { on: D, kind: 'amended', by: 'founder', evidence: 'v1.1: Employee Principle, Institutional Equality Principle, Autonomy Doctrine appended verbatim.' },
  ],
});

/** M06 — Institutional Intelligence & Decision Support (WO-0006), genome-first. */
const m06Manual = baseGenome({
  id: 'playbook:m06-institutional-intelligence',
  mission: 'Truth pursued through evidence, delivered at the moment of decision — the Institution never knows things it cannot show (Covenant Art. II, III).',
  purpose: 'Decision support: the KPI framework, dashboards, reporting, early warnings, honest forecasting, AI decision assistants (who inform, never decide), the strategic review.',
  type: 'playbook',
  classification: 'operational',
  owner: 'analytics-intelligence',
  department: 'analytics-intelligence',
  authority: 'operational',
  constitutionalAuthority: 'ams-framework',
  constitutionVolumes: ['02'],
  referenceModel: 'docs/governance/architecture/intelligence-architecture.md',
  playbook: 'docs/governance/management-system/manuals/M06-institutional-intelligence.md',
  standards: ['capability-genome-standard', 'launch-decision-principle', 'permanent-engineering-mission'],
  dashboardSpec: 'src/pages/founder/FounderPortal.tsx',
  workforceSpec: 'docs/agents/analytics-intelligence/AGENT_SPEC.md',
  kpis: [
    { key: 'executive-surface-honesty', formula: 'manually asserted values on executive surfaces', target: '0 (test-enforced)', owner: 'analytics-intelligence', cadence: 'continuous', source: 'computed-truth checks' },
    { key: 'briefing-currency', formula: 'cadences current ÷ 5', target: '100%', owner: 'ceo-chief-of-staff', cadence: 'daily', source: 'staleness engine' },
    { key: 'forecast-honesty', formula: 'forecasts with stated basis+horizon ÷ all', target: '100%', owner: 'analytics-intelligence', cadence: 'per forecast', source: 'briefs + reviews' },
    { key: 'strategic-review-completion', formula: 'quarterly reviews held + Brain-recorded ÷ quarters', target: '100%', owner: 'founder', cadence: 'quarterly', source: 'brain' },
  ],
  inputs: [
    { name: 'live telemetry, KPIs, events, Brain precedent', kind: 'data' },
    { name: 'founder decisions (for outcome retrospectives)', kind: 'event' },
  ],
  outputs: [
    { name: 'decision-intelligence packages (state + precedent + confidence + risk)', kind: 'artifact', writesProduction: false, approvalGate: null },
    { name: 'early warnings + strategic reviews (Brain-recorded)', kind: 'data', writesProduction: false, approvalGate: null },
  ],
  security: { level: 'founder', posture: 'computed-only surfaces; basis markers mandatory; assistants inform, never decide (Reserved Powers)', gateChain: 'Permanent Management Rule (8-step)' },
  workforce: [
    { agent: 'analytics-intelligence', role: 'operates' },
    { agent: 'ceo-chief-of-staff', role: 'operates' },
    { agent: 'operations-platform', role: 'stewards' },
  ],
  lifecycle: 'implemented', // Master Operating Order: ratified
  parentCapability: 'playbook:m05-ai-workforce-management',
  founderDirectives: ['WO-0006', 'FD-2026-014', 'Master Operating Order (ratification)'],
  ratifiedOn: D,
  evolution: [
    { on: D, kind: 'created', by: 'analytics-intelligence', evidence: 'WO-0006 — forecasting honesty codified: a forecast without a stated basis is a fabricated number wearing a suit.' },
    { on: D, kind: 'ratified', by: 'founder', evidence: 'Master Operating Order — Phase II Execution Campaign.' },
  ],
});

// ---- The catalog --------------------------------------------------------------
export const CAPABILITY_GENOMES: CapabilityGenome[] = [
  ...SHADOW_SEEDERS.map(seederGenome),
  ...OPERATIONAL_EDGE_FUNCTIONS.map(operationalFnGenome),
  ...GOVERNING_DOCUMENTS.map(governanceDocGenome),
  ...AI_ROLES.map(aiRoleGenome),
  ...DASHBOARD_PAGES.map(dashboardGenome),
  ...AOS_SUBSYSTEMS.filter((s) => s !== 'institutional-registry').map(aosSubsystemGenome),
  ...FOUNDER_DIRECTIVES.map(directiveGenome),
  flagshipProgram,
  baProgram,
  cyberProgram,
  curriculumDepartment,
  taxonomyStandard,
  registrySelf,
  m01Manual,
  m02Manual,
  m03Manual,
  m04Manual,
  m05Manual,
  m06Manual,
];

export function getGenome(id: string): CapabilityGenome | undefined {
  return CAPABILITY_GENOMES.find((g) => g.id === id);
}

export const genomeExists = (id: string): boolean => !!getGenome(id);

// ---- Registry views (Dashboard Spec 04 data model) -----------------------------
export interface RegistrySummary {
  total: number;
  byClassification: Record<string, number>;
  byLifecycle: Partial<Record<GenomeLifecycle, number>>;
  meanMaturity: number | null;
  unknownQueue: { id: string; risk: string; since: string }[];
  reviewsDue: number;
  /** Classes with CI-enforced scanner parity today. Others onboard per playbook P-6. */
  parityEnforcedClasses: string[];
}

export function getRegistrySummary(today = new Date()): RegistrySummary {
  const byClassification: Record<string, number> = {};
  const byLifecycle: Partial<Record<GenomeLifecycle, number>> = {};
  for (const g of CAPABILITY_GENOMES) {
    byClassification[g.classification] = (byClassification[g.classification] ?? 0) + 1;
    byLifecycle[g.lifecycle] = (byLifecycle[g.lifecycle] ?? 0) + 1;
  }
  const active = CAPABILITY_GENOMES.filter((g) => g.lifecycle !== 'retired');
  const unknowns = CAPABILITY_GENOMES.filter((g) => g.classification === 'unknown');
  return {
    total: CAPABILITY_GENOMES.length,
    byClassification,
    byLifecycle,
    meanMaturity: active.length
      ? Math.round((active.reduce((a, g) => a + g.maturity, 0) / active.length) * 10) / 10
      : null,
    unknownQueue: unknowns
      .map((g) => ({
        id: g.id,
        risk: g.security.posture,
        since: g.evolution.find((e) => e.kind === 'migrated')?.on ?? g.createdOn,
      }))
      .sort((a, b) => (b.risk.includes('DESTRUCTIVE') ? 1 : 0) - (a.risk.includes('DESTRUCTIVE') ? 1 : 0)),
    reviewsDue: active.filter((g) => new Date(g.nextReview).getTime() <= today.getTime()).length,
    parityEnforcedClasses: ['edge-function'],
  };
}

// ---- P4: workforce identity (FD-2026-006) ---------------------------------------
/**
 * What every AI specialist must understand about itself (Priority 4):
 * authority, responsibilities, department, institute, standards, playbooks,
 * KPIs, and its capability genome. Consumed by the orchestrator at run start
 * and available to any runner via aos.institution.getWorkforceIdentity().
 */
export interface WorkforceIdentity {
  genomeId: string;
  authority: string;
  responsibilities: string; // the genome's purpose
  department: string;
  institute: string | null;
  /** Daily-coordination manager (M05 RACI); the founder remains constitutional authority for all. */
  manager: string;
  standards: string[];
  playbook: string;
  kpis: string; // 'own dictionary' | 'missing — department KPIs pending'
}

export function getWorkforceIdentity(agentSlug: string): WorkforceIdentity | null {
  const g = getGenome(`ai-role:${agentSlug}`);
  if (!g) return null;
  return {
    genomeId: g.id,
    authority: g.authority,
    responsibilities: g.purpose,
    department: g.department,
    institute: g.institute,
    manager: agentSlug === 'ceo-chief-of-staff' ? 'founder' : 'ceo-chief-of-staff',
    standards: g.standards,
    playbook: typeof g.playbook === 'string' ? g.playbook : 'missing',
    kpis: g.kpis === 'missing' ? 'missing — department KPI dictionary pending' : `${(g.kpis as unknown[]).length} KPI(s) defined`,
  };
}

// ---- FD-2026-007: every AI is a governed employee ---------------------------------
/**
 * The complete employee record (FD-2026-007): identity + performance history
 * + learning history. No anonymous intelligence — every field traces to the
 * genome, the AOS health rollups, or the agent's own memory. All reads
 * defensive; unmeasured is null, never fabricated.
 */
export interface EmployeeRecord {
  identity: WorkforceIdentity;
  performance: {
    runCount: number | null;
    successRatePct: number | null;
    performanceScore: number | null;
    lastRunAt: string | null;
    consecutiveFailures: number | null;
  };
  learning: {
    memoryCount: number | null;
    longTermCount: number | null;
    recentLessons: { at: string; summary: string }[];
  };
}

export async function getEmployeeRecord(agentSlug: string): Promise<EmployeeRecord | null> {
  const identity = getWorkforceIdentity(agentSlug);
  if (!identity) return null;

  const reg = await safe(async () => {
    const { data } = await db
      .from('aos_agents')
      .select('run_count,error_count,performance_score,last_run_at,consecutive_failures')
      .eq('slug', agentSlug)
      .maybeSingle();
    return data as { run_count: number; error_count: number; performance_score: number; last_run_at: string | null; consecutive_failures: number } | null;
  }, null);

  const [memoryCount, longTermCount, lessons] = await Promise.all([
    safe(async () => (await db.from('aos_agent_memory').select('id', { count: 'exact', head: true }).eq('agent_slug', agentSlug)).count ?? null, null as number | null),
    safe(async () => (await db.from('aos_agent_memory').select('id', { count: 'exact', head: true }).eq('agent_slug', agentSlug).eq('memory_type', 'long_term')).count ?? null, null as number | null),
    safe(async () => {
      const { data } = await db
        .from('aos_agent_memory')
        .select('created_at,summary')
        .eq('agent_slug', agentSlug)
        .contains('tags', ['lesson-learned'])
        .order('created_at', { ascending: false })
        .limit(5);
      return ((data ?? []) as { created_at: string; summary: string | null }[]).map((m) => ({ at: m.created_at, summary: m.summary ?? '' }));
    }, [] as { at: string; summary: string }[]),
  ]);

  return {
    identity,
    performance: reg
      ? {
          runCount: reg.run_count,
          successRatePct: reg.run_count > 0 ? Math.round(((reg.run_count - reg.error_count) / reg.run_count) * 100) : null,
          performanceScore: Number(reg.performance_score),
          lastRunAt: reg.last_run_at,
          consecutiveFailures: reg.consecutive_failures,
        }
      : { runCount: null, successRatePct: null, performanceScore: null, lastRunAt: null, consecutiveFailures: null },
    learning: { memoryCount, longTermCount, recentLessons: lessons },
  };
}

/**
 * The Learning seam of the Five Permanent Loops (FD-2026-007): an agent (or
 * the founder) records a lesson; it lands in the agent's memory (tagged,
 * recallable), the Company Brain (institutional, compounding), and the Event
 * Bus (traceable). Knowledge is never lost.
 */
export async function recordLessonLearned(input: {
  agentSlug: string;
  lesson: string;
  evidence: string;
  capabilityId?: string;
}): Promise<boolean> {
  const { remember } = await import('./memory');
  const { emitEvent } = await import('./events');
  const m = await remember({
    agentSlug: input.agentSlug,
    content: `LESSON: ${input.lesson} Evidence: ${input.evidence}`,
    summary: `lesson:${input.capabilityId ?? input.agentSlug}`,
    type: 'long_term',
    importance: 0.85,
    tags: ['lesson-learned', ...(input.capabilityId ? [input.capabilityId] : [])],
  });
  await recordDecision({
    category: 'impact-measurement',
    content: `Lesson learned (${input.agentSlug}${input.capabilityId ? ` · ${input.capabilityId}` : ''}): ${input.lesson} Evidence: ${input.evidence}`,
    summary: `lesson:${input.capabilityId ?? input.agentSlug}:${new Date().toISOString().slice(0, 10)}`,
    recordedBy: input.agentSlug,
  });
  await emitEvent('impact.measured', input.agentSlug, `Lesson learned: ${input.lesson.slice(0, 100)}`, {
    capability: input.capabilityId ?? null,
    kind: 'lesson-learned',
  });
  return m !== null;
}

// ---- Company Brain mirror (idempotent per version) ------------------------------
export async function syncGenomesToBrain(): Promise<{ synced: number; skipped: number }> {
  const existing = await listBrain('governance-record', 500);
  let synced = 0;
  let skipped = 0;
  for (const g of CAPABILITY_GENOMES) {
    if (existing.some((e: BrainEntry) => e.summary === g.brainLink)) { skipped += 1; continue; }
    const entry = await recordDecision({
      category: 'governance-record',
      content:
        `GENOME ${g.id} — ${g.classification.toUpperCase()}, lifecycle ${g.lifecycle}, maturity ${g.maturity}/5, owner ${g.owner}. ` +
        `Purpose: ${g.purpose} Authority: ${g.constitutionalAuthority}.` +
        (g.derivedFrom !== 'none' ? ` Derived from: ${g.derivedFrom.join(', ')}.` : ''),
      summary: g.brainLink,
      recordedBy: g.owner,
    });
    if (entry) synced += 1;
  }
  return { synced, skipped };
}
