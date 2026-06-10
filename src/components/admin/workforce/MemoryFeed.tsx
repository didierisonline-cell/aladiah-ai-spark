import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { AgentMemory, MemoryType } from '@/types/aos';

const TYPE_STYLES: Record<MemoryType, string> = {
  short_term: 'bg-blue-100 text-blue-700 border-blue-200',
  long_term: 'bg-green-100 text-green-700 border-green-200',
  episodic: 'bg-slate-100 text-slate-600 border-slate-200',
};

const MemoryFeed = ({ memories }: { memories: AgentMemory[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          Agent Memory
          <Badge variant="secondary" className="text-xs">{memories.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[560px] overflow-y-auto">
        {memories.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No memories recorded yet.</p>
        ) : (
          memories.map((m) => (
            <div key={m.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-foreground">{m.agent_slug}</span>
                <div className="flex items-center gap-1">
                  <Badge className={`text-[9px] border ${TYPE_STYLES[m.memory_type]}`}>
                    {m.memory_type.replace('_', ' ')}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {(m.importance * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-foreground/80">{m.summary || m.content}</p>
              {m.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {m.tags.slice(0, 6).map((t) => (
                    <span key={t} className="text-[9px] text-muted-foreground bg-muted px-1 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryFeed;
