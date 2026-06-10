import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BarChart3, Lightbulb } from 'lucide-react';
import { ProductGap, ProductRecommendation, ProductStats } from '@/types/product';

const COVER_COLOR: Record<string, string> = {
  covered: 'bg-green-500',
  weak: 'bg-amber-500',
  missing: 'bg-red-500',
};
const SEV: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

interface Props {
  coverage: ProductStats['coverage'];
  gaps: ProductGap[];
  recommendations: ProductRecommendation[];
}

const CoverageGapsPanel = ({ coverage, gaps, recommendations }: Props) => {
  const maxQ = Math.max(3, ...coverage.map((c) => c.questions));
  const openGaps = gaps.filter((g) => g.status === 'open');
  const pendingRecs = recommendations.filter((r) => r.status === 'pending');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Competency Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {coverage.length === 0 ? (
            <p className="text-sm text-muted-foreground">No coverage data.</p>
          ) : (
            coverage.map((c) => (
              <div key={c.competency}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-foreground">{c.label}</span>
                  <span className="text-muted-foreground">{c.questions}q · {c.status}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className={`h-1.5 rounded-full ${COVER_COLOR[c.status]}`} style={{ width: `${(c.questions / maxQ) * 100}%` }} />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" /> Curriculum Gaps
            <Badge variant="secondary" className="text-xs">{openGaps.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[420px] overflow-y-auto">
          {openGaps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open gaps.</p>
          ) : (
            openGaps.map((g) => (
              <div key={g.id} className="rounded-lg border border-border/60 p-2.5 bg-muted/20">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-foreground">{g.competency}</p>
                  <Badge className={`text-[9px] border shrink-0 ${SEV[g.severity]}`}>{g.severity}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{g.description}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" /> Recommendations
            <Badge variant="secondary" className="text-xs">{pendingRecs.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[420px] overflow-y-auto">
          {pendingRecs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending recommendations.</p>
          ) : (
            pendingRecs.map((r) => (
              <div key={r.id} className="rounded-lg border border-border/60 p-2.5 bg-muted/20">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-foreground">{r.title}</p>
                  <Badge variant="outline" className="text-[9px] shrink-0">{r.rec_type.replace(/_/g, ' ')}</Badge>
                </div>
                {r.rationale && <p className="text-[11px] text-muted-foreground">{r.rationale}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverageGapsPanel;
