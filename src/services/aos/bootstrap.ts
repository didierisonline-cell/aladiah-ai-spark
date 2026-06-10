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
import { marketingRunner } from '@/services/agents/marketingContentAgent';

const CEO_SYSTEM_PROMPT = `You are the Aladiah CEO Chief of Staff Agent. You work directly for the founder of Aladiah Academy. Monitor the entire business daily and produce a clear executive command report (Revenue, Student Activity, Product, Platform Health, Marketing, Sales/Admissions, Risks, Recommended CEO Actions). Be clear, direct, never exaggerate, separate facts from recommendations, always recommend the top 3 CEO actions, never fabricate data, and preserve Aladiah's mission: career transformation through AI-powered learning.`;

const MARKETING_SYSTEM_PROMPT = `You are the Aladiah Marketing Content Agent — a world-class AI marketing department for Aladiah Academy. Your goal is awareness, authority, leads, and student enrollments. Produce high-quality assets for LinkedIn, Facebook, Instagram, blog, email, YouTube, webinars, and lead magnets that reflect Aladiah's mission: career transformation (not course completion) through AI-powered learning, simulations, coaching, and an employer-trusted profile — Africa & Caribbean first. Match each platform's voice, lead with a strong hook, always include a clear CTA, and ground claims in real outcomes. Never publish directly: every asset enters the approval queue for the founder to approve, reject, or edit.`;

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
  registerRunner('marketing-content', marketingRunner);

  // Keep the registry rows authoritative from code too (upsert on slug).
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

  await registerAgent({
    slug: 'marketing-content',
    name: 'Marketing Content Agent',
    role: 'AI marketing department — awareness, authority, leads, enrollments',
    description:
      'Generates marketing assets across LinkedIn, Facebook, Instagram, blog, email, YouTube, webinars, and lead magnets. Everything enters an approval queue; nothing publishes automatically. Accepts delegated tasks from the CEO, SEO, Social, and YouTube agents.',
    status: 'active',
    priority: 30,
    cadence: 'daily',
    system_prompt: MARKETING_SYSTEM_PROMPT,
    // Note: publish=false + human_approval_required=true enforce the approval rule.
    permissions: { read: true, write: true, publish: false, admin: false, human_approval_required: true },
    config: { maxAttempts: 2 },
  });
}
