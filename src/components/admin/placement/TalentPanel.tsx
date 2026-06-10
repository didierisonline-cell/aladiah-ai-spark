import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Candidate, CandidateStatus } from '@/types/placement';

const STATUS: Record<CandidateStatus, string> = {
  received: 'bg-slate-100 text-slate-600 border-slate-200',
  matched: 'bg-blue-100 text-blue-700 border-blue-200',
  submitted: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  interviewing: 'bg-amber-100 text-amber-700 border-amber-200',
  offer: 'bg-purple-100 text-purple-700 border-purple-200',
  placed: 'bg-green-100 text-green-700 border-green-200',
  declined: 'bg-red-100 text-red-700 border-red-200',
};

const TalentPanel = ({ candidates }: { candidates: Candidate[] }) => (
  <Card>
    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Talent Marketplace</CardTitle></CardHeader>
    <CardContent className="overflow-x-auto max-h-[560px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs text-muted-foreground border-b">
          <th className="py-2 pr-3">Candidate</th><th className="py-2 pr-3">Target</th><th className="py-2 pr-3">CTS</th>
          <th className="py-2 pr-3">Employability</th><th className="py-2 pr-3">Interview</th><th className="py-2 pr-3">Status</th>
        </tr></thead>
        <tbody>
          {candidates.length === 0 ? <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No placement-ready candidates yet. Run the pipeline to ingest from Student Success.</td></tr> : candidates.map((c) => (
            <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20">
              <td className="py-2 pr-3 font-medium text-foreground">{c.name || 'Candidate'}</td>
              <td className="py-2 pr-3 text-xs">{c.target_role}</td>
              <td className="py-2 pr-3 font-bold">{c.cts}</td>
              <td className="py-2 pr-3 text-xs">{c.employability_score}%</td>
              <td className="py-2 pr-3 text-xs">{c.interview_readiness}%</td>
              <td className="py-2 pr-3"><Badge className={`text-[9px] border ${STATUS[c.status]}`}>{c.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export default TalentPanel;
