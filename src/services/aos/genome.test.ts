import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CapabilityGenome,
  computeMaturity,
  renderScore,
  validateGenome,
  MISSING,
} from './genome';
import {
  CAPABILITY_GENOMES,
  genomeExists,
  getGenome,
  getRegistrySummary,
} from './institutionalRegistry';
import { SHADOW_SEEDERS } from './edgeFunctionManifest';

const repoRoot = resolve(__dirname, '../../..');

// ---- Fixture ------------------------------------------------------------------
const valid = (): CapabilityGenome => ({
  id: 'service:test-capability',
  mission: 'Serve learners (Covenant Art. XIII).',
  purpose: 'A test capability.',
  type: 'service',
  classification: 'operational',
  owner: 'operations-platform',
  authority: 'operational',
  institute: null,
  department: 'operations-platform',
  constitutionVolumes: ['02'],
  founderStandards: { na: 'Volume II reserved' },
  referenceModel: MISSING,
  playbook: MISSING,
  standards: ['capability-genome-standard'],
  dashboardSpec: MISSING,
  workforceSpec: MISSING,
  kpiDictionary: MISSING,
  dependencies: [],
  inputs: [],
  outputs: [],
  security: { level: 'founder', posture: 'test', gateChain: null },
  accessibility: 'n/a',
  translation: 'n/a',
  qaStatus: 'untested',
  workforce: [],
  kpis: MISSING,
  maturity: 0,
  lifecycle: 'draft',
  lastReview: '2026-07-02',
  nextReview: '2026-07-16',
  parentCapability: null,
  childCapabilities: [],
  derivedFrom: 'none',
  supersedes: 'none',
  replacedBy: null,
  constitutionalAuthority: 'agent-operating-system',
  founderDirectives: [],
  engineeringDecisions: [],
  architectureDecisions: [],
  createdOn: '2026-07-02',
  ratifiedOn: null,
  retiredOn: null,
  evolution: [{ on: '2026-07-02', kind: 'created', by: 'founder', evidence: 'test fixture' }],
  brainLink: 'genome:service:test-capability:v1',
  improvementHistory: [],
});

const noResolve = () => false;
const allResolve = () => true;

describe('Genome validation — the ratified rules V1–V12', () => {
  it('accepts a complete honest genome', () => {
    expect(validateGenome(valid(), allResolve)).toEqual([]);
  });

  it('V2: rejects malformed or type-mismatched ids', () => {
    expect(validateGenome({ ...valid(), id: 'Bad_ID' }, allResolve).join(' ')).toMatch(/V2/);
    expect(validateGenome({ ...valid(), id: 'program:test-capability' }, allResolve).join(' ')).toMatch(/V2/);
  });

  it('V3: manual maturity assertion is prohibited (computed truth)', () => {
    const g = { ...valid(), maturity: 5 as const };
    expect(validateGenome(g, allResolve).join(' ')).toMatch(/V3.*manual assertion prohibited/);
  });

  it('V4: unknown classification locks maturity and lifecycle', () => {
    const g = { ...valid(), classification: 'unknown' as const, lifecycle: 'implemented' as const };
    const issues = validateGenome(g, allResolve).join(' ');
    expect(issues).toMatch(/V4/);
  });

  it('V5: a production write without a named gate is invalid by construction', () => {
    const g = {
      ...valid(),
      outputs: [{ name: 'course content', kind: 'artifact' as const, writesProduction: true, approvalGate: null }],
    };
    expect(validateGenome(g, allResolve).join(' ')).toMatch(/V5.*invalid by construction/);
  });

  it('V6: descent and dependency references must resolve', () => {
    const g = { ...valid(), derivedFrom: ['edge-function:ghost'] as string[] };
    expect(validateGenome(g, noResolve).join(' ')).toMatch(/V6.*ghost/);
  });

  it('V7: lineage requires a creation event with evidence', () => {
    expect(validateGenome({ ...valid(), evolution: [] }, allResolve).join(' ')).toMatch(/V7/);
    const g = { ...valid(), evolution: [{ on: '2026-07-02', kind: 'created' as const, by: 'x', evidence: '' }] };
    expect(validateGenome(g, allResolve).join(' ')).toMatch(/V7.*authority evidence/);
  });

  it('V8: constitutional attachment is mandatory', () => {
    expect(validateGenome({ ...valid(), standards: [] }, allResolve).join(' ')).toMatch(/V8/);
    expect(validateGenome({ ...valid(), constitutionVolumes: [] }, allResolve).join(' ')).toMatch(/V8/);
  });

  it('V9/V10: retirement and ratification coherence', () => {
    expect(validateGenome({ ...valid(), lifecycle: 'retired' as const }, allResolve).join(' ')).toMatch(/V9.*retiredOn/);
    expect(validateGenome({ ...valid(), ratifiedOn: '2026-07-02' }, allResolve).join(' ')).toMatch(/V10/);
  });

  it('V12: unmeasured renders as —, never a number', () => {
    expect(renderScore(null)).toBe('—');
    expect(renderScore(undefined)).toBe('—');
    expect(renderScore(74)).toBe('74');
  });

  it('computeMaturity: unknown locks to 0; artifacts raise it', () => {
    expect(computeMaturity({ ...valid(), classification: 'unknown' })).toBe(0);
    const rich = {
      ...valid(),
      referenceModel: 'x.md', playbook: 'y.md', dashboardSpec: 'z.md',
      workforceSpec: 'w.md', standards: ['capability-genome-standard', 'qa-standard'],
      kpis: [{ key: 'k', formula: 'f', target: 't', owner: 'o', cadence: 'c', source: 's' }],
    };
    expect(computeMaturity(rich)).toBeGreaterThanOrEqual(3);
  });
});

describe('Institutional Registry — the constitutional catalog', () => {
  it('every first-generation genome validates with ZERO violations', () => {
    for (const g of CAPABILITY_GENOMES) {
      expect(validateGenome(g, genomeExists), g.id).toEqual([]);
    }
  });

  it('genome ids are unique', () => {
    const ids = CAPABILITY_GENOMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('scanner parity (edge-function class): every deployed function has a genome, and vice versa', () => {
    const onDisk = readdirSync(resolve(repoRoot, 'supabase/functions')).filter((d) => d !== '_shared');
    const inRegistry = CAPABILITY_GENOMES.filter((g) => g.type === 'edge-function').map((g) => g.id.split(':')[1]);
    for (const fn of onDisk) {
      expect(inRegistry.includes(fn), `edge function '${fn}' exists on disk without a genome`).toBe(true);
    }
    for (const fn of inRegistry) {
      expect(existsSync(resolve(repoRoot, `supabase/functions/${fn}`)), `genome 'edge-function:${fn}' has no function on disk`).toBe(true);
    }
  });

  it('the 37 unknown seeders are maturity-locked at 0 with quarantine gates', () => {
    const unknowns = CAPABILITY_GENOMES.filter((g) => g.classification === 'unknown');
    expect(unknowns.length).toBe(SHADOW_SEEDERS.filter((s) => s.classification === 'unknown').length);
    for (const g of unknowns) {
      expect(g.maturity, g.id).toBe(0);
      expect(g.outputs.every((o) => !o.writesProduction || !!o.approvalGate), g.id).toBe(true);
    }
  });

  it('lineage: the flagship program permanently records its shadow-era descent', () => {
    const flagship = getGenome('program:ai-scrum-master-v3')!;
    expect(flagship.derivedFrom).toContain('edge-function:seed-scrum-course');
    expect(flagship.supersedes).toContain('edge-function:seed-scrum-course');
    expect(genomeExists('edge-function:seed-scrum-course')).toBe(true); // the ancestor remains discoverable
  });

  it('registry summary: unknown queue is risk-ordered, destructive first', () => {
    const s = getRegistrySummary(new Date('2026-07-02'));
    expect(s.total).toBe(CAPABILITY_GENOMES.length);
    expect(s.unknownQueue.length).toBeGreaterThan(30);
    const firstDestructive = s.unknownQueue.findIndex((q) => q.risk.includes('DESTRUCTIVE'));
    const lastNonDestructive = s.unknownQueue.map((q) => q.risk.includes('DESTRUCTIVE')).lastIndexOf(false);
    expect(firstDestructive).toBe(0);
    expect(s.parityEnforcedClasses).toContain('edge-function');
    expect(lastNonDestructive).toBeGreaterThan(firstDestructive);
  });

  it('the registry catalogs itself (a capability like any other)', () => {
    const self = getGenome('service:institutional-registry')!;
    expect(self.kpis).not.toBe('missing');
    expect(self.referenceModel).toBe('docs/engineering/registry/01-reference-model.md');
  });

  // ---- FD-2026-006 P1: first-generation migration coverage ----------------------
  it('scanner parity (dashboard class): every page on disk has a genome and vice versa', () => {
    const dashboards = CAPABILITY_GENOMES.filter((g) => g.type === 'dashboard');
    for (const g of dashboards) {
      expect(existsSync(resolve(repoRoot, g.referenceModel as string)), g.id).toBe(true);
    }
    const pageFiles = ['', 'admin/', 'founder/', 'portal/', 'legal/'].flatMap((d) => {
      const dir = resolve(repoRoot, `src/pages/${d}`);
      return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.tsx')).map((f) => `src/pages/${d}${f}`) : [];
    });
    expect(dashboards.length).toBe(pageFiles.length);
  });

  it('every chartered department + persona has an ai-role genome; identities resolve (P4)', () => {
    const DEPARTMENTS = [
      'ceo-chief-of-staff', 'marketing-content', 'seo-strategy', 'product-builder',
      'qa-authority', 'admissions-authority', 'student-success', 'placement-authority',
      'analytics-intelligence', 'operations-platform', 'curriculum-excellence', 'interface-experience',
    ];
    for (const slug of DEPARTMENTS) {
      const g = getGenome(`ai-role:${slug}`);
      expect(g, slug).toBeTruthy();
      expect(g!.workforceSpec).toBe(`docs/agents/${slug}/AGENT_SPEC.md`);
    }
    expect(getGenome('ai-role:prof-didier')).toBeTruthy();
    expect(getGenome('ai-role:career-simulation-engine')).toBeTruthy();
  });

  it('every governing document is bridged into the catalog (policy class)', () => {
    const policies = CAPABILITY_GENOMES.filter((g) => g.type === 'policy');
    expect(policies.length).toBeGreaterThanOrEqual(26);
    expect(getGenome('policy:covenant')).toBeTruthy();
    expect(getGenome('policy:capability-genome-standard')?.lifecycle).toBe('institutionalized'); // ratified
  });

  it('founder directives of the epoch are accessioned', () => {
    expect(getGenome('founder-directive:fd-2026-004-genome-ratification')).toBeTruthy();
    expect(getGenome('founder-directive:fd-2026-006-institutional-construction')).toBeTruthy();
    expect(getGenome('founder-directive:fd-2026-007-operational-excellence')).toBeTruthy();
  });

  it('FD-2026-017 (Flagship Production Doctrine) is accessioned with its verbatim doctrine document', () => {
    const g = getGenome('founder-directive:fd-2026-017-flagship-production-doctrine');
    expect(g).toBeTruthy();
    expect(g!.referenceModel).toBe('docs/governance/standards/flagship-production-doctrine.md');
    // The fixed production order, in the founder's sequence, is part of the record.
    for (const [i, program] of [
      'AI Enterprise Scrum Master & Agile Transformation Leader',
      'AI Enterprise Business Analyst & Business Transformation Specialist',
      'AI Enterprise Project Manager & Strategic Delivery Leader',
      'AI Data Analyst & Analytics Engineer',
      'AI Enterprise Cybersecurity & Digital Trust Engineer',
    ].entries()) {
      expect(g!.purpose).toContain(`${i + 1} ${program}`);
    }
    expect(g!.authority).toBe('constitutional');
    expect(g!.lifecycle).toBe('institutionalized');
  });

  it('FD-2026-018 (Product Era) is accessioned as a registry entry only — the governance moratorium honored', () => {
    const g = getGenome('founder-directive:fd-2026-018-product-era');
    expect(g).toBeTruthy();
    expect(g!.purpose).toContain('Architecture exists to serve products');
    // No new governance document: the directive rides the standing directive record.
    expect(g!.referenceModel).toBe('docs/audits/FOUNDER_ENGINEERING_REPORT_FD2026.md');
  });

  // ---- FD-2026-007: every AI is a governed employee ------------------------------
  it('canon-stated KPI dictionaries attach to their departments; none are invented', () => {
    const withKpis = ['analytics-intelligence', 'placement-authority', 'student-success', 'product-builder', 'admissions-authority', 'marketing-content', 'qa-authority', 'operations-platform', 'interface-experience'];
    for (const slug of withKpis) {
      const g = getGenome(`ai-role:${slug}`)!;
      expect(g.kpis, slug).not.toBe('missing');
      const kpis = g.kpis as { formula: string }[];
      expect(kpis[0].formula.length, slug).toBeGreaterThan(20); // formula cites the charter
    }
    // Departments whose charters state no primary KPI stay honestly missing:
    expect(getGenome('ai-role:ceo-chief-of-staff')!.kpis).toBe('missing');
    expect(getGenome('ai-role:seo-strategy')!.kpis).toBe('missing');
  });

  it('KPI-bearing departments gain maturity from measurement, computed not asserted', () => {
    const g = getGenome('ai-role:analytics-intelligence')!;
    expect(g.maturity).toBeGreaterThanOrEqual(3); // model+playbook+standards+spec+kpis
    expect(validateGenome(g, genomeExists)).toEqual([]); // V3 confirms it is computed
  });
});
