import Header from '@/components/Header';
import FounderNav from '@/components/founder/FounderNav';
import { Languages, Database, FileWarning, CheckCircle2, AlertTriangle, Wifi, WifiOff, Clock } from 'lucide-react';
import { languageNames } from '@/contexts/LanguageContext';
import {
  PRIORITY_ORDER, LANGUAGE_PRIORITY, languageTier,
} from '@/agents/global-language-adaptation/global-language-config';
import baselineReport from '@/agents/global-language-adaptation/scanner/reports/baseline-coverage.json';
import dbReport from '@/agents/global-language-adaptation/scanner/reports/db-coverage.json';

/**
 * /founder/language-quality — Language Quality Command Center (founder-only via <FounderRoute>).
 *
 * Founder visibility into how completely each language adapts the platform. Reads the
 * committed scanner reports (UI-string coverage + DB content coverage) so it renders the
 * real baseline even when Supabase egress is blocked. It is deliberate about distinguishing
 * "not measured" (scanner couldn't reach the DB) from "0% coverage" (measured, untranslated).
 *
 * Priority: English + French first (primary launch), then secondary languages, then Basaa
 * as a strategic add-on — Basaa must not block the core launch.
 */

type LangCode = string;

const LANG_NAME = (code: LangCode): string =>
  (languageNames as Record<string, string>)[code] || (code === 'bas' ? 'Basaa' : code);

const TIER_LABEL: Record<string, string> = {
  primary: 'Priority — launch',
  secondary: 'Secondary',
  addon: 'Add-on',
};
const TIER_STYLE: Record<string, string> = {
  primary: 'bg-primary/15 text-primary',
  secondary: 'bg-muted text-muted-foreground',
  addon: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
};

// ---- UI-string coverage (from baseline-coverage.json) ----
const uiByLang: Record<string, any> = Object.fromEntries(
  (baselineReport.perLanguage || []).map((l: any) => [l.language, l]),
);

// ---- DB content coverage (from db-coverage.json) ----
const dbReachable: boolean = !!dbReport.reachable;
const dbOverallByLang: Record<string, any> = Object.fromEntries(
  (dbReport.perLanguageDbOverall || []).map((l: any) => [l.language, l]),
);
/** coverage for a (language, surface) pair from the DB report's perSurface rows. */
function dbSurface(lang: string, surface: string): { measured: boolean; pct: number | null; missing: number | null } {
  const row = (dbReport.perSurface || []).find((s: any) => s.language === lang && s.surface === surface);
  if (!row) return { measured: false, pct: null, missing: null };
  return { measured: true, pct: row.coverage_pct, missing: row.missing_strings };
}

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');

/** A coverage value that knows the difference between "not measured" and a real number. */
function CoverageCell({ pct, measured, pendingReason }: { pct: number | null; measured: boolean; pendingReason?: string }) {
  if (!measured) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground italic" title={pendingReason}>
        <AlertTriangle className="w-3 h-3" /> not measured
      </span>
    );
  }
  const v = pct ?? 0;
  const tone = v >= 100 ? 'text-emerald-600 dark:text-emerald-400' : v >= 80 ? 'text-foreground' : v >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
  return (
    <div className="flex items-center gap-2 min-w-[8rem]">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${v >= 100 ? 'bg-emerald-500' : v >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.max(v, 2)}%` }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${tone}`}>{v}%</span>
    </div>
  );
}

function LanguageRow({ code }: { code: LangCode }) {
  const tier = languageTier(code as any);
  const ui = uiByLang[code];
  const uiMeasured = !!ui; // Basaa is not in LanguageContext yet → not measured here.
  const db = dbOverallByLang[code];
  const dbMeasured = dbReachable && db && db.surfacesMeasured > 0;
  return (
    <tr className="border-t border-border/60">
      <td className="py-2.5 pr-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{LANG_NAME(code)}</span>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{code}</span>
          {code === 'bas' && (
            <span className="text-[10px] rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1.5 py-0.5">add-on</span>
          )}
        </div>
      </td>
      <td className="py-2.5 pr-4">
        <span className={`text-[10px] rounded-full px-2 py-0.5 ${TIER_STYLE[tier]}`}>{TIER_LABEL[tier]}</span>
      </td>
      <td className="py-2.5 pr-4">
        <CoverageCell
          pct={uiMeasured ? ui.keyCoveragePct : null}
          measured={uiMeasured}
          pendingReason={code === 'bas' ? 'Basaa is not yet wired into LanguageContext (i18n). Pending.' : undefined}
        />
      </td>
      <td className="py-2.5 pr-4">
        <CoverageCell
          pct={dbMeasured ? db.dbCoveragePct : null}
          measured={!!dbMeasured}
          pendingReason={!dbReachable ? 'DB not reachable from the scan environment (Supabase egress allowlist).' : 'No DB rows scored yet.'}
        />
      </td>
      <td className="py-2.5 pr-2 text-right">
        {code === 'bas'
          ? <span className="text-xs text-amber-600 dark:text-amber-400">pending</span>
          : uiMeasured && ui.keyCoveragePct >= 100 && dbMeasured && db.dbCoveragePct >= 100
            ? <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> eligible</span>
            : <span className="text-xs text-muted-foreground">incomplete</span>}
      </td>
    </tr>
  );
}

function TierTable({ title, codes }: { title: string; codes: LangCode[] }) {
  if (!codes.length) return null;
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="py-2 px-3 font-medium">Language</th>
              <th className="py-2 pr-4 font-medium">Tier</th>
              <th className="py-2 pr-4 font-medium">UI strings</th>
              <th className="py-2 pr-4 font-medium">DB content</th>
              <th className="py-2 pr-2 font-medium text-right">Active?</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => <LanguageRow key={c} code={c} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Completeness by table (content tables) ----
const CONTENT_TABLES: { table: string; surfaces: string[]; schemaPending?: boolean; note?: string }[] = [
  { table: 'courses', surfaces: ['course-titles', 'lesson-body'] },
  { table: 'chapters', surfaces: ['lesson-titles', 'lesson-body'] },
  { table: 'videos', surfaces: ['lesson-titles', 'lesson-body'] },
  { table: 'quiz_questions', surfaces: ['quiz-questions', 'quiz-answers', 'quiz-feedback'], schemaPending: true, note: 'Needs additive quiz_questions.translations migration.' },
];

function TableStatus() {
  // Focus the by-table view on the two launch languages.
  const focus = ['fr', 'en'];
  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground">
            <th className="py-2 px-3 font-medium">Content table</th>
            <th className="py-2 pr-4 font-medium">Surfaces</th>
            <th className="py-2 pr-4 font-medium">French</th>
            <th className="py-2 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {CONTENT_TABLES.map((t) => {
            const tableInfo: any = (dbReport.tables as any)[t.table];
            const egressBlocked = tableInfo?.error === 'egress-blocked' || !dbReachable;
            // Use the first surface to represent the table for the focus language (fr).
            const cov = dbSurface('fr', t.surfaces[0]);
            return (
              <tr key={t.table} className="border-t border-border/60">
                <td className="py-2.5 px-3 font-mono text-xs text-foreground">{t.table}</td>
                <td className="py-2.5 pr-4 text-xs text-muted-foreground">{t.surfaces.join(', ')}</td>
                <td className="py-2.5 pr-4">
                  <CoverageCell pct={cov.pct} measured={cov.measured} />
                </td>
                <td className="py-2.5 pr-4 text-xs">
                  {t.schemaPending
                    ? <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400" title={t.note}><FileWarning className="w-3.5 h-3.5" /> schema-pending</span>
                    : egressBlocked
                      ? <span className="inline-flex items-center gap-1 text-muted-foreground"><WifiOff className="w-3.5 h-3.5" /> not measured (egress)</span>
                      : <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Wifi className="w-3.5 h-3.5" /> measured</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone }: { icon: any; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Icon className="w-3.5 h-3.5" /> {label}</div>
      <div className={`text-xl font-bold ${tone || 'text-foreground'}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

const FounderLanguageQuality = () => {
  const primary = LANGUAGE_PRIORITY.primary as string[];
  const secondary = (PRIORITY_ORDER as string[]).filter((c) => languageTier(c as any) === 'secondary');
  const addon = LANGUAGE_PRIORITY.addon as string[];

  const missingRefs = baselineReport.referencedKeysMissingFromBaseline?.count ?? 0;
  const hardcoded = baselineReport.hardcodedEnglishCandidates?.total ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[88rem] mx-auto px-4 py-8">
        <FounderNav />

        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Languages className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Language Quality Command Center</h1>
              <p className="text-sm text-muted-foreground">Full-platform translation coverage. English &amp; French lead; Basaa is a strategic add-on.</p>
            </div>
          </div>
        </div>

        {/* Scan status + reachability */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Clock} label="UI strings scan" value={`${baselineReport.baseline?.keys ?? 0} keys`} sub={`baseline · ${fmtDate(baselineReport.generatedAt)}`} />
          <StatCard icon={Database} label="DB content scan" value={dbReachable ? 'measured' : 'not measured'} sub={fmtDate(dbReport.generatedAt)} tone={dbReachable ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} />
          <StatCard icon={dbReachable ? Wifi : WifiOff} label="Supabase reachability" value={dbReachable ? 'reachable' : 'egress blocked'} sub={dbReachable ? 'live DB scored' : 'add host to egress allowlist'} tone={dbReachable ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} />
          <StatCard icon={FileWarning} label="UI gaps to triage" value={`${missingRefs} + ${hardcoded}`} sub="dangling keys + hardcoded candidates" tone="text-red-600 dark:text-red-400" />
        </div>

        {/* Legend: not measured vs 0% */}
        <div className="mb-6 rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground flex flex-wrap gap-x-6 gap-y-1">
          <span className="inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> <strong className="text-foreground">not measured</strong> — the scanner could not reach the data (e.g. Supabase egress). Unknown, not zero.</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-1.5 rounded-full bg-red-500" /> <strong className="text-foreground">0%</strong> — measured and untranslated.</span>
          <span className="inline-flex items-center gap-1"><FileWarning className="w-3 h-3" /> <strong className="text-foreground">schema-pending</strong> — needs a migration before it can be measured.</span>
        </div>

        {/* Coverage by language, priority order */}
        <TierTable title="Priority 1–2 · English &amp; French (launch languages)" codes={primary} />
        <TierTable title="Priority 3 · Spanish & other major languages" codes={secondary} />
        <TierTable title="Add-on · Basaa (strategic — must not block core launch)" codes={addon} />

        {/* Completeness by content table */}
        <div className="mb-2 mt-8 flex items-center gap-2">
          <Database className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Translation completeness by table</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-3">French shown as the lead non-English language. Quiz content is schema-pending until the additive <code className="text-xs">quiz_questions.translations</code> migration is applied.</p>
        <TableStatus />

        {dbReport.notes?.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Last DB scan notes</div>
            <ul className="list-disc pl-5 space-y-0.5">
              {dbReport.notes.map((n: string, i: number) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          Data source: committed scanner reports under <code className="text-xs">src/agents/global-language-adaptation/scanner/reports/</code>.
          Re-run the scanners (and add Supabase to the egress allowlist for live DB scoring) to refresh.
        </p>
      </main>
    </div>
  );
};

export default FounderLanguageQuality;
