import { useEffect, useState } from 'react';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Globe } from 'lucide-react';

/**
 * /founder/localization — Founder Localization Readiness dashboard.
 * Queries the ACTUAL translatable store (courses/chapters/videos.translations JSONB)
 * live and computes per-language coverage + missing counts. Code-tier content
 * (simulations/career paths/resources/certifications) has no DB translation store
 * yet → shown as "code-tier (pipeline pending)". Founder-only via <FounderRoute>.
 */
const LANGS: { code: string; name: string }[] = [
  { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' }, { code: 'pt', name: 'Portuguese' },
  { code: 'de', name: 'German' }, { code: 'ar', name: 'Arabic' }, { code: 'zh', name: 'Chinese' }, { code: 'hi', name: 'Hindi' },
];
const DB_TABLES = ['courses', 'chapters', 'videos'] as const;
const CODE_TIER = ['Simulations', 'Career Paths', 'Resources', 'Certifications'];

type Counts = Record<string, { total: number; missing: Record<string, number> }>;

export default function LocalizationFactory() {
  const [counts, setCounts] = useState<Counts>({});
  const [err, setErr] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const out: Counts = {};
      for (const tbl of DB_TABLES) {
        const { data, error } = await (supabase as any).from(tbl).select('id, translations');
        if (error) { setErr(`${tbl}: ${error.message}`); continue; }
        const total = data.length;
        const missing: Record<string, number> = {};
        for (const { code } of LANGS) {
          missing[code] = data.filter((r: any) => !(r.translations?.[code]?.title?.trim())).length;
        }
        out[tbl] = { total, missing };
      }
      setCounts(out); setLoaded(true);
    })();
  }, []);

  const pct = (tbl: string, lang: string) => {
    const c = counts[tbl]; if (!c || !c.total) return null;
    return Math.round(100 * (c.total - c.missing[lang]) / c.total);
  };
  const overall = (lang: string) => {
    const tot = DB_TABLES.reduce((a, t) => a + (counts[t]?.total || 0), 0);
    const miss = DB_TABLES.reduce((a, t) => a + (counts[t]?.missing[lang] || 0), 0);
    return tot ? Math.round(100 * (tot - miss) / tot) : null;
  };
  const bar = (p: number | null) => (
    <div style={{ height: 6, width: 90, background: 'rgba(255,255,255,.08)', borderRadius: 99, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle' }}>
      <div style={{ height: '100%', width: `${p ?? 0}%`, background: (p ?? 0) >= 100 ? '#22C98A' : (p ?? 0) >= 50 ? '#F5B81A' : '#F0622A' }} />
    </div>
  );

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Globe className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Localization Readiness</h1>
          <p className="text-sm text-muted-foreground">Live per-language coverage from courses/chapters/videos.translations. EN = source.</p>
        </div>
      </div>

      {err && <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-600">Query note: {err}</div>}
      {!loaded && <div className="text-sm text-muted-foreground">Loading live translation data…</div>}

      {loaded && (
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Language</th>
                <th className="px-3 py-2">Overall (DB)</th>
                <th className="px-3 py-2">Missing Courses</th>
                <th className="px-3 py-2">Missing Chapters</th>
                <th className="px-3 py-2">Missing Videos</th>
                {CODE_TIER.map(c => <th key={c} className="px-3 py-2">Missing {c}</th>)}
              </tr>
            </thead>
            <tbody>
              {LANGS.map(({ code, name }) => (
                <tr key={code} className="border-t border-border">
                  <td className="px-3 py-2 font-medium text-foreground">{name} <span className="text-muted-foreground">({code})</span></td>
                  <td className="px-3 py-2 text-center">{bar(overall(code))} <span className="text-xs ml-1">{overall(code) ?? '—'}%</span></td>
                  <td className="px-3 py-2 text-center">{counts.courses?.missing[code] ?? '—'}<span className="text-muted-foreground text-xs">/{counts.courses?.total ?? '—'}</span></td>
                  <td className="px-3 py-2 text-center">{counts.chapters?.missing[code] ?? '—'}<span className="text-muted-foreground text-xs">/{counts.chapters?.total ?? '—'}</span></td>
                  <td className="px-3 py-2 text-center">{counts.videos?.missing[code] ?? '—'}<span className="text-muted-foreground text-xs">/{counts.videos?.total ?? '—'}</span></td>
                  {CODE_TIER.map(c => <td key={c} className="px-3 py-2 text-center text-muted-foreground text-xs">code-tier*</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        * Simulations / Career Paths / Resources / Certifications render from code (no DB translation store yet).
        They become coverable once migrated into the Phase-2 <code>content_i18n</code> pipeline. EN content is the source; a language counts as covered for a row when its <code>translations[lang].title</code> is non-empty.
      </p>
    </FounderShell>
  );
}
