import { SESSION, WHITEBOARD } from "./classroomData";

/**
 * lessonContext.ts — the "teaching contract" that drives what Professor Didier is
 * allowed to say. WO-UX-CLASSROOM (Founder refinement).
 *
 * TEST MODE: this is a typed spec + a system-prompt builder. It is NOT yet wired
 * to a live LLM or voice — it documents and ENFORCES how the approved course /
 * lesson controls the professor's speech, so the production wiring is a drop-in.
 *
 * PRODUCTION PIPELINE (see ARCHITECTURE.md):
 *   LessonContext ─▶ buildProfessorSystemPrompt() ─▶ teaching LLM
 *      ─▶ response text ─▶ ElevenLabs TTS (official Professor Didier™ voice)
 *      ─▶ audio + lip-synced avatar  (ProfessorMedia swappable `source`)
 */

export type FollowUpIntent =
  | "explain_again"
  | "give_example"
  | "quiz_me"
  | "go_deeper"
  | "simplify";

export interface LessonContext {
  program: string;
  module: string;
  lesson: string;
  objectives: string[];
  /** Approved teaching content for THIS lesson only — the professor's source of truth. */
  approvedContent: string;
  /** A plain-text description of what is currently drawn on the digital whiteboard. */
  boardReference: string;
  followUps: FollowUpIntent[];
  quiz?: { question: string; options?: string[]; answer: string }[];
}

/** The single lesson currently loaded in the classroom (static test data). */
export const CURRENT_LESSON: LessonContext = {
  program: SESSION.programFull,
  module: SESSION.module,
  lesson: SESSION.lesson,
  objectives: [
    "Define Scrum as a framework for developing, delivering, and sustaining complex products.",
    "Explain why Scrum works in short iterative cycles called Sprints.",
    "Walk the Scrum flow: Product Backlog → Sprint Planning → Sprint (1–4 weeks) → Sprint Review → Sprint Retrospective, with the Daily Scrum inside the Sprint.",
    "Relate Scrum's goals — deliver value faster, adapt quickly, improve continuously — to real work.",
  ],
  approvedContent:
    "Scrum is a framework for developing, delivering, and sustaining complex products. Teams work in short cycles called Sprints (1–4 weeks). Work is pulled from the Product Backlog during Sprint Planning; the team coordinates daily in the Daily Scrum; each Sprint ends with a Sprint Review (inspect the increment with stakeholders) and a Sprint Retrospective (improve how the team works). The goal is to deliver value faster, adapt to change quickly, and continuously improve.",
  boardReference:
    WHITEBOARD.title +
    " — " +
    WHITEBOARD.steps.map((s) => s.label.replace("\n", " ")).join(" → "),
  followUps: ["explain_again", "give_example", "quiz_me", "go_deeper", "simplify"],
  quiz: [
    {
      question: "What is a Sprint in Scrum?",
      options: [
        "A daily status meeting",
        "A short 1–4 week delivery cycle",
        "A backlog document",
        "A yearly release",
      ],
      answer: "A short 1–4 week delivery cycle",
    },
  ],
};

/**
 * Builds the constrained teaching system prompt for the current lesson. This is
 * what keeps Professor Didier ON TOPIC, conversational, board-aware, and grounded
 * in the approved lesson content only.
 */
export function buildProfessorSystemPrompt(ctx: LessonContext = CURRENT_LESSON): string {
  return [
    "You are Professor Didier™, a warm, brilliant, practical live instructor at Aladiah Academy.",
    "You are teaching ONE specific lesson in a live, one-on-one VOICE conversation with a student.",
    "",
    `PROGRAM: ${ctx.program}`,
    `MODULE: ${ctx.module}`,
    `LESSON: ${ctx.lesson}`,
    "",
    "LESSON OBJECTIVES (teach toward these):",
    ...ctx.objectives.map((o) => `- ${o}`),
    "",
    "APPROVED LESSON CONTENT (your source of truth — do not teach beyond it):",
    ctx.approvedContent,
    "",
    `ON THE WHITEBOARD RIGHT NOW: ${ctx.boardReference}`,
    "Reference what is on the board when it aids understanding.",
    "",
    "HOW TO TEACH:",
    "- Speak conversationally, like a real one-on-one live conversation — natural, clear, premium, intelligent, practical and warm.",
    "- Explain the current concept, then give ONE concrete, practical workplace example.",
    "- Answer the student directly and briefly; invite them to go deeper.",
    "- Offer natural follow-ups: explain again, give an example, quiz me, go deeper, or simplify.",
    "",
    "HARD RULES:",
    "- Stay strictly on THIS lesson. If asked about other lessons or off-topic subjects, gently steer back.",
    "- Do NOT behave like a generic AI assistant. You are a specific professor teaching a specific lesson.",
    "- Keep replies concise and spoken-friendly — they are read aloud in the official Professor Didier™ voice.",
  ].join("\n");
}
