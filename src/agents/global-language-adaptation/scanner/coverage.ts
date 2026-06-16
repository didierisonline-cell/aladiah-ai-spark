/**
 * Coverage parser — reads src/contexts/LanguageContext.tsx and computes, per
 * language, how many i18n keys are present vs. the canonical English set, plus
 * which present keys still hold the English value verbatim (untranslated).
 *
 * It deliberately parses the source TEXT rather than importing the module:
 * LanguageContext.tsx is a React module (633KB) and the translations object is
 * the authoritative key registry. One key per line is the established format
 * in that file, so a line-based parser is robust and fast.
 *
 * Pure (string in → report out) so it is trivially testable.
 */
import type { CoverageReport, KeyCoverage } from './types';

const CANONICAL = 'en';

/** Extract the supported language codes from the `type Language = '..' | '..'` union. */
export function parseLanguageCodes(source: string): string[] {
  const m = source.match(/type\s+Language\s*=\s*([^;]+);/);
  if (!m) return [];
  return Array.from(m[1].matchAll(/'([a-z-]+)'/g)).map((x) => x[1]);
}

/**
 * Split the `const translations: Record<Language, ...> = { ... }` object into
 * per-language blocks. Top-level language entries are indented two spaces:
 *   `  en: {` ... `  },`
 */
function extractLanguageBlocks(source: string, codes: string[]): Record<string, string> {
  const blocks: Record<string, string> = {};
  const start = source.indexOf('const translations');
  const body = start >= 0 ? source.slice(start) : source;
  const lines = body.split('\n');

  let current: string | null = null;
  let buf: string[] = [];
  const codeSet = new Set(codes);

  for (const line of lines) {
    const open = line.match(/^ {2}([a-z-]+)\s*:\s*\{/);
    if (open && codeSet.has(open[1])) {
      if (current) blocks[current] = buf.join('\n');
      current = open[1];
      buf = [];
      continue;
    }
    // End of a top-level language block.
    if (current && /^ {2}\},?\s*$/.test(line)) {
      blocks[current] = buf.join('\n');
      current = null;
      buf = [];
      continue;
    }
    if (current) buf.push(line);
  }
  if (current) blocks[current] = buf.join('\n');
  return blocks;
}

/** Map of key → raw value literal for one language block. */
function parseKeyValues(block: string): Map<string, string> {
  const out = new Map<string, string>();
  if (!block) return out;
  for (const line of block.split('\n')) {
    // `'key': "value",`  or  `"key": 'value',` — one entry per line.
    const m = line.match(
      /^\s*(['"])((?:\\.|(?!\1).)*)\1\s*:\s*(['"])((?:\\.|(?!\3).)*)\3\s*,?\s*$/,
    );
    if (m) out.set(m[2], m[4]);
  }
  return out;
}

export function computeCoverage(source: string): CoverageReport {
  const codes = parseLanguageCodes(source);
  const blocks = extractLanguageBlocks(source, codes);
  const en = parseKeyValues(blocks[CANONICAL] ?? '');
  const totalKeys = en.size;

  const languages: KeyCoverage[] = codes.map((code) => {
    if (code === CANONICAL) {
      return {
        language: code,
        presentKeys: totalKeys,
        totalKeys,
        missingKeys: [],
        identicalToEnglishKeys: [],
        coveragePercent: totalKeys === 0 ? 0 : 100,
      };
    }
    const kv = parseKeyValues(blocks[code] ?? '');
    const missingKeys: string[] = [];
    const identicalToEnglishKeys: string[] = [];
    for (const [k, enVal] of en) {
      if (!kv.has(k)) missingKeys.push(k);
      else if (kv.get(k) === enVal && enVal.trim() !== '') identicalToEnglishKeys.push(k);
    }
    const effectiveTranslated = totalKeys - missingKeys.length - identicalToEnglishKeys.length;
    const coveragePercent =
      totalKeys === 0 ? 0 : Math.round((effectiveTranslated / totalKeys) * 1000) / 10;
    return {
      language: code,
      presentKeys: kv.size,
      totalKeys,
      missingKeys,
      identicalToEnglishKeys,
      coveragePercent,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    canonicalLanguage: CANONICAL,
    languages,
  };
}
