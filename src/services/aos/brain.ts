// =============================================================================
// Company Brain — institutional memory for Aladiah.
// A lightweight foundation layered on the existing AOS memory subsystem
// (aos_agent_memory) under the reserved slug 'company-brain' — no new tables,
// no parallel system (per AGENT_OPERATING_SYSTEM.md). Entries are long-term
// memories tagged with a canonical category so every agent and the founder
// query one durable record of how the company decided to operate.
// =============================================================================
import { AgentMemory } from '@/types/aos';
import { db } from './_internal';
import { remember } from './memory';
import { emitEvent } from './events';

export const BRAIN_SLUG = 'company-brain';

export type BrainCategory =
  | 'founder-decision'
  | 'architecture-decision'
  | 'curriculum-standard'
  | 'qa-standard'
  | 'security-standard'
  | 'translation-dictionary'
  | 'design-decision'
  | 'readiness-history'
  | 'executive-report'
  | 'impact-measurement';

export const BRAIN_CATEGORIES: { key: BrainCategory; label: string }[] = [
  { key: 'founder-decision', label: 'Founder Decisions' },
  { key: 'architecture-decision', label: 'Architecture Decisions' },
  { key: 'curriculum-standard', label: 'Curriculum Standards' },
  { key: 'qa-standard', label: 'QA Standards' },
  { key: 'security-standard', label: 'Security Standards' },
  { key: 'translation-dictionary', label: 'Translation Dictionary' },
  { key: 'design-decision', label: 'Design System Decisions' },
  { key: 'readiness-history', label: 'Launch Readiness History' },
  { key: 'executive-report', label: 'Executive Reports' },
  { key: 'impact-measurement', label: 'Impact Measurements' },
];

export interface BrainEntry {
  id: string;
  category: BrainCategory;
  content: string;
  summary: string | null;
  recordedBy: string; // agent slug or 'founder'
  createdAt: string;
}

function toEntry(m: AgentMemory): BrainEntry {
  const category =
    (m.tags.find((t) => BRAIN_CATEGORIES.some((c) => c.key === t)) as BrainCategory | undefined) ??
    'founder-decision';
  return {
    id: m.id,
    category,
    content: m.content,
    summary: m.summary,
    recordedBy: m.source ?? 'founder',
    createdAt: m.created_at,
  };
}

/** Record a durable institutional fact. Always long-term; never expires. */
export async function recordDecision(input: {
  category: BrainCategory;
  content: string;
  summary?: string;
  recordedBy?: string;
}): Promise<BrainEntry | null> {
  const m = await remember({
    agentSlug: BRAIN_SLUG,
    content: input.content,
    summary: input.summary,
    type: 'long_term',
    importance: 0.9, // institutional decisions are always high-signal
    tags: [input.category, 'decision'],
    source: input.recordedBy ?? 'founder',
  });
  if (m) {
    await emitEvent(
      input.category === 'readiness-history' ? 'readiness.snapshot' : 'brain.decision.recorded',
      input.recordedBy ?? 'founder',
      input.summary ?? input.content.slice(0, 120),
      { brain_entry_id: m.id, category: input.category },
    );
  }
  return m ? toEntry(m) : null;
}

export async function listBrain(category?: BrainCategory, limit = 100): Promise<BrainEntry[]> {
  try {
    let q = db.from('aos_agent_memory').select('*').eq('agent_slug', BRAIN_SLUG);
    if (category) q = q.contains('tags', [category]);
    const { data, error } = await q.order('created_at', { ascending: false }).limit(limit);
    if (error || !data) return [];
    return (data as AgentMemory[]).map(toEntry);
  } catch {
    return [];
  }
}

export async function getBrainCounts(): Promise<Record<BrainCategory, number>> {
  const entries = await listBrain(undefined, 500);
  const counts = Object.fromEntries(BRAIN_CATEGORIES.map((c) => [c.key, 0])) as Record<BrainCategory, number>;
  for (const e of entries) counts[e.category] += 1;
  return counts;
}

/**
 * Snapshot today's launch-readiness score into the brain so the readiness
 * trend is queryable later. Idempotent per day (skips if today is recorded).
 */
export async function recordReadinessSnapshot(score: number, detail: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const recent = await listBrain('readiness-history', 1);
  if (recent[0]?.createdAt?.slice(0, 10) === today) return;
  await recordDecision({
    category: 'readiness-history',
    content: `Launch readiness ${score}% on ${today}. ${detail}`,
    summary: `readiness:${score}%:${today}`,
    recordedBy: 'analytics-intelligence',
  });
}
