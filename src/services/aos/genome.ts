// =============================================================================
// The Capability Genome — RATIFIED constitutional specification, implemented.
// Standard: docs/governance/standards/capability-genome-standard.md (v2.0,
// ratified by Founder Decision 2026-07-02, part of the Aladiah Canon).
// Schema implemented verbatim from docs/engineering/genome/02-schema.md;
// validation rules V1–V12 from 03-validation-rules.md.
//
// The genome is the PERMANENT IDENTITY of a capability: implementation,
// technology, ownership may change — identity persists. Computed loci are
// never hand-asserted (Amendment III); lineage is never lost (Amendment I);
// retired genomes remain forever (Amendment IV).
// =============================================================================

export type CapabilityType =
  | 'program' | 'course' | 'lesson' | 'simulation' | 'assessment' | 'dashboard'
  | 'policy' | 'standard' | 'playbook' | 'reference-model' | 'ai-role'
  | 'institute' | 'department' | 'team' | 'work-order' | 'founder-directive'
  | 'research-report' | 'translation' | 'visual-asset' | 'knowledge-article'
  | 'edge-function' | 'service';

export type GenomeClassification =
  | 'constitutional' | 'strategic' | 'operational' | 'experimental' | 'legacy' | 'archived' | 'unknown';

export type GenomeLifecycle =
  | 'proposed' | 'draft' | 'governed' | 'implemented' | 'measured' | 'institutionalized' | 'deprecated' | 'retired';

export const LIFECYCLE_ORDER: GenomeLifecycle[] = [
  'proposed', 'draft', 'governed', 'implemented', 'measured', 'institutionalized', 'deprecated', 'retired',
];

/** A reference is a real pointer, an honest 'missing', or a justified n/a. */
export type Ref = string | { na: string };
export const MISSING = 'missing' as const;
export type RefOrMissing = Ref | typeof MISSING;

export interface LineageEvent {
  on: string;
  kind: 'created' | 'amended' | 'superseded' | 'migrated' | 'measured' | 'ratified' | 'deprecated' | 'retired';
  by: string;
  evidence: string;
}

export interface ImprovementEvent {
  on: string;
  kind: 'impact-measured' | 'lesson-learned';
  by: string;
  evidence: string;
  outcome?: 'positive' | 'neutral' | 'negative';
}

export interface GenomeKPI {
  key: string; formula: string; target: string; owner: string; cadence: string; source: string;
}

export interface GenomeInput { name: string; kind: 'data' | 'document' | 'human-action' | 'event'; }
export interface GenomeOutput {
  name: string;
  kind: 'data' | 'artifact' | 'decision' | 'side-effect';
  writesProduction: boolean;
  /** REQUIRED (non-null) whenever writesProduction is true — validation V5. */
  approvalGate: string | null;
}

export interface CapabilityGenome {
  // §1 Identity
  id: string; // `<type>:<kebab-slug>` — immutable
  mission: string;
  purpose: string;
  type: CapabilityType;
  classification: GenomeClassification;
  owner: string;
  authority: 'foundational' | 'constitutional' | 'canonical' | 'operational' | 'informational';
  institute: string | null; // null until the Organizational Charter defines institutes
  department: string;
  // §2 Canonical references
  constitutionVolumes: string[];
  founderStandards: RefOrMissing;
  referenceModel: RefOrMissing;
  playbook: RefOrMissing;
  standards: string[]; // registry keys; must include 'capability-genome-standard'
  dashboardSpec: RefOrMissing;
  workforceSpec: RefOrMissing;
  kpiDictionary: RefOrMissing;
  // §3 Interfaces
  dependencies: string[]; // genome ids
  inputs: GenomeInput[];
  outputs: GenomeOutput[];
  // §4 Assurance (computed loci — see computeMaturity + validation V3/V4)
  security: { level: 'public' | 'student' | 'founder' | 'secret'; posture: string; gateChain: string | null };
  accessibility: 'unmeasured' | 'posture' | 'audited' | 'n/a';
  translation: 'n/a' | 'none' | 'partial' | 'full';
  qaStatus: 'untested' | 'planned' | 'passing' | 'failing' | 'n/a';
  // §5 Operation
  workforce: { agent: string; role: 'operates' | 'stewards' | 'reviews' }[];
  kpis: GenomeKPI[] | typeof MISSING;
  maturity: 0 | 1 | 2 | 3 | 4 | 5; // computed — validation recomputes and rejects mismatch
  lifecycle: GenomeLifecycle;
  lastReview: string;
  nextReview: string;
  // §6 Lineage (Amendment I)
  parentCapability: string | null;
  childCapabilities: string[];
  derivedFrom: string[] | 'none';
  supersedes: string[] | 'none';
  replacedBy: string | null;
  constitutionalAuthority: string; // governance-registry key (spine position)
  founderDirectives: string[];
  engineeringDecisions: string[];
  architectureDecisions: string[];
  createdOn: string;
  ratifiedOn: string | null;
  retiredOn: string | null;
  evolution: LineageEvent[]; // append-only; first event must be 'created'
  // §7 Memory
  brainLink: string; // `genome:<id>:v<n>`
  improvementHistory: ImprovementEvent[];
}

// =============================================================================
// Computed Institutional Truth (Amendment III)
// =============================================================================
const present = (r: RefOrMissing): boolean => r !== MISSING;

/**
 * Engineering maturity, COMPUTED from artifact presence and measurement —
 * never hand-set. 8 signals → 0–5 scale:
 * reference model · playbook · standards(non-empty beyond the genome std) ·
 * dashboard spec · workforce spec · KPI dictionary · measured KPIs
 * (lifecycle ≥ measured) · ≥1 improvement event.
 */
export function computeMaturity(g: CapabilityGenome): 0 | 1 | 2 | 3 | 4 | 5 {
  if (g.classification === 'unknown') return 0; // V4: unknown locks maturity
  let signals = 0;
  if (present(g.referenceModel)) signals += 1;
  if (present(g.playbook)) signals += 1;
  if (g.standards.filter((s) => s !== 'capability-genome-standard').length > 0) signals += 1;
  if (present(g.dashboardSpec)) signals += 1;
  if (present(g.workforceSpec)) signals += 1;
  if (g.kpis !== MISSING && g.kpis.length > 0) signals += 1;
  if (LIFECYCLE_ORDER.indexOf(g.lifecycle) >= LIFECYCLE_ORDER.indexOf('measured') && g.lifecycle !== 'deprecated' && g.lifecycle !== 'retired') signals += 1;
  if (g.improvementHistory.length > 0) signals += 1;
  return Math.min(5, Math.round((signals / 8) * 5)) as 0 | 1 | 2 | 3 | 4 | 5;
}

// =============================================================================
// Validation rules V1–V12 (pure; every violation reported at once)
// =============================================================================
const ID_RE = /^[a-z-]+:[a-z0-9][a-z0-9-]*$/;
const DATE_OK = (s: string) => !Number.isNaN(new Date(s).getTime());

export function validateGenome(g: CapabilityGenome, resolve: (id: string) => boolean): string[] {
  const v: string[] = [];

  // V2 — identity format
  if (!ID_RE.test(g.id)) v.push(`V2: id '${g.id}' must match <type>:<kebab-slug>`);
  if (!g.id.startsWith(`${g.type}:`)) v.push(`V2: id prefix must equal type '${g.type}'`);

  // V1 — completeness of textual loci
  if (!g.mission?.trim()) v.push('V1: mission is required');
  if (!g.purpose?.trim()) v.push('V1: purpose is required');
  if (!g.owner?.trim()) v.push('V1: owner is required (exactly one)');
  if (!g.department?.trim()) v.push('V1: department is required');
  if (!g.constitutionalAuthority?.trim()) v.push('V1: constitutional authority (spine position) is required');
  if (!g.brainLink.startsWith(`genome:${g.id}:v`)) v.push('V1: brainLink must be genome:<id>:v<n>');

  // V3 — computed truth: maturity must equal the recomputation
  const computed = computeMaturity(g);
  if (g.maturity !== computed) v.push(`V3: maturity ${g.maturity} is asserted but computes to ${computed} — manual assertion prohibited`);

  // V4 — unknown locks claims
  if (g.classification === 'unknown') {
    if (g.maturity !== 0) v.push('V4: unknown classification requires maturity 0');
    if (!['proposed', 'draft'].includes(g.lifecycle)) v.push(`V4: unknown classification cannot hold lifecycle '${g.lifecycle}'`);
  }

  // V5 — gate declaration (the F-1 rule)
  for (const o of g.outputs) {
    if (o.writesProduction && !o.approvalGate?.trim()) {
      v.push(`V5: output '${o.name}' writes production without a named approval gate — invalid by construction`);
    }
  }

  // V6 — descent + dependency references resolve
  const refs: [string, string | null][] = [
    ...g.dependencies.map((d): [string, string | null] => ['dependency', d]),
    ['parent', g.parentCapability],
    ...(g.derivedFrom === 'none' ? [] : g.derivedFrom.map((d): [string, string | null] => ['derivedFrom', d])),
    ...(g.supersedes === 'none' ? [] : g.supersedes.map((d): [string, string | null] => ['supersedes', d])),
    ['replacedBy', g.replacedBy],
  ];
  for (const [kind, id] of refs) {
    if (id !== null && !resolve(id)) v.push(`V6: ${kind} '${id}' does not resolve to a genome`);
  }

  // V7 — lineage: first event is creation with evidence
  if (g.evolution.length === 0) v.push('V7: evolution must contain at least the creation event');
  else {
    if (g.evolution[0].kind !== 'created') v.push("V7: first evolution event must be 'created'");
    if (!g.evolution[0].evidence?.trim()) v.push('V7: creation event must carry authority evidence');
  }

  // V8 — constitutional attachment
  if (!g.standards.includes('capability-genome-standard')) v.push("V8: standards must include 'capability-genome-standard'");
  if (g.classification !== 'archived' && g.constitutionVolumes.length === 0) {
    v.push('V8: non-archived genomes must reference at least one Constitution Volume');
  }

  // V9 — lifecycle order + retirement rules
  if (!LIFECYCLE_ORDER.includes(g.lifecycle)) v.push(`V9: unknown lifecycle '${g.lifecycle}'`);
  if (g.lifecycle === 'retired' && !g.retiredOn) v.push('V9: retired genomes must carry retiredOn');
  if (g.retiredOn && g.lifecycle !== 'retired') v.push('V9: retiredOn set but lifecycle is not retired');

  // V10 — ratification coherence
  const hasRatifiedEvent = g.evolution.some((e) => e.kind === 'ratified');
  if (g.ratifiedOn && !hasRatifiedEvent) v.push('V10: ratifiedOn set without a ratified evolution event');
  if (!g.ratifiedOn && hasRatifiedEvent) v.push('V10: ratified evolution event without ratifiedOn');

  // V11 — dates
  for (const [label, d] of [['createdOn', g.createdOn], ['lastReview', g.lastReview], ['nextReview', g.nextReview]] as const) {
    if (!DATE_OK(d)) v.push(`V11: ${label} '${d}' is not a valid date`);
  }
  if (g.lifecycle !== 'retired' && DATE_OK(g.lastReview) && DATE_OK(g.nextReview) &&
      new Date(g.nextReview).getTime() <= new Date(g.lastReview).getTime()) {
    v.push('V11: nextReview must follow lastReview');
  }

  return v;
}

/** V12 — honesty rendering: unmeasured/unknown serialize as '—', never 0/100. */
export function renderScore(value: number | null | undefined): string {
  return value == null ? '—' : String(value);
}
