import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';
import { ALADIAH_QUALITY_STANDARDS } from '@/services/agents/product/quality';

/** Static reference card for the Aladiah Quality Standard gate. */
const QualityStandardCard = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary" />
        Aladiah Quality Standard
      </CardTitle>
      <p className="text-xs text-muted-foreground">
        Every generated artifact must clear all <span className="font-medium">critical</span> standards before it can
        enter the Founder Approval Queue. Nothing is ever auto-published.
      </p>
    </CardHeader>
    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {ALADIAH_QUALITY_STANDARDS.map((s, i) => (
        <div key={s.key} className="flex items-start gap-2 rounded-lg border border-border/60 p-2 bg-muted/20">
          <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">{i + 1}.</span>
          <div>
            <p className="text-xs font-medium text-foreground">
              {s.label}
              {s.critical && <Badge variant="outline" className="ml-1 text-[8px] px-1 py-0">critical</Badge>}
            </p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default QualityStandardCard;
