// =============================================================================
// AOS Subsystem 2 — Agent Memory
// Short-term + long-term memory, importance scoring, and search/recall.
// v1 search uses Postgres full-text (textSearch) with importance ranking.
// Phase 2 swaps in pgvector embeddings (see aos_agent_memory.embedding).
// =============================================================================
import { AgentMemory, MemoryType, RecallOptions, RememberInput } from '@/types/aos';
import { db, hoursFromNow, nowISO } from './_internal';

const TABLE = 'aos_agent_memory';
const PROMOTE_THRESHOLD = 0.7; // short-term >= this importance is promotable

/** Heuristic importance score (0-1) when the caller doesn't supply one. */
export function scoreImportance(content: string, tags: string[] = []): number {
  let score = 0.4;
  const text = content.toLowerCase();
  const signal = ['risk', 'critical', 'urgent', 'error', 'failure', 'churn', 'revenue', 'security', 'outage'];
  if (signal.some((k) => text.includes(k))) score += 0.3;
  if (tags.includes('decision') || tags.includes('risk')) score += 0.2;
  if (content.length > 280) score += 0.1;
  return Math.min(1, Math.max(0, Number(score.toFixed(2))));
}

/** Store a memory for an agent. */
export async function remember(input: RememberInput): Promise<AgentMemory | null> {
  const type: MemoryType = input.type ?? 'short_term';
  const importance = input.importance ?? scoreImportance(input.content, input.tags ?? []);
  const row = {
    agent_slug: input.agentSlug,
    memory_type: type,
    content: input.content,
    summary: input.summary ?? null,
    importance,
    tags: input.tags ?? [],
    source: input.source ?? null,
    metadata: input.metadata ?? {},
    expires_at: type === 'short_term' ? hoursFromNow(input.ttlHours ?? 72) : null,
  };
  const { data, error } = await db.from(TABLE).insert(row).select('*').single();
  if (error) {
    console.error('[AOS:memory] remember failed:', error.message);
    return null;
  }
  return data as AgentMemory;
}

/**
 * Recall memories for an agent. Free-text `query` runs a full-text search;
 * results are ordered by importance then recency. Bumps access counters.
 */
export async function recall(
  agentSlug: string,
  query?: string,
  opts: RecallOptions = {},
): Promise<AgentMemory[]> {
  let q = db.from(TABLE).select('*').eq('agent_slug', agentSlug);
  if (opts.type) q = q.eq('memory_type', opts.type);
  if (opts.minImportance != null) q = q.gte('importance', opts.minImportance);
  if (opts.tags && opts.tags.length) q = q.overlaps('tags', opts.tags);
  if (query && query.trim()) {
    // websearch_to_tsquery is forgiving of natural-language input.
    q = q.textSearch('content', query, { type: 'websearch', config: 'english' });
  }
  q = q
    .order('importance', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(opts.limit ?? 20);

  const { data, error } = await q;
  if (error || !data) {
    if (error) console.error('[AOS:memory] recall failed:', error.message);
    return [];
  }
  // Best-effort access bookkeeping (don't block recall on it).
  const ids = (data as AgentMemory[]).map((m) => m.id);
  if (ids.length) {
    void db
      .from(TABLE)
      .update({ last_accessed_at: nowISO() })
      .in('id', ids)
      .then(() => {});
  }
  return data as AgentMemory[];
}

/** Promote durable short-term memories to long-term, and purge expired ones. */
export async function consolidate(agentSlug: string): Promise<{ promoted: number; purged: number }> {
  let promoted = 0;
  let purged = 0;

  // Promote important short-term memories.
  const { data: promotable } = await db
    .from(TABLE)
    .select('id')
    .eq('agent_slug', agentSlug)
    .eq('memory_type', 'short_term')
    .gte('importance', PROMOTE_THRESHOLD);
  const promoteIds = (promotable ?? []).map((r: any) => r.id);
  if (promoteIds.length) {
    const { error } = await db
      .from(TABLE)
      .update({ memory_type: 'long_term', expires_at: null })
      .in('id', promoteIds);
    if (!error) promoted = promoteIds.length;
  }

  // Purge expired short-term memories (mark archived via metadata; never hard-delete).
  const { data: expired } = await db
    .from(TABLE)
    .select('id')
    .eq('agent_slug', agentSlug)
    .eq('memory_type', 'short_term')
    .lt('expires_at', nowISO());
  const expiredIds = (expired ?? []).map((r: any) => r.id);
  if (expiredIds.length) {
    const { error } = await db
      .from(TABLE)
      .update({ memory_type: 'episodic', metadata: { archived: true } })
      .in('id', expiredIds);
    if (!error) purged = expiredIds.length;
  }

  return { promoted, purged };
}
