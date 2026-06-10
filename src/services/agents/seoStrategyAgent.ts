// =============================================================================
// Aladiah SEO Strategy Agent — service
// =============================================================================
// Agent #3, a first-class AOS citizen. It owns organic discovery: keyword
// research, topic clusters, competitor tracking, on-page audits, and prioritized
// recommendations. It does NOT create marketing content — it delegates content
// requests to the Marketing Content Agent through the AOS Task Manager.
//
// AOS integration: Registry (bootstrap), Orchestrator (seoRunner), Execution
// Logs (logAction/ctx.log), Memory (keywords/competitors/opportunities),
// Tasks + Communication (delegation to marketing + report to CEO), Health
// (registry rollups), Permissions (publish=false, human approval required).
// =============================================================================
import { db, nowISO } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { createTask } from '@/services/aos/tasks';
import { reportToCeo, sendMessage } from '@/services/aos/communication';
import { AgentRunOutput, RunContext } from '@/types/aos';
import {
  SEO_AGENT_SLUG,
  SearchIntent,
  SeoAudit,
  SeoCluster,
  SeoCompetitor,
  SeoKeyword,
  SeoPriority,
  SeoRecommendation,
  SeoStats,
  SeoTaskKind,
} from '@/types/seo';
import { MARKETING_AGENT_SLUG } from '@/types/marketing';
import { enqueueMarketingTask } from './marketingContentAgent';

const SLUG = SEO_AGENT_SLUG;

// ---------------------------------------------------------------------------
// Curated knowledge (deterministic v1; Phase 2 swaps for live SEO data + Claude)
// ---------------------------------------------------------------------------

const KEYWORD_CATALOG: Record<string, { keyword: string; intent: SearchIntent }[]> = {
  scrum: [
    { keyword: 'scrum master certification', intent: 'commercial' },
    { keyword: 'how to become a scrum master', intent: 'informational' },
    { keyword: 'ai scrum master certification', intent: 'commercial' },
    { keyword: 'scrum master interview questions', intent: 'informational' },
    { keyword: 'agile scrum master training', intent: 'transactional' },
  ],
  'project-management': [
    { keyword: 'project management certification', intent: 'commercial' },
    { keyword: 'how to become a project manager', intent: 'informational' },
    { keyword: 'agile project management course', intent: 'transactional' },
    { keyword: 'project manager career path', intent: 'informational' },
  ],
  'ai-careers': [
    { keyword: 'ai career path', intent: 'informational' },
    { keyword: 'how to get a job in ai', intent: 'informational' },
    { keyword: 'ai product manager certification', intent: 'commercial' },
    { keyword: 'ai workforce skills', intent: 'informational' },
  ],
  cybersecurity: [
    { keyword: 'cybersecurity certification', intent: 'commercial' },
    { keyword: 'how to become a cybersecurity analyst', intent: 'informational' },
    { keyword: 'entry level cybersecurity jobs', intent: 'informational' },
  ],
  cloud: [
    { keyword: 'cloud computing certification', intent: 'commercial' },
    { keyword: 'cloud engineer career path', intent: 'informational' },
    { keyword: 'aws certification training', intent: 'transactional' },
  ],
  'data-analytics': [
    { keyword: 'data analytics certification', intent: 'commercial' },
    { keyword: 'how to become a data analyst', intent: 'informational' },
    { keyword: 'sql for data analytics course', intent: 'transactional' },
  ],
  'business-analysis': [
    { keyword: 'business analyst certification', intent: 'commercial' },
    { keyword: 'how to become a business analyst', intent: 'informational' },
  ],
  'agile-coaching': [
    { keyword: 'agile coach certification', intent: 'commercial' },
    { keyword: 'agile coaching skills', intent: 'informational' },
  ],
  'ai-workforce': [
    { keyword: 'ai workforce development', intent: 'informational' },
    { keyword: 'reskilling for the ai economy', intent: 'informational' },
    { keyword: 'future of work and ai', intent: 'informational' },
  ],
};

const COMPETITORS: { name: string; domain: string; focus: string[]; strengths: string[] }[] = [
  { name: 'Coursera', domain: 'coursera.org', focus: ['certifications', 'university partners'], strengths: ['domain authority', 'brand'] },
  { name: 'Udemy', domain: 'udemy.com', focus: ['affordable courses', 'long tail'], strengths: ['breadth', 'reviews'] },
  { name: 'Simplilearn', domain: 'simplilearn.com', focus: ['bootcamps', 'certifications'], strengths: ['SEO content', 'paid + organic'] },
  { name: 'Scrum.org', domain: 'scrum.org', focus: ['scrum certifications'], strengths: ['authority on scrum', 'assessments'] },
  { name: 'PMI', domain: 'pmi.org', focus: ['project management', 'PMP'], strengths: ['standards body', 'trust'] },
  { name: 'Google Career Certificates', domain: 'grow.google', focus: ['entry-level tech', 'job guarantee narrative'], strengths: ['brand', 'employer network'] },
];

const AUDIT_PAGES = ['/', '/pricing', '/courses', '/enroll', '/certifications', '/employers', '/schools'];

// Stable pseudo-metrics so the same keyword always scores the same.
function hashNum(s: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return min + (h % (max - min + 1));
}
function priorityFor(volume: number, difficulty: number): SeoPriority {
  const score = volume / Math.max(difficulty, 1);
  if (score > 60) return 'high';
  if (score > 25) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// 1. Keyword research
// ---------------------------------------------------------------------------

export async function runKeywordResearch(category?: string, runId?: string | null): Promise<number> {
  const categories = category ? [category] : Object.keys(KEYWORD_CATALOG);
  const rows = categories.flatMap((cat) =>
    (KEYWORD_CATALOG[cat] ?? []).map(({ keyword, intent }) => {
      const search_volume = hashNum(keyword, 200, 12000);
      const difficulty = hashNum(keyword + 'd', 15, 80);
      return {
        keyword,
        category: cat,
        intent,
        search_volume,
        difficulty,
        priority: priorityFor(search_volume, difficulty),
        target_rank: 3,
        status: 'opportunity',
        updated_at: nowISO(),
      };
    }),
  );
  if (rows.length === 0) return 0;
  const { error } = await db.from('seo_keywords').upsert(rows, { onConflict: 'keyword' });
  if (error) {
    await logAction(SLUG, 'keyword_research', { runId, level: 'error', result: 'error', error: error.message });
    return 0;
  }
  await remember({
    agentSlug: SLUG,
    content: `Keyword research refreshed: ${rows.length} keywords across ${categories.length} categories.`,
    summary: 'keyword_research',
    type: 'short_term',
    tags: ['keywords', ...categories],
    source: runId ?? undefined,
  });
  await logAction(SLUG, 'keyword_research', {
    runId,
    result: 'success',
    message: `${rows.length} keywords (${categories.join(', ')})`,
  });
  return rows.length;
}

// ---------------------------------------------------------------------------
// 2. Topic clusters
// ---------------------------------------------------------------------------

export async function buildCluster(
  pillarKeyword: string,
  category = 'general',
  runId?: string | null,
): Promise<SeoCluster | null> {
  const name = `${pillarKeyword} cluster`;
  const supporting = [
    { topic: `What is ${pillarKeyword}?`, keyword: `what is ${pillarKeyword}`, status: 'planned' as const },
    { topic: `How to get started with ${pillarKeyword}`, keyword: `${pillarKeyword} for beginners`, status: 'planned' as const },
    { topic: `${pillarKeyword} salary and career outlook`, keyword: `${pillarKeyword} salary`, status: 'planned' as const },
    { topic: `${pillarKeyword} interview questions`, keyword: `${pillarKeyword} interview questions`, status: 'planned' as const },
    { topic: `Best ${pillarKeyword} certification path`, keyword: `best ${pillarKeyword} certification`, status: 'planned' as const },
  ];
  const internal_links = supporting.map((s) => ({
    from: s.topic,
    to: `Pillar: ${pillarKeyword}`,
    anchor: pillarKeyword,
  }));

  const { data, error } = await db
    .from('seo_clusters')
    .upsert(
      {
        name,
        pillar_keyword: pillarKeyword,
        category,
        description: `Topic cluster targeting "${pillarKeyword}" with ${supporting.length} supporting articles and internal links back to the pillar.`,
        pillar_status: 'planned',
        supporting_topics: supporting,
        internal_links,
        status: 'active',
        created_by_agent: SLUG,
        updated_at: nowISO(),
      },
      { onConflict: 'name' },
    )
    .select('*')
    .single();
  if (error) {
    await logAction(SLUG, 'build_cluster', { runId, level: 'error', result: 'error', error: error.message });
    return null;
  }

  // Seed the cluster's keywords as opportunities too.
  const kwRows = [{ keyword: pillarKeyword, intent: 'commercial' as SearchIntent }, ...supporting.map((s) => ({ keyword: s.keyword, intent: 'informational' as SearchIntent }))].map(
    ({ keyword, intent }) => {
      const search_volume = hashNum(keyword, 100, 9000);
      const difficulty = hashNum(keyword + 'd', 10, 75);
      return {
        keyword,
        category,
        cluster: name,
        intent,
        search_volume,
        difficulty,
        priority: priorityFor(search_volume, difficulty),
        status: 'opportunity',
        updated_at: nowISO(),
      };
    },
  );
  await db.from('seo_keywords').upsert(kwRows, { onConflict: 'keyword' });

  await remember({
    agentSlug: SLUG,
    content: `Built topic cluster "${name}" (pillar + ${supporting.length} supporting topics).`,
    summary: `cluster:${pillarKeyword}`,
    type: 'long_term',
    importance: 0.7,
    tags: ['cluster', category],
    source: runId ?? undefined,
  });
  await logAction(SLUG, 'build_cluster', { runId, result: 'success', message: name });
  return data as SeoCluster;
}

// ---------------------------------------------------------------------------
// 3. Competitor analysis
// ---------------------------------------------------------------------------

export async function trackCompetitors(runId?: string | null): Promise<number> {
  const rows = COMPETITORS.map((c) => ({
    name: c.name,
    domain: c.domain,
    focus_areas: c.focus,
    strengths: c.strengths,
    tracked_keywords: [],
    notes: `Tracked competitor in the career-transformation / certification space.`,
    last_reviewed: nowISO(),
    updated_at: nowISO(),
  }));
  const { error } = await db.from('seo_competitors').upsert(rows, { onConflict: 'name' });
  if (error) {
    await logAction(SLUG, 'competitor_analysis', { runId, level: 'error', result: 'error', error: error.message });
    return 0;
  }
  await remember({
    agentSlug: SLUG,
    content: `Competitor set reviewed: ${rows.map((r) => r.name).join(', ')}.`,
    summary: 'competitors',
    type: 'short_term',
    tags: ['competitors'],
    source: runId ?? undefined,
  });
  await logAction(SLUG, 'competitor_analysis', { runId, result: 'success', message: `${rows.length} competitors` });
  return rows.length;
}

// ---------------------------------------------------------------------------
// 4. On-page SEO audits
// ---------------------------------------------------------------------------

export async function runSiteAudit(runId?: string | null): Promise<number> {
  const { data: existing } = await db.from('seo_audits').select('id, page_path');
  const existingPaths = new Set((existing ?? []).map((r: any) => r.page_path));
  let created = 0;

  for (const path of AUDIT_PAGES) {
    const issues = [
      { type: 'metadata', severity: 'medium' as const, detail: 'Verify unique title tag and meta description with a target keyword.' },
      { type: 'schema', severity: 'medium' as const, detail: 'Add structured data (Organization / Course / FAQ schema where relevant).' },
      { type: 'internal_links', severity: 'low' as const, detail: 'Add internal links to relevant pillar/cluster pages.' },
      { type: 'content_depth', severity: path === '/' ? 'low' : ('medium' as const), detail: 'Ensure content answers search intent with sufficient depth.' },
    ];
    const score = 100 - issues.reduce((s, i) => s + (i.severity === 'high' ? 20 : i.severity === 'medium' ? 10 : 5), 0);
    const payload = {
      page_path: path,
      title: `Audit: ${path}`,
      score,
      issues,
      recommendations: 'Fix metadata + schema first (highest leverage), then internal linking and content depth.',
      status: 'open',
      created_by_agent: SLUG,
      updated_at: nowISO(),
    };
    if (existingPaths.has(path)) {
      await db.from('seo_audits').update(payload).eq('page_path', path);
    } else {
      const { error } = await db.from('seo_audits').insert(payload);
      if (!error) created += 1;
    }
  }
  await logAction(SLUG, 'site_audit', { runId, result: 'success', message: `Audited ${AUDIT_PAGES.length} pages` });
  return created;
}

// ---------------------------------------------------------------------------
// 5. Recommendations
// ---------------------------------------------------------------------------

export async function generateRecommendations(runId?: string | null): Promise<number> {
  const { data: existingPending } = await db
    .from('seo_recommendations')
    .select('title')
    .eq('status', 'pending');
  const existingTitles = new Set((existingPending ?? []).map((r: any) => r.title));

  // High-priority opportunity keywords -> content requests.
  const { data: kws } = await db
    .from('seo_keywords')
    .select('*')
    .eq('status', 'opportunity')
    .eq('priority', 'high')
    .limit(10);

  const recs = (kws ?? []).map((k: SeoKeyword) => ({
    title: `Create content for "${k.keyword}"`,
    rec_type: 'content_request',
    priority: 'high',
    rationale: `High-opportunity keyword (vol ${k.search_volume}, difficulty ${k.difficulty}, ${k.intent}). Delegate a content package to the Marketing Agent.`,
    target_keyword: k.keyword,
    cluster: k.cluster,
    status: 'pending',
    created_by_agent: SLUG,
    updated_at: nowISO(),
  }));

  const toInsert = recs.filter((r) => !existingTitles.has(r.title));
  if (toInsert.length === 0) {
    await logAction(SLUG, 'generate_recommendations', { runId, result: 'skipped', message: 'No new recommendations' });
    return 0;
  }
  const { error } = await db.from('seo_recommendations').insert(toInsert);
  if (error) {
    await logAction(SLUG, 'generate_recommendations', { runId, level: 'error', result: 'error', error: error.message });
    return 0;
  }
  await logAction(SLUG, 'generate_recommendations', { runId, result: 'success', message: `${toInsert.length} new recommendations` });
  return toInsert.length;
}

// ---------------------------------------------------------------------------
// 6. Delegation to the Marketing Content Agent (via the AOS Task Manager)
// ---------------------------------------------------------------------------

/**
 * Turn a keyword into a content package and delegate it to the Marketing Agent.
 * Example: "AI Scrum Master Certification" -> pillar article + LinkedIn series +
 * YouTube script + lead magnet. Each is an aos_task assigned to marketing-content.
 */
export async function requestContentForKeyword(
  keyword: string,
  opts: { priority?: 'low' | 'medium' | 'high' | 'critical'; recId?: string; runId?: string | null } = {},
): Promise<{ taskIds: string[] }> {
  const priority = opts.priority ?? 'high';
  const reqs: { kind: 'create_content' | 'lead_magnet'; payload: Record<string, unknown>; title: string }[] = [
    { kind: 'create_content', payload: { idea: keyword, platform: 'blog', contentType: 'pillar', theme: keyword }, title: `Pillar article: ${keyword}` },
    { kind: 'create_content', payload: { idea: keyword, platform: 'linkedin', contentType: 'thought_leadership', theme: keyword }, title: `LinkedIn series: ${keyword}` },
    { kind: 'create_content', payload: { idea: keyword, platform: 'youtube', contentType: 'long_form_script', theme: keyword }, title: `YouTube script: ${keyword}` },
    { kind: 'lead_magnet', payload: { kind: 'checklist', topic: keyword }, title: `Lead magnet: ${keyword}` },
  ];

  const taskIds: string[] = [];
  for (const r of reqs) {
    const task = await enqueueMarketingTask(r.kind, r.payload, { fromAgent: SLUG, title: r.title, priority });
    if (task) taskIds.push(task.id);
  }

  // Notify the marketing agent (communication layer) and the founder via CEO.
  await sendMessage({
    fromAgent: SLUG,
    toAgent: MARKETING_AGENT_SLUG,
    type: 'task_request',
    subject: `SEO content request: ${keyword}`,
    body: `Please produce a content package for "${keyword}" (pillar, LinkedIn series, YouTube script, lead magnet). ${taskIds.length} tasks queued.`,
    payload: { keyword, taskIds },
    requiresResponse: true,
  });

  // Record / update the recommendation as delegated.
  if (opts.recId) {
    await db
      .from('seo_recommendations')
      .update({
        status: 'delegated',
        delegated_task_id: taskIds[0] ?? null,
        metadata: { task_ids: taskIds, delegated_at: nowISO() },
        updated_at: nowISO(),
      })
      .eq('id', opts.recId);
  } else {
    await db.from('seo_recommendations').insert({
      title: `Delegated content for "${keyword}"`,
      rec_type: 'content_request',
      priority: 'high',
      rationale: 'SEO-driven content package delegated to the Marketing Agent.',
      target_keyword: keyword,
      status: 'delegated',
      delegated_task_id: taskIds[0] ?? null,
      created_by_agent: SLUG,
      metadata: { task_ids: taskIds },
    });
  }

  await logAction(SLUG, 'delegate_content', {
    runId: opts.runId,
    result: 'success',
    message: `Delegated ${taskIds.length} marketing tasks for "${keyword}"`,
    detail: { keyword, taskIds },
  });
  return { taskIds };
}

/** Dashboard convenience: delegate a pending recommendation by id. */
export async function delegateRecommendation(rec: SeoRecommendation): Promise<boolean> {
  if (!rec.target_keyword) return false;
  await requestContentForKeyword(rec.target_keyword, { recId: rec.id, priority: rec.priority === 'low' ? 'medium' : rec.priority });
  return true;
}

// ---------------------------------------------------------------------------
// Reads for the dashboard
// ---------------------------------------------------------------------------

export async function listKeywords(filter: { status?: string; category?: string; limit?: number } = {}): Promise<SeoKeyword[]> {
  let q = db.from('seo_keywords').select('*');
  if (filter.status) q = q.eq('status', filter.status);
  if (filter.category) q = q.eq('category', filter.category);
  const { data, error } = await q.order('search_volume', { ascending: false }).limit(filter.limit ?? 200);
  if (error || !data) return [];
  return data as SeoKeyword[];
}
export async function listClusters(): Promise<SeoCluster[]> {
  const { data } = await db.from('seo_clusters').select('*').order('created_at', { ascending: false }).limit(50);
  return (data as SeoCluster[]) ?? [];
}
export async function listCompetitors(): Promise<SeoCompetitor[]> {
  const { data } = await db.from('seo_competitors').select('*').order('name', { ascending: true }).limit(50);
  return (data as SeoCompetitor[]) ?? [];
}
export async function listAudits(): Promise<SeoAudit[]> {
  const { data } = await db.from('seo_audits').select('*').order('score', { ascending: true }).limit(50);
  return (data as SeoAudit[]) ?? [];
}
export async function listRecommendations(): Promise<SeoRecommendation[]> {
  const { data } = await db.from('seo_recommendations').select('*').order('created_at', { ascending: false }).limit(100);
  return (data as SeoRecommendation[]) ?? [];
}
/** Marketing requests this agent generated (aos_tasks delegated to marketing). */
export async function listMarketingRequests(): Promise<any[]> {
  const { data } = await db
    .from('aos_tasks')
    .select('*')
    .eq('created_by_agent', SLUG)
    .eq('assigned_agent', MARKETING_AGENT_SLUG)
    .order('created_at', { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function getStats(): Promise<SeoStats> {
  const [keywords, clusters, competitors, audits, recs, requests] = await Promise.all([
    listKeywords({ limit: 1000 }),
    listClusters(),
    listCompetitors(),
    listAudits(),
    listRecommendations(),
    listMarketingRequests(),
  ]);
  const cat = new Map<string, number>();
  for (const k of keywords) if (k.category) cat.set(k.category, (cat.get(k.category) ?? 0) + 1);
  return {
    totalKeywords: keywords.length,
    opportunities: keywords.filter((k) => k.status === 'opportunity').length,
    targeted: keywords.filter((k) => k.status === 'targeted').length,
    clusters: clusters.length,
    competitors: competitors.length,
    openAudits: audits.filter((a) => a.status === 'open').length,
    recommendations: recs.filter((r) => r.status === 'pending').length,
    marketingRequests: requests.length,
    topCategories: [...cat.entries()].map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count).slice(0, 8),
  };
}

// ---------------------------------------------------------------------------
// CEO -> SEO delegation + orchestrator runner
// ---------------------------------------------------------------------------

export async function enqueueSeoTask(
  kind: SeoTaskKind,
  payload: Record<string, unknown> = {},
  opts: { fromAgent?: string; title?: string; priority?: 'low' | 'medium' | 'high' | 'critical' } = {},
) {
  return createTask({
    title: opts.title ?? `SEO: ${kind.replace(/_/g, ' ')}`,
    createdByAgent: opts.fromAgent ?? 'human',
    assignedAgent: SLUG,
    priority: opts.priority ?? 'medium',
    payload: { kind, ...payload },
  });
}

async function executeSeoTask(kind: SeoTaskKind, payload: any, runId: string | null): Promise<Record<string, unknown>> {
  switch (kind) {
    case 'keyword_research':
      return { keywords: await runKeywordResearch(payload?.category, runId) };
    case 'build_cluster': {
      const cluster = await buildCluster(payload.pillarKeyword, payload.category, runId);
      return { clusterId: cluster?.id };
    }
    case 'competitor_analysis':
      return { competitors: await trackCompetitors(runId) };
    case 'audit':
      return { audited: await runSiteAudit(runId) };
    case 'content_request': {
      const { taskIds } = await requestContentForKeyword(payload.keyword, { runId, priority: payload.priority });
      return { delegated: taskIds.length, taskIds };
    }
    default:
      return { error: `Unknown SEO task kind: ${kind}` };
  }
}

export const seoRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const { listReadyTasks, setTaskStatus } = await import('@/services/aos/tasks');
  const ready = await listReadyTasks(SLUG);
  await ctx.log('scan_tasks', { message: `${ready.length} ready task(s)` });

  if (ready.length > 0) {
    let processed = 0;
    for (const task of ready) {
      const kind = (task.payload as any)?.kind as SeoTaskKind | undefined;
      if (!kind) {
        await setTaskStatus(task.id, 'failed', { error: 'Task missing payload.kind' });
        continue;
      }
      await setTaskStatus(task.id, 'in_progress');
      try {
        const result = await executeSeoTask(kind, task.payload, ctx.runId);
        await setTaskStatus(task.id, 'completed', result);
        await ctx.log('task_completed', { result: 'success', message: `${kind}`, detail: result });
        processed += 1;
      } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        await setTaskStatus(task.id, 'failed', { error });
        await ctx.log('task_failed', { level: 'error', result: 'error', error });
      }
    }
    return { ok: true, output: { processed } };
  }

  // Default strategy cycle.
  const keywords = await runKeywordResearch(undefined, ctx.runId);
  const competitors = await trackCompetitors(ctx.runId);
  const recs = await generateRecommendations(ctx.runId);
  await reportToCeo(SLUG, {
    subject: `SEO cycle: ${keywords} keywords, ${competitors} competitors, ${recs} new recommendations`,
    body: 'Organic-discovery strategy refreshed. Pending recommendations are ready to delegate to the Marketing Agent.',
    payload: { keywords, competitors, recs },
  });
  return { ok: true, output: { keywords, competitors, recs } };
};
