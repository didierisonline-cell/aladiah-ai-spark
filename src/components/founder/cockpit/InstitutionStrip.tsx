import { Link } from 'react-router-dom';
import { getGovernanceHealth } from '@/services/aos/governance';
import { getRegistrySummary } from '@/services/aos/institutionalRegistry';
import { renderScore } from '@/services/aos/genome';

const c = (n: number | null, good: number, warn: number) =>
  n == null ? '#64748b' : n >= good ? '#22c55e' : n >= warn ? '#f59e0b' : '#ef4444';

/**
 * Founder Command Center v1 (FD-2026-006 P5): the Institution in one line.
 * Every number computed — governance health from the registry model, catalog
 * state from genomes, the Unknown queue from evidence flags. Nothing asserted.
 */
const InstitutionStrip = () => {
  const gov = getGovernanceHealth();
  const reg = getRegistrySummary();
  const classified = reg.total - (reg.byClassification['unknown'] ?? 0);
  const classifiedPct = reg.total ? Math.round((classified / reg.total) * 100) : null;

  const cells: { label: string; value: string; color: string; to: string }[] = [
    { label: 'Governance', value: `${gov.score}`, color: c(gov.score, 80, 60), to: '/founder' },
    { label: 'Genomes', value: String(reg.total), color: '#64748b', to: '/founder' },
    { label: 'Classified', value: classifiedPct == null ? '—' : `${classifiedPct}%`, color: c(classifiedPct, 95, 80), to: '/founder' },
    { label: 'Unknown', value: String(reg.unknownQueue.length), color: reg.unknownQueue.length > 0 ? '#ef4444' : '#22c55e', to: '/founder' },
    { label: 'Maturity', value: `${renderScore(reg.meanMaturity)}/5`, color: c(reg.meanMaturity == null ? null : reg.meanMaturity * 20, 60, 40), to: '/founder' },
    { label: 'Reviews due', value: String(gov.reviewsDue + reg.reviewsDue), color: gov.reviewsDue + reg.reviewsDue > 0 ? '#f59e0b' : '#22c55e', to: '/founder' },
  ];

  return (
    <div
      aria-label="Institution status strip"
      className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        The Institution
      </span>
      {cells.map((cell) => (
        <Link key={cell.label} to={cell.to} className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold tabular-nums" style={{ color: cell.color }}>{cell.value}</span>
          <span className="text-[10.5px] text-muted-foreground">{cell.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default InstitutionStrip;
