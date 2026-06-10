import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { AgentRisk, Severity } from '@/types/agentReports';

const SEVERITY_STYLES: Record<Severity, string> = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

interface RiskRadarProps {
  risks: AgentRisk[];
}

/** Severity-ranked list of risks surfaced in the report (section 7). */
const RiskRadar = ({ risks }: RiskRadarProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Risk Radar
          {risks.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {risks.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {risks.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            No material risks surfaced from available data.
          </div>
        ) : (
          <ul className="space-y-3">
            {risks.map((r, i) => (
              <li
                key={i}
                className="rounded-lg border border-border/60 p-3 bg-muted/20"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{r.risk}</p>
                  <Badge className={`text-[10px] border shrink-0 ${SEVERITY_STYLES[r.severity]}`}>
                    {r.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground capitalize mb-1">
                  Area: {r.category?.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-foreground/80">
                  <span className="font-medium">Response: </span>
                  {r.recommended_response}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskRadar;
