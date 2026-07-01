import { describe, expect, it } from 'vitest';
import {
  GateKey,
  WorkOrder,
  gatesCleared,
  gatesForType,
  nextPendingGate,
} from './workOrders';

const baseOrder = (gates: Partial<WorkOrder['gates']>): WorkOrder => ({
  id: 'wo-1',
  title: 'Test order',
  description: null,
  type: 'content',
  ownerAgent: 'product-builder',
  collaborators: [],
  priority: 'medium',
  status: 'ready',
  dependsOn: [],
  acceptanceCriteria: [],
  gates: { qa: 'not_required', security: 'not_required', translation: 'not_required', ux: 'not_required', ...gates },
  founderApproval: 'not_submitted',
  evidence: [],
  createdAt: '2026-07-01T00:00:00Z',
  updatedAt: '2026-07-01T00:00:00Z',
});

describe('gatesForType — governance defaults', () => {
  it('content and curriculum require QA, translation, and UX review', () => {
    for (const t of ['content', 'curriculum'] as const) {
      const g = gatesForType(t);
      expect(g.qa).toBe('pending');
      expect(g.translation).toBe('pending');
      expect(g.ux).toBe('pending');
      expect(g.security).toBe('not_required');
    }
  });

  it('platform and deployment always require the Security gate', () => {
    for (const t of ['platform', 'deployment'] as const) {
      expect(gatesForType(t).security).toBe('pending');
      expect(gatesForType(t).qa).toBe('pending');
    }
  });

  it('recommendations go straight to founder review (no gates)', () => {
    const g = gatesForType('recommendation');
    expect(Object.values(g).every((s) => s === 'not_required')).toBe(true);
  });

  it('design orders require the UX gate', () => {
    expect(gatesForType('design').ux).toBe('pending');
  });
});

describe('nextPendingGate — canonical review order', () => {
  it('returns gates in QA → Security → Translation → UX order', () => {
    const wo = baseOrder({ qa: 'pending', security: 'pending', translation: 'pending', ux: 'pending' });
    const seen: GateKey[] = [];
    for (const expected of ['qa', 'security', 'translation', 'ux'] as GateKey[]) {
      const next = nextPendingGate(wo);
      expect(next).toBe(expected);
      seen.push(next as GateKey);
      wo.gates[next as GateKey] = 'passed';
    }
    expect(nextPendingGate(wo)).toBeNull();
    expect(seen).toEqual(['qa', 'security', 'translation', 'ux']);
  });

  it('a failed gate still blocks the order (failure is not a pass)', () => {
    const wo = baseOrder({ qa: 'failed' });
    expect(nextPendingGate(wo)).toBe('qa');
    expect(gatesCleared(wo)).toBe(false);
  });

  it('in_review gates are still blocking', () => {
    const wo = baseOrder({ ux: 'in_review' });
    expect(nextPendingGate(wo)).toBe('ux');
  });
});

describe('gatesCleared — founder-approval precondition', () => {
  it('true only when every gate is passed or not required', () => {
    expect(gatesCleared(baseOrder({}))).toBe(true);
    expect(gatesCleared(baseOrder({ qa: 'passed', ux: 'passed' }))).toBe(true);
    expect(gatesCleared(baseOrder({ qa: 'pending' }))).toBe(false);
    expect(gatesCleared(baseOrder({ qa: 'passed', security: 'failed' }))).toBe(false);
  });
});
