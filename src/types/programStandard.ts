// =============================================================================
// Aladiah Program Standard v1.0 — shared types
// The canonical structure every Aladiah program must follow.
// =============================================================================

export const PROGRAM_STANDARD_VERSION = 'v1.0';

export type ArchitectureId =
  | 'module'
  | 'lesson'
  | 'assessment'
  | 'simulation'
  | 'lab'
  | 'portfolio'
  | 'capstone'
  | 'certification'
  | 'interview'
  | 'career_transformation';

export interface ArchitectureDef {
  id: ArchitectureId;
  name: string;
  components: string[];
  weight: number;     // contribution to the Curriculum Excellence Score (sum = 100)
  threshold: number;  // minimum world-class score for this dimension
  critical: boolean;  // must meet threshold for the program to be world-class
}

export interface DimensionScore {
  id: ArchitectureId;
  name: string;
  score: number;       // 0-100
  threshold: number;
  met: boolean;
  critical: boolean;
}

export interface StandardEvaluation {
  version: string;
  ces: number;               // Curriculum Excellence Score (0-100)
  worldClass: boolean;       // CES >= WORLD_CLASS_CES and all critical dims met
  dimensions: DimensionScore[];
  failedCritical: string[];
}

// ---- Program Factory -------------------------------------------------------
export interface ProgramFactorySpec {
  key: string;
  name: string;
  programKey: string;        // competency-taxonomy program key (e.g. 'scrum')
  moduleCount: number;
  competencies: string[];    // Axis-1 slugs the program covers
  description: string;
}
