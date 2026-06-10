import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Gauge, ShieldCheck } from 'lucide-react';
import { QA_ENGINES } from '@/services/agents/qa/engines';
import { BENCHMARK_AUTHORITIES } from '@/services/agents/qa/benchmarks';

const VALIDATIONS = [
  'GitHub portfolio', 'Interview readiness', 'Market demand',
  'Salary relevance', 'AI readiness', 'Employer alignment',
];

const QAFrameworkPanel = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Gauge className="w-4 h-4 text-primary" /> 13 Quality Engines
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QA_ENGINES.map((e, i) => (
          <div key={e.id} className="rounded-lg border border-border/60 p-2 bg-muted/20">
            <p className="text-xs font-medium text-foreground">
              {i + 1}. {e.name}
              {e.critical && <Badge variant="outline" className="ml-1 text-[8px] px-1 py-0">critical</Badge>}
            </p>
            <p className="text-[10px] text-muted-foreground">{e.purpose}</p>
          </div>
        ))}
      </CardContent>
    </Card>

    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> 12 Benchmark Authorities
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {BENCHMARK_AUTHORITIES.map((b) => (
            <Badge key={b.id} variant="secondary" className="text-[10px]">{b.name}</Badge>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> 6 Employability Validations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {VALIDATIONS.map((v) => (
            <Badge key={v} variant="outline" className="text-[10px]">{v}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default QAFrameworkPanel;
