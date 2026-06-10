import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Inbox, RefreshCw } from 'lucide-react';
import {
  getApprovalQueue,
  type ApprovalItem,
  type ApprovalQueueSnapshot,
} from '@/services/aos/approvals';
import { aos } from '@/services/aos';

const EMPTY: ApprovalQueueSnapshot = {
  items: [],
  countsBySource: { product: 0, marketing: 0, admissions: 0, 'student-success': 0, placement: 0 },
  total: 0,
};

const when = (iso: string | null) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString(); } catch { return ''; }
};

const ApprovalsHub = () => {
  const [snap, setSnap] = useState<ApprovalQueueSnapshot>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      setSnap(await getApprovalQueue());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const items: ApprovalItem[] =
    filter === 'all' ? snap.items : snap.items.filter((i) => i.source === filter);

  const chips: { key: string; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: snap.total },
    { key: 'product', label: 'Product', count: snap.countsBySource.product },
    { key: 'marketing', label: 'Marketing', count: snap.countsBySource.marketing },
    { key: 'admissions', label: 'Admissions', count: snap.countsBySource.admissions },
    { key: 'student-success', label: 'Success', count: snap.countsBySource['student-success'] },
    { key: 'placement', label: 'Placement', count: snap.countsBySource.placement },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" />
            Founder Approval Queue
          </h1>
          <p className="text-sm text-muted-foreground">
            Everything the AI Workforce produced that is awaiting your sign-off. Nothing goes live until you approve it.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === c.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {c.label}
            <span className="text-[10px] opacity-80">{c.count}</span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Inbox className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">
              {loading ? 'Loading the queue…' : 'Nothing awaiting approval right now.'}
            </p>
            {!loading && (
              <p className="text-[12px] mt-1">
                As agents produce work and QA clears it, items land here for your sign-off.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <Card key={`${it.source}-${it.id}`} className="transition-colors hover:border-primary/40">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px]">{it.sourceLabel}</Badge>
                    <Badge variant="outline" className="text-[10px]">{it.status}</Badge>
                    {it.createdAt && (
                      <span className="text-[10px] text-muted-foreground">{when(it.createdAt)}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">{it.title}</p>
                  {it.detail && <p className="text-[11px] text-muted-foreground truncate">{it.detail}</p>}
                </div>
                <Button asChild size="sm" variant="outline" className="shrink-0">
                  <Link to={it.route}>
                    Review <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalsHub;
