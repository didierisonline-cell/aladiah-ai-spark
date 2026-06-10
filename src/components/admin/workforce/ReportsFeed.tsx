import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import { WorkforceReport } from '@/services/aos/workforce';

const URGENCY: Record<string, string> = {
  normal: 'bg-green-100 text-green-700 border-green-200',
  elevated: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const ReportsFeed = ({ reports }: { reports: WorkforceReport[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Agent Reports
          </CardTitle>
          <Button asChild size="sm" variant="outline" className="h-7">
            <Link to="/admin/command-center">
              Command Center <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[560px] overflow-y-auto">
        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No reports yet. Run the CEO agent to generate a daily command report.
          </p>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-foreground">{r.agent_name}</span>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px]">{r.report_date}</Badge>
                  {r.urgency_level && (
                    <Badge className={`text-[9px] border ${URGENCY[r.urgency_level] || ''}`}>
                      {r.urgency_level}
                    </Badge>
                  )}
                </div>
              </div>
              {r.summary && (
                <p className="text-[11px] text-muted-foreground line-clamp-3">{r.summary}</p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsFeed;
