// =============================================================================
// CEO Status — on-demand executive aggregation for the Founder.
// "CEO, what's happening?" → one snapshot across Revenue, Admissions, Students,
// Learning, Placement, Security, Operations, and the AI Workforce.
// Honest by design: real numbers where the data exists, null (→ "—") where the
// pipeline isn't populated yet. Every query is defensive (missing table → null).
// =============================================================================
import { db } from '@/services/aos/_internal';
import { getWorkforceSnapshot, type AgentSnapshot } from '@/services/aos/workforce';
import { getApprovalQueue } from '@/services/aos/approvals';
import { getSecurityPosture } from '@/services/security/securityPosture';
import { getAcademyReadiness } from '@/services/curriculum/readiness';

export interface Metric { label: string; value: number | string | null; money?: boolean; pct?: boolean; }
export interface CEOSection { key: string; title: string; metrics: Metric[]; }
export interface CEOStatus {
  generatedAt: string;
  companyHealth: number;
  ctis: number;
  curriculumReadiness: number;
  security: { score: number; gate: 'GO' | 'NO-GO'; criticals: number; lastScan: string };
  pendingApprovals: number;
  sections: CEOSection[];
  workforce: Pick<AgentSnapshot, 'slug' | 'name' | 'status' | 'health'>[];
}

async function count(table: string, apply: (q: any) => any = (q) => q): Promise<number | null> {
  try {
    const { count, error } = await apply(db.from(table).select('*', { count: 'exact', head: true }));
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

export async function getCEOStatus(): Promise<CEOStatus> {
  const [snap, approvals, academy] = await Promise.all([getWorkforceSnapshot(), getApprovalQueue(), getAcademyReadiness()]);
  const security = getSecurityPosture();

  // Defensive pipeline counts (null → "—" in the UI; never fabricated).
  const [students, leads, applications, lessonsCompleted, placed, openTasks] = await Promise.all([
    count('profiles'),
    count('admissions_leads'),
    count('admissions_applications'),
    count('user_progress', (q) => q.not('quiz_id', 'is', null)),
    count('placements'),
    count('aos_tasks', (q) => q.in('status', ['pending', 'ready', 'blocked', 'in_progress'])),
  ]);

  const g = snap.globals;
  const mrr = g.revenueImpact || 0;

  const sections: CEOSection[] = [
    {
      key: 'revenue', title: 'Revenue', metrics: [
        { label: 'MRR', value: mrr, money: true },
        { label: 'ARR', value: mrr * 12, money: true },
        { label: 'Stripe Revenue', value: null, money: true },
        { label: 'Pending Revenue', value: null, money: true },
      ],
    },
    {
      key: 'admissions', title: 'Admissions', metrics: [
        { label: 'Leads', value: leads ?? g.leadsGenerated ?? 0 },
        { label: 'Applications', value: applications },
        { label: 'Conversions', value: null },
      ],
    },
    {
      key: 'students', title: 'Students', metrics: [
        { label: 'Total', value: students },
        { label: 'Active', value: null },
        { label: 'At Risk', value: null },
        { label: 'Graduated', value: null },
      ],
    },
    {
      key: 'learning', title: 'Learning', metrics: [
        { label: 'Lessons Completed', value: lessonsCompleted },
        { label: 'Quiz Pass Rate', value: null, pct: true },
        { label: 'Simulation Completion', value: null, pct: true },
      ],
    },
    {
      key: 'placement', title: 'Placement', metrics: [
        { label: 'Interview Ready', value: null },
        { label: 'Employer Ready', value: null },
        { label: 'Placed', value: placed },
      ],
    },
    {
      key: 'operations', title: 'Operations', metrics: [
        { label: 'Open Tasks', value: openTasks },
        { label: 'Open Bugs', value: null },
        { label: 'Failed Tests', value: null },
      ],
    },
  ];

  const FOCUS = ['product-builder', 'marketing-content', 'admissions-authority', 'student-success', 'analytics-intelligence'];
  const workforce = snap.agents
    .filter((a) => FOCUS.includes(a.slug))
    .map((a) => ({ slug: a.slug, name: a.name, status: a.status, health: a.health }));

  return {
    generatedAt: new Date().toISOString(),
    companyHealth: g.healthScore,
    ctis: g.ctis,
    curriculumReadiness: academy.academyReadiness,
    security: { score: security.overall, gate: security.gate.verdict, criticals: security.criticalsOpen, lastScan: security.lastScan },
    pendingApprovals: approvals.total,
    sections,
    workforce,
  };
}
