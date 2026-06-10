import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Check, Pencil, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketingContent } from '@/types/marketing';
import { approveContent, editContent, rejectContent } from '@/services/agents/marketingContentAgent';

interface Props {
  items: MarketingContent[];
  onChange: () => void;
}

const ApprovalQueue = ({ items, onChange }: Props) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ title: string; body: string; cta: string }>({
    title: '',
    body: '',
    cta: '',
  });
  const [busy, setBusy] = useState<string | null>(null);

  const startEdit = (c: MarketingContent) => {
    setEditingId(c.id);
    setDraft({ title: c.title || '', body: c.body || '', cta: c.cta || '' });
  };

  const act = async (fn: () => Promise<boolean>, label: string, id: string) => {
    setBusy(id);
    const ok = await fn();
    setBusy(null);
    toast({
      title: ok ? `Content ${label}` : `Failed to ${label}`,
      variant: ok ? 'default' : 'destructive',
    });
    if (ok) {
      setEditingId(null);
      onChange();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          Approval Queue
          <Badge variant="secondary" className="text-xs">
            {items.length}
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Nothing publishes automatically — approve, edit, or reject each asset.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[640px] overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Nothing pending. Generate content to populate the queue.
          </p>
        ) : (
          items.map((c) => (
            <div key={c.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[11px] text-muted-foreground">
                  {c.platform} · {c.content_type.replace(/_/g, ' ')}
                  {c.theme ? ` · ${c.theme}` : ''}
                </p>
                <Badge className="text-[9px] bg-amber-100 text-amber-700 border border-amber-200">
                  pending
                </Badge>
              </div>

              {editingId === c.id ? (
                <div className="space-y-2">
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="Title"
                  />
                  <Textarea
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                    rows={6}
                    placeholder="Body"
                  />
                  <Input
                    value={draft.cta}
                    onChange={(e) => setDraft({ ...draft, cta: e.target.value })}
                    placeholder="Call to action"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={busy === c.id}
                      onClick={() => act(() => editContent(c.id, draft, true), 'edited & approved', c.id)}
                    >
                      <Check className="w-3 h-3 mr-1" /> Save & Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === c.id}
                      onClick={() => act(() => editContent(c.id, draft, false), 'saved', c.id)}
                    >
                      Save draft
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">{c.title}</p>
                  {c.hook && <p className="text-xs italic text-foreground/80 mt-0.5">{c.hook}</p>}
                  {c.body && (
                    <p className="text-[11px] text-muted-foreground mt-1 whitespace-pre-line line-clamp-4">
                      {c.body}
                    </p>
                  )}
                  {c.cta && <p className="text-[11px] text-primary mt-1">{c.cta}</p>}
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      disabled={busy === c.id}
                      onClick={() => act(() => approveContent(c.id), 'approved', c.id)}
                    >
                      <Check className="w-3 h-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)}>
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      disabled={busy === c.id}
                      onClick={() => act(() => rejectContent(c.id), 'rejected', c.id)}
                    >
                      <X className="w-3 h-3 mr-1" /> Reject
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalQueue;
