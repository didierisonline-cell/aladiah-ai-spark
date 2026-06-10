import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { SeoPriority, SeoRecommendation } from '@/types/seo';

const PRIORITY: Record<SeoPriority, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

interface Props {
  recommendations: SeoRecommendation[];
  requests: any[];
  delegatingId: string | null;
  onDelegate: (rec: SeoRecommendation) => void;
}

const RecommendationsPanel = ({ recommendations, requests, delegatingId, onDelegate }: Props) => {
  const pending = recommendations.filter((r) => r.status === 'pending');
  const delegated = recommendations.filter((r) => r.status !== 'pending');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            SEO Recommendations
            <Badge variant="secondary" className="ml-2 text-xs">{pending.length} pending</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[520px] overflow-y-auto">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending recommendations.</p>
          ) : (
            pending.map((r) => (
              <div key={r.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <Badge className={`text-[9px] border shrink-0 ${PRIORITY[r.priority]}`}>{r.priority}</Badge>
                </div>
                {r.rationale && <p className="text-[11px] text-muted-foreground mt-1">{r.rationale}</p>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">{r.rec_type.replace(/_/g, ' ')}</span>
                  {r.target_keyword && (
                    <Button
                      size="sm"
                      className="h-7 px-2"
                      disabled={delegatingId === r.id}
                      onClick={() => onDelegate(r)}
                    >
                      <Send className={`w-3 h-3 mr-1 ${delegatingId === r.id ? 'animate-pulse' : ''}`} />
                      Delegate to Marketing
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
          {delegated.length > 0 && (
            <p className="text-[11px] text-muted-foreground pt-2">{delegated.length} already delegated/closed.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Marketing Requests Generated
            <Badge variant="secondary" className="ml-2 text-xs">{requests.length}</Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground">Tasks delegated to the Marketing Agent via the AOS Task Manager.</p>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[520px] overflow-y-auto">
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No content requests yet.</p>
          ) : (
            requests.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 bg-muted/20">
                <div>
                  <p className="text-xs font-medium text-foreground">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground">→ {t.assigned_agent} · {(t.payload?.kind || '').replace(/_/g, ' ')}</p>
                </div>
                <Badge variant="outline" className="text-[9px]">{t.status}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsPanel;
