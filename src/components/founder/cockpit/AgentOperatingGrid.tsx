import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Cpu, GraduationCap, Inbox, OctagonAlert } from 'lucide-react';
import { AgentGridEntry, RiskLevel } from '@/services/aos/cockpit';

const HEALTH: Record<AgentGridEntry['health'], { color: string; label: string }> = {
  healthy: { color: '#22c55e', label: 'Healthy' },
  degraded: { color: '#f59e0b', label: 'Degraded' },
  down: { color: '#ef4444', label: 'Down' },
  idle: { color: '#64748b', label: 'Idle' },
};

const RISK: Record<RiskLevel, { color: string; label: string }> = {
  low: { color: '#22c55e', label: 'Low risk' },
  medium: { color: '#f59e0b', label: 'Medium risk' },
  high: { color: '#ef4444', label: 'High risk' },
};

const timeAgo = (iso: string | null) => {
  if (!iso) return 'never';
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

/**
 * Agent Operating Grid — the 14-member workforce as an operating unit:
 * mission, health, current task, last run, approvals, blockers, readiness,
 * risk, and a direct line into each control center.
 */
const AgentOperatingGrid = ({ agents }: { agents: AgentGridEntry[] }) => (
  <section aria-label="Agent operating grid" className="space-y-3">
    <div>
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Cpu className="w-5 h-5 text-primary" /> Agent Operating Grid
      </h2>
      <p className="text-sm text-muted-foreground">
        {agents.filter((a) => a.kind === 'agent').length} AOS agents + {agents.filter((a) => a.kind === 'persona').length} student-facing personas. Every write is founder-approved.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {agents.map((a) => {
        const h = HEALTH[a.health];
        const r = RISK[a.risk];
        return (
          <Card key={a.slug} className="flex flex-col transition-colors hover:border-primary/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-start justify-between gap-2">
                <span className="flex items-center gap-2 min-w-0">
                  {a.kind === 'persona'
                    ? <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                    : <Cpu className="w-4 h-4 text-primary shrink-0" />}
                  <span className="truncate">{a.name}</span>
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium shrink-0" style={{ color: h.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: h.color }} />
                  {a.kind === 'persona' ? 'Live' : h.label}
                </span>
              </CardTitle>
              <p className="text-[11px] text-muted-foreground line-clamp-2">{a.mission}</p>
            </CardHeader>
            <CardContent className="pt-0 mt-auto space-y-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="secondary" className="text-[10px] capitalize">{a.status}</Badge>
                <Badge variant="outline" className="text-[10px]" style={{ color: r.color, borderColor: `${r.color}66` }}>
                  {r.label}
                </Badge>
                {a.kind === 'persona' && <Badge variant="outline" className="text-[10px]">student-facing</Badge>}
              </div>

              {a.kind === 'agent' && (
                <>
                  <div className="rounded-lg bg-muted/30 px-2.5 py-1.5 text-[11px]">
                    <span className="text-muted-foreground">Current task: </span>
                    <span className="text-foreground font-medium">{a.currentTask ?? 'none'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Cell label="Readiness" value={`${a.readiness}%`} color={a.readiness >= 80 ? '#22c55e' : a.readiness >= 50 ? '#f59e0b' : '#ef4444'} />
                    <Cell label="Approvals" value={a.pendingApprovals} color={a.pendingApprovals > 0 ? '#f59e0b' : undefined} icon={a.pendingApprovals > 0 ? Inbox : undefined} />
                    <Cell label="Blockers" value={a.blockers} color={a.blockers > 0 ? '#ef4444' : undefined} icon={a.blockers > 0 ? OctagonAlert : undefined} />
                  </div>
                  <p className="text-[10.5px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last run {timeAgo(a.lastRunAt)}
                  </p>
                </>
              )}

              <Button asChild size="sm" variant="outline" className="w-full">
                <Link to={a.route}>
                  Open control center <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </section>
);

const Cell = ({
  label, value, color, icon: Icon,
}: { label: string; value: string | number; color?: string; icon?: React.ElementType }) => (
  <div className="rounded-lg bg-muted/30 py-1.5 px-1">
    <p className="text-sm font-bold leading-none flex items-center justify-center gap-1" style={color ? { color } : undefined}>
      {Icon && <Icon className="w-3 h-3" />}
      {value}
    </p>
    <p className="text-[9.5px] text-muted-foreground mt-0.5">{label}</p>
  </div>
);

export default AgentOperatingGrid;
