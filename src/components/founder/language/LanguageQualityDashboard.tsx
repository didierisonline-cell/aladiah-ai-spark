import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { languageNames } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, AlertTriangle } from 'lucide-react';

/**
 * Language Quality Command Center (founder-only body).
 *
 * Reads the language-adaptation registry tables and renders one row per
 * language with coverage %, missing-content counts, the vocabulary review
 * funnel, and last scan date. The Phase-1 migration is applied by hand, so this
 * component is defensive: if the tables don't exist yet it shows a calm
 * "run the migration" state instead of crashing the founder portal.
 */

interface LangRow {
  language: string;
  coverage: number | null;
  lastScan: string | null;
  isActive: boolean;
  missingStrings: number;
  missingLessons: number;
  missingQuizzes: number;
  missingDiagrams: number;
  pendingVocab: number;
  approvedVocab: number;
  rejectedVocab: number;
}

// The new tables are not in the generated Database types until they are created
// and types regenerated; cast through `any` so the build stays green.
const db = supabase as unknown as {
  from: (t: string) => any;
};

function name(code: string): string {
  return (languageNames as Record<string, string>)[code] ?? code;
}

const LanguageQualityDashboard = () => {
  const [rows, setRows] = useState<LangRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [scores, missing, vocab] = await Promise.all([
          db.from('language_quality_scores').select('*'),
          db.from('language_missing_translations').select('language, miss_count, resolved'),
          db.from('language_vocabulary_entries').select('language, status'),
        ]);

        if (scores.error || missing.error || vocab.error) {
          if (!cancelled) setNeedsMigration(true);
          return;
        }

        // Latest score row per language (by scan_date).
        const latest = new Map<string, any>();
        for (const s of scores.data ?? []) {
          const prev = latest.get(s.language);
          if (!prev || String(s.scan_date) > String(prev.scan_date)) latest.set(s.language, s);
        }

        const missByLang = new Map<string, number>();
        for (const m of missing.data ?? []) {
          if (m.resolved) continue;
          missByLang.set(m.language, (missByLang.get(m.language) ?? 0) + (m.miss_count ?? 1));
        }

        const vocabByLang = new Map<string, { p: number; a: number; r: number }>();
        for (const v of vocab.data ?? []) {
          const e = vocabByLang.get(v.language) ?? { p: 0, a: 0, r: 0 };
          if (v.status === 'approved') e.a += 1;
          else if (v.status === 'rejected') e.r += 1;
          else e.p += 1; // unreviewed / ai_reviewed / human_reviewed
          vocabByLang.set(v.language, e);
        }

        const langs = new Set<string>([
          ...Object.keys(languageNames),
          ...latest.keys(),
          ...missByLang.keys(),
          ...vocabByLang.keys(),
        ]);

        const built: LangRow[] = Array.from(langs).map((code) => {
          const s = latest.get(code);
          const v = vocabByLang.get(code) ?? { p: 0, a: 0, r: 0 };
          return {
            language: code,
            coverage: s ? Number(s.coverage_percent) : null,
            lastScan: s ? String(s.scan_date) : null,
            isActive: Boolean(s?.is_active),
            missingStrings: missByLang.get(code) ?? (s?.missing_strings ?? 0),
            missingLessons: s?.missing_lessons ?? 0,
            missingQuizzes: s?.missing_quizzes ?? 0,
            missingDiagrams: s?.missing_diagrams ?? 0,
            pendingVocab: v.p,
            approvedVocab: v.a,
            rejectedVocab: v.r,
          };
        });

        built.sort((a, b) => (a.coverage ?? -1) - (b.coverage ?? -1));
        if (!cancelled) setRows(built);
      } catch {
        if (!cancelled) setNeedsMigration(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Globe className="w-5 h-5 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Language Quality Command Center</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Full-platform translation coverage, missing-content registry, and the
        student-sourced vocabulary review funnel — per language.
      </p>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {!loading && needsMigration && (
        <Card>
          <CardContent className="p-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Language tables not found.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Apply <code>supabase/migrations/20260616000000_language_adaptation.sql</code> by
                hand in Supabase, then reload. This dashboard activates automatically once the
                <code> language_*</code> tables exist.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !needsMigration && (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language</TableHead>
                  <TableHead className="text-right">Coverage</TableHead>
                  <TableHead className="text-right">Missing strings</TableHead>
                  <TableHead className="text-right">Lessons</TableHead>
                  <TableHead className="text-right">Quizzes</TableHead>
                  <TableHead className="text-right">Diagrams</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-right">Approved</TableHead>
                  <TableHead className="text-right">Rejected</TableHead>
                  <TableHead>Last scan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.language}>
                    <TableCell className="font-medium">
                      {name(r.language)}{' '}
                      <span className="text-muted-foreground text-xs">({r.language})</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {r.coverage == null ? '—' : `${r.coverage}%`}
                    </TableCell>
                    <TableCell className="text-right">{r.missingStrings}</TableCell>
                    <TableCell className="text-right">{r.missingLessons}</TableCell>
                    <TableCell className="text-right">{r.missingQuizzes}</TableCell>
                    <TableCell className="text-right">{r.missingDiagrams}</TableCell>
                    <TableCell className="text-right">{r.pendingVocab}</TableCell>
                    <TableCell className="text-right">{r.approvedVocab}</TableCell>
                    <TableCell className="text-right">{r.rejectedVocab}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {r.lastScan ?? 'never'}
                    </TableCell>
                    <TableCell>
                      {r.isActive ? (
                        <Badge className="bg-green-600 hover:bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Incomplete</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        Coverage is produced by the Translation Coverage Scanner
        (<code>src/agents/global-language-adaptation/scanner</code>). A language is
        marked <strong>Active</strong> only when every completeness dimension reaches 100%.
      </p>
    </div>
  );
};

export default LanguageQualityDashboard;
