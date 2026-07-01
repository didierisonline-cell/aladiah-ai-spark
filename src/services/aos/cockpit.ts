// =============================================================================
// Founder Cockpit — one snapshot for the executive command surface (/founder).
// Rolls the whole operating system into a single read: gates, launch-readiness
// dimensions, agent operating grid, approvals, work orders, and blockers.
// Honest by design (repo convention): a dimension is 'measured' only when a
// live probe backs it, 'posture' when scored from verified structural checks,
// and 'unmeasured' otherwise — the global % is computed ONLY from scored
// dimensions and says so. Every query is defensive (missing table → null).
// =============================================================================
import { db, safe } from './_internal';
import { getWorkforceSnapshot, type AgentSnapshot } from './workforce';
import { getApprovalQueue, type ApprovalQueueSnapshot } from './approvals';
import { getWorkOrderStats, type WorkOrderStats } from './workOrders';
import { listAgents } from './registry';
import { listBrain, recordReadinessSnapshot } from './brain';
import { getSecurityPosture } from '@/services/security/securityPosture';
import { getAcademyReadiness } from '@/services/curriculum/readiness';
import { getStats as getOpsStats } from '@/services/agents/operationsAgent';
import { getStats as getQAStats } from '@/services/agents/qaAgent';
import { getUXPosture } from '@/services/agents/interfaceExperience/uxPosture';

// ---- Gates ------------------------------------------------------------------
export type GateVerdict = 'GO' | 'NO-GO' | 'UNMEASURED';
export interface CockpitGate { key: string; label: string; verdict: GateVerdict; detail: string; route: string; }

// ---- Readiness dimensions ---------------------------------------------------
export type DimensionBasis = 'measured' | 'posture' | 'unmeasured';
export interface ReadinessDimension {
  key: string;
  label: string;
  /** 0–100 when scored; null when unmeasured. */
  score: number | null;
  basis: DimensionBasis;
  detail: string;
  route: string;
}

// ---- Agent grid -------------------------------------------------------------
export type RiskLevel = 'low' | 'medium' | 'high';
export interface AgentGridEntry {
  slug: string;
  name: string;
  mission: string;
  kind: 'agent' | 'persona';
  health: AgentSnapshot['health'];
  status: string;
  currentTask: string | null;
  lastRunAt: string | null;
  pendingApprovals: number;
  blockers: number; // consecutive failures + blocked tasks
  readiness: number; // performance score
  risk: RiskLevel;
  route: string;
}

export interface ReadinessHistoryPoint { date: string; score: number; }

export interface CockpitSnapshot {
  generatedAt: string;
  /** Measured-only launch readiness; null if nothing is scored. */
  launchReadiness: number | null;
  scoredDimensions: number;
  unmeasuredDimensions: number;
  /** Daily readiness history from the Company Brain, oldest → newest. */
  readinessHistory: ReadinessHistoryPoint[];
  gates: CockpitGate[];
  dimensions: ReadinessDimension[];
  platformHealth: string;
  students: number | null;
  mrr: number;
  subscriptionRisks: number;
  criticalBlockers: number;
  approvals: ApprovalQueueSnapshot;
  workOrders: WorkOrderStats;
  agents: AgentGridEntry[];
}

const count = async (table: string, apply: (q: any) => any = (q) => q): Promise<number | null> => {
  try {
    const { count: c, error } = await apply(db.from(table).select('*', { count: 'exact', head: true }));
    return error ? null : (c ?? 0);
  } catch {
    return null;
  }
};

/** An agent's risk follows its blast radius: read-only < write < publish. */
function riskFor(perms: { write?: boolean; publish?: boolean } | null | undefined, health: AgentSnapshot['health']): RiskLevel {
  if (health === 'down') return 'high';
  if (perms?.publish) return 'high';
  if (perms?.write) return health === 'degraded' ? 'high' : 'medium';
  return health === 'degraded' ? 'medium' : 'low';
}

/** Which approval-queue source each agent's output lands in. */
const APPROVAL_SOURCE_BY_SLUG: Record<string, keyof ApprovalQueueSnapshot['countsBySource']> = {
  'product-builder': 'product',
  'marketing-content': 'marketing',
  'admissions-authority': 'admissions',
  'student-success': 'student-success',
  'placement-authority': 'placement',
};

const AGENT_ROUTES: Record<string, string> = {
  'ceo-chief-of-staff': '/admin/command-center',
  'marketing-content': '/admin/marketing-agent',
  'seo-strategy': '/admin/seo-agent',
  'product-builder': '/admin/product-agent',
  'qa-authority': '/admin/qa-agent',
  'admissions-authority': '/admin/admissions-agent',
  'student-success': '/admin/student-success',
  'placement-authority': '/admin/placement-agent',
  'analytics-intelligence': '/admin/analytics',
  'operations-platform': '/admin/operations',
  'curriculum-excellence': '/admin/curriculum-excellence',
  'interface-experience': '/admin/interface-agent',
};

/** Student-facing personas — product surfaces, not AOS agents (by design). */
const PERSONAS: Pick<AgentGridEntry, 'slug' | 'name' | 'mission' | 'route'>[] = [
  { slug: 'prof-didier', name: 'Prof. Didier', mission: 'AI professor & tutor for every student, 24/7 (EN/FR/ES)', route: '/portal' },
  { slug: 'career-simulation-engine', name: 'Career Simulation Engine', mission: 'Real-world business simulations that produce performance data', route: '/portal/simulations' },
];

export async function getCockpitSnapshot(): Promise<CockpitSnapshot> {
  const [snap, approvals, workOrders, registry, academy, ops, qa] = await Promise.all([
    getWorkforceSnapshot(),
    getApprovalQueue(),
    getWorkOrderStats(),
    safe(() => listAgents(), []),
    safe(() => getAcademyReadiness(), null as Awaited<ReturnType<typeof getAcademyReadiness>> | null),
    safe(() => getOpsStats(), null as Awaited<ReturnType<typeof getOpsStats>> | null),
    safe(() => getQAStats(), null as Awaited<ReturnType<typeof getQAStats>> | null),
  ]);
  const security = getSecurityPosture();
  const ux = getUXPosture();

  // ---- Live probes ----------------------------------------------------------
  const [students, subsRisk, mktContent, seoKeywords, admLeads, plcEmployers] = await Promise.all([
    count('profiles'),
    count('subscriptions', (q) => q.in('status', ['past_due', 'unpaid', 'canceled', 'cancelled'])),
    count('marketing_content'),
    count('seo_keywords'),
    count('admissions_leads'),
    count('placement_employers'),
  ]);
  const mrr = snap.globals.revenueImpact || 0;

  // Translation coverage of the flagship course (same probe as /founder/launch).
  let translationPct: number | null = null;
  try {
    const { data: courses } = await db.from('courses').select('id,is_flagship');
    const flagship = (courses ?? []).find((c: any) => c.is_flagship);
    if (flagship) {
      const { data: chaps } = await db.from('chapters').select('translations').eq('course_id', flagship.id);
      const chapters = chaps ?? [];
      if (chapters.length) {
        const translated = chapters.filter((c: any) => {
          const t = c.translations || {};
          return Object.keys(t).some((k) => k !== 'en' && t[k] && Object.keys(t[k]).length);
        }).length;
        translationPct = Math.round((translated / chapters.length) * 100);
      }
    }
  } catch {
    translationPct = null;
  }

  // ---- Gates ----------------------------------------------------------------
  const qaGate: GateVerdict =
    qa == null ? 'UNMEASURED' : qa.awaitingReview === 0 && qa.failed === 0 ? 'GO' : 'NO-GO';
  const translationGate: GateVerdict =
    translationPct == null ? 'UNMEASURED' : translationPct >= 100 ? 'GO' : 'NO-GO';

  const gates: CockpitGate[] = [
    {
      key: 'security', label: 'Security', verdict: security.gate.verdict,
      detail: `Score ${security.overall} · ${security.criticalsOpen} critical(s) open`, route: '/admin/security',
    },
    {
      key: 'qa', label: 'QA', verdict: qaGate,
      detail: qa ? `${qa.awaitingReview} awaiting · ${qa.failed} failed · avg ${qa.avgScore}` : 'No QA data yet', route: '/admin/qa-agent',
    },
    {
      key: 'translation', label: 'Translation', verdict: translationGate,
      detail: translationPct == null ? 'No flagship translation probe' : `${translationPct}% flagship modules translated`, route: '/founder/localization',
    },
  ];

  // ---- 13 readiness dimensions ----------------------------------------------
  const opsScore =
    ops == null || ops.components === 0 ? null : Math.round((ops.operational / ops.components) * 100);
  const qaScore = qa == null || qa.reviewed === 0 ? null : Math.round((qa.passed / qa.reviewed) * 100);
  const uxSection = (key: string) => ux.sections.find((s) => s.key === key)?.score ?? null;

  const dim = (
    key: string, label: string, score: number | null, basis: DimensionBasis, detail: string, route: string,
  ): ReadinessDimension => ({ key, label, score, basis: score == null ? 'unmeasured' : basis, detail, route });

  const dimensions: ReadinessDimension[] = [
    dim('platform', 'Platform', opsScore, 'measured',
      ops ? `${ops.operational}/${ops.components} components operational · ${ops.critical} critical` : 'Run the Operations agent to measure.', '/admin/operations'),
    dim('curriculum', 'Curriculum', academy?.academyReadiness ?? null, 'measured',
      academy ? `${academy.academyReadiness}% across programs (live)` : 'No curriculum readiness data.', '/founder/readiness'),
    dim('localization', 'Localization', translationPct, 'measured',
      translationPct == null ? 'No flagship translation probe.' : `${translationPct}% of flagship modules have non-EN content.`, '/founder/localization'),
    dim('student-experience', 'Student Experience', uxSection('navigation'), 'posture',
      'Structural posture (journey clarity); live student-experience probe is Phase 2.', '/founder/journey'),
    dim('visual', 'AVIS / Visual Experience', uxSection('consistency'), 'posture',
      'Design-system consistency posture from the Interface & Experience Architect.', '/admin/interface-agent'),
    dim('qa', 'QA', qaScore, 'measured',
      qa && qa.reviewed > 0 ? `${qa.passed}/${qa.reviewed} artifacts passed QA` : 'No artifacts reviewed yet.', '/admin/qa-agent'),
    dim('security', 'Security', security.overall, 'measured',
      `Posture ${security.overall} · gate ${security.gate.verdict}`, '/admin/security'),
    dim('accessibility', 'Accessibility', uxSection('accessibility'), 'posture',
      'Structural posture; screen-reader + contrast audits pending.', '/admin/interface-agent'),
    dim('performance', 'Performance', null, 'unmeasured',
      'Needs Lighthouse / Core Web Vitals probe against production.', '/admin/operations'),
    dim('marketing', 'Marketing', null, 'unmeasured',
      `No readiness score yet — pipeline evidence: ${mktContent ?? '—'} content asset(s), ${seoKeywords ?? '—'} SEO keyword(s).`, '/admin/marketing-agent'),
    dim('admissions', 'Admissions', null, 'unmeasured',
      `No readiness score yet — pipeline evidence: ${admLeads ?? '—'} lead(s) tracked.`, '/admin/admissions-agent'),
    dim('placement', 'Placement', null, 'unmeasured',
      `No readiness score yet — pipeline evidence: ${plcEmployers ?? '—'} employer(s) tracked.`, '/admin/placement-agent'),
    dim('deployment', 'Deployment', security.gate.verdict === 'GO' ? 100 : 0, 'measured',
      `Deploy gate follows Security: ${security.gate.verdict}. Founder approval required for every release.`, '/admin/security'),
  ];

  const scored = dimensions.filter((d) => d.score != null);
  const launchReadiness = scored.length
    ? Math.round(scored.reduce((a, d) => a + (d.score ?? 0), 0) / scored.length)
    : null;

  // ---- Readiness history (Company Brain) -------------------------------------
  // Record today's score (idempotent per day; never blocks the snapshot),
  // then read the trend back oldest → newest.
  if (launchReadiness != null) {
    void recordReadinessSnapshot(
      launchReadiness,
      `${scored.length} scored dimension(s); gates S:${security.gate.verdict} QA:${qaGate} T:${translationGate}.`,
    ).catch(() => {});
  }
  const readinessHistory: ReadinessHistoryPoint[] = (await listBrain('readiness-history', 30))
    .map((e) => {
      const m = /readiness:(\d+)%:(\d{4}-\d{2}-\d{2})/.exec(e.summary ?? '');
      return m ? { date: m[2], score: Number(m[1]) } : null;
    })
    .filter((p): p is ReadinessHistoryPoint => p !== null)
    .reverse();

  // ---- Critical blockers ------------------------------------------------------
  const criticalBlockers =
    (ops?.critical ?? 0) +
    security.criticalsOpen +
    gates.filter((g) => g.verdict === 'NO-GO').length;

  // ---- Agent operating grid ---------------------------------------------------
  const registryBySlug = new Map(registry.map((a) => [a.slug, a]));
  const currentTaskBySlug = new Map<string, string>();
  const blockedBySlug = new Map<string, number>();
  try {
    const { data: openTasks } = await db
      .from('aos_tasks')
      .select('assigned_agent,title,status,created_at')
      .in('status', ['in_progress', 'ready', 'blocked'])
      .order('created_at', { ascending: false })
      .limit(400);
    for (const t of (openTasks ?? []) as any[]) {
      if (!t.assigned_agent) continue;
      if (t.status === 'blocked') {
        blockedBySlug.set(t.assigned_agent, (blockedBySlug.get(t.assigned_agent) ?? 0) + 1);
      } else if (!currentTaskBySlug.has(t.assigned_agent)) {
        currentTaskBySlug.set(t.assigned_agent, t.title);
      }
    }
  } catch {
    /* defensive */
  }

  const agents: AgentGridEntry[] = snap.agents.map((a) => {
    const reg = registryBySlug.get(a.slug);
    const approvalsSource = APPROVAL_SOURCE_BY_SLUG[a.slug];
    return {
      slug: a.slug,
      name: a.name,
      mission: a.role ?? reg?.description ?? a.slug,
      kind: 'agent',
      health: a.health,
      status: a.status,
      currentTask: currentTaskBySlug.get(a.slug) ?? null,
      lastRunAt: a.lastRunAt,
      pendingApprovals: approvalsSource ? approvals.countsBySource[approvalsSource] ?? 0 : 0,
      blockers: (blockedBySlug.get(a.slug) ?? 0) + (reg?.consecutive_failures ?? 0),
      readiness: Math.round(a.performanceScore),
      risk: riskFor(reg?.permissions, a.health),
      route: AGENT_ROUTES[a.slug] ?? '/founder/control-center',
    };
  });

  for (const p of PERSONAS) {
    agents.push({
      ...p,
      mission: p.mission,
      kind: 'persona',
      health: 'idle',
      status: 'live',
      currentTask: null,
      lastRunAt: null,
      pendingApprovals: 0,
      blockers: 0,
      readiness: 100,
      risk: 'low',
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    launchReadiness,
    scoredDimensions: scored.length,
    unmeasuredDimensions: dimensions.length - scored.length,
    readinessHistory,
    gates,
    dimensions,
    platformHealth: ops?.platformStatus ?? 'unknown',
    students,
    mrr,
    subscriptionRisks: subsRisk ?? 0,
    criticalBlockers,
    approvals,
    workOrders,
    agents,
  };
}
