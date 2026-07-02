import { describe, expect, it } from 'vitest';
import {
  IntelligenceFinding,
  RECOMMEND_CONFIDENCE_THRESHOLD,
  Recommendation,
  findDuplicate,
  normalizeTitle,
  shouldRecommend,
  validateFinding,
  validateRecommendation,
} from './intelligence';
import type { WorkOrder } from './workOrders';

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

// ---- Findings: the evidence gate at the mouth of the pipeline ----------------
const finding = (over: Partial<IntelligenceFinding> = {}): IntelligenceFinding => ({
  department: 'operations-platform',
  title: 'DB latency spike',
  detail: 'p95 latency exceeded 2s',
  evidence: [{ at: '2026-07-01T00:00:00Z', author: 'operations-platform', note: 'Live probe: 2100ms at 2026-07-01.' }],
  confidence: { value: 0.8, basis: 'Reproducible probe.' },
  severity: 'attention',
  ...over,
});

const rec = {
  summary: 'Investigate latency',
  estimatedImpact: 'Faster student experience',
  estimatedEffort: '1 day',
  risks: ['none identified'],
  dependencies: [],
  successMetrics: ['p95 < 500ms'],
};

describe('validateFinding — no evidence, no entry', () => {
  it('accepts a well-formed finding', () => {
    expect(validateFinding(finding())).toEqual([]);
  });
  it('rejects findings without evidence', () => {
    expect(validateFinding(finding({ evidence: [] })).join(' ')).toMatch(/evidence/);
  });
  it('rejects empty evidence notes', () => {
    expect(validateFinding(finding({ evidence: [{ at: '', author: 'x', note: '' }] })).join(' ')).toMatch(/empty/);
  });
  it('rejects missing department or title', () => {
    expect(validateFinding(finding({ department: ' ' })).join(' ')).toMatch(/department/);
    expect(validateFinding(finding({ title: '' })).join(' ')).toMatch(/title/);
  });
  it('rejects confidence without basis or out of range', () => {
    expect(validateFinding(finding({ confidence: { value: 0.5, basis: '' } })).join(' ')).toMatch(/basis/);
    expect(validateFinding(finding({ confidence: { value: 2, basis: 'x' } })).join(' ')).toMatch(/0–1/);
  });
});

describe('shouldRecommend — the confidence threshold', () => {
  it('recommends only at/above the threshold with a rec attached', () => {
    expect(shouldRecommend(finding({ recommendation: rec, confidence: { value: RECOMMEND_CONFIDENCE_THRESHOLD, basis: 'x' } }))).toBe(true);
    expect(shouldRecommend(finding({ recommendation: rec, confidence: { value: 0.59, basis: 'x' } }))).toBe(false);
  });
  it('never recommends without an attached recommendation', () => {
    expect(shouldRecommend(finding({ confidence: { value: 0.99, basis: 'x' } }))).toBe(false);
  });
  it('never recommends from an invalid finding, regardless of confidence', () => {
    expect(shouldRecommend(finding({ recommendation: rec, evidence: [] }))).toBe(false);
  });
});

// ---- Duplicate prevention ------------------------------------------------------
const order = (title: string, over: Partial<WorkOrder> = {}): WorkOrder => ({
  id: 'x', title, description: null, type: 'recommendation', ownerAgent: 'a',
  collaborators: [], priority: 'medium', status: 'ready', dependsOn: [],
  acceptanceCriteria: [], gates: { qa: 'not_required', security: 'not_required', translation: 'not_required', ux: 'not_required' },
  founderApproval: 'not_submitted', evidence: [], createdAt: '', updatedAt: '', ...over,
});

describe('findDuplicate — sweeps must be idempotent', () => {
  it('matches case- and whitespace-insensitively', () => {
    expect(normalizeTitle('  Fix   Payment  GAP ')).toBe('fix payment gap');
    expect(findDuplicate([order('Fix Payment Gap')], '  fix   payment gap ')).toBeTruthy();
  });
  it('completed / cancelled / failed / rejected orders do not block re-raising', () => {
    expect(findDuplicate([order('T', { status: 'completed' })], 'T')).toBeUndefined();
    expect(findDuplicate([order('T', { status: 'cancelled' })], 'T')).toBeUndefined();
    expect(findDuplicate([order('T', { status: 'failed' })], 'T')).toBeUndefined();
    expect(findDuplicate([order('T', { founderApproval: 'rejected' })], 'T')).toBeUndefined();
  });
  it('in-flight orders DO block duplicates', () => {
    expect(findDuplicate([order('T', { status: 'in_progress' })], 'T')).toBeTruthy();
    expect(findDuplicate([order('T', { founderApproval: 'pending' })], 'T')).toBeTruthy();
  });
});
