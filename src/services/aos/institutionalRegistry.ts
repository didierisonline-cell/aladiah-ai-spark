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
    standards: g.standards,
    playbook: typeof g.playbook === 'string' ? g.playbook : 'missing',
    kpis: g.kpis === 'missing' ? 'missing — department KPI dictionary pending' : `${(g.kpis as unknown[]).length} KPI(s) defined`,
  };
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
