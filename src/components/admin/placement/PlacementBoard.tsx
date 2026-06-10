import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Candidate, MatchStage, PlacementMatch } from '@/types/placement';

const STAGES: { key: MatchStage; label: string }[] = [
  { key: 'matched', label: 'Matched' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'placed', label: 'Placed' },
];

const PlacementBoard = ({ matches, candidates }: { matches: PlacementMatch[]; candidates: Candidate[] }) => {
  const nameFor = (id: string) => candidates.find((c) => c.id === id)?.name ?? 'Candidate';
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base">Placement Pipeline</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {STAGES.map((st) => {
            const items = matches.filter((m) => m.stage === st.key);
            return (
              <div key={st.key} className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">{st.label}<Badge variant="secondary" className="text-[10px]">{items.length}</Badge></p>
                {items.length === 0 ? <p className="text-[11px] text-muted-foreground/60 italic">none</p> : items.map((m) => (
                  <div key={m.id} className="rounded-lg border border-border/60 p-2 bg-muted/20">
                    <p className="text-xs font-medium text-foreground">{nameFor(m.candidate_id)}</p>
                    <p className="text-[10px] text-muted-foreground">match {m.match_score}{m.offer_amount ? ` · offer ${m.offer_amount}` : ''}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlacementBoard;
