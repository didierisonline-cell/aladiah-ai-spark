import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QAReview, QAVerdict } from '@/types/qa';

const VERDICT: Record<QAVerdict, string> = {
  pass: 'bg-green-100 text-green-700 border-green-200',
  conditional: 'bg-amber-100 text-amber-700 border-amber-200',
  fail: 'bg-red-100 text-red-700 border-red-200',
};

const ReviewsFeed = ({ reviews }: { reviews: QAReview[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">QA Reviews</CardTitle>
        <p className="text-xs text-muted-foreground">
          The QA Authority's verdicts. Only <span className="text-green-600 font-medium">pass</span> reaches the Founder
          Approval Queue.
        </p>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[620px] overflow-y-auto">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No reviews yet — run QA review.</p>
        ) : (
          reviews.map((r) => {
            const vals = Object.values(r.validations || {});
            return (
              <div key={r.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-medium text-foreground capitalize">
                    {r.artifact_type?.replace(/_/g, ' ')}
                    {r.engine ? ` · ${r.engine}` : ''}
                  </p>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-[9px]">score {r.overall_score}</Badge>
                    <Badge className={`text-[9px] border ${VERDICT[r.verdict]}`}>{r.verdict}</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                  {vals.map((v: any) => (
                    <span key={v.key} className="flex items-center gap-1 text-[10px]" title={v.note}>
                      {v.passed ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-red-500" />}
                      <span className={v.passed ? 'text-muted-foreground' : 'text-red-600'}>{v.key.replace(/_/g, ' ')}</span>
                    </span>
                  ))}
                </div>
                {r.findings?.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {r.findings.slice(0, 4).map((f, i) => (
                      <li key={i} className="text-[10px] text-muted-foreground">
                        <span className={`font-semibold uppercase ${f.severity === 'high' ? 'text-red-600' : 'text-amber-600'}`}>{f.severity}</span>{' '}
                        {f.area} — {f.note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsFeed;
