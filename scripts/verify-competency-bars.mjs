#!/usr/bin/env node
// =============================================================================
// verify-competency-bars — proves the dashboard Skill Strengths use REAL,
// quiz-derived competency data with a true zero-state. Exercises the actual
// src/lib/competencyBars.ts (transpiled via esbuild — pure, no React imports).
//
// Run: node scripts/verify-competency-bars.mjs
// =============================================================================
import { build } from 'esbuild';

const out = await build({ entryPoints: ['src/lib/competencyBars.ts'], bundle: false, write: false, format: 'esm' });
const mod = await import('data:text/javascript,' + encodeURIComponent(out.outputFiles[0].text));
const { competencyBarsFromProfile, hasCompetencyEvidence, COMPETENCY_FRAMEWORK } = mod;

let failures = 0;
const assert = (c, m) => { if (!c) { failures++; console.error(`✗ ${m}`); } else console.log(`✓ ${m}`); };

console.log('A — zero-state (no profile):');
{
  const bars = competencyBarsFromProfile(null);
  assert(bars.length === 5, '  returns 5 framework bars');
  assert(bars.every((b) => b.score === 0), '  every bar 0% (no synthetic values)');
  assert(hasCompetencyEvidence(null) === false, '  hasCompetencyEvidence = false');
}

console.log('B — profile exists but no areas yet (fresh student):');
{
  const bars = competencyBarsFromProfile({ strongAreas: [], weakAreas: [] });
  assert(bars.every((b) => b.score === 0), '  every bar 0%');
  assert(hasCompetencyEvidence({ strongAreas: [], weakAreas: [] }) === false, '  no evidence');
}

console.log('C — real quiz evidence maps to real scores:');
{
  const profile = {
    strongAreas: [
      { topic: 'foundations', score: 92 },
      { topic: 'process-execution', score: 90 },
    ],
    weakAreas: [
      { topic: 'people-leadership', score: 48 },
      { topic: 'measurement-outcomes', score: 35 },
    ],
  };
  const bars = competencyBarsFromProfile(profile);
  assert(hasCompetencyEvidence(profile) === true, '  hasCompetencyEvidence = true');
  assert(bars[0].label === 'Foundations' && bars[0].score === 92, '  top bar = Foundations 92% (sorted desc)');
  const peep = bars.find((b) => b.label === 'People & Leadership');
  assert(peep && peep.score === 48, '  weak area surfaced with its real score (48%)');
  const untouched = bars.find((b) => b.label === 'Roles & Accountabilities');
  assert(untouched && untouched.score === 0, '  competency with no evidence stays 0%');
  assert(bars.every((b) => b.score >= 0 && b.score <= 100), '  all scores clamped 0–100');
}

console.log('D — dedupe: same competency in strong & weak keeps the higher score:');
{
  const bars = competencyBarsFromProfile({
    strongAreas: [{ topic: 'foundations', score: 95 }],
    weakAreas: [{ topic: 'foundations', score: 40 }],
  });
  const f = bars.find((b) => b.label === 'Foundations');
  assert(f && f.score === 95, '  Foundations = 95% (strongest wins)');
}

console.log('E — framework integrity:');
assert(COMPETENCY_FRAMEWORK.length === 7 && COMPETENCY_FRAMEWORK.every((c) => c.key && c.label && c.color), '  7 competencies, each key/label/color');

console.log('');
if (failures) { console.error(`competency-bars verification FAILED (${failures}).`); process.exit(1); }
console.log('competency-bars verification PASSED — real competency data, zero-state safe, no synthetic percentages.');
