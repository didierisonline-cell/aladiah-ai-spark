// =============================================================================
// Aladiah Quality Standard — the gate every generated artifact must pass before
// it can enter the Founder Approval Queue. Nothing reaches the queue (let alone
// publication) without clearing the CRITICAL standards.
//
// 13 standards (from the founder's brief). Each maps to a structural predicate
// over the draft artifact so the gate is objective and auditable. Standards that
// don't apply to an artifact type pass with an "n/a" note. CRITICAL standards
// must all pass for the artifact to be submittable.
// =============================================================================
import { QualityCheck, QualityReport } from '@/types/product';

interface CheckInput {
  artifact_type: string;
  title: string;
  summary?: string;
  program?: string;
  competencies: string[];
  payload: Record<string, any>;
  quality_score?: number;
}

interface StandardDef {
  key: string;
  label: string;
  critical: boolean;
  evaluate: (a: CheckInput, blob: string) => { passed: boolean; note: string };
}

const has = (blob: string, re: RegExp) => re.test(blob);

export const ALADIAH_QUALITY_STANDARDS: StandardDef[] = [
  {
    key: 'world_class_quality',
    label: 'World-class quality',
    critical: true,
    evaluate: (a) => ({
      passed: (a.quality_score ?? 0) >= 75,
      note: `Quality score ${a.quality_score ?? 0}/100 (≥75 required).`,
    }),
  },
  {
    key: 'ai_integrated',
    label: 'AI integrated start to finish',
    critical: true,
    evaluate: (a, blob) => ({
      passed: Boolean(a.payload?.ai_integration) || has(blob, /\bAI\b|artificial intelligence/i),
      note: a.payload?.ai_integration ? 'AI-integration element present.' : 'No AI-integration element found.',
    }),
  },
  {
    key: 'practical_real_world',
    label: 'Practical real-world application',
    critical: false,
    evaluate: (a, blob) => ({
      passed: ['lab', 'project', 'simulation'].includes(a.artifact_type) || has(blob, /practice|real-world|hands-on|apply|scenario/i),
      note: 'Includes practical / real-world application.',
    }),
  },
  {
    key: 'career_transformation_focused',
    label: 'Career transformation focused',
    critical: true,
    evaluate: (a, blob) => ({
      passed: has(blob, /career|employab|job|hired|interview|transformation/i),
      note: 'References career outcomes / employability.',
    }),
  },
  {
    key: 'clear_lesson_structure',
    label: 'Clear lesson structure',
    critical: false,
    evaluate: (a) => {
      if (a.artifact_type !== 'module') return { passed: true, note: 'n/a for this type.' };
      const ok = Array.isArray(a.payload?.objectives) && a.payload.objectives.length >= 2 && Array.isArray(a.payload?.lessons) && a.payload.lessons.length >= 2;
      return { passed: ok, note: ok ? 'Objectives + structured lessons present.' : 'Module needs ≥2 objectives and ≥2 lessons.' };
    },
  },
  {
    key: 'strong_quizzes',
    label: 'Strong quizzes',
    critical: false,
    evaluate: (a) => {
      if (a.artifact_type !== 'quiz') return { passed: true, note: 'n/a for this type.' };
      const qs = a.payload?.questions ?? [];
      const ok =
        qs.length >= 4 &&
        qs.every(
          (q: any) =>
            Array.isArray(q.options) &&
            q.options.length >= 3 &&
            typeof q.correct_index === 'number' &&
            q.correct_index >= 0 &&
            q.correct_index < q.options.length &&
            typeof q.competency === 'string' &&
            q.competency.length > 0 &&
            // canon: option text must NOT carry A)/B) prefixes
            q.options.every((o: string) => !/^[A-D]\)/.test(o.trim())) &&
            typeof q.explanation === 'string' && q.explanation.length > 0,
        );
      return { passed: ok, note: ok ? `${qs.length} well-formed, competency-tagged questions.` : 'Quiz must have ≥4 tagged questions, valid answers, explanations, and no letter-prefixed options.' };
    },
  },
  {
    key: 'strong_simulations',
    label: 'Strong simulations',
    critical: false,
    evaluate: (a) => {
      if (a.artifact_type !== 'simulation') return { passed: true, note: 'n/a for this type.' };
      const dp = a.payload?.decision_points ?? [];
      const rubric = a.payload?.scoring_rubric ?? [];
      const ok = dp.length >= 2 && rubric.length >= 1 && dp.every((d: any) => d.competency);
      return { passed: ok, note: ok ? 'Decision points + competency-mapped rubric present.' : 'Simulation needs ≥2 decision points and a competency-mapped rubric.' };
    },
  },
  {
    key: 'hands_on_labs',
    label: 'Hands-on labs',
    critical: false,
    evaluate: (a) => {
      if (a.artifact_type !== 'lab') return { passed: true, note: 'n/a for this type.' };
      const ok = Array.isArray(a.payload?.steps) && a.payload.steps.length >= 3 && Boolean(a.payload?.deliverable);
      return { passed: ok, note: ok ? 'Stepwise lab with a deliverable.' : 'Lab needs ≥3 steps and a deliverable.' };
    },
  },
  {
    key: 'student_friendly_language',
    label: 'Student-friendly language',
    critical: false,
    evaluate: (a) => ({
      passed: Boolean(a.summary && a.summary.length > 0),
      note: 'Has an accessible summary.',
    }),
  },
  {
    key: 'professional_tone',
    label: 'Professional tone',
    critical: false,
    evaluate: (a, blob) => ({
      passed: !has(blob, /\b(lol|idk|gonna|wanna|sucks|stupid)\b/i),
      note: 'No unprofessional/casual language detected.',
    }),
  },
  {
    key: 'job_market_relevance',
    label: 'Job-market relevance',
    critical: false,
    evaluate: (a) => ({
      passed: a.competencies.length > 0 && Boolean(a.program),
      note: 'Mapped to a program and competencies.',
    }),
  },
  {
    key: 'interview_readiness',
    label: 'Interview readiness',
    critical: false,
    evaluate: (a, blob) => ({
      passed: has(blob, /interview/i) || ['project', 'learning_path', 'quiz'].includes(a.artifact_type) || Boolean(a.payload?.interview_ready),
      note: 'Builds toward interview readiness.',
    }),
  },
  {
    key: 'measurable_competency_outcomes',
    label: 'Measurable competency outcomes',
    critical: true,
    evaluate: (a, blob) => ({
      passed: a.competencies.length > 0 && has(blob, /competency/i),
      note: a.competencies.length > 0 ? `Mapped to ${a.competencies.length} competency slug(s).` : 'No competency mapping — cannot measure outcomes.',
    }),
  },
];

/** Run the full Aladiah Quality Standard checklist over a draft artifact. */
export function runQualityChecks(a: CheckInput): QualityReport {
  const blob = `${a.title} ${a.summary ?? ''} ${JSON.stringify(a.payload ?? {})}`;
  const checks: QualityCheck[] = ALADIAH_QUALITY_STANDARDS.map((s) => {
    const { passed, note } = s.evaluate(a, blob);
    return { key: s.key, label: s.label, passed, critical: s.critical, note };
  });
  const criticalFailed = checks.filter((c) => c.critical && !c.passed);
  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const passed = criticalFailed.length === 0;
  const summary = passed
    ? `Passed the Aladiah Quality Standard (${passedCount}/${checks.length} checks, score ${score}). Ready for the Founder Approval Queue.`
    : `Held as draft — failed ${criticalFailed.length} critical standard(s): ${criticalFailed.map((c) => c.label).join(', ')}.`;
  return { passed, score, checks, summary };
}
