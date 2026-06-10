import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QualityReport } from '@/types/product';

/** Renders an artifact's Aladiah Quality Standard result. */
const QualityChecklist = ({ report }: { report?: QualityReport | null }) => {
  if (!report) return <p className="text-[11px] text-muted-foreground">No quality report.</p>;
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5 mt-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium">
          Aladiah Quality Standard{' '}
          <span className={report.passed ? 'text-green-600' : 'text-amber-600'}>
            ({report.passed ? 'PASSED' : 'HELD'} · {report.score}/100)
          </span>
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5">
        {report.checks.map((c) => (
          <div key={c.key} className="flex items-start gap-1 text-[10px]" title={c.note}>
            {c.passed ? (
              <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
            )}
            <span className={c.passed ? 'text-muted-foreground' : 'text-red-600 font-medium'}>
              {c.label}
              {c.critical && <Badge variant="outline" className="ml-1 text-[8px] px-1 py-0">critical</Badge>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualityChecklist;
