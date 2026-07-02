import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  GOVERNING_DOCUMENTS,
  childrenOf,
  getDocument,
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
});
