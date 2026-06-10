import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskLevel, StudentStatus, SuccessStudent } from '@/types/success';

const RISK: Record<RiskLevel, string> = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};
const STATUS: Record<StudentStatus, string> = {
  active: 'bg-slate-100 text-slate-600 border-slate-200',
  at_risk: 'bg-red-100 text-red-700 border-red-200',
  thriving: 'bg-green-100 text-green-700 border-green-200',
  placement_ready: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};
const ctsColor = (n: number) => (n >= 80 ? 'text-green-600' : n >= 60 ? 'text-amber-600' : 'text-red-600');

interface Props {
  students: SuccessStudent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const StudentsTable = ({ students, selectedId, onSelect }: Props) => (
  <Card>
    <CardHeader className="pb-3"><CardTitle className="text-base">Cohort (by Career Transformation Score)</CardTitle></CardHeader>
    <CardContent className="overflow-x-auto max-h-[560px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground border-b">
            <th className="py-2 pr-3">Student</th>
            <th className="py-2 pr-3">CTS</th>
            <th className="py-2 pr-3">Competency</th>
            <th className="py-2 pr-3">Employability</th>
            <th className="py-2 pr-3">Risk</th>
            <th className="py-2 pr-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No students scored yet — run the cohort cycle.</td></tr>
          ) : (
            students.map((s) => (
              <tr key={s.id} onClick={() => onSelect(s.id)} className={`border-b last:border-0 cursor-pointer hover:bg-muted/30 ${selectedId === s.id ? 'bg-muted/40' : ''}`}>
                <td className="py-2 pr-3"><p className="font-medium text-foreground">{s.name || 'Student'}</p><p className="text-[10px] text-muted-foreground">{s.program}</p></td>
                <td className={`py-2 pr-3 font-bold ${ctsColor(s.career_transformation_score)}`}>{s.career_transformation_score}</td>
                <td className="py-2 pr-3 text-xs">{s.competency_mastery}%</td>
                <td className="py-2 pr-3 text-xs">{s.employability_score}%</td>
                <td className="py-2 pr-3"><Badge className={`text-[9px] border ${RISK[s.risk_level]}`}>{s.risk_level}</Badge></td>
                <td className="py-2 pr-3"><Badge className={`text-[9px] border ${STATUS[s.status]}`}>{s.status.replace(/_/g, ' ')}</Badge></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export default StudentsTable;
