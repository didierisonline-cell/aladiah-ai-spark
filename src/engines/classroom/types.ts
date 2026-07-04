// ── Classroom Engine Types ────────────────────────────────────────────────────
// Program-agnostic. Scrum-specific content lives in the page/content layer.

export interface ClassroomProgram {
  id: string;
  title: string;
  shortTitle: string;
}

export interface ClassroomLesson {
  index: number;
  title: string;
  description: string;
}

export interface ClassroomModule {
  index: number;
  title: string;
  lessons: ClassroomLesson[];
}

export interface StudentContext {
  name: string;
  progress: number;         // 0–100
  language: string;         // 'English' | 'Spanish' | ...
  languageCode: string;     // 'en' | 'es' | ...
}

// Board / AVIS Canvas
export interface CanvasStep {
  index: number;
  label: string;           // short label for dot/indicator
}

export interface CanvasContent {
  programId: string;
  lessonId: string;
  title: string;
  subtitle: string;
  totalSteps: number;
  steps: CanvasStep[];
  renderDiagram: (step: number) => React.ReactNode;
}

// Lesson Orchestrator state
export interface LessonState {
  currentModuleIndex: number;
  currentLessonIndex: number;
  boardStep: number;
  totalSteps: number;
}

// Voice status
export type VoiceStatus = 'idle' | 'connecting' | 'speaking' | 'listening' | 'disconnecting';

// Interaction — voice commands and prompt intents
export interface VoiceCommand {
  label: string;
  intent: string;
}

export interface StudentPrompt {
  label: string;
  intent: string;
}

// Integration event bus for future voice→board sync
export type ClassroomEvent =
  | { type: 'BOARD_NEXT' }
  | { type: 'BOARD_PREV' }
  | { type: 'BOARD_RESET' }
  | { type: 'BOARD_GOTO'; step: number }
  | { type: 'LESSON_NEXT' }
  | { type: 'LESSON_PREV' }
  | { type: 'QUIZ_START' }
  | { type: 'SIMULATION_START' }
  | { type: 'VOICE_COMMAND'; intent: string }
  | { type: 'STUDENT_PROMPT'; intent: string };
