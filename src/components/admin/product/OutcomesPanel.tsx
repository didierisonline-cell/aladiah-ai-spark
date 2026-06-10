import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp } from 'lucide-react';
import { ProductOutcome } from '@/types/product';
import { TRANSFORMATION_OUTCOMES } from '@/services/agents/product/engines';

/** The six transformation outcomes vs target (Student Outcome Engine). */
const OutcomesPanel = ({ outcomes }: { outcomes: ProductOutcome[] }) => {
  const byMetric = new Map(outcomes.map((o) => [o.metric, o]));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Transformation Outcomes
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          The factory's objective function. Values are real (0 until placement/salary/competency data flows in);
          targets are goals.
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRANSFORMATION_OUTCOMES.map(({ id, label }) => {
          const o = byMetric.get(id);
          const value = o?.value ?? 0;
          const target = o?.target ?? 100;
          const pct = Math.min(100, Math.round((value / Math.max(target, 1)) * 100));
          return (
            <div key={id} className="rounded-lg border border-border/60 p-4 bg-muted/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{label}</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <Target className="w-3 h-3" /> {target}{o?.unit ?? '%'}
                </span>
              </div>
              <p className="text-2xl font-bold">{value}{o?.unit ?? '%'}</p>
              <div className="h-1.5 rounded-full bg-muted mt-2">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              {o?.notes && <p className="text-[10px] text-muted-foreground mt-1">{o.notes}</p>}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default OutcomesPanel;
