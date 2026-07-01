import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket } from 'lucide-react';
import { ReadinessDimension } from '@/services/aos/cockpit';

const scoreColor = (n: number | null) =>
  n == null ? '#64748b' : n >= 80 ? '#22c55e' : n >= 50 ? '#f59e0b' : '#ef4444';

const BASIS_LABEL: Record<ReadinessDimension['basis'], string> = {
  measured: 'live',
  posture: 'posture',
  unmeasured: 'not measured',
};

/**
 * Launch Readiness Cockpit — 13 dimensions, honestly labeled: 'live' comes
 * from production probes, 'posture' from verified structural checks, and
 * 'not measured' is shown plainly rather than guessed.
 */
const LaunchReadinessCockpit = ({ dimensions }: { dimensions: ReadinessDimension[] }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base flex items-center gap-2">
        <Rocket className="w-4 h-4 text-primary" /> Launch Readiness Cockpit
      </CardTitle>
      <p className="text-[12px] text-muted-foreground">
        Readiness across every launch dimension. Live values are read from the production database — nothing is aspirational.
      </p>
    </CardHeader>
    <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4 pt-0">
      {dimensions.map((d) => (
        <Link key={d.key} to={d.route} className="group" title={d.detail}>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {d.label}
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 capitalize">
                  {BASIS_LABEL[d.basis]}
                </Badge>
                <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor(d.score) }}>
                  {d.score == null ? '—' : `${d.score}%`}
                </span>
              </span>
            </div>
            <Progress
              value={d.score ?? 0}
              aria-label={`${d.label} readiness ${d.score == null ? 'not measured' : `${d.score}%`}`}
              className="h-1.5"
            />
            <p className="text-[10.5px] text-muted-foreground truncate">{d.detail}</p>
          </div>
        </Link>
      ))}
    </CardContent>
  </Card>
);

export default LaunchReadinessCockpit;
