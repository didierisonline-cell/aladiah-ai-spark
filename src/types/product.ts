// =============================================================================
// Aladiah Product Builder Agent — shared types
// Mirrors migration 20260610160000_product_builder_agent.sql.
// =============================================================================

export const PRODUCT_AGENT_SLUG = 'product-builder';

export type ArtifactType =
  | 'module'
  | 'quiz'
  | 'simulation'
  | 'lab'
  | 'project'
  | 'learning_path'
  | 'assessment'
  | 'interview_prep'
  | 'career_plan'
  | 'employer_alignment'
  | 'ai_readiness'
  | 'outcome_plan';

// ---- Career Transformation engines + outcomes ------------------------------
// The Product Builder is a Career Transformation Factory of ten engines.
// See docs/agents/product-builder/CAREER_TRANSFORMATION_ARCHITECTURE.md.

export type EngineId =
  | 'competency'
  | 'assessment'
  | 'simulation'
  | 'lab'
  | 'project'
  | 'interview_prep'
  | 'career_transformation'
  | 'employer_alignment'
  | 'ai_integration'
  | 'student_outcome';

/** The six transformation outcomes the factory optimizes for (not completion). */
export type TransformationOutcome =
  | 'employment'
  | 'promotion'
  | 'salary_growth'
  | 'leadership_readiness'
  | 'ai_readiness'
  | 'competency_mastery';

export interface EngineDef {
  id: EngineId;
  name: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  qualityStandards: string[];
  kpis: string[];
  approval: string;
  artifactTypes: ArtifactType[];
  targetOutcomes: TransformationOutcome[];
}

export interface ProductOutcome {
  id: string;
  metric: TransformationOutcome;
  program: string | null;
  period: string;
  value: number;
  target: number | null;
  unit: string | null;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ArtifactStatus =
  | 'draft'
  | 'qa_review'
  | 'qa_rejected'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'published';

export type GapType =
  | 'missing_module'
  | 'weak_coverage'
  | 'no_assessment'
  | 'no_simulation'
  | 'outdated';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type RecType =
  | 'course_improvement'
  | 'new_program'
  | 'learning_path'
  | 'outcome_improvement';

// ---- artifact payload shapes -----------------------------------------------

export interface ModulePayload {
  objectives: string[];
  lessons: { title: string; summary: string; competency: string }[];
  estimated_minutes: number;
}

/** A quiz question. NOTE: option text MUST NOT include A)/B)/C)/D) prefixes —
 *  the quiz UI auto-prefixes via String.fromCharCode(65+idx) (CLAUDE.md). */
export interface QuizQuestion {
  question: string;
  options: string[]; // no letter prefixes
  correct_index: number;
  competency: string; // exactly one Axis-1 slug (never null)
  topic: string;
  explanation: string;
}
export interface QuizPayload {
  questions: QuizQuestion[];
  pass_threshold: number;
}

export interface SimulationPayload {
  scenario_type: 'crisis' | 'stakeholder' | 'leadership' | 'communication' | 'business';
  scenario: string;
  roles: string[];
  decision_points: { prompt: string; options: string[]; competency: string }[];
  scoring_rubric: { competency: string; criteria: string }[];
}

export interface LabPayload {
  objective: string;
  steps: string[];
  deliverable: string;
  tools: string[];
}

export interface ProjectPayload {
  brief: string;
  requirements: string[];
  rubric: { competency: string; criteria: string }[];
}

export interface LearningPathPayload {
  outcome: string;
  steps: { order: number; type: ArtifactType; title: string; competency: string }[];
}

export interface ProductArtifact {
  id: string;
  agent_slug: string;
  artifact_type: ArtifactType;
  title: string;
  summary: string | null;
  program: string | null;
  course_ref: string | null;
  module_ref: string | null;
  competencies: string[];
  engine: string | null;
  target_outcomes: string[];
  outcome_signals: Record<string, unknown>;
  payload: Record<string, unknown>;
  quality_score: number | null;
  status: ArtifactStatus;
  source: string | null;
  metadata: Record<string, unknown>;
  approved_by: string | null;
  approved_at: string | null;
  created_by_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductGap {
  id: string;
  program: string | null;
  competency: string | null;
  gap_type: GapType;
  severity: Severity;
  description: string | null;
  recommendation: string | null;
  status: 'open' | 'addressed' | 'dismissed';
  related_artifact_id: string | null;
  created_by_agent: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProductRecommendation {
  id: string;
  rec_type: RecType;
  title: string;
  rationale: string | null;
  priority: 'low' | 'medium' | 'high';
  program: string | null;
  status: 'pending' | 'accepted' | 'delegated' | 'done' | 'dismissed';
  payload: Record<string, unknown>;
  created_by_agent: string | null;
  created_at: string;
  updated_at: string;
}

// ---- generation inputs -----------------------------------------------------
export interface GenerateModuleInput { program: string; competency: string; topic?: string; }
export interface GenerateQuizInput { program: string; competency: string; questionCount?: number; }
export interface GenerateSimulationInput { program: string; scenarioType?: SimulationPayload['scenario_type']; topic?: string; }
export interface GenerateLabInput { program: string; topic: string; }
export interface GenerateProjectInput { program: string; topic?: string; }
export interface GenerateLearningPathInput { program: string; outcome?: string; }

// ---- dashboard rollups -----------------------------------------------------
export interface ProductStats {
  totalArtifacts: number;
  pendingApproval: number;
  approved: number;
  openGaps: number;
  criticalGaps: number;
  recommendations: number;
  byType: { type: ArtifactType; count: number }[];
  byEngine: { engine: string; count: number }[];
  coverage: { competency: string; label: string; questions: number; status: 'covered' | 'weak' | 'missing' }[];
  outcomes: ProductOutcome[];
}

export type ProductTaskKind =
  | 'detect_gaps'
  | 'generate_module'
  | 'generate_quiz'
  | 'generate_simulation'
  | 'generate_lab'
  | 'generate_project'
  | 'generate_learning_path'
  | 'recommend_improvements'
  | 'overnight_improvement';

// ---- Aladiah Quality Standard ----------------------------------------------
// Every generated artifact must pass the quality gate before it can enter the
// Founder Approval Queue (status 'pending_approval'). Failing artifacts remain
// 'draft' with their report attached. Nothing is ever auto-published.

export interface QualityCheck {
  key: string;
  label: string;
  passed: boolean;
  critical: boolean;
  note: string;
}

export interface QualityReport {
  passed: boolean;
  score: number; // 0-100
  checks: QualityCheck[];
  summary: string;
}

export interface OvernightRunResult {
  program: string;
  areasSelected: number;
  generated: number;
  passedToApproval: number;
  heldAsDraft: number;
  artifactIds: string[];
}
