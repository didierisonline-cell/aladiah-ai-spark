// =============================================================================
// Aladiah Marketing Content Agent — service
// =============================================================================
// A first-class AOS citizen. It:
//  - is registered in the Agent Registry (see services/aos/bootstrap.ts)
//  - logs every action to Execution Logs
//  - stores themes / best-performing content in Agent Memory
//  - runs through the Orchestrator (the runner below processes its tasks)
//  - accepts delegated tasks via the Task Manager + Communication Layer
//  - respects the Permissions Framework (publish is gated; human approval required)
//
// APPROVAL RULE: every generated asset lands at status 'pending_approval'.
// Nothing publishes automatically.
//
// Generation is deterministic v1 (see ./marketing/generators). Phase 2 swaps in
// Claude (server-side edge function) behind the same DraftAsset contract.
// =============================================================================
import { db, nowISO } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { createTask } from '@/services/aos/tasks';
import { reportToCeo } from '@/services/aos/communication';
import { guard, ApprovalRequiredError } from '@/services/aos/permissions';
import {
  AgentRunOutput,
  RunContext,
} from '@/types/aos';
import {
  ContentCalendar,
  DraftAsset,
  GenerateCampaignInput,
  GenerateContentInput,
  GenerateLeadMagnetInput,
  GenerateWebinarInput,
  MARKETING_AGENT_SLUG,
  MarketingCampaign,
  MarketingContent,
  MarketingStats,
  Platform,
  CalendarScope,
  ContentStatus,
} from '@/types/marketing';
import {
  buildAsset,
  buildCalendarPlan,
  campaignAssets,
  leadMagnetAsset,
  repurpose,
  webinarAssets,
} from './marketing/generators';

const SLUG = MARKETING_AGENT_SLUG;
const CONTENT = 'marketing_content';
const CAMPAIGNS = 'marketing_campaigns';
const CALENDAR = 'marketing_content_calendar';
const APPROVALS = 'marketing_approvals';

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

interface PersistOpts {
  status?: ContentStatus;
  campaignId?: string;
  calendarId?: string;
  sourceIdea?: string;
  repurposedFrom?: string;
  runId?: string | null;
}

async function persistAsset(draft: DraftAsset, opts: PersistOpts = {}): Promise<MarketingContent | null> {
  const row = {
    agent_slug: SLUG,
    platform: draft.platform,
    content_type: draft.content_type,
    title: draft.title,
    hook: draft.hook,
    body: draft.body,
    cta: draft.cta,
    hashtags: draft.hashtags ?? [],
    theme: draft.theme ?? null,
    audience: draft.audience ?? null,
    status: opts.status ?? 'pending_approval', // approval queue by default
    campaign_id: opts.campaignId ?? null,
    calendar_id: opts.calendarId ?? null,
    source_idea: opts.sourceIdea ?? null,
    repurposed_from: opts.repurposedFrom ?? null,
    created_by_agent: SLUG,
  };
  const { data, error } = await db.from(CONTENT).insert(row).select('*').single();
  if (error) {
    await logAction(SLUG, 'persist_content', {
      runId: opts.runId,
      level: 'error',
      result: 'error',
      error: error.message,
    });
    return null;
  }
  await logAction(SLUG, 'persist_content', {
    runId: opts.runId,
    result: 'success',
    message: `${draft.platform}/${draft.content_type}: ${draft.title}`,
    detail: { id: data.id, platform: draft.platform },
  });
  return data as MarketingContent;
}

async function rememberTheme(theme: string | undefined, idea: string, runId?: string | null) {
  if (!theme) return;
  await remember({
    agentSlug: SLUG,
    content: `Content theme "${theme}" used for idea: ${idea}`,
    summary: `theme:${theme}`,
    type: 'short_term',
    tags: ['content_theme', theme.replace(/\s+/g, '-').toLowerCase()],
    source: runId ?? undefined,
  });
}

// ---------------------------------------------------------------------------
// Generation workflows (public API used by the dashboard + the runner)
// ---------------------------------------------------------------------------

export async function generateContent(
  input: GenerateContentInput,
  runId?: string | null,
): Promise<MarketingContent | null> {
  const contentType = input.contentType ?? defaultTypeFor(input.platform);
  const draft = buildAsset(input.platform, contentType, input.idea, input.theme, input.audience);
  const content = await persistAsset(draft, {
    status: input.status,
    campaignId: input.campaignId,
    sourceIdea: input.sourceIdea ?? input.idea,
    repurposedFrom: input.repurposedFrom,
    runId,
  });
  await rememberTheme(input.theme, input.idea, runId);
  return content;
}

/** Repurposing engine: 1 idea -> blog + 3 LinkedIn + 2 FB + 1 email + 2 IG + 1 YT + 3 shorts. */
export async function repurposeIdea(
  idea: string,
  theme?: string,
  audience?: string,
  runId?: string | null,
): Promise<MarketingContent[]> {
  const drafts = repurpose(idea, theme, audience);
  const out: MarketingContent[] = [];
  for (const d of drafts) {
    const c = await persistAsset(d, { sourceIdea: idea, runId });
    if (c) out.push(c);
  }
  await rememberTheme(theme, idea, runId);
  await logAction(SLUG, 'repurpose_idea', {
    runId,
    result: 'success',
    message: `Repurposed "${idea}" into ${out.length} assets`,
    detail: { count: out.length },
  });
  return out;
}

export async function generateCampaign(
  input: GenerateCampaignInput,
  runId?: string | null,
): Promise<{ campaign: MarketingCampaign | null; content: MarketingContent[] }> {
  const channels = input.channels?.length ? input.channels : (['linkedin', 'facebook', 'email', 'blog'] as Platform[]);
  const { data: campaign, error } = await db
    .from(CAMPAIGNS)
    .insert({
      name: input.name,
      objective: input.objective,
      theme: input.theme ?? null,
      status: 'active',
      channels,
      created_by_agent: SLUG,
    })
    .select('*')
    .single();
  if (error) {
    await logAction(SLUG, 'create_campaign', { runId, level: 'error', result: 'error', error: error.message });
    return { campaign: null, content: [] };
  }
  const drafts = campaignAssets({ ...input, channels });
  const content: MarketingContent[] = [];
  for (const d of drafts) {
    const c = await persistAsset(d, { campaignId: campaign.id, sourceIdea: input.objective, runId });
    if (c) content.push(c);
  }
  await rememberTheme(input.theme, input.name, runId);
  await logAction(SLUG, 'create_campaign', {
    runId,
    result: 'success',
    message: `Campaign "${input.name}" with ${content.length} assets`,
    detail: { campaignId: campaign.id },
  });
  return { campaign: campaign as MarketingCampaign, content };
}

export async function generateWebinar(
  input: GenerateWebinarInput,
  runId?: string | null,
): Promise<MarketingContent[]> {
  const drafts = webinarAssets(input);
  const out: MarketingContent[] = [];
  for (const d of drafts) {
    const c = await persistAsset(d, { sourceIdea: input.topic, runId });
    if (c) out.push(c);
  }
  await logAction(SLUG, 'generate_webinar', { runId, result: 'success', message: `Webinar pack for "${input.topic}"` });
  return out;
}

export async function generateLeadMagnet(
  input: GenerateLeadMagnetInput,
  runId?: string | null,
): Promise<MarketingContent | null> {
  const draft = leadMagnetAsset(input);
  const c = await persistAsset(draft, { sourceIdea: input.topic, runId });
  await logAction(SLUG, 'generate_lead_magnet', {
    runId,
    result: c ? 'success' : 'error',
    message: `${input.kind}: ${input.topic}`,
  });
  return c;
}

export async function generateContentCalendar(
  scope: CalendarScope,
  theme?: string,
  startDate?: string,
  runId?: string | null,
): Promise<ContentCalendar | null> {
  const start = startDate ?? new Date().toISOString().slice(0, 10);
  const { slots, periodEnd } = buildCalendarPlan(scope, theme, start);
  const { data, error } = await db
    .from(CALENDAR)
    .insert({
      scope,
      period_start: start,
      period_end: periodEnd,
      theme: theme ?? 'career transformation',
      status: 'active',
      plan: slots,
      created_by_agent: SLUG,
    })
    .select('*')
    .single();
  if (error) {
    await logAction(SLUG, 'generate_calendar', { runId, level: 'error', result: 'error', error: error.message });
    return null;
  }
  await logAction(SLUG, 'generate_calendar', {
    runId,
    result: 'success',
    message: `${scope} calendar with ${slots.length} slots`,
    detail: { calendarId: data.id },
  });
  return data as ContentCalendar;
}

function defaultTypeFor(platform: Platform): string {
  const map: Record<Platform, string> = {
    linkedin: 'thought_leadership',
    facebook: 'community',
    instagram: 'caption',
    blog: 'seo_article',
    email: 'newsletter',
    youtube: 'long_form_script',
    webinar: 'topic',
    lead_magnet: 'lead_magnet_checklist',
  };
  return map[platform];
}

// ---------------------------------------------------------------------------
// Approval queue (approve / reject / edit) — the only path content advances on
// ---------------------------------------------------------------------------

export async function listPendingApproval(): Promise<MarketingContent[]> {
  const { data, error } = await db
    .from(CONTENT)
    .select('*')
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return data as MarketingContent[];
}

async function recordDecision(contentId: string, decision: 'approved' | 'rejected' | 'edited', notes?: string) {
  await db.from(APPROVALS).insert({ content_id: contentId, decision, notes: notes ?? null });
  await logAction(SLUG, `content_${decision}`, { result: 'success', message: contentId, detail: { notes } });
}

export async function approveContent(contentId: string, notes?: string): Promise<boolean> {
  // Human approval satisfies the permission gate for moving content forward.
  try {
    await guard(SLUG, 'write', { action: 'approve_content', approved: true });
  } catch (e) {
    if (!(e instanceof ApprovalRequiredError)) {
      console.error('[marketing] approve permission error:', e);
      return false;
    }
  }
  const { error } = await db
    .from(CONTENT)
    .update({ status: 'approved', approved_at: nowISO(), updated_at: nowISO() })
    .eq('id', contentId);
  if (error) return false;
  await recordDecision(contentId, 'approved', notes);
  return true;
}

export async function rejectContent(contentId: string, notes?: string): Promise<boolean> {
  const { error } = await db
    .from(CONTENT)
    .update({ status: 'rejected', updated_at: nowISO() })
    .eq('id', contentId);
  if (error) return false;
  await recordDecision(contentId, 'rejected', notes);
  return true;
}

/** Edit a draft (founder edit before approval). Optionally approve in the same step. */
export async function editContent(
  contentId: string,
  patch: Partial<Pick<MarketingContent, 'title' | 'hook' | 'body' | 'cta' | 'hashtags' | 'theme'>>,
  alsoApprove = false,
): Promise<boolean> {
  const { error } = await db
    .from(CONTENT)
    .update({ ...patch, updated_at: nowISO() })
    .eq('id', contentId);
  if (error) return false;
  await recordDecision(contentId, 'edited');
  if (alsoApprove) return approveContent(contentId, 'Edited then approved');
  return true;
}

// ---------------------------------------------------------------------------
// Performance + memory of best content
// ---------------------------------------------------------------------------

export async function recordPerformance(
  contentId: string,
  metrics: Record<string, number>,
): Promise<boolean> {
  const { data, error } = await db
    .from(CONTENT)
    .update({ performance: metrics, updated_at: nowISO() })
    .eq('id', contentId)
    .select('*')
    .single();
  if (error) return false;
  const engagement = (metrics.likes ?? 0) + (metrics.comments ?? 0) + (metrics.shares ?? 0) + (metrics.leads ?? 0) * 5;
  if (engagement >= 50 && data) {
    const c = data as MarketingContent;
    await remember({
      agentSlug: SLUG,
      content: `High-performing ${c.platform}/${c.content_type}: "${c.title}" (engagement ${engagement}). Theme: ${c.theme}.`,
      summary: `best:${c.platform}:${c.theme}`,
      type: 'long_term',
      importance: 0.85,
      tags: ['best_performing', c.platform, ...(c.theme ? [c.theme.replace(/\s+/g, '-').toLowerCase()] : [])],
      source: contentId,
    });
  }
  return true;
}

// ---------------------------------------------------------------------------
// Reads for the dashboard
// ---------------------------------------------------------------------------

export async function listContent(
  filter: { status?: ContentStatus; platform?: Platform; limit?: number } = {},
): Promise<MarketingContent[]> {
  let q = db.from(CONTENT).select('*');
  if (filter.status) q = q.eq('status', filter.status);
  if (filter.platform) q = q.eq('platform', filter.platform);
  const { data, error } = await q.order('created_at', { ascending: false }).limit(filter.limit ?? 100);
  if (error || !data) return [];
  return data as MarketingContent[];
}

export async function listCampaigns(): Promise<MarketingCampaign[]> {
  const { data, error } = await db.from(CAMPAIGNS).select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data as MarketingCampaign[];
}

export async function listCalendars(): Promise<ContentCalendar[]> {
  const { data, error } = await db.from(CALENDAR).select('*').order('period_start', { ascending: false }).limit(20);
  if (error || !data) return [];
  return data as ContentCalendar[];
}

export async function getStats(): Promise<MarketingStats> {
  const [content, campaigns] = await Promise.all([listContent({ limit: 1000 }), listCampaigns()]);
  const by = (s: ContentStatus) => content.filter((c) => c.status === s).length;

  const themeCounts = new Map<string, number>();
  const platformCounts = new Map<Platform, number>();
  for (const c of content) {
    if (c.theme) themeCounts.set(c.theme, (themeCounts.get(c.theme) ?? 0) + 1);
    platformCounts.set(c.platform, (platformCounts.get(c.platform) ?? 0) + 1);
  }
  const topThemes = [...themeCounts.entries()]
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const byPlatform = [...platformCounts.entries()]
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalGenerated: content.length,
    queued: by('queued'),
    pendingApproval: by('pending_approval'),
    approved: by('approved'),
    published: by('published'),
    campaigns: campaigns.length,
    topThemes,
    byPlatform,
  };
}

// ---------------------------------------------------------------------------
// Task delegation entry points (CEO / SEO / Social / YouTube agents -> here)
// ---------------------------------------------------------------------------

export type MarketingTaskKind =
  | 'create_content'
  | 'repurpose'
  | 'campaign'
  | 'webinar'
  | 'lead_magnet'
  | 'content_calendar';

/** Enqueue a marketing task (used by other agents to delegate work here). */
export async function enqueueMarketingTask(
  kind: MarketingTaskKind,
  payload: Record<string, unknown>,
  opts: { fromAgent?: string; title?: string; priority?: 'low' | 'medium' | 'high' | 'critical' } = {},
) {
  return createTask({
    title: opts.title ?? `Marketing: ${kind.replace(/_/g, ' ')}`,
    createdByAgent: opts.fromAgent ?? 'human',
    assignedAgent: SLUG,
    priority: opts.priority ?? 'medium',
    payload: { kind, ...payload },
  });
}

/** Execute a single marketing task by its kind/payload. */
async function executeTask(kind: MarketingTaskKind, payload: any, runId: string | null): Promise<Record<string, unknown>> {
  switch (kind) {
    case 'create_content': {
      const c = await generateContent(payload as GenerateContentInput, runId);
      return { created: c ? 1 : 0, ids: c ? [c.id] : [] };
    }
    case 'repurpose': {
      const list = await repurposeIdea(payload.idea, payload.theme, payload.audience, runId);
      return { created: list.length, ids: list.map((x) => x.id) };
    }
    case 'campaign': {
      const { campaign, content } = await generateCampaign(payload as GenerateCampaignInput, runId);
      return { campaignId: campaign?.id, created: content.length };
    }
    case 'webinar': {
      const list = await generateWebinar(payload as GenerateWebinarInput, runId);
      return { created: list.length };
    }
    case 'lead_magnet': {
      const c = await generateLeadMagnet(payload as GenerateLeadMagnetInput, runId);
      return { created: c ? 1 : 0 };
    }
    case 'content_calendar': {
      const cal = await generateContentCalendar(payload.scope, payload.theme, payload.startDate, runId);
      return { calendarId: cal?.id, slots: cal?.plan.length ?? 0 };
    }
    default:
      return { error: `Unknown task kind: ${kind}` };
  }
}

// ---------------------------------------------------------------------------
// Orchestrator runner — processes ready marketing tasks
// ---------------------------------------------------------------------------

export const marketingRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  // Import lazily to avoid a static cycle with the AOS facade/bootstrap.
  const { listReadyTasks, setTaskStatus } = await import('@/services/aos/tasks');
  const ready = await listReadyTasks(SLUG);
  await ctx.log('scan_tasks', { message: `${ready.length} ready task(s)` });

  if (ready.length === 0) {
    return { ok: true, output: { processed: 0, note: 'No ready tasks' } };
  }

  let processed = 0;
  let assets = 0;
  for (const task of ready) {
    const kind = (task.payload as any)?.kind as MarketingTaskKind | undefined;
    if (!kind) {
      await setTaskStatus(task.id, 'failed', { error: 'Task missing payload.kind' });
      continue;
    }
    await setTaskStatus(task.id, 'in_progress');
    try {
      const result = await executeTask(kind, task.payload, ctx.runId);
      await setTaskStatus(task.id, 'completed', result);
      await ctx.log('task_completed', { result: 'success', message: `${kind} (task ${task.id})`, detail: result });
      processed += 1;
      assets += Number((result as any).created ?? 0);
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      await setTaskStatus(task.id, 'failed', { error });
      await ctx.log('task_failed', { level: 'error', result: 'error', error });
    }
  }

  // Report back to the CEO agent (communication layer).
  await reportToCeo(SLUG, {
    subject: `Marketing run: ${processed} task(s), ${assets} asset(s) queued for approval`,
    body: 'All generated content is in the approval queue (nothing auto-published).',
    payload: { processed, assets },
  });

  return { ok: true, output: { processed, assets } };
};
