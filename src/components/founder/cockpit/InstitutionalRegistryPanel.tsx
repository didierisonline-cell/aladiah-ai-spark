import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookMarked } from 'lucide-react';
import { getRegistrySummary, CAPABILITY_GENOMES } from '@/services/aos/institutionalRegistry';
import { renderScore } from '@/services/aos/genome';

// Risk palette only: classification chips follow the institutional scale.
const CLS_COLOR: Record<string, string> = {
  constitutional: '#22c55e', strategic: '#22c55e', operational: '#64748b',
  experimental: '#f59e0b', legacy: '#f59e0b', archived: '#64748b', unknown: '#ef4444',
};

/**
 * The Institutional Registry — the constitutional catalog (Dashboard Spec 04).
 * Led by the risk-ordered Unknown queue: capabilities the Institution cannot
 * yet explain, maturity-locked until the founder walk resolves them.
 */
const InstitutionalRegistryPanel = () => {
  const summary = getRegistrySummary();
  const [showAll, setShowAll] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-primary" /> Institutional Registry
          </span>
          <span className="text-[11px] text-muted-foreground">
            mean maturity {renderScore(summary.meanMaturity)}/5
          </span>
        </CardTitle>
        <p className="text-[12px] text-muted-foreground">
          {summary.total} governed genomes · parity CI-enforced for: {summary.parityEnforcedClasses.join(', ')} · other classes onboard per playbook
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Classification chips */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(summary.byClassification).map(([cls, n]) => (
            <span key={cls} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border"
              style={{ color: CLS_COLOR[cls] ?? '#64748b', borderColor: `${CLS_COLOR[cls] ?? '#64748b'}55` }}>
              {cls} · {n}
            </span>
          ))}
        </div>

        {/* The Unknown queue — the panel's reason to exist */}
        {summary.unknownQueue.length > 0 ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 space-y-1.5">
            <p className="text-[11px] font-semibold text-red-400">
              {summary.unknownQueue.length} unknown capabilities — maturity locked at 0 until your walk (risk-ordered, destructive first)
            </p>
            <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
              {(showAll ? summary.unknownQueue : summary.unknownQueue.slice(0, 6)).map((q) => (
                <div key={q.id} className="text-[11px]">
                  <span className="text-foreground font-medium">{q.id.replace('edge-function:', '')}</span>
                  <span className="text-muted-foreground"> — {q.risk}</span>
                </div>
              ))}
            </div>
            {summary.unknownQueue.length > 6 && (
              <button onClick={() => setShowAll((s) => !s)} className="text-[10.5px] text-primary underline">
                {showAll ? 'Show fewer' : `Show all ${summary.unknownQueue.length}`}
              </button>
            )}
          </div>
        ) : (
          <p className="text-[12px] text-green-500">No unknown capabilities — the Institution is fully classified.</p>
        )}

        {/* Lifecycle distribution */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(summary.byLifecycle).map(([lc, n]) => (
            <Badge key={lc} variant="outline" className="text-[9px] capitalize">{lc} · {n}</Badge>
          ))}
          {summary.reviewsDue > 0 && (
            <Badge variant="outline" className="text-[9px]" style={{ color: '#f59e0b', borderColor: '#f59e0b55' }}>
              {summary.reviewsDue} review(s) due
            </Badge>
          )}
        </div>

        <p className="text-[10.5px] text-muted-foreground">
          Catalog: <code>src/services/aos/institutionalRegistry.ts</code> · standard: Capability Genome v2.0 (ratified) · {CAPABILITY_GENOMES.length} genomes validate V1–V12 in CI.
        </p>
      </CardContent>
    </Card>
  );
};

export default InstitutionalRegistryPanel;
