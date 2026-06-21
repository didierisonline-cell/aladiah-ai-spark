import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Languages, CheckCircle2, AlertTriangle, MinusCircle } from 'lucide-react';
import { uiStringCoverage } from '@/contexts/LanguageContext';

// =============================================================================
// /founder/translation — Translation Truth Dashboard (Localization Cell)
// =============================================================================
// Real evidence only. UI-string coverage is computed from LanguageContext at
// render time (no estimate). DB content coverage is probed live. Anything not
// runtime-measurable (hardcoded strings, AI-message coverage) is shown as
// "not measured" — never guessed. No placeholders, no aspirational numbers.
// =============================================================================

const head = async (q: any): Promise<number | null> => {
  try { const { count, error } = await q; return error ? null : (count ?? null); } catch { return null; }
};
const hasNonEn = (t: any) => t && typeof t === 'object' && Object.keys(t).some((k) => k !== 'en' && t[k] && (typeof t[k] === 'object' ? Object.keys(t[k]).length : String(t[k]).trim().length));

export default function TranslationTruth() {
  const cov = useMemo(() => uiStringCoverage(), []);
  const en = cov.find((c) => c.lang === 'en');
  const others = cov.filter((c) => c.lang !== 'en').sort((a, b) => b.pct - a.pct);

  const [db, setDb] = useState<{ loading: boolean; err: string | null;
    flagModules: number | null; flagTranslated: number | null;
    coursesTotal: number | null; coursesTranslated: number | null;
    qTotal: number | null; qTranslated: number | null; }>(
    { loading: true, err: null, flagModules: null, flagTranslated: null, coursesTotal: null, coursesTranslated: null, qTotal: null, qTranslated: null });

  useEffect(() => {
    (async () => {
      try {
        const { data: courses } = await supabase.from('courses').select('id,is_flagship,translations,is_published');
        const all = courses || [];
        const flagship = all.find((c: any) => c.is_flagship) || null;
        const publishedCourses = all.filter((c: any) => c.is_published);
        const coursesTranslated = publishedCourses.filter((c: any) => hasNonEn(c.translations)).length;

        let flagModules: number | null = null, flagTranslated: number | null = null;
        if (flagship) {
          const { data: chaps } = await supabase.from('chapters').select('id,translations').eq('course_id', flagship.id);
          const cs = chaps || [];
          flagModules = cs.length;
          flagTranslated = cs.filter((c: any) => hasNonEn(c.translations)).length;
        }

        // quiz_questions translations on the flagship (live)
        let qTotal: number | null = null, qTranslated: number | null = null;
        if (flagship) {
          const { data: chaps2 } = await supabase.from('chapters').select('id').eq('course_id', flagship.id);
          const chapIds = (chaps2 || []).map((c: any) => c.id);
          if (chapIds.length) {
            const { data: qz } = await supabase.from('quizzes').select('id').in('chapter_id', chapIds);
            const quizIds = (qz || []).map((q: any) => q.id);
            if (quizIds.length) {
              const { data: qq } = await supabase.from('quiz_questions').select('translations').in('quiz_id', quizIds);
              const rows = qq || [];
              qTotal = rows.length;
              qTranslated = rows.filter((r: any) => hasNonEn(r.translations)).length;
            } else { qTotal = 0; qTranslated = 0; }
          }
        }

        setDb({ loading: false, err: null, flagModules, flagTranslated, coursesTotal: publishedCourses.length, coursesTranslated, qTotal, qTranslated });
      } catch (e: any) {
        setDb((p) => ({ ...p, loading: false, err: e?.message || 'probe failed' }));
      }
    })();
  }, []);

  const promised = others.length + 1; // languages offered in the switcher
  const strong = others.filter((c) => c.pct >= 90).length;
  const localizedStrong = others.filter((c) => c.total && c.localized / c.total >= 0.9).length;

  const bar = (pct: number) => (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden w-28">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 90 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444' }} />
    </div>
  );
  const dbPct = (n: number | null, d: number | null) => (n === null || d === null || d === 0) ? null : Math.round((n / d) * 100);
  const DbRow = ({ label, n, d, note }: { label: string; n: number | null; d: number | null; note: string }) => {
    const pct = dbPct(n, d);
    return (
      <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
        <div className="flex-1"><div className="text-sm font-medium text-foreground">{label}</div><div className="text-xs text-muted-foreground">{note}</div></div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end text-xs font-medium">
            {pct === null ? <MinusCircle className="w-4 h-4 text-muted-foreground" />
              : pct >= 90 ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertTriangle className={`w-4 h-4 ${pct >= 50 ? 'text-amber-500' : 'text-destructive'}`} />}
            {pct === null ? 'not measured' : `${pct}%`}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{n ?? '—'}/{d ?? '—'}</div>
        </div>
      </div>
    );
  };

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Languages className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Translation Truth</h1>
          <p className="text-sm text-muted-foreground">Localization Cell — real coverage from code + the live DB. No estimates.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Multilingual claim vs reality</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Languages offered in the switcher: <strong className="text-foreground">{promised}</strong>.
              UI strings ≥90% present: <strong className="text-foreground">{strong}/{others.length}</strong> (vs EN baseline of <strong>{en?.total ?? '—'}</strong> keys).
              Actually-localized ≥90% (differs from EN): <strong className="text-foreground">{localizedStrong}/{others.length}</strong>.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              A global academy can only claim multilingual support when a student can complete a program end-to-end in their language —
              UI strings <em>and</em> lesson/quiz content. Both are shown below; gaps are launch blockers.
            </p>
          </CardContent>
        </Card>

        {/* UI string coverage per language (real, from LanguageContext) */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">UI strings — coverage per language (live from code)</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground mb-2">Baseline: EN = {en?.total ?? '—'} keys. <strong>present</strong> = defined &amp; non-empty; <strong>localized</strong> = value differs from EN (proxy — some legitimately equal EN).</div>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted-foreground border-b border-border"><th className="py-2">Language</th><th>Coverage</th><th>Present</th><th>Localized</th><th>Missing</th></tr></thead>
              <tbody>
                {others.map((c) => (
                  <tr key={c.lang} className="border-b border-border/50">
                    <td className="py-2 font-medium text-foreground">{c.name} <span className="text-xs text-muted-foreground">({c.lang})</span></td>
                    <td><div className="flex items-center gap-2">{bar(c.pct)}<span className="text-xs font-semibold">{c.pct}%</span></div></td>
                    <td className="text-xs">{c.present}/{c.total}</td>
                    <td className="text-xs">{c.localized}</td>
                    <td className={`text-xs ${c.missing > 0 ? 'text-destructive' : 'text-green-600'}`}>{c.missing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* DB content coverage (live) */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Lesson / quiz content — translation coverage (live DB)</CardTitle></CardHeader>
          <CardContent className="pt-0">
            {db.loading && <div className="text-sm text-muted-foreground py-2">Reading live database…</div>}
            {db.err && <div className="text-destructive text-sm py-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {db.err} (shown as "not measured")</div>}
            {!db.loading && <>
              <DbRow label="Scrum flagship modules with non-EN content" n={db.flagTranslated} d={db.flagModules} note="chapters.translations with any non-en key" />
              <DbRow label="Published courses with non-EN metadata" n={db.coursesTranslated} d={db.coursesTotal} note="courses.translations with any non-en key" />
              <DbRow label="Scrum flagship questions with non-EN content" n={db.qTranslated} d={db.qTotal} note="quiz_questions.translations on the flagship" />
            </>}
          </CardContent>
        </Card>

        {/* Not measured */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MinusCircle className="w-4 h-4" /> Not yet measured (no runtime probe)</CardTitle></CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground space-y-1">
            <div>• <strong>Hardcoded strings</strong> in components (text not wrapped in <code>t()</code>) — needs a static source scan; not faked here.</div>
            <div>• <strong>AI-assistant / tutor message</strong> localization — generated at runtime; needs a prompt/language audit.</div>
            <div>• <strong>Simulations / labs / portfolio</strong> content — not on a measurable DB translation field yet.</div>
            <div className="text-xs pt-1">These are real gaps in <em>measurement</em>, not claims of success. Each becomes its own audit.</div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground">
          Company-wide readiness: <Link to="/founder/launch" className="text-primary underline">Launch Readiness</Link> · Claim drift: <Link to="/founder/truth" className="text-primary underline">CEO Truth Dashboard</Link>.
        </div>
      </div>
    </FounderShell>
  );
}
