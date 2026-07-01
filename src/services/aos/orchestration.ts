// =============================================================================
// Inter-Agent Orchestration — the work-order pipeline.
// Encodes how the workforce coordinates instead of operating in isolation:
//
//   CEO Chief of Staff ── creates executive recommendations (work orders)
//   Product Builder ────── drafts curriculum/platform artifacts
//   QA Authority ───────── reviews drafts (gate: qa)
//   Security ───────────── reviews anything risky (gate: security)
//   Localization ───────── translation readiness (gate: translation)
//   Interface & UX ─────── UX review before founder sign-off (gate: ux)
//   Analytics ──────────── computes readiness scores (read-only)
//   Operations ─────────── platform integrity checks (read-only)
//   FOUNDER ────────────── approves before anything publishes or deploys
//
// This module only moves work-order state and sends AOS messages/tasks. It
// never executes, publishes, or deploys the underlying work — that stays
// behind each agent's own founder-gated surface.
// =============================================================================
import { delegateTask, sendMessage, CEO_AGENT } from './communication';
import { emitEvent } from './events';
import {
  GateKey,
  WorkOrder,
  createWorkOrder,
  CreateWorkOrderInput,
  gatesCleared,
  nextPendingGate,
  setFounderApproval,
  setGateStatus,
} from './workOrders';

export const UX_AGENT = 'interface-experience';
export const QA_AGENT = 'qa-authority';

/**
 * Which agent reviews each gate. Gates without a registered reviewing agent
 * (security, translation) are founder-reviewed on their dedicated surfaces —
 * the pipeline notifies the CEO agent so the item is surfaced, never skipped.
 */
export const GATE_REVIEWERS: Record<GateKey, { agent: string | null; label: string; surface: string }> = {
  qa: { agent: QA_AGENT, label: 'QA Authority', surface: '/admin/qa-agent' },
  security: { agent: null, label: 'Security Command Center', surface: '/admin/security' },
  translation: { agent: null, label: 'Localization Factory', surface: '/founder/localization' },
  ux: { agent: UX_AGENT, label: 'Interface & Experience Architect', surface: '/admin/interface-agent' },
};

/**
 * Open a work order and route it to its first review gate. Used by the CEO
 * agent for executive recommendations and by any agent handing off a draft.
 */
export async function openWorkOrder(input: CreateWorkOrderInput): Promise<WorkOrder | null> {
  const wo = await createWorkOrder(input);
  if (!wo) return null;
  await emitEvent('work_order.opened', input.createdByAgent ?? CEO_AGENT, `Work order opened: ${wo.title}`, {
    work_order_id: wo.id,
    type: wo.type,
    owner: wo.ownerAgent,
  });
  await routeNextGate(wo, input.createdByAgent ?? CEO_AGENT);
  return wo;
}

/** Ask the next blocking gate's reviewer to pick the order up. */
export async function routeNextGate(wo: WorkOrder, fromAgent: string): Promise<GateKey | null> {
  const gate = nextPendingGate(wo);
  if (!gate) return null;
  const reviewer = GATE_REVIEWERS[gate];
  if (reviewer.agent) {
    await delegateTask(
      reviewer.agent,
      {
        title: `Review gate [${gate}] — ${wo.title}`,
        description: `Work order ${wo.id} needs a ${reviewer.label} review before founder approval.`,
        priority: wo.priority,
        payload: { work_order_id: wo.id, gate },
      },
      fromAgent,
    );
  } else {
    // No reviewing agent — surface it to the founder via the CEO agent.
    await sendMessage({
      fromAgent,
      toAgent: CEO_AGENT,
      type: 'alert',
      subject: `Founder review needed: [${gate}] gate on "${wo.title}"`,
      body: `Review on ${reviewer.surface}, then record the gate outcome on the work order.`,
      payload: { work_order_id: wo.id, gate, surface: reviewer.surface },
    });
  }
  return gate;
}

/**
 * Record a gate outcome, then either route the next gate or submit the order
 * for founder approval once every gate has cleared.
 */
export async function recordGateOutcome(
  wo: WorkOrder,
  gate: GateKey,
  passed: boolean,
  reviewer: string,
  note?: string,
): Promise<WorkOrder | null> {
  const updated = await setGateStatus(wo.id, gate, passed ? 'passed' : 'failed', {
    author: reviewer,
    note: note ?? (passed ? `${gate} gate passed` : `${gate} gate failed`),
  });
  if (!updated) return null;

  await emitEvent(
    passed ? 'work_order.gate.passed' : 'work_order.gate.failed',
    reviewer,
    `Gate [${gate}] ${passed ? 'passed' : 'FAILED'}: ${updated.title}`,
    { work_order_id: updated.id, gate, note: note ?? null },
  );

  if (!passed) {
    // Bounce back to the owner with the findings; the order stays open.
    if (updated.ownerAgent) {
      await sendMessage({
        fromAgent: reviewer,
        toAgent: updated.ownerAgent,
        type: 'response',
        subject: `Gate [${gate}] FAILED — ${updated.title}`,
        body: note ?? 'Review findings attached to the work order evidence.',
        payload: { work_order_id: updated.id, gate },
        requiresResponse: true,
      });
    }
    return updated;
  }

  if (gatesCleared(updated)) return submitForFounderApproval(updated, reviewer);
  await routeNextGate(updated, reviewer);
  return updated;
}

/** All gates cleared → the order enters the Founder Approval Queue. */
export async function submitForFounderApproval(wo: WorkOrder, fromAgent: string): Promise<WorkOrder | null> {
  const updated = await setFounderApproval(wo.id, 'pending', undefined);
  await emitEvent('work_order.submitted', fromAgent, `Awaiting founder approval: ${wo.title}`, {
    work_order_id: wo.id,
  });
  await sendMessage({
    fromAgent,
    toAgent: CEO_AGENT,
    type: 'alert',
    subject: `Awaiting founder approval: ${wo.title}`,
    body: 'All review gates cleared. Nothing executes until the founder approves.',
    payload: { work_order_id: wo.id },
  });
  return updated;
}

/**
 * The founder's decision (called from founder-only UI). Approval is a record —
 * execution still happens through the owning agent's own gated surface.
 */
export async function founderDecision(
  wo: WorkOrder,
  approved: boolean,
  note?: string,
): Promise<WorkOrder | null> {
  const updated = await setFounderApproval(wo.id, approved ? 'approved' : 'rejected', note);
  await emitEvent(
    approved ? 'work_order.approved' : 'work_order.rejected',
    'founder',
    `Founder ${approved ? 'APPROVED' : 'REJECTED'}: ${wo.title}`,
    { work_order_id: wo.id, note: note ?? null },
  );
  if (updated?.ownerAgent) {
    await sendMessage({
      fromAgent: CEO_AGENT,
      toAgent: updated.ownerAgent,
      type: 'response',
      subject: `Founder ${approved ? 'APPROVED' : 'REJECTED'}: ${updated.title}`,
      body: note,
      payload: { work_order_id: updated.id, approved },
    });
  }
  return updated;
}
