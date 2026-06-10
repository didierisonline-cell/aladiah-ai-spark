// =============================================================================
// AOS Bootstrap — wire existing agents into the operating system.
// Registers each agent's runner with the orchestrator and ensures its registry
// row exists. Future agents add ONE block here; they do not build their own
// scheduling / logging / health plumbing.
// =============================================================================
import { registerRunner } from './orchestrator';
import { registerAgent } from './registry';
import { remember } from './memory';
import { AgentRunOutput, RunContext } from '@/types/aos';
import { runCeoChiefOfStaffAgent } from '@/services/agents/ceoChiefOfStaffAgent';

const CEO_SYSTEM_PROMPT = `You are the Aladiah CEO Chief of Staff Agent. You work directly for the founder of Aladiah Academy. Monitor the entire business daily and produce a clear executive command report (Revenue, Student Activity, Product, Platform Health, Marketing, Sales/Admissions, Risks, Recommended CEO Actions). Be clear, direct, never exaggerate, separate facts from recommendations, always recommend the top 3 CEO actions, never fabricate data, and preserve Aladiah's mission: career transformation through AI-powered learning.`;

// ---- CEO Chief of Staff runner --------------------------------------------
const ceoRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  await ctx.log('gather_and_build', { message: 'Generating daily command report' });
  const { report, reportId } = await runCeoChiefOfStaffAgent();
  await ctx.log('save_report', {
    result: reportId ? 'success' : 'error',
    message: reportId ? `Saved report ${reportId}` : 'Report built but not persisted',
    detail: { reportId, urgency: report.urgency_level },
  });

  // Write a durable memory of today's headline so the agent reasons over deltas.
  await remember({
    agentSlug: ctx.agentSlug,
    content: report.executive_summary,
    summary: `Daily report ${report.report_date} — urgency ${report.urgency_level}`,
    type: 'long_term',
    tags: ['daily_report', report.urgency_level],
    source: reportId ?? ctx.runId ?? undefined,
  });

  if (!reportId) return { ok: false, error: 'Report could not be saved (check admin RLS).' };
  return { ok: true, output: { reportId, urgency: report.urgency_level } };
};

let booted = false;

/** Idempotently register all known agents + runners. Call before using the AOS. */
export async function ensureAOS(): Promise<void> {
  if (booted) return;
  booted = true;

  registerRunner('ceo-chief-of-staff', ceoRunner);

  // Keep the registry row authoritative from code too (upsert on slug).
  await registerAgent({
    slug: 'ceo-chief-of-staff',
    name: 'CEO Chief of Staff Agent',
    role: 'Executive operating assistant for the founder',
    description:
      'Monitors Aladiah daily, summarizes performance, surfaces risks, and recommends CEO actions. Agent #1 of the AI Workforce.',
    status: 'active',
    priority: 10,
    cadence: 'daily',
    system_prompt: CEO_SYSTEM_PROMPT,
    permissions: { read: true, write: true, publish: false, admin: false, human_approval_required: true },
    config: { maxAttempts: 2 },
  });
}
