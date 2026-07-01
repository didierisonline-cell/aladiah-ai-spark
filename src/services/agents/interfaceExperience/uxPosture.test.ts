import { describe, expect, it } from 'vitest';
import { getUXPosture } from './uxPosture';

describe('getUXPosture — honest structural scoring', () => {
  const p = getUXPosture();

  it('section weights sum to 1 (overall is a true weighted average)', () => {
    const total = p.sections.reduce((a, s) => a + s.weight, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('every score is bounded 0–100', () => {
    expect(p.overall).toBeGreaterThanOrEqual(0);
    expect(p.overall).toBeLessThanOrEqual(100);
    for (const s of p.sections) {
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it('unmeasured areas are declared, not silently scored', () => {
    expect(p.unmeasured.length).toBeGreaterThan(0);
    for (const u of p.unmeasured) expect(u.how.length).toBeGreaterThan(0);
  });

  it('every check carries evidence detail (no bare verdicts)', () => {
    for (const s of p.sections) {
      for (const c of s.checks) expect(c.detail.length).toBeGreaterThan(0);
    }
  });
});
