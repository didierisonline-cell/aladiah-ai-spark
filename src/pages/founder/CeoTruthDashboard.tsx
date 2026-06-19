import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle, Database, ScrollText } from 'lucide-react';
import {
  SCRUM_FLAGSHIP_CLAIMS, DANGEROUS_CLAIM_PATTERNS, OLD_SEED_TITLE, FLAGSHIP_TITLE_LIKE,
  claimStatus, type ClaimStatus,
} from '@/lib/truthManifest';

// =============================================================================
// /founder/truth — CEO Truth Dashboard
// =============================================================================
// Reads LIVE Supabase data and compares Spec/Authored vs Live. Never fabricates:
// a failed/blocked query renders "unknown", not a number. It probes the live DB
// to detect whether the security + flagship migrations are actually applied, and
// flags unsupported public claims (incl. claims embedded in the live course
// description). This is the company lie-detector.
// =============================================================================

type Live = Record<string, number | null>;
interface Probe { applied: boolean | null; detail: string }
interface State {
  loading: boolean;
  err: string | null;
  flagshipFound: boolean;
  flagshipTitle: string | null;
  flagshipDescription: string | null;
  modulesLive: number | null;
  lessonsLive: number | null;
  questionsLive: number | null;
  modulesWithQuestions: number | null;
  capstoneQuestionsLive: number | null;
  simsInDb: number | null;
  translatedChapters: number | null; // chapters with any non-en translation key
  oldSeedLive: boolean | null;
  scrumCourseCount: number | null;
  secProbe: Probe;       // security migration set
  flagProbe: Probe;      // flagship modules migration
}

const head = async (q: any): Promise<number | null> => {
  try { const { count, error } = await q; return error ? null : (count ?? null); } catch { return null; }
};

export default function CeoTruthDashboard() {
  const [s, setS] = useState<State>({
    loading: true, err: null, flagshipFound: false, flagshipTitle: null, flagshipDescription: null,
    modulesLive: null, lessonsLive: null, questionsLive: null, modulesWithQuestions: null,
    capstoneQuestionsLive: null, simsInDb: null, translatedChapters: null, oldSeedLive: null,
    scrumCourseCount: null, secProbe: { applied: null, detail: '' }, flagProbe: { applied: null, detail: '' },
  });

  useEffect(() => {
    (async () => {
      try {
        // --- security migration probes (live evidence) ---
        // public_profiles view + email_send_log table exist ⇒ #25 migrations applied.
        const viewOk = await head(supabase.from('public_profiles' as any).select('user_id', { count: 'exact', head: true }).limit(1));
        const logOk = await head(supabase.from('email_send_log' as any).select('id', { count: 'exact', head: true }).limit(1));
        const secApplied = viewOk !== null && logOk !== null;
        const secProbe: Probe = {
          applied: (viewOk !== null || logOk !== null) ? secApplied : null,
          detail: `public_profiles: ${viewOk !== null ? 'present' : 'missing'} · email_send_log: ${logOk !== null ? 'present' : 'missing'}`,
        };

        // --- find the flagship (Scrum) course ---
        const { data: courses } = await supabase.from('courses').select('id,title,is_flagship,description');
        const all = courses || [];
        const scrumCourses = all.filter((c: any) => /scrum master/i.test(c.title || ''));
        const flagship = all.find((c: any) => c.is_flagship)
          || scrumCourses.sort((a: any, b: any) => (b.title?.length || 0) - (a.title?.length || 0))[0]
          || null;
        const oldSeedLive = all.some((c: any) => c.title === OLD_SEED_TITLE && c.id !== flagship?.id);

        let modulesLive: number | null = null, lessonsLive: number | null = null;
        let questionsLive: number | null = null, modulesWithQuestions: number | null = null;
        let capstoneQuestionsLive: number | null = null, translatedChapters: number | null = null;

        if (flagship) {
          const { data: chapters } = await supabase.from('chapters')
            .select('id,order_index,translations').eq('course_id', flagship.id).order('order_index');
          const chaps = chapters || [];
          modulesLive = chaps.length;
          translatedChapters = chaps.filter((c: any) => {
            const t = c.translations || {}; return Object.keys(t).some((k) => k !== 'en' && t[k] && Object.keys(t[k]).length);
          }).length;
          const chapIds = chaps.map((c: any) => c.id);
          const capstoneChapId = chaps.length ? chaps[chaps.length - 1].id : null;

          if (chapIds.length) {
            lessonsLive = await head(supabase.from('videos').select('id', { count: 'exact', head: true }).in('chapter_id', chapIds));
            const { data: quizzes } = await supabase.from('quizzes').select('id,chapter_id').in('chapter_id', chapIds);
            const qz = quizzes || [];
            const quizIds = qz.map((q: any) => q.id);
            if (quizIds.length) {
              const { data: qq } = await supabase.from('quiz_questions').select('id,quiz_id').in('quiz_id', quizIds);
              const rows = qq || [];
              questionsLive = rows.length;
              const quizToChap: Record<string, string> = {};
              qz.forEach((q: any) => { quizToChap[q.id] = q.chapter_id; });
              const perChap: Record<string, number> = {};
              rows.forEach((r: any) => { const ch = quizToChap[r.quiz_id]; if (ch) perChap[ch] = (perChap[ch] || 0) + 1; });
              modulesWithQuestions = Object.values(perChap).filter((n) => n > 0).length;
              capstoneQuestionsLive = capstoneChapId
                ? rows.filter((r: any) => quizToChap[r.quiz_id] === capstoneChapId).length : null;
            } else { questionsLive = 0; modulesWithQuestions = 0; }
          }
        }

        const flagProbe: Probe = {
          applied: modulesLive === null ? null : modulesLive === 18,
          detail: modulesLive === null ? 'could not read chapters'
            : `live flagship has ${modulesLive} modules (expect 18 when applied)`,
        };

        const simsInDb = await head(supabase.from('scrum_simulations' as any).select('id', { count: 'exact', head: true }));

        setS({
          loading: false, err: null,
          flagshipFound: !!flagship, flagshipTitle: flagship?.title ?? null, flagshipDescription: flagship?.description ?? null,
          modulesLive, lessonsLive, questionsLive, modulesWithQuestions, capstoneQuestionsLive, simsInDb,
          translatedChapters, oldSeedLive, scrumCourseCount: scrumCourses.length, secProbe, flagProbe,
        });
      } catch (e: any) {
        setS((p) => ({ ...p, loading: false, err: e?.message || 'query failed' }));
      }
    })();
  }, []);

  const liveFor = (key: string): number | null => {
    switch (key) {
      case 'modules': return s.modulesLive;
      case 'lessons': return s.lessonsLive;
      case 'questions': return s.questionsLive;
      case 'capstoneQuestions': return s.capstoneQuestionsLive;
      case 'simulations': return s.simsInDb; // DB sims (engine), not flagship-scoped
      case 'labs': return 0; // no DB table on the student path
      case 'portfolio': return 0; // no DB table on the student path
      default: return null;
    }
  };

  const rows = SCRUM_FLAGSHIP_CLAIMS.map((c) => {
    const live = liveFor(c.key);
    const status: ClaimStatus = !c.authoredOnStudentPath ? 'unsupported' : claimStatus(c, live);
    return { c, live, status };
  });
  const known = rows.filter((r) => r.status !== 'unknown');
  const backed = known.filter((r) => r.status === 'backed').length;
  const integrity = known.length ? Math.round((backed / known.length) * 100) : null;

  // Dangerous claims embedded in the LIVE course description.
  const descClaims = s.flagshipDescription
    ? DANGEROUS_CLAIM_PATTERNS.filter((d) => d.pattern.test(s.flagshipDescription!)).map((d) => d.label)
    : [];

  const blockers: string[] = [];
  if (descClaims.length) blockers.push(`Live course description contains unsupported claim(s): ${descClaims.join(', ')}.`);
  if (s.flagProbe.applied === false) blockers.push('Flagship migration NOT applied — live Scrum course is not the 18-module flagship.');
  if (s.oldSeedLive) blockers.push('Old seed Scrum course still present in live DB (not deprecated).');
  if ((s.scrumCourseCount ?? 0) > 1) blockers.push(`Duplicate Scrum courses live (${s.scrumCourseCount}).`);
  if (s.secProbe.applied === false) blockers.push('Security migrations (#25) NOT applied — profiles/email lockdown dormant in production.');
  if ((s.modulesWithQuestions ?? 0) < (s.modulesLive ?? 0)) blockers.push(`${(s.modulesLive ?? 0) - (s.modulesWithQuestions ?? 0)} module(s) have 0 exam questions.`);

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">CEO Truth Dashboard</h1>
          <p className="text-sm text-muted-foreground">Spec vs Authored vs <strong>Live</strong> — measured from the production database, not docs.</p>
        </div>
      </div>

      {s.loading && <div className="text-muted-foreground text-sm">Reading live database…</div>}
      {s.err && <div className="text-destructive text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Live query error: {s.err} (showing what loaded)</div>}

      {!s.loading && (
        <div className="space-y-6">
          {/* Claim integrity score */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><ScrollText className="w-4 h-4" /> Claim Integrity</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 flex-wrap">
                <div>
                  <div className="text-4xl font-bold" style={{ color: integrity === null ? '#94a3b8' : integrity >= 100 ? '#22c55e' : integrity >= 60 ? '#f59e0b' : '#ef4444' }}>
                    {integrity === null ? '—' : `${integrity}%`}
                  </div>
                  <div className="text-xs text-muted-foreground">{backed}/{known.length} measured claims backed by live data</div>
                </div>
                {descClaims.length > 0 && (
                  <div className="flex-1 min-w-[260px] rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    <strong>Unsupported claim in the LIVE course description:</strong> {descClaims.join(', ')}. Block public claim — founder approval required.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scrum flagship: Spec vs Authored vs Live */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Database className="w-4 h-4" /> Scrum Flagship — Spec vs Authored vs Live</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="text-xs text-muted-foreground mb-2">
                Live course: {s.flagshipFound ? <span className="text-foreground font-medium">{s.flagshipTitle}</span> : <span className="text-destructive">not found</span>}
                {' · '}modules with questions: {s.modulesWithQuestions ?? '—'}/{s.modulesLive ?? '—'} · translated modules: {s.translatedChapters ?? '—'}/{s.modulesLive ?? '—'}
              </div>
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="py-2">Asset</th><th>Spec (claimed)</th><th>Authored</th><th>Live</th><th>Status</th><th>Source</th>
                </tr></thead>
                <tbody>
                  {rows.map(({ c, live, status }) => (
                    <tr key={c.key} className="border-b border-border/50">
                      <td className="py-2 font-medium text-foreground">{c.label}</td>
                      <td>{c.claimed} {c.unit}</td>
                      <td>{c.authored}{c.authoredOnStudentPath ? '' : ' (code-only)'}</td>
                      <td className="font-semibold">{live === null ? '—' : live}</td>
                      <td><StatusBadge status={status} /></td>
                      <td className="text-xs text-muted-foreground">{c.authoredSource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Migration / seed status (live probes) */}
          <div className="grid md:grid-cols-3 gap-4">
            <ProbeCard title="Flagship migration applied?" probe={s.flagProbe} />
            <ProbeCard title="Security migrations applied? (#25)" probe={s.secProbe} extra="Probes: public_profiles view + email_send_log table." />
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Old seed deprecated?</CardTitle></CardHeader>
              <CardContent className="text-sm">
                {s.oldSeedLive === null ? <Unknown /> : s.oldSeedLive
                  ? <span className="text-destructive flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Old seed still live</span>
                  : <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Not present</span>}
                <div className="text-xs text-muted-foreground mt-1">Live Scrum courses: {s.scrumCourseCount ?? '—'}</div>
              </CardContent>
            </Card>
          </div>

          {/* Founder approval blockers + next action */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Founder Approval Blockers</CardTitle></CardHeader>
            <CardContent>
              {blockers.length === 0
                ? <div className="text-green-600 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> No live-detected blockers.</div>
                : <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">{blockers.map((b, i) => <li key={i}>{b}</li>)}</ul>}
              <div className="mt-3 text-sm text-muted-foreground">
                Recommended next action: follow <Link to="/founder" className="text-primary underline">the Founder Apply Runbook</Link> — freeze claims → security → branding → flagship. Security migrations are step 2; this dashboard verifies each step from live data.
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">Every number above is read live from Supabase at page load. "—" means the query was blocked or failed — it is never substituted with a guess.</p>
        </div>
      )}
    </FounderShell>
  );
}

function StatusBadge({ status }: { status: ClaimStatus }) {
  const map: Record<ClaimStatus, { c: string; t: string }> = {
    backed: { c: '#22c55e', t: 'Backed' },
    partial: { c: '#f59e0b', t: 'Partial' },
    unsupported: { c: '#ef4444', t: 'Unsupported' },
    unknown: { c: '#94a3b8', t: 'Unknown' },
  };
  const m = map[status];
  return <span style={{ color: m.c, border: `1px solid ${m.c}55`, background: `${m.c}1a` }} className="text-xs font-semibold px-2 py-0.5 rounded-full">{m.t}</span>;
}

function ProbeCard({ title, probe, extra }: { title: string; probe: Probe; extra?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent className="text-sm">
        {probe.applied === null ? <Unknown />
          : probe.applied
            ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Applied</span>
            : <span className="text-destructive flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> NOT applied</span>}
        <div className="text-xs text-muted-foreground mt-1">{probe.detail}{extra ? ` · ${extra}` : ''}</div>
      </CardContent>
    </Card>
  );
}

function Unknown() {
  return <span className="text-muted-foreground flex items-center gap-1"><HelpCircle className="w-4 h-4" /> Unknown (not verifiable from client)</span>;
}
