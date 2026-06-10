import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';
import { PLACEMENT_AREAS } from '@/services/agents/placement/engines';

const PlacementAreasPanel = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    {PLACEMENT_AREAS.map((a, i) => (
      <Card key={a.id}>
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> {i + 1}. {a.name}{a.id === 'placement_tracking' && <Badge className="text-[8px] bg-primary text-primary-foreground">PRIMARY</Badge>}</CardTitle></CardHeader>
        <CardContent className="text-[11px] space-y-1">
          <p className="text-muted-foreground">{a.purpose}</p>
          <p><span className="font-medium">KPI:</span> <span className="text-muted-foreground">{a.kpi}</span></p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default PlacementAreasPanel;
