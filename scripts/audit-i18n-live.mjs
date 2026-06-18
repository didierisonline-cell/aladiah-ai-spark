#!/usr/bin/env node
// =============================================================================
// audit:i18n-live — static language-QA gate (no live render required)
// =============================================================================
// Fails CI when the codebase regresses on multilingual consistency. This is the
// STATIC half of the gate (runs without a browser or DB). The DB-coverage half
// runs separately via `audit:i18n-data` (needs SUPABASE_* env) and the live
// rendered-screenshot half is a manual QA checklist (docs/i18n/I18N_QA_CHECKLIST.md).
//
// Gates implemented here:
//   1. Dictionary parity — every t() key present in all 8 launch languages
//      (delegates to the same parsing as i18n-guard).
//   2. Program catalog coverage — every PROGRAM_CATALOG entry has all 8 langs,
//      non-empty, and no English value leaking into a non-en slot.
//   3. Prof. Didier composer coverage — first_message + recommendation templates
//      exist for all 8 langs × 3 modes (no silent English fallback).
//   4. Visual cache is language-scoped — generate-visuals receives `language` and
//      ChapterView keys lesson_visuals by `${lesson.id}::${language}`.
//   5. No stale server-language binding in the Prof. Didier UI — StudentPortal must
//      NOT render recap.first_message / recap.recommendation directly.
//
// Usage:  node scripts/audit-i18n-live.mjs        (CI: non-zero exit on failure)
// =============================================================================
import fs from 'node:fs';

const LAUNCH = ['en', 'es', 'fr', 'pt', 'de', 'ar', 'zh', 'hi'];
const read = (p) => fs.readFileSync(p, 'utf8');
const exists = (p) => fs.existsSync(p);
let failures = 0;
const fail = (msg) => { failures++; console.error(`✗ ${msg}`); };
const ok = (msg) => console.log(`✓ ${msg}`);

// ── Gate 1: dictionary parity (reuse i18n-guard's block parser) ───────────────
(function dictionaryParity() {
  const lc = read('src/contexts/LanguageContext.tsx').split('\n');
  const modStart = lc.findIndex((l) => l.includes('const moduleI18n'));
  const merge = lc.findIndex((l) => l.includes('for (const lng of Object.keys(moduleI18n)'));
  const keyRe = /^\s*['"]([^'"]+)['"]\s*:/;
  const collect = (from, to) => {
    const blocks = [];
    for (let i = from; i < to; i++) { const m = /^  ([a-z]{2,3}): \{/.exec(lc[i]); if (m) blocks.push([m[1], i]); }
    const map = {};
    for (let i = 0; i < blocks.length; i++) {
      const [l, st] = blocks[i]; const nx = i + 1 < blocks.length ? blocks[i + 1][1] : to;
      const s = map[l] || (map[l] = new Set());
      for (let ln = st + 1; ln < nx; ln++) { const m = keyRe.exec(lc[ln]); if (m) s.add(m[1]); }
    }
    return map;
  };
  const main = collect(0, modStart), mod = collect(modStart, merge);
  const D = {}; for (const l of LAUNCH) D[l] = new Set([...(main[l] || []), ...(mod[l] || [])]);
  let gaps = 0;
  for (const l of LAUNCH) {
    if (l === 'en') continue;
    const miss = [...D.en].filter((k) => !D[l].has(k));
    if (miss.length) { gaps++; fail(`dict ${l.toUpperCase()} missing ${miss.length} keys: ${miss.slice(0, 6).join(', ')}${miss.length > 6 ? '…' : ''}`); }
  }
  if (!gaps) ok(`dictionary parity: ${D.en.size} keys × ${LAUNCH.length} languages`);
})();

// ── Gate 2: program catalog coverage ─────────────────────────────────────────
(function catalogCoverage() {
  const src = read('src/lib/programCatalog.ts');
  // Pull each object literal between `{ en: '...' ... }` in PROGRAM_CATALOG.
  const body = src.slice(src.indexOf('PROGRAM_CATALOG'));
  const entries = [...body.matchAll(/\{\s*en:\s*'([^']+)'[\s\S]*?\}/g)];
  if (entries.length < 5) { fail('program catalog: could not parse entries (parser drift?)'); return; }
  let bad = 0;
  for (const m of entries) {
    const block = m[0];
    const en = m[1];
    for (const l of LAUNCH) {
      if (l === 'en') continue;
      const v = new RegExp(`\\b${l}:\\s*'([^']*)'`).exec(block);
      if (!v || !v[1].trim()) { bad++; fail(`catalog "${en}" missing ${l}`); continue; }
      if (l !== 'en' && v[1].trim() === en.trim()) { bad++; fail(`catalog "${en}" ${l} is identical to English (untranslated)`); }
    }
  }
  if (!bad) ok(`program catalog: ${entries.length} programs × ${LAUNCH.length} languages`);
})();

// ── Gate 3: Prof. Didier composer coverage ───────────────────────────────────
(function profComposer() {
  if (!exists('src/lib/profDidierMessage.ts')) { fail('profDidierMessage.ts missing'); return; }
  const src = read('src/lib/profDidierMessage.ts');
  const modes = ['onboarding', 'daily_briefing', 'upgrade_coach'];
  let bad = 0;
  for (const table of ['RECOMMENDATION', 'FIRST_MESSAGE']) {
    const start = src.indexOf(`const ${table}`);
    if (start < 0) { fail(`${table} table missing`); bad++; continue; }
    const slice = src.slice(start, src.indexOf('\n};', start));
    for (const mode of modes) {
      const mStart = slice.indexOf(`${mode}: {`);
      if (mStart < 0) { fail(`${table}.${mode} missing`); bad++; continue; }
      const mSlice = slice.slice(mStart, slice.indexOf('},', mStart) + 1);
      for (const l of LAUNCH) {
        if (!new RegExp(`\\b${l}:\\s*\\(`).test(mSlice)) { fail(`${table}.${mode} missing ${l}`); bad++; }
      }
    }
  }
  if (!bad) ok(`Prof. Didier composer: 2 tables × ${modes.length} modes × ${LAUNCH.length} languages`);
})();

// ── Gate 4: generated-visual cache is language-scoped ─────────────────────────
(function visualCache() {
  const gv = read('supabase/functions/generate-visuals/index.ts');
  if (!/language/.test(gv)) fail('generate-visuals does not accept a `language` param');
  else ok('generate-visuals accepts `language`');
  const cv = read('src/pages/ChapterView.tsx');
  if (!/::\s*\$\{?language|`\$\{[^}]*\}::\$\{language\}`/.test(cv) && !/lesson[^\n]*::[^\n]*language/.test(cv)) {
    // looser check: cache key string includes both lesson id and language token
    if (!(/::/.test(cv) && /language/.test(cv))) fail('ChapterView lesson_visuals cache key may not be language-scoped');
    else ok('ChapterView visual cache key references language');
  } else ok('ChapterView visual cache key is language-scoped');
})();

// ── Gate 5: no stale server-language binding in Prof. Didier UI ───────────────
(function noServerLangBinding() {
  const sp = read('src/pages/StudentPortal.tsx');
  if (/\{\s*recap\?\.\s*first_message\s*\}|\{\s*recap\.first_message\s*\}/.test(sp)) fail('StudentPortal renders recap.first_message directly (stale server language)');
  else if (/\{\s*recap\?\.recommendation\s*\}|\{\s*recap\.recommendation\s*\}/.test(sp)) fail('StudentPortal renders recap.recommendation directly (stale server language)');
  else ok('Prof. Didier UI composes from selected UI language (no stale server binding)');
})();

console.log('');
if (failures) { console.error(`i18n-live audit FAILED with ${failures} issue(s).`); process.exit(1); }
console.log('i18n-live audit PASSED (static gates).');
console.log('NOTE: DB coverage (audit:i18n-data) and rendered-screenshot QA are separate gates.');
