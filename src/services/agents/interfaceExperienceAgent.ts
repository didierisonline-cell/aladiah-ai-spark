// =============================================================================
// Aladiah Interface & Experience Architect — service
// =============================================================================
// Agent #14. Owns the Founder Portal interface, student portal interface,
// dashboard UX, navigation, mobile responsiveness, accessibility, design
// polish, premium visual consistency, component hierarchy, and user-journey
// clarity. READ-ONLY: it audits the experience and reviews the UX gate on
// work orders — it never ships UI changes itself; every recommendation goes
// through the Founder Approval Queue.
// =============================================================================
import { remember } from '@/services/aos/memory';
import { reportToCeo } from '@/services/aos/communication';
import { logAction } from '@/services/aos/logs';
import { listReadyTasks, setTaskStatus } from '@/services/aos/tasks';
import { AgentRunOutput, RunContext } from '@/types/aos';
import { getUXPosture, UXPosture } from './interfaceExperience/uxPosture';

export const INTERFACE_AGENT_SLUG = 'interface-experience';

export interface UXStats {
  overall: number;
  sections: { key: string; title: string; score: number }[];
  warnings: number;
  unmeasured: number;
  pendingUxReviews: number;
}

export async function getUXStats(): Promise<UXStats> {
  const posture = getUXPosture();
  const ready = await listReadyTasks(INTERFACE_AGENT_SLUG);
  const uxReviews = ready.filter((t) => (t.payload as any)?.gate === 'ux');
  return {
    overall: posture.overall,
    sections: posture.sections.map((s) => ({ key: s.key, title: s.title, score: s.score })),
    warnings: posture.sections.reduce(
      (n, s) => n + s.checks.filter((c) => c.status !== 'pass').length,
      0,
    ),
    unmeasured: posture.unmeasured.length,
    pendingUxReviews: uxReviews.length,
  };
}

export { getUXPosture };
export type { UXPosture };

// ---------------------------------------------------------------------------
// Audit cycle — posture snapshot + acknowledge pending UX-gate review tasks.
// Gate outcomes themselves are recorded from the founder cockpit (a human or a
// future AI reviewer decides pass/fail); this runner surfaces and tracks them.
// ---------------------------------------------------------------------------
export async function runUXAudit(runId?: string | null): Promise<{ overall: number; warnings: number; pendingReviews: number }> {
  const posture = getUXPosture();
  const warnings = posture.sections.reduce(
    (n, s) => n + s.checks.filter((c) => c.status !== 'pass').length,
    0,
  );

  // Pick up delegated UX-gate reviews so they show as in progress, not stale.
  const ready = await listReadyTasks(INTERFACE_AGENT_SLUG);
  const uxReviews = ready.filter((t) => (t.payload as any)?.gate === 'ux');
  for (const t of uxReviews) await setTaskStatus(t.id, 'in_progress');

  const summary = `UX posture ${posture.overall}/100 — ${warnings} open item(s) across ${posture.sections.length} sections; ${posture.unmeasured.length} area(s) unmeasured; ${uxReviews.length} UX-gate review(s) picked up.`;

  await remember({
    agentSlug: INTERFACE_AGENT_SLUG,
    content: summary,
    summary: `ux:${posture.overall}`,
    type: 'short_term',
    tags: ['ux', 'design', posture.overall >= 80 ? 'healthy' : 'attention'],
    source: runId ?? undefined,
  });
  await reportToCeo(INTERFACE_AGENT_SLUG, {
    subject: `Interface & Experience: posture ${posture.overall}/100, ${warnings} open item(s)`,
    body: summary,
    payload: { overall: posture.overall, warnings, pendingReviews: uxReviews.length },
  });
  await logAction(INTERFACE_AGENT_SLUG, 'run_ux_audit', {
    runId,
    result: 'success',
    message: summary,
  });

  return { overall: posture.overall, warnings, pendingReviews: uxReviews.length };
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------
export const interfaceExperienceRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const result = await runUXAudit(ctx.runId);
  return { ok: true, output: result };
};
