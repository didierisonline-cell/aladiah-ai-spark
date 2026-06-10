import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentStatus, MarketingContent, Platform } from '@/types/marketing';

const STATUS_STYLES: Record<ContentStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  queued: 'bg-blue-100 text-blue-700 border-blue-200',
  pending_approval: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  scheduled: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const PLATFORMS: (Platform | 'all')[] = [
  'all', 'linkedin', 'facebook', 'instagram', 'blog', 'email', 'youtube', 'webinar', 'lead_magnet',
];

const ContentLibrary = ({ content }: { content: MarketingContent[] }) => {
  const [platform, setPlatform] = useState<Platform | 'all'>('all');
  const filtered = platform === 'all' ? content : content.filter((c) => c.platform === platform);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Content Library</CardTitle>
        <div className="flex flex-wrap gap-1 pt-2">
          {PLATFORMS.map((p) => (
            <Button
              key={p}
              size="sm"
              variant={platform === p ? 'default' : 'outline'}
              className="h-7 px-2 text-xs"
              onClick={() => setPlatform(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[560px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No content yet.</p>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.title || '(untitled)'}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {c.platform} · {c.content_type.replace(/_/g, ' ')}
                    {c.theme ? ` · ${c.theme}` : ''}
                  </p>
                </div>
                <Badge className={`text-[10px] border shrink-0 ${STATUS_STYLES[c.status]}`}>
                  {c.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              {c.hook && <p className="text-xs text-foreground/80 mt-1 italic">{c.hook}</p>}
              {c.body && (
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-3 whitespace-pre-line">
                  {c.body}
                </p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ContentLibrary;
