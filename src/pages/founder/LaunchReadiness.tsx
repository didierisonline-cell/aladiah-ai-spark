import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, ShieldCheck, GraduationCap, Languages, Database, CreditCard, Megaphone, Briefcase, CheckCircle2, AlertTriangle, HelpCircle, MinusCircle } from 'lucide-react';

// =============================================================================
// /founder/launch — Executive Launch Readiness (CEO Command Cell)
// =============================================================================
// One screen, one truth. EVERY number here is read LIVE from the production DB
// at render time, or shown as "not measured" when there is no runtime probe.
// Nothing is fabricated — there are no aspirational percentages. The overall
// score is computed ONLY from measured signals, and says so.
// =============================================================================

type Status = 'backed' | 'partial' | 'gap' | 'unmeasured';
interface Cell {
  key: string;
  cell: string;          // operating-model cell name
  label: string;
  icon: any;
  status: Status;
  kpi: string;           // the live value, or "—"
  detail: string;
}

const head = async (q: any): Promise<number | null> => {
  try { const { count, error } = await q; return error ? null : (count ?? null); } catch { return null; }
};

const FLAGSHIP_TITLE_LIKE = '%scrum master%';

export default function LaunchReadiness() {
  const [loading, setLoading] = useState(true);
  const [cells, setCells] = useState<Cell[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const out: Cell[] = [];
      try {
        // --- Security & Compliance (live: #25 surfaces exist?) ---
        const viewOk = await head(supabase.from('public_profiles' as any).select('user_id', { count: 'exact', head: true }).limit(1));
        const logOk = await head(supabase.from('email_send_log' as any).select('id', { count: 'exact', head: true }).limit(1));
        out.push({
          key: 'security', cell: 'Security & Compliance', label: 'PII RLS + email-abuse lockdown (#25)',
          icon: ShieldCheck,
          status: (viewOk !== null && logOk !== null) ? 'backed' : (viewOk !== null || logOk !== null) ? 'partial' : 'gap',
          kpi: `public_profiles ${viewOk !== null ? '✓' : '✗'} · email_send_log ${logOk !== null ? '✓' : '✗'}`,
          detail: 'Applied to the live DB when both surfaces exist.',
        });

        // --- Curriculum: Scrum flagship (live counts) ---
        const { data: courses } = await supabase.from('courses').select('id,title,is_flagship,is_published');
        const all = courses || [];
        const flagship = all.find((c: any) => c.is_flagship) || null;
        const scrum = all.filter((c: any) => /scrum master/i.test(c.title || ''));
        const publishedScrum = scrum.filter((c: any) => c.is_published).length;
        const oldSeedPublished = scrum.some((c: any) => c.id !== flagship?.id && c.is_published);

        let modules: number | null = null, lessons: number | null = null, quizzes: number | null = null;
        let questions: number | null = null, modsWithQ: number | null = null, translated: number | null = null;
        if (flagship) {
          const { data: chaps } = await supabase.from('chapters').select('id,translations').eq('course_id', flagship.id);
          const chapters = chaps || [];
          modules = chapters.length;
          translated = chapters.filter((c: any) => {
            const t = c.translations || {}; return Object.keys(t).some((k) => k !== 'en' && t[k] && Object.keys(t[k]).length);
          }).length;
          const chapIds = chapters.map((c: any) => c.id);
          if (chapIds.length) {
            lessons = await head(supabase.from('videos').select('id', { count: 'exact', head: true }).in('chapter_id', chapIds));
            const { data: qz } = await supabase.from('quizzes').select('id,chapter_id').in('chapter_id', chapIds).eq('quiz_type', 'chapter_end');
            quizzes = (qz || []).length;
            const quizIds = (qz || []).map((q: any) => q.id);
            if (quizIds.length) {
              const { data: qq } = await supabase.from('quiz_questions').select('quiz_id').in('quiz_id', quizIds);
              questions = (qq || []).length;
              const q2c: Record<string, string> = {}; (qz || []).forEach((q: any) => { q2c[q.id] = q.chapter_id; });
              modsWithQ = new Set((qq || []).map((r: any) => q2c[r.quiz_id]).filter(Boolean)).size;
            } else { questions = 0; modsWithQ = 0; }
          }
        }

        out.push({
          key: 'scrum-structure', cell: 'Curriculum Excellence', label: 'Scrum flagship structure (live)',
          icon: GraduationCap,
          status: modules === null ? 'unmeasured' : modules === 18 ? 'backed' : 'partial',
          kpi: modules === null ? '—' : `${modules} modules · ${lessons ?? '—'} lessons · ${quizzes ?? '—'} quizzes`,
          detail: 'Read from courses/chapters/videos/quizzes for the is_flagship course.',
        });
        out.push({
          key: 'scrum-questions', cell: 'Curriculum Excellence', label: 'Scrum exam questions (live)',
          icon: GraduationCap,
          status: questions === null ? 'unmeasured' : questions === 0 ? 'gap' : (modsWithQ ?? 0) >= (modules ?? 18) ? 'backed' : 'partial',
          kpi: questions === null ? '—' : `${questions} questions · ${modsWithQ ?? '—'}/${modules ?? '—'} modules covered`,
          detail: 'Authored target is 1,080; partial until the full bank is authored + mapped.',
        });
        out.push({
          key: 'integrity', cell: 'Curriculum Excellence', label: 'Published-course integrity (live)',
          icon: Database,
          status: (publishedScrum === 1 && !oldSeedPublished) ? 'backed' : publishedScrum === 0 ? 'gap' : 'partial',
          kpi: `${publishedScrum} published Scrum course(s)${oldSeedPublished ? ' · old seed still published' : ''}`,
          detail: 'Exactly one published flagship; old seeds unpublished (not deleted).',
        });

        // --- Localization (live: Scrum chapter translation coverage) ---
        out.push({
          key: 'i18n-scrum', cell: 'Localization', label: 'Scrum content translation coverage (live)',
          icon: Languages,
          status: translated === null ? 'unmeasured' : translated === 0 ? 'gap' : translated >= (modules ?? 18) ? 'backed' : 'partial',
          kpi: translated === null ? '—' : `${translated}/${modules ?? '—'} modules have non-EN content`,
          detail: 'Counts chapters.translations with any non-en key. UI-string coverage is separate (not measured here).',
        });

        // --- New programs (live: are PM/BA/Cyber published?) ---
        const prog = (re: RegExp) => all.filter((c: any) => re.test(c.title || '') && c.is_published).length;
        const pm = prog(/project manage/i), ba = prog(/business analy/i), cyber = prog(/cybersecurity|cyber security/i);
        out.push({
          key: 'new-programs', cell: 'Curriculum Excellence', label: 'PM / BA / Cyber programs (live, published)',
          icon: GraduationCap,
          status: (pm + ba + cyber) > 0 ? 'partial' : 'gap',
          kpi: `PM ${pm} · BA ${ba} · Cyber ${cyber} published`,
          detail: 'Per the roadmap these come AFTER Scrum is complete.',
        });

        setCells(out);
      } catch (e: any) {
        setErr(e?.message || 'probe failed');
        setCells(out);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Cells with no runtime probe available from the client — shown honestly as
  // "not measured" rather than guessed.
  const unmeasured: Cell[] = [
    { key: 'payment', cell: 'Platform Engineering', label: 'Stripe payment flow (free→lock→upgrade→webhook)', icon: CreditCard, status: 'unmeasured', kpi: 'not measured', detail: 'Needs an end-to-end runtime test harness — no client probe.' },
    { key: 'ui-i18n', cell: 'Localization', label: 'UI string / portal / messages translation', icon: Languages, status: 'unmeasured', kpi: 'not measured', detail: 'Needs a hardcoded-string + language-QA audit (separate Localization Cell task).' },
    { key: 'employer', cell: 'Employer Outcomes', label: 'Resume / interview / portfolio / placement', icon: Briefcase, status: 'unmeasured', kpi: 'not measured', detail: 'No readiness probe yet.' },
    { key: 'marketing', cell: 'Marketing & Growth', label: 'YouTube / LinkedIn / SEO pipeline', icon: Megaphone, status: 'unmeasured', kpi: 'not measured', detail: 'No readiness probe yet.' },
  ];

  const measured = cells.filter((c) => c.status !== 'unmeasured');
  const backed = measured.filter((c) => c.status === 'backed').length;
  const score = measured.length ? Math.round((backed / measured.length) * 100) : null;

  const StatusIcon = ({ s }: { s: Status }) =>
    s === 'backed' ? <CheckCircle2 className="w-4 h-4 text-green-600" />
    : s === 'partial' ? <AlertTriangle className="w-4 h-4 text-amber-500" />
    : s === 'gap' ? <AlertTriangle className="w-4 h-4 text-destructive" />
    : <MinusCircle className="w-4 h-4 text-muted-foreground" />;

  const Row = ({ c }: { c: Cell }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <c.icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{c.label}</div>
        <div className="text-xs text-muted-foreground">{c.cell} · {c.detail}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1.5 justify-end text-xs font-medium">
          <StatusIcon s={c.status} /> {c.status === 'unmeasured' ? 'not measured' : c.status}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{c.kpi}</div>
      </div>
    </div>
  );

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Gauge className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Launch Readiness</h1>
          <p className="text-sm text-muted-foreground">CEO Command Cell — measured live from the production database. No fabricated metrics.</p>
        </div>
      </div>

      {loading && <div className="text-muted-foreground text-sm">Reading live database…</div>}
      {err && <div className="text-destructive text-sm flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4" /> Some probes failed: {err} (showing what loaded; failures read "not measured").</div>}

      {!loading && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Gauge className="w-4 h-4" /> Measured Readiness</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 flex-wrap">
                <div className="text-4xl font-bold" style={{ color: score === null ? '#94a3b8' : score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {score === null ? '—' : `${score}%`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {backed}/{measured.length} <strong>measured</strong> signals backed.
                  This is <strong>not</strong> a launch % — {unmeasured.length} areas (payment, UI i18n, employer, marketing) are
                  <strong> not yet measured</strong> and excluded. A real launch number needs probes for those.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Measured signals (live)</CardTitle></CardHeader>
            <CardContent className="pt-0">{measured.map((c) => <Row key={c.key} c={c} />)}</CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Not yet measured</CardTitle></CardHeader>
            <CardContent className="pt-0">{unmeasured.map((c) => <Row key={c.key} c={c} />)}</CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            Question-level claim drift (e.g. live course description vs reality) lives on the{' '}
            <Link to="/founder/truth" className="text-primary underline">CEO Truth Dashboard</Link>.
            Curriculum-by-program detail is on{' '}
            <Link to="/founder/readiness" className="text-primary underline">Curriculum Readiness</Link>.
          </div>
        </div>
      )}
    </FounderShell>
  );
}
