import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentTask, TaskPriority, TaskStatus } from '@/types/aos';

const COLUMNS: { key: TaskStatus | 'open'; label: string; match: (s: TaskStatus) => boolean }[] = [
  { key: 'open', label: 'Open', match: (s) => s === 'pending' || s === 'ready' || s === 'blocked' },
  { key: 'in_progress', label: 'In Progress', match: (s) => s === 'in_progress' },
  { key: 'completed', label: 'Completed', match: (s) => s === 'completed' },
  { key: 'failed', label: 'Failed / Cancelled', match: (s) => s === 'failed' || s === 'cancelled' },
];

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

const TaskBoard = ({ tasks }: { tasks: AgentTask[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Task Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const items = tasks.filter((t) => col.match(t.status));
            return (
              <div key={col.key} className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  {col.label}
                  <Badge variant="secondary" className="text-[10px]">
                    {items.length}
                  </Badge>
                </p>
                {items.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground/60 italic">none</p>
                ) : (
                  items.map((t) => (
                    <div key={t.id} className="rounded-lg border border-border/60 p-2.5 bg-muted/20">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-foreground">{t.title}</p>
                        <Badge className={`text-[9px] border shrink-0 ${PRIORITY_STYLES[t.priority]}`}>
                          {t.priority}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {t.assigned_agent ? `→ ${t.assigned_agent}` : 'unassigned'}
                        {t.depends_on?.length > 0 && ` · ${t.depends_on.length} dep(s)`}
                      </p>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskBoard;
