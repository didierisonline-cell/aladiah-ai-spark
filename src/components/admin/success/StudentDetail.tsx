import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, TrendingUp, X } from 'lucide-react';
import { SuccessIntervention, SuccessStudent } from '@/types/success';

const DIMS: { key: keyof SuccessStudent; label: string }[] = [
  { key: 'competency_mastery', label: 'Competency Mastery' },
  { key: 'completion', label: 'Completion' },
  { key: 'certification_readiness', label: 'Certification' },
  { key: 'simulation_mastery', label: 'Simulation' },
  { key: 'portfolio_readiness', label: 'Portfolio' },
  { key: 'interview_readiness', label: 'Interview' },
  { key: 'resume_score', label: 'Resume' },
  { key: 'linkedin_score', label: 'LinkedIn' },
  { key: 'employability_score', label: 'Employability' },
  { key: 'ai_readiness', label: 'AI Readiness' },
  { key: 'promotion_readiness', label: 'Promotion' },
];

interface Props {
  student: SuccessStudent | null;
  interventions: SuccessIntervention[];
  onApprove: (id: string) => void;
  onDismiss: (id: string) => void;
}

const StudentDetail = ({ student, interventions, onApprove, onDismiss }: Props) => {
  if (!student) return <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Select a student to see their full readiness profile and drafted interventions.</CardContent></Card>;
  const sp = student.salary_projection as any;
  const estimated = new Set(student.estimated || []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{student.name || 'Student'}</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary leading-none">{student.career_transformation_score}</p>
            <p className="text-[10px] text-muted-foreground">Career Transformation Score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          {DIMS.map((d) => {
            const v = Number(student[d.key] ?? 0);
            return (
              <div key={d.key as string}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-foreground">{d.label}{estimated.has(d.key as string) && <span className="text-muted-foreground"> (est.)</span>}</span>
                  <span className="text-muted-foreground">{v}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${v}%` }} /></div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg bg-muted/30 p-3">
          <p className="text-xs font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3 text-primary" /> Salary Projection</p>
          <p className="text-[11px] text-muted-foreground mt-1">{sp?.range ?? '—'} (projected {sp?.currency} {sp?.projected?.toLocaleString?.() ?? '—'})</p>
        </div>

        {student.risk_factors?.length > 0 && (
          <p className="text-[11px] text-amber-600">Risk factors: {student.risk_factors.join(', ')}</p>
        )}

        <div>
          <p className="text-xs font-medium mb-1">Drafted interventions (founder approval)</p>
          <div className="space-y-1">
            {interventions.length === 0 ? <p className="text-[11px] text-muted-foreground">None.</p> : interventions.map((iv) => (
              <div key={iv.id} className="flex items-start justify-between gap-2 rounded-lg border border-border/60 p-2 bg-muted/20">
                <div>
                  <p className="text-xs font-medium text-foreground">{iv.title} <Badge variant="outline" className="text-[8px]">{iv.intervention_type}</Badge></p>
                  <p className="text-[10px] text-muted-foreground">{iv.rationale}</p>
                </div>
                {iv.status === 'pending' ? (
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" className="h-6 px-2" onClick={() => onApprove(iv.id)}><Check className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-red-600" onClick={() => onDismiss(iv.id)}><X className="w-3 h-3" /></Button>
                  </div>
                ) : <Badge variant="secondary" className="text-[9px] shrink-0">{iv.status}</Badge>}
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground italic">Estimated dimensions are flagged until live simulation/portfolio/resume/LinkedIn data is wired. No student records are modified.</p>
      </CardContent>
    </Card>
  );
};

export default StudentDetail;
