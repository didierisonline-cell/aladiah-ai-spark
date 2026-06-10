import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckSquare,
  ClipboardCheck,
  GraduationCap,
  Inbox,
  LayoutGrid,
  Megaphone,
  Play,
  Rocket,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos } from '@/services/aos';
import { getWorkforceSnapshot, type AgentSnapshot } from '@/services/aos/workforce';
import { getApprovalQueue } from '@/services/aos/approvals';

// ---- 14 surfaces of the AI Workforce -------------------------------------
interface Surface {
  key: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  to: string;
  /** AOS slug to pull live status/health/last-run/pending-tasks from. */
  slug?: string;
  /** Special tile that shows the pending-approval total instead of agent stats. */
  approvals?: boolean;
}

const SURFACES: Surface[] = [
  { key: 'ceo', title: 'CEO Command Center', blurb: 'Daily executive brief & recommendations', icon: Sparkles, to: '/admin/command-center', slug: 'ceo-chief-of-staff' },
  { key: 'control', title: 'AI Workforce Control Center', blurb: 'Registry, tasks, memory & comms', icon: LayoutGrid, to: '/founder/control-center' },
  { key: 'marketing', title: 'Marketing Content', blurb: '1 idea → 13 assets, approval-gated', icon: Megaphone, to: '/admin/marketing-agent', slug: 'marketing-content' },
  { key: 'seo', title: 'SEO Strategy', blurb: 'Keyword clusters, audits, competitors', icon: Search, to: '/admin/seo-agent', slug: 'seo-strategy' },
  { key: 'product', title: 'Product Builder', blurb: 'Career Transformation Factory', icon: BookOpen, to: '/admin/product-agent', slug: 'product-builder' },
  { key: 'qa', title: 'QA Authority', blurb: 'Mandatory gate before approval', icon: ShieldCheck, to: '/admin/qa-agent', slug: 'qa-authority' },
  { key: 'admissions', title: 'Admissions Authority', blurb: 'Enrollment quality & program fit', icon: GraduationCap, to: '/admin/admissions-agent', slug: 'admissions-authority' },
  { key: 'success', title: 'Student Success', blurb: 'Career Transformation Score', icon: Rocket, to: '/admin/student-success', slug: 'student-success' },
  { key: 'placement', title: 'Placement & Employers', blurb: 'Academy ↔ Management bridge', icon: Briefcase, to: '/admin/placement-agent', slug: 'placement-authority' },
  { key: 'analytics', title: 'Analytics & Intelligence', blurb: 'CTIS — master company KPI', icon: BarChart3, to: '/admin/analytics', slug: 'analytics-intelligence' },
  { key: 'operations', title: 'Operations & Platform', blurb: 'Health, severity & incident watch', icon: Server, to: '/admin/operations', slug: 'operations-platform' },
  { key: 'curriculum', title: 'Curriculum Excellence', blurb: 'Program Standard scorecards', icon: Award, to: '/admin/curriculum-excellence', slug: 'curriculum-excellence' },
  { key: 'audit', title: 'Platform Audit', blurb: 'Site audit: issues, severity, fixes', icon: ShieldAlert, to: '/admin/operations', slug: 'operations-platform' },
  { key: 'approvals', title: 'Founder Approval Queue', blurb: 'Everything awaiting your sign-off', icon: Inbox, to: '/admin/approvals', approvals: true },
];

// ---- 8 quick actions ------------------------------------------------------
interface QuickAction {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Run an agent now. */
  run?: string;
  /** Or navigate to a surface. */
  to?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { key: 'ceo', label: 'Run CEO Brief', icon: Sparkles, run: 'ceo-chief-of-staff' },
  { key: 'curr', label: 'Run Curriculum Audit', icon: Award, run: 'curriculum-excellence' },
  { key: 'prod', label: 'Run Product Builder', icon: BookOpen, run: 'product-builder' },
  { key: 'qa', label: 'Run QA Review', icon: ShieldCheck, run: 'qa-authority' },
  { key: 'audit', label: 'Run Platform Audit', icon: ShieldAlert, run: 'operations-platform' },
  { key: 'queue', label: 'View Founder Approval Queue', icon: Inbox, to: '/admin/approvals' },
  { key: 'curr-view', label: 'View Curriculum Excellence', icon: Award, to: '/admin/curriculum-excellence' },
  { key: 'ops-view', label: 'View Operations Alerts', icon: Activity, to: '/admin/operations' },
];

const healthDot = (h: AgentSnapshot['health']) => {
  switch (h) {
    case 'healthy': return { color: '#22c55e', label: 'Healthy' };
    case 'degraded': return { color: '#f59e0b', label: 'Degraded' };
    case 'down': return { color: '#ef4444', label: 'Down' };
    default: return { color: '#64748b', label: 'Idle' };
  }
};

const timeAgo = (iso: string | null) => {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return 'scheduled';
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const WorkforceLaunchpad = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bySlug, setBySlug] = useState<Map<string, AgentSnapshot>>(new Map());
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [running, setRunning] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      await aos.ensure();
      const [snap, queue] = await Promise.all([getWorkforceSnapshot(), getApprovalQueue()]);
      setBySlug(new Map(snap.agents.map((a) => [a.slug, a])));
      setPendingApprovals(queue.total);
    } catch {
      /* defensive — surfaces still render with their static metadata */
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const runNow = useCallback(
    async (slug: string, label: string) => {
      setRunning(slug);
      try {
        const o = await aos.orchestrator.runAgent(slug, 'manual');
        toast({
          title: o.ok ? `${label} complete` : `${label} failed`,
          description: o.ok ? `Finished in ${o.durationMs}ms.` : o.error ?? 'Unknown error',
          variant: o.ok ? 'default' : 'destructive',
        });
      } finally {
        setRunning(null);
        load();
      }
    },
    [toast, load],
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" />
          Command Center
        </h2>
        <p className="text-sm text-muted-foreground">
          Every AI Workforce surface in one place. Launch any department or fire a quick action.
        </p>
      </div>

      {/* Quick actions */}
      <Card>
        <CardContent className="p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Quick actions
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              const isRunning = a.run != null && running === a.run;
              return (
                <Button
                  key={a.key}
                  size="sm"
                  variant={a.run ? 'default' : 'outline'}
                  disabled={a.run != null && running !== null}
                  onClick={() => (a.run ? runNow(a.run, a.label) : navigate(a.to!))}
                >
                  {a.run ? (
                    <Play className={`w-3.5 h-3.5 mr-1.5 ${isRunning ? 'animate-pulse' : ''}`} />
                  ) : (
                    <Icon className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {isRunning ? 'Running…' : a.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 14 surface cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SURFACES.map((s) => {
          const Icon = s.icon;
          const agent = s.slug ? bySlug.get(s.slug) : undefined;
          const dot = healthDot(agent?.health ?? 'idle');
          return (
            <Link key={s.key} to={s.to} className="group">
              <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/30">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {s.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{s.blurb}</p>
                      </div>
                    </div>
                    {s.slug && (
                      <span className="flex items-center gap-1 shrink-0" title={dot.label}>
                        <span className="w-2 h-2 rounded-full" style={{ background: dot.color }} />
                      </span>
                    )}
                  </div>

                  {/* Stats row */}
                  {s.approvals ? (
                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <ClipboardCheck className="w-3.5 h-3.5" /> Pending approvals
                      </span>
                      <span className={`text-sm font-bold ${pendingApprovals > 0 ? 'text-amber-500' : 'text-foreground'}`}>
                        {pendingApprovals}
                      </span>
                    </div>
                  ) : s.slug ? (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <Stat label="Health" value={agent ? `${Math.round(agent.performanceScore)}` : '—'} />
                      <Stat label="Pending" value={agent ? agent.tasksPending : '—'} accent={agent && agent.tasksPending > 0 ? 'text-amber-500' : undefined} />
                      <Stat label="Last run" value={timeAgo(agent?.lastRunAt ?? null)} small />
                    </div>
                  ) : (
                    <div className="rounded-lg bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5" /> Open the full control center
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

const Stat = ({
  label, value, accent, small,
}: { label: string; value: string | number; accent?: string; small?: boolean }) => (
  <div className="rounded-lg bg-muted/40 px-1.5 py-1.5">
    <p className={`font-bold ${small ? 'text-[11px]' : 'text-sm'} ${accent ?? 'text-foreground'} truncate`}>{value}</p>
    <p className="text-[10px] text-muted-foreground">{label}</p>
  </div>
);

export default WorkforceLaunchpad;
