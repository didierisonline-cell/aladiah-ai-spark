import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import { Employer, PlacementJob, RelationshipStatus } from '@/types/placement';

const STATUS: Record<RelationshipStatus, string> = {
  prospect: 'bg-slate-100 text-slate-600 border-slate-200',
  engaged: 'bg-blue-100 text-blue-700 border-blue-200',
  client: 'bg-green-100 text-green-700 border-green-200',
  recruiter: 'bg-purple-100 text-purple-700 border-purple-200',
  inactive: 'bg-slate-100 text-slate-400 border-slate-200',
};
const FILTERS: (RelationshipStatus | 'all')[] = ['all', 'client', 'engaged', 'prospect', 'recruiter'];

const EmployersPanel = ({ employers, jobs }: { employers: Employer[]; jobs: PlacementJob[] }) => {
  const [f, setF] = useState<RelationshipStatus | 'all'>('all');
  const rows = f === 'all' ? employers : employers.filter((e) => e.relationship_status === f);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Employers &amp; Clients</CardTitle>
        <div className="flex flex-wrap gap-1 pt-2">
          {FILTERS.map((x) => <Button key={x} size="sm" variant={f === x ? 'default' : 'outline'} className="h-7 px-2 text-xs" onClick={() => setF(x)}>{x}</Button>)}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rows.length === 0 ? <p className="text-sm text-muted-foreground">No employers.</p> : rows.map((e) => {
          const eJobs = jobs.filter((j) => j.employer_id === e.id);
          return (
            <div key={e.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{e.name}</p>
                <Badge className={`text-[9px] border ${STATUS[e.relationship_status]}`}>{e.relationship_status}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{e.industry} · {e.region}</p>
              <div className="flex flex-wrap gap-1 mt-1">{e.demand_roles?.map((r) => <Badge key={r} variant="outline" className="text-[9px]">{r}</Badge>)}</div>
              <p className="text-[10px] text-muted-foreground mt-1">{e.open_reqs} open req(s){e.satisfaction ? ` · satisfaction ${e.satisfaction}` : ''}{eJobs.length ? ` · ${eJobs.length} job(s)` : ''}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default EmployersPanel;
