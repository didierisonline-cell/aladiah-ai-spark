// =============================================================================
// Academy Production — content lifecycle status per program + a ranked
// production queue. Reads live Supabase only (defensive). Revenue potential and
// market demand are configured business inputs (flagged); completion + missing
// come from live content.
// =============================================================================
import { db } from '@/services/aos/_internal';
import { ASSET_TYPES, type AssetStatus } from './contentStore';
import { listManagedCourses } from './courses';
import type { AcademyReadiness, ProgramReadiness } from './readiness';

export type StatusCounts = Record<AssetStatus, number>;
const emptyCounts = (): StatusCounts => ({ draft: 0, in_review: 0, approved: 0, published: 0, archived: 0 });

export interface ProgramProduction { id: string; title: string; counts: StatusCounts; total: number; }
export interface ProductionStatus { programs: ProgramProduction[]; academy: StatusCounts; total: number; }

export async function getProductionStatus(): Promise<ProductionStatus> {
  const byCourse = new Map<string, StatusCounts>();
  const courses = await listManagedCourses();
  courses.forEach((c) => byCourse.set(c.id, emptyCounts()));

  await Promise.all(ASSET_TYPES.map(async (m) => {
    try {
      const { data } = await db.from(m.table).select('course_id, status').limit(10000);
      (data ?? []).forEach((r: any) => {
        const c = byCourse.get(r.course_id); if (!c) return;
        const s = (r.status ?? 'draft') as AssetStatus;
        if (c[s] != null) c[s] += 1; else c.draft += 1;
      });
    } catch { /* table not applied */ }
  }));

  const academy = emptyCounts();
  const programs: ProgramProduction[] = courses.map((c) => {
    const counts = byCourse.get(c.id) ?? emptyCounts();
    (Object.keys(counts) as AssetStatus[]).forEach((k) => { academy[k] += counts[k]; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return { id: c.id, title: c.title, counts, total };
  });
  return { programs, academy, total: Object.values(academy).reduce((a, b) => a + b, 0) };
}

// ---- Production queue (business prioritization) ----------------------------
// Configured estimates (1-100) until real revenue/demand analytics exist.
const PRIORITY: { match: RegExp; revenue: number; demand: number }[] = [
  { match: /scrum master/i, revenue: 85, demand: 90 },
  { match: /product manager/i, revenue: 80, demand: 85 },
  { match: /project manager/i, revenue: 75, demand: 80 },
  { match: /business analyst/i, revenue: 65, demand: 72 },
  { match: /data analyst|data engineer/i, revenue: 80, demand: 88 },
  { match: /devops|platform/i, revenue: 82, demand: 80 },
  { match: /cloud|solutions architect/i, revenue: 85, demand: 86 },
  { match: /security|cyber/i, revenue: 88, demand: 92 },
];
const bizFor = (title: string) => PRIORITY.find((p) => p.match.test(title)) ?? { revenue: 55, demand: 55 };

export interface QueueItem {
  id: string; title: string; completion: number; revenue: number; demand: number;
  missing: number; weeksToLaunch: number; priority: number;
}

export function buildProductionQueue(readiness: AcademyReadiness): QueueItem[] {
  const items: QueueItem[] = readiness.programs.map((p: ProgramReadiness) => {
    const biz = bizFor(p.title);
    const missing = p.dims.reduce((a, d) => a + Math.max(0, d.target - d.have), 0);
    const weeksToLaunch = Math.max(1, Math.ceil(missing / 40)); // ~40 components authored / week
    const launchSpeed = Math.max(0, 100 - weeksToLaunch * 8);   // sooner = higher
    // Weighted by the founder's stated order: revenue > demand > completion > time-to-launch.
    const priority = Math.round(0.35 * biz.revenue + 0.30 * biz.demand + 0.25 * p.readiness + 0.10 * launchSpeed);
    return { id: p.id, title: p.title, completion: p.readiness, revenue: biz.revenue, demand: biz.demand, missing, weeksToLaunch, priority };
  });
  return items.sort((a, b) => b.priority - a.priority);
}
