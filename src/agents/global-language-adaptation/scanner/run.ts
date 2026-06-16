/**
 * CLI entry for the Full Translation Coverage Scanner.
 *
 *   npx tsx src/agents/global-language-adaptation/scanner/run.ts
 *
 * Outputs (to ./language-reports/):
 *   - coverage.json             per-language i18n key coverage
 *   - missing-translations.json flat list of (language, missing key) — the
 *                               seed for the `language_missing_translations` table
 *   - hardcoded.json            heuristic hardcoded-English worklist
 *
 * It does NOT write to the database. Loading the reports into Supabase is a
 * separate, reviewed step (see docs/MIGRATION_PLAN.md).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { computeCoverage } from './coverage';
import { scanHardcoded } from './scanHardcoded';

function main() {
  // Run from the repo root: `npx tsx src/agents/.../scanner/run.ts`
  const repoRoot = process.cwd();
  const ctxPath = join(repoRoot, 'src/contexts/LanguageContext.tsx');
  const outDir = join(repoRoot, 'language-reports');
  mkdirSync(outDir, { recursive: true });

  // 1) i18n key coverage
  const source = readFileSync(ctxPath, 'utf8');
  const coverage = computeCoverage(source);
  writeFileSync(join(outDir, 'coverage.json'), JSON.stringify(coverage, null, 2));

  // 2) flat missing-translation registry seed
  const missing = coverage.languages.flatMap((l) =>
    [
      ...l.missingKeys.map((k) => ({ language: l.language, string_key: k, surface: 'other', reason: 'missing' })),
      ...l.identicalToEnglishKeys.map((k) => ({
        language: l.language,
        string_key: k,
        surface: 'other',
        reason: 'identical_to_english',
      })),
    ],
  );
  writeFileSync(join(outDir, 'missing-translations.json'), JSON.stringify(missing, null, 2));

  // 3) hardcoded-English heuristic worklist
  const hardcoded = scanHardcoded([
    join(repoRoot, 'src/pages'),
    join(repoRoot, 'src/components'),
  ]);
  writeFileSync(join(outDir, 'hardcoded.json'), JSON.stringify(hardcoded, null, 2));

  // Console summary
  console.log(`\nGlobal Language Adaptation — Coverage Scan`);
  console.log(`Canonical: ${coverage.canonicalLanguage}  |  Languages: ${coverage.languages.length}\n`);
  console.log('lang   coverage%   present/total   missing   identical-to-en');
  console.log('----   ---------   -------------   -------   ----------------');
  for (const l of coverage.languages) {
    console.log(
      `${l.language.padEnd(5)}  ${String(l.coveragePercent).padStart(7)}%   ` +
        `${String(l.presentKeys).padStart(5)}/${String(l.totalKeys).padEnd(5)}   ` +
        `${String(l.missingKeys.length).padStart(6)}   ${String(l.identicalToEnglishKeys.length).padStart(6)}`,
    );
  }
  console.log(
    `\nHardcoded-English findings: ${hardcoded.totalFindings} across ${hardcoded.scannedFiles} files`,
  );
  console.log(`Reports written to ${outDir}\n`);
}

main();
