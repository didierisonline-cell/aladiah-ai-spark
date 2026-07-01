import { describe, expect, it } from 'vitest';
import { Recommendation, validateRecommendation } from './intelligence';

const valid = (): Recommendation => ({
  department: 'operations-platform',
  title: 'Fix payment dunning gap',
  summary: 'Past-due subscriptions have no recovery flow.',
  evidence: [{ at: '2026-07-01T00:00:00Z', author: 'operations-platform', note: '3 past_due rows in subscriptions (live query 2026-07-01).' }],
  confidence: { value: 0.8, basis: 'Reproducible live query; counted rows directly.' },
  estimatedImpact: 'Recover up to 3 at-risk subscriptions/mo.',
  estimatedEffort: '1–2 days including founder-approved email templates.',
  risks: ['Dunning emails could annoy recoverable customers'],
  dependencies: ['email_send_log abuse lockdown'],
  successMetrics: ['past_due count returns to 0 within 30 days'],
});

describe('validateRecommendation — the mandatory contract', () => {
  it('accepts a fully-specified recommendation', () => {
    expect(validateRecommendation(valid())).toEqual([]);
  });

  it('rejects a recommendation without evidence (canon rule 1)', () => {
    const r = { ...valid(), evidence: [] };
    expect(validateRecommendation(r).join(' ')).toMatch(/evidence/);
  });

  it('rejects empty evidence notes', () => {
    const r = { ...valid(), evidence: [{ at: '', author: 'x', note: '  ' }] };
    expect(validateRecommendation(r).join(' ')).toMatch(/empty/);
  });

  it('rejects confidence without a basis', () => {
    const r = { ...valid(), confidence: { value: 0.9, basis: '' } };
    expect(validateRecommendation(r).join(' ')).toMatch(/basis/);
  });

  it('rejects out-of-range confidence', () => {
    expect(validateRecommendation({ ...valid(), confidence: { value: 1.5, basis: 'x' } }).join(' ')).toMatch(/0–1/);
    expect(validateRecommendation({ ...valid(), confidence: { value: -0.1, basis: 'x' } }).join(' ')).toMatch(/0–1/);
  });

  it('requires impact, effort, risks, and success metrics', () => {
    expect(validateRecommendation({ ...valid(), estimatedImpact: '' }).join(' ')).toMatch(/estimatedImpact/);
    expect(validateRecommendation({ ...valid(), estimatedEffort: ' ' }).join(' ')).toMatch(/estimatedEffort/);
    expect(validateRecommendation({ ...valid(), risks: [] }).join(' ')).toMatch(/risks/);
    expect(validateRecommendation({ ...valid(), successMetrics: [] }).join(' ')).toMatch(/success metric/);
  });

  it('reports ALL violations at once, not just the first', () => {
    const r = { ...valid(), evidence: [], estimatedImpact: '', risks: [] };
    expect(validateRecommendation(r).length).toBeGreaterThanOrEqual(3);
  });
});
