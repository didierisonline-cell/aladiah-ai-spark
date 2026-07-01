import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Inbox } from 'lucide-react';
import { ApprovalQueueSnapshot } from '@/services/aos/approvals';

const when = (iso: string | null) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString(); } catch { return ''; }
};

/**
 * Founder Approval Queue (cockpit panel) — every pending sign-off across
 * product, marketing, admissions, success, placement, and work orders in one
 * place. The full queue lives at /admin/approvals.
 */
const ApprovalQueuePanel = ({ approvals }: { approvals: ApprovalQueueSnapshot }) => {
  const top = approvals.items.slice(0, 6);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-primary" /> Founder Approval Queue
          </span>
          <span className={`text-lg font-bold ${approvals.total > 0 ? 'text-amber-500' : 'text-green-500'}`}>
            {approvals.total}
          </span>
        </CardTitle>
        <p className="text-[12px] text-muted-foreground">
          Nothing the workforce produced goes live without your sign-off.
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {top.length === 0 ? (
          <p className="text-[12px] text-muted-foreground text-center py-6">
            Nothing awaiting approval right now. As agents produce work and it clears the gates, it lands here.
          </p>
        ) : (
          <div className="space-y-1.5">
            {top.map((it) => (
              <Link key={`${it.source}-${it.id}`} to={it.route} className="group block">
                <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2 transition-colors group-hover:bg-muted/50">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[9px]">{it.sourceLabel}</Badge>
                      <span className="text-[10px] text-muted-foreground">{when(it.createdAt)}</span>
                    </div>
                    <p className="text-[12.5px] font-medium text-foreground truncate mt-0.5">{it.title}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/admin/approvals">
            Open the full approval queue <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApprovalQueuePanel;
