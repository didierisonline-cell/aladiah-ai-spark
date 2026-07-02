import { describe, expect, it } from 'vitest';
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
