import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';
import { ENGINES } from '@/services/agents/product/engines';
import { ProductStats } from '@/types/product';

const OUTCOME_LABEL: Record<string, string> = {
  employment: 'Employment',
  promotion: 'Promotion',
  salary_growth: 'Salary Growth',
  leadership_readiness: 'Leadership',
  ai_readiness: 'AI Readiness',
  competency_mastery: 'Mastery',
};

const EnginesPanel = ({ byEngine }: { byEngine: ProductStats['byEngine'] }) => {
  const counts = new Map(byEngine.map((e) => [e.engine, e.count]));
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        The Product Builder is a <span className="font-medium text-foreground">Career Transformation Factory</span> of
        ten engines that optimize for employment, promotion, salary growth, leadership readiness, AI readiness, and
        competency mastery — not course completion.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ENGINES.map((e, i) => (
          <Card key={e.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                {i + 1}. {e.name}
                <Badge variant="secondary" className="ml-auto text-[10px]">{counts.get(e.id) ?? 0} artifacts</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px]">
              <p className="text-muted-foreground">{e.purpose}</p>
              <Field label="Inputs" items={e.inputs} />
              <Field label="Outputs" items={e.outputs} />
              <Field label="Quality" items={e.qualityStandards} />
              <Field label="KPIs" items={e.kpis} />
              <div>
                <span className="font-medium">Optimizes: </span>
                {e.targetOutcomes.map((o) => (
                  <Badge key={o} variant="outline" className="text-[9px] mr-1">{OUTCOME_LABEL[o] ?? o}</Badge>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground italic">Approval: {e.approval}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Field = ({ label, items }: { label: string; items: string[] }) => (
  <p>
    <span className="font-medium">{label}: </span>
    <span className="text-muted-foreground">{items.join(' · ')}</span>
  </p>
);

export default EnginesPanel;
