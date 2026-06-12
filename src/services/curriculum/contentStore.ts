// =============================================================================
// Content Store — CRUD for first-class curriculum assets (founder authoring).
// Writes go through the founder's Supabase session (RLS: aos_is_admin). The
// founder never hand-edits tables — the Authoring Center calls this.
// Defensive: if the content tables don't exist yet (migration not applied),
// reads return [] and writes surface a clear error.
// =============================================================================
import { db } from '@/services/aos/_internal';

export type AssetType = 'simulations' | 'portfolios' | 'interview' | 'mentor' | 'capstones' | 'certifications';
export type AssetStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
export const STATUS_FLOW: AssetStatus[] = ['draft', 'in_review', 'approved', 'published'];

export interface AssetTypeMeta { type: AssetType; table: string; label: string; level: 'module' | 'program'; target: number; titleField: string; }
export const ASSET_TYPES: AssetTypeMeta[] = [
  { type: 'simulations', table: 'program_simulations', label: 'Simulations', level: 'module', target: 54, titleField: 'title' },
  { type: 'portfolios', table: 'program_portfolios', label: 'Portfolios', level: 'module', target: 18, titleField: 'title' },
  { type: 'interview', table: 'program_interview_prep', label: 'Interview Prep', level: 'module', target: 18, titleField: 'title' },
  { type: 'mentor', table: 'program_ai_mentor_prompts', label: 'AI Mentor Prompts', level: 'module', target: 18, titleField: 'title' },
  { type: 'capstones', table: 'program_capstones', label: 'Capstones', level: 'program', target: 1, titleField: 'title' },
  { type: 'certifications', table: 'program_certifications', label: 'Certifications', level: 'program', target: 1, titleField: 'credential_name' },
];
export const metaFor = (t: AssetType) => ASSET_TYPES.find((m) => m.type === t)!;

export interface ContentAsset {
  id: string; course_id: string; chapter_id?: string | null;
  title?: string; credential_name?: string;
  status: AssetStatus; completion_pct: number; author: string | null; version: number;
  is_published: boolean; readiness_score: number; created_at: string; updated_at: string;
  quality_score?: number; ai_generated?: boolean; ai_reviewed?: boolean; human_reviewed?: boolean;
  approved_by?: string | null; approved_at?: string | null; last_reviewed_at?: string | null;
  estimated_completion_minutes?: number | null; difficulty_level?: string | null;
  competency_tags?: string[]; learning_objectives?: string[]; industry_alignment?: string[];
  [k: string]: any;
}

export interface CourseIntel {
  id: string; title: string; is_flagship?: boolean; flagship_version?: string; curriculum_version?: string;
  launch_status?: string; launch_score?: number; target_market?: string;
  target_salary_low?: number; target_salary_high?: number; owner?: string;
}

/** Full course row incl. intelligence fields (defensive — undefined fields pre-migration). */
export async function getCourseIntel(courseId: string): Promise<CourseIntel | null> {
  try {
    const { data } = await db.from('courses').select('*').eq('id', courseId).maybeSingle();
    return (data ?? null) as CourseIntel | null;
  } catch { return null; }
}

export interface ProgramSummary { total: number; published: number; draft: number; avgReadiness: number; avgQuality: number; missingLaunch: number; }

/** Aggregate the selected program's assets across all six types (display only). */
export async function getProgramSummary(courseId: string): Promise<ProgramSummary> {
  let total = 0, published = 0, draft = 0, sumR = 0, sumQ = 0;
  const pubByType: Record<string, number> = {};
  await Promise.all(ASSET_TYPES.map(async (m) => {
    try {
      const { data } = await db.from(m.table).select('status, is_published, readiness_score, quality_score').eq('course_id', courseId).limit(5000);
      (data ?? []).forEach((r: any) => {
        total += 1; sumR += r.readiness_score ?? 0; sumQ += r.quality_score ?? 0;
        if (r.is_published) { published += 1; pubByType[m.type] = (pubByType[m.type] ?? 0) + 1; }
        if (r.status === 'draft') draft += 1;
      });
    } catch { /* table absent */ }
  }));
  const required = ['simulations', 'portfolios', 'interview', 'mentor', 'capstones', 'certifications'];
  const missingLaunch = required.filter((t) => !(pubByType[t] > 0)).length;
  return { total, published, draft, avgReadiness: total ? Math.round(sumR / total) : 0, avgQuality: total ? Math.round(sumQ / total) : 0, missingLaunch };
}

const readinessFromCompletion = (pct: number, published: boolean) => published ? Math.max(pct, 70) : Math.min(pct, 69);

/** Append an audit-trail entry (defensive — silent if table absent). */
export async function logAudit(action: string, type: AssetType, assetId: string | null, courseId: string | null, actor: string, detail: Record<string, any> = {}) {
  try {
    await db.from('curriculum_audit_log').insert({ asset_type: type, asset_id: assetId, course_id: courseId || null, action, actor, detail });
  } catch { /* table not applied yet */ }
}

export interface AuditEntry { id: string; asset_type: string; action: string; actor: string; created_at: string; detail: any; }
export async function listAudit(courseId?: string, limit = 50): Promise<AuditEntry[]> {
  try {
    let q = db.from('curriculum_audit_log').select('*').order('created_at', { ascending: false }).limit(limit);
    if (courseId) q = q.eq('course_id', courseId);
    const { data } = await q;
    return (data ?? []) as AuditEntry[];
  } catch { return []; }
}

export async function listAssets(courseId: string, type: AssetType): Promise<ContentAsset[]> {
  try {
    const { data, error } = await db.from(metaFor(type).table).select('*').eq('course_id', courseId).order('order_index').order('created_at');
    if (error) throw error;
    return (data ?? []) as ContentAsset[];
  } catch {
    return [];
  }
}

export interface NewAsset {
  courseId: string; chapterId?: string | null; title: string; author: string;
  completion_pct?: number; details?: string; level?: string; kind?: string; deliverable?: string;
}

export async function createAsset(type: AssetType, a: NewAsset): Promise<{ ok: boolean; error?: string }> {
  const m = metaFor(type);
  const titleCol = m.titleField;
  const row: Record<string, any> = {
    course_id: a.courseId,
    [titleCol]: a.title,
    author: a.author,
    status: 'draft',
    completion_pct: a.completion_pct ?? 10,
    version: 1,
    is_published: false,
    readiness_score: readinessFromCompletion(a.completion_pct ?? 10, false),
  };
  if (m.level === 'module' && a.chapterId) row.chapter_id = a.chapterId;
  if (type === 'simulations') row.level = a.level ?? 'beginner';
  if (type === 'interview') row.kind = a.kind ?? 'behavioral';
  if (type === 'portfolios') row.deliverable = a.deliverable ?? a.title;
  if (type === 'mentor') row.prompt = a.details ?? '';
  if (type === 'capstones') row.brief = a.details ?? '';
  if (type === 'certifications') row.completion_logic = {};
  try {
    const { data, error } = await db.from(m.table).insert(row).select('id').single();
    if (error) throw error;
    await logAudit('create', type, data?.id ?? null, a.courseId, a.author, { title: a.title });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Insert failed (is the migration applied?)' };
  }
}

export async function updateAsset(type: AssetType, id: string, patch: Partial<ContentAsset>, actor = 'founder'): Promise<boolean> {
  try {
    const next: Record<string, any> = { ...patch };
    if (patch.completion_pct != null) next.readiness_score = readinessFromCompletion(patch.completion_pct, patch.is_published ?? false);
    const { data: cur } = await db.from(metaFor(type).table).select('version, course_id').eq('id', id).maybeSingle();
    if (cur) next.version = (cur.version ?? 1) + 1;
    const { error } = await db.from(metaFor(type).table).update(next).eq('id', id);
    if (error) return false;
    await logAudit('update', type, id, cur?.course_id ?? '', actor, { patch });
    return true;
  } catch { return false; }
}

export async function setStatus(type: AssetType, id: string, status: AssetStatus, actor = 'founder'): Promise<boolean> {
  try {
    const published = status === 'published';
    const reviewed = status === 'approved' || status === 'published';
    const { data: cur } = await db.from(metaFor(type).table).select('completion_pct, course_id').eq('id', id).maybeSingle();
    const pct = cur?.completion_pct ?? 0;
    const nowIso = new Date().toISOString();
    const patch: Record<string, any> = {
      status, is_published: published, readiness_score: readinessFromCompletion(pct, published), last_reviewed_at: nowIso,
    };
    if (reviewed) { patch.human_reviewed = true; patch.approved_by = actor; patch.approved_at = nowIso; }
    const { error } = await db.from(metaFor(type).table).update(patch).eq('id', id);
    if (error) return false;
    // Best-effort published_at (column may not be applied yet — never blocks publish).
    if (published) { try { await db.from(metaFor(type).table).update({ published_at: nowIso }).eq('id', id); } catch { /* column absent */ } }
    await logAudit(`status:${status}`, type, id, cur?.course_id ?? '', actor, {});
    return true;
  } catch { return false; }
}

export const archiveAsset = (type: AssetType, id: string, actor = 'founder') => setStatus(type, id, 'archived', actor);

// ---------------------------------------------------------------------------
// Founder-only BULK actions across all six asset tables for a program.
// RLS (aos_is_admin) authorizes the writes; published_at is best-effort.
// ---------------------------------------------------------------------------
export interface BulkResult { updated: number; byType: Record<string, number>; }

export async function approveAllForCourse(courseId: string, actor: string): Promise<BulkResult> {
  const now = new Date().toISOString();
  const byType: Record<string, number> = {};
  let updated = 0;
  for (const m of ASSET_TYPES) {
    try {
      const { data } = await db.from(m.table)
        .update({ status: 'approved', human_reviewed: true, approved_by: actor, approved_at: now, last_reviewed_at: now })
        .eq('course_id', courseId).in('status', ['draft', 'in_review', 'approved']).select('id');
      const n = data?.length ?? 0; byType[m.type] = n; updated += n;
    } catch { byType[m.type] = 0; }
  }
  await logAudit('approve_all', 'simulations', null, courseId, actor, { updated, byType });
  return { updated, byType };
}

export async function publishAllForCourse(courseId: string, actor: string): Promise<BulkResult> {
  const now = new Date().toISOString();
  const byType: Record<string, number> = {};
  let updated = 0;
  for (const m of ASSET_TYPES) {
    try {
      // Core publish (always works, even if published_at column not applied yet).
      const { data } = await db.from(m.table)
        .update({ status: 'published', is_published: true, human_reviewed: true, approved_by: actor, approved_at: now, last_reviewed_at: now })
        .eq('course_id', courseId).neq('status', 'archived').select('id');
      const n = data?.length ?? 0; byType[m.type] = n; updated += n;
      // Best-effort published_at stamp.
      try { await db.from(m.table).update({ published_at: now }).eq('course_id', courseId).eq('is_published', true); } catch { /* column absent */ }
    } catch { byType[m.type] = 0; }
  }
  await logAudit('publish_all', 'simulations', null, courseId, actor, { updated, byType });
  return { updated, byType };
}

export async function removeAsset(type: AssetType, id: string, actor = 'founder'): Promise<boolean> {
  try {
    const { data: cur } = await db.from(metaFor(type).table).select('course_id').eq('id', id).maybeSingle();
    const { error } = await db.from(metaFor(type).table).delete().eq('id', id);
    if (error) return false;
    await logAudit('delete', type, id, cur?.course_id ?? '', actor, {});
    return true;
  } catch { return false; }
}
