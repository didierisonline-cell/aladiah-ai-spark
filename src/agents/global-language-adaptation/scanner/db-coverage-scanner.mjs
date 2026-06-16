#!/usr/bin/env node
/**
 * Global Language Adaptation Agent — DB Content Coverage Scanner (Phase 2)
 *
 * READ-ONLY. Scores translation coverage of DATABASE content (not UI strings):
 *   - courses.translations   → surface "course-titles" (+ body)
 *   - chapters.translations  → surfaces "lesson-titles" + "lesson-body"
 *   - videos.translations    → surfaces "lesson-titles" + "lesson-body"
 *   - quiz_questions         → surfaces "quiz-questions/answers/feedback"
 *       (probes for a `translations` column; if absent, reports schema-pending → 0%
 *        for every non-baseline language, per database-migration-plan.md)
 *
 * It performs ONLY SELECTs through the public PostgREST endpoint using the repo's
 * publishable (anon) key — the same key the browser app uses for reads. It never writes.
 * Per repo canon: no DB writes, no SQL applied.
 *
 * Network: if Supabase is unreachable (sandboxed/offline), the script degrades gracefully,
 * writes a report noting "db-unreachable", and exits 0 (so it is safe in CI without creds).
 *
 * Usage:
 *   node src/agents/global-language-adaptation/scanner/db-coverage-scanner.mjs \
 *     --json .../reports/db-coverage.json --md .../reports/db-coverage.md
 *   Env overrides: SUPABASE_URL, SUPABASE_KEY (else read from integrations/supabase/client.ts)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = join(HERE, '..', '..', '..', '..');
const CLIENT_TS = join(REPO_ROOT, 'src', 'integrations', 'supabase', 'client.ts');

const args = process.argv.slice(2);
const getArg = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };

// Languages we measure, English + French first (primary), Basaa add-on last.
// Mirrors PRIORITY_ORDER in global-language-config.ts (kept inline so this script is
// self-contained / runnable without a TS loader).
const BASELINE = 'en';
const PRIORITY_ORDER = [
  'en', 'fr',                                  // primary
  'es', 'zh', 'ar', 'de', 'ja', 'pt', 'hi', 'ko', 'it',
  'ru', 'nl', 'pl', 'tr', 'sw', 'yo', 'ha', 'ig', 'vi', 'th', // secondary
  'bas',                                       // add-on (Basaa)
];
const NON_BASELINE = PRIORITY_ORDER.filter((l) => l !== BASELINE);

/** Read SUPABASE url + key from env, else parse the fallbacks out of client.ts. */
function resolveCredentials() {
  let url = process.env.SUPABASE_URL;
  let key = process.env.SUPABASE_KEY;
  if (!url || !key) {
    const src = readFileSync(CLIENT_TS, 'utf8');
    url = url || src.match(/SUPABASE_URL\s*=\s*[^|]*\|\|\s*'([^']+)'/)?.[1] || src.match(/'(https:\/\/[a-z0-9]+\.supabase\.co)'/)?.[1];
    key = key || src.match(/SUPABASE_PUBLISHABLE_KEY\s*=\s*[^|]*\|\|\s*'([^']+)'/)?.[1];
  }
  return { url, key };
}

/** True when a 403 body is the environment egress proxy, not a Supabase/RLS response. */
function isEgressBlock(status, body) {
  return status === 403 && /not in allowlist|egress|network/i.test(body || '');
}

async function rest(url, key, path) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  return res;
}

/**
 * Extract the set of languages that have a non-empty value for a given sub-field across a
 * `translations` JSON column. Handles two common shapes:
 *   A) { en: { title, description }, fr: {...} }   (lang-keyed)
 *   B) { title: { en, fr }, description: {...} }    (field-keyed)
 * Returns per-language counts of rows that have a non-empty `field`.
 */
function scoreTranslations(rows, field) {
  const counts = Object.fromEntries(PRIORITY_ORDER.map((l) => [l, 0]));
  let total = 0;
  for (const row of rows) {
    total++;
    const t = row.translations;
    if (!t || typeof t !== 'object') continue;
    for (const lang of PRIORITY_ORDER) {
      let val;
      if (t[lang] && typeof t[lang] === 'object') val = t[lang][field];        // shape A
      else if (t[field] && typeof t[field] === 'object') val = t[field][lang]; // shape B
      if (typeof val === 'string' && val.trim().length > 0) counts[lang]++;
    }
  }
  return { total, counts };
}

function pct(n, d) { return d ? +((n / d) * 100).toFixed(1) : 0; }

function buildSurfaceRows(label, surface, total, counts) {
  // Baseline defines the denominator of "translatable items present in the source language".
  const denom = counts[BASELINE] || total;
  return NON_BASELINE.map((lang) => ({
    language: lang,
    surface,
    total_strings: denom,
    translated_strings: Math.min(counts[lang], denom),
    missing_strings: Math.max(denom - counts[lang], 0),
    coverage_pct: lang === BASELINE ? 100 : pct(counts[lang], denom),
    source_table: label,
  }));
}

async function main() {
  const { url, key } = resolveCredentials();
  const report = {
    generatedAt: new Date().toISOString(),
    scannerVersion: '0.2-db',
    scope: 'db-content (courses/chapters/videos translations + quiz_questions probe)',
    baseline: BASELINE,
    supabaseUrl: url ? url.replace(/https:\/\//, '') : null,
    reachable: true,
    tables: {},
    perSurface: [],
    notes: [],
  };

  if (!url || !key) {
    report.reachable = false;
    report.notes.push('No Supabase credentials resolved; cannot scan DB content.');
    return finish(report);
  }

  // Probe each content table.
  const contentSpecs = [
    { table: 'courses', select: 'id,translations', fields: [['title', 'course-titles'], ['description', 'lesson-body']] },
    { table: 'chapters', select: 'id,translations', fields: [['title', 'lesson-titles'], ['description', 'lesson-body']] },
    { table: 'videos', select: 'id,translations', fields: [['title', 'lesson-titles'], ['description', 'lesson-body']] },
  ];

  for (const spec of contentSpecs) {
    try {
      const res = await rest(url, key, `${spec.table}?select=${spec.select}`);
      if (!res.ok) {
        const body = (await res.text()).slice(0, 200);
        if (isEgressBlock(res.status, body)) {
          report.reachable = false;
          report.tables[spec.table] = { ok: false, status: res.status, error: 'egress-blocked' };
          report.notes.push(
            'Supabase host is NOT reachable from this environment (network egress allowlist). ' +
            'Add the Supabase host to the environment egress settings, or run this scanner ' +
            'where outbound access to *.supabase.co is allowed. No DB coverage was measured.'
          );
          break;
        }
        report.tables[spec.table] = { ok: false, status: res.status, error: body };
        report.notes.push(`${spec.table}: read failed (status ${res.status}) — likely RLS or column.`);
        continue;
      }
      const rows = await res.json();
      report.tables[spec.table] = { ok: true, rows: rows.length };
      for (const [field, surface] of spec.fields) {
        const { total, counts } = scoreTranslations(rows, field);
        report.perSurface.push(...buildSurfaceRows(spec.table, surface, total, counts).map((r) => ({ ...r, field })));
      }
    } catch (err) {
      report.reachable = false;
      report.tables[spec.table] = { ok: false, error: String(err.message || err) };
      report.notes.push(`Network error reaching Supabase: ${String(err.message || err)}`);
      break;
    }
  }

  // Quiz: probe for a translations column (per migration plan it does not exist yet).
  if (report.reachable) {
    try {
      const res = await rest(url, key, 'quiz_questions?select=id,translations&limit=1');
      if (res.ok) {
        const rows = await res.json();
        report.tables.quiz_questions = { ok: true, hasTranslationsColumn: true, sample: rows.length };
        report.notes.push('quiz_questions.translations column exists — quiz coverage now scannable.');
      } else {
        const body = (await res.text()).slice(0, 200);
        if (isEgressBlock(res.status, body)) {
          report.reachable = false;
          report.tables.quiz_questions = { ok: false, status: res.status, error: 'egress-blocked' };
          report.notes.push('quiz_questions probe: Supabase host not reachable (egress allowlist).');
          return finish(report);
        }
        const columnMissing = res.status === 400 || /column .*translations.* does not exist/i.test(body);
        report.tables.quiz_questions = { ok: false, hasTranslationsColumn: false, status: res.status };
        report.notes.push(
          columnMissing
            ? 'quiz_questions has NO translations column → quizzes report 0% for non-baseline languages until the additive migration (database-migration-plan.md) is applied.'
            : `quiz_questions probe failed (status ${res.status}).`
        );
        // Record quiz surfaces as 0% / schema-pending.
        for (const surface of ['quiz-questions', 'quiz-answers', 'quiz-feedback']) {
          for (const lang of NON_BASELINE) {
            report.perSurface.push({
              language: lang, surface, total_strings: null, translated_strings: 0,
              missing_strings: null, coverage_pct: 0, source_table: 'quiz_questions',
              field: 'schema-pending',
            });
          }
        }
      }
    } catch (err) {
      report.notes.push(`quiz_questions probe network error: ${String(err.message || err)}`);
    }
  }

  finish(report);
}

function finish(report) {
  // Aggregate per-language overall (mean of blocking DB surfaces present).
  const byLang = {};
  for (const r of report.perSurface) {
    (byLang[r.language] ||= []).push(r.coverage_pct);
  }
  report.perLanguageDbOverall = PRIORITY_ORDER.filter((l) => l !== BASELINE).map((lang) => {
    const xs = byLang[lang] || [];
    // null = not measured (e.g. DB unreachable); a number = measured coverage.
    const avg = xs.length ? +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : null;
    return { language: lang, dbCoveragePct: avg, surfacesMeasured: xs.length };
  });

  const jsonOut = getArg('--json');
  const mdOut = getArg('--md');
  if (jsonOut) writeFileSync(jsonOut, JSON.stringify(report, null, 2));
  if (mdOut) writeFileSync(mdOut, toMarkdown(report));

  // Console summary
  console.log(`DB scanner v${report.scannerVersion} — reachable: ${report.reachable}`);
  console.log('Tables:', JSON.stringify(report.tables));
  if (report.perLanguageDbOverall?.length) {
    console.log('Per-language DB content coverage (primary first):');
    for (const l of report.perLanguageDbOverall) {
      const v = l.dbCoveragePct === null ? '  n/a' : `${String(l.dbCoveragePct).padStart(4)}%`;
      console.log(`  ${l.language.padEnd(3)} ${v}  (${l.surfacesMeasured} surfaces)`);
    }
  }
  for (const n of report.notes) console.log('NOTE:', n);
  if (!jsonOut && !mdOut) console.log('\n(Tip: pass --json and --md to write reports.)');
}

function toMarkdown(r) {
  const overall = (r.perLanguageDbOverall || [])
    .map((l) => `| ${l.language} | ${l.dbCoveragePct === null ? 'n/a (not measured)' : l.dbCoveragePct + '%'} | ${l.surfacesMeasured} |`).join('\n');
  const surfaceRows = r.perSurface
    .map((s) => `| ${s.language} | ${s.surface} | ${s.source_table} | ${s.translated_strings ?? '—'} | ${s.total_strings ?? '—'} | ${s.coverage_pct}% |`)
    .join('\n');
  return `# DB Content Coverage Report

_Generated ${r.generatedAt} · scanner v${r.scannerVersion}_
_Scope: ${r.scope}_
_Supabase: ${r.supabaseUrl ?? 'n/a'} · reachable: ${r.reachable}_

## Tables probed
\`\`\`json
${JSON.stringify(r.tables, null, 2)}
\`\`\`

## Per-language DB content coverage (English/French first, Basaa add-on last)

| Lang | DB coverage % | Surfaces measured |
|---|---|---|
${overall || '_no data (DB unreachable or empty)_'}

## Per-surface detail

| Lang | Surface | Table | Translated | Total | Coverage % |
|---|---|---|---|---|---|
${surfaceRows || '_no rows_'}

## Notes
${r.notes.map((n) => `- ${n}`).join('\n') || '- none'}

> Coverage denominator = count of rows whose **baseline (en)** field is non-empty (the set
> of items that actually need translating). Quiz surfaces are schema-pending until the
> additive \`quiz_questions.translations\` migration is applied.
`;
}

main().catch((e) => { console.error('Fatal:', e); process.exit(0); });
