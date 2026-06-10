import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { MarketIntelligence } from '@/types/qa';

const TREND: Record<string, string> = {
  rising: 'text-green-600',
  stable: 'text-slate-500',
  declining: 'text-red-600',
};
const money = (n: number | null, c?: string | null) =>
  n ? `${c ?? 'USD'} ${Math.round(n / 1000)}k` : '—';

const MarketIntelligencePanel = ({ market }: { market: MarketIntelligence[] }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" /> Market Intelligence
      </CardTitle>
      <p className="text-xs text-muted-foreground">Role demand, salary, and AI-skill demand used to validate market & salary relevance.</p>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground border-b">
            <th className="py-2 pr-3">Role</th>
            <th className="py-2 pr-3">Demand</th>
            <th className="py-2 pr-3">AI Demand</th>
            <th className="py-2 pr-3">Salary (median)</th>
            <th className="py-2 pr-3">Trend</th>
          </tr>
        </thead>
        <tbody>
          {market.length === 0 ? (
            <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No market data.</td></tr>
          ) : (
            market.map((m) => (
              <tr key={m.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="py-2 pr-3 font-medium text-foreground">{m.role}</td>
                <td className="py-2 pr-3">{m.demand_score}/100</td>
                <td className="py-2 pr-3">{m.ai_demand}/100</td>
                <td className="py-2 pr-3">{money(m.salary_median, m.currency)}</td>
                <td className="py-2 pr-3"><span className={`text-xs font-medium capitalize ${TREND[m.trend]}`}>{m.trend}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export default MarketIntelligencePanel;
