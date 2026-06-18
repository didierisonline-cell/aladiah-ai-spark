#!/usr/bin/env node
// =============================================================================
// verify-canonical-progress — regression guard for the unified progress model
// =============================================================================
// Exercises the REAL src/lib/progressModel.ts (transpiled on the fly with
// esbuild — it is pure, no React/supabase imports) against the four scenarios
// the audit requires, and asserts the canonical invariant + downstream cascade
// (Talent Score, Career Path hours) on every one.
//
// Run: node scripts/verify-canonical-progress.mjs
// =============================================================================
import { build } from 'esbuild';

const out = await build({
  entryPoints: ['src/lib/progressModel.ts'],
  bundle: false, write: false, format: 'esm',
});
const mod = await import('data:text/javascript,' + encodeURIComponent(out.outputFiles[0].text));
const { computeCanonicalProgress, careerHoursEarned, careerHoursLeft, CAREER_HOURS_TARGET } = mod;

// Downstream cascade (mirror of useTalentScore.talentScoreFromProgress knowledge dim).
const talentScore = (pct) => Math.round((Math.max(0, Math.min(100, pct)) / 100) * 300);
const skill = (base, pct) => Math.round((base * pct) / 100);

let failures = 0;
const assert = (cond, msg) => { if (!cond) { failures++; console.error(`✗ ${msg}`); } else console.log(`✓ ${msg}`); };

// A 4-lesson, 2-chapter program.
const lessonIds = ['v1', 'v2', 'v3', 'v4'];
const chapterEndQuizIds = ['ceA', 'ceB'];

console.log('Scenario A — zero-state student (no progress rows):');
{
  const p = computeCanonicalProgress({ lessonIds, chapterEndQuizIds, progressRows: [] });
  assert(p.pct === 0, '  pct = 0');
  assert(talentScore(p.pct) === 0, '  Talent Score = 0');
  assert(careerHoursEarned(p.pct) === 0 && careerHoursLeft(p.pct) === CAREER_HOURS_TARGET, '  Career Path = 0 earned / 600 target');
  assert(skill(92, p.pct) === 0, '  skill bars = 0%');
}

console.log('Scenario B — free Module-1 quiz only (scored 100, NO lessons completed):');
{
  const p = computeCanonicalProgress({
    lessonIds, chapterEndQuizIds,
    // a scored quiz that is NOT a chapter_end and completes NO lesson
    progressRows: [{ quiz_id: 'module1_free', score: 100, completed_at: '2026-06-18' }],
  });
  assert(p.pct === 0, '  pct = 0 (was the 50% regression)');
  assert(talentScore(p.pct) === 0, '  Talent Score = 0 (was 150)');
  assert(skill(92, p.pct) === 0 && skill(88, p.pct) === 0 && skill(85, p.pct) === 0, '  skills = 0% (was 46/44/43)');
  assert(careerHoursEarned(p.pct) === 0, '  Career Path = 0 earned (was 300)');
}

console.log('Scenario C — active learner (2 of 4 lessons done, 1 chapter quiz @90):');
{
  const p = computeCanonicalProgress({
    lessonIds, chapterEndQuizIds,
    progressRows: [
      { video_id: 'v1', completed_at: '2026-06-17' },
      { video_id: 'v2', completed_at: '2026-06-18' },
      { quiz_id: 'ceA', score: 90, completed_at: '2026-06-18' },
    ],
  });
  assert(p.pct === 50, '  pct = 50 (2/4 lessons) — explainable completion');
  assert(p.lessonsCompleted === 2 && p.lessonsTotal === 4, '  lessonsCompleted 2 / lessonsTotal 4');
  assert(p.chaptersCompleted === 1 && p.avgScore === 90, '  chaptersCompleted 1, avgScore 90 (reported separately, not blended)');
  assert(talentScore(p.pct) === 150, '  Talent Score = 150 (from completion, consistent)');
}

console.log('Scenario D — completed program (all 4 lessons done):');
{
  const p = computeCanonicalProgress({
    lessonIds, chapterEndQuizIds,
    progressRows: lessonIds.map((v) => ({ video_id: v, completed_at: '2026-06-18' }))
      .concat([{ quiz_id: 'ceA', score: 95, completed_at: '2026-06-18' }, { quiz_id: 'ceB', score: 88, completed_at: '2026-06-18' }]),
  });
  assert(p.pct === 100, '  pct = 100 (4/4 lessons)');
  assert(talentScore(p.pct) === 300, '  Talent Score knowledge dim = 300 (max)');
  assert(careerHoursEarned(p.pct) === 600 && careerHoursLeft(p.pct) === 0, '  Career Path = 600 earned / 0 left');
}

console.log('Guard — duplicate completed_at rows for same lesson do not double-count:');
{
  const p = computeCanonicalProgress({
    lessonIds, chapterEndQuizIds,
    progressRows: [
      { video_id: 'v1', completed_at: 'a' }, { video_id: 'v1', completed_at: 'b' },
    ],
  });
  assert(p.lessonsCompleted === 1 && p.pct === 25, '  v1 counted once ⇒ 1/4 = 25%');
}

console.log('');
if (failures) { console.error(`canonical-progress verification FAILED (${failures}).`); process.exit(1); }
console.log('canonical-progress verification PASSED — one definition, zero-state safe, score never inflates completion.');
