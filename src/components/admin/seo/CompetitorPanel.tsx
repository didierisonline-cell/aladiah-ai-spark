import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Swords } from 'lucide-react';
import { SeoCompetitor } from '@/types/seo';

const CompetitorPanel = ({ competitors }: { competitors: SeoCompetitor[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Swords className="w-4 h-4 text-primary" />
          Competitor Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {competitors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No competitors tracked yet.</p>
        ) : (
          competitors.map((c) => (
            <div key={c.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                {c.domain && <span className="text-[10px] text-muted-foreground">{c.domain}</span>}
              </div>
              {c.focus_areas?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.focus_areas.map((f) => (
                    <Badge key={f} variant="outline" className="text-[9px]">{f}</Badge>
                  ))}
                </div>
              )}
              {c.strengths?.length > 0 && (
                <p className="text-[11px] text-muted-foreground mt-1">Strengths: {c.strengths.join(', ')}</p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorPanel;
