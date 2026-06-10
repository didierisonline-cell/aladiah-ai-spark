import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArchitectureId } from '@/types/programStandard';
import { buildScorecard } from '@/services/standards/programFactory';

const ROWS = buildScorecard();
const dim = (e: any, id: ArchitectureId) => e.dimensions.find((d: any) => d.id === id)?.score ?? 0;
const cell = (n: number) => (n >= 90 ? 'text-green-600' : n >= 80 ? 'text-amber-600' : 'text-red-600');

/** Curriculum Excellence Dashboard — per-program scorecard, color-coded by tier. */
const ProgramScorecard = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base">Curriculum Excellence Scorecard</CardTitle>
      <p className="text-xs text-muted-foreground">
        Tiers: <span className="text-emerald-600 font-medium">95–100 Elite</span> ·
        <span className="text-green-600 font-medium"> 90–94 World Class</span> ·
        <span className="text-amber-600 font-medium"> 80–89 Good</span> ·
        <span className="text-red-600 font-medium"> &lt;80 Needs Improvement</span>
      </p>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] text-muted-foreground border-b">
            <th className="py-2 pr-2">Program</th>
            <th className="py-2 px-2">CES</th>
            <th className="py-2 px-2">Module</th>
            <th className="py-2 px-2">Assess</th>
            <th className="py-2 px-2">Sim</th>
            <th className="py-2 px-2">Lab</th>
            <th className="py-2 px-2">Portfolio</th>
            <th className="py-2 px-2">Interview</th>
            <th className="py-2 px-2">Cert</th>
            <th className="py-2 px-2">Employ</th>
            <th className="py-2 px-2">AI</th>
            <th className="py-2 pl-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.key} className="border-b last:border-0 hover:bg-muted/20">
              <td className="py-2 pr-2 font-medium text-foreground">{r.name}</td>
              <td className={`py-2 px-2 font-bold ${r.tierColor}`}>{r.evaluation.ces}</td>
              <td className={`py-2 px-2 ${cell(dim(r.evaluation, 'module'))}`}>{dim(r.evaluation, 'module')}</td>
              <td className={`py-2 px-2 ${cell(dim(r.evaluation, 'assessment'))}`}>{dim(r.evaluation, 'assessment')}</td>
              <td className={`py-2 px-2 ${cell(dim(r.evaluation, 'simulation'))}`}>{dim(r.evaluation, 'simulation')}</td>
              <td className={`py-2 px-2 ${cell(dim(r.evaluation, 'lab'))}`}>{dim(r.evaluation, 'lab')}</td>
              <td className={`py-2 px-2 ${cell(dim(r.evaluation, 'portfolio'))}`}>{dim(r.evaluation, 'portfolio')}</td>
              <td className={`py-2 px-2 ${cell(dim(r.evaluation, 'interview'))}`}>{dim(r.evaluation, 'interview')}</td>
              <td className={`py-2 px-2 ${cell(dim(r.evaluation, 'certification'))}`}>{dim(r.evaluation, 'certification')}</td>
              <td className={`py-2 px-2 ${cell(r.employability)}`}>{r.employability}</td>
              <td className={`py-2 px-2 ${cell(r.ai)}`}>{r.ai}</td>
              <td className="py-2 pl-2"><Badge className={`text-[9px] border ${r.tierBadge}`}>{r.tier}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export default ProgramScorecard;
