import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle2, AlertTriangle, XCircle, MinusCircle, FileText, FolderGit2, Mic, Award, Briefcase, BadgeCheck } from 'lucide-react';

// =============================================================================
// /founder/outcomes — Employment Outcomes Truth (CEO Command Cell)
// =============================================================================
// Aladiah's promise is "get job-ready", so this is the spine metric. Evidence
// only: each capability is PASS / PARTIAL / FAIL / NOT MEASURED based on whether
// a real data layer exists and is reachable. No invented numbers. A capability
// with no persistence table is NOT MEASURED (not "0%"); a capability that shows
// fabricated/hardcoded data to students is a FAIL (it misrepresents).
// =============================================================================

type Status = 'pass' | 'partial' | 'fail' | 'unmeasured';
interface Row { key: string; label: string; icon: any; status: Status; detail: string; }

// Returns row count if the table exists & is readable, else null (missing/blocked).
const tableCount = async (name: string): Promise<number | null> => {
  try {
    const { count, error } = await supabase.from(name as any).select('*', { count: 'exact', head: true });
    return error ? null : (count ?? 0);
  } catch { return null; }
};

export default function EmploymentOutcomes() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const out: Row[] = [];

      // Resume — ResumeStudio persists drafts to ai_conversations (a generic chat
      // store), not a structured resume table. Owner-only RLS → no aggregate.
      const aiConv = await tableCount('ai_conversations');
      const resumesTbl = await tableCount('resumes');
      out.push({
        key: 'resume', label: 'Resume readiness', icon: FileText,
        status: resumesTbl !== null ? 'partial' : (aiConv !== null ? 'partial' : 'unmeasured'),
        detail: resumesTbl !== null
          ? 'A resumes table exists — wire completion tracking to upgrade to PASS.'
          : 'No structured resume table. ResumeStudio persists drafts in ai_conversations (proxy, owner-only RLS) — no resume completion is measurable.',
      });

      // Portfolio — the portal panel renders HARDCODED demo projects; no data layer.
      const portfolioTbl = (await tableCount('portfolio_projects')) ?? (await tableCount('portfolios'));
      out.push({
        key: 'portfolio', label: 'Portfolio readiness', icon: FolderGit2,
        status: portfolioTbl !== null ? 'partial' : 'fail',
        detail: portfolioTbl !== null
          ? 'A portfolio table exists — verify it backs the portal UI.'
          : 'No portfolio table. The portal Portfolio panel shows STATIC, hardcoded demo projects — this misrepresents student work and must be replaced with real data.',
      });

      // Interview — simulator exists but records no outcomes.
      const interviewTbl = (await tableCount('interview_sessions')) ?? (await tableCount('mock_interviews'));
      out.push({
        key: 'interview', label: 'Interview readiness', icon: Mic,
        status: interviewTbl !== null ? 'partial' : 'unmeasured',
        detail: interviewTbl !== null
          ? 'An interview table exists — confirm sessions/scores are recorded.'
          : 'No interview-results table. InterviewSimulator runs live but no outcome is persisted — not measurable.',
      });

      // Certification — pages exist but nothing is issued/tracked.
      const certTbl = (await tableCount('certificates')) ?? (await tableCount('certifications_issued'));
      out.push({
        key: 'certification', label: 'Certification readiness', icon: Award,
        status: certTbl !== null ? 'partial' : 'unmeasured',
        detail: certTbl !== null
          ? 'A certificates table exists — confirm issuance is wired to assessment passing.'
          : 'No certificates table. Certifications are not issued or tracked — not measurable.',
      });

      // Placement — talent network / employer pages exist; no placement records.
      const placeTbl = (await tableCount('placements')) ?? (await tableCount('job_placements'));
      out.push({
        key: 'placement', label: 'Placement readiness', icon: Briefcase,
        status: placeTbl !== null ? 'partial' : 'unmeasured',
        detail: placeTbl !== null
          ? 'A placements table exists — confirm applications/offers are recorded.'
          : 'No placements table. No applications, offers, or hires are recorded — the core outcome is not measurable.',
      });

      // Employer verification
      const empTbl = (await tableCount('employer_verifications')) ?? (await tableCount('employers'));
      out.push({
        key: 'employer', label: 'Employer verification readiness', icon: BadgeCheck,
        status: empTbl !== null ? 'partial' : 'unmeasured',
        detail: empTbl !== null
          ? 'An employer table exists — confirm verification status is tracked.'
          : 'No employer-verification table. Employer trust signals are not measurable.',
      });

      setRows(out);
      setLoading(false);
    })();
  }, []);

  const sIcon = (s: Status) => s === 'pass' ? <CheckCircle2 className="w-4 h-4 text-green-600" />
    : s === 'partial' ? <AlertTriangle className="w-4 h-4 text-amber-500" />
    : s === 'fail' ? <XCircle className="w-4 h-4 text-destructive" />
    : <MinusCircle className="w-4 h-4 text-muted-foreground" />;
  const sLabel = (s: Status) => s === 'unmeasured' ? 'NOT MEASURED' : s.toUpperCase();

  const measured = rows.filter((r) => r.status !== 'unmeasured');
  const pass = rows.filter((r) => r.status === 'pass').length;

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Target className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employment Outcomes Truth</h1>
          <p className="text-sm text-muted-foreground">The spine metric — "get job-ready". Evidence only: PASS / PARTIAL / FAIL / NOT MEASURED.</p>
        </div>
      </div>

      {loading && <div className="text-muted-foreground text-sm">Probing outcome data layers…</div>}

      {!loading && (
        <div className="space-y-6">
          <Card className="border-amber-500/40 bg-amber-500/5">
            <CardHeader className="pb-2"><CardTitle className="text-base">Reality check</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <strong className="text-foreground">{pass}/{rows.length}</strong> outcome capabilities are PASS.
              The employment-outcome <strong>data layer is largely not built yet</strong> — most capabilities have UI but no persistence,
              so they read <strong>NOT MEASURED</strong> (not 0%). The promise is "get hired", and today little of it is measurable.
              This dashboard exists to keep that honest until it's real.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Capabilities</CardTitle></CardHeader>
            <CardContent className="pt-0">
              {rows.map((r) => (
                <div key={r.key} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                  <r.icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.detail}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">{sIcon(r.status)} {sLabel(r.status)}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            Behavior: <Link to="/founder/journey" className="text-primary underline">Student Journey</Link> · Readiness: <Link to="/founder/launch" className="text-primary underline">Launch</Link> · Claims: <Link to="/founder/truth" className="text-primary underline">Truth</Link>.
          </div>
        </div>
      )}
    </FounderShell>
  );
}
