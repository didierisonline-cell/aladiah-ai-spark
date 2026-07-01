import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity, AlertTriangle, BadgeDollarSign, Gauge, Inbox, Users, type LucideIcon,
} from 'lucide-react';
import { CockpitSnapshot, GateVerdict } from '@/services/aos/cockpit';

// Risk-based palette only: green = go, amber = attention, red = blocked, slate = unmeasured.
const GATE_COLOR: Record<GateVerdict, string> = { GO: '#22c55e', 'NO-GO': '#ef4444', UNMEASURED: '#64748b' };
const scoreColor = (n: number | null) =>
  n == null ? '#64748b' : n >= 80 ? '#22c55e' : n >= 50 ? '#f59e0b' : '#ef4444';
const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);

/**
 * Executive Command Header — the first thing the founder sees. One row of
 * decisions: launch readiness, the three gates, platform health, students,
 * revenue, blockers, and approvals waiting.
 */
const ExecutiveCommandHeader = ({ snap }: { snap: CockpitSnapshot }) => {
  const healthColor =
    snap.platformHealth === 'operational' ? '#22c55e'
    : snap.platformHealth === 'degraded' ? '#f59e0b'
    : snap.platformHealth === 'down' ? '#ef4444' : '#64748b';

  return (
    <section aria-label="Executive command header" className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Global launch readiness (+ trend from the Company Brain) */}
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
              <Gauge className="w-3.5 h-3.5" /> Launch Readiness
            </div>
            <div className="flex items-end justify-between gap-2">
              <div className="text-3xl font-bold leading-none" style={{ color: scoreColor(snap.launchReadiness) }}>
                {snap.launchReadiness == null ? '—' : `${snap.launchReadiness}%`}
              </div>
              <ReadinessTrend history={snap.readinessHistory} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {snap.scoredDimensions} scored · {snap.unmeasuredDimensions} not yet measured
            </p>
          </CardContent>
        </Card>

        {/* Gates */}
        {snap.gates.map((g) => (
          <Link key={g.key} to={g.route} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardContent className="p-4">
                <div className="text-[11px] text-muted-foreground mb-1">{g.label} Gate</div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: GATE_COLOR[g.verdict] }} />
                  <span className="text-xl font-bold" style={{ color: GATE_COLOR[g.verdict] }}>
                    {g.verdict === 'UNMEASURED' ? 'N/M' : g.verdict}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 truncate">{g.detail}</p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Platform health */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
              <Activity className="w-3.5 h-3.5" /> Platform
            </div>
            <div className="text-xl font-bold capitalize" style={{ color: healthColor }}>
              {snap.platformHealth}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Operations & Platform Authority</p>
          </CardContent>
        </Card>

        {/* Critical blockers */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Critical Blockers
            </div>
            <div className={`text-3xl font-bold leading-none ${snap.criticalBlockers > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {snap.criticalBlockers}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Criticals + NO-GO gates</p>
          </CardContent>
        </Card>
      </div>

      {/* Second row: business vitals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Vital icon={Users} label="Students" value={snap.students == null ? '—' : snap.students.toLocaleString()} sub="Registered profiles (live)" />
        <Vital icon={BadgeDollarSign} label="Revenue (MRR)" value={money(snap.mrr)} sub={snap.subscriptionRisks > 0 ? `${snap.subscriptionRisks} subscription risk(s)` : 'No subscription risks'} warn={snap.subscriptionRisks > 0} />
        <Link to="/admin/approvals" className="group">
          <Vital icon={Inbox} label="Founder Approvals" value={snap.approvals.total} sub="Awaiting your sign-off" warn={snap.approvals.total > 0} />
        </Link>
        <Vital icon={Activity} label="Open Work Orders" value={snap.workOrders.open} sub={`${snap.workOrders.gateBlocked} in review gates`} />
      </div>
    </section>
  );
};

/** Mini daily-history bars (last 14 days from the Company Brain). */
const ReadinessTrend = ({ history }: { history: { date: string; score: number }[] }) => {
  const points = history.slice(-14);
  if (points.length < 2) return null;
  const delta = points[points.length - 1].score - points[points.length - 2].score;
  return (
    <div
      className="flex flex-col items-end gap-0.5"
      title={points.map((p) => `${p.date}: ${p.score}%`).join('\n')}
      aria-label={`Readiness trend over ${points.length} days, latest change ${delta >= 0 ? '+' : ''}${delta} points`}
    >
      <div className="flex items-end gap-[2px] h-6">
        {points.map((p) => (
          <span
            key={p.date}
            className="w-[4px] rounded-sm"
            style={{ height: `${Math.max(12, p.score)}%`, background: scoreColor(p.score) }}
          />
        ))}
      </div>
      <span className="text-[9px] font-medium" style={{ color: delta >= 0 ? '#22c55e' : '#ef4444' }}>
        {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)} vs prior day
      </span>
    </div>
  );
};

const Vital = ({
  icon: Icon, label, value, sub, warn,
}: { icon: LucideIcon; label: string; value: string | number; sub: string; warn?: boolean }) => (
  <Card className="h-full transition-colors hover:border-primary/30">
    <CardContent className="p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <div className={`text-lg font-bold leading-tight truncate ${warn ? 'text-amber-500' : 'text-foreground'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-[10.5px] text-muted-foreground truncate">{label} · {sub}</div>
      </div>
    </CardContent>
  </Card>
);

export default ExecutiveCommandHeader;
