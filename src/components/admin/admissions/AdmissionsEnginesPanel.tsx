import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'lucide-react';
import { ADMISSIONS_ENGINES } from '@/services/agents/admissions/engines';

const Field = ({ label, items }: { label: string; items: string[] }) => (
  <p><span className="font-medium">{label}: </span><span className="text-muted-foreground">{items.join(' · ')}</span></p>
);

const AdmissionsEnginesPanel = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {ADMISSIONS_ENGINES.map((e, i) => (
      <Card key={e.id}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> {i + 1}. {e.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-[11px]">
          <p className="text-muted-foreground">{e.purpose}</p>
          <Field label="Inputs" items={e.inputs} />
          <Field label="Outputs" items={e.outputs} />
          <Field label="Quality" items={e.qualityStandards} />
          <Field label="KPIs" items={e.kpis} />
          <p className="text-[10px] text-muted-foreground italic">Approval: {e.approval}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default AdmissionsEnginesPanel;
