/**
 * classroomData.ts — STATIC / TEST-ONLY data for the AI Classroom Portal preview.
 *
 * WO-UX-CLASSROOM-001 — this route is a Founder-review prototype. NOTHING here is
 * wired to Supabase / Stripe / ElevenLabs / course-progress. All values are hardcoded
 * mock data so the UI can be perfected before any dynamic wiring.
 */

export interface ClassFlowItem {
  id: string;
  index: number;
  title: string;
  active?: boolean;
  complete?: boolean;
}

export interface SessionContextRow {
  label: string;
  value: string;
}

export interface WhiteboardStep {
  id: string;
  label: string;
  /** visual kind drives which sticky/graphic renders under the label */
  kind: "backlog" | "planning" | "sprint" | "review" | "retro";
}

export const SESSION = {
  program: "AI-Powered Scrum Master",
  programFull: "AI-Powered Scrum Master Certification",
  module: "1. Foundations of Scrum",
  lesson: "1.1 What is Scrum?",
  progress: 10, // percent
  timer: "00:07:32",
  professorName: "Professor Didier™",
  professorTitle: "AI Professor",
};

export const CLASS_FLOW: ClassFlowItem[] = [
  { id: "cf1", index: 1, title: "What is Scrum?", active: true },
  { id: "cf2", index: 2, title: "Scrum Values" },
  { id: "cf3", index: 3, title: "Scrum Roles" },
  { id: "cf4", index: 4, title: "Scrum Events" },
  { id: "cf5", index: 5, title: "Scrum Artifacts" },
];

export const SESSION_CONTEXT: SessionContextRow[] = [
  { label: "Program", value: SESSION.program },
  { label: "Module", value: SESSION.module },
  { label: "Lesson", value: SESSION.lesson },
];

export const QUICK_VOICE_COMMANDS: string[] = [
  "Repeat that",
  "Explain another way",
  "Show an example",
  "Quiz me on this",
  "What should I focus on?",
];

export const WHITEBOARD = {
  title: "What is Scrum?",
  definition:
    "Scrum is a framework for developing, delivering, and sustaining complex products.",
  emphasis: "framework",
  steps: [
    { id: "wb1", label: "Product\nBacklog", kind: "backlog" },
    { id: "wb2", label: "Sprint\nPlanning", kind: "planning" },
    { id: "wb3", label: "Sprint\n1–4 Weeks", kind: "sprint" },
    { id: "wb4", label: "Sprint\nReview", kind: "review" },
    { id: "wb5", label: "Sprint\nRetrospective", kind: "retro" },
  ] as WhiteboardStep[],
  dailyScrum: "Daily\nScrum",
};

/** Transcript lines — the "Professor is speaking" explanation card. */
export const TRANSCRIPT = {
  speaker: "Professor Didier:",
  lines: [
    "So here’s the heart of Scrum.",
    "We work in short cycles called Sprints.",
    "The goal is to deliver value faster,",
    "adapt quickly, and improve continuously.",
    "Let me draw this for you.",
  ],
};

export const SUGGESTED_PROMPTS: string[] = [
  "Explain Sprint Planning in detail",
  "Give me a real-world example",
  "Quiz me on Scrum Roles",
  "What’s the difference between Scrum and Agile?",
  "Show me a diagram",
];
