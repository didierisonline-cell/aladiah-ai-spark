import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, DatabaseZap, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  BRAIN_CATEGORIES,
  BrainCategory,
  BrainEntry,
  getBrainCounts,
  listBrain,
  recordDecision,
} from '@/services/aos/brain';
import { syncGovernanceToBrain } from '@/services/aos/governance';
import { syncGenomesToBrain } from '@/services/aos/institutionalRegistry';

const when = (iso: string) => {
  try { return new Date(iso).toLocaleDateString(); } catch { return ''; }
};

/**
 * Company Brain — institutional memory. Founder decisions, architecture
 * decisions, standards, the translation dictionary, design decisions, and
 * launch-readiness history, durable and queryable by every agent.
 */
const CompanyBrainPanel = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<BrainEntry[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<BrainCategory | 'all'>('all');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BrainCategory>('founder-decision');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    const [list, c] = await Promise.all([
      listBrain(filter === 'all' ? undefined : filter, 30),
      getBrainCounts(),
    ]);
    setEntries(list);
    setCounts(c);
  }, [filter]);

  useEffect(() => { refresh(); }, [refresh]);

  const save = useCallback(async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const e = await recordDecision({ category, content: content.trim(), recordedBy: 'founder' });
      toast({
        title: e ? 'Recorded in the Company Brain' : 'Could not record',
        description: e ? BRAIN_CATEGORIES.find((c) => c.key === category)?.label : 'Check admin access / AOS migrations.',
        variant: e ? 'default' : 'destructive',
      });
      if (e) setContent('');
    } finally {
      setSaving(false);
      refresh();
    }
  }, [content, category, toast, refresh]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" /> Company Brain
        </CardTitle>
        <p className="text-[12px] text-muted-foreground">
          Institutional memory — decisions and standards every agent consults before acting.
        </p>
        <Button
          variant="outline" size="sm" className="w-fit"
          disabled={syncing}
          onClick={async () => {
            setSyncing(true);
            try {
              const [gov, gen] = await Promise.all([syncGovernanceToBrain(), syncGenomesToBrain()]);
              toast({
                title: 'Institution → Brain sync complete',
                description: `${gov.synced + gen.synced} object(s) mirrored, ${gov.skipped + gen.skipped} already current (governance ${gov.synced}/${gov.synced + gov.skipped}, genomes ${gen.synced}/${gen.synced + gen.skipped}).`,
              });
              refresh();
            } finally {
              setSyncing(false);
            }
          }}
        >
          <DatabaseZap className={`w-3.5 h-3.5 mr-1.5 ${syncing ? 'animate-pulse' : ''}`} />
          {syncing ? 'Mirroring the Institution…' : 'Sync Institution → Brain'}
        </Button>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Record */}
        <div className="space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Record a decision or standard (e.g. “Quiz options never carry A)/B) prefixes — the UI adds them.”)"
            aria-label="Decision to record"
            rows={2}
          />
          <div className="flex gap-2">
            <Select value={category} onValueChange={(v) => setCategory(v as BrainCategory)}>
              <SelectTrigger className="flex-1" aria-label="Decision category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {BRAIN_CATEGORIES.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={save} disabled={saving || !content.trim()}>
              <Plus className="w-4 h-4 mr-1" /> Record
            </Button>
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="All" count={Object.values(counts).reduce((a, b) => a + b, 0)} />
          {BRAIN_CATEGORIES.map((c) => (
            <FilterChip
              key={c.key}
              active={filter === c.key}
              onClick={() => setFilter(c.key)}
              label={c.label}
              count={counts[c.key] ?? 0}
            />
          ))}
        </div>

        {/* Entries */}
        {entries.length === 0 ? (
          <p className="text-[12px] text-muted-foreground text-center py-4">
            Nothing recorded {filter === 'all' ? 'yet' : 'in this category yet'}. Decisions recorded here persist across every agent run.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {entries.map((e) => (
              <div key={e.id} className="rounded-lg bg-muted/30 px-3 py-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="outline" className="text-[9px]">
                    {BRAIN_CATEGORIES.find((c) => c.key === e.category)?.label ?? e.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{when(e.createdAt)} · {e.recordedBy}</span>
                </div>
                <p className="text-[12px] text-foreground">{e.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const FilterChip = ({
  active, onClick, label, count,
}: { active: boolean; onClick: () => void; label: string; count: number }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium transition-colors ${
      active ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
    }`}
  >
    {label}
    <span className="opacity-75">{count}</span>
  </button>
);

export default CompanyBrainPanel;
