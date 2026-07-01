import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, ClipboardList, Plus, RefreshCw, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  GateKey,
  WorkOrder,
  WorkOrderType,
  listWorkOrders,
  nextPendingGate,
} from '@/services/aos/workOrders';
import { founderDecision, openWorkOrder, recordGateOutcome, GATE_REVIEWERS } from '@/services/aos/orchestration';

const GATE_LABEL: Record<GateKey, string> = { qa: 'QA', security: 'Security', translation: 'Translation', ux: 'UX' };

const gateColor = (s: WorkOrder['gates'][GateKey]) =>
  s === 'passed' ? '#22c55e' : s === 'failed' ? '#ef4444' : s === 'not_required' ? '#334155' : '#f59e0b';

const TYPE_OPTIONS: WorkOrderType[] = [
  'content', 'curriculum', 'platform', 'marketing', 'security', 'localization', 'design', 'deployment', 'recommendation',
];

const OWNER_OPTIONS = [
  'product-builder', 'marketing-content', 'seo-strategy', 'curriculum-excellence',
  'admissions-authority', 'student-success', 'placement-authority', 'operations-platform',
  'interface-experience', 'ceo-chief-of-staff',
];

/**
 * Work Order System — the shared unit of cross-agent work. Orders flow
 * draft → review gates (QA / Security / Translation / UX) → founder approval.
 * Approving here RECORDS the decision; execution stays behind each agent's
 * own founder-gated surface. Nothing publishes or deploys from this board.
 */
const WorkOrderBoard = ({ onChange }: { onChange?: () => void }) => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<WorkOrderType>('content');
  const [owner, setOwner] = useState(OWNER_OPTIONS[0]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await listWorkOrders(100));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const wo = await openWorkOrder({ title: title.trim(), type, ownerAgent: owner, createdByAgent: 'human' });
      toast({
        title: wo ? 'Work order opened' : 'Could not open work order',
        description: wo ? `Routed to its first review gate.` : 'Check admin access / AOS migrations.',
        variant: wo ? 'default' : 'destructive',
      });
      setTitle('');
    } finally {
      setCreating(false);
      refresh();
      onChange?.();
    }
  }, [title, type, owner, toast, refresh, onChange]);

  const gate = useCallback(async (wo: WorkOrder, g: GateKey, passed: boolean) => {
    setBusy(wo.id);
    try {
      await recordGateOutcome(wo, g, passed, 'founder');
      toast({ title: `${GATE_LABEL[g]} gate ${passed ? 'passed' : 'failed'}`, description: wo.title });
    } finally {
      setBusy(null);
      refresh();
      onChange?.();
    }
  }, [toast, refresh, onChange]);

  const decide = useCallback(async (wo: WorkOrder, approved: boolean) => {
    setBusy(wo.id);
    try {
      await founderDecision(wo, approved);
      toast({
        title: `Work order ${approved ? 'approved' : 'rejected'}`,
        description: approved
          ? 'Decision recorded. Execution stays behind the owning agent’s gated surface.'
          : wo.title,
      });
    } finally {
      setBusy(null);
      refresh();
      onChange?.();
    }
  }, [toast, refresh, onChange]);

  const open = orders.filter((o) => !['completed', 'cancelled'].includes(o.status));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" /> Work Orders
          </span>
          <Button variant="ghost" size="sm" onClick={refresh} disabled={loading} aria-label="Refresh work orders">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <p className="text-[12px] text-muted-foreground">
          Draft → QA → Security → Translation → UX → Founder approval. Approval records the decision — it never auto-publishes.
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Create */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New work order title…"
            aria-label="Work order title"
            className="flex-1"
          />
          <div className="flex gap-2">
            <Select value={type} onValueChange={(v) => setType(v as WorkOrderType)}>
              <SelectTrigger className="w-[130px]" aria-label="Work order type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger className="w-[170px]" aria-label="Owner agent"><SelectValue /></SelectTrigger>
              <SelectContent>
                {OWNER_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={create} disabled={creating || !title.trim()}>
              <Plus className="w-4 h-4 mr-1" /> Open
            </Button>
          </div>
        </div>

        {/* List */}
        {open.length === 0 ? (
          <p className="text-[12px] text-muted-foreground text-center py-6">
            {loading ? 'Loading work orders…' : 'No open work orders. Agents (or you) open orders; they flow through the gates to your approval.'}
          </p>
        ) : (
          <div className="space-y-2">
            {open.map((o) => {
              const next = nextPendingGate(o);
              return (
                <div key={o.id} className="rounded-lg border border-border/60 p-3 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{o.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {o.type} · owner {o.ownerAgent ?? '—'}
                        {o.collaborators.length > 0 && ` · with ${o.collaborators.join(', ')}`}
                        {' · '}priority {o.priority}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] capitalize shrink-0">{o.status.replace('_', ' ')}</Badge>
                  </div>

                  {/* Gate chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(Object.keys(GATE_LABEL) as GateKey[]).map((g) => (
                      <span
                        key={g}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border"
                        style={{ color: gateColor(o.gates[g]), borderColor: `${gateColor(o.gates[g])}55` }}
                        title={`${GATE_LABEL[g]}: ${o.gates[g].replace('_', ' ')} — review on ${GATE_REVIEWERS[g].surface}`}
                      >
                        {o.gates[g] === 'passed' ? <CheckCircle2 className="w-3 h-3" /> : o.gates[g] === 'failed' ? <XCircle className="w-3 h-3" /> : null}
                        {GATE_LABEL[g]} · {o.gates[g].replace('_', ' ')}
                      </span>
                    ))}
                    <Badge variant="outline" className="text-[10px] capitalize ml-auto">
                      Founder: {o.founderApproval.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Founder actions */}
                  {o.founderApproval === 'pending' ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => decide(o, true)} disabled={busy === o.id}>
                        <ThumbsUp className="w-3.5 h-3.5 mr-1.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => decide(o, false)} disabled={busy === o.id}>
                        <ThumbsDown className="w-3.5 h-3.5 mr-1.5" /> Reject
                      </Button>
                    </div>
                  ) : next ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">
                        Waiting on the <strong>{GATE_LABEL[next]}</strong> gate ({GATE_REVIEWERS[next].label}) — record the outcome:
                      </span>
                      <Button size="sm" variant="outline" onClick={() => gate(o, next, true)} disabled={busy === o.id}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Pass
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => gate(o, next, false)} disabled={busy === o.id}>
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Fail
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkOrderBoard;
