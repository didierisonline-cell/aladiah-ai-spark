import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSearch } from 'lucide-react';
import { SeoAudit } from '@/types/seo';

const sevColor: Record<string, string> = {
  high: 'text-red-600',
  medium: 'text-amber-600',
  low: 'text-slate-500',
};
const scoreColor = (s: number | null) =>
  s == null ? 'text-slate-500' : s >= 85 ? 'text-green-600' : s >= 70 ? 'text-amber-600' : 'text-red-600';

const AuditPanel = ({ audits }: { audits: SeoAudit[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-primary" />
          SEO Audits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {audits.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audits yet — run a site audit.</p>
        ) : (
          audits.map((a) => (
            <div key={a.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground font-mono">{a.page_path}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${scoreColor(a.score)}`}>{a.score ?? '—'}</span>
                  <Badge variant={a.status === 'open' ? 'secondary' : 'outline'} className="text-[10px]">
                    {a.status}
                  </Badge>
                </div>
              </div>
              <ul className="mt-2 space-y-0.5">
                {a.issues?.map((iss, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground">
                    <span className={`font-semibold uppercase ${sevColor[iss.severity]}`}>{iss.severity}</span>{' '}
                    <span className="text-foreground/80">{iss.type}</span> — {iss.detail}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AuditPanel;
