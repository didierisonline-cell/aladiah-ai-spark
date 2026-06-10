import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, ChevronDown, ChevronUp, Pencil, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductArtifact, QualityReport } from '@/types/product';
import { approveArtifact, editArtifact, rejectArtifact } from '@/services/agents/productBuilderAgent';
import QualityChecklist from './QualityChecklist';

interface Props {
  items: ProductArtifact[];
  onChange: () => void;
}

const ProductApprovalQueue = ({ items, onChange }: Props) => {
  const { toast } = useToast();
  const [openId, setOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: '', summary: '' });
  const [busy, setBusy] = useState<string | null>(null);

  const act = async (fn: () => Promise<boolean>, label: string, id: string) => {
    setBusy(id);
    const ok = await fn();
    setBusy(null);
    toast({ title: ok ? `Artifact ${label}` : `Failed to ${label}`, variant: ok ? 'default' : 'destructive' });
    if (ok) { setEditId(null); onChange(); }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          Founder Approval Queue
          <Badge variant="secondary" className="text-xs">{items.length}</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Only artifacts that passed the Aladiah Quality Standard <span className="font-medium">and QA review</span>
          {' '}appear here. Nothing publishes — approving marks it ready; promotion to the live curriculum is a separate
          manual step.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[640px] overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Nothing awaiting approval. Run an overnight improvement to populate the queue.
          </p>
        ) : (
          items.map((a) => {
            const report = (a.metadata as any)?.quality_report as QualityReport | undefined;
            const expanded = openId === a.id;
            return (
              <div key={a.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[11px] text-muted-foreground capitalize">
                    {a.artifact_type} · {a.program} · {a.competencies?.join(', ')}
                  </p>
                  <Badge variant="outline" className="text-[9px]">quality {a.quality_score}</Badge>
                </div>

                {editId === a.id ? (
                  <div className="space-y-2">
                    <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" />
                    <Textarea value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} rows={3} placeholder="Summary" />
                    <div className="flex gap-2">
                      <Button size="sm" disabled={busy === a.id} onClick={() => act(() => editArtifact(a.id, draft, true), 'edited & approved', a.id)}>
                        <Check className="w-3 h-3 mr-1" /> Save & Approve
                      </Button>
                      <Button size="sm" variant="outline" disabled={busy === a.id} onClick={() => act(() => editArtifact(a.id, draft, false), 'saved', a.id)}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    {a.summary && <p className="text-[11px] text-muted-foreground mt-0.5">{a.summary}</p>}

                    <button
                      className="text-[11px] text-primary mt-1 flex items-center gap-0.5"
                      onClick={() => setOpenId(expanded ? null : a.id)}
                    >
                      {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      Quality report + content
                    </button>
                    {expanded && (
                      <>
                        <QualityChecklist report={report} />
                        <pre className="text-[10px] bg-background/60 rounded p-2 mt-2 max-h-48 overflow-auto whitespace-pre-wrap">
                          {JSON.stringify(a.payload, null, 2)}
                        </pre>
                      </>
                    )}

                    <div className="flex gap-2 mt-2">
                      <Button size="sm" disabled={busy === a.id} onClick={() => act(() => approveArtifact(a.id), 'approved', a.id)}>
                        <Check className="w-3 h-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditId(a.id); setDraft({ title: a.title, summary: a.summary || '' }); }}>
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600" disabled={busy === a.id} onClick={() => act(() => rejectArtifact(a.id), 'rejected', a.id)}>
                        <X className="w-3 h-3 mr-1" /> Reject
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ProductApprovalQueue;
