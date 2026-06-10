import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Prospect, ProspectStatus } from '@/types/admissions';

const STATUS: Record<ProspectStatus, string> = {
  new: 'bg-slate-100 text-slate-600 border-slate-200',
  qualified: 'bg-green-100 text-green-700 border-green-200',
  nurturing: 'bg-amber-100 text-amber-700 border-amber-200',
  enrolled: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  disqualified: 'bg-red-100 text-red-700 border-red-200',
};
const bar = (n: number | null) => `${Math.max(0, Math.min(100, n ?? 0))}%`;

interface Props {
  prospects: Prospect[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ProspectsTable = ({ prospects, selectedId, onSelect }: Props) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base">Prospect Pipeline</CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto max-h-[560px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground border-b">
            <th className="py-2 pr-3">Prospect</th>
            <th className="py-2 pr-3">Target</th>
            <th className="py-2 pr-3">Fit</th>
            <th className="py-2 pr-3">Completion</th>
            <th className="py-2 pr-3">Employability</th>
            <th className="py-2 pr-3">Financial</th>
            <th className="py-2 pr-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {prospects.length === 0 ? (
            <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No prospects yet.</td></tr>
          ) : (
            prospects.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`border-b last:border-0 cursor-pointer hover:bg-muted/30 ${selectedId === p.id ? 'bg-muted/40' : ''}`}
              >
                <td className="py-2 pr-3">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.region} · {p.background}</p>
                </td>
                <td className="py-2 pr-3 text-xs">{p.target_role}</td>
                <td className="py-2 pr-3 text-xs">{bar(p.fit_score)}</td>
                <td className="py-2 pr-3 text-xs">{bar(p.completion_probability)}</td>
                <td className="py-2 pr-3 text-xs">{bar(p.employability_score)}</td>
                <td className="py-2 pr-3 text-xs capitalize">{p.financial_readiness}</td>
                <td className="py-2 pr-3"><Badge className={`text-[9px] border ${STATUS[p.status]}`}>{p.status}</Badge></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export default ProspectsTable;
