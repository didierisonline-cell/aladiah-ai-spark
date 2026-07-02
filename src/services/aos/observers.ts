// =============================================================================
// Built-in department observers — the eyes of Continuous Intelligence.
// Every observer reads LIVE internal telemetry (defensive queries; missing
// table → no claim). Confidence values carry their basis. Where a data source
// simply is not connected (external research, market intelligence), the
// observer says so as a finding instead of inventing numbers.
// =============================================================================
import { db, nowISO, safe } from './_internal';
import { DepartmentObserver, IntelligenceFinding, registerObserver } from './intelligence';
import { EvidenceNote } from './workOrders';
import { getSecurityPosture } from '@/services/security/securityPosture';
import { getUXPosture } from '@/services/agents/interfaceExperience/uxPosture';
import { getAcademyReadiness } from '@/services/curriculum/readiness';

const ev = (author: string, note: string): EvidenceNote => ({ at: nowISO(), author, note });

const countRows = async (table: string, apply: (q: any) => any = (q) => q): Promise<number | null> => {
  try {
    const { count, error } = await apply(db.from(table).select('*', { count: 'exact', head: true }));
    return error ? null : (count ?? 0);
  } catch {
    return null;
  }
};

// ---- Security (owned by Operations & Platform — the platform guardian) -------
const securityObserver: DepartmentObserver = {
  department: 'operations-platform',
  source: 'security posture (structural checks)',
  observe: async () => {
    const p = getSecurityPosture();
    const findings: IntelligenceFinding[] = [];
    for (const section of p.sections) {
      for (const check of section.checks) {
        if (check.status === 'pass') continue;
        const critical = check.status === 'fail';
        findings.push({
          department: 'operations-platform',
          title: `Security: ${check.label}`,
          detail: check.detail,
          evidence: [ev('operations-platform', `Posture check '${check.id}' = ${check.status}: ${check.detail}`)],
          confidence: { value: 0.95, basis: 'Structural posture model maintained against the Security Exposure Report.' },
          severity: critical ? 'critical' : 'attention',
          recommendation: critical
            ? {
                summary: `Resolve failing security check: ${check.label}. ${check.detail}`,
                estimatedImpact: `Security gate moves toward GO (currently ${p.gate.verdict}); removes a launch blocker.`,
                estimatedEffort: 'Founder action (key rotation / config) — hours, not days.',
                risks: ['Rotating keys invalidates old credentials — coordinate before rotating.'],
                dependencies: [],
                successMetrics: [`Posture check '${check.id}' reads pass; security score rises above ${p.overall}.`],
                targetType: 'security',
                priority: 'critical',
              }
            : undefined,
        });
      }
    }
    return findings;
  },
};

// ---- UX (Interface & Experience Architect) -----------------------------------
const uxObserver: DepartmentObserver = {
  department: 'interface-experience',
  source: 'UX posture (structural checks)',
  observe: async () => {
    const p = getUXPosture();
    const findings: IntelligenceFinding[] = [];
    for (const section of p.sections) {
      for (const check of section.checks) {
        if (check.status === 'pass') continue;
        findings.push({
          department: 'interface-experience',
          title: `UX: ${check.label}`,
          detail: check.detail,
          evidence: [ev('interface-experience', `UX posture check '${check.id}' = ${check.status}: ${check.detail}`)],
          confidence: { value: 0.7, basis: 'Verified structural fact about the codebase; user impact not yet measured live.' },
          severity: 'attention',
          recommendation: {
            summary: `${check.label} — ${check.detail}`,
            estimatedImpact: `Section '${section.title}' score rises (currently ${section.score}/100).`,
            estimatedEffort: 'Small–medium front-end change; no data model impact.',
            risks: ['Visual changes need founder review before shipping (UX gate applies).'],
            dependencies: [],
            successMetrics: [`UX posture check '${check.id}' reads pass.`],
            targetType: 'design',
          },
        });
      }
    }
    return findings;
  },
};

// ---- Operations (open findings + revenue leakage) -----------------------------
const operationsObserver: DepartmentObserver = {
  department: 'operations-platform',
  source: 'ops_findings + subscriptions (live)',
  observe: async () => {
    const findings: IntelligenceFinding[] = [];

    const open = await safe(
      async () => (await db.from('ops_findings').select('severity,title,detail,recommendation').eq('status', 'open').limit(50)).data ?? [],
      [] as any[],
    );
    for (const f of open.filter((x) => x.severity === 'critical' || x.severity === 'high')) {
      findings.push({
        department: 'operations-platform',
        title: `Ops: ${f.title}`,
        detail: f.detail ?? '',
        evidence: [ev('operations-platform', `Open ops_findings row (severity ${f.severity}): ${f.title}`)],
        confidence: { value: 0.85, basis: 'Produced by the operations audit engine from live queries.' },
        severity: f.severity === 'critical' ? 'critical' : 'attention',
        recommendation: {
          summary: f.recommendation ?? `Address open ${f.severity} finding: ${f.title}`,
          estimatedImpact: 'Platform status improves; removes a student-facing or revenue risk.',
          estimatedEffort: 'Varies by finding — triage first.',
          risks: ['Fix may touch production surfaces — QA + founder approval required.'],
          dependencies: [],
          successMetrics: ['The ops_findings row is resolved and does not reopen on the next audit.'],
          targetType: 'platform',
          priority: f.severity === 'critical' ? 'critical' : 'high',
        },
      });
    }

    const leaking = await countRows('subscriptions', (q) => q.in('status', ['past_due', 'unpaid', 'canceled', 'cancelled']));
    if (leaking != null && leaking > 0) {
      findings.push({
        department: 'operations-platform',
        title: `${leaking} subscription(s) at risk (past_due/canceled)`,
        detail: 'Possible revenue leakage — no dunning/win-back flow has run.',
        evidence: [ev('operations-platform', `Live count: ${leaking} subscriptions with status past_due/unpaid/canceled at ${nowISO()}.`)],
        confidence: { value: 0.9, basis: 'Reproducible live count query.' },
        severity: 'attention',
      });
    }
    return findings;
  },
};

// ---- Curriculum (program readiness) -------------------------------------------
const curriculumObserver: DepartmentObserver = {
  department: 'curriculum-excellence',
  source: 'program readiness (live curriculum data)',
  observe: async () => {
    const academy = await safe(() => getAcademyReadiness(), null as Awaited<ReturnType<typeof getAcademyReadiness>> | null);
    if (!academy) return [];
    const findings: IntelligenceFinding[] = [];
    for (const prog of academy.programs ?? []) {
      if (prog.readiness >= 100) continue;
      const gaps = (prog.dims ?? []).filter((d: any) => d.pct < 100).map((d: any) => `${d.label} ${d.have}/${d.target}`);
      findings.push({
        department: 'curriculum-excellence',
        title: `${prog.title}: ${prog.readiness}% ready`,
        detail: gaps.join(' · ') || 'Below launch gate.',
        evidence: [ev('curriculum-excellence', `Live readiness ${prog.readiness}%. Gaps: ${gaps.join('; ') || 'see program dashboard'}.`)],
        confidence: { value: 0.9, basis: 'Computed from live courses/chapters/quizzes/artifacts counts.' },
        severity: prog.readiness < 60 ? 'attention' : 'info',
        recommendation: prog.readiness < 100 && prog.readiness >= 40
          ? {
              summary: `Close the launch-gate gaps for ${prog.title}: ${gaps.slice(0, 4).join('; ')}.`,
              estimatedImpact: `Program moves from ${prog.readiness}% toward launch-ready; unlocks enrollment revenue for this program.`,
              estimatedEffort: `${gaps.length} dimension(s) below target — content production via Product Builder.`,
              risks: ['Content produced under time pressure can fail QA benchmarks — the QA gate stays mandatory.'],
              dependencies: ['Product Builder capacity', 'QA review bandwidth'],
              successMetrics: [`${prog.title} readiness reaches 100% on /founder/readiness.`],
              targetType: 'curriculum',
              collaborators: ['product-builder', 'qa-authority'],
            }
          : undefined,
      });
    }
    return findings;
  },
};

// ---- Learner outcomes (Student Success) ----------------------------------------
const learnerOutcomesObserver: DepartmentObserver = {
  department: 'student-success',
  source: 'quiz_attempts (live learner outcomes)',
  observe: async () => {
    const attempts = await safe(
      async () => (await db.from('quiz_attempts').select('score').limit(10000)).data ?? [],
      [] as any[],
    );
    if (attempts.length === 0) {
      return [{
        department: 'student-success',
        title: 'No learner outcome data yet',
        detail: 'quiz_attempts is empty or unreadable — outcome intelligence is blind until students take quizzes.',
        evidence: [ev('student-success', `Live query at ${nowISO()}: 0 quiz_attempts rows readable.`)],
        confidence: { value: 0.9, basis: 'Reproducible live count.' },
        severity: 'info',
      }];
    }
    const scores = attempts.map((a) => Number(a.score)).filter((s) => Number.isFinite(s));
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const findings: IntelligenceFinding[] = [{
      department: 'student-success',
      title: `Learner outcomes: ${attempts.length} attempt(s), avg score ${avg}`,
      detail: 'Live aggregate across all quiz attempts.',
      evidence: [ev('student-success', `Live aggregate at ${nowISO()}: n=${attempts.length}, avg=${avg}.`)],
      confidence: { value: Math.min(0.9, 0.4 + attempts.length / 500), basis: `Sample size n=${attempts.length}; confidence scales with volume.` },
      severity: avg < 60 && attempts.length >= 20 ? 'attention' : 'info',
    }];
    if (avg < 60 && attempts.length >= 20) {
      findings[0].recommendation = {
        summary: `Average quiz score is ${avg} across ${attempts.length} attempts — investigate which competencies drive the misses and remediate content.`,
        estimatedImpact: 'Higher competency mastery → higher certification and employability outcomes (the master KPI).',
        estimatedEffort: 'Analysis via the Phase-2 competency rollup, then targeted content fixes.',
        risks: ['Low averages may reflect quiz difficulty, not content quality — validate before rewriting content.'],
        dependencies: ['Competency tagging coverage (canon: populated at insert time)'],
        successMetrics: ['Rolling average score rises above 70 within 60 days.'],
        targetType: 'curriculum',
        collaborators: ['curriculum-excellence', 'product-builder'],
      };
    }
    return findings;
  },
};

// ---- Pipeline presence (Marketing / Admissions / Placement) ---------------------
const pipelineObserver = (
  department: string,
  source: string,
  table: string,
  what: string,
): DepartmentObserver => ({
  department,
  source,
  observe: async () => {
    const n = await countRows(table);
    if (n == null) {
      return [{
        department,
        title: `${what}: data source not readable`,
        detail: `Table '${table}' is missing or unreadable — this department's intelligence is blind.`,
        evidence: [ev(department, `Live probe at ${nowISO()}: '${table}' not readable.`)],
        confidence: { value: 0.9, basis: 'Reproducible probe result.' },
        severity: 'info',
      }];
    }
    return [{
      department,
      title: `${what}: ${n} record(s) in pipeline`,
      detail: n === 0 ? `Zero ${what.toLowerCase()} — the funnel for this department has not started.` : 'Live pipeline volume.',
      evidence: [ev(department, `Live count at ${nowISO()}: ${n} rows in '${table}'.`)],
      confidence: { value: 0.9, basis: 'Reproducible live count.' },
      severity: n === 0 ? 'attention' : 'info',
    }];
  },
});

// ---- External research / market intelligence (honest gap) -----------------------
const externalResearchObserver: DepartmentObserver = {
  department: 'analytics-intelligence',
  source: 'external research & market intelligence (integration status)',
  observe: async () => [{
    department: 'analytics-intelligence',
    title: 'External research ingestion is not connected',
    detail:
      'Employer demand, competitor benchmarks, and market intelligence require a server-side integration (edge function + approved sources). Until then no external claims are made.',
    evidence: [ev('analytics-intelligence', 'Structural fact: the client codebase has no external fetch path or research API integration.')],
    confidence: { value: 1.0, basis: 'Structural fact about the codebase — reproducible by inspection.' },
    severity: 'attention',
    recommendation: {
      summary:
        'Build the external-intelligence ingestion path: a Supabase edge function pulling from founder-approved sources (job boards, salary data, competitor curricula) into analytics tables.',
      estimatedImpact: 'Unlocks employer-demand and market-benchmark intelligence for every department — currently blind.',
      estimatedEffort: 'Edge function + source approval + schema — multi-day; founder applies config/keys.',
      risks: ['External data quality varies; every source needs founder approval before ingestion (canon).'],
      dependencies: ['Founder-approved source list', 'Server-side deployment (Phase-2 infrastructure)'],
      successMetrics: ['First external dataset lands in analytics tables with source attribution and freshness stamps.'],
      targetType: 'platform',
      priority: 'high',
    },
  }],
};

let registered = false;

/** Register every built-in observer (idempotent). Called from ensureAOS(). */
export function registerBuiltinObservers(): void {
  if (registered) return;
  registered = true;
  registerObserver(securityObserver);
  registerObserver(uxObserver);
  registerObserver(operationsObserver);
  registerObserver(curriculumObserver);
  registerObserver(learnerOutcomesObserver);
  registerObserver(pipelineObserver('marketing-content', 'marketing_content (live)', 'marketing_content', 'Marketing assets'));
  registerObserver(pipelineObserver('admissions-authority', 'admissions_leads (live)', 'admissions_leads', 'Admissions leads'));
  registerObserver(pipelineObserver('placement-authority', 'placement_employers (live)', 'placement_employers', 'Employer relationships'));
  registerObserver(externalResearchObserver);
}
