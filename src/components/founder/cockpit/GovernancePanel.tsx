import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Landmark } from 'lucide-react';
import {
  DocumentStatus,
  GOVERNING_DOCUMENTS,
  getGovernanceSummary,
  isReviewDue,
} from '@/services/aos/governance';

// Risk-based statuses: ratified = green, review = amber, draft = slate,
// deprecated = red. Same scale as everything else on the cockpit.
const STATUS: Record<DocumentStatus, { color: string; label: string }> = {
  ratified: { color: '#22c55e', label: 'Ratified' },
  review: { color: '#f59e0b', label: 'Review' },
  draft: { color: '#64748b', label: 'Draft' },
  deprecated: { color: '#ef4444', label: 'Deprecated' },
};

/**
 * Governance — the institution's founding documents and their authority
 * status. Data source: the Institutional Knowledge registry
 * (src/services/aos/governance.ts, git-versioned). Lifecycle rules:
 * docs/governance/constitution/ratification.md.
 */
const GovernancePanel = () => {
  const summary = getGovernanceSummary();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-primary" /> Governance
          </span>
          {summary.reviewsDue > 0 && (
            <Badge variant="outline" className="text-[10px]" style={{ color: '#f59e0b', borderColor: '#f59e0b55' }}>
              {summary.reviewsDue} review(s) due
            </Badge>
          )}
        </CardTitle>
        <p className="text-[12px] text-muted-foreground">
          {summary.total} governing documents · {summary.byStatus.ratified} ratified · {summary.byStatus.review} in review · {summary.byStatus.draft} draft
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Headline documents */}
        <div className="grid grid-cols-2 gap-2">
          {summary.headline.map((h) => {
            const s = STATUS[h.status];
            return (
              <div key={h.key} className="rounded-lg bg-muted/30 px-3 py-2">
                <p className="text-[11px] text-muted-foreground truncate" title={h.name}>{h.name}</p>
                <p className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-foreground">v{h.version}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium" style={{ color: s.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Full registry */}
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {GOVERNING_DOCUMENTS.map((d) => {
            const s = STATUS[d.status];
            const due = isReviewDue(d);
            return (
              <div
                key={d.key}
                className="flex items-center justify-between gap-2 rounded-lg bg-muted/20 px-2.5 py-1.5"
                title={`${d.path}\nOwner: ${d.owner} · Authority: ${d.authority}\nLast review ${d.lastReview} · next ${d.nextReview}${d.ratified ? `\nRatified ${d.ratified.on} by ${d.ratified.by}` : ''}`}
              >
                <span className="text-[11.5px] text-foreground truncate">{d.name}</span>
                <span className="flex items-center gap-1.5 shrink-0">
                  {due && (
                    <Badge variant="outline" className="text-[9px]" style={{ color: '#f59e0b', borderColor: '#f59e0b55' }}>
                      review due
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[9px] capitalize">{d.authority}</Badge>
                  <span className="text-[10px] font-medium w-16 text-right" style={{ color: s.color }}>
                    v{d.version} · {s.label}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-[10.5px] text-muted-foreground">
          Registry: <code>src/services/aos/governance.ts</code> · lifecycle: <code>docs/governance/constitution/ratification.md</code>. Status changes are founder decisions, made through reviewed commits.
        </p>
      </CardContent>
    </Card>
  );
};

export default GovernancePanel;
