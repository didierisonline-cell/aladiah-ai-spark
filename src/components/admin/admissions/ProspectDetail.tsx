import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Check, Mail, ShieldQuestion, TrendingUp, X } from 'lucide-react';
import { AdmissionsFollowup, AdmissionsRecommendation, Prospect } from '@/types/admissions';

interface Props {
  prospect: Prospect | null;
  recommendations: AdmissionsRecommendation[];
  followups: AdmissionsFollowup[];
  onApproveRec: (id: string) => void;
  onDismissRec: (id: string) => void;
  onApproveFollowup: (id: string) => void;
}

const ProspectDetail = ({ prospect, recommendations, followups, onApproveRec, onDismissRec, onApproveFollowup }: Props) => {
  if (!prospect) {
    return (
      <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Select a prospect to see projections, objections, recommendations, and drafted follow-ups.</CardContent></Card>
    );
  }
  const proj = prospect.employability_projection as any;
  const pred = prospect.success_prediction as any;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{prospect.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{prospect.target_role} · recommended: {prospect.recommended_program}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3 text-primary" /> Employability Projection</p>
            <p className="text-[11px] text-muted-foreground mt-1">Employment: {proj?.projected_employment_pct ?? '—'}% · {proj?.salary_range ?? '—'} · ~{proj?.time_to_placement_months ?? '—'} mo to placement</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs font-medium flex items-center gap-1"><Briefcase className="w-3 h-3 text-primary" /> Success Prediction</p>
            <p className="text-[11px] text-muted-foreground mt-1">Completion {pred?.completion_probability ?? '—'}% · Certification {pred?.certification_success ?? '—'}%</p>
            {pred?.risk_factors?.length > 0 && <p className="text-[10px] text-amber-600 mt-1">Risks: {pred.risk_factors.join(', ')}</p>}
          </div>
        </div>

        {prospect.objections?.length > 0 && (
          <div>
            <p className="text-xs font-medium flex items-center gap-1 mb-1"><ShieldQuestion className="w-3 h-3 text-primary" /> Objections & drafted responses</p>
            <ul className="space-y-1">
              {prospect.objections.map((o, i) => (
                <li key={i} className="text-[11px] text-muted-foreground"><span className="font-medium text-foreground capitalize">{o.type}:</span> {o.response}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-xs font-medium mb-1">Recommendations (founder approval)</p>
          <div className="space-y-1">
            {recommendations.length === 0 ? <p className="text-[11px] text-muted-foreground">None.</p> : recommendations.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-2 rounded-lg border border-border/60 p-2 bg-muted/20">
                <div>
                  <p className="text-xs font-medium text-foreground">{r.title} <Badge variant="outline" className="text-[8px]">{r.rec_type}</Badge></p>
                  <p className="text-[10px] text-muted-foreground">{r.rationale}</p>
                </div>
                {r.status === 'pending' ? (
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" className="h-6 px-2" onClick={() => onApproveRec(r.id)}><Check className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-red-600" onClick={() => onDismissRec(r.id)}><X className="w-3 h-3" /></Button>
                  </div>
                ) : <Badge variant="secondary" className="text-[9px] shrink-0">{r.status}</Badge>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-1 flex items-center gap-1"><Mail className="w-3 h-3 text-primary" /> Drafted follow-ups (never auto-sent)</p>
          <div className="space-y-1">
            {followups.length === 0 ? <p className="text-[11px] text-muted-foreground">None.</p> : followups.sort((a, b) => a.step_no - b.step_no).map((f) => (
              <div key={f.id} className="flex items-start justify-between gap-2 rounded-lg border border-border/60 p-2 bg-muted/20">
                <div>
                  <p className="text-xs font-medium text-foreground">{f.step_no}. {f.subject}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{f.message}</p>
                </div>
                {f.status === 'drafted' ? (
                  <Button size="sm" className="h-6 px-2 shrink-0" onClick={() => onApproveFollowup(f.id)}><Check className="w-3 h-3 mr-1" />Approve</Button>
                ) : <Badge variant="secondary" className="text-[9px] shrink-0">{f.status}</Badge>}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProspectDetail;
