// =============================================================================
// AOS Subsystem 1 — Agent Registry
// Stores every agent: name, role, status, priority, last/next run, system
// prompt, permissions. The single source of truth for "who is in the workforce".
// =============================================================================
import {
  AgentRecord,
  AgentStatus,
  DEFAULT_PERMISSIONS,
  RegisterAgentInput,
} from '@/types/aos';
import { db, nowISO } from './_internal';

const TABLE = 'aos_agents';

/** Insert or update an agent definition (idempotent on slug). */
export async function registerAgent(input: RegisterAgentInput): Promise<AgentRecord | null> {
  const row = {
    slug: input.slug,
    name: input.name,
    role: input.role ?? null,
    description: input.description ?? null,
    status: input.status ?? 'active',
    priority: input.priority ?? 100,
    cadence: input.cadence ?? 'manual',
    schedule_cron: input.schedule_cron ?? null,
    system_prompt: input.system_prompt ?? null,
    permissions: { ...DEFAULT_PERMISSIONS, ...(input.permissions ?? {}) },
    config: input.config ?? {},
    updated_at: nowISO(),
  };
  const { data, error } = await db
    .from(TABLE)
    .upsert(row, { onConflict: 'slug' })
    .select('*')
    .single();
  if (error) {
    console.error('[AOS:registry] registerAgent failed:', error.message);
    return null;
  }
  return data as AgentRecord;
}

export async function getAgent(slug: string): Promise<AgentRecord | null> {
  const { data, error } = await db.from(TABLE).select('*').eq('slug', slug).maybeSingle();
  if (error) return null;
  return (data as AgentRecord) ?? null;
}

export async function listAgents(): Promise<AgentRecord[]> {
  const { data, error } = await db
    .from(TABLE)
    .select('*')
    .order('priority', { ascending: true })
    .order('name', { ascending: true });
  if (error || !data) return [];
  return data as AgentRecord[];
}

export async function setAgentStatus(slug: string, status: AgentStatus): Promise<boolean> {
  const { error } = await db
    .from(TABLE)
    .update({ status, updated_at: nowISO() })
    .eq('slug', slug);
  return !error;
}

/** Patch arbitrary registry fields (used by the orchestrator/health monitor). */
export async function updateAgent(
  slug: string,
  patch: Partial<AgentRecord>,
): Promise<boolean> {
  const { error } = await db
    .from(TABLE)
    .update({ ...patch, updated_at: nowISO() })
    .eq('slug', slug);
  if (error) console.error('[AOS:registry] updateAgent failed:', error.message);
  return !error;
}
