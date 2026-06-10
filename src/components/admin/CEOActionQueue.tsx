import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ListChecks } from 'lucide-react';
import { CeoAction, Priority } from '@/types/agentReports';

const PRIORITY_STYLES: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-700 border-slate-200',
};

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

interface CEOActionQueueProps {
  actions: CeoAction[];
}

/** Priority-ordered list of recommended CEO actions (section 8). */
const CEOActionQueue = ({ actions }: CEOActionQueueProps) => {
  const ordered = [...actions].sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="w-4 h-4 text-primary" />
          CEO Action Queue
          {ordered.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {ordered.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ordered.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            No actions recommended today.
          </div>
        ) : (
          <ol className="space-y-3">
            {ordered.map((a, i) => (
              <li
                key={i}
                className="rounded-lg border border-border/60 p-3 bg-muted/20"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">
                    {i + 1}. {a.action}
                  </p>
                  <Badge className={`text-[10px] border shrink-0 ${PRIORITY_STYLES[a.priority]}`}>
                    {a.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{a.reason}</p>
                <p className="text-xs text-foreground/80">
                  <span className="font-medium">Expected impact: </span>
                  {a.estimated_impact}
                </p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};

export default CEOActionQueue;
