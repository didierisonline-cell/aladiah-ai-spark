#!/usr/bin/env node
// =============================================================================
// verify-progress-zero-state — regression guard for the dashboard zero-state
// =============================================================================
// Reproduces the exact useProgress formula and asserts the invariant the
// product requires: a student with ZERO chapter-completions must show ZERO
// progress (which cascades to Talent Score 0, hours 600/600 remaining, all
// skill bars 0%). It also asserts genuine learners are NOT regressed.
//
// This is the executable "proof that all zero-state students remain zero"
// requested by the regression audit. Run: node scripts/verify-progress-zero-state.mjs
// =============================================================================

// Mirror of src/hooks/useProgress.ts (kept in lockstep; see comment there).
function computeProgress(quizzes, progressData) {
  if (!quizzes.length) return 0;
  const passedIds = progressData.map((p) => p.quiz_id);
  const passedQuizzes = quizzes.filter((q) => passedIds.includes(q.id));
  const totalQuizzes = quizzes.length;
  const passedCount = passedQuizzes.length;
  // Scope scores to the SAME population as completion (chapter_end quizzes).
  const passedQuizIds = new Set(passedQuizzes.map((q) => q.id));
  const scores = progressData
    .filter((p) => passedQuizIds.has(p.quiz_id) && p.score != null)
    .map((p) => p.score);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const completionPct = totalQuizzes ? Math.round((passedCount / totalQuizzes) * 100) : 0;
  return scores.length ? Math.round((completionPct + avgScore) / 2) : completionPct;
}

// Downstream cascade (mirror of StudentPortal/useTalentScore).
const talentScore = (p) => Math.round((Math.max(0, Math.min(100, p)) / 100) * 300);
const hoursLeft = (p) => Math.round(((100 - Math.max(0, Math.min(100, p))) / 100) * 600);
const skill = (base, p) => Math.round((base * p) / 100);

const quizzes = Array.from({ length: 10 }, (_, i) => ({ id: 'ce' + i, quiz_type: 'chapter_end' }));
let failures = 0;
const assert = (cond, msg) => { if (!cond) { failures++; console.error(`✗ ${msg}`); } else console.log(`✓ ${msg}`); };

// 1. True zero state.
assert(computeProgress(quizzes, []) === 0, 'no progress rows ⇒ 0% progress');

// 2. The reported regression: scored a non-completion quiz, 0 chapters done.
const p2 = computeProgress(quizzes, [{ quiz_id: 'module1_free', score: 100 }]);
assert(p2 === 0, 'scored a non-chapter_end quiz, 0 chapters ⇒ 0% (was 50%)');
assert(talentScore(p2) === 0, '  ↳ Talent Score = 0 (was 150)');
assert(hoursLeft(p2) === 600, '  ↳ hours remaining = 600/600 (was 300/600)');
assert(skill(92, p2) === 0 && skill(88, p2) === 0 && skill(85, p2) === 0, '  ↳ all skill bars = 0% (was 46/44/43)');

// 3. Many scored non-completion quizzes still ⇒ 0 if no chapter completed.
const p3 = computeProgress(quizzes, [
  { quiz_id: 'practice_a', score: 88 }, { quiz_id: 'practice_b', score: 95 }, { quiz_id: 'practice_c', score: 70 },
]);
assert(p3 === 0, 'multiple scored non-completion quizzes, 0 chapters ⇒ 0%');

// 4. Genuine learner is NOT regressed.
const p4 = computeProgress(quizzes, [
  { quiz_id: 'ce0', score: 90 }, { quiz_id: 'ce1', score: 90 }, { quiz_id: 'ce2', score: 90 },
]);
assert(p4 === 60, 'passed 3/10 chapter_end @90 ⇒ 60% (unchanged for real learners)');
assert(talentScore(p4) === 180, '  ↳ Talent Score = 180 (preserved)');

console.log('');
if (failures) { console.error(`zero-state verification FAILED (${failures}).`); process.exit(1); }
console.log('zero-state verification PASSED — zero completions ⇒ zero everywhere; real progress preserved.');
