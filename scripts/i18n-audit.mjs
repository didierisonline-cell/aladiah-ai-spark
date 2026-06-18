#!/usr/bin/env node
// =============================================================================
// i18n:audit — VALUE-LEVEL language-correctness auditor
// =============================================================================
// The existing `audit:i18n-live` gate checks that every t() KEY exists in every
// language. It does NOT check that the VALUE in a slot is actually written in
// that language. This script closes that gap — it is what catches "French text
// sitting in the Arabic slot" / "Spanish sitting in the Chinese slot".
//
// How it decides a value is leaking:
//   • ar / zh / hi use unambiguous scripts (Arabic / CJK / Devanagari). If a
//     value in one of these slots carries real alphabetic content but contains
//     ZERO native-script characters (after stripping protected terms, URLs,
//     digits and punctuation) → it is leaking another language. We also report
//     which script the stray content looks like.
//   • A native (non-Latin) script appearing in a Latin slot (en/es/fr/pt/de) is
//     also flagged — e.g. Arabic characters stranded in the French slot.
//   • es/fr/pt/de values byte-identical to the English value (after stripping
//     protected terms) are flagged as UNTRANSLATED (English leaking through).
//   • Keys present in EN but missing from a target slot are reported as
//     FALLBACK-LEAK (they render in English at runtime via the t() fallback).
//
// HONEST LIMITATION (stated, not hidden): charset cannot tell French from
// Spanish from German — they share the Latin script. Wrong-Latin-language
// leakage (real French text in the `es` slot) is NOT detectable here and is
// left to human review + the protected-terms guide. This script is exhaustive
// for ar/zh/hi (the scripts that mix most visibly) and for English bleed-through.
//
// Usage:
//   node scripts/i18n-audit.mjs            # report + fail (CI gate)
//   node scripts/i18n-audit.mjs --report   # report only, never fails (inventory)
//   node scripts/i18n-audit.mjs --json     # write docs/i18n/leakage-report.json
// =============================================================================
import fs from 'node:fs';

const REPORT_ONLY = process.argv.includes('--report');
const WRITE_JSON = process.argv.includes('--json');
const LAUNCH = ['en', 'es', 'fr', 'pt', 'de', 'ar', 'zh', 'hi'];
const NATIVE = { ar: 'Arabic', zh: 'CJK', hi: 'Devanagari' }; // non-Latin launch langs
const SRC = 'src/contexts/LanguageContext.tsx';

// ── Protected tokens (kept verbatim in every language; ignored when scoring) ──
// Mirrors docs/i18n/PROTECTED_TERMS.md. Stripped before language scoring so a
// value that is *only* a protected term (e.g. "GitHub") never counts as leakage.
const PROTECTED = [
  'Aladiah Academy', 'Aladiah Management', 'Aladiah Certified™', 'Aladiah Certified',
  'Aladiah', 'Prof. Didier', 'Professor Didier', 'Didier',
  'Talent Score™', 'All-Access Pass™', 'Talent Score', 'All-Access Pass',
  'ALL-ACCESS PASS', 'All-Access', 'Scrum.org', 'Scrum Master', 'Scrum',
  'GitHub', 'AWS', 'Google Cloud', 'Microsoft', 'PMI', 'Stripe', 'ElevenLabs',
  'LinkedIn', 'DevOps', 'MLOps', 'UX', 'UI', 'AI', 'IT', 'Sprint', 'Kanban',
  'SAFe', 'Jira', 'OK', 'API', 'FAQ', 'CV', 'PDF', 'URL',
];

// Product tier / plan names: deliberately NOT auto-protected. Whether these
// localize is a product decision for the founder, so they surface as REVIEW
// items rather than silent passes or hard failures.
const TIER_NAMES = new Set([
  'Foundation Builder', 'Career Accelerator', 'Elite Mentorship',
]);

// ── Script detectors ─────────────────────────────────────────────────────────
const reArabic = /[؀-ۿݐ-ݿ]/;
const reCJK = /[一-鿿㐀-䶿]/;
const reDevanagari = /[ऀ-ॿ]/;
const reLatinLetter = /[A-Za-zÀ-ɏ]/; // Latin incl. accented (é, ñ, ü…)
const reLatinWord = /[A-Za-zÀ-ɏ]{2,}/; // a real word, not a stray code letter (L100)
const hasNative = { ar: reArabic, zh: reCJK, hi: reDevanagari };

function stripProtected(s) {
  let out = s;
  for (const term of PROTECTED) out = out.split(term).join(' ');
  // strip URLs, emails, {placeholders}, digits, currency, punctuation, emoji-ish
  out = out
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\S+@\S+/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    // ascii punct + arrows, middots, dashes, bullets, trademark/registered marks,
    // and other non-letter glyphs that carry no language signal
    .replace(/[0-9$€£%.,:;!?'"`@#&/()\[\]{}<>|+\-*=~_\\\s]/g, ' ')
    .replace(/[←→↑↓·•‣▪–—™®©…«»“”‘’]/g, ' ');
  return out.trim();
}

function looksLike(s) {
  if (reArabic.test(s)) return 'Arabic';
  if (reCJK.test(s)) return 'CJK';
  if (reDevanagari.test(s)) return 'Devanagari';
  if (reLatinLetter.test(s)) return 'Latin (en/es/fr/pt/de)';
  return 'unknown';
}

// ── Extract a JS object literal that follows `const <name>` ───────────────────
// Brace-matches while respecting string literals & comments, then evals the
// literal (object literals are valid JS once the `: Type` annotation is dropped).
function extractObject(text, declName) {
  const at = text.indexOf(`const ${declName}`);
  if (at < 0) throw new Error(`could not find const ${declName}`);
  const open = text.indexOf('{', at);
  let depth = 0, i = open, inStr = null, esc = false, line = false, block = false;
  for (; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (line) { if (c === '\n') line = false; continue; }
    if (block) { if (c === '*' && n === '/') { block = false; i++; } continue; }
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '/' && n === '/') { line = true; i++; continue; }
    if (c === '/' && n === '*') { block = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  const literal = text.slice(open, i);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${literal});`)();
}

// ── Load + merge the two dictionaries (base + moduleI18n) ─────────────────────
const text = fs.readFileSync(SRC, 'utf8');
const base = extractObject(text, 'translations');
const mod = extractObject(text, 'moduleI18n');
const dict = {};
for (const l of LAUNCH) dict[l] = { ...(base[l] || {}), ...(mod[l] || {}) };

const enKeys = Object.keys(dict.en);
const report = { generatedAt: new Date().toISOString(), totalEnKeys: enKeys.length, languages: {} };
let hardFailures = 0;

console.log(`i18n:audit — ${enKeys.length} English keys × ${LAUNCH.length} launch languages\n`);

for (const l of LAUNCH) {
  if (l === 'en') continue;
  const slot = dict[l];
  const missing = [];     // FALLBACK-LEAK: renders English
  const wrongScript = []; // the headline defect: foreign text in a native slot
  const untranslated = []; // English byte-for-byte in a Latin slot
  const strandedNative = []; // native script stranded in a Latin slot
  const review = [];      // tier/plan names — product decision, not a defect

  for (const key of enKeys) {
    const en = dict.en[key];
    const v = slot[key];
    if (v === undefined || v === null || v === '') { missing.push(key); continue; }
    const core = stripProtected(String(v));
    if (!core) continue; // value was only protected tokens / punctuation — fine

    if (NATIVE[l]) {
      // ar/zh/hi: must contain native script. Only a real foreign WORD counts as
      // leakage — stray code letters (L100), symbols and emoji are language-neutral.
      if (!hasNative[l].test(core) && reLatinWord.test(core)) {
        if (TIER_NAMES.has(String(v).trim())) review.push({ key, value: String(v).slice(0, 80) });
        else wrongScript.push({ key, value: String(v).slice(0, 80), looksLike: looksLike(core) });
      }
    } else {
      // Latin launch language: native script here is stranded leakage.
      if (reArabic.test(core) || reCJK.test(core) || reDevanagari.test(core)) {
        strandedNative.push({ key, value: String(v).slice(0, 80), looksLike: looksLike(core) });
      } else if (String(v).trim() === String(en).trim() && stripProtected(String(en))) {
        untranslated.push({ key, value: String(v).slice(0, 80) });
      }
    }
  }

  const total = missing.length + wrongScript.length + untranslated.length + strandedNative.length;
  report.languages[l] = {
    keysPresent: Object.keys(slot).length,
    missing: missing.length,
    wrongScript: wrongScript.length,
    untranslated: untranslated.length,
    strandedNative: strandedNative.length,
    review: review.length,
    samples: { missing: missing.slice(0, 8), wrongScript: wrongScript.slice(0, 10), untranslated: untranslated.slice(0, 8), strandedNative: strandedNative.slice(0, 8), review: review.slice(0, 8) },
  };

  const tag = (wrongScript.length + strandedNative.length) === 0 ? '✓' : '✗';
  console.log(`${tag} ${l.toUpperCase()}  missing:${missing.length}  wrong-script:${wrongScript.length}  untranslated:${untranslated.length}  stranded-native:${strandedNative.length}  review:${review.length}`);
  if (wrongScript.length) {
    console.log(`    └─ wrong-script (the "foreign text in ${NATIVE[l]} slot" defect), first ${Math.min(10, wrongScript.length)}:`);
    for (const w of wrongScript.slice(0, 10)) console.log(`         ${w.key}  →  "${w.value}"  [looks ${w.looksLike}]`);
  }
  if (strandedNative.length) {
    console.log(`    └─ stranded native script in a Latin slot, first ${Math.min(5, strandedNative.length)}:`);
    for (const w of strandedNative.slice(0, 5)) console.log(`         ${w.key}  →  "${w.value}"  [${w.looksLike}]`);
  }

  // Hard-fail conditions for the CI gate: a present-but-wrong-language value is
  // a guaranteed visible defect. Missing keys + untranslated English are
  // reported but do NOT fail the gate here (they degrade to English, which is a
  // data-population gap tracked separately, not a code defect).
  hardFailures += wrongScript.length + strandedNative.length;
}

// ── Resolver & preferred_language sanity (cheap structural checks) ────────────
console.log('');
const resolverOK = /translations\[language\][\s\S]{0,40}translations\['en'\][\s\S]{0,20}\|\|\s*key/.test(text);
console.log(`${resolverOK ? '✓' : '✗'} resolver fallback order is selected → English → key (no third-language fallback)`);
const dirOK = /document\.documentElement\.dir\s*=\s*language === 'ar' \? 'rtl' : 'ltr'/.test(text);
console.log(`${dirOK ? '✓' : '✗'} dir is rtl iff language === 'ar'`);

if (WRITE_JSON) {
  fs.mkdirSync('docs/i18n', { recursive: true });
  fs.writeFileSync('docs/i18n/leakage-report.json', JSON.stringify(report, null, 2));
  console.log('\nWrote docs/i18n/leakage-report.json');
}

console.log('');
if (hardFailures && !REPORT_ONLY) {
  console.error(`i18n:audit FAILED — ${hardFailures} present-but-wrong-language value(s). These render visibly in the wrong language.`);
  process.exit(1);
}
if (hardFailures) {
  console.log(`(report mode) ${hardFailures} present-but-wrong-language value(s) found — not failing.`);
} else {
  console.log('i18n:audit PASSED — no wrong-language values detected in any native-script slot.');
}
