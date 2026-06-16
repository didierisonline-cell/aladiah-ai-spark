#!/usr/bin/env node
/**
 * Global Language Adaptation Agent — Translation Coverage Scanner (v0.1)
 *
 * READ-ONLY. Scans the codebase and reports per-language translation coverage and
 * hardcoded-English candidates. It NEVER writes to the app, the DB, or translation files.
 *
 * Why .mjs: the repo has no ts-node/tsx and `vite build` never compiles this file (it is
 * not imported by the app), so a plain-Node ESM script is the most portable, verifiable
 * form. The typed agent contract lives in ../global-language-config.ts.
 *
 * Usage:
 *   node src/agents/global-language-adaptation/scanner/coverage-scanner.mjs
 *   node .../coverage-scanner.mjs --json out.json --md out.md
 *
 * Scope of THIS version (static / source-level):
 *   1. Per-language key coverage in src/contexts/LanguageContext.tsx vs the `en` baseline.
 *   2. Translation keys referenced via t('...') / T('...') that are MISSING from `en`.
 *   3. Hardcoded-English JSX text candidates (heuristic — needs human triage).
 *
 * Out of scope here (documented in scanner-plan.md as later phases): DB content coverage
 * (courses/chapters/videos `translations` JSON, quiz_questions), simulation data, and
 * SVG diagram labels. Those require a Supabase read-mode and are intentionally not run
 * automatically.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = join(HERE, '..', '..', '..', '..'); // .../<repo>
const SRC = join(REPO_ROOT, 'src');
const LANG_CTX = join(SRC, 'contexts', 'LanguageContext.tsx');

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

/** Recursively list files under dir matching the given extensions. */
function walk(dir, exts, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, acc);
    else if (exts.includes(extname(full))) acc.push(full);
  }
  return acc;
}

/** Parse the `type Language = 'en' | 'fr' | ...` union into a list of codes. */
function parseDeclaredLanguages(src) {
  const m = src.match(/type\s+Language\s*=\s*([^;]+);/);
  if (!m) return [];
  return [...m[1].matchAll(/'([a-z-]+)'/g)].map((x) => x[1]);
}

/**
 * Segment the top-level `translations` object into per-language key sets by tracking
 * brace depth. Returns Map<langCode, Set<key>>.
 */
function parseKeysByLanguage(src) {
  const start = src.indexOf('const translations');
  const open = src.indexOf('{', start);
  const byLang = new Map();
  let depth = 0;
  let currentLang = null;
  let i = open;
  // Walk character by character from the opening brace of the translations object.
  // depth 1 == inside translations object; depth 2 == inside a language block.
  const langHeader = /(^|\n)\s*([a-z]{2}(?:-[a-z]+)?)\s*:\s*\{/i;
  // Simpler line-based pass using depth tracking:
  const lines = src.slice(open).split('\n');
  for (const line of lines) {
    // Detect a language block header at depth 1.
    if (depth === 1) {
      const h = line.match(/^\s*([a-z]{2}(?:-[a-z]+)?)\s*:\s*\{/i);
      if (h) {
        currentLang = h[1];
        if (!byLang.has(currentLang)) byLang.set(currentLang, new Set());
      }
    }
    // Count translation keys when inside a language block (depth >= 2).
    if (depth >= 2 && currentLang) {
      const k = line.match(/^\s*['"]([^'"]+)['"]\s*:/);
      if (k) byLang.get(currentLang).add(k[1]);
    }
    // Update depth using net braces on this line.
    for (const ch of line) {
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth <= 1) currentLang = null;
        if (depth === 0) return byLang; // end of translations object
      }
    }
  }
  return byLang;
}

/** Collect all t('key') / T('key') references across the source tree. */
function collectKeyReferences(files) {
  const refs = new Set();
  const re = /\b[tT]\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  for (const f of files) {
    const txt = readFileSync(f, 'utf8');
    for (const m of txt.matchAll(re)) refs.add(m[1]);
  }
  return refs;
}

/**
 * Heuristic hardcoded-English detector. Flags JSX text nodes that contain real words and
 * are not wrapped in a t()/T() call or an expression. Conservative; produces CANDIDATES
 * for human triage, not a definitive list.
 */
function findHardcodedCandidates(files) {
  const perFile = [];
  // JSX text between tags: >Some words< — letters, spaces, basic punctuation only.
  const textRe = />\s*([A-Z][A-Za-z][^<>{}]*?[A-Za-z.!?])\s*</g;
  for (const f of files) {
    if (f.endsWith('LanguageContext.tsx')) continue; // the dictionary itself
    const txt = readFileSync(f, 'utf8');
    let count = 0;
    const samples = [];
    for (const m of txt.matchAll(textRe)) {
      const s = m[1].trim();
      // Skip things that are clearly not UI copy.
      if (s.length < 4) continue;
      if (!/[A-Za-z]{3,}\s+[A-Za-z]{2,}/.test(s) && !/[A-Za-z]{6,}/.test(s)) continue;
      if (/^[A-Z_]+$/.test(s)) continue; // CONSTANTS
      count++;
      if (samples.length < 3) samples.push(s.slice(0, 60));
    }
    if (count > 0) perFile.push({ file: relative(REPO_ROOT, f), count, samples });
  }
  perFile.sort((a, b) => b.count - a.count);
  return perFile;
}

// ---- Run ----
const ctxSrc = readFileSync(LANG_CTX, 'utf8');
const declared = parseDeclaredLanguages(ctxSrc);
const keysByLang = parseKeysByLanguage(ctxSrc);
const baseline = keysByLang.get('en') ?? new Set();
const tsxFiles = walk(SRC, ['.tsx', '.ts']);
const referenced = collectKeyReferences(tsxFiles);

const baselineKeys = [...baseline];
const referencedMissingFromBaseline = [...referenced].filter((k) => !baseline.has(k)).sort();

const perLanguage = declared.map((lang) => {
  const keys = keysByLang.get(lang) ?? new Set();
  const covered = baselineKeys.filter((k) => keys.has(k)).length;
  const pct = baselineKeys.length ? +((covered / baselineKeys.length) * 100).toFixed(1) : 0;
  return {
    language: lang,
    definedKeys: keys.size,
    coveredBaselineKeys: covered,
    baselineKeys: baselineKeys.length,
    keyCoveragePct: lang === 'en' ? 100 : pct,
    hasBlock: keysByLang.has(lang),
    // A language is "active-eligible" by this static check only at 100% key coverage.
    // Full activation also requires DB content + diagrams (see scanner-plan.md).
    activeEligibleStatic: lang === 'en' ? true : pct === 100,
  };
});

const hardcoded = findHardcodedCandidates(tsxFiles);
const hardcodedTotal = hardcoded.reduce((s, x) => s + x.count, 0);

const report = {
  generatedAt: new Date().toISOString(),
  scannerVersion: '0.1',
  scope: 'static-source (LanguageContext keys + t() refs + hardcoded JSX heuristic)',
  baseline: { language: 'en', keys: baselineKeys.length },
  declaredLanguages: declared.length,
  languagesWithTranslationBlock: [...keysByLang.keys()],
  perLanguage,
  referencedKeysMissingFromBaseline: {
    count: referencedMissingFromBaseline.length,
    keys: referencedMissingFromBaseline.slice(0, 50),
  },
  hardcodedEnglishCandidates: {
    total: hardcodedTotal,
    note: 'HEURISTIC — requires human triage. JSX text not wrapped in t()/T().',
    topFiles: hardcoded.slice(0, 20),
  },
};

// ---- Output ----
const jsonOut = getArg('--json');
const mdOut = getArg('--md');

if (jsonOut) writeFileSync(jsonOut, JSON.stringify(report, null, 2));

function toMarkdown(r) {
  const rows = r.perLanguage
    .map(
      (l) =>
        `| ${l.language} | ${l.hasBlock ? 'yes' : 'no'} | ${l.definedKeys} | ${l.coveredBaselineKeys}/${l.baselineKeys} | ${l.keyCoveragePct}% | ${l.activeEligibleStatic ? '✅' : '❌'} |`
    )
    .join('\n');
  return `# Translation Coverage — Baseline Report

_Generated ${r.generatedAt} · scanner v${r.scannerVersion}_
_Scope: ${r.scope}_

- **Baseline (en) keys:** ${r.baseline.keys}
- **Declared languages:** ${r.declaredLanguages}
- **Languages with a translation block:** ${r.languagesWithTranslationBlock.join(', ')}
- **t()-referenced keys missing from baseline:** ${r.referencedKeysMissingFromBaseline.count}
- **Hardcoded-English JSX candidates (heuristic):** ${r.hardcodedEnglishCandidates.total}

## Per-language key coverage (UI strings only)

| Lang | Block? | Defined keys | Baseline covered | Coverage % | Active-eligible (static) |
|---|---|---|---|---|---|
${rows}

> ⚠️ "Active-eligible (static)" reflects ONLY UI-string key coverage. Full activation per
> the Language Completeness Rules also requires 100% DB content (courses/lessons/quizzes)
> and translated diagrams — measured in later scanner phases.

## Hardcoded-English candidates — top files (heuristic)

${r.hardcodedEnglishCandidates.topFiles.map((f) => `- \`${f.file}\` — ${f.count} (e.g. ${f.samples.map((s) => `"${s}"`).join(', ')})`).join('\n')}
`;
}

if (mdOut) writeFileSync(mdOut, toMarkdown(report));

// Console summary
console.log(`Baseline (en) keys: ${baselineKeys.length}`);
console.log(`Declared languages: ${declared.length} | with blocks: ${[...keysByLang.keys()].join(',')}`);
console.log('Per-language coverage:');
for (const l of perLanguage) {
  console.log(`  ${l.language.padEnd(3)} ${String(l.keyCoveragePct).padStart(5)}%  (${l.coveredBaselineKeys}/${l.baselineKeys})${l.hasBlock ? '' : '  [no block]'}`);
}
console.log(`Referenced keys missing from baseline: ${referencedMissingFromBaseline.length}`);
console.log(`Hardcoded-English JSX candidates (heuristic): ${hardcodedTotal}`);
if (!jsonOut && !mdOut) console.log('\n(Tip: pass --json out.json --md out.md to write reports.)');
