import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Send, TrendingUp, X } from 'lucide-react';
import { DemandSignal, PlacementAction } from '@/types/placement';

interface Props {
  demand: DemandSignal[];
  actions: PlacementAction[];
  onApprove: (id: string) => void;
  onDismiss: (id: string) => void;
}

const money = (n: number | null) => (n ? `${Math.round(n / 1000)}k` : '—');

const DemandActionsPanel = ({ demand, actions, onApprove, onDismiss }: Props) => {
  const pending = actions.filter((a) => a.status === 'pending');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Send className="w-4 h-4 text-primary" /> Approvals (contracts · submissions · outreach)</CardTitle>
          <p className="text-xs text-muted-foreground">Nothing leaves Aladiah Management without your approval.</p>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[480px] overflow-y-auto">
          {pending.length === 0 ? <p className="text-sm text-muted-foreground">No pending actions.</p> : pending.map((a) => (
            <div key={a.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-foreground">{a.title} <Badge variant="outline" className="text-[8px]">{a.action_type.replace(/_/g, ' ')}</Badge></p>
                  {a.body && <p className="text-[10px] text-muted-foreground">{a.body}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" className="h-6 px-2" onClick={() => onApprove(a.id)}><Check className="w-3 h-3" /></Button>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-red-600" onClick={() => onDismiss(a.id)}><X className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Workforce Demand &amp; Salary Intelligence</CardTitle>
          <p className="text-xs text-muted-foreground">Fed back to Product Builder, QA, Student Success &amp; Admissions.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {demand.length === 0 ? <p className="text-sm text-muted-foreground">No demand signals.</p> : demand.map((d) => (
            <div key={d.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">{d.role} <span className="text-muted-foreground">· {d.region}</span></p>
                <Badge variant={d.fed_back ? 'secondary' : 'outline'} className="text-[9px]">{d.fed_back ? 'fed back' : 'pending'}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Demand {d.demand_score} · median ${money(d.salary_median)} · {d.trend}</p>
              {d.skill_gaps?.length > 0 && <p className="text-[10px] text-amber-600 mt-0.5">Skill gaps: {d.skill_gaps.join(', ')}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandActionsPanel;
