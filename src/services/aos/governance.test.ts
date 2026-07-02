import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import {
  FRAMEWORK_SLOTS,
  GOVERNING_DOCUMENTS,
  childrenOf,
  getDocument,
  getDocumentHealth,
  getGovernanceHealth,
  getGovernanceNode,
  getGovernanceSummary,
  isReviewDue,
} from './governance';

describe('Institutional Knowledge registry — integrity', () => {
  it('keys are unique', () => {
    const keys = GOVERNING_DOCUMENTS.map((d) => d.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('every parent reference resolves to a registered document', () => {
    for (const d of GOVERNING_DOCUMENTS) {
      if (d.parent !== null) {
        expect(getDocument(d.parent), `${d.key} → parent '${d.parent}'`).toBeTruthy();
      }
    }
  });

  it('exactly one root (the constitution) anchors the hierarchy', () => {
    const roots = GOVERNING_DOCUMENTS.filter((d) => d.parent === null);
    expect(roots.map((r) => r.key)).toEqual(['constitution']);
  });

  it('no document is its own ancestor (acyclic authority chain)', () => {
    for (const d of GOVERNING_DOCUMENTS) {
      const seen = new Set<string>();
      let cur = d.parent;
      while (cur) {
        expect(seen.has(cur), `cycle through '${cur}' from '${d.key}'`).toBe(false);
        seen.add(cur);
        cur = getDocument(cur)?.parent ?? null;
      }
    }
  });

  it('ratified documents carry a ratification record; drafts never do', () => {
    for (const d of GOVERNING_DOCUMENTS) {
      if (d.status === 'ratified') expect(d.ratified, d.key).toBeTruthy();
      if (d.status === 'draft') expect(d.ratified, d.key).toBeNull();
    }
  });

  it('versions and review dates are well-formed', () => {
    for (const d of GOVERNING_DOCUMENTS) {
      expect(d.version).toMatch(/^\d+\.\d+$/);
      expect(Number.isNaN(new Date(d.lastReview).getTime()), d.key).toBe(false);
      expect(Number.isNaN(new Date(d.nextReview).getTime()), d.key).toBe(false);
    }
  });

  it('the headline four render for the cockpit', () => {
    const s = getGovernanceSummary(new Date('2026-07-01'));
    expect(s.headline.map((h) => h.key)).toEqual([
      'constitution', 'founder-standards', 'enterprise-architecture', 'intelligence-architecture',
    ]);
    expect(s.total).toBe(GOVERNING_DOCUMENTS.length);
  });

  it('review-due detection works at the boundary', () => {
    const doc = getDocument('constitution')!;
    expect(isReviewDue(doc, new Date('2026-07-14'))).toBe(false);
    expect(isReviewDue(doc, new Date('2026-07-16'))).toBe(true);
  });

  it('children derive from parent links (constitution anchors the canon)', () => {
    const kids = childrenOf('constitution').map((d) => d.key);
    expect(kids).toContain('north-star');
    expect(kids).toContain('launch-decision-principle');
  });
});

// =============================================================================
// Governance Registry Drift Check — runs in CI via `npm test`.
// The registry is only trustworthy if it matches the repository: every
// registered path must exist on disk, every review schedule must be sane,
// and the governance tree itself must be present. A registry that lies is
// worse than no registry (LAUNCH_DECISION_PRINCIPLE).
// =============================================================================
const repoRoot = resolve(__dirname, '../../..');

describe('Governance drift check — registry vs repository', () => {
  it('every registered document path exists on disk', () => {
    for (const d of GOVERNING_DOCUMENTS) {
      expect(existsSync(resolve(repoRoot, d.path)), `${d.key} → ${d.path}`).toBe(true);
    }
  });

  it('review schedules are sane (nextReview strictly after lastReview)', () => {
    for (const d of GOVERNING_DOCUMENTS) {
      expect(
        new Date(d.nextReview).getTime() > new Date(d.lastReview).getTime(),
        `${d.key}: nextReview must follow lastReview`,
      ).toBe(true);
    }
  });

  it('the governance tree structure exists', () => {
    for (const p of [
      'docs/governance/README.md',
      'docs/governance/constitution/constitution.md',
      'docs/governance/constitution/changelog.md',
      'docs/governance/constitution/ratification.md',
      'docs/governance/architecture/enterprise-architecture.md',
      'docs/governance/architecture/intelligence-architecture.md',
      'docs/governance/architecture/diagrams.md',
      'docs/governance/standards/README.md',
      'docs/governance/manuals/README.md',
      'docs/governance/manuals/FOUNDER_VALIDATION_MANUAL.md',
      'docs/governance/manuals/LAUNCH_COMMAND_CENTER.md',
      'docs/governance/departments/README.md',
      'docs/governance/playbooks/README.md',
    ]) {
      expect(existsSync(resolve(repoRoot, p)), p).toBe(true);
    }
  });

  it('every department in bootstrap has an AGENT_SPEC on disk', () => {
    const DEPARTMENTS = [
      'ceo-chief-of-staff', 'marketing-content', 'seo-strategy', 'product-builder',
      'qa-authority', 'admissions-authority', 'student-success', 'placement-authority',
      'analytics-intelligence', 'operations-platform', 'curriculum-excellence',
      'interface-experience',
    ];
    for (const slug of DEPARTMENTS) {
      expect(existsSync(resolve(repoRoot, `docs/agents/${slug}/AGENT_SPEC.md`)), slug).toBe(true);
    }
  });

  // ---- Automatic registration: a governance doc that exists unregistered
  // ---- fails CI — this is how markdown "registers itself".
  const walkMd = (dir: string): string[] => {
    const out: string[] = [];
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) out.push(...walkMd(p));
      else if (p.endsWith('.md')) out.push(p);
    }
    return out;
  };

  /** Index/history files that support registered documents rather than govern. */
  const EXEMPT = new Set([
    'docs/governance/README.md',            // the map itself
    'docs/governance/standards/README.md',  // index of canon kept in place
    'docs/governance/manuals/README.md',    // manuals index
    'docs/governance/playbooks/README.md',  // playbooks index
    'docs/governance/constitution/changelog.md', // history of a registered doc
    'docs/governance/architecture/diagrams.md',  // visual aid to registered docs
    'docs/governance/manuals/validation-walks/ba-flagship-walk.md',      // chapter of the registered manual
    'docs/governance/manuals/validation-walks/founder-portal-walk.md',   // chapter of the registered manual
  ]);

  it('every governance document is registered (or an explicit index/chapter)', () => {
    const registered = new Set(GOVERNING_DOCUMENTS.map((d) => d.path));
    const files = walkMd(resolve(repoRoot, 'docs/governance'))
      .map((p) => p.slice(repoRoot.length + 1).split('\\').join('/'));
    for (const f of files) {
      expect(registered.has(f) || EXEMPT.has(f), `unregistered governance document: ${f}`).toBe(true);
    }
  });

  it('no broken relative links inside the governance tree', () => {
    const files = walkMd(resolve(repoRoot, 'docs/governance'));
    for (const f of files) {
      const content = readFileSync(f, 'utf8');
      for (const m of content.matchAll(/\]\((?!https?:|#|mailto:)([^)\s]+?\.md)[)#]/g)) {
        const target = m[1].startsWith('/')
          ? resolve(repoRoot, m[1].slice(1))
          : resolve(dirname(f), m[1]);
        expect(existsSync(target), `${f.slice(repoRoot.length + 1)} → broken link ${m[1]}`).toBe(true);
      }
    }
  });
});

// =============================================================================
// Governance graph — the six questions every document must answer.
// =============================================================================
describe('Governance graph', () => {
  it('answers who governs me / what do I govern / who depends on me', () => {
    const node = getGovernanceNode('intelligence-architecture')!;
    expect(node.governedBy?.key).toBe('agent-operating-system');
    expect(node.dependents.map((d) => d.key)).toContain('continuous-improvement');
    const constitution = getGovernanceNode('constitution')!;
    expect(constitution.governedBy).toBeNull();
    expect(constitution.governs.length).toBeGreaterThanOrEqual(5);
  });

  it('resolves applying standards and consuming departments', () => {
    const node = getGovernanceNode('intelligence-architecture')!;
    expect(node.standardsApplying.map((s) => s.key)).toContain('qa-standard');
    const taxonomy = getGovernanceNode('competency-taxonomy')!;
    expect(taxonomy.departmentsConsuming).toContain('curriculum-excellence');
  });

  it('returns null for unknown keys', () => {
    expect(getGovernanceNode('does-not-exist')).toBeNull();
  });
});

// =============================================================================
// Governance health — the Governance Center data model.
// =============================================================================
describe('Governance health', () => {
  const AS_OF = new Date('2026-07-02');

  it('every framework slot is present in the registry', () => {
    const h = getGovernanceHealth(AS_OF);
    expect(h.missingSlots).toEqual([]);
    expect(h.slots.length).toBe(FRAMEWORK_SLOTS.length);
  });

  it('every registered document is individually healthy as of 2026-07-02', () => {
    const h = getGovernanceHealth(AS_OF);
    const sick = h.documents.filter((d) => !d.healthy);
    expect(sick.map((s) => `${s.key}: ${s.issues.join('; ')}`)).toEqual([]);
  });

  it('detects broken dependencies and overdue reviews', () => {
    const bad = getDocumentHealth(
      { ...GOVERNING_DOCUMENTS[0], dependencies: ['ghost-doc'], nextReview: '2020-01-01' },
      AS_OF,
    );
    expect(bad.healthy).toBe(false);
    expect(bad.issues.join(' ')).toMatch(/ghost-doc/);
    expect(bad.issues.join(' ')).toMatch(/overdue/);
  });

  it('scores structure, health, and ratification into 0–100', () => {
    const h = getGovernanceHealth(AS_OF);
    expect(h.score).toBeGreaterThan(0);
    expect(h.score).toBeLessThanOrEqual(100);
  });

  it('history is coherent: every ratified doc has a ratification event', () => {
    for (const d of GOVERNING_DOCUMENTS.filter((x) => x.status === 'ratified')) {
      expect(d.history.some((h) => h.kind === 'ratified'), d.key).toBe(true);
    }
  });
});
