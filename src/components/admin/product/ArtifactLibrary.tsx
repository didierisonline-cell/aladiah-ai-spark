import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArtifactStatus, ArtifactType, ProductArtifact } from '@/types/product';

const STATUS_STYLES: Record<ArtifactStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  pending_approval: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const TYPES: (ArtifactType | 'all')[] = ['all', 'module', 'quiz', 'simulation', 'lab', 'project', 'learning_path'];

const ArtifactLibrary = ({ artifacts }: { artifacts: ProductArtifact[] }) => {
  const [type, setType] = useState<ArtifactType | 'all'>('all');
  const rows = type === 'all' ? artifacts : artifacts.filter((a) => a.artifact_type === type);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Artifact Library</CardTitle>
        <div className="flex flex-wrap gap-1 pt-2">
          {TYPES.map((t) => (
            <Button key={t} size="sm" variant={type === t ? 'default' : 'outline'} className="h-7 px-2 text-xs" onClick={() => setType(t)}>
              {t.replace(/_/g, ' ')}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[560px] overflow-y-auto">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No artifacts yet.</p>
        ) : (
          rows.map((a) => (
            <div key={a.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {a.artifact_type.replace(/_/g, ' ')} · {a.program} · quality {a.quality_score ?? '—'}
                    {a.competencies?.length ? ` · ${a.competencies.join(', ')}` : ''}
                  </p>
                </div>
                <Badge className={`text-[9px] border shrink-0 ${STATUS_STYLES[a.status]}`}>
                  {a.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              {a.summary && <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{a.summary}</p>}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ArtifactLibrary;
