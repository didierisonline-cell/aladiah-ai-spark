import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';
import { SeoCluster } from '@/types/seo';

const ClusterPanel = ({ clusters }: { clusters: SeoCluster[] }) => {
  return (
    <div className="space-y-4">
      {clusters.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No topic clusters yet.
          </CardContent>
        </Card>
      ) : (
        clusters.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" />
                {c.name}
                <Badge variant="secondary" className="text-[10px]">{c.pillar_status}</Badge>
                {c.category && <Badge variant="outline" className="text-[10px]">{c.category}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{c.description}</p>
              <div>
                <p className="text-xs font-semibold mb-1">Pillar: <span className="text-primary">{c.pillar_keyword}</span></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {c.supporting_topics?.map((t, i) => (
                    <div key={i} className="rounded-lg border border-border/60 p-2 bg-muted/20">
                      <p className="text-xs font-medium text-foreground">{t.topic}</p>
                      <p className="text-[10px] text-muted-foreground">kw: {t.keyword} · {t.status}</p>
                    </div>
                  ))}
                </div>
              </div>
              {c.internal_links?.length > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  {c.internal_links.length} internal-link recommendation(s) back to the pillar.
                </p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ClusterPanel;
